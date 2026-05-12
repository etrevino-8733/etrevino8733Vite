---
description: Agent task discipline - scope, clarification, incremental implementation
alwaysApply: true
---

# Agent Task Discipline

## Scope

- **Never change code that was not asked for.** Only modify what the user requested.
- Do not add "improvements," refactors, or fixes unless explicitly requested.

## Clarification Over Assumptions

- **Do not make assumptions.** If the task is unclear or you have questions, ask the user for clarification before implementing.
- Resist inferring or guessing requirements; ask instead.

## Incremental Implementation

- When implementing a multi-step plan and any multi-step changes, **complete one item or step at a time** before moving to the next.
- **NEVER proceed to subsequent steps** until the user has reviewed the changes for the current step.
- Keep track of the completed steps by marking them complete in the plan md.
- Use subagent to track and update plans.