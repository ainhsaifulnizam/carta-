# MyHack 2026 CivicGraph / NGO Relationship Intelligence Platform

This file is the working project memory for Farhan's Build With AI 2026 KL - MyHack project. When the actual repository is added, copy or adapt this into `AGENTS.md`, `README.md`, or a product/spec document so future Codex sessions preserve the product logic.

## Context

Farhan is participating in Build With AI 2026 KL - MyHack, 16-17 May 2026. The challenge statement is "Automating Ecosystem Linkages Instead of Manual Coordination." The core requirement is an AI-enabled platform that treats innovation ecosystem relationships as first-class, programmable entities rather than one-off manual assignments.

The platform should help define, automate, govern, track, reuse, and improve linkages across programmes, geographies, and ecosystem actors. Relevant relationship examples include mentor-to-company, company-to-programme, partner-to-initiative, service-provider-to-actor, NGO-to-funder, NGO-to-CSR actor, intern-to-organisation, and movement group-to-campaign collaborator.

Hackathon judging values meaningful Google Developer technology usage, essential AI, appropriate model choice, ethical AI, hallucination mitigation, privacy, transparency, a functional prototype, intuitive UI/UX, evidence of AI performance, originality, problem-solution fit, scalability, business viability, deployment readiness, and a strong demo.

## Product Essence

The product is an AI-powered civic relationship intelligence platform for NGOs and civil society actors. It helps NGOs manage events while converting event participation into a persistent, AI-structured civic relationship graph that compounds across organisations, events, geographies, and opportunities.

Short description:

> Luma meets Skipso, but for NGOs - with a geographically mapped, AI-powered civic relationship graph underneath.

More precise framing:

> An AI-powered civic ecosystem platform that helps NGOs turn events into compounding relationship infrastructure: every registration enriches a structured civic database, every participant receives personalised networking recommendations, and every event strengthens a broader inter-organisational ecosystem map.

Strongest insight:

> NGOs do not lack convenings. They lack memory. Every workshop, briefing, roundtable, or civic event creates valuable relationship data, but most of it disappears into registration forms, inboxes, and personal memory. This platform turns each event into a compounding network asset.

Do not frame the product merely as an event management tool, networking app, CRM, or AI matchmaking widget. Frame it as:

> A civic relationship intelligence platform that converts event-based interactions into reusable, explainable, programmable ecosystem linkages.

The core insight is that events are the recurring data-ingestion layer through which civil society ecosystems become more legible, connected, and actionable over time.

## Frontend Product Principle: First-Order Civic Profiles

The frontend should treat user and organisation profiles as first-order entities, not as disposable event signup records. A first-time signup should capture enough basic, non-intrusive demographic and civic context to make future event registration lightweight.

The goal is:

> A user creates one durable civic profile with the platform, then joins future events without repeatedly re-entering the same identity, location, organisation, interest, seeking, and offering information.

Event registration should usually be a confirmation and context layer:

- Confirm attendance for a specific event.
- Reuse the existing profile by default.
- Allow the user to review or update reusable profile fields if they have changed.
- Ask only event-specific additional questions when necessary.
- Store event-specific answers separately from permanent profile fields.

### First-Time Signup Fields

First-time signup should collect basic, non-intrusive information that can power matching, map filters, and ecosystem insights without feeling overly invasive:

- Name.
- Email.
- Role/title.
- Organisation name, if any.
- Organisation type, if any.
- City/state/country.
- Short bio or "tell us about your work".
- Issue interests.
- What the user is seeking.
- What the user can offer.
- Actor type, either selected or AI-inferred.
- Optional profile visibility preference.

Avoid sensitive demographic collection unless it is clearly justified, optional, and transparent. For the MVP, demographic/contextual information should focus on civic role, geography, organisation, interests, needs, and offerings rather than protected personal attributes.

### Event Registration Fields

For most events, registration should be minimal because the platform already has a profile:

- Attendance confirmation.
- Optional event-specific intent, such as "What are you hoping to get from this event?"
- Optional dietary/accessibility needs if relevant.
- Optional consent for event-specific networking visibility.
- Additional custom questions only if the organiser needs them.

This supports the product thesis: events become a recurring data-ingestion layer, but the platform's durable memory lives in reusable actor profiles and relationship objects.

### Frontend UX Implication

Design the signup and event flows as:

1. Create profile once.
2. AI enriches the reusable profile.
3. Event signup pre-fills from that profile.
4. User answers only event-specific questions.
5. Event participation creates or updates relationship objects.

