"use client";

import Link from "next/link";
import Image from "next/image";
import { WorldMapPanel } from "@/components/WorldMapPanel";
import { useAuth } from "@/components/AuthProvider";

const features = [
  {
    title: "Event intelligence",
    body: "Turn registrations into structured profiles, organiser insights, and reusable event memory."
  },
  {
    title: "Personalised network matches",
    body: "Help attendees find the people, funders, mentors, interns, and collaborators they came for."
  },
  {
    title: "Civic ecosystem mapping",
    body: "Map organisations, relationship gaps, and partnership opportunities across geography and issue areas."
  }
];

export default function LandingPage() {
  const { currentUser, loading } = useAuth();

  return (
    <main className="public-shell">
      <nav className="top-nav">
        <Link href="/" className="brand-logo brand-logo--lg">
          <Image src="/assets/cartalogo.png" alt="Carta" width={360} height={130} priority />
        </Link>
        <div className="nav-actions">
          {loading ? (
            <span className="btn btn-secondary">Checking session...</span>
          ) : currentUser ? (
            <Link href="/dashboard" className="btn btn-primary">
              Go to dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="btn btn-secondary">
                Log in
              </Link>
              <Link href="/register" className="btn btn-primary">
                Create an account
              </Link>
            </>
          )}
        </div>
      </nav>

      <section className="hero">
        <div className="hero-copy">
          <h1>Turn NGO events into compounding civic networks.</h1>
          <p>
            Carta helps civil society organisations host events, understand who is in
            the room, and surface the funding, CSR, internship, collaboration, and
            movement-building connections that should happen next.
          </p>
          <div className="cta-row">
            {currentUser ? (
              <Link href="/dashboard" className="btn btn-primary">
                Go to dashboard
              </Link>
            ) : (
              <>
                <Link href="/register" className="btn btn-primary">
                  Create an account
                </Link>
                <Link href="/login" className="btn btn-secondary">
                  Log in
                </Link>
              </>
            )}
          </div>
        </div>
        <WorldMapPanel />
      </section>

      <section className="feature-grid">
        {features.map((feature, index) => (
          <article className="feature-card" key={feature.title}>
            <div className="feature-icon">{index + 1}</div>
            <h3>{feature.title}</h3>
            <p>{feature.body}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
