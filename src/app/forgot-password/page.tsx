"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useAuth } from "@/components/AuthProvider";

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email.trim());
      setSuccess("Password reset email sent. Check your inbox for the next step.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send reset email.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <Link href="/" className="brand">
          Carta
        </Link>
        <h1>Reset password</h1>
        <p>Enter your email and Firebase will send a secure password reset link.</p>

        <form className="form-grid" onSubmit={onSubmit}>
          {error ? <div className="error-box">{error}</div> : null}
          {success ? <div className="success-box">{success}</div> : null}
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <button className="btn btn-primary btn-full" disabled={loading} type="submit">
            {loading ? "Sending..." : "Send reset email"}
          </button>
        </form>

        <div className="auth-footer">
          Remembered it? <Link className="muted-link" href="/login">Back to login</Link>
        </div>
      </section>
    </main>
  );
}
