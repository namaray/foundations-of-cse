---
title: Normalization
description: Update anomalies, first, second and third normal forms, BCNF, lossless-join and dependency-preserving decomposition, the 3NF synthesis and BCNF decomposition algorithms, and multivalued dependencies with 4NF.
sidebar:
  label: "6. Normalization"
  order: 6
lesson:
  module: Normalization
  prerequisites:
    - label: Functional dependencies
      link: /database-systems/functional-dependencies/
  outcomes:
    - Identify the highest normal form a relation satisfies
    - Decompose a relation into 3NF and BCNF
    - Test whether a decomposition is lossless and dependency-preserving
    - Explain when 3NF is preferred over BCNF
  keyIdea: >-
    Redundant data causes **update, insertion and deletion anomalies**. Normal forms remove redundancy step by step: 1NF (atomic values), 2NF (no partial dependencies), 3NF (no transitive dependencies on non-prime attributes) and **BCNF** (every determinant is a superkey). Decompositions must always be **lossless**; BCNF may sacrifice dependency preservation, 3NF never does.
---

## 1. Why normalize?

Consider one big table:

| sid | name | cid | title | grade |
|---|---|---|---|---|
| 101 | Rina | C1 | Databases | A |
| 101 | Rina | C2 | Networks | B+ |
| 102 | Tanvir | C1 | Databases | A− |

with $\text{sid} \to \text{name}$, $\text{cid} \to \text{title}$ and $\{\text{sid}, \text{cid}\} \to \text{grade}$. The key is $\{\text{sid}, \text{cid}\}$.

- **Update anomaly:** renaming course C1 means changing several rows; missing one leaves inconsistent data.
- **Insertion anomaly:** a new course with no students cannot be added (the key would be incomplete).
- **Deletion anomaly:** deleting the last student enrolled in C2 also deletes the fact that C2 is called "Networks".

The cause is **redundancy**: facts about students and courses are repeated in every enrolment row.

## 2. The normal forms

| Form | Condition |
|---|---|
| **1NF** | All attribute values are **atomic**: no lists, sets or repeating groups |
| **2NF** | 1NF, and no non-prime attribute depends on **part** of a candidate key (no **partial** dependency) |
| **3NF** | 2NF, and for every non-trivial FD $X \to A$: $X$ is a superkey **or** $A$ is prime. Equivalently, no non-prime attribute depends **transitively** on a key |
| **BCNF** | For every non-trivial FD $X \to A$: $X$ is a **superkey** |

Each form includes the ones before: BCNF ⊂ 3NF ⊂ 2NF ⊂ 1NF.

A relation whose candidate keys are all single attributes is automatically in 2NF (there is no "part of a key").

### Examples

**Not 2NF.** The table above: $\text{sid} \to \text{name}$ is a partial dependency (name depends on half the key). Decompose:

- Student(<u>sid</u>, name)
- Course(<u>cid</u>, title)
- Enrolled(<u>sid</u>, <u>cid</u>, grade)

All three are in BCNF.

**2NF but not 3NF.** Employee(<u>eid</u>, dept, dept_head) with $\text{eid} \to \text{dept}$ and $\text{dept} \to \text{dept\_head}$. The key is a single attribute, so the relation is in 2NF, but $\text{dept} \to \text{dept\_head}$ is a **transitive** dependency: dept is not a superkey, and dept_head is not prime. Decompose into Employee(<u>eid</u>, dept) and Department(<u>dept</u>, dept_head).

**3NF but not BCNF.** Teaches(student, course, instructor) with

- $\{\text{student}, \text{course}\} \to \text{instructor}$ (each student has one instructor per course)
- $\text{instructor} \to \text{course}$ (each instructor teaches one course)

The candidate keys are $\{\text{student}, \text{course}\}$ and $\{\text{student}, \text{instructor}\}$, so every attribute is prime.

- 3NF ✓: in $\text{instructor} \to \text{course}$, the right side (course) is prime.
- BCNF ✗: instructor is not a superkey.

## 3. Properties of a good decomposition

**Lossless join.** Joining the pieces must give back exactly the original relation, with no extra (spurious) rows. A decomposition of $R$ into $R_1$ and $R_2$ is lossless if and only if

