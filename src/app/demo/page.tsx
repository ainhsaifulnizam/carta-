"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/AuthProvider";

type CandidateCategory = "Funder" | "NGO Partner" | "Volunteer" | "Mentor" | "CSR Partner" | "Speaker";

type Candidate = {
  id: string;
  name: string;
  category: CandidateCategory;
  role: string;
  organisation: string;
  location: string;
  interests: string[];
  seeking: string[];
  offering: string[];
  summary: string;
};

type Recommendation = {
  candidate: Candidate;
  score: number;
  reasoning: string;
};

type EventDraft = {
  title: string;
  hostOrganisation: string;
  format: string;
  location: string;
  description: string;
  audience: string;
  needs: string[];
};

const CANDIDATE_POOL: Candidate[] = [
  {
    id: "c_telco_foundation",
    name: "Daniel Lim",
    category: "Funder",
    role: "CSR Lead",
    organisation: "Telco Foundation Malaysia",
    location: "Kuala Lumpur, Malaysia",
    interests: ["Digital rights / online safety", "Education", "Civic technology"],
    seeking: ["NGO collaborators", "Grant applicants"],
    offering: ["Funding", "Technical tools", "Mentorship"],
    summary:
      "Manages a RM 2M digital inclusion mandate; actively scouting youth digital-safety projects in the Klang Valley."
  },
  {
    id: "c_yayasan_hasanah",
    name: "Yayasan Hasanah",
    category: "Funder",
    role: "Foundation",
    organisation: "Yayasan Hasanah",
    location: "Kuala Lumpur, Malaysia",
    interests: ["Education", "Community development", "Climate / environment"],
    seeking: ["Grant applicants", "Local implementing partners"],
    offering: ["Funding", "Research/data"],
    summary:
      "National grantmaker funding civil-society programmes; prefers measurable impact and Malaysian NGO partners."
  },
  {
    id: "c_petronas_csr",
    name: "Nadia Yusof",
    category: "CSR Partner",
    role: "Sustainability Manager",
    organisation: "Petronas CSR",
    location: "Kuala Lumpur, Malaysia",
    interests: ["Education", "Youth empowerment", "Climate / environment"],
    seeking: ["NGO collaborators", "Event co-hosts"],
    offering: ["Funding", "Venue/event partnership", "Training"],
    summary:
      "Looking to co-brand convenings on youth STEM and digital safety; can offer venue, funding, and speakers."
  },
  {
    id: "c_maybank_csr",
    name: "Faridah Ahmad",
    category: "CSR Partner",
    role: "Community Engagement Lead",
    organisation: "Maybank Foundation",
    location: "Kuala Lumpur, Malaysia",
    interests: ["Education", "Youth empowerment", "Disability inclusion"],
    seeking: ["Programme partners", "Event co-hosts"],
    offering: ["Funding", "Volunteer placements", "Mentorship"],
    summary:
      "Runs employee-volunteering programmes and small grants for youth and inclusion-focused NGOs."
  },
  {
    id: "c_pocket_of_pink",
    name: "Pocket of Pink",
    category: "NGO Partner",
    role: "NGO / CSO",
    organisation: "Pocket of Pink",
    location: "Petaling Jaya, Malaysia",
    interests: ["Gender equality", "Youth empowerment", "Digital rights / online safety"],
    seeking: ["CSR partnerships", "Funding", "Event co-hosts"],
    offering: ["Community access", "Campaign collaboration", "Training"],
    summary:
      "Gender-and-youth NGO with a growing community of young women advocates across the Klang Valley."
  },
  {
    id: "c_borneo_dan",
    name: "Borneo Digital Access Network",
    category: "NGO Partner",
    role: "NGO / CSO",
    organisation: "Borneo Digital Access Network",
    location: "Sabah, Malaysia",
    interests: ["Digital rights / online safety", "Education", "Community development"],
    seeking: ["Funding", "CSR partnerships", "Local implementing partners"],
    offering: ["Local knowledge / community access", "Research/data", "Event support"],
    summary:
      "Sabah-based NGO connecting underserved communities to digital infrastructure and literacy programmes."
  },
  {
    id: "c_hervoice",
    name: "Aina Rahman",
    category: "NGO Partner",
    role: "Programme Manager",
    organisation: "HerVoice Malaysia",
    location: "Selangor, Malaysia",
    interests: ["Gender equality", "Youth empowerment", "Digital rights / online safety"],
    seeking: ["Interns", "CSR partnerships", "Funding"],
    offering: ["Training", "Community access", "Campaign collaboration"],
    summary:
      "Runs women-and-youth advocacy programmes; can co-host workshops on online safety and gender equality."
  },
  {
    id: "c_volunteer_yh",
    name: "Yee Hui Tan",
    category: "Volunteer",
    role: "Student",
    organisation: "Universiti Malaya",
    location: "Kuala Lumpur, Malaysia",
    interests: ["Gender equality", "Digital rights / online safety"],
    seeking: ["Internship", "Volunteer roles", "Mentorship"],
    offering: ["Research support", "Content creation"],
    summary:
      "Final-year student advocate keen to support gender-equality and digital-safety events as a volunteer."
  },
  {
    id: "c_volunteer_arif",
    name: "Arif Hakim",
    category: "Volunteer",
    role: "Recent Graduate",
    organisation: "-",
    location: "Penang, Malaysia",
    interests: ["Climate / environment", "Civic technology", "Education"],
    seeking: ["Volunteer roles", "Speaking opportunities"],
    offering: ["Event support", "Community organising", "Technical tools"],
    summary:
      "Comp-sci graduate volunteering with civic-tech projects in Penang; reliable on event logistics and tooling."
  },
  {
    id: "c_volunteer_sara",
    name: "Sara Devi",
    category: "Volunteer",
    role: "Undergraduate",
    organisation: "Sunway University",
    location: "Selangor, Malaysia",
    interests: ["Mental health", "Youth empowerment", "Education"],
    seeking: ["Internship", "Volunteer roles"],
    offering: ["Content creation", "Event support"],
    summary:
      "Psychology undergrad active in campus mental-health societies; available for weekend events."
  },
  {
    id: "c_mentor_zara",
    name: "Zara Aziz",
    category: "Mentor",
    role: "Senior Researcher",
    organisation: "ISIS Malaysia",
    location: "Kuala Lumpur, Malaysia",
    interests: ["Democracy / governance", "Digital rights / online safety", "Civic technology"],
    seeking: ["Speaking opportunities", "Research collaborations"],
    offering: ["Mentorship", "Training/facilitation", "Research support"],
    summary:
      "Researches digital governance; mentors youth advocates and frequently speaks at civic-tech convenings."
  },
  {
    id: "c_mentor_iqbal",
    name: "Iqbal Rashid",
    category: "Mentor",
    role: "Founder",
    organisation: "Youth Civic Lab",
    location: "Shah Alam, Malaysia",
    interests: ["Civic technology", "Youth empowerment", "Democracy / governance"],
    seeking: ["Mentees", "Speaking opportunities"],
    offering: ["Mentorship", "Training/facilitation", "Network access"],
    summary:
      "Veteran civic-tech founder coaching first-time programme leads; strong network across Klang Valley."
  },
  {
    id: "c_speaker_mei",
    name: "Mei Ling Chong",
    category: "Speaker",
    role: "Director",
    organisation: "WAO (Women's Aid Organisation)",
    location: "Petaling Jaya, Malaysia",
    interests: ["Gender equality", "Labour rights", "Mental health"],
    seeking: ["Speaking opportunities", "Policy collaborations"],
    offering: ["Speaking", "Research/data", "Advocacy/campaign support"],
    summary:
      "Recognised voice on gender-based violence and policy reform; available for keynotes and panels."
  },
  {
    id: "c_speaker_amir",
    name: "Amir Hisham",
    category: "Speaker",
    role: "Tech Journalist",
    organisation: "The Edge Malaysia",
    location: "Kuala Lumpur, Malaysia",
    interests: ["Digital rights / online safety", "Civic technology", "Democracy / governance"],
    seeking: ["Speaking opportunities", "Source briefings"],
    offering: ["Speaking", "Media coverage", "Network access"],
    summary:
      "Covers tech policy and digital safety; can moderate or speak and amplify the event through coverage."
  }
];

