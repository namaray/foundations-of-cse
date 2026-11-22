---
title: Boolean Algebra
description: Boolean operations and functions, the laws of Boolean algebra and duality, sum-of-products and product-of-sums forms, minterms and maxterms, and functional completeness.
sidebar:
  label: "12. Boolean algebra"
  order: 12
lesson:
  module: Boolean algebra
  prerequisites:
    - label: Propositional logic
      link: /discrete-mathematics/propositional-logic/
  outcomes:
    - Simplify Boolean expressions with the laws of Boolean algebra
    - Write a Boolean function as a sum of minterms or a product of maxterms
    - Explain why NAND alone can build any Boolean function
  keyIdea: Boolean algebra is propositional logic written with $0$, $1$, $+$, $\cdot$ and complement. Every Boolean function can be written as a **sum of products** read straight from its truth table, and the same laws used in logic simplify it.
---

Boolean algebra is the algebra behind digital circuits. This lesson covers the mathematics; circuit design and Karnaugh maps are in [Digital Logic Design](/digital-logic-design/).

## 1. Operations

On the set $\{0, 1\}$:

| Operation | Notation | Logic equivalent | Result is 1 when |
|---|---|---|---|
| Complement | $\overline{x}$ or $x'$ | $\neg$ | $x = 0$ |
| Sum (OR) | $x + y$ | $\lor$ | at least one is 1 |
| Product (AND) | $x \cdot y$ or $xy$ | $\land$ | both are 1 |

Note that $1 + 1 = 1$ here: Boolean addition is not ordinary addition.

A **Boolean function** of $n$ variables maps each of the $2^n$ input combinations to 0 or 1. There are $2^{2^n}$ such functions; for $n = 2$, that is 16.

## 2. Laws

| Law | Form | Dual |
|---|---|---|
| Identity | $x + 0 = x$ | $x \cdot 1 = x$ |
| Domination | $x + 1 = 1$ | $x \cdot 0 = 0$ |
| Idempotent | $x + x = x$ | $x \cdot x = x$ |
| Complement | $x + \overline{x} = 1$ | $x \cdot \overline{x} = 0$ |
| Involution | $\overline{\overline{x}} = x$ | |
| Commutative | $x + y = y + x$ | $xy = yx$ |
| Distributive | $x(y + z) = xy + xz$ | $x + yz = (x + y)(x + z)$ |
| Absorption | $x + xy = x$ | $x(x + y) = x$ |
| De Morgan | $\overline{x + y} = \overline{x}\,\overline{y}$ | $\overline{xy} = \overline{x} + \overline{y}$ |
| Consensus | $xy + \overline{x}z + yz = xy + \overline{x}z$ | |

**Duality.** Swapping $+$ with $\cdot$ and 0 with 1 in any valid identity gives another valid identity. That is why the laws come in pairs.

The second distributive law, $x + yz = (x + y)(x + z)$, has no counterpart in ordinary arithmetic. It often catches people out.

**Worked example.** Simplify $F = xy + x\overline{y} + \overline{x}y$.

$$
\begin{aligned}
F &= x(y + \overline{y}) + \overline{x}y && \text{distributive} \\
&= x + \overline{x}y && \text{complement, identity} \\
&= (x + \overline{x})(x + y) && \text{second distributive law} \\
&= x + y
\end{aligned}
$$

## 3. Canonical forms

A **minterm** is a product containing every variable once, complemented or not. Each minterm is 1 for exactly one input row. A **maxterm** is a sum of every variable once, and is 0 for exactly one row.

- **Sum of products (SOP), or disjunctive normal form:** OR together the minterms of the rows where $F = 1$.
- **Product of sums (POS), or conjunctive normal form:** AND together the maxterms of the rows where $F = 0$. In a maxterm, a variable is complemented when it is 1 in that row.

**Example.** $F(x, y, z)$ is 1 exactly when at least two inputs are 1 (the majority function).

| Row | $x$ | $y$ | $z$ | $F$ | Minterm |
|---|---|---|---|---|---|
| 3 | 0 | 1 | 1 | 1 | $\overline{x}yz$ |
| 5 | 1 | 0 | 1 | 1 | $x\overline{y}z$ |
| 6 | 1 | 1 | 0 | 1 | $xy\overline{z}$ |
| 7 | 1 | 1 | 1 | 1 | $xyz$ |

All other rows give 0. So

$$
F = \overline{x}yz + x\overline{y}z + xy\overline{z} + xyz = \sum m(3, 5, 6, 7)
$$

which simplifies to $F = xy + yz + xz$.

## 4. Functional completeness

A set of operations is **functionally complete** if every Boolean function can be built from it.

- $\{+, \cdot, \overline{\phantom{x}}\}$ is complete: the SOP form uses only these.
- $\{\cdot, \overline{\phantom{x}}\}$ is complete, because De Morgan gives $x + y = \overline{\overline{x}\,\overline{y}}$. Similarly $\{+, \overline{\phantom{x}}\}$.
- **NAND alone** is complete: $\overline{x} = x \uparrow x$, and AND and OR follow. The same holds for **NOR**.

That is why real chips can be built entirely from NAND gates.

## Summary

- Boolean algebra uses 0 and 1 with OR ($+$), AND ($\cdot$) and complement; $1 + 1 = 1$.
- Its laws mirror those of logic and come in dual pairs; watch out for $x + yz = (x + y)(x + z)$.
- Any function equals the sum of its minterms (rows where it is 1) or the product of its maxterms (rows where it is 0).
- NAND, or NOR, alone is functionally complete.

## Check yourself

<details>
<summary>Simplify x + x̄y.</summary>

$x + \overline{x}y = (x + \overline{x})(x + y) = x + y$.
</details>

<details>
<summary>How many Boolean functions of 3 variables are there?</summary>

$2^{2^3} = 2^8 = 256$.
</details>

<details>
<summary>Express NOT x and x AND y using only NAND.</summary>

$\overline{x} = x \uparrow x$, and $xy = \overline{x \uparrow y} = (x \uparrow y) \uparrow (x \uparrow y)$.
</details>
