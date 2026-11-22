---
title: Proof Techniques
description: Direct proof, proof by contrapositive, contradiction, cases, existence and counterexample, mathematical induction and strong induction, with classic worked proofs.
sidebar:
  label: "3. Proof techniques"
  order: 3
lesson:
  module: Logic and proof
  prerequisites:
    - label: Predicates and quantifiers
      link: /discrete-mathematics/predicate-logic/
  outcomes:
    - Choose a suitable proof method for a given statement
    - Write a proof by contradiction, such as the irrationality of √2
    - Prove a formula with mathematical induction, stating the base case and inductive step clearly
    - Tell when strong induction is needed
  keyIdea: A proof is a chain of justified steps from what you know to what you want. **Direct** proof goes forwards, **contrapositive** proves $\neg q \to \neg p$ instead, **contradiction** shows the opposite is impossible, and **induction** proves a statement for every natural number in two steps.
---

Most statements you will prove have the form "if $p$ then $q$" or "for every $n$, $P(n)$". This lesson gives a method for each situation, with a model proof you can imitate.

## 1. Direct proof

To prove $p \to q$: **assume $p$**, then reason step by step until you reach $q$.

**Claim.** If $n$ is odd, then $n^2$ is odd.

**Proof.** Suppose $n$ is odd, so $n = 2k + 1$ for some integer $k$. Then

$$
n^2 = 4k^2 + 4k + 1 = 2(2k^2 + 2k) + 1,
$$

which is odd. $\blacksquare$

Useful definitions: $n$ is **even** if $n = 2k$, **odd** if $n = 2k + 1$, and $a$ **divides** $b$ ($a \mid b$) if $b = ak$ for some integer $k$.

## 2. Proof by contrapositive

Since $p \to q \equiv \neg q \to \neg p$, you can instead **assume $\neg q$ and prove $\neg p$**. This helps when $\neg q$ gives you something concrete to work with.

**Claim.** If $n^2$ is even, then $n$ is even.

**Proof.** We prove the contrapositive: if $n$ is odd, then $n^2$ is odd. That is exactly the direct proof above. $\blacksquare$

## 3. Proof by contradiction

To prove a statement $S$: **assume $\neg S$** and derive something impossible, such as $r \land \neg r$. Then $\neg S$ must be false, so $S$ is true.

**Claim.** $\sqrt{2}$ is irrational.

**Proof.** Suppose instead that $\sqrt{2} = a/b$ with integers $a, b$, $b \ne 0$, and the fraction in lowest terms (no common factor).

1. Squaring gives $a^2 = 2b^2$, so $a^2$ is even.
2. By the contrapositive proof above, $a$ is even: $a = 2c$.
3. Then $4c^2 = 2b^2$, so $b^2 = 2c^2$ is even, and $b$ is even.
4. Now $a$ and $b$ are both even, contradicting "lowest terms".

So $\sqrt{2}$ is irrational. $\blacksquare$

**Another classic: there are infinitely many primes.** Suppose there are only finitely many, $p_1, \dots, p_n$. Let $N = p_1 p_2 \cdots p_n + 1$. Dividing $N$ by any $p_i$ leaves remainder 1, so no $p_i$ divides $N$. But every integer greater than 1 has a prime factor, so there is a prime not in the list. Contradiction. $\blacksquare$

## 4. Other methods

- **Proof by cases:** split into cases that cover every possibility and prove each one. For example, to show $n^2 + n$ is even, consider $n$ even and $n$ odd separately.
- **Existence proof:** to prove $\exists x\, P(x)$, give a specific example (constructive) or show one must exist without naming it (non-constructive).
- **Disproof by counterexample:** to show $\forall x\, P(x)$ is false, give one $x$ where $P(x)$ fails. "Every prime is odd" is false: 2.
- **Biconditional:** to prove $p \leftrightarrow q$, prove both $p \to q$ and $q \to p$.

## 5. Mathematical induction

To prove $P(n)$ for every integer $n \ge n_0$:

1. **Base case:** prove $P(n_0)$.
2. **Inductive step:** assume $P(k)$ for an arbitrary $k \ge n_0$ (the **inductive hypothesis**) and prove $P(k + 1)$.

Like dominoes: the first one falls, and each one knocks over the next, so they all fall.

**Claim.** For every $n \ge 1$,

$$
1 + 2 + \dots + n = \frac{n(n+1)}{2}.
$$

**Proof.**

- *Base case* $n = 1$: the left side is 1 and the right side is $\frac{1 \cdot 2}{2} = 1$.
- *Inductive step.* Assume $1 + \dots + k = \frac{k(k+1)}{2}$. Then

$$
1 + \dots + k + (k+1) = \frac{k(k+1)}{2} + (k + 1) = \frac{(k+1)(k+2)}{2},
$$

which is the formula for $n = k + 1$. $\blacksquare$

**Another example.** Prove that $3 \mid (n^3 - n)$ for all $n \ge 0$.

- Base: $0^3 - 0 = 0$, which 3 divides.
- Step: $(k+1)^3 - (k+1) = (k^3 - k) + 3k^2 + 3k$. The first part is divisible by 3 by the hypothesis, and $3k^2 + 3k = 3(k^2 + k)$ is too. $\blacksquare$

:::tip[Writing induction proofs that get full marks]
State the claim $P(n)$, do the base case explicitly, write the inductive hypothesis in full, and point out exactly where you use it.
:::

## 6. Strong induction

In the inductive step, assume $P(n_0), P(n_0 + 1), \dots, P(k)$ **all** hold, then prove $P(k + 1)$. Use it when $P(k + 1)$ depends on cases further back than $P(k)$.

**Claim.** Every integer $n \ge 2$ is a product of primes.

**Proof.** Base: 2 is prime. Step: consider $k + 1$. If it is prime, we are done. Otherwise $k + 1 = ab$ with $2 \le a, b \le k$. By the strong inductive hypothesis, $a$ and $b$ are products of primes, so $ab$ is too. $\blacksquare$

Ordinary induction would only let us assume the result for $k$, which does not help with $a$ and $b$.

<details class="go-deeper">
<summary>Go deeper: the well-ordering principle</summary>

Every non-empty set of positive integers has a smallest element. Induction, strong induction and well-ordering are equivalent; each can be proved from the others. Well-ordering often gives neat proofs by contradiction: take the *smallest* counterexample and show a smaller one exists.
</details>

## Summary

- **Direct:** assume $p$, derive $q$.
- **Contrapositive:** assume $\neg q$, derive $\neg p$.
- **Contradiction:** assume the statement is false and reach an impossibility.
- **Induction:** prove a base case, then show $P(k) \Rightarrow P(k+1)$.
- **Strong induction:** assume all earlier cases, useful when a case depends on several smaller ones.

## Check yourself

<details>
<summary>What is wrong with this "proof" that all horses are the same colour? Base n = 1 is fine; for k + 1 horses, remove one horse and then another, and the overlapping groups share a colour.</summary>

The inductive step fails going from $k = 1$ to $k + 1 = 2$: the two groups of one horse each do not overlap, so nothing links their colours.
</details>

<details>
<summary>Which method would you use to prove "if 3n + 2 is odd, then n is odd"?</summary>

Contrapositive: assume $n$ is even, $n = 2k$. Then $3n + 2 = 6k + 2 = 2(3k + 1)$ is even.
</details>

<details>
<summary>When do you need strong induction instead of ordinary induction?</summary>

When proving $P(k+1)$ needs the result for values other than just $k$, for example a factorisation into smaller parts, or a recurrence such as $a_{k+1} = a_k + a_{k-1}$.
</details>
