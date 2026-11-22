---
title: The Relational Model
description: Relations, tuples and attributes, superkeys, candidate keys, primary and foreign keys, integrity constraints, and mapping an ER diagram to tables.
sidebar:
  label: "2. Relational model"
  order: 2
lesson:
  module: Design
  prerequisites:
    - label: DBMS and the ER model
      link: /database-systems/er-model/
  outcomes:
    - Distinguish superkeys, candidate keys, primary keys and foreign keys
    - State the entity and referential integrity rules
    - Convert an ER diagram into relational tables
  keyIdea: >-
    The relational model stores everything as **tables** (relations). **Keys** identify rows; **foreign keys** link tables and must always point to rows that exist. Every ER construct has a standard mapping to tables.
---

## 1. Relations

A **relation** is a table: a set of **tuples** (rows), each with the same **attributes** (columns). Each attribute has a **domain** of allowed values.

| Term | Informal | Example |
|---|---|---|
| Relation | Table | Student |
| Tuple | Row | (101, Rina, CSE, 3.75) |
| Attribute | Column | `cgpa` |
| Degree | Number of columns | 4 |
| Cardinality | Number of rows | however many students there are |
| Relation schema | Table name with its columns | Student(sid, name, dept, cgpa) |

Because a relation is a **set**, there are no duplicate rows and the order of rows does not matter. Values should be **atomic** (indivisible); that is first normal form.

## 2. Keys

| Key | Definition | Example in Student(sid, email, name, dept) |
|---|---|---|
| **Superkey** | Any set of attributes that uniquely identifies a row | {sid}, {sid, name}, {email}, {email, dept} |
| **Candidate key** | A **minimal** superkey: remove any attribute and it stops being unique | {sid}, {email} |
| **Primary key** | The candidate key chosen as the main identifier | {sid} |
| Alternate key | A candidate key not chosen | {email} |
| **Foreign key** | Attributes that refer to the primary key of another (or the same) table | `Enrolled.sid` → `Student.sid` |

Attributes that belong to some candidate key are **prime** attributes; this matters for [normalization](/database-systems/normalization/).

## 3. Integrity constraints

- **Domain constraint:** values must come from the attribute's domain (`cgpa` between 0 and 4).
- **Entity integrity:** a primary-key attribute can never be NULL.
- **Referential integrity:** a foreign-key value must either match an existing primary-key value or be NULL.

When a referenced row is deleted or its key updated, the foreign key's action decides what happens: `RESTRICT` (refuse), `CASCADE` (delete or update the referencing rows too), `SET NULL` or `SET DEFAULT`.

## 4. Mapping ER diagrams to tables

| ER construct | Becomes |
|---|---|
| Strong entity set | A table with its simple attributes; its key becomes the primary key |
| Composite attribute | One column per component (`first_name`, `last_name`) |
| Multivalued attribute | A **separate table**: (owner's key, value), with both together as the primary key |
| Derived attribute | Usually not stored |
| Weak entity set | A table with its own attributes plus the **owner's primary key**; primary key = owner's key + partial key; the owner's key is also a foreign key |
| **1:N relationship** | Add the "one" side's key as a **foreign key on the "many" side** (plus any relationship attributes) |
| **1:1 relationship** | Add a foreign key on either side, preferably the side with total participation |
| **M:N relationship** | A **new table** with both entities' keys (together the primary key) plus relationship attributes |
| Specialization | One table per subclass, holding the superclass key (as primary and foreign key) plus its own attributes; or one table per subclass with all inherited attributes; or a single table with a type column |

**Example.** *Student* (M:N) **enrolls in** *Course*, with a `grade` attribute, gives

- Student(<u>sid</u>, name, dept, cgpa)
- Course(<u>cid</u>, title, credits, dept)
- Enrolled(<u>sid</u>, <u>cid</u>, grade), where `sid` references Student and `cid` references Course.

**Example.** *Department* (1:N) **employs** *Professor* gives Professor(<u>pid</u>, name, dept_id), with `dept_id` a foreign key to Department.

## Summary

- A relation is a set of tuples over named attributes; no duplicate rows and no row order.
- Superkey ⊇ candidate key (minimal) ⊇ the chosen primary key; foreign keys reference another table's primary key.
- Entity integrity: no NULL primary keys. Referential integrity: foreign keys point to existing rows.
- M:N relationships and multivalued attributes become their own tables; 1:N relationships become a foreign key on the many side.

## Check yourself

<details>
<summary>Is every candidate key a superkey? Is every superkey a candidate key?</summary>

Every candidate key is a superkey. Not every superkey is a candidate key: {sid, name} is a superkey but not minimal.
</details>

<details>
<summary>How do you map a 1:N relationship between Department and Professor?</summary>

Put Department's primary key as a foreign key in the Professor table (the "many" side). No new table is needed.
</details>

<details>
<summary>A table has 3 candidate keys of one attribute each, plus 2 other attributes. Which attributes are prime?</summary>

The three key attributes. The other two are non-prime.
</details>
