---
title: Turing Machines
description: The Turing machine model and formal definition, a worked machine for aⁿbⁿcⁿ, variants (multitape, nondeterministic) and their equivalence, the Church–Turing thesis, the universal Turing machine, and the Chomsky hierarchy.
sidebar:
  label: "8. Turing machines"
  order: 8
lesson:
  module: Computability
  prerequisites:
    - label: CFL properties
      link: /theory-of-computation/cfl-properties/
  outcomes:
    - Describe how a Turing machine computes and give its formal definition
    - Design a Turing machine at the level of a step-by-step algorithm
    - Explain why multitape and nondeterministic machines are no more powerful
    - Match each level of the Chomsky hierarchy to its grammar and machine
  keyIdea: >-
    A **Turing machine** is a finite control with an infinite tape it can read, write and move along in both directions. That small change gives it the full power of any computer: the **Church–Turing thesis** says anything that can be computed by an algorithm can be computed by a Turing machine.
---

## 1. The model

A Turing machine (TM) has:

- An **infinite tape** divided into cells, initially holding the input followed by blanks (⊔).
- A **head** that reads and writes one cell and moves **left or right**.
- A finite set of **states**, including special **accept** and **reject** states.

At each step, based on the current state and the symbol under the head, it writes a symbol, moves left or right, and changes state. It halts as soon as it enters the accept or reject state, and it **may run forever**.

**Formal definition:** $M = (Q, \Sigma, \Gamma, \delta, q_0, q_{\text{accept}}, q_{\text{reject}})$, where $\Sigma \subseteq \Gamma$, the blank ⊔ $\in \Gamma - \Sigma$, and

$$
\delta: Q \times \Gamma \to Q \times \Gamma \times \{L, R\}
$$

$\delta(q, a) = (p, b, R)$ means: in state $q$ reading $a$, write $b$, move right, go to state $p$.

Compared with a PDA, a TM can read its storage in any order (not just the top of a stack) and can revisit the input.

## 2. Worked example: $\{a^n b^n c^n : n \ge 1\}$

This language is not context-free, but a TM handles it easily by **crossing off** one of each letter per pass.

1. If the current cell holds $a$, replace it with $X$. (If it holds $Y$, go to step 5.)
2. Move right past $a$'s and $Y$'s to the first $b$; replace it with $Y$. If there is none, **reject**.
3. Move right past $b$'s and $Z$'s to the first $c$; replace it with $Z$. If there is none, **reject**.
4. Move left back to the rightmost $X$, step right, and repeat from step 1.
5. Check that only $Y$'s and $Z$'s remain before the blank; **accept** if so, otherwise **reject**.

**On $aabbcc$:** pass 1 gives $XaYbZc$; pass 2 gives $XXYYZZ$; the final check finds only $Y$'s and $Z$'s: accept. Each pass is $O(n)$ steps, and there are $n$ passes, so $O(n^2)$ steps.

Exams usually accept a TM described at this **implementation level** (step by step in words), unless they ask for a full transition table.

## 3. Variants are equally powerful

| Variant | Why it is no more powerful |
|---|---|
| Multiple tapes | A single tape can store all tapes' contents side by side, with markers for each head (with at most quadratic slowdown) |
| Two-way infinite tape | Fold it in half onto a one-way tape |
| **Nondeterministic** TM | A deterministic TM explores the tree of choices breadth-first (with exponential slowdown) |
| Stay-in-place moves, extra symbols | Easy simulations |

So the class of languages is robust: no reasonable change to the model changes what it can compute. (Speed is another matter; see [complexity](/theory-of-computation/complexity/).)

**Linear bounded automaton (LBA):** a TM restricted to the part of the tape holding the input. LBAs recognise the **context-sensitive** languages.

## 4. The Church–Turing thesis

> Every function that can be computed by an algorithm (an effective, step-by-step procedure) can be computed by a Turing machine.

It is a **thesis**, not a theorem: "algorithm" is an informal idea, so it cannot be proved. But every model ever proposed (lambda calculus, recursive functions, register machines, real programming languages) has turned out to be equivalent to Turing machines, which is strong evidence.

## 5. The universal Turing machine

A TM can be **encoded** as a string $\langle M \rangle$. A **universal TM** $U$ takes $\langle M, w \rangle$ and simulates $M$ on $w$. This is the idea of the **stored-program computer**: one machine that runs any program given as data. It also makes it possible to ask questions about machines using machines, which leads directly to [undecidability](/theory-of-computation/decidability/).

## 6. The Chomsky hierarchy

| Type | Grammar | Rule form | Machine | Example language |
|---|---|---|---|---|
| 3 | Regular | $A \to aB$, $A \to a$ | Finite automaton | $a^*b^*$ |
| 2 | Context-free | $A \to \alpha$ | Pushdown automaton (nondeterministic) | $a^nb^n$ |
| 1 | Context-sensitive | $\alpha A \beta \to \alpha \gamma \beta$ (rules never shrink) | Linear bounded automaton | $a^nb^nc^n$ |
| 0 | Unrestricted | $\alpha \to \beta$ | Turing machine | The halting language (recognisable, not decidable) |

Each type strictly contains the one above it:

$$
\text{Regular} \subset \text{Context-free} \subset \text{Context-sensitive} \subset \text{Decidable} \subset \text{Recursively enumerable}
$$

## Summary

- A TM has a finite control and an infinite read/write tape; it can move both ways and may never halt.
- TMs are usually described as step-by-step algorithms, such as crossing off symbols in passes.
- Multitape and nondeterministic TMs recognise the same languages as ordinary TMs.
- Church–Turing thesis: algorithms are exactly what Turing machines can do.
- Chomsky hierarchy: regular (FA) ⊂ context-free (PDA) ⊂ context-sensitive (LBA) ⊂ recursively enumerable (TM).

## Check yourself

<details>
<summary>What can a Turing machine do that a PDA cannot?</summary>

Read and write its storage anywhere (not just a stack top), and move back over the input. This lets it, for example, check $a^nb^nc^n$ or $ww$.
</details>

<details>
<summary>Is a nondeterministic Turing machine more powerful than a deterministic one?</summary>

Not in what it can compute: a deterministic TM can simulate it. It may be faster; whether the speed-up can be exponential is the P vs NP question.
</details>

<details>
<summary>Why is the Church–Turing thesis not a theorem?</summary>

It links a precise notion (Turing machines) to an informal one (algorithms or effective procedures), so it cannot be formally proved, only supported by evidence.
</details>
