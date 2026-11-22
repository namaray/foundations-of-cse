---
title: Agile Development
description: The Agile Manifesto and principles, Scrum roles, events and artifacts, user stories and estimation, velocity and burndown charts, Extreme Programming practices, and Kanban.
sidebar:
  label: "2. Agile and Scrum"
  order: 2
lesson:
  module: Process
  prerequisites:
    - label: Process models
      link: /software-engineering/process-models/
  outcomes:
    - State the four values of the Agile Manifesto
    - Describe Scrum's roles, events and artifacts
    - Write user stories with acceptance criteria
    - Compare Scrum, XP and Kanban
  keyIdea: >-
    Agile methods deliver working software in **short iterations** and welcome changing requirements. **Scrum** organises work into fixed-length **sprints** with three roles (product owner, Scrum master, developers), a prioritised **product backlog**, and regular inspection through daily stand-ups, reviews and retrospectives.
---

## 1. The Agile Manifesto (2001)

> We value **individuals and interactions** over processes and tools, **working software** over comprehensive documentation, **customer collaboration** over contract negotiation, and **responding to change** over following a plan.

The items on the right still matter; the items on the left matter more.

Key principles: deliver working software frequently (weeks, not months); welcome changing requirements, even late; business people and developers work together daily; working software is the main measure of progress; keep a sustainable pace; reflect regularly and adjust.

## 2. Scrum

### Roles

| Role | Responsibility |
|---|---|
| **Product owner** | Represents customers; owns and **prioritises** the product backlog; decides what gets built |
| **Scrum master** | Coaches the team in Scrum, removes obstacles, facilitates events; a servant-leader, not a manager |
| **Developers** | A small (about 3–9 people), cross-functional, self-organising team that builds the increment |

### Events

| Event | When | Purpose |
|---|---|---|
| **Sprint** | A fixed time-box of 1–4 weeks | Produce a potentially releasable increment |
| **Sprint planning** | Start of each sprint | Choose backlog items and plan how to deliver them |
| **Daily Scrum** (stand-up) | Every day, 15 minutes | What did I do? What will I do? What is blocking me? |
| **Sprint review** | End of the sprint | Demonstrate the increment to stakeholders and get feedback |
| **Sprint retrospective** | After the review | The team reflects on **how** it works and picks improvements |

### Artifacts

- **Product backlog:** an ordered list of everything the product might need, owned by the product owner.
- **Sprint backlog:** the items chosen for this sprint plus the plan for delivering them.
- **Increment:** the working product at the end of the sprint, meeting the team's **definition of done**.

## 3. User stories

Requirements in Agile are usually written as **user stories**:

> As a **[type of user]**, I want **[a goal]** so that **[a reason]**.

**Example:** "As a student, I want to download my transcript as a PDF so that I can attach it to job applications."

Each story has **acceptance criteria**, often written as *Given … when … then …*: "Given I am logged in, when I click Download, then a PDF of my transcript is saved."

Good stories follow **INVEST**: Independent, Negotiable, Valuable, Estimable, Small, Testable. Large stories (**epics**) are split into smaller ones.

**Estimation:** teams estimate effort in **story points** (relative size, often on a Fibonacci-like scale 1, 2, 3, 5, 8, 13), commonly with **planning poker**: everyone reveals an estimate at once, and big differences are discussed.

## 4. Velocity and burndown

- **Velocity:** story points completed per sprint, averaged over recent sprints. It is used to forecast: a 120-point backlog with a velocity of 30 needs about 4 sprints.
- **Burndown chart:** remaining work plotted against time within a sprint (or release). A line that stays flat warns early that the team won't finish.

## 5. Extreme Programming (XP)

XP focuses on engineering practices:

- **Pair programming:** two developers at one computer.
- **Test-driven development (TDD):** write a failing test, write code to pass it, then refactor.
- **Continuous integration:** integrate and test many times a day.
- **Small releases**, **simple design**, **refactoring**, **collective code ownership**, **coding standards**, **sustainable pace**, and an **on-site customer**.

## 6. Kanban

Kanban visualises work on a **board** with columns (To do → In progress → Review → Done) and limits **work in progress** (WIP) in each column. There are no fixed sprints: work **flows** continuously, and the team measures **cycle time** (how long an item takes). It suits support and maintenance work with a steady stream of requests.

| | Scrum | Kanban |
|---|---|---|
| Cadence | Fixed sprints | Continuous flow |
| Roles | Product owner, Scrum master, developers | None prescribed |
| Change during an iteration | Avoided within a sprint | Any time |
| Key metric | Velocity | Cycle time, throughput |
| Limits work by | Sprint capacity | WIP limits per column |

## 7. When Agile fits, and when it doesn't

**Fits:** changing or unclear requirements, close customer access, small co-located or well-connected teams, products where early feedback is valuable.

**Harder:** fixed-price contracts with rigid scope, safety-critical systems needing heavy documentation and certification, very large distributed teams (scaled frameworks such as SAFe try to address this).

## Summary

- Agile values people, working software, collaboration and responding to change.
- Scrum: product owner, Scrum master and developers; sprint planning, daily Scrum, review and retrospective; product backlog, sprint backlog and increment.
- User stories ("As a … I want … so that …") with acceptance criteria; estimated in story points.
- Velocity forecasts delivery; burndown charts track progress within a sprint.
- XP adds engineering practices (pairing, TDD, CI); Kanban manages continuous flow with WIP limits.

## Check yourself

<details>
<summary>Who prioritises the product backlog in Scrum?</summary>

The product owner.
</details>

<details>
<summary>What is the difference between a sprint review and a sprint retrospective?</summary>

The review inspects the **product**: the team shows the increment to stakeholders for feedback. The retrospective inspects the **process**: the team discusses how it worked and what to improve.
</details>

<details>
<summary>A team's velocity is 25 points per sprint. How many sprints for a 140-point backlog?</summary>

$140 / 25 = 5.6$, so about 6 sprints.
</details>
