---
title: Karnaugh Maps
description: Simplifying Boolean functions with 2-, 3- and 4-variable K-maps, grouping rules, prime and essential prime implicants, don't-care conditions, POS simplification, and the Quine–McCluskey method.
sidebar:
  label: "3. Karnaugh maps"
  order: 3
lesson:
  module: Combinational logic
  prerequisites:
    - label: Logic gates
      link: /digital-logic-design/logic-gates/
  outcomes:
    - Fill a K-map from a minterm list
    - Group 1s correctly to find a minimal sum of products
    - Use don't-care conditions to simplify further
    - Identify prime and essential prime implicants
  keyIdea: >-
    A Karnaugh map arranges a truth table so that neighbouring cells differ in exactly one variable. Grouping adjacent 1s in rectangles of 1, 2, 4 or 8 cells removes the variables that change within the group, giving a minimal sum of products by eye.
---

## 1. Layout

Rows and columns are labelled in **Gray code** order (00, 01, 11, 10), so physically adjacent cells differ in one bit. The map also **wraps around**: the left and right edges are adjacent, and so are the top and bottom.

**4-variable map** with $AB$ on the rows and $CD$ on the columns. Each cell shows its minterm number:

| $AB$ \ $CD$ | 00 | 01 | 11 | 10 |
|---|---|---|---|---|
| **00** | 0 | 1 | 3 | 2 |
| **01** | 4 | 5 | 7 | 6 |
| **11** | 12 | 13 | 15 | 14 |
| **10** | 8 | 9 | 11 | 10 |

Note the order of the last two columns and rows: 3 comes before 2, and 12 before 8.

## 2. Grouping rules

1. Group only 1s (for SOP), in **rectangles** whose size is a power of 2: 1, 2, 4, 8 or 16 cells.
2. Make each group **as large as possible**.
3. Use **as few groups as possible** while covering every 1.
4. Groups may **overlap**, and may **wrap** around the edges (the four corners form one group of 4).

Each group becomes one product term containing only the variables that stay **constant** across the group. A group of $2^k$ cells eliminates $k$ variables.

## 3. Worked example

Simplify $F(A, B, C, D) = \sum m(0, 1, 2, 5, 8, 9, 10)$.

| $AB$ \ $CD$ | 00 | 01 | 11 | 10 |
|---|---|---|---|---|
| **00** | **1** | **1** | 0 | **1** |
| **01** | 0 | **1** | 0 | 0 |
| **11** | 0 | 0 | 0 | 0 |
| **10** | **1** | **1** | 0 | **1** |

- **Cells 0, 1, 8, 9** (columns 00 and 01, rows 00 and 10, which are adjacent by wrapping): $B = 0$ and $C = 0$ are constant → $\overline{B}\,\overline{C}$.
- **Cells 0, 2, 8, 10** (the four corners): $B = 0$ and $D = 0$ → $\overline{B}\,\overline{D}$.
- **Cell 5** pairs with cell 1 (cells 1 and 5: $A = 0$, $C = 0$, $D = 1$) → $\overline{A}\,\overline{C}D$.

$$
F = \overline{B}\,\overline{C} + \overline{B}\,\overline{D} + \overline{A}\,\overline{C}D
$$

## 4. Don't-care conditions

Sometimes certain input combinations never occur (for example, BCD codes 1010–1111), or their output does not matter. Mark them **X** and treat each one as 1 **if that makes a group bigger**, otherwise as 0.

**Example.** $F = \sum m(1, 3, 7, 11, 15) + d(0, 2, 5)$.

- Column $CD = 11$ (cells 3, 7, 15, 11) → $CD$.
- Row $AB = 00$ (cells 0, 1, 3, 2), using don't-cares 0 and 2 → $\overline{A}\,\overline{B}$.

$$
F = CD + \overline{A}\,\overline{B}
$$

(Using don't-care 5 instead, cells 1, 3, 5, 7 give $\overline{A}D$, so $F = CD + \overline{A}D$ is equally minimal.)

## 5. Prime and essential prime implicants

- An **implicant** is any valid group of 1s.
- A **prime implicant** is a group that cannot be made any larger.
- An **essential prime implicant** is a prime implicant that covers some 1 that **no other** prime implicant covers.

**Systematic method:** find all prime implicants; include every essential one; then cover any remaining 1s with as few extra prime implicants as possible.

In the worked example in section 3, all three groups are essential: cell 9 is covered only by $\overline{B}\,\overline{C}$, cell 10 only by $\overline{B}\,\overline{D}$, and cell 5 only by $\overline{A}\,\overline{C}D$.

## 6. Product-of-sums simplification

Group the **0s** instead, which gives a minimal SOP for $\overline{F}$, then apply De Morgan's law to get a POS for $F$. Equivalently, each group of 0s gives a sum term where a variable that is constantly 1 appears complemented.

**Example.** For $F = \sum m(0, 1, 2, 5, 8, 9, 10)$ above, the 0s group as $AB$ (rows 11), $CD$ (column 11) and $B\overline{D}$ (cells 4, 6, 12, 14). So $\overline{F} = AB + CD + B\overline{D}$, and

$$
F = (\overline{A} + \overline{B})(\overline{C} + \overline{D})(\overline{B} + D)
$$

Choose whichever of SOP or POS needs fewer gates.

<details class="go-deeper">
<summary>Go deeper: Quine–McCluskey</summary>

K-maps become impractical beyond 5 or 6 variables. The **Quine–McCluskey** method is a tabular algorithm that does the same job and can be programmed:

1. List the minterms in binary, grouped by the number of 1s.
2. Combine pairs from neighbouring groups that differ in one bit, replacing that bit with a dash (for example, 0001 and 0101 combine to 0-01). Repeat until nothing combines; the terms that never combined are the prime implicants.
3. Build a **prime implicant chart** and choose essential prime implicants, then a minimum cover for the rest.

Its worst-case running time is exponential, since minimisation is NP-hard in general.
</details>

## Summary

- K-maps use Gray-code order, so adjacent cells (including across edges) differ in one variable.
- Group 1s in power-of-2 rectangles, as large and as few as possible; each group of $2^k$ cells drops $k$ variables.
- Don't-cares can be used as 1s when they enlarge groups.
- Essential prime implicants must appear in every minimal cover.
- Group 0s and apply De Morgan to get a minimal POS.

## Check yourself

<details>
<summary>Simplify F(A, B, C) = Σm(0, 2, 4, 6).</summary>

The 1s are the cells with $C = 0$: all four form one group. $F = \overline{C}$.
</details>

<details>
<summary>Simplify F(A, B, C) = Σm(1, 3, 5, 7).</summary>

$F = C$: the four cells where $C = 1$ form one group.
</details>

<details>
<summary>Why must K-map labels be in Gray code order?</summary>

So that physically adjacent cells differ in exactly one variable. Only then does grouping adjacent cells remove a variable.
</details>
