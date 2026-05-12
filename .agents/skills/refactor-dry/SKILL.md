---
name: refactor-dry
description: A workflow for extracting duplicated logic into reusable methods or classes.
---

# Refactor DRY Skill

Use this skill when the 'DRY Rule' triggers a need to consolidate code across one or more files.

## DRY Principles

You MUST analyze every task for potential duplication before writing code.

### Planning Phase Analysis
- Before executing a plan, identify if the logic (e.g., validation, formatting, data mapping) exists elsewhere.
- If the logic is needed in 2+ places, you MUST include a "Refactor for Reuse" step in your plan.

### Abstraction Strategy
Choose the appropriate level of abstraction based on scope:
- **Private Method:** Logic unique to the current class but used in multiple methods.
- **Helper/Service:** Business logic or complex calculations shared across the domain.
- **Extension Method:** Utility logic for framework types (e.g., `string`, `DateTime`, `IEnumerable`).
- **Base Class:** Shared behavior for related entities or services.

### The "Rule of Three"
- **One-off:** Keep it inline.
- **Duplicate:** Note it for potential refactoring.
- **Triplicate:** You MUST abstract it into a reusable component.

### Guardrails
- **Avoid Premature Abstraction:** Do not abstract code that is fundamentally different even if it "looks" similar (avoid "Wrong Abstraction").
- **Maintain Clean Architecture:** Ensure abstracted helpers live in the correct layer (e.g., Domain helpers stay in Domain).

---

## Workflow

1. **Identify & Compare:** Scan the identified duplicates. Ensure they are logically identical (same purpose), not just structurally similar.
2. **Determine Home:**
   - Internal to class? Create a `private` method.
   - Shared utility? Create an `Extension Method` in `Core/Extensions`.
   - Shared business logic? Create a `Service` or `Helper`.
3. **Extract:** Create the new reusable component.
4. **Replace:** Update all original locations to call the new component.
5. **Verify:** Run existing NUnit tests to ensure no regressions were introduced.
