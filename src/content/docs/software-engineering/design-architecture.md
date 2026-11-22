---
title: Software Design and Architecture
description: Design concepts (abstraction, modularity, information hiding), types of coupling and cohesion, architectural styles - layered, client–server, MVC, pipe-and-filter, event-driven and microservices - and choosing between them.
sidebar:
  label: "5. Design and architecture"
  order: 5
lesson:
  module: Analysis and design
  prerequisites:
    - label: UML modelling
      link: /software-engineering/uml/
  outcomes:
    - Rank the types of coupling and cohesion from best to worst
    - Describe the main architectural styles and their trade-offs
    - Choose an architecture for a given system and justify it
  keyIdea: >-
    Good design splits a system into **modules** with **high cohesion** (each does one thing) and **low coupling** (they depend on each other as little as possible). **Architecture** is the highest-level design: the major components and how they communicate, chosen from proven styles such as layered, MVC and microservices.
---

## 1. Design concepts

- **Abstraction:** focus on what a component does, not how.
- **Modularity:** divide the system into separately developed, understood and tested modules.
- **Information hiding** (David Parnas): each module hides a design decision (a data format, an algorithm) behind its interface, so the decision can change without affecting others.
- **Separation of concerns:** different aspects (user interface, business logic, storage) live in different modules.
- **Refinement:** start abstract and add detail step by step (top-down design).

## 2. Coupling and cohesion

**Cohesion** (within a module), from **best to worst**:

| Type | Elements grouped because they… |
|---|---|
| **Functional** (best) | all contribute to one well-defined task |
| Sequential | form a chain: one's output is the next one's input |
| Communicational | work on the same data |
| Procedural | follow a fixed order of execution |
| Temporal | happen at the same time (for example, initialisation code) |
| Logical | are the same kind of thing, selected by a flag ("all input operations") |
| **Coincidental** (worst) | have no meaningful relationship |

**Coupling** (between modules), from **best to worst**:

| Type | Modules share… |
|---|---|
| No coupling | nothing |
| **Data** (best real coupling) | only simple data passed as parameters |
| Stamp | a whole data structure, of which they use only part |
| Control | a flag that tells the other module what to do |
| External | an external format, device or protocol |
| Common | global data |
| **Content** (worst) | one module changes or depends on another's internals |

**Goal: high (functional) cohesion and low (data) coupling.**

## 3. Architectural styles

### Layered

Components are arranged in layers, each using only the one directly below it: presentation → business logic → data access → database.

- **Pros:** separation of concerns; layers can be replaced or tested independently.
- **Cons:** requests pass through every layer (overhead); changes can ripple through layers.
- **Examples:** most enterprise applications; the OSI network model.

### Client–server

**Servers** provide services; **clients** request them over a network. Variants: two-tier (client and database), three-tier (client, application server, database).

- **Pros:** centralised data and control; many clients share one server.
- **Cons:** the server can become a bottleneck and a single point of failure.

### Model–view–controller (MVC)

- **Model:** data and business rules.
- **View:** presents the model to the user.
- **Controller:** handles user input and updates the model, which notifies the views.

- **Pros:** the same model can have several views; UI and logic can change independently; easier testing.
- **Cons:** more complexity for simple applications.
- **Examples:** web frameworks (Django, Rails, Spring MVC, Laravel).

### Pipe and filter

Data flows through a chain of **filters**, each transforming its input, connected by **pipes**.

- **Pros:** filters are simple, reusable and can run in parallel.
- **Cons:** poor for interactive systems; repeated parsing between filters.
- **Examples:** Unix shell pipelines (`cat log | grep error | sort`), compilers (lexer → parser → …), data processing.

### Event-driven

Components communicate by producing and reacting to **events**, often through a message broker (publish/subscribe).

- **Pros:** very loose coupling; easy to add new consumers; scales well.
- **Cons:** the flow of control is hard to follow and debug; ordering and delivery guarantees need care.
- **Examples:** GUIs, IoT, notification systems.

### Microservices

The system is a set of **small, independently deployable services**, each owning its own data and communicating through APIs or messages.

| | Monolith | Microservices |
|---|---|---|
| Deployment | One unit | Each service separately |
| Scaling | The whole application | Each service as needed |
| Technology | One stack | Each service can choose |
| Failure | Can bring everything down | Can be isolated |
| Complexity | In the code | In the infrastructure: networking, monitoring, distributed data |
| Suits | Small teams, early products | Large systems and organisations |

Other styles: **repository** (components share a central data store, as in an IDE or compiler), **peer-to-peer**, and **service-oriented architecture (SOA)**.

## 4. Choosing an architecture

Architecture is driven mostly by **non-functional requirements**:

| Priority | Favours |
|---|---|
| Performance | Fewer, larger components; less communication |
| Security | Layers, with critical assets in the innermost |
| Availability | Redundant components; microservices with fault isolation |
| Maintainability | Fine-grained, loosely coupled components |
| Scalability | Stateless services, horizontal scaling, event-driven designs |

Every choice is a trade-off; document the decision and its reasons.

## Summary

- Design for abstraction, modularity, information hiding and separation of concerns.
- Cohesion: functional is best, coincidental worst. Coupling: data is best, content worst.
- Layered, client–server, MVC, pipe-and-filter, event-driven and microservices each suit different needs.
- Non-functional requirements drive the choice of architecture.

## Check yourself

<details>
<summary>A module contains "print report", "validate date" and "compress file" because they were all left over. What type of cohesion is this?</summary>

Coincidental cohesion, the worst kind: the functions have no meaningful relationship.
</details>

<details>
<summary>Passing a flag that tells a function which of several things to do is which type of coupling?</summary>

Control coupling: one module controls the other's logic.
</details>

<details>
<summary>What does MVC separate, and why is that useful?</summary>

Data and rules (model), presentation (view) and input handling (controller). The UI can change, or several views can share one model, without changing the business logic, and each part can be tested separately.
</details>
