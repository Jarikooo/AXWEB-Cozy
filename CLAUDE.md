# Cozy Maassluis - Project Rules

## Required Context
Before starting any feature work, read these files for project context:
- **PRD & Specs**: `.agentold/skills/cozy-ecommerce-prd.md` — business goals, target audience, tech stack, design system specs
- **Project Context**: `Cozy2/project-context.md` — what's been built, current state, what's next

## Tech Stack
- **Backend**: Medusa.js v2 (localhost:9000)
- **Frontend**: Next.js / React with Tailwind CSS (`Cozy2/storefront/`)
- **Payments**: Mollie (+ Klarna)
- **Database**: PostgreSQL
- **Design**: "Copenhagen Playful" — premium, clean, minimalist. Colors: Mint, White, Pink.

## Design Principles
- Conversion-first: people need to buy products, not be distracted
- "Personal Touch" USP — warm, inviting, curated by Sharon
- High contrast typography, no grey-on-pink accessibility issues
- Modern layouts with whitespace, avoid boxy 2015 grids
- Strict vertical color flow: Mint -> White -> Pink -> White -> Mint

## Key Conventions
- Use GSAP for animations and transitions
- Glassmorphic UI elements for premium feel
- Product cards use solid 1px zinc-950 borders
- All client-facing language must be simple ("Jip en Janneke" level)
- Medusa admin panel is single source of truth for inventory

## Local Services
- Medusa backend: http://localhost:9000
- Ollama LLM: http://localhost:11434 (qwen3:8b for LLM, nomic-embed-text for embeddings)
- Cognee knowledge graph: available via MCP server (has skill definitions + project knowledge ingested)

## Design Context

### Users
Dutch homeowners and gift shoppers (primarily women 25-45) browsing for curated Scandinavian-inspired home decor. They're looking to discover unique, personality-rich pieces that make their space feel "finished" — not mass-market, not intimidating high-design. They shop on mobile and desktop, often browsing casually before committing. The job to be done: find something beautiful that feels personally chosen, not algorithmically served.

### Brand Personality
**3 words:** Playful, Warm, Curated

**Voice & tone:** Friendly and approachable like a knowledgeable friend showing you around their favorite shop. Never corporate, never pretentious. Copy is simple and direct ("Jip en Janneke" level Dutch). Sharon's personal curation is the USP — the brand has a human face.

**Emotional goals:** Visitors should feel the warmth of walking into a beautifully styled space, with moments of playful surprise (micro-interactions, unexpected animations) that make browsing feel like discovery rather than transaction.

### Aesthetic Direction
**Visual tone:** "Copenhagen Playful" — the intersection of Scandinavian minimalism and Danish playfulness. Think Sostrene Grene's accessible warmth combined with editorial product photography.

**Reference:** Sostrene Grene — warm personality, playful Danish identity, accessible and inviting without feeling cheap. The sense that every product was hand-picked with care.

**Anti-references:** Generic Shopify templates, overly sterile minimalism (no Muji-cold), cluttered maximalism, dark/moody aesthetics, anything that feels mass-produced or algorithmic.

**Theme:** Light only. The mint/white/pink palette is inherently warm and light — dark mode would dilute the brand identity.

**Accessibility:** WCAG AA compliance. High contrast typography is non-negotiable — no grey-on-pink or low-contrast text.

### Design System Tokens
- **Primary:** `#f4258c` (hot pink) — CTAs, accents, badges
- **Mint:** `#e8f4f1` — section backgrounds, calm zones
- **Background:** `#f8f5f7` — page base
- **Foreground:** `#09090b` (zinc-950) — text, borders
- **Warm beige:** `#E6D5C3` — hero sections, warm accents
- **Font:** Manrope (all weights) — clean geometric sans-serif
- **Border radius:** 0px default (sharp, structured), `9999px` for pills/CTAs
- **Borders:** Solid 1px zinc-950 — the signature structural element
- **Shadows:** `sharp-shadow` (4px 4px 0px subtle) — adds depth without softness
- **Icons:** Material Symbols Outlined + Lucide React

### Design Principles
1. **Conversion through delight** — Every interaction should move the visitor closer to purchase, but through engagement and surprise, not pressure. Playful micro-interactions (GSAP, Framer Motion) reward exploration.
2. **Structured playfulness** — Sharp borders and grid discipline provide the structure; bold typography, color blocking, and animation provide the personality. The tension between order and whimsy is the brand's visual signature.
3. **Breathing room** — Generous whitespace between sections. The strict Mint → White → Pink → White → Mint color flow creates visual rhythm and prevents monotony without clutter.
4. **Tactile premium** — Glassmorphic overlays, parallax depth, noise textures, and magnetic interactions create a sense of physical presence. The interface should feel crafted, not templated.
5. **Sharon's living room** — Every design decision should pass the test: "Would this feel at home in a warm, beautifully curated Dutch living room?" If it feels cold, corporate, or generic — it doesn't belong.
