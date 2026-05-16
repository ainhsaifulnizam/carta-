import { VertexAI } from "@google-cloud/vertexai";
import { NextResponse } from "next/server";

const vertexAI = new VertexAI({
  project: "carta-496507",
  location: "us-central1"
});

const generativeModel = vertexAI.getGenerativeModel({
  model: "gemini-2.5-flash-lite"
});

type Candidate = {
  id: string;
  name: string;
  category: string;
  role?: string;
  organisation?: string;
  location?: string;
  interests?: string[];
  seeking?: string[];
  offering?: string[];
  summary?: string;
};

type EventPayload = {
  title: string;
  hostOrganisation?: string;
  format?: string;
  location?: string;
  description?: string;
  audience?: string;
  needs?: string[];
};

type Scored = { id: string; score: number; reasoning: string };

function stripJsonFences(text: string) {
  return text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

function fallbackScore(candidate: Candidate, event: EventPayload): Scored {
  const haystack = [
    candidate.summary || "",
    (candidate.interests || []).join(" "),
    (candidate.seeking || []).join(" "),
    (candidate.offering || []).join(" "),
    candidate.role || "",
    candidate.organisation || ""
  ]
    .join(" ")
    .toLowerCase();
  const eventText = `${event.title} ${event.description || ""} ${(event.needs || []).join(" ")}`.toLowerCase();
  const tokens = Array.from(new Set(eventText.split(/\W+/).filter((t) => t.length > 3)));
  const matches = tokens.filter((t) => haystack.includes(t)).length;
  const score = Math.min(95, 35 + matches * 8);
  return {
    id: candidate.id,
    score,
    reasoning: `${candidate.name} works on ${(candidate.interests || ["civic causes"]).slice(0, 2).join(" and ")}; potentially relevant to "${event.title}".`
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const event = body.event as EventPayload | undefined;
    const candidates = body.candidates as Candidate[] | undefined;

    if (!event || !event.title) {
      return NextResponse.json({ error: "event with at least a title is required" }, { status: 400 });
    }
    if (!Array.isArray(candidates) || candidates.length === 0) {
      return NextResponse.json({ error: "candidates array is required" }, { status: 400 });
    }

    const systemInstruction = {
      role: "system",
      parts: [
        {
          text: "You are Carta's recommendation engine for the Malaysian civic ecosystem. You rank potential funders, NGO partners, volunteers, mentors, speakers, and CSR partners against an event brief. Reply with strict JSON only — no prose, no markdown fences."
        }
      ]
    };

    const userPrompt = `Event brief:\n${JSON.stringify(event, null, 2)}\n\nCandidate pool:\n${JSON.stringify(candidates, null, 2)}\n\nReturn JSON array. For every candidate output one object with fields:\n- id: candidate.id (string)\n- score: integer 0-100 (relevance to event)\n- reasoning: 1-2 plain-English sentences explaining the match, mentioning concrete overlap (interests, location, seeking/offering, role).\n\nSort descending by score. Use the candidate's category and the event's needs to drive the score. Do not invent candidates. Output JSON array only.`;

    const result = await generativeModel.generateContent({
      systemInstruction,
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      generationConfig: { responseMimeType: "application/json", temperature: 0.4 }
    });

    let scored: Scored[] = [];
    let usedFallback = false;
    const rawText = result.response.candidates?.[0]?.content?.parts?.[0]?.text || "";

    if (rawText) {
      try {
        const parsed = JSON.parse(stripJsonFences(rawText));
        if (Array.isArray(parsed)) {
          scored = parsed
            .filter((row) => row && typeof row.id === "string")
            .map((row) => ({
              id: row.id,
              score: Math.max(0, Math.min(100, Math.round(Number(row.score) || 0))),
              reasoning: typeof row.reasoning === "string" ? row.reasoning : ""
            }));
        }
      } catch (err) {
        console.warn("Failed to parse Gemini JSON, falling back to heuristic", err);
      }
    }

    if (scored.length === 0) {
      usedFallback = true;
      scored = candidates.map((c) => fallbackScore(c, event));
    }

    const byId = new Map(scored.map((row) => [row.id, row]));
    const recommendations = candidates
      .map((candidate) => {
        const match = byId.get(candidate.id) || fallbackScore(candidate, event);
        return { candidate, score: match.score, reasoning: match.reasoning };
      })
      .sort((a, b) => b.score - a.score);

    return NextResponse.json({ recommendations, usedFallback });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Error generating recommendations:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
