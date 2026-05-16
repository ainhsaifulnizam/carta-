"use client";

import Link from "next/link";
import Image from "next/image";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
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

type TourStep = { title: string; body: string };

const TOUR_STEPS: TourStep[] = [
  {
    title: "Welcome to Carta",
    body:
      "We help NGOs plan events that build lasting partnerships. This walkthrough takes about 60 seconds — feel free to skip it if you'd rather poke around."
  },
  {
    title: "Step 1 — Describe your event",
    body:
      "Give us the basics: what the event is, who it's for, and what kind of support you need. We've prefilled a sample event so you can see the flow right away."
  },
  {
    title: "Step 2 — Save to get matches",
    body:
      "When you save your event, Carta immediately searches your ecosystem and surfaces the funders, partners, volunteers, mentors, and speakers most likely to engage."
  },
  {
    title: "Step 3 — Review & take action",
    body:
      "Each match comes with a confidence score and a short explanation. Draft an invite or skip — your decisions train future matches over time."
  }
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

const AVATAR_INDEX_MAP: Record<string, number> = {
  "Yee Hui Tan": 44,
  "Sara Devi": 49,
  "Arif Hakim": 11,
  "Daniel Lim": 15,
  "Aina Rahman": 23,
  "Mei Ling Chong": 20,
  "Amir Hisham": 68,
  "Zara Aziz": 47,
  "Iqbal Rashid": 33,
  "Faridah Ahmad": 25,
  "Nadia Yusof": 42
};

function avatarUrlFor(name: string): string | null {
  if (AVATAR_INDEX_MAP[name]) {
    return `https://i.pravatar.cc/200?img=${AVATAR_INDEX_MAP[name]}`;
  }
  return null;
}

function isPersonCandidate(c: Candidate): boolean {
  return !!c.organisation && c.organisation !== c.name && c.organisation.trim().length > 0 && c.organisation !== "-";
}

function useIsDebug() {
  const [isDebug, setIsDebug] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsDebug(new URLSearchParams(window.location.search).get("debug") === "1");
  }, []);
  return isDebug;
}

