# Carta Codex Working Notes

This repository is for the MyHack 2026 CivicGraph / NGO relationship intelligence platform.

Codex-created product memory, prompts, specs, and implementation notes should live under `docs/codex/` and `docs/product/` so they do not get mixed into app source files.

When implementing:

- Keep user profiles as first-order durable civic profiles.
- Keep event registrations lightweight and event-specific.
- Treat relationships as first-class persisted objects.
- Keep Tautai provider-agnostic until Gemini integration is added.
- Before Tautai executes a meaningful action, show the interpreted intent and proposed action plan, then ask for confirmation.

