---
title: UML Modelling
description: The main UML diagrams - use case, class, sequence, activity, state machine, component and deployment - what each shows, their notation, and when to use them.
sidebar:
  label: "4. UML modelling"
  order: 4
lesson:
  module: Analysis and design
  prerequisites:
    - label: Requirements
      link: /software-engineering/requirements/
  outcomes:
    - Choose the right UML diagram for a modelling question
    - Draw use case, class and sequence diagrams with correct notation
    - Read activity and state machine diagrams
  keyIdea: >-
    UML is a standard visual language for software models. **Structural** diagrams (class, component, deployment) show what the system is made of; **behavioural** diagrams (use case, sequence, activity, state) show what it does. In practice, use case, class and sequence diagrams cover most needs.
---

## 1. Diagram types

| Category | Diagram | Shows | Answers |
|---|---|---|---|
| Behavioural | **Use case** | Actors and the goals they achieve with the system | Who uses the system, and for what? |
| Structural | **Class** | Classes, attributes, operations and relationships | What are the parts of the code and how do they relate? |
| Behavioural (interaction) | **Sequence** | Messages between objects over time | In what order do objects interact for one scenario? |
| Behavioural | **Activity** | A workflow with decisions and parallel steps | What are the steps of this process? |
| Behavioural | **State machine** | States of one object and the events that change them | How does this object react over its life? |
| Structural | **Component** | Software components and their interfaces | How is the system divided into deployable parts? |
| Structural | **Deployment** | Hardware nodes and what runs on them | Where does each part run? |

## 2. Use case diagrams

- **Actor:** a stick figure, a role outside the system (a person or another system).
- **Use case:** an oval, a goal the actor achieves.
- **System boundary:** a rectangle around the use cases.
- **Association:** a line between an actor and a use case.
- **`<<include>>`:** a dashed arrow to a use case that is **always** part of another (both *Withdraw cash* and *Check balance* include *Authenticate*).
- **`<<extend>>`:** a dashed arrow from optional behaviour that **sometimes** extends a base use case (*Print receipt* extends *Withdraw cash*).
- **Generalisation:** a hollow triangle between actors or use cases (an *Admin* is a kind of *User*).

```text
            ┌──────────── ATM system ────────────┐
            │                                     │
 Customer ──┼── (Withdraw cash) ··include··▶ (Authenticate)
            │        ▲                            │
            │        · extend                     │
            │  (Print receipt)                    │
 Customer ──┼── (Check balance) ··include··▶ (Authenticate)
            └─────────────────────────────────────┘
```

## 3. Class diagrams

Each class is a box with name, attributes and operations, using `+` public, `-` private, `#` protected, `~` package. See [OOP concepts](/object-oriented-programming/oop-concepts/#5-uml-class-diagrams) for the relationship notation (inheritance, association, aggregation, composition, dependency, realisation).

**Multiplicity** goes at each end of an association:

| Notation | Meaning |
|---|---|
| `1` | exactly one |
| `0..1` | zero or one |
| `*` or `0..*` | zero or more |
| `1..*` | one or more |

**Example:** `Customer 1 ──── 0..* Order` means each order belongs to exactly one customer, and a customer may have any number of orders.

## 4. Sequence diagrams

Objects (or actors) are placed across the top, each with a dashed **lifeline** running down. Time flows **downwards**.

- **Synchronous message:** solid line with a filled arrowhead (the caller waits).
- **Return:** dashed line.
- **Asynchronous message:** solid line with an open arrowhead.
- **Activation bar:** a thin rectangle on a lifeline while the object is busy.
- **Combined fragments:** boxes labelled `alt` (if/else), `opt` (optional), `loop`.

```text
Customer        ATM            Bank
   │  insert card │               │
   │─────────────▶│               │
   │  enter PIN   │               │
   │─────────────▶│  verify(PIN)  │
   │              │──────────────▶│
   │              │◀ ─ ─ ok ─ ─ ─ │
   │  amount      │               │
   │─────────────▶│  debit(amt)   │
   │              │──────────────▶│
   │              │◀ ─ ─ ok ─ ─ ─ │
   │◀── cash ─────│               │
```

## 5. Activity diagrams

Like flowcharts, with support for parallelism:

- Filled circle: **start**; circle with a ring: **end**.
- Rounded rectangles: **actions**.
- Diamonds: **decisions** and **merges**, with guard conditions such as `[in stock]`.
- Thick bars: **fork** (split into parallel flows) and **join** (wait for all of them).
- **Swimlanes** divide actions by who performs them (customer, warehouse, billing).

## 6. State machine diagrams

Show the states of **one** object and the events that move it between them, written as `event [guard] / action`.

**Example: an order.**

```text
 ● ──▶ [Created] ──pay──▶ [Paid] ──ship──▶ [Shipped] ──deliver──▶ [Delivered] ──▶ ◉
          │                  │
          └──cancel──▶ [Cancelled] ◀──cancel──┘
```

Useful for objects with clear lifecycles: orders, tickets, connections, user accounts.

## 7. Component and deployment diagrams

- **Component diagram:** components (such as *Web UI*, *Payment service*, *Database*) with **provided** interfaces (lollipop symbol) and **required** interfaces (socket symbol).
- **Deployment diagram:** **nodes** (3-D boxes: servers, phones, browsers) and the **artifacts** deployed on them, linked by communication paths (HTTPS, JDBC).

## Summary

- Use case diagrams: actors, goals, include (always) and extend (optional).
- Class diagrams: classes with visibility, relationships and multiplicities.
- Sequence diagrams: objects across the top, messages in time order downwards; `alt`, `opt` and `loop` fragments.
- Activity diagrams: workflows with decisions, forks, joins and swimlanes. State machines: one object's lifecycle.
- Component and deployment diagrams show software parts and where they run.

## Check yourself

<details>
<summary>What is the difference between include and extend in a use case diagram?</summary>

An included use case always happens as part of the base use case (factored-out common behaviour). An extending use case adds optional behaviour that happens only under certain conditions.
</details>

<details>
<summary>Which diagram would you draw to show the order of messages when a user logs in?</summary>

A sequence diagram.
</details>

<details>
<summary>What does the multiplicity 1..* on one end of an association mean?</summary>

At least one, possibly many, objects of that class are associated with each object at the other end.
</details>
