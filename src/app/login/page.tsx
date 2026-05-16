"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "@/components/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { firebaseReady, loginWithEmail, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      await loginWithEmail(email.trim(), password);
      router.push("/onboarding");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to log in.");
    } finally {
      setLoading(false);
    }
  }

  async function onGoogleLogin() {
    setError("");
    if (!firebaseReady) {
      setError("Firebase is not configured yet. Add the NEXT_PUBLIC_FIREBASE_* values to .env.local, restart the dev server, and enable Google sign-in in Firebase Console.");
      return;
    }
    setLoading(true);
    try {
      await loginWithGoogle();
      router.push("/onboarding");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to continue with Google.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <Link href="/" className="brand-logo">
          <Image src="/assets/cartalogo.png" alt="Carta" width={140} height={40} priority />
        </Link>
        <h1>Welcome back</h1>
        <p>Log in to return to your civic relationship dashboard.</p>

        <form className="form-grid" onSubmit={onSubmit}>
          {error ? <div className="error-box">{error}</div> : null}
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </div>
          <Link className="muted-link" href="/forgot-password">
            Forgot password?
          </Link>
          <button className="btn btn-primary btn-full" disabled={loading} type="submit">
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <div className="divider">or</div>
        <button className="btn btn-secondary btn-full" disabled={loading} onClick={onGoogleLogin} type="button">
          Continue with Google
        </button>
        {!firebaseReady ? (
          <div className="setup-note">
            Google sign-in needs real Firebase config in <code>.env.local</code> and the Google provider enabled in Firebase Authentication.
          </div>
        ) : null}

        <div className="auth-footer">
          New to Carta? <Link className="muted-link" href="/register">Create an account</Link>
        </div>
      </section>
    </main>
  );
}
