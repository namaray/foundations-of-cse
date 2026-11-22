---
title: Properties of Regular Languages
description: The pumping lemma for regular languages with worked proofs of non-regularity, closure properties, decision problems, DFA minimization by table filling, and the Myhill–Nerode theorem.
sidebar:
  label: "4. Pumping lemma and minimization"
  order: 4
lesson:
  module: Regular languages
  prerequisites:
    - label: Regular expressions
      link: /theory-of-computation/regular-expressions/
  outcomes:
    - Prove a language is not regular with the pumping lemma
    - Use closure properties to show a language is or is not regular
    - Minimize a DFA with the table-filling algorithm
  keyIdea: >-
    Every long enough string in a regular language contains a part that can be **pumped** (repeated any number of times) without leaving the language. Showing that pumping fails proves a language is **not** regular. Regular languages are closed under all the usual operations, and every regular language has a unique **minimal DFA**.
---

## 1. The pumping lemma

**Lemma.** If $L$ is regular, there is a number $p$ (the pumping length) such that every string $s \in L$ with $|s| \ge p$ can be split as $s = xyz$ with:

1. $|xy| \le p$
2. $|y| \ge 1$
3. $xy^iz \in L$ for **every** $i \ge 0$

**Why it holds.** Take a DFA for $L$ with $p$ states. Reading $p$ symbols visits $p + 1$ states, so some state repeats; the loop between the repeats is $y$, and going round it any number of times stays in the language.

## 2. Proving a language is not regular

The lemma says what regular languages **must** satisfy. To show $L$ is **not** regular, argue by contradiction, as a game against an opponent:

1. Assume $L$ is regular, with pumping length $p$ (the opponent chooses $p$).
2. **You** choose a string $s \in L$ with $|s| \ge p$, cleverly.
3. The opponent chooses any split $s = xyz$ obeying conditions 1 and 2. You must handle **every** possible split.
4. **You** choose an $i$ so that $xy^iz \notin L$. Contradiction.

### Worked example: $L = \{a^n b^n : n \ge 0\}$

- Assume $L$ is regular with pumping length $p$.
- Choose $s = a^p b^p$.
- Since $|xy| \le p$, both $x$ and $y$ lie inside the $a$'s, so $y = a^k$ with $k \ge 1$.
- Pump with $i = 2$: $xy^2z = a^{p+k}b^p$, which has more $a$'s than $b$'s, so it is not in $L$.

Contradiction, so $L$ is **not regular**.

### More non-regular languages

| Language | String to choose | Why pumping fails |
|---|---|---|
| $\{ww^R\}$ (even palindromes) | $a^p b b a^p$ | $y$ is in the first block of $a$'s; pumping unbalances the two sides |
| $\{a^{n^2}\}$ | $a^{p^2}$ | Pumping once gives length between $p^2 + 1$ and $p^2 + p < (p+1)^2$: not a square |
| $\{a^p : p \text{ prime}\}$ | $a^q$ for a prime $q \ge p + 2$ | Pump $i = q - |y|$ to get a composite length |
| Balanced parentheses | $(^p\,)^p$ | Same idea as $a^n b^n$ |

:::caution[The lemma only works one way]
Satisfying the pumping conditions does **not** prove a language is regular. Some non-regular languages pass the test.
:::

## 3. Closure properties

Regular languages are closed under:

| Operation | Why |
|---|---|
| Union, concatenation, star | Regular expressions (or NFA constructions) |
| **Complement** | Swap accepting and non-accepting states of a complete DFA |
| **Intersection** | Product construction: run both DFAs in parallel (or $L_1 \cap L_2 = \overline{\overline{L_1} \cup \overline{L_2}}$) |
| Difference | $L_1 - L_2 = L_1 \cap \overline{L_2}$ |
| Reversal | Reverse every transition, swap start and accepting states (via an NFA) |
| Homomorphism, inverse homomorphism | Substitute strings for symbols |

**Using closure to prove non-regularity.** Is $L = \{w : w \text{ has equal numbers of } a\text{'s and } b\text{'s}\}$ regular? If it were, then $L \cap a^*b^* = \{a^n b^n\}$ would be regular too, since $a^*b^*$ is regular and intersection preserves regularity. It isn't, so $L$ is not regular.

## 4. Decision problems

For regular languages given as DFAs, these are all **decidable**:

- **Membership:** is $w \in L$? Run the DFA.
- **Emptiness:** is $L = \emptyset$? Check whether any accepting state is reachable.
- **Finiteness:** is $L$ finite? Check for a cycle on some path from the start to an accepting state.
- **Equivalence:** is $L(M_1) = L(M_2)$? Minimize both and compare, or check that the symmetric difference is empty.

## 5. DFA minimization

Two states $p$ and $q$ are **equivalent** if, for every string $w$, reading $w$ from $p$ and from $q$ either both accept or both reject. Merging equivalent states gives the **minimal DFA**.

**Table-filling algorithm:**

1. Remove unreachable states.
2. Mark every pair (accepting, non-accepting) as **distinguishable**.
3. Repeat: mark pair $(p, q)$ if, for some symbol $a$, the pair $(\delta(p, a), \delta(q, a))$ is already marked.
4. Unmarked pairs are equivalent; merge them.

**Small example.** States $A$ (start), $B$, $C$, with $B$ and $C$ accepting.

| State | on 0 | on 1 |
|---|---|---|
| → $A$ | $B$ | $C$ |
| \* $B$ | $B$ | $C$ |
| \* $C$ | $B$ | $C$ |

- $(A, B)$ and $(A, C)$ are marked at once (one accepting, one not).
- $(B, C)$: on 0 both go to $B$, and on 1 both go to $C$, so they lead to identical pairs. They are never marked: **merge $B$ and $C$**.

The minimal DFA has 2 states: "nothing read yet" and "at least one symbol read" (accepting).

**Myhill–Nerode theorem.** $L$ is regular if and only if the "distinguishable by some suffix" relation has finitely many classes, and the minimal DFA has exactly one state per class. Minimal DFAs are **unique** up to renaming states. The theorem is also an alternative way to prove non-regularity: $a, aa, aaa, \dots$ are pairwise distinguishable for $\{a^nb^n\}$ (by the suffixes $b, bb, bbb, \dots$), giving infinitely many classes.

## Summary

- Pumping lemma: long strings in a regular language contain a pumpable $y$ within the first $p$ symbols.
- To prove non-regularity, pick $s$ wisely, handle every split, and pump to leave the language.
- Regular languages are closed under union, intersection, complement, concatenation, star and reversal; closure can also prove non-regularity.
- Minimize a DFA by marking distinguishable pairs and merging the rest; the minimal DFA is unique.

## Check yourself

<details>
<summary>Is the language of all strings over {a, b} with more a's than b's regular?</summary>

No. Intersecting with $a^*b^*$ gives $\{a^m b^n : m > n\}$; pumping $a^{p+1}b^p$ down ($i = 0$) removes at least one $a$, leaving $m \le n$.
</details>

<details>
<summary>Is every finite language regular?</summary>

Yes. A finite language is the union of finitely many strings, each of which is a regular expression.
</details>

<details>
<summary>If L₁ is regular and L₁ ∩ L₂ is not regular, what can you say about L₂?</summary>

$L_2$ is not regular: if it were, the intersection of two regular languages would be regular.
</details>
