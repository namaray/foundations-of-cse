---
title: Theory of Computation Cheat Sheet
description: One-page revision of automata, regular expressions, pumping lemmas, grammars, PDAs, closure properties, Turing machines, decidability and complexity classes.
sidebar:
  label: "11. Cheat sheet"
  order: 20
  badge:
    text: Revision
    variant: note
lesson:
  module: Revision
---

Use this page for last-minute revision. Each heading links back to the full lesson.

## [Finite automata](/theory-of-computation/finite-automata/) and [NFAs](/theory-of-computation/nfa/)

- DFA $(Q, \Sigma, \delta, q_0, F)$: exactly one move per state and symbol. States = what you must remember.
- Divisible by $k$ (binary input): $\delta(q_r, b) = q_{(2r+b) \bmod k}$.
- NFA → DFA by subset construction: up to $2^n$ states; a subset is accepting if it contains an accepting state.
- DFA = NFA = ε-NFA = regular expression = regular grammar ([Kleene](/theory-of-computation/regular-expressions/)).

## [Regular expressions](/theory-of-computation/regular-expressions/)

- Precedence: star > concatenation > union.
- $(R^*)^* = R^*$, $(R+S)^* = (R^*S^*)^*$, $\emptyset^* = \varepsilon$. Arden: $R = Q + RP \Rightarrow R = QP^*$.

## [Pumping lemmas](/theory-of-computation/regular-properties/)

| | Regular | Context-free |
|---|---|---|
| Split | $s = xyz$ | $s = uvxyz$ |
| Conditions | $\lvert xy \rvert \le p$, $\lvert y \rvert \ge 1$ | $\lvert vxy \rvert \le p$, $\lvert vy \rvert \ge 1$ |
| Pump | $xy^iz$ | $uv^ixy^iz$ |
| Classic non-member | $a^nb^n$ | $a^nb^nc^n$, $ww$ |

## [Grammars](/theory-of-computation/context-free-grammars/) and [PDAs](/theory-of-computation/pushdown-automata/)

- $a^nb^n$: $S \to aSb \mid \varepsilon$. Palindromes: $S \to aSa \mid bSb \mid a \mid b \mid \varepsilon$. Balanced: $S \to (S) \mid SS \mid \varepsilon$.
- Ambiguous = two parse trees. Fix expressions with $E \to E+T \mid T$, $T \to T*F \mid F$, $F \to (E) \mid \text{id}$.
- CNF: $A \to BC \mid a$; derivation of length $n$ takes $2n - 1$ steps; CYK is $O(n^3)$.
- PDA = NFA + stack. NPDA (all CFLs) is more powerful than DPDA: $\{ww^R\}$ needs nondeterminism.

## [Closure](/theory-of-computation/cfl-properties/)

| | Union | Intersection | Complement | Concat | Star |
|---|---|---|---|---|---|
| Regular | ✓ | ✓ | ✓ | ✓ | ✓ |
| Context-free | ✓ | ✗ | ✗ | ✓ | ✓ |
| Decidable | ✓ | ✓ | ✓ | ✓ | ✓ |
| Recognizable | ✓ | ✓ | ✗ | ✓ | ✓ |

CFL ∩ regular is context-free.

## [Turing machines](/theory-of-computation/turing-machines/) and [decidability](/theory-of-computation/decidability/)

- Chomsky hierarchy: Type 3 regular (FA) ⊂ Type 2 CF (PDA) ⊂ Type 1 CS (LBA) ⊂ Type 0 (TM).
- Multitape and nondeterministic TMs have the same power as basic TMs.
- Decidable iff $L$ and $\overline{L}$ are both recognizable.
- $A_{\text{TM}}$ and HALT: recognizable, undecidable. $\overline{A_{\text{TM}}}$: not recognizable.
- Reduce a known undecidable problem **to** the new one. Rice: non-trivial language properties of TMs are undecidable.
- Decidable for DFAs: membership, emptiness, equivalence. For CFGs: membership and emptiness, but **not** equivalence or ambiguity.

## [Complexity](/theory-of-computation/complexity/)

- P (deterministic polynomial time) ⊆ NP (nondeterministic polynomial time = polynomial-time verifiable).
- NP-complete: in NP and NP-hard. Cook–Levin: SAT is NP-complete.
- L ⊆ NL ⊆ P ⊆ NP ⊆ PSPACE = NPSPACE ⊆ EXPTIME; P ≠ EXPTIME.

## Top viva questions

1. Design a DFA for a given pattern; convert an NFA to a DFA.
2. Write a regular expression for a described language.
3. Prove $\{a^nb^n\}$ is not regular.
4. Minimize a DFA.
5. Write a CFG for a given language; show a grammar is ambiguous.
6. Design a PDA for $\{a^nb^n\}$. Why is NPDA more powerful than DPDA?
7. Prove $\{a^nb^nc^n\}$ is not context-free.
8. Why are CFLs not closed under intersection?
9. State the Church–Turing thesis.
10. Prove the halting problem is undecidable.
11. Decidable vs recognizable, with examples.
12. Define P and NP using Turing machines.
