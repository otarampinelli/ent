## Claude Model Selection

Start every response with: **`[Using: Haiku/Sonnet/Opus]`**

This ensures transparent model selection and cost optimization across all Claude interactions with this project.

**Use Haiku (~90% of tasks):** Code reviews, linting, simple bug fixes, copy editing, straightforward debugging, refactoring isolated functions, simple data transformations.

**Use Sonnet (~9% of tasks):** Architecture decisions, implementing new features (multi-file changes), debugging complex issues (tracing flow, understanding interactions), performance optimization, expected response >1000 tokens or context >5000 tokens.

**Use Opus (~1% of tasks):** Novel architectural problems, complex system refactoring with architectural implications, cross-domain synthesis requiring multiple expertise areas.

**Quick heuristic:** Could a junior developer handle this, or does it need a senior engineer? Junior → Haiku, Mid-level → Sonnet, Principal → Opus.
