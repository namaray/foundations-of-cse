---
title: Discrete Mathematics Cheat Sheet
description: One-page revision of logic laws, proof methods, set and counting formulas, recurrences, number theory, graph and tree facts.
sidebar:
  label: "13. Cheat sheet"
  order: 20
  badge:
    text: Revision
    variant: note
lesson:
  module: Revision
---

Use this page for last-minute revision. Each heading links back to the full lesson.

## [Logic](/discrete-mathematics/propositional-logic/)

- $p \to q$ is false **only** when $p$ is true and $q$ is false.
- $p \to q \equiv \neg p \lor q \equiv \neg q \to \neg p$ (contrapositive). The converse $q \to p$ is **not** equivalent.
- De Morgan: $\neg(p \land q) \equiv \neg p \lor \neg q$ and $\neg(p \lor q) \equiv \neg p \land \neg q$.
- Modus ponens: $p, p \to q \vdash q$. Modus tollens: $\neg q, p \to q \vdash \neg p$.
- [Quantifiers](/discrete-mathematics/predicate-logic/): $\neg \forall x\, P(x) \equiv \exists x\, \neg P(x)$; "every $S$ is $P$" is $\forall x (S \to P)$, "some $S$ is $P$" is $\exists x (S \land P)$.

## [Proofs](/discrete-mathematics/proof-techniques/)

| Method | Assume | Show |
|---|---|---|
| Direct | $p$ | $q$ |
| Contrapositive | $\neg q$ | $\neg p$ |
| Contradiction | $\neg S$ | something impossible |
| Induction | $P(k)$ (after the base case) | $P(k+1)$ |
| Strong induction | $P(n_0), \dots, P(k)$ | $P(k+1)$ |

## [Sets](/discrete-mathematics/sets/), [functions](/discrete-mathematics/functions/) and [relations](/discrete-mathematics/relations/)

- $|\mathcal{P}(A)| = 2^{|A|}$, $\quad |A \times B| = |A|\,|B|$.
- $|A \cup B| = |A| + |B| - |A \cap B|$; for three sets, add singles, subtract pairs, add the triple.
- Functions from an $m$-set to an $n$-set: $n^m$; one-to-one: $n!/(n-m)!$; bijections ($m = n$): $n!$.
- Equivalence relation: reflexive, symmetric, transitive → partition into classes.
- Partial order: reflexive, **antisymmetric**, transitive → Hasse diagram.
- Relations on an $n$-set: $2^{n^2}$.

## [Counting](/discrete-mathematics/counting/)

| | Order matters | Order does not matter |
|---|---|---|
| No repetition | $\frac{n!}{(n-r)!}$ | $\binom{n}{r}$ |
| Repetition | $n^r$ | $\binom{n+r-1}{r}$ |

- Identical items: $\frac{n!}{n_1!\, n_2! \cdots}$. Derangements: $D_n = n! \sum_{k=0}^{n} \frac{(-1)^k}{k!}$ ($D_4 = 9$).
- Pigeonhole: $N$ objects in $k$ boxes → some box has $\ge \lceil N/k \rceil$.
- $(x+y)^n = \sum \binom{n}{k} x^{n-k} y^k$; $\binom{n}{k} = \binom{n-1}{k-1} + \binom{n-1}{k}$.

## [Recurrences](/discrete-mathematics/recurrence-relations/)

- $a_n = c_1 a_{n-1} + c_2 a_{n-2}$: solve $r^2 = c_1 r + c_2$.
- Distinct roots: $\alpha r_1^n + \beta r_2^n$. Repeated root: $(\alpha + \beta n) r^n$.
- Non-homogeneous: homogeneous solution plus a particular solution shaped like $F(n)$.
- Hanoi: $H_n = 2^n - 1$.

## [Number theory](/discrete-mathematics/number-theory/)

- $\gcd(a, b) = \gcd(b, a \bmod b)$; $\gcd \cdot \operatorname{lcm} = ab$; Bézout: $\gcd = sa + tb$.
- $a^{-1} \bmod m$ exists iff $\gcd(a, m) = 1$.
- Fermat: $a^{p-1} \equiv 1 \pmod p$. Euler: $a^{\varphi(n)} \equiv 1 \pmod n$; $\varphi(pq) = (p-1)(q-1)$.
- RSA: $c = m^e \bmod n$, $m = c^d \bmod n$, $ed \equiv 1 \pmod{\varphi(n)}$.

## [Graphs](/discrete-mathematics/graph-theory/) and [trees](/discrete-mathematics/trees/)

- $\sum \deg(v) = 2|E|$; $K_n$ has $\frac{n(n-1)}{2}$ edges; $K_{m,n}$ has $mn$.
- Bipartite iff no odd cycle.
- Euler circuit iff connected and all degrees even; Euler path iff exactly 2 odd degrees.
- Planar: $v - e + f = 2$, $e \le 3v - 6$ ($e \le 2v - 4$ with no triangles). $K_5$ and $K_{3,3}$ are not planar.
- Tree: $n - 1$ edges, unique paths. Full $m$-ary: $n = mi + 1$, $l = (m-1)i + 1$. $K_n$ has $n^{n-2}$ spanning trees.
- [Boolean algebra](/discrete-mathematics/boolean-algebra/): $x + yz = (x+y)(x+z)$; NAND alone is functionally complete; $2^{2^n}$ functions of $n$ variables.

## Top viva questions

1. What is the difference between the converse and the contrapositive?
2. Negate a statement with nested quantifiers.
3. Prove $\sqrt 2$ is irrational.
4. Prove a summation formula by induction.
5. Permutation vs combination: when do you use each?
6. State and apply the pigeonhole principle.
7. Is a given relation an equivalence relation? A partial order?
8. Solve a second-order linear recurrence.
9. Find a gcd with the Euclidean algorithm and a modular inverse.
10. When does a graph have an Euler circuit? Why are Hamilton circuits harder?
11. Why is $K_5$ not planar?
12. How many edges does a tree with $n$ vertices have, and why?
