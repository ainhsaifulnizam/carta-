"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/components/AuthProvider";

export default function DashboardPage() {
  const { currentUser, logout } = useAuth();
  const router = useRouter();

  async function onLogout() {
    await logout();
    router.push("/");
  }

  return (
    <ProtectedRoute>
      <main className="dashboard-shell">
        <div className="dashboard-wrap">
          <header className="dashboard-header">
            <Link href="/dashboard" className="brand">
              Carta
            </Link>
            <button className="btn btn-secondary" onClick={onLogout} type="button">
              Log out
            </button>
          </header>
          <section className="dashboard-card">
            <h2>Dashboard</h2>
            <p>
              You are authenticated as {currentUser?.displayName || currentUser?.email || "a Carta user"}.
              This placeholder will become the civic relationship dashboard.
            </p>
            <div className="cta-row">
              <Link href="/onboarding" className="btn btn-primary">
                Continue onboarding
              </Link>
            </div>
          </section>
        </div>
      </main>
    </ProtectedRoute>
  );
}
