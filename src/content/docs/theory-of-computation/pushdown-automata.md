---
title: Pushdown Automata
description: The PDA as a finite automaton with a stack, its formal definition and transition notation, worked PDAs for aⁿbⁿ and palindromes, acceptance by final state and empty stack, CFG–PDA equivalence, and deterministic vs nondeterministic PDAs.
sidebar:
  label: "6. Pushdown automata"
  order: 6
lesson:
  module: Context-free languages
  prerequisites:
    - label: Context-free grammars
      link: /theory-of-computation/context-free-grammars/
  outcomes:
    - Design a PDA that uses its stack to match symbols
    - Read and write PDA transitions in the δ(q, a, X) notation
    - Explain why nondeterministic PDAs are more powerful than deterministic ones
  keyIdea: >-
    A **pushdown automaton** is a finite automaton plus an unbounded **stack**. Pushing on one symbol and popping on another lets it match counts and nested structure. PDAs recognise exactly the **context-free languages**, but unlike finite automata, nondeterminism adds real power.
---

## 1. Definition

A PDA is a finite automaton with a **stack** it can push to and pop from. Formally, $P = (Q, \Sigma, \Gamma, \delta, q_0, Z_0, F)$:

| Part | Meaning |
|---|---|
| $Q$, $\Sigma$, $q_0$, $F$ | States, input alphabet, start state, accepting states, as in an NFA |
| $\Gamma$ | Stack alphabet |
| $Z_0$ | Initial stack symbol (marks the bottom) |
| $\delta$ | Transitions: $\delta(q, a, X) = \{(p, \gamma), \dots\}$ |

$\delta(q, a, X) \ni (p, \gamma)$ means: in state $q$, reading input $a$ (or $\varepsilon$, reading nothing), with $X$ on top of the stack, the PDA may move to state $p$ and **replace** $X$ with the string $\gamma$ (leftmost symbol on top).

- $\gamma = X$: leave the stack unchanged.
- $\gamma = YX$: push $Y$.
- $\gamma = \varepsilon$: pop $X$.

In diagrams, an edge is labelled $a, X / \gamma$.

## 2. Worked example: $\{a^n b^n : n \ge 1\}$

Push an $A$ for each $a$; pop an $A$ for each $b$; accept when only $Z_0$ is left.

| Transition | Meaning |
|---|---|
| $\delta(q_0, a, Z_0) = (q_0, AZ_0)$ | first $a$: push $A$ |
| $\delta(q_0, a, A) = (q_0, AA)$ | more $a$'s: push $A$ |
| $\delta(q_0, b, A) = (q_1, \varepsilon)$ | first $b$: pop, switch state |
| $\delta(q_1, b, A) = (q_1, \varepsilon)$ | more $b$'s: pop |
| $\delta(q_1, \varepsilon, Z_0) = (q_2, Z_0)$ | stack back to the bottom: accept |

$F = \{q_2\}$. Moving to $q_1$ on the first $b$ stops any $a$ appearing after a $b$.

**Trace on $aabb$** (stack written top first):

| State | Remaining input | Stack |
|---|---|---|
| $q_0$ | aabb | $Z_0$ |
| $q_0$ | abb | $AZ_0$ |
| $q_0$ | bb | $AAZ_0$ |
| $q_1$ | b | $AZ_0$ |
| $q_1$ | ε | $Z_0$ |
| $q_2$ | ε | $Z_0$ → **accept** |

On $aab$, the input runs out with $AZ_0$ on the stack in $q_1$, and no move leads to $q_2$: rejected.

## 3. Worked example: even palindromes $\{ww^R\}$

1. In $q_0$, push every symbol read.
2. **Guess** the middle: move to $q_1$ on ε, without reading anything.
3. In $q_1$, pop when the input symbol matches the top of the stack.
4. Accept if the stack returns to $Z_0$ when the input ends.

The guess is essential: the PDA cannot know where the middle is, so it tries every position nondeterministically, and some guess succeeds exactly when the string is an even palindrome.

## 4. Two ways to accept

- **By final state:** accept if the input is used up and the PDA is in an accepting state.
- **By empty stack:** accept if the input is used up and the stack is empty.

Any PDA of one kind can be converted to the other, so both define the same class of languages.

## 5. PDAs and CFGs are equivalent

**Theorem.** A language is context-free if and only if some PDA recognises it.

- **CFG → PDA:** the PDA simulates a leftmost derivation on its stack. Start with $S$ on the stack; when a variable is on top, replace it with the right side of one of its rules (nondeterministically); when a terminal is on top, match it against the input and pop.
- **PDA → CFG:** build a variable $A_{pq}$ for "strings that take the PDA from state $p$ to state $q$ with the stack unchanged overall". This is more technical, but always possible.

## 6. Deterministic vs nondeterministic PDAs

A **DPDA** never has a choice: for each state, input symbol (or ε) and stack top, at most one move, and never both an ε-move and a symbol move from the same situation.

| | DPDA | NPDA |
|---|---|---|
| Languages | **Deterministic CFLs** (a proper subset) | All CFLs |
| Example | $\{a^nb^n\}$, $\{wcw^R\}$ (with a centre marker) | $\{ww^R\}$ (no centre marker) |
| Closed under complement? | Yes | No |
| Practical use | Parsers for programming languages (LR parsers) | Theory |

So, unlike finite automata, **nondeterminism makes PDAs strictly more powerful**. Programming languages are designed to have deterministic grammars so they can be parsed in linear time.

## Summary

- A PDA is an NFA plus a stack; transitions read input (or ε), look at the stack top, and replace it.
- Push on one symbol and pop on another to match counts, as in $a^nb^n$.
- Nondeterminism lets a PDA guess, for example the middle of a palindrome.
- PDAs recognise exactly the context-free languages; acceptance by final state and by empty stack are equivalent.
- DPDAs are strictly weaker than NPDAs: $\{ww^R\}$ needs nondeterminism.

## Check yourself

<details>
<summary>What does δ(q, a, X) = (p, YX) do?</summary>

In state $q$, reading $a$ with $X$ on top, the PDA moves to $p$ and pushes $Y$ (leaving $X$ underneath).
</details>

<details>
<summary>Why does {ww^R} need a nondeterministic PDA, but {wcw^R} does not?</summary>

In $\{wcw^R\}$ the $c$ marks the middle, so the PDA knows exactly when to switch from pushing to popping. Without a marker, it must guess the middle.
</details>

<details>
<summary>Can a PDA recognise {aⁿbⁿcⁿ}?</summary>

No. After matching the $a$'s against the $b$'s, the stack is empty and the count is lost, so the $c$'s cannot be checked. The language is not context-free ([next lesson](/theory-of-computation/cfl-properties/)).
</details>