This should be visible in the UI. The user should feel: "I already have a civic profile here; joining another event is easy."

## AI Chatbot / Connector Agent: Tautai

The platform should include an in-app AI chatbot option named **Tautai**. Tautai is not a generic assistant; it is a connector agent that helps users translate natural-language intent into concrete relationship, event, and workflow actions inside the platform.

Default role:

> Tautai is a connector that serves the best interest of the profile the user has ascribed themselves as.

This means Tautai should adapt to the user's profile context. For example, if a user is an emerging advocate seeking internships, Tautai prioritises relevant internship, mentorship, and collaboration pathways. If a user is an NGO programme manager seeking CSR partners and interns, Tautai prioritises funders, CSR actors, interns, collaborators, and relationship follow-ups. If a user is a funder or CSR actor, Tautai prioritises credible civic initiatives and organisations aligned with their goals.

Tautai should be straight-to-the-point. It should avoid long generic explanations and instead convert user intent into clear proposed actions.

Example user requests:

- "I want to connect with people working on gender equality internships."
- "Help me respond to event applications."
- "Rank people by how much they want to engage with my programme."
- "Find CSR partners for this event."
- "Who should I follow up with after the roundtable?"
- "Draft an intro request to Aina."
- "Show me under-connected Sabah digital inclusion groups."

Before executing any meaningful command, Tautai should translate the user request into actionable steps and ask for confirmation.

Example interaction:

User:

> Find people I should connect with for internships.

Tautai:

> I can do that. I will:
> 1. Filter attendees who are offering internships or mentorship.
> 2. Prioritise people aligned with your interests in gender equality and digital safety.
> 3. Return the top matches with reasons and confidence scores.
> Proceed?

Only after the user confirms should Tautai execute the action.

### Tautai Action Model

Tautai should eventually support actions such as:

- Search people, organisations, relationships, and events.
- Recommend connections based on the user's profile.
- Rank attendees or applicants by likely relevance or engagement intent.
- Draft introduction requests.
- Help organisers respond to event applications.
- Summarise an event's networking opportunities.
- Create or update relationship objects.
- Save matches.
- Suggest follow-up actions.
- Answer questions about the user's civic graph.

For the MVP, Tautai can begin as a frontend chatbot panel with mock/tool-stubbed actions. The integration should remain open for Gemini later.

Implementation principle:

- Keep the chat UI provider-agnostic.
- Define Tautai intents/actions separately from the model provider.
- Allow Gemini or Vertex AI Gemini to power intent extraction, summaries, ranking, and recommendation generation later.
- Use structured JSON for Tautai action plans and outputs.
- Do not let Tautai silently mutate important records. Confirm before creating introductions, saving relationships, sending responses, ranking applicants for a consequential decision, or changing statuses.

### Tautai Safety And Transparency

Tautai should:

- Show the interpreted intent before acting.
- Show the proposed action plan before acting.
- Ask for user verification before execution.
- Explain ranking and matching reasons briefly.
- Distinguish profile facts from AI inferences.
- Avoid making claims unsupported by stored profile, event, or relationship data.
- Treat ranking as decision support, not an automatic final decision.
- Preserve privacy by using only data the user is allowed to access.

## Primary Layers

### 1. Intra-Organisation Event Management

This is the NGO-facing event operations and data-ingestion layer. It helps an NGO create and manage an event, collect structured and semi-structured participant data, enrich that information with AI, and generate event-level intelligence for organisers.

Key functions:

- Create and manage an event.
- Choose event templates such as networking session, workshop, civic roundtable, funding clinic, or coalition-building forum.
- Enter event title, host organisation, date/time, location, format, issue themes, and description.
- Manage registration and attendee lists.
- Generate event information packs and possible helpdesk/FAQ support.
- Future possibility: chatroom or community room.

First-time signup and reusable civic profile creation should capture:

- Name, email, organisation, role/title, city/state/country.
- Background or short bio.
- Organisation/project description.
- Issue interests: gender equality, climate justice, digital rights, youth empowerment, education, disability inclusion, migrant rights, labour rights, civic technology, community development.
- Relationship intent: funding, CSR partnership, internship, volunteers, mentors, mentees, movement-building, research collaboration, campaign partners, hiring/recruitment, service providers.
- Offerings: funding, expertise, internships, jobs, training, community access, research support, campaign support, technical tools, mentorship.
- Free text: what they hope to find from the event and a short description of their work/project/organisation.

Event registration should reuse these profile fields and only ask extra event-specific questions when necessary.

