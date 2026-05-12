---
name: plan-execution
description: Provides procedural workflows for creating, tracking, and executing multi-step plans in the `/plans` directory.
---
# Skill: Plan Execution

## Purpose

Provides procedural workflows for creating, tracking, and executing multi-step plans in the `/plans` directory.

This skill should be loaded when working with complex tasks that require planning, step-by-step execution, or progress tracking.

---

## Plan Documentation & Tracking

Every time a multi-step plan, architectural design, or significant task roadmap is proposed, you MUST document it as a file.

### Storage Location
- All plans must be saved to the `/plans` directory at the root of the project.
- If the directory does not exist, create it.

### File Naming Convention
- Use kebab-case naming: `YYYY-MM-DD-short-description.md`
- Example: `2023-10-27-database-migration-plan.md`

### Required Structure
Each plan file must include:
- **Title:** A clear heading.
- **Status:** (e.g., Draft, Approved, In-Progress, Completed).
- **Context:** Why this plan is being created.
- **Steps:** A numbered list of actionable tasks.
- **Verification:** How we will know the plan succeeded.

### Workflow
- Before executing any complex task, present the plan in the chat.
- Simultaneously (or immediately after approval), write the plan to the `/plans` folder.
- If a plan is adjusted during the conversation, update the corresponding file in `/plans`.

---

## Step-by-Step Plan Implementation

You MUST follow this execution protocol for any plan stored in the `/plans` directory.

### Incremental Execution
- **One Step at a Time:** Execute exactly ONE step from the plan per response.
- **No Jumping Ahead:** Do not proceed to the next step unless explicitly instructed by the user.

### The Approval Gate
- After completing a step, you must present the work done and **explicitly wait** for user approval.
- **Stop and Ask:** Use a prompt like: "Step [X] is complete. Should I proceed to Step [Y]?"

### Plan Synchronization
- Immediately upon approval of a step, you MUST update the corresponding `.md` file in the `/plans` folder.
- **Progress Tracking:** Change the task list item from `[ ]` to `[x]` for the completed step.
- **Add Timestamps:** (Optional) Append the completion date/time next to the checkbox for better tracking.

### Deviation Handling
- If the implementation requires a change to the original plan, you must update the plan file with the new steps before continuing execution.
