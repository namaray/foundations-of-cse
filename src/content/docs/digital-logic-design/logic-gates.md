---
title: Logic Gates and Boolean Functions
description: The basic logic gates and their truth tables, universal NAND and NOR gates, writing functions in SOP and POS form, minterm and maxterm notation, and implementing circuits with NAND or NOR only.
sidebar:
  label: "2. Logic gates"
  order: 2
lesson:
  module: Combinational logic
  prerequisites:
    - label: Number systems and codes
      link: /digital-logic-design/number-systems/
    - label: Boolean algebra (Discrete Math)
      link: /discrete-mathematics/boolean-algebra/
  outcomes:
    - Give the truth table and symbol of each basic gate
    - Write a function as a sum of minterms and a product of maxterms
    - Convert an AND-OR circuit to NAND-only, and an OR-AND circuit to NOR-only
  keyIdea: >-
    Logic gates are the hardware form of Boolean operations. Any function can be written as a **sum of products** (AND gates feeding an OR) or a **product of sums**, and because NAND and NOR are **universal**, any circuit can be built from just one gate type.
---

The algebra itself (laws, duality, canonical forms) is covered in [Discrete Mathematics: Boolean algebra](/discrete-mathematics/boolean-algebra/). This lesson focuses on circuits.

## 1. The basic gates

| Gate | Expression | Output is 1 when | 00 | 01 | 10 | 11 |
|---|---|---|---|---|---|---|
| AND | $AB$ | both inputs are 1 | 0 | 0 | 0 | 1 |
| OR | $A + B$ | at least one input is 1 | 0 | 1 | 1 | 1 |
| NOT | $\overline{A}$ | the input is 0 | | | | |
| **NAND** | $\overline{AB}$ | not both 1 | 1 | 1 | 1 | 0 |
| **NOR** | $\overline{A + B}$ | both 0 | 1 | 0 | 0 | 0 |
| XOR | $A \oplus B$ | inputs differ | 0 | 1 | 1 | 0 |
| XNOR | $\overline{A \oplus B}$ | inputs are equal | 1 | 0 | 0 | 1 |

The columns 00–11 list the output for inputs $AB$.

- XOR of many inputs is 1 when an **odd** number of inputs are 1, so it computes **parity**.
- $A \oplus B = A\overline{B} + \overline{A}B$.

## 2. Canonical forms

For a function of $n$ variables:

- A **minterm** $m_i$ is an AND of all variables (each complemented or not) that is 1 for exactly row $i$.
- A **maxterm** $M_i$ is an OR of all variables that is 0 for exactly row $i$.

| Row | $A$ | $B$ | $C$ | Minterm | Maxterm |
|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | $\overline{A}\,\overline{B}\,\overline{C}$ | $A + B + C$ |
| 1 | 0 | 0 | 1 | $\overline{A}\,\overline{B}C$ | $A + B + \overline{C}$ |
| 5 | 1 | 0 | 1 | $A\overline{B}C$ | $\overline{A} + B + \overline{C}$ |
| 7 | 1 | 1 | 1 | $ABC$ | $\overline{A} + \overline{B} + \overline{C}$ |

In a minterm, a variable is complemented where its bit is 0; in a maxterm, where its bit is 1.

**Sum of products (SOP):** OR together the minterms where $F = 1$. **Product of sums (POS):** AND together the maxterms where $F = 0$.

**Example.** If $F(A, B, C) = \sum m(1, 3, 5, 6)$, then $F = \prod M(0, 2, 4, 7)$: the maxterm list is every row **not** in the minterm list.

## 3. Universal gates

**NAND alone** can build any circuit:

| Function | Built from NAND |
|---|---|
| NOT $A$ | $A$ NAND $A$ |
| $A$ AND $B$ | ($A$ NAND $B$) NAND ($A$ NAND $B$) |
| $A$ OR $B$ | ($A$ NAND $A$) NAND ($B$ NAND $B$), since $\overline{\overline{A}\,\overline{B}} = A + B$ |

**NOR** is universal too, by the dual constructions. Chip manufacturers like this: one well-optimised gate type covers everything. In CMOS, NAND and NOR gates need fewer transistors than AND and OR.

## 4. Two-level implementations

- **SOP → NAND-NAND:** an AND-OR circuit becomes NAND-NAND by replacing every gate with NAND. (De Morgan: $AB + CD = \overline{\overline{AB} \cdot \overline{CD}}$.)
- **POS → NOR-NOR:** an OR-AND circuit becomes NOR-NOR the same way.

**Example.** $F = AB + \overline{C}D$: two NAND gates make $\overline{AB}$ and $\overline{\overline{C}D}$, and a third NAND combines them into $F$. (The $\overline{C}$ needs a NAND used as an inverter.)

**Multi-level circuits:** using the bubble-pushing idea (a NAND is an OR with inverted inputs), add pairs of inverters so that every gate becomes a NAND, cancelling double inversions.

## 5. Practical gate properties

- **Propagation delay:** the time from an input change to the output change, typically nanoseconds or less. A circuit's speed is set by its longest (critical) path.
- **Fan-in / fan-out:** how many inputs a gate has, and how many gate inputs one output can drive.
- **Logic families:** TTL (older, bipolar transistors) and **CMOS** (almost all modern chips: very low static power).

## Summary

- AND, OR and NOT are basic; NAND and NOR are universal; XOR detects difference and computes parity.
- SOP ORs the minterms where $F = 1$; POS ANDs the maxterms where $F = 0$; together the lists cover every row.
- AND-OR circuits convert directly to NAND-NAND, and OR-AND circuits to NOR-NOR.
- Circuit speed is limited by the longest propagation-delay path.

## Check yourself

<details>
<summary>If F(A, B, C) = Σm(0, 2, 4, 6), what is F as a product of maxterms, and in simplest form?</summary>

$F = \prod M(1, 3, 5, 7)$. It is 1 exactly when $C = 0$, so $F = \overline{C}$.
</details>

<details>
<summary>How many 2-input NAND gates are needed to build an OR gate?</summary>

Three: two to invert $A$ and $B$, and one to NAND the inverted signals.
</details>

<details>
<summary>What is the output of a 4-input XOR gate with inputs 1, 1, 0, 1?</summary>

1, because an odd number (three) of inputs are 1.
</details>
