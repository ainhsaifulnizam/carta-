"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <iframe
        src="/carta_final.html"
        style={{ width: "100%", height: "100vh", border: "none", display: "block" }}
        title="Carta Dashboard"
      />
    </ProtectedRoute>
  );
}
