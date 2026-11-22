---
title: Computational Complexity
description: Time complexity of Turing machines, the classes P and NP via deterministic and nondeterministic machines and verifiers, NP-completeness and the Cook–Levin theorem, space complexity, PSPACE, Savitch's theorem and the hierarchy of classes.
sidebar:
  label: "10. Complexity"
  order: 10
lesson:
  module: Computability
  prerequisites:
    - label: Decidability
      link: /theory-of-computation/decidability/
  outcomes:
    - Define P and NP in terms of Turing machines and verifiers
    - Explain what NP-complete means and why the Cook–Levin theorem matters
    - Place P, NP, PSPACE and EXPTIME in order and say which inclusions are known to be strict
  keyIdea: >-
    Decidability asks whether a problem can be solved at all; complexity asks **how efficiently**. **P** is what a deterministic TM solves in polynomial time, **NP** is what a nondeterministic TM solves in polynomial time (equivalently, what can be **verified** quickly), and the NP-complete problems are the hardest in NP.
---

The algorithmic side of NP-completeness (reductions between real problems, proving NP-completeness, approximation) is covered in [Algorithms: NP-completeness](/algorithms/np-completeness/). This lesson gives the machine-based definitions.

## 1. Time complexity

The **running time** of a decider $M$ is the function $f(n)$ giving the maximum number of steps $M$ takes on any input of length $n$.

$$
\text{TIME}(t(n)) = \{L : L \text{ is decided by some deterministic TM in } O(t(n)) \text{ time}\}
$$

The model matters for exact running times: $\{a^nb^n\}$ takes $O(n \log n)$ on one tape but $O(n)$ with two tapes. But any multitape TM can be simulated on one tape with only **polynomial** (quadratic) slowdown, so the class of polynomial-time problems does not depend on the model. That is why P is the standard notion of "efficiently solvable".

## 2. P and NP

$$
\text{P} = \bigcup_k \text{TIME}(n^k) \qquad \text{NP} = \bigcup_k \text{NTIME}(n^k)
$$

where NTIME uses a **nondeterministic** TM (accepting if any branch accepts, with every branch halting within the time bound).

**Equivalent definition of NP:** $L \in \text{NP}$ if there is a polynomial-time **verifier** $V$ such that $w \in L$ exactly when some **certificate** $c$ (of polynomial length) makes $V(w, c)$ accept. The nondeterministic machine "guesses" the certificate; the verifier checks it.

| Problem | Certificate | Verify in polynomial time? |
|---|---|---|
| Hamiltonian path | the path | yes: check every vertex once and every step an edge |
| SAT | an assignment of truth values | yes: evaluate the formula |
| Composite numbers | a factor | yes: divide |
| Clique of size $k$ | the $k$ vertices | yes: check every pair is adjacent |

$\text{P} \subseteq \text{NP}$, since a deterministic machine is a special case of a nondeterministic one. **Whether P = NP is unknown.**

**co-NP** contains the complements of NP languages: those whose "no" answers have short certificates (for example, "this formula is unsatisfiable").

## 3. NP-completeness

$A \le_p B$ (polynomial-time reducible) if a polynomial-time computable $f$ satisfies $w \in A \iff f(w) \in B$.

$B$ is **NP-complete** if:

1. $B \in \text{NP}$, and
2. every $A \in \text{NP}$ satisfies $A \le_p B$ (that is, $B$ is **NP-hard**).

**Cook–Levin theorem:** SAT is NP-complete. The proof encodes the entire computation of any polynomial-time nondeterministic TM as a Boolean formula that is satisfiable exactly when the machine accepts. After that, NP-completeness of other problems follows by reductions: SAT → 3-SAT → CLIQUE, VERTEX COVER, HAMILTONIAN PATH, SUBSET SUM, and thousands more.

If any NP-complete problem is in P, then P = NP.

## 4. Space complexity

$\text{SPACE}(s(n))$ counts the number of **tape cells** used.

- **PSPACE**: decidable in polynomial space. Examples include quantified Boolean formulas (TQBF, which is PSPACE-complete) and deciding the winner of generalised games like chess on an $n \times n$ board.
- **Savitch's theorem:** $\text{NSPACE}(s(n)) \subseteq \text{SPACE}(s(n)^2)$. So nondeterminism helps space only polynomially, and **PSPACE = NPSPACE**. (No such result is known for time.)
- **L** and **NL** are logarithmic space classes, for very memory-efficient algorithms (for example, graph reachability is in NL).

Space can be **reused** but time cannot, so a machine using $s(n)$ space can run for up to $2^{O(s(n))}$ steps.

## 5. The big picture

$$
\text{L} \subseteq \text{NL} \subseteq \text{P} \subseteq \text{NP} \subseteq \text{PSPACE} \subseteq \text{EXPTIME}
$$

- Known to be strict: $\text{P} \subsetneq \text{EXPTIME}$ and $\text{NL} \subsetneq \text{PSPACE}$, by the **hierarchy theorems** (more time or space really does let you solve more).
- So at least one inclusion between P and EXPTIME is strict, but nobody knows which.
- Open: P vs NP, NP vs co-NP, P vs PSPACE.

## Summary

- P = problems a deterministic TM decides in polynomial time; the class is the same for all reasonable models.
- NP = problems a nondeterministic TM decides in polynomial time = problems with polynomial-time verifiable certificates.
- NP-complete = in NP and NP-hard; Cook–Levin shows SAT is NP-complete.
- Savitch: PSPACE = NPSPACE. The chain L ⊆ NL ⊆ P ⊆ NP ⊆ PSPACE ⊆ EXPTIME has P ≠ EXPTIME as its only well-known strict gap.

## Check yourself

<details>
<summary>What does it mean that a problem is in NP?</summary>

A proposed "yes" solution (certificate) can be checked in polynomial time. Equivalently, a nondeterministic TM can decide it in polynomial time. It does **not** mean "not polynomial".
</details>

<details>
<summary>Why is P considered robust with respect to the machine model?</summary>

Reasonable models (multitape TMs, RAM machines, real computers) can simulate each other with only polynomial slowdown, so the set of polynomial-time problems is the same for all of them.
</details>

<details>
<summary>What does Savitch's theorem say about nondeterminism?</summary>

Nondeterministic space $s(n)$ can be simulated in deterministic space $s(n)^2$, so for space, nondeterminism gives at most a polynomial advantage, and PSPACE = NPSPACE.
</details>
