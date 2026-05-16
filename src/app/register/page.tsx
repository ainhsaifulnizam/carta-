"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import type { AccountType } from "@/lib/users";

type RegisterForm = {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
  accountType: AccountType;
  acceptedTerms: boolean;
};

const initialForm: RegisterForm = {
  displayName: "",
  email: "",
  password: "",
  confirmPassword: "",
  accountType: "individual",
  acceptedTerms: false
};

function validate(form: RegisterForm) {
  if (!form.displayName.trim()) return "Full name is required.";
  if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Enter a valid email address.";
  if (form.password.length < 8) return "Password must be at least 8 characters.";
  if (form.password !== form.confirmPassword) return "Passwords do not match.";
  if (!form.acceptedTerms) return "Please accept the terms and privacy policy.";
  return "";
}

export default function RegisterPage() {
  const router = useRouter();
  const { firebaseReady, registerWithEmail, loginWithGoogle } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const validationError = validate(form);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      await registerWithEmail({
        displayName: form.displayName.trim(),
        email: form.email.trim(),
        password: form.password,
        accountType: form.accountType
      });
      router.push("/onboarding");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create account.");
    } finally {
      setLoading(false);
    }
  }

  async function onGoogleSignup() {
    setError("");
    if (!firebaseReady) {
      setError("Firebase is not configured yet. Add the NEXT_PUBLIC_FIREBASE_* values to .env.local, restart the dev server, and enable Google sign-in in Firebase Console.");
      return;
    }
    setLoading(true);
    try {
      await loginWithGoogle(form.accountType);
      try {
        sessionStorage.setItem("cartaPendingAccountType", form.accountType);
      } catch {}
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
        <h1>Create your account</h1>
        <p>Build one reusable civic profile, then join future events without re-entering the same basics.</p>

        <form className="form-grid" onSubmit={onSubmit}>
          {error ? <div className="error-box">{error}</div> : null}
          <div className="field">
            <label htmlFor="displayName">Full name</label>
            <input id="displayName" value={form.displayName} onChange={(event) => setForm({ ...form, displayName: event.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} />
          </div>
          <div className="field">
            <label htmlFor="confirmPassword">Confirm password</label>
            <input id="confirmPassword" type="password" value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} />
          </div>

          <div>
            <div className="radio-label">Account type</div>
            <div className="radio-group">
              <label className="radio-card">
                <input type="radio" checked={form.accountType === "individual"} onChange={() => setForm({ ...form, accountType: "individual" })} />
                Individual participant
              </label>
              <label className="radio-card">
                <input type="radio" checked={form.accountType === "organisation"} onChange={() => setForm({ ...form, accountType: "organisation" })} />
                Organisation representative
              </label>
            </div>
          </div>

          <label className="checkbox-row">
            <input type="checkbox" checked={form.acceptedTerms} onChange={(event) => setForm({ ...form, acceptedTerms: event.target.checked })} />
            <span>I agree to the Carta terms and privacy policy.</span>
          </label>

          <button className="btn btn-primary btn-full" disabled={loading} type="submit">
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <div className="divider">or</div>
        <button className="btn btn-secondary btn-full" disabled={loading} onClick={onGoogleSignup} type="button">
          Continue with Google
        </button>
        {!firebaseReady ? (
          <div className="setup-note">
            Google sign-in needs real Firebase config in <code>.env.local</code> and the Google provider enabled in Firebase Authentication.
          </div>
        ) : null}

        <div className="auth-footer">
          Already have an account? <Link className="muted-link" href="/login">Log in</Link>
        </div>
      </section>
    </main>
  );
}
