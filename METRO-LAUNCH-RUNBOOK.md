# Metro Launch Runbook (Frame replication)

Operating manual for launching the **next** Frame metro (e.g. Houston) fast **and** safely,
using the committed replication spine. One principle: **GBP-first, parameterize — never clone-and-swap.**

> Why this order matters (research, 2026): the binding constraint is the **Google Business
> Profile / listing layer**, not the website. And Google's March-2026 core update penalizes
> bulk look-alike location pages (50–80% traffic drops). Sequence + guardrails below exist to
> avoid those two failure modes.

## Critical path — these are on YOU (block everything downstream)
The tooling is ready; these business inputs are not, and nothing below can be filled without them:
- [ ] **License-matching GBP** for the metro — name identical to the LLC/license/signage.
- [ ] **Real local NAP** — a genuine operating address (NO PO box / virtual office → instant suspension) + a local tracking phone.
- [ ] **A few real local reviews** before any `AggregateRating` ships (else the city-quality gate red-blocks, correctly).

## Phase 1 — Config (the keystone)
- [ ] Copy `frame-restoration-texas-v2/data/route-factory/metro.config.json` as the template; fill: `metro`, `brand.domain`, `nap.*` (real metro NAP), `geo.hq*`, `backend.supabaseProjectRef` (NEW project — never reuse another metro's), `reviews.googleDataId`, `cities[]` (the metro's real service-area cities), `bannedMetros: ["utah","dfw"]`.
- [ ] Write `data/route-factory/nap.json` (`name`/`address`/`phone`) = the real metro NAP.
- **Gate:** config is the single source of truth; every later step reads it.

## Phase 2 — Backend
- [ ] Create a **fresh, isolated** Supabase project (README hard-rule: never reuse another metro's ref — the Utah→TX boundary lesson).
- [ ] Apply the 4 migrations + 5 functions (`handle-lead, lead-crm, review-request, track-click, verify-pin`); set secrets + `app_config`; wire `data-endpoint`.
- **Gate:** a test lead lands in `leads`.

## Phase 3 — Scaffold the shell
- [ ] `node local-business-template/scaffold.mjs --config <metro.config.json> --out ~/projects/frame-restoration-<metro> --trade roofing --apply`
- [ ] Fill the **33 human-input tokens** it reports (LEGAL_NAME, LICENSE_NUMBER, OWNER_*, TAGLINE, USP_1-4, ABOUT_*, GOOGLE_MAPS_*, colors, dates, etc.). The scaffolder auto-resolves the ~23 config-derived tokens.
- **Gate:** `grep -r "{{" ` returns 0 unresolved tokens before content.

## Phase 4 — Content (the real bottleneck — NO bulk drop)
- [ ] Generate city×service clusters with the `location-page-factory` skill; offload bulk drafts to `local-llm-toolkit` (`ollama-client.py`, $0); **Claude/human polish**.
- [ ] **Genuine local substance per city** (neighborhoods, landmarks, local storm/roof context) — not `{city}`-swap. Each page must clear the 30%-unique floor.
- [ ] Run the portable corpus gate before any publish: `python3 ~/.agents/skills/build-gate/scripts/build_gate.py "locations/*.html" --profile city --json`.
- **Gate:** `audit-city-quality.mjs` (corpus) + `build_gate.py --profile city` — 0 local-substance/differentiation reds and no `red-copy`, `red-structural`, or `red-block` pages.

## Phase 5 — Audit each batch (Claude↔Codex)
- [ ] Add the metro to `~/.config/frame-relay/projects.json` (see `templates/projects.example.json`); set the metro PII allowlist.
- [ ] Per batch: `frame-relay --project frame-<metro> audit-with-codex` → trust-tier verdict before merge. No auto-merge; business-facts (NAP/legal) are `red-block`.

## Phase 6 — Gates + rollout (staggered)
- [ ] CI: `compliance-gate.yml` (compliance-words, jsonld, links). **Recreate the lost `geo-leakage` gate** (`audit-geo-leakage.mjs`, `bannedMetros:["utah","dfw"]`) + wire it blocking. Flip `city-quality` to blocking once reviews/substance are real.
- [ ] **Ship in batches of 3–6 pages**, not one 40-page push (scaled-content signal).
- [ ] AEO spend → **earned mentions + Houston review velocity**, not schema tooling (97.4% of AI citations are earned media).

## ⛔ Hard guardrails (any one = a 2026 failure mode)
- No 40-page clone-drop (scaled-content-abuse demotion).
- No `AggregateRating` without real, verifiable metro reviews (gate red-block + FTC risk).
- No shared/duplicate GBP, virtual address, or name variant across metros (instant suspension).
- No inherited slugs — every slug **re-derived** from `cities[]` (the Provo-leak lesson); geo-leakage gate enforces.
- No city/service page publishes until build-gate returns only `green`/`yellow`; any `red-*` verdict blocks that page.

## State of the spine (2026-06-01)
✅ committed: `metro.config.json`+`nap.json` keystone (TX repo), `scaffold.mjs` (here), `frame-relay` v0.2.0 multi-project.
⏭️ pending: the **codemod** (refactor 114 TX literals to *read* the config — next session, clean branch); recreate the **geo-leakage** gate (lost); `#5` Supabase bootstrap script; `#6` measurement profiles.
