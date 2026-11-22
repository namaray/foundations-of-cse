---
title: Software Engineering Cheat Sheet
description: One-page revision of process models, Agile and Scrum, requirements, UML, design and architecture, testing, CPM, PERT, COCOMO, maintenance and quality.
sidebar:
  label: "9. Cheat sheet"
  order: 20
  badge:
    text: Revision
    variant: note
lesson:
  module: Revision
---

Use this page for last-minute revision. Each heading links back to the full lesson.

## [Process](/software-engineering/process-models/) and [Agile](/software-engineering/agile/)

- SDLC: requirements, design, implementation, testing, deployment, maintenance.
- Waterfall (sequential, stable requirements), V-model (testing per phase), incremental, prototyping (unclear requirements), spiral (risk-driven).
- Agile values: individuals, working software, collaboration, responding to change.
- Scrum: product owner, Scrum master, developers; sprint planning, daily Scrum, review, retrospective; product backlog, sprint backlog, increment.
- User story: "As a … I want … so that …". Velocity = points per sprint.

## [Requirements](/software-engineering/requirements/) and [UML](/software-engineering/uml/)

- Functional (what) vs non-functional (how well, measurable).
- Good requirements: correct, unambiguous, complete, consistent, verifiable, traceable.
- Use case: actor, main scenario, alternative flows; `include` = always, `extend` = optional.
- Sequence diagram for message order; class diagram for structure; activity for workflow; state machine for one object's lifecycle.

## [Design](/software-engineering/design-architecture/)

- Cohesion best → worst: functional, sequential, communicational, procedural, temporal, logical, coincidental.
- Coupling best → worst: data, stamp, control, external, common, content.
- Styles: layered, client–server, MVC, pipe-and-filter, event-driven, microservices.

## [Testing](/software-engineering/testing/)

- Verification: built right? Validation: right product? Error → fault → failure.
- Unit, integration (stubs for top-down, drivers for bottom-up), system, acceptance (alpha, beta).
- Equivalence partitioning; boundary values for 1–100: 0, 1, 2, 99, 100, 101.
- $V(G) = E - N + 2P$ = decisions + 1 = minimum basis-path tests. Statement ⊂ branch ⊂ path coverage.

## [Project management](/software-engineering/project-management/)

- CPM: ES/EF forward, LS/LF backward, slack = LS − ES; critical path = zero slack = project length.
- PERT: $t_e = (o + 4m + p)/6$, $\sigma = (p - o)/6$.
- COCOMO: $E = a\,\text{KLOC}^b$, $T = 2.5\,E^d$. Organic (2.4, 1.05, 0.38), semi-detached (3.0, 1.12, 0.35), embedded (3.6, 1.20, 0.32).
- Risk exposure = probability × loss. Brooks's law: adding people to a late project makes it later.

## [Maintenance and quality](/software-engineering/maintenance-quality/)

- Maintenance types: corrective, adaptive, perfective, preventive (60–80% of cost).
- CI (build and test every merge), CD (always releasable), DevOps.
- CMMI: initial, managed, defined, quantitatively managed, optimising.

## Top viva questions

1. Compare waterfall, spiral and Agile; which would you use for a given project?
2. Explain Scrum's roles, events and artifacts.
3. Functional vs non-functional requirements, with examples.
4. What makes a requirement good?
5. Draw a use case or sequence diagram for a simple system.
6. Coupling and cohesion: which types are best and worst?
7. Describe MVC, layered and microservice architectures.
8. Verification vs validation.
9. Design test cases with equivalence partitioning and boundary value analysis.
10. Compute cyclomatic complexity.
11. Find the critical path for a set of activities.
12. Estimate effort with COCOMO.
