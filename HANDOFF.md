# HANDOFF — Frame metro-replication build (2026-06-02)

## Mission
Make launching the NEXT Frame metro fast + safe by PARAMETERIZING, not cloning.
Active metros: Utah → TX(DFW) → **Houston (TX)** → **Idaho** (NEW: different STATE).
DO NOT build Houston/Idaho content yet — build/keep the tooling spine; the user
runs each metro's GBP/legal in parallel.

## Read first
- Memory: `~/.claude/projects/-Users-agenticmac-projects-frame-restoration-texas-v2/memory/frame-metro-replication-model-2026-05-30.md`
  (full model, roadmap, status, Idaho compliance fence — the master doc).

## What's COMMITTED (and where)
| Piece | Repo | Branch | Pushed? |
|---|---|---|---|
| #4 frame-relay multi-project v0.2.0 (`src/projects.js` + `--project`) | `~/projects/frame-relay` | main | NO remote (local only) |
| #1 keystone `data/route-factory/metro.config.json` + `nap.json` | `~/projects/frame-restoration-texas-v2` | `feat/location-reviews-aeo-2026-06-01-clean` | unpushed |
| #3 `scaffold.mjs` (config-driven) + `METRO-LAUNCH-RUNBOOK.md` + this file | `~/projects/local-business-template` | main | unpushed |

## GOTCHAS (read before building)
1. **COMMIT INFRA IMMEDIATELY.** Earlier-session keystone/gate/CLAUDE.md were LOST —
   uncommitted on a `-clean` branch the user abandoned. The user spins a fresh
   `feat/...-clean` branch per task; uncommitted work vanishes.
2. **#2 geo-leakage gate is GONE and was NOT restored.** Its `audit-geo-leakage.mjs`
   + `compliance-gate.yml` wiring were lost; the user INTENTIONALLY reverted
   compliance-gate.yml to its 3-job original (compliance-words, jsonld, links). Do
   NOT re-add gate jobs without asking — respect the revert.
3. The TX repo's current uncommitted file(s) are the USER's location-reviews-AEO work — not yours.

## NEXT MOVES (prioritized)
1. **Codemod (#1 half-two)** — refactor the ~114 TX literals (domain in 114 HTML +
   6 supabase TS + workflows; NAP, phone, geo, GBP data_id, supabase ref) to READ
   from `metro.config.json`. Do it on a FRESH clean branch off main; verify with the
   audit scripts; commit immediately. Makes the config load-bearing vs documentation.
2. **Recreate the geo-leakage gate** (only if user wants): `audit-geo-leakage.mjs`
   reads `metro.config.json bannedMetros`; bans other metros' city/region tokens in
   shipped files; blanks HTML comments. Idaho → bannedMetros `["utah","dfw","houston"]`.
3. **Idaho `compliance-words.json`** (when user greenlights Idaho): SAME forbidden
   words as TX (public adjuster / negotiate family / deductible-waiver), swap statute
   refs TX(§4102.163 / HB 2102 / TDI) → ID (**§41-348** + **Idaho Code Title 41 Ch 58,
   Public Adjuster Licensing Act**). Idaho also needs RCE registration → LICENSE_NUMBER.
4. #5 Supabase bootstrap script (manual Phase-3 runbook → automated). #6 measurement
   profiles (`local-llm-toolkit/geo-tracker.py` + `lead-responder.py` Houston/Idaho configs).

## ON THE USER (parallel critical path — per metro, blocks everything downstream)
- License-matching GBP + REAL local NAP (no PO box / virtual office = suspension).
- Houston: 713/281/832 phone. **Idaho: Contractor Registration (RCE) via DOPL +
  Idaho attorney sign-off on swapped statute copy** before any ID content.
- Real reviews before any AggregateRating (gate red-blocks otherwise; FTC risk).
- Full guardrailed sequence: `local-business-template/METRO-LAUNCH-RUNBOOK.md`.

## PARKED (older thread, lower priority)
Rating-integrity: `scripts/fix-location-aggregate-rating.mjs` exists; 14 thin location
pages block flipping city-quality to blocking; `update-google-reviews.mjs` has a
ratingValue regex drift-bug (only matches 4.9/5.0) — fix to a generic decimal.

## HARD GUARDRAILS (any one = a 2026 failure mode)
No 40-page clone-drop (scaled-content-abuse). No AggregateRating without real reviews.
No duplicate / virtual-address GBP. Re-derive every slug from `cities[]` (the Provo-leak class).
