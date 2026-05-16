"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/components/AuthProvider";
import type { AccountType } from "@/lib/users";
import { saveUserOnboardingProfile } from "@/lib/users";

const issueOptions = [
  "Gender equality",
  "Youth empowerment",
  "Digital rights / online safety",
  "Climate / environment",
  "Education",
  "Disability inclusion",
  "Labour rights",
  "Migrant / refugee rights",
  "Mental health",
  "Community development",
  "Civic technology",
  "Democracy / governance",
  "Other"
];

const individualSeeking = [
  "Internship",
  "Mentorship",
  "Funding",
  "CSR partners",
  "NGO collaborators",
  "Movement-building opportunities",
  "Research collaborations",
  "Volunteer roles",
  "Speaking opportunities",
  "Hiring/recruitment",
  "General networking"
];

const individualOffering = [
  "Research support",
  "Content creation",
  "Community organising",
  "Event support",
  "Funding",
  "Mentorship",
  "Internship opportunities",
  "Technical tools",
  "Training/facilitation",
  "Advocacy/campaign support",
  "Local knowledge / community access",
  "Other"
];

const organisationSeeking = [
  "Funding",
  "CSR partnerships",
  "Interns",
  "Volunteers",
  "Mentors / expert advisors",
  "Research collaborators",
  "Campaign partners",
  "Local implementing partners",
  "Event co-hosts",
  "Grant applicants / grantees",
  "General network expansion"
];

const organisationOffering = [
  "Funding",
  "Internship openings",
  "Volunteer placements",
  "Training",
  "Community access",
  "Research/data",
  "Campaign collaboration",
  "Venue/event partnership",
  "Technical tools",
  "Mentorship",
  "Other"
];