const SAMPLE_EVENT: EventDraft = {
  title: "Youth Digital Safety Roundtable 2026",
  hostOrganisation: "Pocket of Pink",
  format: "Hybrid",
  location: "Kuala Lumpur, Malaysia",
  description:
    "A roundtable for youth advocates, NGOs, researchers, and CSR partners working on digital safety and gender equality.",
  audience: "Young women advocates, NGO programme leads, CSR partners, journalists",
  needs: ["Funding", "Speakers", "Volunteers", "CSR partner", "NGO collaborators"]
};

const EMPTY_EVENT: EventDraft = {
  title: "",
  hostOrganisation: "",
  format: "Hybrid",
  location: "",
  description: "",
  audience: "",
  needs: []
};

const NEED_OPTIONS = [
  "Funding",
  "Speakers",
  "Volunteers",
  "CSR partner",
  "NGO collaborators",
  "Mentors",
  "Media coverage",
  "Venue"
];

const CATEGORY_ORDER: CandidateCategory[] = [
  "Funder",
  "CSR Partner",
  "NGO Partner",
  "Volunteer",
  "Mentor",
  "Speaker"
];

function scoreColor(score: number) {
  if (score >= 80) return { bg: "#dcfce7", fg: "#166534", label: "Strong match" };
  if (score >= 60) return { bg: "#dbeafe", fg: "#1d4ed8", label: "Good match" };
  if (score >= 40) return { bg: "#fef3c7", fg: "#92400e", label: "Possible match" };
  return { bg: "#f1f5f9", fg: "#475569", label: "Weak match" };
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function useIsDebug() {
  const [isDebug, setIsDebug] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsDebug(new URLSearchParams(window.location.search).get("debug") === "1");
  }, []);
  return isDebug;
}

