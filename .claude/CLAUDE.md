# {{BRAND_NAME}} — Project Context

## Client Info
- **Business:** {{LLC_NAME}}
- **Brand Name:** {{BRAND_NAME}}
- **Owner:** {{OWNER_NAME}} ({{OWNER_EMAIL}})
- **Phone:** {{PHONE_DISPLAY}}
- **Address:** {{ADDRESS}}
- **License:** {{LICENSE_NUMBER}}
- **Trade:** {{TRADE}}

## Live Site
- **Domain:** {{DOMAIN}}
- **Hosting:** Vercel (push to `main` = auto-deploy)
- **GitHub:** Rconman99/{{REPO_NAME}}

## Tech Stack
- Static HTML + CSS + vanilla JS (no framework)
- Supabase backend (edge functions for lead handling)
- Twilio SMS/Voice
- Formspree email notifications
- PostHog analytics
- Google Search Console for SEO
## Supabase
- **Project ID:** {{SUPABASE_PROJECT_ID}}
- **Region:** us-west-1
- **Edge Functions:** handle-lead, handle-call, handle-sms, lead-report
- **Tables:** leads, call_logs, app_config

## Twilio
- **Phone Number:** {{TWILIO_PHONE}}
- **Messaging Service SID:** {{TWILIO_MSG_SID}}
- **Owner forwarding number:** {{OWNER_PHONE}}

## Brand
- **Colors:** Navy {{NAVY}}, Gold {{GOLD}}, Off-white {{OFF_WHITE}}
- **Fonts:** Archivo Black (headings), Archivo (body)
- **Logo:** /images/logos/logo-main.webp

## Site Structure
- `index.html` — Homepage with hero, services, gallery, testimonials, contact form
- `pages/` — About, gallery, service pages, location pages
- `blog/` — Blog posts
- `locations/` — City-specific landing pages
- `privacy.html`, `terms.html` — Legal pages (required for 10DLC compliance)
- `global-modal.js` — Self-contained lead capture modal

## Forms & Lead Flow
- 3 forms: heroForm, leadForm, frModalForm (global modal)
- All POST to Supabase `handle-lead` edge function
- Lead flow: Form → handle-lead → Supabase leads table → email via Formspree → SMS to owner via Twilio
## Critical Rules
1. Use Desktop Commander for ALL file edits (sandbox doesn't sync to Mac)
2. Git push to `main` auto-deploys to Vercel — test before pushing
3. Homepage gallery is a FIXED 5-item CSS grid — do NOT add more items to index.html gallery
4. Gallery page (`pages/gallery.html`) uses auto-fill grid — unlimited items OK
5. Blog posts MUST use blog-hero/blog-body CSS classes with embedded style block
6. All forms must include SMS consent text linking to /privacy and /terms
7. Schema.org LocalBusiness JSON-LD is in index.html <head> — keep sameAs and reviewCount updated

## Deploy
```bash
cd /Users/agenticmac/projects/{{REPO_NAME}}
git add -A && git commit -m "description" && git push origin main
```

## Key Contacts
- **Ryan Conwell** (site manager): ryanconwell99@gmail.com, +12065517537
- **{{OWNER_NAME}}** (owner): {{OWNER_EMAIL}}, {{OWNER_PHONE}}