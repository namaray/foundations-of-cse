---
title: Software Process Models
description: What software engineering is and why it is needed, the phases of the SDLC, and the waterfall, V-model, incremental, prototyping, spiral and RAD process models, with a comparison of when to use each.
sidebar:
  label: "1. Process models"
  order: 1
lesson:
  module: Process
  outcomes:
    - List the phases of the software development life cycle
    - Describe the main process models and their strengths and weaknesses
    - Choose a suitable process model for a given project
  keyIdea: >-
    Every project moves through the same activities (requirements, design, implementation, testing, deployment, maintenance), but **process models** differ in how they order and repeat them. **Waterfall** does each once, in sequence; **iterative** models (incremental, spiral, Agile) repeat them in cycles so feedback and change can be absorbed.
---

## 1. Why software engineering?

Software is complex, invisible and easy to change, which makes it easy to build badly. The term "software crisis" (1968) described projects that ran late, went over budget, were unreliable, and were hard to maintain. **Software engineering** applies systematic, disciplined and measurable methods to developing and maintaining software.

Software differs from manufactured products: it does not wear out (but it does degrade as it is changed), most of its cost is in development and maintenance rather than production, and requirements often change during development.

## 2. The SDLC

The **software development life cycle** has these activities:

| Phase | Question answered | Output |
|---|---|---|
| **Requirements** | What should the system do? | Software requirements specification (SRS) |
| **Design** | How will it be structured? | Architecture and detailed design |
| **Implementation** | Build it | Source code |
| **Testing** | Does it work as required? | Test reports, fixed defects |
| **Deployment** | Deliver it to users | Installed system |
| **Maintenance** | Keep it working and evolving | Updated releases |

Often a feasibility study (technical, economic, operational) comes first.

## 3. Waterfall

Phases run **once, in strict sequence**, each finishing (and being signed off) before the next starts.

- **Pros:** simple to understand and manage; clear milestones and documentation.
- **Cons:** requirements must be known and stable up front; working software appears only at the end; errors in requirements are found late, when they are most expensive to fix.
- **Use when:** requirements are well understood and unlikely to change, for example for safety-critical or contract-driven systems.

## 4. V-model

A waterfall variant that pairs each development phase with a **testing** phase, planned at the same time:

```text
Requirements ───────────────────────── Acceptance testing
   System design ──────────────── System testing
      Architecture design ──── Integration testing
         Module design ─── Unit testing
                  Implementation
```

It emphasises **verification and validation** throughout, but is as rigid as waterfall. Common in safety-critical domains (medical, automotive, aviation).

## 5. Incremental

Build the system in **increments**, each adding working functionality. The most important features are delivered first.

- **Pros:** early, usable releases; easier to absorb some change; lower risk of total failure.
- **Cons:** needs a good overall architecture early; the total cost can be higher.

## 6. Prototyping

Build a quick, rough **prototype** to explore unclear requirements with users, then refine it or throw it away and build the real system.

- **Throwaway prototyping:** the prototype is discarded once requirements are clear.
- **Evolutionary prototyping:** the prototype grows into the final product.
- **Pros:** clarifies requirements; users see something early. **Cons:** users may mistake the prototype for the product; quick shortcuts can leak into the final system.

## 7. Spiral

Proposed by Barry Boehm, the spiral model is **risk-driven**. Each loop of the spiral has four parts:

1. Determine objectives and constraints.
2. **Identify and resolve risks** (often with prototypes).
3. Develop and test.
4. Plan the next iteration.

- **Pros:** explicit risk management; suits large, complex, high-risk projects.
- **Cons:** complex to manage; needs risk-assessment expertise; costly for small projects.

## 8. RAD

**Rapid application development** builds systems very quickly (often 60–90 days) using reusable components, code generators and intensive user involvement in short time-boxed cycles. It works for well-modularised business applications, but not for projects with high technical risk.

## 9. Comparison

| Model | Requirements | Feedback | Risk handling | Best for |
|---|---|---|---|---|
| Waterfall | Fixed up front | At the end | Poor | Stable, well-understood requirements |
| V-model | Fixed up front | Testing planned early | Moderate | Safety-critical systems |
| Incremental | Core known, details evolve | After each increment | Moderate | Early delivery of core features |
| Prototyping | Unclear | Frequent, from users | Moderate | Exploring requirements, user interfaces |
| Spiral | Evolving | Each cycle | **Strong** | Large, high-risk projects |
| Agile | Expected to change | Every 1–4 weeks | Good | Changing requirements, fast delivery ([next lesson](/software-engineering/agile/)) |

## Summary

- The SDLC: requirements, design, implementation, testing, deployment, maintenance.
- Waterfall runs the phases once in sequence; it suits stable requirements but finds errors late.
- The V-model pairs each phase with a testing level.
- Incremental and prototyping models deliver early and handle change better.
- The spiral model is driven by risk analysis in each cycle.

## Check yourself

<details>
<summary>Why are requirement errors so expensive in the waterfall model?</summary>

They are often discovered only during testing or after delivery, when design and code built on the wrong requirement must be reworked. Fixing a defect costs far more the later it is found.
</details>

<details>
<summary>Which model would you choose for a new product whose requirements are unclear?</summary>

Prototyping (or an iterative/Agile model): build something quickly, get user feedback, and refine the requirements before committing to a full design.
</details>

<details>
<summary>What distinguishes the spiral model from other iterative models?</summary>

Its explicit focus on risk: every cycle begins by identifying and resolving the biggest risks before further development.
</details>