export default function EventCreatePage() {
  const { currentUser, loading } = useAuth();
  const isDebug = useIsDebug();

  const [event, setEvent] = useState<EventDraft>(SAMPLE_EVENT);
  const [savedEvent, setSavedEvent] = useState<EventDraft | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState("");
  const [activeCategory, setActiveCategory] = useState<CandidateCategory | "All">("All");
  const [tourOpen, setTourOpen] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSignatureRef = useRef<string>("");

  const showAuthGate = !loading && !currentUser && !isDebug;

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const seen = window.localStorage.getItem("cartaTourSeen");
      if (!seen) setTourOpen(true);
    } catch {}
  }, []);

  function closeTour() {
    setTourOpen(false);
    try {
      window.localStorage.setItem("cartaTourSeen", "1");
    } catch {}
  }

  function tourNext() {
    if (tourIndex < TOUR_STEPS.length - 1) {
      setTourIndex((idx) => idx + 1);
    } else {
      closeTour();
    }
  }

  function tourPrev() {
    setTourIndex((idx) => Math.max(0, idx - 1));
  }

  function toggleNeed(value: string) {
    setEvent((prev) =>
      prev.needs.includes(value)
        ? { ...prev, needs: prev.needs.filter((n) => n !== value) }
        : { ...prev, needs: [...prev.needs, value] }
    );
  }

  function resetSample() {
    setEvent(SAMPLE_EVENT);
  }

  function clearForm() {
    setEvent({
      title: "",
      hostOrganisation: "",
      format: "Hybrid",
      location: "",
      description: "",
      audience: "",
      needs: []
    });
    setSavedEvent(null);
    setRecommendations([]);
  }

  function onSaveEvent(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!event.title.trim()) return;
    setSavedEvent(event);
  }

  useEffect(() => {
    if (!savedEvent) return;
    const signature = JSON.stringify(savedEvent);
    if (signature === lastSignatureRef.current) return;
    lastSignatureRef.current = signature;

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      void generateRecommendations(savedEvent);
    }, 250);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [savedEvent]);

  async function generateRecommendations(forEvent: EventDraft) {
    setGenerating(true);
    setGenerateError("");
    setRecommendations([]);
    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: forEvent, candidates: CANDIDATE_POOL })
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || `Request failed (${res.status})`);
      }
      const data = await res.json();
      setRecommendations(data.recommendations || []);
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : "Unable to surface matches right now.");
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
        <Link className="brand-logo" href="/dashboard">
          <Image src="/assets/cartalogo.png" alt="Carta" width={120} height={34} priority />
        </Link>
        <div className="demo-topbar-actions">
          {isDebug ? <span className="wiz-debug-pill">Debug mode</span> : null}
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setTourIndex(0);
              setTourOpen(true);
            }}
          >
            Replay tour
          </button>
          <Link className="btn btn-secondary" href="/dashboard">
            Open dashboard
          </Link>
        </div>
      </header>

      <section className="demo-hero">
        <h1>Create an event</h1>
        <p>
          Fill in your event details — Carta will instantly surface the funders, partners, volunteers,
          mentors, and speakers most likely to engage.
        </p>
      </section>

      <section className="demo-step-card">
        <div className="demo-step-head">
          <div>
            <h2>Event details</h2>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button type="button" className="btn btn-secondary" onClick={resetSample}>
              Use sample event
            </button>
            <button type="button" className="btn btn-secondary" onClick={clearForm}>
              Clear
            </button>
          </div>
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
              Save & find matches
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
            <h2>Recommended matches</h2>
          </div>
          {recommendations.length ? (
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
          ) : null}
        </div>

        {!savedEvent ? (
          <p className="demo-sub">Fill in your event above and Carta will line up the right people automatically.</p>
        ) : null}

        {generating ? <div className="rec-loading">Lining up the best matches…</div> : null}
        {generateError ? <div className="error-box">{generateError}</div> : null}

        {recommendations.length ? (
          <div className="rec-grid">
            {visible.map(({ candidate, score, reasoning }, idx) => {
              const colors = scoreColor(score);
              return (
                <article
                  className="rec-card"
                  key={candidate.id}
                  style={{ animationDelay: `${Math.min(idx, 8) * 40}ms` }}
                >
                  <div className="rec-head">
                    {isPersonCandidate(candidate) && avatarUrlFor(candidate.name) ? (
                      <img
                        className="rec-avatar rec-avatar-img"
                        src={avatarUrlFor(candidate.name) || ""}
                        alt={candidate.name}
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="rec-avatar">{initials(candidate.name)}</div>
                    )}
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
                      className="btn btn-primary"
                      onClick={() =>
                        window.alert(`Invite drafted for ${candidate.name}.`)
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
        ) : null}
      </section>

      {tourOpen ? (
        <>
          <div className="tour-overlay" onClick={closeTour} />
          <div className="tour-card" role="dialog" aria-modal="true">
            <div className="tour-step">Tour · Step {tourIndex + 1} of {TOUR_STEPS.length}</div>
            <h3>{TOUR_STEPS[tourIndex].title}</h3>
            <p>{TOUR_STEPS[tourIndex].body}</p>
            <div className="tour-actions">
              <button type="button" className="wiz-link" onClick={closeTour}>
                Skip tour
              </button>
              <div className="tour-actions-right">
                {tourIndex > 0 ? (
                  <button type="button" className="btn btn-secondary" onClick={tourPrev}>
                    Back
                  </button>
                ) : null}
                <button type="button" className="btn btn-primary" onClick={tourNext}>
                  {tourIndex === TOUR_STEPS.length - 1 ? "Get started" : "Next"}
                </button>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </main>
  );
}