function toggleValue(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function CheckboxGrid({
  label,
  options,
  values,
  onChange
}: {
  label: string;
  options: string[];
  values: string[];
  onChange: (values: string[]) => void;
}) {
  return (
    <div>
      <div className="radio-label">{label}</div>
      <div className="checkbox-grid">
        {options.map((option) => (
          <label className="checkbox-card" key={option}>
            <input
              checked={values.includes(option)}
              onChange={() => onChange(toggleValue(values, option))}
              type="checkbox"
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const router = useRouter();
  const { currentUser } = useAuth();
  const [accountType, setAccountType] = useState<AccountType>("individual");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [individual, setIndividual] = useState({
    profileName: "",
    city: "",
    state: "",
    country: "Malaysia",
    role: "Student",
    affiliated: "No",
    organisationName: "",
    jobTitle: "",
    interests: [] as string[],
    seeking: [] as string[],
    offering: [] as string[],
    context: ""
  });

  const [organisation, setOrganisation] = useState({
    organisationName: "",
    organisationType: "NGO / CSO",
    city: "",
    state: "",
    country: "Malaysia",
    role: "Programme manager",
    focus: [] as string[],
    seeking: [] as string[],
    offering: [] as string[],
    context: ""
  });

  useEffect(() => {
    try {
      const pending = sessionStorage.getItem("cartaPendingAccountType") as AccountType | null;
      if (pending === "individual" || pending === "organisation") {
        setAccountType(pending);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (currentUser?.displayName && !individual.profileName) {
      setIndividual((previous) => ({ ...previous, profileName: currentUser.displayName || "" }));
    }
  }, [currentUser, individual.profileName]);

  const profilePreview = useMemo(() => {
    if (accountType === "organisation") {
      return organisation.organisationName || currentUser?.displayName || "Organisation profile";
    }
    return individual.profileName || currentUser?.displayName || "Individual profile";
  }, [accountType, currentUser, individual.profileName, organisation.organisationName]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!currentUser) return;

    if (accountType === "individual") {
      if (!individual.profileName.trim() || !individual.city.trim() || !individual.state.trim() || !individual.context.trim()) {
        setError("Please complete your display name, city, state, and AI context.");
        return;
      }
    } else if (!organisation.organisationName.trim() || !organisation.city.trim() || !organisation.state.trim() || !organisation.context.trim()) {
      setError("Please complete organisation name, city, state, and AI context.");
      return;
    }

    setSaving(true);
    try {
      await saveUserOnboardingProfile(currentUser, {
        accountType,
        profile: accountType === "individual" ? individual : organisation
      });
      try {
        sessionStorage.removeItem("cartaPendingAccountType");
      } catch {}
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save onboarding profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <ProtectedRoute>
      <main className="dashboard-shell">
        <div className="dashboard-wrap wide">
          <header className="dashboard-header">
            <Link href="/dashboard" className="brand">
              Carta
            </Link>
            <Link className="btn btn-secondary" href="/dashboard">
              Skip for demo
            </Link>
          </header>

          <section className="dashboard-card">
            <h2>Complete your Carta profile</h2>
            <p>
              Welcome{currentUser?.displayName ? `, ${currentUser.displayName}` : ""}. Google sign-in creates identity; this questionnaire gives Carta the reusable civic context needed for event registration and matching.
            </p>

            <form className="questionnaire" onSubmit={onSubmit}>
              {error ? <div className="error-box">{error}</div> : null}

              <div>
                <div className="radio-label">Account type</div>
                <div className="radio-group two-col">
                  <label className="radio-card">
                    <input checked={accountType === "individual"} onChange={() => setAccountType("individual")} type="radio" />
                    Individual participant
                  </label>
                  <label className="radio-card">
                    <input checked={accountType === "organisation"} onChange={() => setAccountType("organisation")} type="radio" />
                    Organisation representative
                  </label>
                </div>
              </div>

              <div className="setup-note">
                Profile being created: <strong>{profilePreview}</strong>
              </div>

              {accountType === "individual" ? (
                <>
                  <div className="form-grid two-col">
                    <div className="field">
                      <label htmlFor="profileName">What name should appear on your Carta profile?</label>
                      <input id="profileName" value={individual.profileName} onChange={(event) => setIndividual({ ...individual, profileName: event.target.value })} />
                    </div>
                    <div className="field">
                      <label htmlFor="role">Which best describes you?</label>
                      <select id="role" value={individual.role} onChange={(event) => setIndividual({ ...individual, role: event.target.value })}>
                        {["Student", "NGO staff", "Volunteer", "Activist / movement organiser", "Researcher", "Funder / grantmaker", "CSR / corporate representative", "Mentor", "Mentee", "Freelancer / consultant", "Other"].map((role) => (
                          <option key={role}>{role}</option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label htmlFor="city">City</label>
                      <input id="city" value={individual.city} onChange={(event) => setIndividual({ ...individual, city: event.target.value })} />
                    </div>
                    <div className="field">
                      <label htmlFor="state">State</label>
                      <input id="state" value={individual.state} onChange={(event) => setIndividual({ ...individual, state: event.target.value })} />
                    </div>
                    <div className="field">
                      <label htmlFor="country">Country</label>
                      <input id="country" value={individual.country} onChange={(event) => setIndividual({ ...individual, country: event.target.value })} />
                    </div>
                    <div className="field">
                      <label htmlFor="affiliated">Affiliated with an organisation?</label>
                      <select id="affiliated" value={individual.affiliated} onChange={(event) => setIndividual({ ...individual, affiliated: event.target.value })}>
                        <option>No</option>
                        <option>Yes</option>
                      </select>
                    </div>
                    {individual.affiliated === "Yes" ? (
                      <>
                        <div className="field">
                          <label htmlFor="individualOrg">Organisation name</label>
                          <input id="individualOrg" value={individual.organisationName} onChange={(event) => setIndividual({ ...individual, organisationName: event.target.value })} />
                        </div>
                        <div className="field">
                          <label htmlFor="jobTitle">Job title / role</label>
                          <input id="jobTitle" value={individual.jobTitle} onChange={(event) => setIndividual({ ...individual, jobTitle: event.target.value })} />
                        </div>
                      </>
                    ) : null}
                  </div>
                  <CheckboxGrid label="What issues or communities are you interested in?" options={issueOptions} values={individual.interests} onChange={(values) => setIndividual({ ...individual, interests: values })} />
                  <CheckboxGrid label="What are you hoping to find through Carta?" options={individualSeeking} values={individual.seeking} onChange={(values) => setIndividual({ ...individual, seeking: values })} />
                  <CheckboxGrid label="What can you offer to others in the network?" options={individualOffering} values={individual.offering} onChange={(values) => setIndividual({ ...individual, offering: values })} />
                  <div className="field">
                    <label htmlFor="individualContext">Tell us briefly about yourself and who you hope to connect with.</label>
                    <textarea id="individualContext" value={individual.context} onChange={(event) => setIndividual({ ...individual, context: event.target.value })} />
                  </div>
                </>
              ) : (
                <>
                  <div className="form-grid two-col">
                    <div className="field">
                      <label htmlFor="organisationName">Organisation name</label>
                      <input id="organisationName" value={organisation.organisationName} onChange={(event) => setOrganisation({ ...organisation, organisationName: event.target.value })} />
                    </div>
                    <div className="field">
                      <label htmlFor="organisationType">Organisation type</label>
                      <select id="organisationType" value={organisation.organisationType} onChange={(event) => setOrganisation({ ...organisation, organisationType: event.target.value })}>
                        {["NGO / CSO", "Grassroots movement", "Foundation / funder", "Corporate CSR team", "University / research institute", "Social enterprise", "Student organisation", "Public-sector agency", "Other"].map((type) => (
                          <option key={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label htmlFor="orgCity">City</label>
                      <input id="orgCity" value={organisation.city} onChange={(event) => setOrganisation({ ...organisation, city: event.target.value })} />
                    </div>
                    <div className="field">
                      <label htmlFor="orgState">State</label>
                      <input id="orgState" value={organisation.state} onChange={(event) => setOrganisation({ ...organisation, state: event.target.value })} />
                    </div>
                    <div className="field">
                      <label htmlFor="orgCountry">Country</label>
                      <input id="orgCountry" value={organisation.country} onChange={(event) => setOrganisation({ ...organisation, country: event.target.value })} />
                    </div>
                    <div className="field">
                      <label htmlFor="orgRole">Your role in the organisation</label>
                      <select id="orgRole" value={organisation.role} onChange={(event) => setOrganisation({ ...organisation, role: event.target.value })}>
                        {["Founder / director", "Programme manager", "Partnerships lead", "Communications", "Volunteer coordinator", "Researcher", "Other"].map((role) => (
                          <option key={role}>{role}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <CheckboxGrid label="What areas does your organisation work on?" options={issueOptions} values={organisation.focus} onChange={(values) => setOrganisation({ ...organisation, focus: values })} />
                  <CheckboxGrid label="What is your organisation currently looking for?" options={organisationSeeking} values={organisation.seeking} onChange={(values) => setOrganisation({ ...organisation, seeking: values })} />
                  <CheckboxGrid label="What can your organisation offer to the ecosystem?" options={organisationOffering} values={organisation.offering} onChange={(values) => setOrganisation({ ...organisation, offering: values })} />
                  <div className="field">
                    <label htmlFor="organisationContext">Briefly describe your organisation, priorities, and desired connections.</label>
                    <textarea id="organisationContext" value={organisation.context} onChange={(event) => setOrganisation({ ...organisation, context: event.target.value })} />
                  </div>
                </>
              )}

              <button className="btn btn-primary btn-full" disabled={saving} type="submit">
                {saving ? "Saving profile..." : "Finish onboarding"}
              </button>
            </form>
          </section>
        </div>
      </main>
    </ProtectedRoute>
  );
}
