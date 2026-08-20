# Bre Thorup

I've spent a decade as the person businesses call when they know what's broken but
not what to build. I take fuzzy problems from non-technical stakeholders — physicians,
investors, restaurant owners, executive teams — scope them into a real system, build
it, and stay through adoption.

Founder of **Local AI, LLC** in Ocean Isle Beach, NC. Two former full-time employers
retained me as a paying client after I went independent, which is the outcome I'd
point to first.

Lately that has meant production AI: a multi-tenant RAG platform with per-organization
data isolation, a self-hosted real-time voice pipeline, and multi-agent automation on
Claude Code — all shipped solo, end to end.

---

### Things you can actually read

| Repo | What's in it |
| --- | --- |
| **[claude-agent-sandbox](https://github.com/brebuilds/claude-agent-sandbox)** | What actually restricts a spawned coding agent — and why `--allowed-tools` doesn't. Plus an atomic filesystem task queue built on `os.link` rather than `os.rename`, and a nonce-fenced prompt-injection defense. Verified behaviorally, not read off the docs. |
| **[etsy-mcp](https://github.com/brebuilds/etsy-mcp)** | MCP server for the Etsy Open API v3. Hand-rolled OAuth2 PKCE, automatic token refresh, multi-shop support. |
| **[mcp-clickup-bre](https://github.com/brebuilds/mcp-clickup-bre)** | MCP server covering ClickUp's API surface end to end — consistent auth, error mapping, and pagination across 100+ tools. |
| **[claude-skills](https://github.com/brebuilds/claude-skills)** | Eight Claude Code skills, including a multi-subagent research pipeline with context isolation and a mandatory secret-scan pre-flight. |
| **[theremin-vst](https://github.com/brebuilds/theremin-vst)** | JUCE / C++ VST3 plugin. Hand position to MIDI, so you can play any synth in the air. |

### Working with

Python · TypeScript · Next.js · Claude Agent SDK & MCP · n8n · Qdrant · PostgreSQL · Airtable · Sanity · Vercel · Hetzner

### Elsewhere

[breimagined.com](https://breimagined.com) · brethorup@gmail.com
