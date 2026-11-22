---
title: Sets
description: Set notation, subsets and power sets, set operations and identities, Venn diagrams, Cartesian products, inclusion–exclusion for two and three sets, and countable vs uncountable sets.
sidebar:
  label: "4. Sets"
  order: 4
lesson:
  module: Sets, functions and relations
  outcomes:
    - Compute unions, intersections, differences, complements and power sets
    - Prove set identities using laws or membership tables
    - Count elements with inclusion–exclusion
    - Explain the difference between countable and uncountable sets
  keyIdea: A **set** is an unordered collection of distinct objects. Set operations mirror the logical connectives (union is OR, intersection is AND, complement is NOT), so the same laws, including De Morgan's, apply.
---

## 1. Notation

- **Roster:** $A = \{1, 2, 3\}$. Order and repetition do not matter: $\{1, 2, 2\} = \{2, 1\}$.
- **Set-builder:** $E = \{x \in \mathbb{Z} : x \text{ is even}\}$.
- **Membership:** $2 \in A$, $5 \notin A$.
- **Empty set:** $\emptyset = \{\}$. Note that $\{\emptyset\}$ is not empty: it has one element.
- **Standard sets:** $\mathbb{N}$ (natural numbers), $\mathbb{Z}$ (integers), $\mathbb{Q}$ (rationals), $\mathbb{R}$ (reals).
- **Cardinality** $|A|$: the number of elements. $|\{1, 2, 3\}| = 3$.

## 2. Subsets and power sets

$A \subseteq B$ ($A$ is a **subset** of $B$) if every element of $A$ is in $B$. $A \subset B$ (**proper** subset) also requires $A \ne B$.

- $\emptyset \subseteq A$ and $A \subseteq A$ for every set $A$.
- $A = B$ exactly when $A \subseteq B$ and $B \subseteq A$. This is how equality of sets is usually proved.

The **power set** $\mathcal{P}(A)$ is the set of all subsets of $A$.

$$
\mathcal{P}(\{a, b\}) = \{\emptyset, \{a\}, \{b\}, \{a, b\}\}, \qquad |\mathcal{P}(A)| = 2^{|A|}
$$

Each element is either in a subset or not, giving 2 choices per element.

## 3. Operations

| Operation | Notation | Definition |
|---|---|---|
| Union | $A \cup B$ | $\{x : x \in A \lor x \in B\}$ |
| Intersection | $A \cap B$ | $\{x : x \in A \land x \in B\}$ |
| Difference | $A - B$ | $\{x : x \in A \land x \notin B\}$ |
| Complement | $\overline{A}$ | $\{x \in U : x \notin A\}$, relative to a universal set $U$ |
| Symmetric difference | $A \oplus B$ | $(A - B) \cup (B - A)$: in exactly one of them |

**Example.** $U = \{1, \dots, 8\}$, $A = \{1, 2, 3, 4\}$, $B = \{3, 4, 5, 6\}$.

- $A \cup B = \{1, 2, 3, 4, 5, 6\}$, $\;A \cap B = \{3, 4\}$
- $A - B = \{1, 2\}$, $\;\overline{A} = \{5, 6, 7, 8\}$, $\;A \oplus B = \{1, 2, 5, 6\}$

$A$ and $B$ are **disjoint** if $A \cap B = \emptyset$.

## 4. Set identities

The laws match the logical equivalences, with $\cup$ for $\lor$, $\cap$ for $\land$ and complement for $\neg$:

| Law | Identity |
|---|---|
| De Morgan | $\overline{A \cup B} = \overline{A} \cap \overline{B}$, $\quad \overline{A \cap B} = \overline{A} \cup \overline{B}$ |
| Distributive | $A \cap (B \cup C) = (A \cap B) \cup (A \cap C)$ |
| Absorption | $A \cup (A \cap B) = A$ |
| Complement | $A \cup \overline{A} = U$, $\quad A \cap \overline{A} = \emptyset$ |
| Difference | $A - B = A \cap \overline{B}$ |

