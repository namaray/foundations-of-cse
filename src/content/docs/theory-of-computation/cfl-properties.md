---
title: Properties of Context-Free Languages
description: The pumping lemma for context-free languages with worked proofs, closure and non-closure properties, decision problems, and the CYK membership algorithm.
sidebar:
  label: "7. CFL properties"
  order: 7
lesson:
  module: Context-free languages
  prerequisites:
    - label: Pushdown automata
      link: /theory-of-computation/pushdown-automata/
  outcomes:
    - Prove a language is not context-free with the CFL pumping lemma
    - List the operations CFLs are and are not closed under
    - Say which questions about CFGs are decidable
  keyIdea: >-
    Long strings in a context-free language can be pumped in **two places at once**. That is enough to show $\{a^nb^nc^n\}$ is not context-free. CFLs are closed under union, concatenation and star, but **not** under intersection or complement.
---

## 1. The pumping lemma for CFLs

**Lemma.** If $L$ is context-free, there is a $p$ such that every $s \in L$ with $|s| \ge p$ can be written $s = uvxyz$ with:

1. $|vxy| \le p$
2. $|vy| \ge 1$ (at least one of $v$, $y$ is non-empty)
3. $uv^ixy^iz \in L$ for every $i \ge 0$

**Why.** In a parse tree for a long enough string, some path from the root must repeat a variable $A$. The subtree under the upper $A$ can be replaced by copies of itself (pumping up) or by the lower $A$'s subtree (pumping down). $v$ and $y$ are the parts the upper $A$ adds on either side.

## 2. Worked example: $\{a^n b^n c^n : n \ge 0\}$

- Assume it is context-free with pumping length $p$, and choose $s = a^p b^p c^p$.
- Since $|vxy| \le p$, the window $vxy$ cannot contain both $a$'s and $c$'s (they are $p$ symbols apart). So $v$ and $y$ together involve **at most two** of the three letters.
- Pump with $i = 2$: the counts of one or two letters increase, but at least one letter's count stays $p$. If $v$ or $y$ mixes two letters, the order breaks too.

Either way, $uv^2xy^2z \notin L$. Contradiction, so $L$ is **not context-free**.

**Other non-context-free languages:** $\{ww : w \in \{a,b\}^*\}$ (copying, as opposed to mirroring), $\{a^{n^2}\}$, $\{a^p : p \text{ prime}\}$, and $\{a^i b^j c^k : i < j < k\}$.

## 3. Closure properties

| Operation | Regular | Context-free | Deterministic CF |
|---|---|---|---|
| Union | ✓ | ✓ | ✗ |
| Concatenation | ✓ | ✓ | ✗ |
| Kleene star | ✓ | ✓ | ✗ |
| Reversal | ✓ | ✓ | ✗ |
| **Intersection** | ✓ | **✗** | ✗ |
| **Complement** | ✓ | **✗** | ✓ |
| Intersection with a regular language | ✓ | **✓** | ✓ |

**Why not intersection?** $\{a^n b^n c^m\}$ and $\{a^m b^n c^n\}$ are both context-free, but their intersection is $\{a^n b^n c^n\}$, which is not.

**Why not complement?** If CFLs were closed under complement, then since they are closed under union, De Morgan's law $L_1 \cap L_2 = \overline{\overline{L_1} \cup \overline{L_2}}$ would make them closed under intersection, which they are not.

**Intersection with a regular language** stays context-free: run a PDA and a DFA side by side. This is a useful tool: to show $L$ is not context-free, intersect it with a regular language to get a known non-CFL.

## 4. Decision problems

| Question | For CFGs |
|---|---|
| Is $w \in L(G)$? (membership) | **Decidable**: CYK in $O(n^3)$ |
| Is $L(G)$ empty? | Decidable: check whether $S$ can derive any terminal string |
| Is $L(G)$ finite? | Decidable |
| Is $L(G) = \Sigma^*$? | **Undecidable** |
| Is $L(G_1) = L(G_2)$? | **Undecidable** |
| Is $L(G_1) \cap L(G_2)$ empty? | **Undecidable** |
| Is $G$ ambiguous? | **Undecidable** |

Compare regular languages, where all of these are decidable.

## 5. The CYK algorithm

For a grammar in [Chomsky normal form](/theory-of-computation/context-free-grammars/#6-normal-forms) and a string $w = w_1 \dots w_n$, fill a triangular table where cell $T[i, j]$ holds the variables that derive the substring $w_i \dots w_j$:

1. **Length 1:** $T[i, i]$ = all $A$ with a rule $A \to w_i$.
2. **Longer substrings:** $A \in T[i, j]$ if there is a rule $A \to BC$ and a split point $k$ with $B \in T[i, k]$ and $C \in T[k+1, j]$.
3. $w \in L$ if and only if $S \in T[1, n]$.

There are $O(n^2)$ cells, each checking $O(n)$ split points: **$O(n^3)$** time. It is a classic dynamic-programming algorithm. Real compilers use faster linear-time parsers (LL and LR) for restricted grammars.

## Summary

- CFL pumping lemma: $s = uvxyz$ with $|vxy| \le p$, and $v$, $y$ pumped together.
- $\{a^nb^nc^n\}$ and $\{ww\}$ are not context-free.
- CFLs are closed under union, concatenation, star and reversal, and under intersection with a regular language, but not under intersection or complement.
- Membership, emptiness and finiteness are decidable for CFGs; equivalence, universality and ambiguity are undecidable.
- CYK decides membership in $O(n^3)$ for grammars in CNF.

## Check yourself

<details>
<summary>Is the intersection of two context-free languages always context-free?</summary>

No. $\{a^nb^nc^m\} \cap \{a^mb^nc^n\} = \{a^nb^nc^n\}$, which is not context-free.
</details>

<details>
<summary>Why is the CFL pumping window |vxy| ≤ p important in the aⁿbⁿcⁿ proof?</summary>

It stops $v$ and $y$ from reaching all three blocks at once, so pumping can never increase all three counts equally.
</details>

<details>
<summary>Is {aⁿbⁿ : n ≥ 0} ∪ {aⁿb²ⁿ : n ≥ 0} context-free?</summary>

Yes. Both parts are context-free, and CFLs are closed under union. (It is, however, not a deterministic CFL.)
</details>
