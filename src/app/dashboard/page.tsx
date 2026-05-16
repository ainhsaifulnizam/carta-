"use client";

import Link from "next/link";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <div className="dashboard-quickbar">
          <div className="dashboard-quickbar-title">
            Demo flow <span>· orchestrate event → AI-matched ecosystem</span>
          </div>
          <div className="dashboard-quickbar-actions">
            <Link className="btn btn-primary" href="/demo">
              Create event &amp; get AI recommendations
            </Link>
            <Link className="btn btn-secondary" href="/event-create">
              Open full event builder
            </Link>
            <Link className="btn btn-secondary" href="/onboarding">
              Onboarding wizard
            </Link>
          </div>
        </div>
        <iframe
          src="/carta_final.html"
          style={{ width: "100%", flex: 1, border: "none", display: "block" }}
          title="Carta Dashboard"
        />
      </div>
    </ProtectedRoute>
  );
}