**Proving an identity by membership.** Show $\overline{A \cap B} = \overline{A} \cup \overline{B}$:

$$
x \in \overline{A \cap B} \iff \neg(x \in A \land x \in B) \iff x \notin A \lor x \notin B \iff x \in \overline{A} \cup \overline{B}
$$

## 5. Cartesian products

$A \times B = \{(a, b) : a \in A, b \in B\}$ is the set of **ordered pairs**. Order matters: $(1, 2) \ne (2, 1)$.

$$
\{1, 2\} \times \{x, y\} = \{(1, x), (1, y), (2, x), (2, y)\}, \qquad |A \times B| = |A| \cdot |B|
$$

A **relation** from $A$ to $B$ is any subset of $A \times B$. See [Relations](/discrete-mathematics/relations/).

## 6. Inclusion–exclusion

For two sets:

$$
|A \cup B| = |A| + |B| - |A \cap B|
$$

For three sets:

$$
|A \cup B \cup C| = |A| + |B| + |C| - |A \cap B| - |A \cap C| - |B \cap C| + |A \cap B \cap C|
$$

**Worked example.** How many integers from 1 to 100 are divisible by 2, 3 or 5?

- $|A_2| = 50$, $|A_3| = 33$, $|A_5| = 20$
- $|A_2 \cap A_3| = |A_6| = 16$, $\;|A_2 \cap A_5| = |A_{10}| = 10$, $\;|A_3 \cap A_5| = |A_{15}| = 6$
- $|A_2 \cap A_3 \cap A_5| = |A_{30}| = 3$

$$
50 + 33 + 20 - 16 - 10 - 6 + 3 = 74
$$

So 74 numbers are divisible by at least one of them, and $100 - 74 = 26$ by none.

<details class="go-deeper">
<summary>Go deeper: countable and uncountable sets</summary>

Two sets have the same cardinality if there is a **bijection** between them. A set is **countable** if it is finite or has the same cardinality as $\mathbb{N}$, meaning its elements can be listed as a sequence.

- $\mathbb{Z}$ is countable: list it as $0, 1, -1, 2, -2, \dots$
- $\mathbb{Q}$ is countable: list fractions by increasing numerator plus denominator, skipping repeats.
- $\mathbb{R}$ is **uncountable** (Cantor's diagonal argument). Suppose the reals in $(0, 1)$ could be listed. Build a new number whose $i$-th decimal digit differs from the $i$-th digit of the $i$-th number. It differs from every number in the list, so the list was incomplete.

The same diagonal idea shows $|\mathcal{P}(A)| > |A|$ for every set, and is behind the proof that the halting problem is undecidable.
</details>

## Summary

- Sets are unordered and have no duplicates; $A = B$ is proved by showing $A \subseteq B$ and $B \subseteq A$.
- A set with $n$ elements has $2^n$ subsets.
- Union, intersection and complement obey the same laws as $\lor$, $\land$ and $\neg$, including De Morgan's laws.
- $|A \times B| = |A| \cdot |B|$.
- Inclusion–exclusion counts a union by adding single sets, subtracting pairs, and adding back triples.

## Check yourself

<details>
<summary>Is ∅ ∈ {∅, {1}}? Is ∅ ⊆ {1, 2}?</summary>

Yes to both. $\emptyset$ is listed as an element of the first set, and the empty set is a subset of every set.
</details>

<details>
<summary>How many subsets of {a, b, c, d} contain a?</summary>

$2^3 = 8$. Include $a$, then choose freely among the other three elements.
</details>

<details>
<summary>In a class of 40, 25 study C, 20 study Java and 10 study both. How many study neither?</summary>

$|C \cup J| = 25 + 20 - 10 = 35$, so $40 - 35 = 5$ study neither.
</details>
