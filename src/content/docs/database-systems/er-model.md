---
title: Databases and the ER Model
description: Why DBMSs exist, levels of abstraction and data independence, and entity–relationship modelling - entities, attribute types, relationships, cardinality, participation, weak entities and specialization.
sidebar:
  label: "1. DBMS and the ER model"
  order: 1
lesson:
  module: Design
  outcomes:
    - Explain what a DBMS offers over plain files
    - Describe the three levels of abstraction and the two kinds of data independence
    - Draw an ER diagram with the right cardinalities, participation and weak entities
  keyIdea: >-
    A DBMS separates **what data means** from **how it is stored**, so programs survive changes to storage. Design starts with an **ER diagram**: entities (things), attributes (their properties) and relationships (how they connect), annotated with cardinality and participation.
---

## 1. Why a DBMS?

Storing data in ordinary files leads to problems a **database management system** (DBMS) solves:

| Problem with files | What a DBMS provides |
|---|---|
| Redundancy and inconsistency (the same data copied in several files) | One shared, integrated database |
| Hard to answer new questions (a new program for each query) | A query language (SQL) |
| Integrity rules buried in program code | Declared constraints, checked automatically |
| Partial updates after a crash | Atomic transactions and recovery |
| Concurrent users overwrite each other | Concurrency control |
| No fine-grained security | Access control on tables and views |

## 2. Levels of abstraction

| Level | Describes | Who sees it |
|---|---|---|
| **Physical (internal)** | How data is stored: files, indexes, blocks | DBMS developers, administrators |
| **Logical (conceptual)** | What data is stored and the relationships: tables, columns, constraints | Designers, programmers |
| **View (external)** | The part of the database a particular user needs | End users, applications |

- **Physical data independence:** changing the physical level (adding an index, moving files) does not require changing the logical schema or programs. This is easy to achieve and very common.
- **Logical data independence:** changing the logical schema (adding a column, splitting a table) does not break existing views and programs. This is harder.

A **schema** is the design (the structure); an **instance** is the data in the database at one moment.

## 3. Entities and attributes

An **entity** is a real-world object (a particular student); an **entity set** is a collection of similar entities (all students). In diagrams, entity sets are **rectangles** and attributes are **ovals**.

| Attribute type | Meaning | Example | Notation |
|---|---|---|---|
| Simple | Indivisible | `cgpa` | Oval |
| Composite | Made of parts | `name` = first + last | Oval with sub-ovals |
| Single-valued | One value per entity | `sid` | Oval |
| **Multivalued** | Several values | `phone_numbers` | **Double** oval |
| **Derived** | Computed from others | `age` from `date_of_birth` | **Dashed** oval |
| Key | Uniquely identifies the entity | `sid` | **Underlined** |

## 4. Relationships

A **relationship set** (a **diamond**) associates entities, for example *Student* **enrolls in** *Course*. Relationships can have their own attributes, such as `grade` on *Enrolls*.

### Cardinality

| Mapping | Meaning | Example |
|---|---|---|
| One-to-one (1:1) | Each A relates to at most one B, and vice versa | *Department* **headed by** *Professor* |
| One-to-many (1:N) | Each A relates to many B; each B to at most one A | *Department* **employs** *Professor* |
| Many-to-many (M:N) | Any number either way | *Student* **enrolls in** *Course* |

### Participation

- **Total participation** (a **double line**): every entity must take part. Every *Course* must be **offered by** some *Department*.
- **Partial participation** (a single line): some entities may not take part. Not every *Professor* heads a department.

## 5. Weak entities

A **weak entity set** has no key of its own; it is identified by its relationship to an **owner** (identifying) entity. It is drawn as a **double rectangle**, its identifying relationship as a **double diamond**, and its **partial key** (discriminator) with a **dashed underline**.

**Example.** *Dependent*(name, age) of an *Employee*: two employees may each have a dependent called "Rina", so a dependent is identified by (employee's id, dependent's name). Weak entities always have **total participation** in their identifying relationship.

## 6. Specialization and generalization

- **Specialization** (top-down): split an entity set into subgroups with extra attributes. *Person* → *Student* and *Faculty*.
- **Generalization** (bottom-up): combine similar entity sets into a higher-level one.

Drawn with an "ISA" triangle. Constraints: **disjoint** (an entity belongs to at most one subclass) or **overlapping**; **total** (every entity belongs to some subclass) or **partial**. Subclasses **inherit** the attributes and relationships of the superclass.

<details class="go-deeper">
<summary>Go deeper: design choices</summary>

- **Entity or attribute?** Make something an entity if it has its own attributes or takes part in relationships (a phone with a type and provider), otherwise an attribute.
- **Entity or relationship?** If an action has its own data and identity (a *Loan* with an amount and a date), an entity may be clearer.
- **Ternary relationships** (among three entity sets, such as *Supplier* supplies *Part* to *Project*) do not always split into binary relationships without losing information.
</details>

## Summary

- A DBMS adds integration, querying, integrity, concurrency, recovery and security on top of files.
- Physical data independence (storage changes) is easier than logical data independence (schema changes).
- ER notation: rectangles for entities, ovals for attributes (double for multivalued, dashed for derived), diamonds for relationships.
- Cardinality is 1:1, 1:N or M:N; total participation is a double line.
- A weak entity is identified through its owner and has a partial key.

## Check yourself

<details>
<summary>Give an example of physical data independence.</summary>

Adding an index on `Student.dept` or moving a table to a faster disk: queries and programs keep working unchanged, only faster.
</details>

<details>
<summary>Is "age" better stored or derived?</summary>

Derived from date of birth. A stored age becomes wrong every year unless something updates it.
</details>

<details>
<summary>Why must a weak entity have total participation in its identifying relationship?</summary>

It cannot be identified without its owner, so every weak entity must be linked to exactly one owner.
</details>
