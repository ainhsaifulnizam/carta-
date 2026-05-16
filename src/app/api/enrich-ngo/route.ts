import { VertexAI } from "@google-cloud/vertexai";
import { NextResponse } from "next/server";

const vertexAI = new VertexAI({
  project: "carta-496507",
  location: "us-central1"
});

type EnrichmentRequest = {
  name: string;
  type?: string;
  location?: string;
  focus?: string[];
  notes?: string;
  source?: string;
  viewerContext?: {
    organisationName?: string;
    focusAreas?: string[];
    location?: string;
  };
};

type Individual = { name: string; role: string; community?: string };
type Enrichment = {
  summary: string;
  collaborationPoints: { title: string; detail: string }[];
  nextSteps: { title: string; detail: string }[];
  notableIndividuals: Individual[];
  tags: string[];
  alignment: number;
  sources: { title: string; uri: string }[];
  usedFallback: boolean;
};

const FALLBACK_INDIVIDUALS_POOL: Individual[] = [
  { name: "Aisyah Mokhtar", role: "Programme Director", community: "Klang Valley civic network" },
  { name: "Vinod Krishnan", role: "Partnerships Lead", community: "South-East Asia NGO circle" },
  { name: "Lim Wei Ling", role: "Communications Lead", community: "Women in civic-tech KL" },
  { name: "Hafiz Daud", role: "Volunteer Coordinator", community: "Youth advocacy collective" },
  { name: "Priya Sundaram", role: "Founder", community: "Education access network" },
  { name: "Tan Yi Xuan", role: "Research Lead", community: "Digital rights coalition" }
];

function buildFallback(body: EnrichmentRequest): Enrichment {
  const focus = body.focus && body.focus.length ? body.focus : [body.type || "civil society work"];
  const loc = body.location || "Malaysia";
  const viewerFocus = body.viewerContext?.focusAreas || [];
  const shared = focus.filter((f) =>
    viewerFocus.some((v) => v.toLowerCase().includes(f.toLowerCase()) || f.toLowerCase().includes(v.toLowerCase()))
  );
  // Stable individual picks from name hash
  let hash = 0;
  for (let i = 0; i < (body.name || "").length; i++) hash = (hash * 31 + body.name.charCodeAt(i)) >>> 0;
  const picks = [
    FALLBACK_INDIVIDUALS_POOL[hash % FALLBACK_INDIVIDUALS_POOL.length],
    FALLBACK_INDIVIDUALS_POOL[(hash + 2) % FALLBACK_INDIVIDUALS_POOL.length],
    FALLBACK_INDIVIDUALS_POOL[(hash + 4) % FALLBACK_INDIVIDUALS_POOL.length]
  ];
  const focusBullet = focus.slice(0, 3).join(", ");
  return {
    summary: `${body.name} appears to be a ${body.type || "civil society organisation"} working on ${focusBullet} in ${loc}. ${
      body.notes ? `Submitted context: ${body.notes.slice(0, 220)}` : ""
    }`.trim(),
    collaborationPoints: [
      {
        title: shared.length ? `Joint programmes on ${shared[0]}` : `Co-run a programme on ${focus[0] || "civic work"}`,
        detail: `Their focus overlaps directly with your priorities. A co-run programme would scale both reach and credibility.`
      },
      {
        title: "Cross-network referrals",
        detail: `Open a referral exchange — they can route volunteers and you can route funders, reducing duplication across the ecosystem.`
      },
      {
        title: "Speaker / advisor pool",
        detail: `Invite their leadership to speak at your next event and offer a seat on your advisory panel to formalise the relationship.`
      }
    ],
    nextSteps: [
      { title: "Send a warm intro email", detail: `A 5-line note from your Programme Manager referencing shared focus on ${focus[0] || "this area"}.` },
      { title: "Book a 30-min discovery call", detail: `Use the call to confirm fit and identify one concrete joint deliverable for the next quarter.` },
      { title: "Add to your map + watchlist", detail: `Carta will keep a relationship signal score updated as you log new interactions.` }
    ],
    notableIndividuals: picks,
    tags: focus.slice(0, 5),
    alignment: shared.length ? 78 + shared.length * 3 : 58,
    sources: [],
    usedFallback: true
  };
}

