---
title: Functions
description: Domain, codomain and range, injective, surjective and bijective functions, inverses and composition, floor and ceiling, and counting functions between finite sets.
sidebar:
  label: "5. Functions"
  order: 5
lesson:
  module: Sets, functions and relations
  prerequisites:
    - label: Sets
      link: /discrete-mathematics/sets/
  outcomes:
    - Decide whether a function is one-to-one, onto, or both
    - Find the composition of two functions and the inverse of a bijection
    - Count the functions, one-to-one functions and onto functions between two finite sets
  keyIdea: >-
    A **function** $f: A \to B$ assigns exactly one output in $B$ to every input in $A$. It is **one-to-one** if different inputs give different outputs, **onto** if every element of $B$ is hit, and a **bijection** if both; only bijections have inverses.
---

## 1. What a function is

A function $f: A \to B$ assigns to **each** element of $A$ **exactly one** element of $B$.

- $A$ is the **domain** and $B$ the **codomain**.
- $f(a)$ is the **image** of $a$; $a$ is a **preimage** of $f(a)$.
- The **range** is the set of outputs actually used: $\{f(a) : a \in A\} \subseteq B$.

**Example.** $f: \mathbb{Z} \to \mathbb{Z}$, $f(x) = x^2$. The codomain is $\mathbb{Z}$, but the range is $\{0, 1, 4, 9, \dots\}$.

A rule fails to be a function if some input has **no** output, or **more than one**.

## 2. One-to-one, onto and bijective

| Property | Also called | Definition | Test |
|---|---|---|---|
| One-to-one | injective | $f(a_1) = f(a_2) \Rightarrow a_1 = a_2$ | no output is hit twice |
| Onto | surjective | every $b \in B$ has some $a$ with $f(a) = b$ | range = codomain |
| Bijective | one-to-one correspondence | both of the above | every output hit exactly once |

**Examples** with domain and codomain as stated:

| Function | One-to-one? | Onto? |
|---|---|---|
| $f: \mathbb{Z} \to \mathbb{Z}$, $f(x) = x + 1$ | Yes | Yes (bijection) |
| $f: \mathbb{Z} \to \mathbb{Z}$, $f(x) = 2x$ | Yes | No: odd numbers are missed |
| $f: \mathbb{Z} \to \mathbb{Z}$, $f(x) = x^2$ | No: $f(2) = f(-2)$ | No: negatives are missed |
| $f: \mathbb{R} \to \mathbb{R}$, $f(x) = x^3$ | Yes | Yes (bijection) |

**Proving one-to-one.** For $f(x) = 3x + 5$: suppose $3a + 5 = 3b + 5$; then $3a = 3b$, so $a = b$.

**Proving onto.** For $f: \mathbb{R} \to \mathbb{R}$, $f(x) = 3x + 5$: given any $y$, take $x = (y - 5)/3$; then $f(x) = y$.

For finite sets with $|A| = |B|$, one-to-one and onto are equivalent: either implies the other.

## 3. Inverses and composition

If $f: A \to B$ is a bijection, its **inverse** $f^{-1}: B \to A$ sends each $b$ back to the unique $a$ with $f(a) = b$. Only bijections have inverses.

**Example.** $f(x) = 3x + 5$ has inverse $f^{-1}(y) = (y - 5)/3$.

The **composition** of $g: A \to B$ and $f: B \to C$ is $(f \circ g)(x) = f(g(x))$: apply $g$ first.

**Example.** $f(x) = x^2$, $g(x) = x + 1$:

- $(f \circ g)(x) = (x + 1)^2$
- $(g \circ f)(x) = x^2 + 1$

Composition is **not** commutative in general, but it is associative.

## 4. Floor and ceiling

- $\lfloor x \rfloor$ (**floor**): the largest integer $\le x$. $\lfloor 2.7 \rfloor = 2$, $\lfloor -2.7 \rfloor = -3$.
- $\lceil x \rceil$ (**ceiling**): the smallest integer $\ge x$. $\lceil 2.1 \rceil = 3$, $\lceil -2.1 \rceil = -2$.

They appear throughout algorithm analysis, for example $\lfloor \log_2 n \rfloor + 1$ bits to write $n$, or $\lceil n/k \rceil$ in the pigeonhole principle.

## 5. Counting functions

Let $|A| = m$ and $|B| = n$.

| Count | Formula | Why |
|---|---|---|
| All functions $A \to B$ | $n^m$ | each of the $m$ inputs has $n$ choices |
| One-to-one functions ($m \le n$) | $n(n-1)\cdots(n-m+1) = \dfrac{n!}{(n-m)!}$ | each input needs an unused output |
| Bijections ($m = n$) | $n!$ | arrangements of the outputs |
| Onto functions | $\displaystyle\sum_{k=0}^{n} (-1)^k \binom{n}{k} (n - k)^m$ | inclusion–exclusion on missed outputs |

**Example.** $|A| = 3$, $|B| = 2$: $2^3 = 8$ functions, no one-to-one functions (3 inputs cannot fit into 2 outputs without repeats), and $2^3 - 2 = 6$ onto functions (all except the two constant functions).

## Summary

- A function gives every input exactly one output; the range may be smaller than the codomain.
- One-to-one means no output is reused; onto means every output is used; bijective means both.
- Only bijections have inverses; composition $f \circ g$ applies $g$ first.
- There are $n^m$ functions from an $m$-set to an $n$-set, and $n!/(n-m)!$ of them are one-to-one.

## Check yourself

<details>
<summary>Is f: ℕ → ℕ, f(n) = n + 1 onto?</summary>

No, if $\mathbb{N}$ starts at 0 (or at 1): the first natural number has no preimage. It is one-to-one, though, which shows that for infinite sets one-to-one does not imply onto.
</details>

<details>
<summary>How many functions are there from a 4-element set to a 3-element set? How many are one-to-one?</summary>

$3^4 = 81$ functions, and none are one-to-one, since 4 inputs cannot map to distinct outputs among 3.
</details>

<details>
<summary>If f ∘ g is one-to-one, must g be one-to-one?</summary>

Yes. If $g(a) = g(b)$ then $f(g(a)) = f(g(b))$, so $a = b$ because $f \circ g$ is one-to-one.
</details>
