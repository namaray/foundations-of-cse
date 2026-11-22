---
title: Requirements Engineering
description: Functional and non-functional requirements, the requirements engineering process, elicitation techniques, the SRS document and its qualities, use cases, validation, and managing change with traceability.
sidebar:
  label: "3. Requirements"
  order: 3
lesson:
  module: Analysis and design
  prerequisites:
    - label: Process models
      link: /software-engineering/process-models/
  outcomes:
    - Classify requirements as functional or non-functional
    - Choose suitable elicitation techniques
    - Describe what a good SRS contains and the qualities of good requirements
    - Write a use case with main and alternative flows
  keyIdea: >-
    Requirements say **what** the system must do (functional) and **how well** (non-functional: performance, security, usability). Getting them wrong is the most expensive mistake in software, so they are elicited from stakeholders, written down precisely in an **SRS**, checked, and tracked as they change.
---

## 1. Functional and non-functional requirements

| | Functional | Non-functional |
|---|---|---|
| Describes | What the system does: services, behaviour | Qualities and constraints: how well it does it |
| Examples | "A student can register for a course." "The system emails a receipt after payment." | "Pages load in under 2 seconds." "Passwords are stored hashed." "Available 99.9% of the time." |
| If missing | A feature is absent | The system may be unusable even with every feature |

**Kinds of non-functional requirement:** performance, scalability, reliability and availability, security, usability, maintainability, portability, and legal or regulatory constraints.

Non-functional requirements must be **measurable** to be testable: "fast" is not a requirement; "95% of searches return within 1 second with 1,000 concurrent users" is.

**User requirements** (natural language, for customers) are refined into **system requirements** (detailed, precise, for developers).

## 2. The requirements engineering process

1. **Feasibility study:** is the system worth building, technically, economically and operationally?
2. **Elicitation:** discover requirements from stakeholders.
3. **Analysis:** resolve conflicts, prioritise, and model the requirements.
4. **Specification:** write them down (the SRS).
5. **Validation:** check that they describe what the customer actually wants.
6. **Management:** handle changes throughout the project.

## 3. Elicitation techniques

| Technique | Good for | Limitations |
|---|---|---|
| **Interviews** | Detailed, individual views | Time-consuming; people may not express tacit knowledge |
| **Questionnaires** | Many users, quantitative data | No follow-up questions |
| **Workshops / JAD sessions** | Resolving conflicts between stakeholders together | Hard to schedule; dominant voices |
| **Observation / ethnography** | How people really work, including unstated steps | Slow; people behave differently when watched |
| **Prototyping** | Unclear requirements, user interfaces | Users may expect the prototype to be the product |
| **Document analysis** | Existing systems, forms, regulations | May be out of date |
| Use cases and scenarios | Concrete interactions | Can miss non-functional needs |

Common difficulties: stakeholders don't know what they want, use their own jargon, have conflicting goals, or change their minds; requirements also change as the business changes.

## 4. The SRS

A **software requirements specification** is the agreed statement of what the system must do. A typical structure (after IEEE 830):

1. Introduction: purpose, scope, definitions, references.
2. Overall description: product perspective, user classes, operating environment, constraints, assumptions.
3. Specific requirements: functional requirements, external interfaces, non-functional requirements.
4. Appendices.

**Qualities of good requirements:**

| Quality | Meaning |
|---|---|
| **Correct** | States what is really needed |
| **Unambiguous** | Has only one interpretation |
| **Complete** | Covers every needed function, input and response |
| **Consistent** | No two requirements conflict |
| **Verifiable (testable)** | It is possible to check whether it is met |
| **Traceable** | Its origin is known and it can be linked to design, code and tests |
| Modifiable, ranked for importance | Easy to change; priorities are clear (for example MoSCoW: must, should, could, won't) |

## 5. Use cases

A **use case** describes how an **actor** (a user role or external system) interacts with the system to achieve a goal.

**Use case:** Withdraw cash
**Actor:** Customer
**Precondition:** The customer has a valid card.

**Main success scenario:**

1. The customer inserts a card and enters the PIN.
2. The system verifies the PIN.
3. The customer chooses an amount.
4. The system checks the balance and dispenses cash.
5. The system updates the account and prints a receipt.

**Alternative flows:**

- 2a. Wrong PIN: the system asks again; after three failures it keeps the card.
- 4a. Insufficient balance: the system shows a message and returns to step 3.

**Postcondition:** The account balance is reduced by the amount withdrawn.

Use-case diagrams (see [UML](/software-engineering/uml/)) give the overview: actors, use cases, and `include` and `extend` relationships.

## 6. Validation and management

**Validation techniques:** requirements **reviews** (stakeholders and developers read and check them), **prototyping**, writing **test cases** from requirements (a requirement you can't test is a bad requirement), and model checking.

**Managing change:** requirements will change. Every change is recorded, its impact analysed and approved through a **change control** process. A **traceability matrix** links each requirement to its source, design elements, code and test cases, so you can see what a change affects and confirm every requirement is tested.

## Summary

- Functional requirements say what the system does; non-functional ones say how well, and must be measurable.
- The process: feasibility, elicitation, analysis, specification, validation, management.
- Elicitation uses interviews, questionnaires, workshops, observation, prototypes and documents.
- A good SRS is correct, unambiguous, complete, consistent, verifiable and traceable.
- Use cases describe actor goals with a main scenario and alternative flows; traceability supports change.

## Check yourself

<details>
<summary>Is "the system shall be user-friendly" a good requirement?</summary>

No: it is not measurable or testable. Rewrite it measurably, for example "a new user can complete registration in under 3 minutes without help".
</details>

<details>
<summary>Classify: "The system shall generate a monthly sales report" and "The report shall be generated within 10 seconds".</summary>

The first is functional (what the system does); the second is non-functional (a performance requirement).
</details>

<details>
<summary>What is a requirements traceability matrix used for?</summary>

To link each requirement to its source, design, code and tests, so that the impact of changes can be assessed and every requirement can be shown to be implemented and tested.
</details>