export default function DemoFlowPage() {
  const { currentUser, loading } = useAuth();
  const isDebug = useIsDebug();

  const [event, setEvent] = useState<EventDraft>(EMPTY_EVENT);
  const [savedEvent, setSavedEvent] = useState<EventDraft | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState("");
  const [usedFallback, setUsedFallback] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CandidateCategory | "All">("All");

  const showAuthGate = !loading && !currentUser && !isDebug;

  function toggleNeed(value: string) {
    setEvent((prev) =>
      prev.needs.includes(value)
        ? { ...prev, needs: prev.needs.filter((n) => n !== value) }
        : { ...prev, needs: [...prev.needs, value] }
    );
  }

  function prefillSample() {
    setEvent(SAMPLE_EVENT);
  }

  function onSaveEvent(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!event.title.trim()) return;
    setSavedEvent(event);
    setRecommendations([]);
    setGenerateError("");
  }

  async function generateRecommendations() {
    if (!savedEvent) return;
    setGenerating(true);
    setGenerateError("");
    setRecommendations([]);
    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: savedEvent, candidates: CANDIDATE_POOL })
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || `Request failed (${res.status})`);
      }
      const data = await res.json();
      setRecommendations(data.recommendations || []);
      setUsedFallback(!!data.usedFallback);
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : "Unable to generate recommendations.");
    } finally {
      setGenerating(false);
    }
  }

  const grouped = useMemo(() => {
    const map = new Map<CandidateCategory, Recommendation[]>();
    for (const rec of recommendations) {
      const list = map.get(rec.candidate.category) || [];
      list.push(rec);
      map.set(rec.candidate.category, list);
    }
    for (const list of map.values()) list.sort((a, b) => b.score - a.score);
    return map;
  }, [recommendations]);

  const visible = useMemo(() => {
    if (activeCategory === "All") return recommendations;
    return recommendations.filter((rec) => rec.candidate.category === activeCategory);
  }, [recommendations, activeCategory]);

  if (loading && !isDebug) {
    return <div className="centered-state">Checking your session...</div>;
  }
  if (showAuthGate) {
    return (
      <div className="centered-state">
        <div>
          You need to log in. <Link className="muted-link" href="/login">Open login</Link> or add{" "}
          <code>?debug=1</code> to bypass for testing.
        </div>
      </div>
    );
  }

  return (
    <main className="demo-shell">
      <header className="demo-topbar">
        <Link className="brand" href="/dashboard">
          ← Carta
        </Link>
        <div className="demo-topbar-actions">
          {isDebug ? <span className="wiz-debug-pill">Debug mode</span> : null}
          <Link className="btn btn-secondary" href="/dashboard">
            Open dashboard
          </Link>
        </div>
      </header>

      <section className="demo-hero">
        <h1>Demo flow</h1>
        <p>
          Create an event, then ask Gemini to recommend funders, NGO partners, volunteers, mentors,
          CSR partners, and speakers — each with a match score and reasoning.
        </p>
      </section>

      <section className="demo-step-card">
        <div className="demo-step-head">
          <div>
            <div className="demo-step-num">Step 1</div>
            <h2>Create your event</h2>
          </div>
          <button type="button" className="btn btn-secondary" onClick={prefillSample}>
            Use sample event
          </button>
        </div>

        <form className="form-grid" onSubmit={onSaveEvent}>
          <div className="form-grid two-col">
            <div className="field">
              <label htmlFor="title">Event title</label>
              <input
                id="title"
                value={event.title}
                onChange={(e) => setEvent({ ...event, title: e.target.value })}
                placeholder="Youth Digital Safety Roundtable"
              />
            </div>
            <div className="field">
              <label htmlFor="host">Host organisation</label>
              <input
                id="host"
                value={event.hostOrganisation}
                onChange={(e) => setEvent({ ...event, hostOrganisation: e.target.value })}
                placeholder="Pocket of Pink"
              />
            </div>
            <div className="field">
              <label htmlFor="format">Format</label>
              <select
                id="format"
                value={event.format}
                onChange={(e) => setEvent({ ...event, format: e.target.value })}
              >
                <option>Hybrid</option>
                <option>Physical</option>
                <option>Virtual</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                value={event.location}
                onChange={(e) => setEvent({ ...event, location: e.target.value })}
                placeholder="Kuala Lumpur, Malaysia"
              />
            </div>
          </div>
          <div className="field">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={event.description}
              onChange={(e) => setEvent({ ...event, description: e.target.value })}
              placeholder="Who is this for, what will happen, what change you hope to drive…"
            />
          </div>
          <div className="field">
            <label htmlFor="audience">Target audience</label>
            <input
              id="audience"
              value={event.audience}
              onChange={(e) => setEvent({ ...event, audience: e.target.value })}
              placeholder="e.g., youth advocates, NGO programme leads, CSR partners"
            />
          </div>
          <div>
            <div className="radio-label">What do you need from the ecosystem?</div>
            <div className="needs-row">
              {NEED_OPTIONS.map((option) => {
                const active = event.needs.includes(option);
                return (
                  <button
                    type="button"
                    key={option}
                    className={`need-chip ${active ? "active" : ""}`}
                    onClick={() => toggleNeed(option)}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="demo-actions">
            <button className="btn btn-primary" type="submit" disabled={!event.title.trim()}>
              Save event
            </button>
            {savedEvent ? (
              <span className="demo-saved-pill">Saved · {savedEvent.title}</span>
            ) : null}
          </div>
        </form>
      </section>

      <section className="demo-step-card">
        <div className="demo-step-head">
          <div>
            <div className="demo-step-num">Step 2</div>
            <h2>Generate AI recommendations</h2>
          </div>
          <button
            className="btn btn-primary"
            type="button"
            onClick={generateRecommendations}
            disabled={!savedEvent || generating}
          >
            {generating ? "Asking Gemini…" : "Generate recommendations"}
          </button>
        </div>
        <p className="demo-sub">
          Carta scores {CANDIDATE_POOL.length} ecosystem candidates against your event using Gemini, then
          explains why each one was recommended.
        </p>
        {!savedEvent ? (
          <div className="setup-note">Save an event in Step 1 to enable recommendations.</div>
        ) : null}
        {generateError ? <div className="error-box">{generateError}</div> : null}
        {usedFallback && recommendations.length ? (
          <div className="setup-note">
            Gemini returned an unparsable response — showing heuristic-only scoring as a fallback.
          </div>
        ) : null}
      </section>

      {recommendations.length ? (
        <section className="demo-step-card">
          <div className="demo-step-head">
            <div>
              <div className="demo-step-num">Step 3</div>
              <h2>Recommended matches</h2>
            </div>
            <div className="cat-tabs">
              <button
                type="button"
                className={`cat-tab ${activeCategory === "All" ? "active" : ""}`}
                onClick={() => setActiveCategory("All")}
              >
                All <span className="cat-count">{recommendations.length}</span>
              </button>
              {CATEGORY_ORDER.map((cat) => {
                const count = grouped.get(cat)?.length || 0;
                if (!count) return null;
                return (
                  <button
                    type="button"
                    key={cat}
                    className={`cat-tab ${activeCategory === cat ? "active" : ""}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat} <span className="cat-count">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rec-grid">
            {visible.map(({ candidate, score, reasoning }) => {
              const colors = scoreColor(score);
              return (
                <article className="rec-card" key={candidate.id}>
                  <div className="rec-head">
                    <div className="rec-avatar">{initials(candidate.name)}</div>
                    <div className="rec-id">
                      <div className="rec-name">{candidate.name}</div>
                      <div className="rec-role">
                        {candidate.role}
                        {candidate.organisation && candidate.organisation !== "-"
                          ? ` · ${candidate.organisation}`
                          : ""}
                      </div>
                      <div className="rec-chips">
                        <span className="rec-chip">{candidate.category}</span>
                        <span className="rec-chip rec-chip-muted">{candidate.location}</span>
                      </div>
                    </div>
                    <div
                      className="rec-score"
                      style={{ background: colors.bg, color: colors.fg }}
                      title={colors.label}
                    >
                      <span className="rec-score-num">{score}</span>
                      <span className="rec-score-label">{colors.label}</span>
                    </div>
                  </div>
                  <p className="rec-reasoning">
                    <strong>Why this match: </strong>
                    {reasoning || "—"}
                  </p>
                  <div className="rec-meta">
                    <span>
                      <strong>Offers:</strong> {candidate.offering.slice(0, 3).join(", ") || "—"}
                    </span>
                    <span>
                      <strong>Seeks:</strong> {candidate.seeking.slice(0, 3).join(", ") || "—"}
                    </span>
                  </div>
                  <div className="rec-actions">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() =>
                        window.alert(`Invite drafted for ${candidate.name}. (Demo only — no email sent.)`)
                      }
                    >
                      Draft invite
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => window.alert(reasoning || "No reasoning available.")}
                    >
                      Why?
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ) : null}
    </main>
  );
}