$$
R_1 \cap R_2 \to R_1 \quad \text{or} \quad R_1 \cap R_2 \to R_2
$$

that is, the common attributes form a superkey of one of the pieces.

**Example.** Splitting Employee(eid, dept, dept_head) into (eid, dept) and (dept, dept_head): the common attribute is dept, and $\text{dept} \to \text{dept\_head}$, so dept is a key of the second piece. **Lossless.**

**Dependency preservation.** Every FD can be checked within a single piece, without joining. Formally, $(F_1 \cup F_2 \cup \dots)^+ = F^+$, where $F_i$ are the FDs that involve only $R_i$'s attributes.

**Losslessness is mandatory.** Dependency preservation is highly desirable but not always achievable together with BCNF.

## 4. Decomposition algorithms

### BCNF decomposition

While some relation $R_i$ has a violating FD $X \to Y$ ($X$ not a superkey of $R_i$):

- Replace $R_i$ with $R_i - (Y - X)$ and $X \cup Y$.

The result is always **lossless**, but may **not preserve dependencies**.

**Example.** Teaches(student, course, instructor) with violation $\text{instructor} \to \text{course}$ gives

- (instructor, course)
- (student, instructor)

Lossless, since instructor is a key of the first piece. But $\{\text{student}, \text{course}\} \to \text{instructor}$ can no longer be checked inside one table: **dependency not preserved**.

### 3NF synthesis

1. Find a [minimal cover](/database-systems/functional-dependencies/#5-minimal-canonical-cover) $F_c$.
2. For each FD $X \to A$ in $F_c$, make a relation $(X, A)$, grouping FDs with the same left side.
3. If no relation contains a candidate key of $R$, add one that does.
4. Remove any relation contained in another.

The result is always **lossless and dependency-preserving**. That is why practical designs often stop at 3NF.

| | 3NF | BCNF |
|---|---|---|
| Lossless | Always achievable | Always achievable |
| Dependency-preserving | Always achievable | Not always |
| Redundancy | A little may remain | None from FDs |

## 5. Beyond BCNF

A **multivalued dependency** $X \twoheadrightarrow Y$ means the set of $Y$ values for a given $X$ is independent of the other attributes.

**Example.** Teacher(name, subject, language): a teacher's subjects and spoken languages are independent. Storing them together forces every subject × language combination:

| name | subject | language |
|---|---|---|
| Karim | DBMS | Bangla |
| Karim | DBMS | English |
| Karim | OS | Bangla |
| Karim | OS | English |

The relation is in BCNF (all three attributes form the only key), yet redundant. **4NF** requires every non-trivial MVD $X \twoheadrightarrow Y$ to have $X$ a superkey. Decompose into (name, subject) and (name, language).

**5NF** (project-join normal form) deals with join dependencies; it rarely comes up in practice.

**Denormalization:** real systems sometimes deliberately add redundancy back (for example, storing an order's total) to avoid expensive joins, accepting extra work to keep it consistent.

## Summary

- Redundancy causes update, insertion and deletion anomalies.
- 1NF: atomic values. 2NF: no partial dependencies. 3NF: every FD has a superkey on the left or a prime attribute on the right. BCNF: every determinant is a superkey.
- A binary decomposition is lossless iff the common attributes are a key of one of the pieces.
- BCNF decomposition is lossless but may lose dependencies; 3NF synthesis is lossless and dependency-preserving.
- 4NF removes redundancy caused by independent multivalued facts.

## Check yourself

<details>
<summary>R(A, B, C, D) with key AB and FDs AB → C, B → D. What normal form is it in?</summary>

1NF only. $B \to D$ is a partial dependency: $D$ is non-prime and depends on part of the key.
</details>

<details>
<summary>Is a relation with exactly two attributes always in BCNF?</summary>

Yes. Any non-trivial FD is $A \to B$ or $B \to A$, and then its left side determines both attributes, so it is a superkey.
</details>

<details>
<summary>R(A, B, C) is split into (A, B) and (B, C), with F = {A → B}. Is the decomposition lossless?</summary>

The common attribute is $B$. Lossless requires $B \to AB$ or $B \to BC$, and neither follows from $F$. So it is **lossy**: joining can create spurious rows.
</details>
