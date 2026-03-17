  Ingest all my skills and project context into the cognee graphRAG database.

  1. **Prune first**: Run mcp__cognee__prune to clear the database.

  2. **Read all skill files** at: [SKILLS_DIRECTORY, e.g. .claude/skills/*/SKILL.md]
     Also read project context at: [PROJECT_CONTEXT_FILES]

  3. **Create one condensed knowledge document**: Combine all skills into a single text block.
     For each skill, write a `## SKILL: [Name]` section with a 3-5 sentence summary of what it does,
     its expertise areas, and deliverables. Strip all code/YAML/CSS — only semantic knowledge.
     For project context, use `## PROJECT: [Name]`. Keep total under ~3000 words.

  4. **Cognify**: Send the combined text to mcp__cognee__cognify as inline data.

  5. **Wait and verify**: Check cognify_status until COMPLETED, then test with a CHUNKS search.

  Skills are at: [PATH]
  Project context: [PATH]

  ---
  Key principles: single combined document (cognee MCP only supports main_dataset), condensed prose over raw files (local LLM handles it better), always verify with CHUNKS search after completion.