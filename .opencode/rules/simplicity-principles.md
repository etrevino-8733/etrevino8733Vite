---
description: Simplicity principles - KISS and YAGNI - keep design simple, implement only when needed
alwaysApply: true
---


# Simplicity Principles (KISS & YAGNI)

## KISS (Keep It Simple, Stupid)

Simplicity should be a key goal in design. Unnecessary complexity should be avoided. Choose the **simplest solution that meets the requirements**.

### Guidelines

- **Prefer plain solutions**: Use straightforward logic, clear naming, and minimal abstractions until a real need arises.
- **Avoid over-engineering**: Don't add layers, patterns, or abstractions "for the future" unless the requirement exists now.
- **Meet requirements, no more**: Solve the stated problem; resist adding features or edge-case handling that wasn't asked for.
- **Reduce moving parts**: Fewer files, fewer dependencies, and fewer branches make code easier to understand and change.

### Examples

**Abstraction**
- Prefer a simple function or a small module over a full framework or plugin system when the problem is small.
- Introduce abstractions (interfaces, base classes, layers) only when you have at least two concrete cases or a clear, current need.

**Control flow**
- Prefer early returns and linear flow over deep nesting and multiple flags.
- Use the smallest set of language features that clearly express the intent (e.g., a loop instead of recursion when a loop is clearer).

**APIs and data**
- Expose the minimum surface area needed by callers; avoid "just in case" parameters or options.
- Prefer explicit, readable data structures over clever compression or indirection.

## YAGNI (You Ain't Gonna Need It)

Don't implement functionality until it's actually needed. Focus on **current requirements**; add features only when there's a **clear, immediate need**.

### Guidelines

- **Implement for now, not later**: Build what the current task or requirement asks for. Skip "we might need this someday" code.
- **No speculative features**: Don't add parameters, options, or code paths "just in case" a future use appears.
- **Clear need before code**: If there's no concrete requirement or user story for a feature, don't build it yet.
- **Defer generalization**: Write for the one case you have. Generalize only when a second real case appears.

### Examples

**APIs and parameters**
- ❌ Adding an optional `format` parameter "for future export formats."
- ✅ A single behavior that matches the requirement; add options when a second format is actually requested.

**Abstractions**
- ❌ Introducing a plugin system or interface "so we can swap implementations later."
- ✅ One implementation that works; refactor to an abstraction when you have a second implementation to support.

**Data and validation**
- ❌ Validating or storing fields "we might use later."
- ✅ Model and validate only what the current flow uses.

**Tests and docs**
- ❌ Writing tests or docs for hypothetical future behavior.
- ✅ Test and document the behavior that exists and is required now.

When in doubt, ask: "Is there a concrete, current requirement for this?" If not, leave it out until there is.