AI profile enrichment should generate:

- Concise participant summary.
- Concise organisation summary.
- Structured interest tags.
- Structured seeking/offering tags.
- Inferred actor type such as advocate, funder, CSR representative, researcher, programme manager, student, emerging organiser, intern seeker, internship seeker, mentor, or mentee.

Organiser-side event insights should include patterns such as dominant themes, common intents, potential CSR-NGO linkages, geographic distribution, and gaps such as high funding demand but low funder presence.

MVP dashboard metrics:

- Total registrants.
- Organisations represented.
- Top interest areas.
- Role breakdown.
- Seeking/offering breakdown.
- City/state distribution.

### 2. Participant Personalised Dashboard

This is the individual-facing relationship discovery layer. Each attendee should feel the platform helps them find the right people, organisations, and opportunities, not merely register for an event.

Core persona:

> Yee Hui, an aspiring gender equality advocate, attends an event and wants to find internships, mentors, or collaborators.

The platform should help Yee Hui match with people like Aina, a programme manager at an NGO seeking interns; a CSR representative funding youth digital safety; a researcher looking for community partners; or a movement organiser with similar advocacy goals.

Key functions:

- Personal AI-generated profile.
- Visible role, location, interests, seeking, offering, and summary.
- "Top Connections for You" recommendations.
- Tautai chatbot panel for natural-language connection and workflow requests.
- Relationship labels: internship match, CSR match, collaboration match, funding match, movement-building match, mentorship match.
- Match confidence score.
- AI-generated reasons for each match.
- Request Introduction, Save Match, and Express Interest actions.

Prompt-based network search examples:

- "I want to meet someone offering internships in gender equality."
- "Find a funder who may support youth civic tech."
- "Who should I talk to if I want to collaborate on digital safety?"
- "Find someone working on migrant rights in East Malaysia."

For the hackathon MVP, limit this to match recommendations, prompt-based search, Tautai action-plan confirmation, and introduction/save buttons.

### 3. Inter-Organisation Civic Ecosystem Intelligence

This is the platform-level, cross-event, cross-organisation intelligence layer. It helps NGOs, funders, and civic network builders understand who is active where, which organisations care about what, what relationship needs exist, where collaboration gaps are, and which high-value linkages should happen next.

Organisation profiles should include:

- Name, location, organisation type.
- AI-generated description.
- Focus areas.
- Seeking tags such as funding, CSR support, interns, volunteers, research partners, campaign collaborators, capacity-building.
- Offering tags such as funding, training, expertise, internship opportunities, community access, advocacy capacity, technical tools.
- Events attended or hosted.
- Relevant individual members connected to the organisation.

Geographic civic ecosystem map should show NGOs, funders, CSR actors, movements, student groups, researchers, civic organisations, and issue communities across locations such as Kuala Lumpur, Selangor, Penang, Johor, Sabah, Sarawak, and eventually Southeast Asia.

Map filters:

- Issue area: gender equality, digital rights, climate, education, youth, disability, migrant rights, public health, civic tech.
- Relationship intent: CSR, movement-building, internship, collaboration, funding, research partnership, mentorship, volunteering.
- Actor type: NGO, funder, CSR actor, student, researcher, programme manager, grassroots group, service provider.

Example map queries:

- "Show youth-led environmental organisations in Penang and Selangor seeking CSR collaboration."
- "Show digital safety actors in East Malaysia."
- "Where are organisations seeking funding for gender advocacy?"
- "Which organisations offer internships related to civic technology?"
- "Where are movement-building actors concentrated geographically?"

Ecosystem-level insights should identify under-connected actors, geographic gaps, latent collaboration opportunities, and recurring intent patterns.

### 4. Reusable Relationship Registry

The central alignment with the hackathon brief is that relationships are first-class system entities. Every meaningful linkage generated through the platform should become a structured object that can be stored, queried, governed, updated, reused, and learned from.

Relationship types:

- Person to person.
- Person to organisation.
- Organisation to organisation.
- Participant to internship opportunity.
- NGO to CSR partner.
- NGO to funder.
- Movement group to campaign collaborator.
- Researcher to civic partner.
- Mentor to mentee.

Relationship fields:

- Relationship ID.
- Relationship type.
- Source actor and target actor.
- Source actor type and target actor type.
- Originating event.
- Originating organisation.
- Relationship rationale.
- AI confidence score.
- Status: suggested, saved, introduction requested, introduced, active, inactive, closed.
- Tags: CSR, funding, internship, movement-building, collaboration.
- Timestamp.
- Optional follow-up notes or outcomes.

