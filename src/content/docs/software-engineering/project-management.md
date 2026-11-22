---
title: Project Management and Estimation
description: Project planning, work breakdown structures, scheduling with CPM (worked example) and PERT, Gantt charts, size and effort estimation with lines of code, function points and COCOMO (worked example), and risk management.
sidebar:
  label: "7. Project management"
  order: 7
lesson:
  module: Management
  prerequisites:
    - label: Process models
      link: /software-engineering/process-models/
  outcomes:
    - Find the critical path, project duration and slack with CPM
    - Compute PERT expected times and variances
    - Estimate effort, duration and team size with basic COCOMO
    - Identify, assess and plan for project risks
  keyIdea: >-
    Planning splits a project into tasks, estimates them and schedules them. The **critical path** is the longest chain of dependent tasks: it sets the project's duration, and any delay on it delays everything. **COCOMO** estimates effort from size, and **risk management** prepares for what might go wrong.
---

## 1. Planning

The **triple constraint**: scope, time and cost are linked, and quality depends on all three. Changing one affects the others.

A project plan covers scope, a **work breakdown structure**, estimates, a schedule, resources, risks and quality measures.

**Work breakdown structure (WBS):** break the project into deliverables and then into **work packages** small enough to estimate and assign (typically a few days of work).

## 2. CPM: the critical path method

Each activity has a duration and predecessors. For each activity compute:

- **ES** (earliest start) = the largest EF of its predecessors; **EF** (earliest finish) = ES + duration. (Forward pass.)
- **LF** (latest finish) = the smallest LS of its successors; **LS** (latest start) = LF − duration. (Backward pass, starting from the project end.)
- **Slack (float)** = LS − ES = LF − EF.

Activities with **zero slack** form the **critical path**.

**Worked example.**

| Activity | Duration (days) | Predecessors |
|---|---|---|
| A | 3 | — |
| B | 2 | — |
| C | 4 | A |
| D | 5 | A |
| E | 3 | B, C |
| F | 2 | D, E |

**Forward pass:** A: 0–3. B: 0–2. C: 3–7. D: 3–8. E starts at max(2, 7) = 7, ends 10. F starts at max(8, 10) = 10, ends **12**.

**Backward pass** (project end = 12): F: LF 12, LS 10. E: LF 10, LS 7. D: LF 10, LS 5. C: LF 7, LS 3. B: LF 7, LS 5. A: LF = min(3, 5) = 3, LS 0.

| Activity | ES | EF | LS | LF | Slack |
|---|---|---|---|---|---|
| A | 0 | 3 | 0 | 3 | **0** |
| B | 0 | 2 | 5 | 7 | 5 |
| C | 3 | 7 | 3 | 7 | **0** |
| D | 3 | 8 | 5 | 10 | 2 |
| E | 7 | 10 | 7 | 10 | **0** |
| F | 10 | 12 | 10 | 12 | **0** |

**Critical path: A → C → E → F, 12 days.** B can slip 5 days and D 2 days without delaying the project.

Shortening the project means shortening activities **on the critical path** (which may then create a new critical path).

## 3. PERT

When durations are uncertain, **PERT** uses three estimates per activity: optimistic $o$, most likely $m$ and pessimistic $p$.

$$
t_e = \frac{o + 4m + p}{6} \qquad \sigma^2 = \left(\frac{p - o}{6}\right)^2
$$

**Example.** $o = 2$, $m = 4$, $p = 12$: $t_e = (2 + 16 + 12)/6 = 5$ days, $\sigma = 10/6 \approx 1.67$ days.

The project's expected duration is the sum of $t_e$ along the critical path, and its variance is the sum of the variances, which gives the probability of finishing by a given date (using a normal approximation).

## 4. Gantt charts

A **Gantt chart** shows activities as horizontal bars on a timeline, making the schedule, overlaps and milestones easy to see. It shows **when**, while a network diagram (CPM) shows **dependencies**; tools often combine both.

```text
Day:      1  2  3  4  5  6  7  8  9 10 11 12
A         ███████
B         ████
C                  ██████████
D                  ████████████
E                              ███████
F                                       ████
```

## 5. Estimating size and effort

**Size measures:**

- **Lines of code (KLOC):** easy to count afterwards, hard to estimate in advance; depends on the language.
- **Function points:** count the functionality from the user's view: external inputs, external outputs, external inquiries, internal logical files and external interface files, each weighted by complexity, then adjusted for 14 general system characteristics. Language-independent and usable early.

### Basic COCOMO

Boehm's **constructive cost model** estimates effort from size in KLOC:

$$
E = a \cdot (\text{KLOC})^b \ \text{person-months} \qquad T = c \cdot E^d \ \text{months} \qquad \text{Staff} = E / T
$$

| Project type | Description | $a$ | $b$ | $c$ | $d$ |
|---|---|---|---|---|---|
| **Organic** | Small team, familiar problem | 2.4 | 1.05 | 2.5 | 0.38 |
| **Semi-detached** | Medium size, mixed experience | 3.0 | 1.12 | 2.5 | 0.35 |
| **Embedded** | Tight hardware or regulatory constraints | 3.6 | 1.20 | 2.5 | 0.32 |

**Worked example.** An organic project of 32 KLOC:

- $E = 2.4 \times 32^{1.05} \approx 91.3$ person-months
- $T = 2.5 \times 91.3^{0.38} \approx 13.9$ months
- Average staff $\approx 91.3 / 13.9 \approx 6.6$ people

Since $b > 1$, effort grows **faster** than size (diseconomy of scale): doubling the size more than doubles the effort. **Intermediate COCOMO** multiplies the effort by cost drivers (reliability, complexity, team capability); **COCOMO II** updates the model for modern development.

**Brooks's law:** "adding people to a late software project makes it later", because new people must be trained and communication paths grow as $n(n-1)/2$.

## 6. Risk management

1. **Identify** risks: technology (new tools fail), people (key staff leave), requirements (they change), estimation (underestimated size), organisational.
2. **Analyse:** estimate each risk's **probability** and **impact**. **Risk exposure** = probability × loss.
3. **Plan:** **avoid** (change the plan to remove it), **mitigate** (reduce probability or impact), **transfer** (insurance, outsourcing), or **accept** with a **contingency plan**.
4. **Monitor** risks throughout the project.

**Example.** A 30% chance a key developer leaves, costing about 2 months' delay: exposure = 0.3 × 2 = 0.6 months. Mitigation: pair programming and documentation so knowledge is shared.

## Summary

- WBS breaks work into estimable packages; scope, time and cost trade off.
- CPM: forward pass gives ES/EF, backward pass LS/LF, slack = LS − ES; zero-slack activities form the critical path.
- PERT: $t_e = (o + 4m + p)/6$, $\sigma = (p - o)/6$.
- Basic COCOMO: $E = a\,\text{KLOC}^b$, $T = c\,E^d$; organic $a = 2.4$, $b = 1.05$.
- Risk exposure = probability × loss; avoid, mitigate, transfer or accept.

## Check yourself

<details>
<summary>What happens to the project if an activity with 3 days of slack is delayed by 2 days?</summary>

Nothing: the delay is absorbed by the slack. A delay of more than 3 days would delay the project (and that activity would then be critical).
</details>

<details>
<summary>Compute the PERT time for o = 4, m = 6, p = 14.</summary>

$(4 + 24 + 14)/6 = 7$ days.
</details>

<details>
<summary>Why does COCOMO use an exponent greater than 1?</summary>

Larger projects need disproportionately more effort: more communication, integration and coordination. So effort grows faster than size.
</details>
