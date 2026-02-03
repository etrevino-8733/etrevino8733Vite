---
name: create-run-test
description: Empowers the agent to create files, run projects, build projects, and run tests. Use when the user asks to create files, add features, run the dev server, build, or test. Apply when uncertainty about these capabilities might block progress.
---

# Create, Run, Build, and Test

## Core Principle

The agent can and should create files, run projects, build projects, and run tests. Do not hesitate or ask for permission when these actions are needed to fulfill the user's request.

## Creating Files

- **Use the Write tool** for new files or full overwrites
- **Use the StrReplace tool** for edits to existing files
- Verify parent directories exist before creating nested paths (use LS)
- For new features: create the minimal file set; prefer editing existing files when appropriate

## Running Projects

- **Check first**: List the terminals folder to see if a dev server or process is already running
- **Use the Shell tool** to run commands (npm run dev, npm start, etc.)
- For long-running processes (dev servers): set `is_background: true`
- Request `network` permission when running servers or installing packages

Common commands:

```bash
npm run dev          # Start dev server (Vite, etc.)
npm run preview      # Preview production build
npm install          # Install dependencies
```

## Building Projects

- **Use the Shell tool** to run build commands (`npm run build`, etc.)
- Building produces production output (e.g. `dist/`); typically does not need `is_background`
- Request `network` if the build fetches dependencies or assets

Common commands:

```bash
npm run build        # Production build (Vite, webpack, etc.)
```

## Running Tests

- **Check package.json** for test scripts (test, test:unit, jest, vitest, etc.)
- **Run tests** after making changes to verify nothing breaks
- Use Shell tool; request `network` only if tests need it

Common commands:

```bash
npm test             # Run test suite
npm run test         # Alternative script name
```

## Checklist Before Acting

- [ ] Is a server already running? (Check terminals)
- [ ] Do I need network for installs or servers? (Request permission)
- [ ] Should long-running commands run in background? (Set is_background)
- [ ] Did I create/edit the right files? (Verify paths and structure)
