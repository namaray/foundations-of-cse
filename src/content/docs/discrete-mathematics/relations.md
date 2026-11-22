---
title: Relations
description: Properties of relations, matrix and digraph representations, closures and Warshall's algorithm, equivalence relations and partitions, partial orders, Hasse diagrams and lattices.
sidebar:
  label: "6. Relations"
  order: 6
lesson:
  module: Sets, functions and relations
  prerequisites:
    - label: Sets
      link: /discrete-mathematics/sets/
  outcomes:
    - Test a relation for reflexivity, symmetry, antisymmetry and transitivity
    - Find the equivalence classes of an equivalence relation
    - Draw the Hasse diagram of a partial order
  keyIdea: A **relation** on a set is a set of ordered pairs. Four properties classify it. **Equivalence relations** (reflexive, symmetric, transitive) split a set into groups; **partial orders** (reflexive, antisymmetric, transitive) arrange it in a hierarchy.
---

## 1. What a relation is

A **relation** $R$ from $A$ to $B$ is a subset of $A \times B$. We write $a \,R\, b$ when $(a, b) \in R$. A relation **on** $A$ is a subset of $A \times A$.

**Example.** On $A = \{1, 2, 3, 4\}$, "divides": $R = \{(1,1), (1,2), (1,3), (1,4), (2,2), (2,4), (3,3), (4,4)\}$.

A set with $n$ elements has $2^{n^2}$ relations on it, one for each subset of the $n^2$ pairs.

### Representations

- **Matrix:** $M_{ij} = 1$ if $a_i \,R\, a_j$, else 0.
- **Directed graph:** one vertex per element, an arrow $a \to b$ for each pair, and a loop for $(a, a)$.

## 2. Properties

| Property | Definition | In the matrix | In the digraph |
|---|---|---|---|
| Reflexive | $a \,R\, a$ for every $a$ | all 1s on the diagonal | a loop at every vertex |
| Irreflexive | $a \,R\, a$ for no $a$ | all 0s on the diagonal | no loops |
| Symmetric | $a \,R\, b \Rightarrow b \,R\, a$ | $M = M^T$ | every arrow has a reverse |
| Antisymmetric | $a \,R\, b \land b \,R\, a \Rightarrow a = b$ | no pair of 1s at $(i,j)$ and $(j,i)$, $i \ne j$ | no two-way arrows between different vertices |
| Transitive | $a \,R\, b \land b \,R\, c \Rightarrow a \,R\, c$ | — | every two-step path has a shortcut |

**Examples on $\mathbb{Z}$:**

| Relation | Reflexive | Symmetric | Antisymmetric | Transitive |
|---|---|---|---|---|
| $a = b$ | Yes | Yes | Yes | Yes |
| $a \le b$ | Yes | No | Yes | Yes |
| $a < b$ | No | No | Yes | Yes |
| $a \equiv b \pmod 3$ | Yes | Yes | No | Yes |
| $a \mid b$ on positive integers | Yes | No | Yes | Yes |

:::caution[Symmetric and antisymmetric are not opposites]
A relation can be both (equality) or neither ($\{(1,2), (2,1), (1,3)\}$ on $\{1,2,3\}$).
:::

## 3. Closures

The **closure** of $R$ for a property is the smallest relation containing $R$ that has the property.

- **Reflexive closure:** add $(a, a)$ for every $a$.
- **Symmetric closure:** add $(b, a)$ for every $(a, b)$.
- **Transitive closure:** add $(a, c)$ whenever $c$ is reachable from $a$ by a path. It is computed with **Warshall's algorithm** in $O(n^3)$, the same triple loop as [Floyd–Warshall](/algorithms/shortest-paths/#floydwarshall-all-pairs) using OR and AND instead of min and plus.

## 4. Equivalence relations

An **equivalence relation** is reflexive, symmetric and transitive. It behaves like "is the same as, in some respect".

The **equivalence class** of $a$ is $[a] = \{x : x \,R\, a\}$. The classes are disjoint and cover the whole set, so they form a **partition**. Conversely, every partition defines an equivalence relation ("in the same block").

**Example.** Congruence modulo 3 on $\mathbb{Z}$ has three classes:

$$
[0] = \{\dots, -3, 0, 3, 6, \dots\}, \quad [1] = \{\dots, -2, 1, 4, 7, \dots\}, \quad [2] = \{\dots, -1, 2, 5, 8, \dots\}
$$

## 5. Partial orders

A **partial order** is reflexive, **antisymmetric** and transitive. A set with a partial order is a **poset**, written $(S, \preceq)$.

- **Comparable:** $a \preceq b$ or $b \preceq a$. In a partial order some pairs may be incomparable: 2 and 3 under "divides".
- **Total order:** every pair is comparable, for example $\le$ on $\mathbb{Z}$.

### Hasse diagrams

A **Hasse diagram** draws a poset compactly: put larger elements higher, draw an edge only between an element and the ones **directly** above it, and leave out loops and edges implied by transitivity.

**Example:** divisibility on $\{1, 2, 3, 4, 6, 12\}$.

```text
        12
       /  \
      4    6
      |  /  \
      2      3
       \    /
         1
```

Edges: 1–2, 1–3, 2–4, 2–6, 3–6, 4–12, 6–12. (There is no edge 2–12, because $2 \mid 4 \mid 12$ already implies it.)

**Special elements:**

- **Maximal / minimal:** nothing above / below it. **Greatest / least:** above / below everything. Here 12 is greatest and 1 is least.
- **Upper bound** of a subset: an element above all of it. The **least upper bound** (supremum, or *join*) is the smallest such; the **greatest lower bound** (infimum, or *meet*) is the largest lower bound. For divisibility, join is lcm and meet is gcd.

A **lattice** is a poset where every pair has both a join and a meet. Divisibility on the divisors of 12 is a lattice.

A **topological sort** extends a partial order to a total order; see [Graph traversal](/algorithms/graph-traversal/#topological-sort).

## Summary

- A relation is a set of ordered pairs; it can be drawn as a matrix or a digraph.
- The four key properties are reflexive, symmetric, antisymmetric and transitive.
- Equivalence relations (reflexive, symmetric, transitive) partition a set into equivalence classes.
- Partial orders (reflexive, antisymmetric, transitive) are drawn as Hasse diagrams; a lattice has a join and meet for every pair.

## Check yourself

<details>
<summary>Is the relation "x and y have the same birthday" an equivalence relation? What are its classes?</summary>

Yes: reflexive, symmetric and transitive. There are at most 366 classes, one for each possible birthday.
</details>

<details>
<summary>Is ⊆ on the power set of {a, b} a total order?</summary>

No. It is a partial order, but $\{a\}$ and $\{b\}$ are incomparable.
</details>

<details>
<summary>How many relations on a 3-element set are reflexive?</summary>

The 3 diagonal pairs must be present, and each of the other $9 - 3 = 6$ pairs is free: $2^6 = 64$.
</details>
