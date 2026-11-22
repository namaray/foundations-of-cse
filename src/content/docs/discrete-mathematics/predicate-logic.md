---
title: Predicates and Quantifiers
description: Predicates, universal and existential quantifiers, negating quantified statements, nested quantifiers, translating English, and rules of inference with quantifiers.
sidebar:
  label: "2. Predicates and quantifiers"
  order: 2
lesson:
  module: Logic and proof
  prerequisites:
    - label: Propositional logic
      link: /discrete-mathematics/propositional-logic/
  outcomes:
    - Translate English sentences into quantified statements and back
    - Negate a statement with one or more quantifiers
    - Explain why the order of nested quantifiers matters
  keyIdea: A **predicate** such as $P(x)$ becomes a proposition once you choose $x$ or **quantify** it. $\forall x\, P(x)$ says $P$ holds for every $x$ in the domain; $\exists x\, P(x)$ says it holds for at least one. Negation swaps $\forall$ and $\exists$.
---

Propositional logic cannot express "every student passed" or "some number is prime", because those statements are about many objects at once. Predicate logic adds variables and quantifiers.

## 1. Predicates

A **predicate** is a statement with variables, such as $P(x)$: "$x > 3$". It is not a proposition until the variable has a value: $P(5)$ is true and $P(2)$ is false.

The **domain** (or universe of discourse) is the set of values the variable may take. The truth of a quantified statement depends on the domain.

## 2. Quantifiers

| Quantifier | Notation | Meaning | True when | False when |
|---|---|---|---|---|
| Universal | $\forall x\, P(x)$ | for every $x$, $P(x)$ | $P(x)$ holds for every $x$ | some $x$ makes $P(x)$ false (a **counterexample**) |
| Existential | $\exists x\, P(x)$ | there is an $x$ with $P(x)$ | at least one $x$ makes $P(x)$ true | $P(x)$ is false for every $x$ |

Over a finite domain $\{x_1, \dots, x_n\}$:

$$
\forall x\, P(x) \equiv P(x_1) \land \dots \land P(x_n), \qquad \exists x\, P(x) \equiv P(x_1) \lor \dots \lor P(x_n)
$$

**Example.** Domain: integers. $\forall x\, (x^2 \ge 0)$ is true. $\exists x\, (x^2 = 2)$ is false over the integers but true over the real numbers.

**Uniqueness:** $\exists! x\, P(x)$ means exactly one $x$ satisfies $P$.

## 3. Translating English

Two patterns cover most sentences:

| English | Logic | Note |
|---|---|---|
| "Every $S$ is $P$" | $\forall x\, (S(x) \to P(x))$ | use $\to$ with $\forall$ |
| "Some $S$ is $P$" | $\exists x\, (S(x) \land P(x))$ | use $\land$ with $\exists$ |

**Example.** Domain: all people. $S(x)$: "$x$ is a student", $P(x)$: "$x$ passed".

- "Every student passed": $\forall x\, (S(x) \to P(x))$.
- "Some student passed": $\exists x\, (S(x) \land P(x))$.

:::caution[Common mistake]
$\forall x\, (S(x) \land P(x))$ says *everyone is a student and passed*, which is far too strong. $\exists x\, (S(x) \to P(x))$ is true as soon as there is one non-student, which is far too weak.
:::

## 4. Negating quantifiers

De Morgan's laws for quantifiers:

$$
\neg \forall x\, P(x) \equiv \exists x\, \neg P(x), \qquad \neg \exists x\, P(x) \equiv \forall x\, \neg P(x)
$$

"Not everyone passed" means "someone did not pass". "Nobody cheated" means "everyone did not cheat".

**Worked example.** Negate "Every student has a laptop or a phone."

$$
\neg \forall x\, \big(S(x) \to (L(x) \lor F(x))\big) \equiv \exists x\, \big(S(x) \land \neg L(x) \land \neg F(x)\big)
$$

"Some student has neither a laptop nor a phone." The steps: swap the quantifier, then use $\neg(p \to q) \equiv p \land \neg q$ and De Morgan.

## 5. Nested quantifiers

With two variables, the **order matters** when the quantifiers differ. Let $L(x, y)$ mean "$x$ loves $y$".

| Statement | Meaning |
|---|---|
| $\forall x\, \exists y\, L(x, y)$ | everyone loves somebody (each person may love a different person) |
| $\exists y\, \forall x\, L(x, y)$ | there is one person whom everybody loves |
| $\forall x\, \forall y\, L(x, y)$ | everyone loves everyone |
| $\exists x\, \exists y\, L(x, y)$ | somebody loves somebody |

The second statement implies the first, but not the other way round.

**A mathematical example.** Over the integers, $\forall x\, \exists y\, (x + y = 0)$ is true (take $y = -x$). But $\exists y\, \forall x\, (x + y = 0)$ is false: no single $y$ works for every $x$.

Quantifiers of the **same** kind can be swapped freely: $\forall x\, \forall y \equiv \forall y\, \forall x$.

**Negating nested quantifiers:** move $\neg$ inwards one quantifier at a time, swapping each one.

$$
\neg \forall x\, \exists y\, P(x, y) \equiv \exists x\, \forall y\, \neg P(x, y)
$$

<details class="go-deeper">
<summary>Go deeper: rules of inference with quantifiers</summary>

| Rule | From | Conclude |
|---|---|---|
| Universal instantiation | $\forall x\, P(x)$ | $P(c)$ for any particular $c$ |
| Universal generalisation | $P(c)$ for an **arbitrary** $c$ | $\forall x\, P(x)$ |
| Existential instantiation | $\exists x\, P(x)$ | $P(c)$ for some (new, unnamed) $c$ |
| Existential generalisation | $P(c)$ for some particular $c$ | $\exists x\, P(x)$ |

**Classic example.** "All humans are mortal. Socrates is human. Therefore Socrates is mortal." Universal instantiation gives $H(\text{Socrates}) \to M(\text{Socrates})$, then modus ponens gives $M(\text{Socrates})$.
</details>

## Summary

- A predicate becomes a proposition when its variables get values or are quantified.
- $\forall$ pairs naturally with $\to$, and $\exists$ pairs naturally with $\land$.
- Negation swaps $\forall$ and $\exists$ and pushes the $\neg$ inside.
- Changing the order of different quantifiers changes the meaning; $\forall x\, \exists y$ is weaker than $\exists y\, \forall x$.
- One counterexample disproves a universal statement; one example proves an existential one.

## Check yourself

<details>
<summary>Negate: "There is a course that every student has taken."</summary>

$\neg \exists c\, \forall s\, T(s, c) \equiv \forall c\, \exists s\, \neg T(s, c)$: "For every course, some student has not taken it."
</details>

<details>
<summary>Is ∀x ∃y (y > x) true over the natural numbers? What about ∃y ∀x (y > x)?</summary>

The first is true: for any $x$, take $y = x + 1$. The second is false: no natural number is larger than every natural number (including itself).
</details>

<details>
<summary>How do you prove "∀x P(x)" is false?</summary>

Give one counterexample: a specific $x$ in the domain for which $P(x)$ is false.
</details>
