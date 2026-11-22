---
title: Functional Dependencies
description: Functional dependencies, Armstrong's axioms, attribute closure, finding candidate keys, closure of a set of FDs, and minimal (canonical) covers.
sidebar:
  label: "5. Functional dependencies"
  order: 5
lesson:
  module: Normalization
  prerequisites:
    - label: Relational model
      link: /database-systems/relational-model/
  outcomes:
    - Compute the closure of a set of attributes
    - Find all candidate keys of a relation from its functional dependencies
    - Find a minimal cover of a set of dependencies
  keyIdea: >-
    A functional dependency $X \to Y$ says that equal $X$ values always come with equal $Y$ values. Armstrong's axioms derive every FD that follows from a given set, and the **attribute closure** $X^+$ is the workhorse: $X$ is a superkey exactly when $X^+$ contains every attribute.
---

## 1. What a functional dependency is

$X \to Y$ (read "$X$ determines $Y$") means: any two rows that agree on $X$ must agree on $Y$.

In Student(sid, name, dept, dept_head):

- $\text{sid} \to \text{name}, \text{dept}$: a student ID identifies one name and department.
- $\text{dept} \to \text{dept\_head}$: each department has one head.
- $\text{name} \to \text{sid}$ does **not** hold: two students can share a name.

FDs come from the **meaning** of the data, not from one particular instance. A table can show that an FD does *not* hold (two rows agree on $X$ but differ on $Y$), but no table can prove an FD holds in general.

A dependency is **trivial** if $Y \subseteq X$, such as $\{\text{sid}, \text{name}\} \to \text{name}$.

## 2. Armstrong's axioms

| Rule | Statement |
|---|---|
| **Reflexivity** | If $Y \subseteq X$, then $X \to Y$ |
| **Augmentation** | If $X \to Y$, then $XZ \to YZ$ |
| **Transitivity** | If $X \to Y$ and $Y \to Z$, then $X \to Z$ |

These are **sound** (they only derive true FDs) and **complete** (they derive every FD that follows). Useful derived rules:

- **Union:** $X \to Y$ and $X \to Z$ give $X \to YZ$.
- **Decomposition:** $X \to YZ$ gives $X \to Y$ and $X \to Z$.
- **Pseudo-transitivity:** $X \to Y$ and $WY \to Z$ give $WX \to Z$.

The set of all FDs implied by $F$ is its **closure** $F^+$.

## 3. Attribute closure

The **closure** $X^+$ is the set of all attributes determined by $X$.

**Algorithm:**

1. Start with $X^+ = X$.
2. For each FD $A \to B$ in $F$: if $A \subseteq X^+$, add $B$ to $X^+$.
3. Repeat until nothing changes.

**Worked example.** $R(A, B, C, D, E)$ with $F = \{A \to B,\; B \to C,\; CD \to E\}$.

- $\{A\}^+$: start $\{A\}$; $A \to B$ adds $B$; $B \to C$ adds $C$. $CD \to E$ needs $D$, which we lack. Result $\{A, B, C\}$.
- $\{A, D\}^+$: start $\{A, D\}$; add $B$, then $C$; now $CD \subseteq$, so add $E$. Result $\{A, B, C, D, E\}$: **all attributes**.

So $AD$ is a superkey.

**Uses of attribute closure:**

- **Is $X$ a superkey?** Check whether $X^+$ contains all attributes.
- **Does $X \to Y$ follow from $F$?** Check whether $Y \subseteq X^+$.

## 4. Finding candidate keys

1. Attributes that appear on **no right-hand side** must be in **every** key.
2. Attributes that appear **only on right-hand sides** are in **no** key.
3. Start from the must-have attributes; if their closure is everything, that is the only key. Otherwise add other attributes one at a time and check minimality.

**Example 1.** In the relation above, $A$ and $D$ never appear on a right-hand side, so every key contains $AD$. Since $\{A, D\}^+$ is everything, **$AD$ is the only candidate key**.

**Example 2.** $R(A, B, C, D)$ with $F = \{AB \to C,\; C \to D,\; D \to A\}$.

- $B$ appears on no right-hand side, so it is in every key. $\{B\}^+ = \{B\}$: not enough.
- Try $AB$: $\{A, B\}^+ = \{A, B, C, D\}$ ✓.
- Try $BC$: $\{B, C\}^+ = \{B, C, D, A\}$ ✓.
- Try $BD$: $\{B, D\}^+ = \{B, D, A, C\}$ ✓.

Each is minimal (neither attribute alone works), so the candidate keys are **$AB$, $BC$ and $BD$**. Prime attributes: $A, B, C, D$, which is all of them.

## 5. Minimal (canonical) cover

A **minimal cover** $F_c$ is a simplified set of FDs equivalent to $F$:

1. Every right-hand side is a **single attribute** (split $X \to YZ$).
2. No left-hand side has an **extraneous** attribute: an attribute you can remove without changing $F^+$.
3. No FD is **redundant** (derivable from the others).

**Worked example.** $F = \{A \to BC,\; B \to C,\; A \to B,\; AB \to C\}$.

1. Split: $A \to B$, $A \to C$, $B \to C$, $A \to B$ (duplicate, drop), $AB \to C$.
2. In $AB \to C$, $A$ is extraneous, because $B \to C$ already holds. It becomes $B \to C$, a duplicate; drop it.
3. $A \to C$ is redundant: $A \to B$ and $B \to C$ give it by transitivity. Drop it.

$$
F_c = \{A \to B,\; B \to C\}
$$

Minimal covers are the starting point for the 3NF synthesis algorithm in [Normalization](/database-systems/normalization/).

## Summary

- $X \to Y$: rows equal on $X$ are equal on $Y$; FDs come from the meaning of the data.
- Armstrong's axioms (reflexivity, augmentation, transitivity) are sound and complete.
- $X^+$ is computed by repeatedly applying FDs whose left side is already included; $X$ is a superkey iff $X^+$ is every attribute.
- Attributes on no right-hand side belong to every candidate key.
- A minimal cover has single-attribute right sides, no extraneous attributes and no redundant FDs.

## Check yourself

<details>
<summary>R(A, B, C) with F = {A → B, B → C}. What is the candidate key?</summary>

$A$ is on no right-hand side, and $\{A\}^+ = \{A, B, C\}$, so $A$ is the only candidate key.
</details>

<details>
<summary>Does A → C follow from {A → B, B → C}? Show it with closure.</summary>

Yes. $\{A\}^+ = \{A, B, C\}$ contains $C$.
</details>

<details>
<summary>Can you tell from a table with 5 rows that A → B holds?</summary>

No. The rows can only show that it is violated (two rows with the same $A$ and different $B$). Whether it holds depends on what the data means.
</details>
