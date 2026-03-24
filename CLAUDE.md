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
- Product cards use solid 1px zinc-950 borders
- All client-facing language must be simple ("Jip en Janneke" level)
- Medusa admin panel is single source of truth for inventory

## Local Services
- Medusa backend: http://localhost:9000
- Ollama LLM: http://localhost:11434 (qwen3:8b for LLM, nomic-embed-text for embeddings)
- Cognee knowledge graph: available via MCP server (has skill definitions + project knowledge ingested)

## Whole Codebase Searches
- When asked to search, check, or analyze the "whole codebase", you MUST prioritize using the `github` MCP server tools to search the remote repository instead of manually searching all local files piece-by-piece. This ensures a faster and more comprehensive search.
The github repo we're working on currently: https://github.com/Jarikooo/AXWEB-Cozy.git
this does not account for anything that has not been committed yet.

## Bug reporting
- When I report a bug or when you find a bug, don't start by trying to fix it. Instead, start by writing a test that reproduces the bug. Then, have subagents try to fix the bug and provit it with a passing test.

## Duplicated table in migrations
- This is a signature of AI slop code, never duplicate tables in migrations. Find other solutions for this

## Components
- Never create a component longer than 150 lines. If this exceeds this, split it into smaller components automatically. Always seperate UI from logic.

## Functions
- When creating functions / features, complete and test them before actually implementing them into the environment

## Documentation
- After writing any code, document it in the project-context.md file, in this documentation we keep track of what has been done and what state the code is in.