"use client";

import Link from "next/link";
import Image from "next/image";
import { FormEvent, ReactNode, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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

type IndividualState = {
  profileName: string;
  city: string;
  state: string;
  country: string;
  role: string;
  affiliated: string;
  organisationName: string;
  jobTitle: string;
  interests: string[];
  seeking: string[];
  offering: string[];
  context: string;
};

type OrganisationState = {
  organisationName: string;
  organisationType: string;
  city: string;
  state: string;
  country: string;
  role: string;
  focus: string[];
  seeking: string[];
  offering: string[];
  context: string;
};

const initialIndividual: IndividualState = {
  profileName: "",
  city: "",
  state: "",
  country: "Malaysia",
  role: "Student",
  affiliated: "No",
  organisationName: "",
  jobTitle: "",
  interests: [],
  seeking: [],
  offering: [],
  context: ""
};

const initialOrganisation: OrganisationState = {
  organisationName: "",
  organisationType: "NGO / CSO",
  city: "",
  state: "",
  country: "Malaysia",
  role: "Programme manager",
  focus: [],
  seeking: [],
  offering: [],
  context: ""
};

const demoIndividual: IndividualState = {
  profileName: "Aina Demo",
  city: "Kuala Lumpur",
  state: "Selangor",
  country: "Malaysia",
  role: "Student",
  affiliated: "Yes",
  organisationName: "Carta Demo Society",
  jobTitle: "Programme Lead",
  interests: ["Gender equality", "Youth empowerment", "Education", "Civic technology"],
  seeking: ["Mentorship", "Internship", "Research collaborations"],
  offering: ["Research support", "Content creation", "Local knowledge / community access"],
  context:
    "Final-year student exploring civic tech and youth empowerment in Malaysia. Looking to connect with mentors and NGOs working on gender equality and digital rights."
};

const demoOrganisation: OrganisationState = {
  organisationName: "Carta Demo Foundation",
  organisationType: "NGO / CSO",
  city: "Petaling Jaya",
  state: "Selangor",
  country: "Malaysia",
  role: "Programme manager",
  focus: ["Youth empowerment", "Education", "Civic technology"],
  seeking: ["Funding", "CSR partnerships", "Volunteers"],
  offering: ["Internship openings", "Training", "Community access"],
  context:
    "Community NGO running civic-tech workshops for Malaysian youth. Looking for CSR partners and funders to scale the programme into East Malaysia."
};

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

type StepDef = {
  id: string;
  label: string;
  illustration: ReactNode;
};

const STEPS: StepDef[] = [
  { id: "type", label: "Account Type", illustration: <PinIllustration /> },
  { id: "location", label: "Location", illustration: <PinIllustration /> },
  { id: "profile", label: "Profile Details", illustration: <BuildingIllustration /> },
  { id: "network", label: "Network", illustration: <BuildingIllustration /> },
  { id: "context", label: "About You", illustration: <BuildingIllustration /> }
];

function PinIllustration() {
  return (
    <svg viewBox="0 0 120 100" aria-hidden="true">
      <path d="M30 90 L90 90 L70 60 L50 60 Z" fill="#dbeafe" />
      <path d="M30 90 L90 90 L70 60 L50 60 Z" fill="none" stroke="#bfdbfe" strokeWidth="1.5" />
      <path
        d="M55 38 C55 28 65 22 65 22 C65 22 75 28 75 38 C75 48 65 56 65 56 C65 56 55 48 55 38 Z"
        fill="#2563eb"
      />
      <circle cx="65" cy="38" r="4" fill="#ffffff" />
    </svg>
  );
}

function BuildingIllustration() {
  return (
    <svg viewBox="0 0 120 100" aria-hidden="true">
      <rect x="20" y="40" width="35" height="55" rx="2" fill="#bfdbfe" />
      <rect x="55" y="20" width="35" height="75" rx="2" fill="#2563eb" />
      <g fill="#ffffff">
        <rect x="60" y="28" width="6" height="6" rx="1" />
        <rect x="72" y="28" width="6" height="6" rx="1" />
        <rect x="60" y="40" width="6" height="6" rx="1" />
        <rect x="72" y="40" width="6" height="6" rx="1" />
        <rect x="60" y="52" width="6" height="6" rx="1" />
        <rect x="72" y="52" width="6" height="6" rx="1" />
      </g>
      <g fill="#ffffff">
        <rect x="26" y="48" width="5" height="5" rx="1" />
        <rect x="37" y="48" width="5" height="5" rx="1" />
        <rect x="26" y="60" width="5" height="5" rx="1" />
        <rect x="37" y="60" width="5" height="5" rx="1" />
      </g>
    </svg>
  );
}

function StepRail({
  current,
  goTo,
  isDebug
}: {
  current: number;
  goTo: (index: number) => void;
  isDebug: boolean;
}) {
  return (
    <ol className="wiz-rail">
      {STEPS.map((step, index) => {
        const isDone = index < current;
        const isActive = index === current;
        const stateClass = isDone ? "done" : isActive ? "active" : "pending";
        return (
          <li className={`wiz-rail-item ${stateClass}`} key={step.id}>
            <button
              type="button"
              className="wiz-rail-btn"
              onClick={() => (isDebug || isDone || isActive ? goTo(index) : undefined)}
              disabled={!isDebug && !isDone && !isActive}
            >
              <span className="wiz-rail-num">
                {isDone ? (
                  <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
                    <path
                      d="M5 12l4 4 10-10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </span>
              <span className="wiz-rail-label">{step.label}</span>
              {isActive ? (
                <span className="wiz-rail-arrow" aria-hidden="true">
                  →
                </span>
              ) : null}
            </button>
          </li>
        );
      })}
    </ol>
  );
}

function ChoiceCard({
  title,
  subtitle,
  icon,
  selected,
  onClick
}: {
  title: string;
  subtitle: string;
  icon: ReactNode;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`wiz-choice ${selected ? "selected" : ""}`}
    >
      <span className="wiz-choice-icon">{icon}</span>
      <span className="wiz-choice-body">
        <span className="wiz-choice-title">{title}</span>
        <span className="wiz-choice-sub">{subtitle}</span>
      </span>
      <span className="wiz-choice-arrow" aria-hidden="true">
        →
      </span>
    </button>
  );
}

function useIsDebug() {
  const [isDebug, setIsDebug] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setIsDebug(params.get("debug") === "1");
  }, []);
  return isDebug;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { currentUser, loading } = useAuth();
  const isDebug = useIsDebug();

  const [stepIndex, setStepIndex] = useState(0);
  const [accountType, setAccountType] = useState<AccountType>("individual");
  const [individual, setIndividual] = useState<IndividualState>(initialIndividual);
  const [organisation, setOrganisation] = useState<OrganisationState>(initialOrganisation);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!currentUser && !isDebug) {
      router.replace("/login");
    }
  }, [currentUser, loading, isDebug, router]);

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
      setIndividual((prev) => ({ ...prev, profileName: currentUser.displayName || "" }));
    }
  }, [currentUser, individual.profileName]);

  const profilePreview = useMemo(() => {
    if (accountType === "organisation") {
      return organisation.organisationName || currentUser?.displayName || "Organisation profile";
    }
    return individual.profileName || currentUser?.displayName || "Individual profile";
  }, [accountType, currentUser, individual.profileName, organisation.organisationName]);

  function applyDemoData() {
    if (accountType === "individual") {
      setIndividual(demoIndividual);
    } else {
      setOrganisation(demoOrganisation);
    }
  }

  function validateStep(index: number): string {
    if (accountType === "individual") {
      if (index === 1 && (!individual.city.trim() || !individual.state.trim())) {
        return "Please complete city and state.";
      }
      if (index === 2 && !individual.profileName.trim()) {
        return "Please enter the name to show on your Carta profile.";
      }
      if (index === 4 && !individual.context.trim()) {
        return "Tell us briefly about yourself.";
      }
    } else {
      if (index === 1 && (!organisation.city.trim() || !organisation.state.trim())) {
        return "Please complete city and state.";
      }
      if (index === 2 && !organisation.organisationName.trim()) {
        return "Please enter your organisation name.";
      }
      if (index === 4 && !organisation.context.trim()) {
        return "Briefly describe your organisation.";
      }
    }
    return "";
  }

  function goNext() {
    const message = validateStep(stepIndex);
    if (message) {
      setError(message);
      return;
    }
    setError("");
    setStepIndex((idx) => Math.min(idx + 1, STEPS.length - 1));
  }

  function goPrev() {
    setError("");
    setStepIndex((idx) => Math.max(idx - 1, 0));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const message = validateStep(stepIndex);
    if (message) {
      setError(message);
      return;
    }

    if (isDebug && !currentUser) {
      // Debug mode without a real session — just log and bounce to dashboard.
      // eslint-disable-next-line no-console
      console.log("[onboarding debug] payload", {
        accountType,
        profile: accountType === "individual" ? individual : organisation
      });
      router.push("/dashboard");
      return;
    }

    if (!currentUser) return;

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

  if (loading && !isDebug) {
    return <div className="centered-state">Checking your session...</div>;
  }
  if (!currentUser && !isDebug) {
    return <div className="centered-state">Redirecting to login...</div>;
  }

  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === STEPS.length - 1;
  const currentStep = STEPS[stepIndex];

  return (
    <main className="wiz-shell">
      <div className="wiz-card">
        <aside className={`wiz-side ${isFirstStep ? "wiz-side-hero" : ""}`}>
          <Link href="/" className="wiz-brand">
            <Image src="/assets/cartalogo.png" alt="Carta" width={110} height={30} priority />
          </Link>

          {isFirstStep ? (
            <div className="wiz-hero-copy">
              <h1>A few clicks away from your Carta profile.</h1>
              <p>Build your reusable civic context in minutes. Save time at every event.</p>
            </div>
          ) : (
            <StepRail current={stepIndex} goTo={setStepIndex} isDebug={isDebug} />
          )}

          <div className="wiz-side-art" aria-hidden="true">
            {currentStep.illustration}
          </div>
        </aside>

        <section className="wiz-main">
          <header className="wiz-top">
            {isDebug ? <span className="wiz-debug-pill">Debug mode</span> : <span />}
            <div className="wiz-top-actions">
              <button type="button" className="wiz-link" onClick={applyDemoData}>
                Use sample profile
              </button>
              <a className="wiz-help" href="mailto:hello@carta.app">
                Having trouble? <strong>Get Help</strong>
              </a>
            </div>
          </header>

          <form className="wiz-form" onSubmit={onSubmit}>
            {error ? <div className="error-box">{error}</div> : null}

            {stepIndex === 0 ? (
              <div className="wiz-step">
                <h2 className="wiz-title">Choose your account type</h2>
                <p className="wiz-subtitle">
                  Joining Carta is just a few steps away. Tell us how you&apos;re showing up.
                </p>
                <div className="wiz-choice-list">
                  <ChoiceCard
                    title="INDIVIDUAL"
                    subtitle="Student, volunteer, mentor, or independent participant"
                    icon={
                      <svg viewBox="0 0 24 24" width="22" height="22">
                        <circle cx="9" cy="9" r="3" fill="currentColor" />
                        <circle cx="17" cy="10" r="2.5" fill="currentColor" opacity="0.7" />
                        <path
                          d="M3 19c1-3 4-4 6-4s5 1 6 4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                        <path
                          d="M15 18c.5-2 2.5-3 4-3s3 1 3 3"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          opacity="0.7"
                        />
                      </svg>
                    }
                    selected={accountType === "individual"}
                    onClick={() => setAccountType("individual")}
                  />
                  <ChoiceCard
                    title="ORGANISATION"
                    subtitle="NGO, foundation, CSR team, or institutional partner"
                    icon={
                      <svg viewBox="0 0 24 24" width="22" height="22">
                        <path d="M4 21V8l8-5 8 5v13" fill="currentColor" />
                        <rect x="10" y="13" width="4" height="8" fill="#ffffff" />
                        <rect x="7" y="10" width="2" height="2" fill="#ffffff" />
                        <rect x="15" y="10" width="2" height="2" fill="#ffffff" />
                      </svg>
                    }
                    selected={accountType === "organisation"}
                    onClick={() => setAccountType("organisation")}
                  />
                </div>
                <div className="setup-note">
                  Profile being created: <strong>{profilePreview}</strong>
                </div>
              </div>
            ) : null}

            {stepIndex === 1 ? (
              <div className="wiz-step">
                <h2 className="wiz-title">Where are you based?</h2>
                <p className="wiz-subtitle">
                  We use this to match you with events and partners nearby.
                </p>
                <div className="form-grid two-col">
                  <div className="field">
                    <label htmlFor="city">City</label>
                    <input
                      id="city"
                      value={accountType === "individual" ? individual.city : organisation.city}
                      onChange={(event) =>
                        accountType === "individual"
                          ? setIndividual({ ...individual, city: event.target.value })
                          : setOrganisation({ ...organisation, city: event.target.value })
                      }
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="state">State</label>
                    <input
                      id="state"
                      value={accountType === "individual" ? individual.state : organisation.state}
                      onChange={(event) =>
                        accountType === "individual"
                          ? setIndividual({ ...individual, state: event.target.value })
                          : setOrganisation({ ...organisation, state: event.target.value })
                      }
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="country">Country</label>
                    <input
                      id="country"
                      value={accountType === "individual" ? individual.country : organisation.country}
                      onChange={(event) =>
                        accountType === "individual"
                          ? setIndividual({ ...individual, country: event.target.value })
                          : setOrganisation({ ...organisation, country: event.target.value })
                      }
                    />
                  </div>
                </div>
              </div>
            ) : null}

            {stepIndex === 2 ? (
              <div className="wiz-step">
                <h2 className="wiz-title">
                  {accountType === "individual" ? "About you" : "About your organisation"}
                </h2>
                <p className="wiz-subtitle">
                  {accountType === "individual"
                    ? "Details about your profile and current role."
                    : "Details about your organisation's name, type, and your role."}
                </p>

                {accountType === "individual" ? (
                  <div className="form-grid two-col">
                    <div className="field">
                      <label htmlFor="profileName">Display name</label>
                      <input
                        id="profileName"
                        value={individual.profileName}
                        onChange={(event) =>
                          setIndividual({ ...individual, profileName: event.target.value })
                        }
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="role">Which best describes you?</label>
                      <select
                        id="role"
                        value={individual.role}
                        onChange={(event) =>
                          setIndividual({ ...individual, role: event.target.value })
                        }
                      >
                        {[
                          "Student",
                          "NGO staff",
                          "Volunteer",
                          "Activist / movement organiser",
                          "Researcher",
                          "Funder / grantmaker",
                          "CSR / corporate representative",
                          "Mentor",
                          "Mentee",
                          "Freelancer / consultant",
                          "Other"
                        ].map((role) => (
                          <option key={role}>{role}</option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label htmlFor="affiliated">Affiliated with an organisation?</label>
                      <select
                        id="affiliated"
                        value={individual.affiliated}
                        onChange={(event) =>
                          setIndividual({ ...individual, affiliated: event.target.value })
                        }
                      >
                        <option>No</option>
                        <option>Yes</option>
                      </select>
                    </div>
                    {individual.affiliated === "Yes" ? (
                      <>
                        <div className="field">
                          <label htmlFor="individualOrg">Organisation name</label>
                          <input
                            id="individualOrg"
                            value={individual.organisationName}
                            onChange={(event) =>
                              setIndividual({
                                ...individual,
                                organisationName: event.target.value
                              })
                            }
                          />
                        </div>
                        <div className="field">
                          <label htmlFor="jobTitle">Job title / role</label>
                          <input
                            id="jobTitle"
                            value={individual.jobTitle}
                            onChange={(event) =>
                              setIndividual({ ...individual, jobTitle: event.target.value })
                            }
                          />
                        </div>
                      </>
                    ) : null}
                  </div>
                ) : (
                  <div className="form-grid two-col">
                    <div className="field">
                      <label htmlFor="organisationName">Organisation name</label>
                      <input
                        id="organisationName"
                        value={organisation.organisationName}
                        onChange={(event) =>
                          setOrganisation({
                            ...organisation,
                            organisationName: event.target.value
                          })
                        }
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="organisationType">Organisation type</label>
                      <select
                        id="organisationType"
                        value={organisation.organisationType}
                        onChange={(event) =>
                          setOrganisation({
                            ...organisation,
                            organisationType: event.target.value
                          })
                        }
                      >
                        {[
                          "NGO / CSO",
                          "Grassroots movement",
                          "Foundation / funder",
                          "Corporate CSR team",
                          "University / research institute",
                          "Social enterprise",
                          "Student organisation",
                          "Public-sector agency",
                          "Other"
                        ].map((type) => (
                          <option key={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label htmlFor="orgRole">Your role</label>
                      <select
                        id="orgRole"
                        value={organisation.role}
                        onChange={(event) =>
                          setOrganisation({ ...organisation, role: event.target.value })
                        }
                      >
                        {[
                          "Founder / director",
                          "Programme manager",
                          "Partnerships lead",
                          "Communications",
                          "Volunteer coordinator",
                          "Researcher",
                          "Other"
                        ].map((role) => (
                          <option key={role}>{role}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            {stepIndex === 3 ? (
              <div className="wiz-step">
                <h2 className="wiz-title">Your focus and network</h2>
                <p className="wiz-subtitle">
                  Pick the issues you care about and what you&apos;re looking to give and receive.
                </p>
                {accountType === "individual" ? (
                  <>
                    <CheckboxGrid
                      label="Issues you are interested in"
                      options={issueOptions}
                      values={individual.interests}
                      onChange={(values) => setIndividual({ ...individual, interests: values })}
                    />
                    <CheckboxGrid
                      label="What you're hoping to find"
                      options={individualSeeking}
                      values={individual.seeking}
                      onChange={(values) => setIndividual({ ...individual, seeking: values })}
                    />
                    <CheckboxGrid
                      label="What you can offer"
                      options={individualOffering}
                      values={individual.offering}
                      onChange={(values) => setIndividual({ ...individual, offering: values })}
                    />
                  </>
                ) : (
                  <>
                    <CheckboxGrid
                      label="Areas your organisation works on"
                      options={issueOptions}
                      values={organisation.focus}
                      onChange={(values) => setOrganisation({ ...organisation, focus: values })}
                    />
                    <CheckboxGrid
                      label="What your organisation is looking for"
                      options={organisationSeeking}
                      values={organisation.seeking}
                      onChange={(values) => setOrganisation({ ...organisation, seeking: values })}
                    />
                    <CheckboxGrid
                      label="What your organisation can offer"
                      options={organisationOffering}
                      values={organisation.offering}
                      onChange={(values) => setOrganisation({ ...organisation, offering: values })}
                    />
                  </>
                )}
              </div>
            ) : null}

            {stepIndex === 4 ? (
              <div className="wiz-step">
                <h2 className="wiz-title">A bit about you</h2>
                <p className="wiz-subtitle">
                  A few sentences Carta can reuse when matching you and registering you for events.
                </p>
                <div className="field">
                  <label htmlFor="context">
                    {accountType === "individual"
                      ? "Tell us briefly about yourself and who you hope to connect with."
                      : "Briefly describe your organisation, priorities, and desired connections."}
                  </label>
                  <textarea
                    id="context"
                    value={accountType === "individual" ? individual.context : organisation.context}
                    onChange={(event) =>
                      accountType === "individual"
                        ? setIndividual({ ...individual, context: event.target.value })
                        : setOrganisation({ ...organisation, context: event.target.value })
                    }
                  />
                </div>
              </div>
            ) : null}

            <div className="wiz-actions">
              {!isFirstStep ? (
                <button type="button" className="wiz-prev" onClick={goPrev}>
                  ← PREVIOUS STEP
                </button>
              ) : (
                <span />
              )}
              {isLastStep ? (
                <button className="btn btn-primary wiz-next" disabled={saving} type="submit">
                  {saving ? "Saving..." : "FINISH →"}
                </button>
              ) : (
                <button className="btn btn-primary wiz-next" type="button" onClick={goNext}>
                  NEXT →
                </button>
              )}
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
