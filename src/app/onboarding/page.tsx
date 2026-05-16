"use client";

import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/components/AuthProvider";

export default function OnboardingPage() {
  const { currentUser } = useAuth();

  return (
    <ProtectedRoute>
      <main className="dashboard-shell">
        <div className="dashboard-wrap">
          <header className="dashboard-header">
            <Link href="/dashboard" className="brand">
              Carta
            </Link>
            <Link className="btn btn-secondary" href="/dashboard">
              Go to dashboard
            </Link>
          </header>
          <section className="dashboard-card">
            <h2>Onboarding</h2>
            <p>
              Welcome{currentUser?.displayName ? `, ${currentUser.displayName}` : ""}. This placeholder will collect reusable civic profile details such as role, organisation, location, interests, seeking, and offering.
            </p>
          </section>
        </div>
      </main>
    </ProtectedRoute>
  );
}
