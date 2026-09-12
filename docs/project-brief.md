# Brewlucks — Project Brief

## Overview
Website for **Brewlucks**, a coffee bar. Premium, story-led presentation site (not a generic template) — photo/video heavy, bilingual (Bulgarian/English), dark editorial feel, tasteful animation throughout.

Instead of a standard contact form, inquiries and reservation requests are sent directly to **WhatsApp** (via the WhatsApp Cloud API).

**Timeline:** 2–3 weeks.

## Pages
- **Home** — scroll-driven video storytelling, including a section on how the signature drink is made
- **Gallery**
- **Full menu** — also serves as the landing page for a printed QR code
- **Contact**
- **Privacy policy**

## Key Features
- Language toggle (Bulgarian/English) — no separate URLs, client-side/state-based switching
- Scroll-driven video storytelling (GSAP + ScrollTrigger or similar)
- One simple inquiry/reservation form that submits straight to WhatsApp via the Cloud API (no traditional backend contact form/email flow)
- Fast, mobile-first build; clean and simple to maintain/update long term

## Assets & Content
- Client provides all photo/video assets and copy
- Client provides written **brand direction** (not exact design specs) — some design judgment is part of the job

## Tech Stack
- **Framework:** Next.js
- **Styling:** Tailwind CSS
- **Animation:** GSAP + ScrollTrigger (or similar scroll-driven animation solution)
- **Hosting:** Vercel
- **Integration:** WhatsApp Cloud API (for form submissions → WhatsApp messages)

## Requirements (from job posting, for context)
- Strong React/Next.js experience
- Good eye for premium, restrained visual design
- Comfortable picking up new tools/integrations on the fly
- Comfortable with AI coding tools (Claude Code, Cursor, etc.)

## Open Questions / To Clarify Later
- Exact WhatsApp Cloud API flow: business number, Meta app setup, message template requirements/approval
- Language toggle: implemented as a React context over static dictionaries (`src/i18n/`), persisted in `localStorage` via `useSyncExternalStore`. Keeps every page statically prerendered, at the cost of a brief Bulgarian-first paint for returning English visitors. Switch to a cookie read in the root layout if that flash needs to go (trades static prerender for per-request rendering).
- Video hosting/delivery strategy (self-hosted vs. CDN, format/compression for scroll-driven playback)
- Specific milestone breakdown for the 2–3 week timeline
- Brand direction document and asset folder — not yet received