Example:

```json
{
  "id": "rel_001",
  "type": "internship_match",
  "sourceType": "user",
  "sourceId": "user_001",
  "targetType": "user",
  "targetId": "user_002",
  "originEventId": "event_001",
  "confidence": 0.91,
  "status": "suggested",
  "explanation": "Yee Hui seeks a gender advocacy internship; Aina is a programme manager at an NGO currently looking for interns."
}
```

### 5. Compounding Civic Graph

Strategic flywheel:

> Events create data -> data creates profiles -> profiles create matches -> matches create relationship objects -> relationships generate ecosystem intelligence -> future events become smarter.

The platform becomes more valuable with every event hosted. A strong positioning line:

> Every event makes the map smarter; every relationship makes the ecosystem more navigable.

## Differentiation

### Luma

Luma helps users create and host events, manage registration, build event pages, maintain calendars/audiences, and support lightweight attendee/community interaction.

Difference:

> Luma helps NGOs host events; we help NGOs retain and compound the relationships those events create.

### Evenesis

Evenesis focuses on professional event management, registration, conference workflows, check-in, attendee engagement, and event analytics.

Difference:

> Evenesis helps organisers execute events; we turn events into long-term relationship infrastructure.

### Skipso

Skipso is closest. It supports innovation ecosystem and programme management, stakeholder directories, dashboards, open innovation workflows, AI matchmaking, and ecosystem administration.

Difference:

> Skipso starts from ecosystem/programme management and adds matchmaking. We start from events - the most common and recurring coordination primitive in civil society - and use them to build a compounding relationship graph. That gives NGOs immediate utility on day one while generating long-term inter-organisational intelligence that grows more valuable with every convening.

Additional differentiation:

- NGO/civil society native.
- Events are the data acquisition wedge.
- Personalised attendee dashboard is central.
- Geographic civic ecosystem mapping is core.
- Civic-sector relationship intents are first-class: CSR, movement-building, internships, collaborations, funding.

## Pitch

Problem:

> Civil society convenes constantly, but the intelligence generated through those convenings rarely compounds. Participant data stays fragmented across forms, event lists, and individual memory. As a result, NGOs repeatedly rebuild the same networks from scratch, while opportunities for funding, CSR partnerships, internships, movement-building, and collaboration are missed.

Solution:

> We turn events into an AI-powered civic relationship engine. Every registration enriches a structured people-and-organisation database, every participant receives personalised networking recommendations, and every convening strengthens a geographically mapped civic ecosystem graph.

Taglines:

- Turn NGO events into compounding civic infrastructure.
- Where every convening becomes a network asset.

Category:

- Civic Relationship Intelligence Platform.
- Event-Native Civic Ecosystem Graph.

## Hackathon MVP

Recommended MVP scope:

> One event. Six attendees. Four organisations. One map. One personalised dashboard. Two AI actions.

Flagship event:

> Youth Digital Safety Roundtable 2026 - Kuala Lumpur

Demo personas:

- Yee Hui - student / aspiring gender equality advocate; seeking internships and mentorship.
- Aina - programme manager at a women's rights NGO; seeking interns, collaborators, and CSR partners.
- Daniel - CSR manager at a telecom company; looking for youth digital safety initiatives to support.
- Nadia - organiser at a youth civic tech collective; seeking campaign collaborators.
- Borneo Digital Access Network - Sabah-based NGO; seeking funding and partners around digital inclusion.

Demo story:

1. NGO hosts the Youth Digital Safety Roundtable.
2. Attendees register through a smart form.
3. AI enriches one or more participant and organisation profiles.
4. Event console displays attendee summaries and high-level event insights.
5. Yee Hui opens her personalised dashboard.
6. AI recommends Yee Hui to Aina as an internship match, Aina's NGO to Daniel's CSR unit as a CSR/funding match, and Nadia's collective to Aina's NGO as a movement collaboration match.
7. The ecosystem map shows organisations geographically with filters for funding, CSR, internship, collaboration, and movement-building.
8. A map-level AI insight highlights under-connected digital inclusion actors in East Malaysia.
9. The platform stores generated opportunities as structured relationship objects in a relationship registry.
10. The pitch explains that future events compound this network intelligence further.

## MVP Functions

Intra-organisation:

- Event detail page.
- Smart registration form.
- Registrant database/list.
- Registration fields for interests, seeking, offering.
- AI-generated participant summary.
- AI-generated organisation summary.
- Event insight cards.
- Metrics for registrants, organisations, top interests, seeking/offering distribution.