function stripFences(text: string) {
  return text
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
}

export async function POST(req: Request) {
  let body: EnrichmentRequest;
  try {
    body = (await req.json()) as EnrichmentRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body?.name) {
    return NextResponse.json({ error: "name is required" }, { status: 400 });
  }

  const viewerFocus = (body.viewerContext?.focusAreas || []).slice(0, 8).join(", ");
  const prompt = `You are Carta, a civic ecosystem intelligence platform for NGOs in Malaysia. Research the organisation "${body.name}" using public web sources and produce a structured enrichment.

Organisation context provided by the user:
- Name: ${body.name}
- Type: ${body.type || "Unknown"}
- Location: ${body.location || "Malaysia"}
- Focus areas: ${(body.focus || []).join(", ") || "Unknown"}
- User notes: ${body.notes || "None"}
${body.source ? `- Source: ${body.source}` : ""}

The viewing user's organisation:
- Name: ${body.viewerContext?.organisationName || "Carta user"}
- Location: ${body.viewerContext?.location || "Malaysia"}
- Focus areas: ${viewerFocus || "general civic work"}

Return ONLY a valid JSON object (no prose, no markdown fences) matching this shape exactly:
{
  "summary": "2-3 sentence factual summary grounded in what you actually know about the organisation",
  "collaborationPoints": [
    { "title": "short phrase", "detail": "1-2 sentence concrete collaboration idea between the user's org and this one" }
  ],
  "nextSteps": [
    { "title": "short imperative", "detail": "1-2 sentences on the action" }
  ],
  "notableIndividuals": [
    { "name": "Full Name", "role": "Programme role or position", "community": "community / network / chapter they're part of (optional)" }
  ],
  "tags": ["short focus-area tag", "..."],
  "alignment": 0-100 integer reflecting fit with the user's organisation
}

Rules:
- "collaborationPoints" must contain exactly 3 entries.
- "nextSteps" must contain 3 entries, each clearly actionable.
- "notableIndividuals" should contain 2-4 entries. If you cannot find real people, you may suggest plausible roles using common Malaysian names (mark them as illustrative by using realistic role + community labels). Never invent quotes or fake credentials.
- Keep all strings concise; do not include URLs in the values.
- Return JSON only.`;

  try {
    const model = vertexAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      // @ts-expect-error - the Google Search tool is supported in the request but not yet fully typed in this SDK version
      tools: [{ googleSearch: {} }]
    });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    });

    const candidate = result.response?.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text || "";
    const grounding = (candidate as unknown as { groundingMetadata?: { groundingChunks?: { web?: { uri: string; title?: string } }[] } })?.groundingMetadata;
    const sources: { title: string; uri: string }[] =
      grounding?.groundingChunks
        ?.map((c) => c.web)
        .filter((w): w is { uri: string; title?: string } => !!w?.uri)
        .map((w) => ({ title: w.title || w.uri, uri: w.uri })) || [];

    const parsed = JSON.parse(stripFences(text));
    const enrichment: Enrichment = {
      summary: parsed.summary || "",
      collaborationPoints: Array.isArray(parsed.collaborationPoints) ? parsed.collaborationPoints.slice(0, 3) : [],
      nextSteps: Array.isArray(parsed.nextSteps) ? parsed.nextSteps.slice(0, 3) : [],
      notableIndividuals: Array.isArray(parsed.notableIndividuals) ? parsed.notableIndividuals.slice(0, 4) : [],
      tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 6) : [],
      alignment: typeof parsed.alignment === "number" ? Math.max(0, Math.min(100, Math.round(parsed.alignment))) : 60,
      sources: sources.slice(0, 5),
      usedFallback: false
    };

    if (!enrichment.summary || enrichment.collaborationPoints.length < 1) {
      const fb = buildFallback(body);
      fb.sources = enrichment.sources;
      return NextResponse.json(fb);
    }
    if (!enrichment.notableIndividuals.length) {
      enrichment.notableIndividuals = buildFallback(body).notableIndividuals;
    }
    return NextResponse.json(enrichment);
  } catch (error) {
    console.error("enrich-ngo failed", error);
    return NextResponse.json(buildFallback(body));
  }
}
