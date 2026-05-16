"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function EventCreatePage() {
  return (
    <ProtectedRoute>
      <iframe 
        src="/event-create.html" 
        style={{ width: '100%', height: '100vh', border: 'none', display: 'block' }} 
        title="Carta Event Creation"
      />
    </ProtectedRoute>
  );
}