Participant dashboard:

- Personal profile card.
- AI top matches.
- Match labels for internship, CSR, funding, collaboration, movement-building.
- Confidence score.
- Match explanation.
- Prompt-based network search.
- Tautai chatbot panel that turns user intent into proposed actions.
- Confirmation step before Tautai performs an action.
- Request Introduction / Save Match buttons.

Inter-organisation:

- Organisation profile cards.
- Geographic ecosystem map.
- Filters by funding, CSR, internship, collaboration, movement-building.
- Filters by geography or issue area where possible.
- AI-generated organisation-to-organisation match card.
- AI-generated ecosystem insight card.
- Visual indication of opportunity concentration or gaps.

Cross-cutting:

- Relationship registry.
- Structured relationship objects.
- Tautai action plans and action logs.
- Show that matches persist as system entities rather than one-off AI outputs.

## Suggested Stack

- Frontend: Next.js + TypeScript + Tailwind.
- Database: Firebase Firestore.
- AI: Gemini API or Vertex AI Gemini.
- AI chatbot: Tautai, implemented as a provider-agnostic frontend/chat action layer first, then connected to Gemini later.
- Map: Google Maps JavaScript API.
- Deployment: Firebase Hosting, Vercel, or Cloud Run.
- Optional auth: Firebase Auth only if time allows.

Use structured JSON outputs for AI-generated enriched profiles, recommendations, relationship recommendations, Tautai action plans, and ecosystem insights. This reduces hallucination risk, improves frontend reliability, and supports rubric points around model quality and robustness.

## Shared Data Model

Recommended collections/entities:

1. `users`
2. `organisations`
3. `events`
4. `registrations`
5. `relationships`
6. `insights`
7. `tautaiSessions`
8. `tautaiActions`

Sample `users`:

```json
{
  "id": "user_001",
  "name": "Yee Hui",
  "organisationId": null,
  "role": "Student / Emerging Advocate",
  "location": "Kuala Lumpur",
  "interests": ["gender equality", "digital safety"],
  "seeking": ["internship", "mentorship"],
  "offering": ["research assistance", "social media support"]
}
```

Sample `organisations`:

```json
{
  "id": "org_001",
  "name": "HerVoice Malaysia",
  "location": "Selangor",
  "focusAreas": ["gender equality", "youth advocacy", "digital safety"],
  "seeking": ["interns", "CSR partners", "funding"],
  "offering": ["community access", "training", "campaign collaboration"]
}
```

Sample `events`:

```json
{
  "id": "event_001",
  "title": "Youth Digital Safety Roundtable 2026",
  "hostOrganisationId": "org_010",
  "date": "2026-05-17",
  "location": "Kuala Lumpur",
  "theme": ["digital safety", "youth advocacy"]
}
```

Sample `registrations`:

```json
{
  "id": "reg_001",
  "eventId": "event_001",
  "userId": "user_001",
  "rawSignupResponse": "I am interested in joining gender equality advocacy and would like to find internship or mentorship opportunities.",
  "aiProfileSummary": "Yee Hui is an emerging gender equality advocate seeking internships and mentorship in youth digital safety work.",
  "actorType": "emerging advocate"
}
```

Sample `insights`:

```json
{
  "id": "insight_001",
  "scope": "ecosystem_map",
  "text": "Sabah-based digital inclusion groups show visible funding needs but fewer cross-organisational linkages than KL-based groups.",
  "generatedAt": "2026-05-17T09:00:00Z"
}
```

Sample `tautaiSessions`:

```json
{
  "id": "tautai_session_001",
  "userId": "user_001",
  "roleContext": "emerging advocate seeking internships and mentorship",
  "createdAt": "2026-05-17T09:10:00Z"
}
```

Sample `tautaiActions`:

```json
{
  "id": "tautai_action_001",
  "sessionId": "tautai_session_001",
  "userId": "user_001",
  "rawUserRequest": "Find people I should connect with for internships.",
  "interpretedIntent": "Find internship and mentorship matches aligned with the user's civic profile.",
  "proposedActions": [
    "Filter attendees offering internships or mentorship",
    "Prioritise matches aligned with gender equality and digital safety",
    "Return top matches with reasons and confidence scores"
  ],
  "status": "awaiting_confirmation"
}
```

## Division Of Labour

Farhan should own:

- Shared data model / schema.
- Event registration flow.
- Intra-organisation event console.
- AI profile enrichment.
- Firestore data writing for events, registrations, and profiles.

Partner should own:

- Inter-organisation ecosystem intelligence.
- Geographic map.
- Organisation profiles.
- Map filters and civic cluster view.
- AI-generated ecosystem insight cards.

Together:

- Personalised participant dashboard.
- Matching logic and recommendation display.
- Relationship registry.
- Final demo flow.
- Pitch storytelling and visual integration.

Strong formulation:

> Farhan builds the event data ingestion layer and shared data model. His partner builds the ecosystem visualisation and inter-organisational intelligence layer. Together they build the personalised relationship dashboard that ties both halves together.

## Build Order

1. Agree on product framing and demo story.
2. Finalise shared data model.
3. Scaffold app shell with three pages: Event Console, Personal Dashboard, Ecosystem Map.
4. Add mock data.
5. Build Event Console.
6. Build Ecosystem Map.
7. Build Personal Dashboard.
8. Add Tautai chatbot UI with mock action-plan confirmation.
9. Add Gemini profile enrichment.
10. Add Gemini recommendation generation.
11. Connect Tautai to Gemini or keep it mocked if time is short.
12. Add relationship registry persistence.
13. Polish demo and pitch story.
14. Prepare finals deck if selected.

Do not prioritise full auth, live chatroom, complex helpdesk bot, full admin permissions, payments, true longitudinal learning, complex graph database, massive backend architecture, or advanced multi-tenant SaaS controls in the initial MVP.

## Codex Workflow Guidance

Farhan is a first-time vibe-coder. His partner is using Claude Pro and Gemini to create the basic software structure. Codex should be used for codebase edits, scaffolding, wiring pages, fixing build errors, adding components, and integrating features.

Recommended workflow:

- Use Codex for bounded, testable implementation tasks.
- Use Claude/Gemini for copy refinement, conceptual prompting, product logic review, prompt engineering, and mock data design.
- Avoid two agents editing the same files chaotically.
- Work in separate Git branches and merge regularly.
- Maintain `AGENTS.md` once the repo exists.

Good Codex prompts:

- "Create a Next.js dashboard shell with three routes."
- "Build the event console using existing mock data."
- "Add a registration form that appends to local state."
- "Create a map view with mock organisation pins."
- "Build a dashboard match card component."

Each prompt should specify:

- What to build.
- What not to build.
- Whether to use mock data or real backend.
- Requirement to run the build and fix errors.
- Request to summarise changed files.

## Simple Platform Structure

| Layer | Core Function | Key Features |
| --- | --- | --- |
| Intra-Organisation Event Management | Helps NGOs organise events and convert registration data into structured civic intelligence. | Event creation, smart registration forms, attendee database, AI-generated participant and organisation profiles, event-level insights. |
| Participant Personalised Dashboard | Helps individuals discover relevant people, organisations, and opportunities based on their interests and goals. | Personal profile, AI-recommended matches, prompt-based network search, opportunity feed, introduction requests. |
| Inter-Organisation Ecosystem Intelligence | Helps NGOs identify broader civic structures, potential partnerships, and ecosystem gaps across events and geographies. | Organisation profiles, geographic ecosystem map, filters by CSR/funding/internship/collaboration/movement-building, cross-organisation matching, ecosystem insights. |
| Reusable Relationship Registry | Stores all AI-generated or user-confirmed linkages as reusable, structured relationship objects. | Person-to-person, person-to-organisation, and organisation-to-organisation linkages; relationship type, origin event, explanation, confidence score, and status. |
| Compounding Civic Graph | The long-term intelligence layer that becomes more valuable as more events, people, and organisations enter the system. | Cross-event memory, stronger future matching, visibility into emerging civic clusters, under-connected actors, and recurring collaboration opportunities. |

Simple flow:

1. NGOs host events.
2. Participants register and provide background, interests, and what they are seeking/offering.
3. AI converts registration data into structured participant and organisation profiles.
4. The data feeds the Participant Dashboard and Inter-Organisation Intelligence layers.
5. Suggested or confirmed connections are stored in a Relationship Registry.
6. Over time, these relationships compound into a Civic Graph that improves future events, partnerships, and ecosystem coordination.

## One-Sentence Essence

This project is an AI-powered civic relationship intelligence platform that uses NGO events as the data-ingestion layer for building a compounding, geographically mapped ecosystem graph of people, organisations, needs, offerings, and high-value opportunities across funding, CSR, internships, collaborations, and movement-building.
