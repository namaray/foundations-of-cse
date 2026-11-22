---
title: Propositional Logic
description: Propositions and connectives, truth tables, conditionals and their variants, logical equivalences, normal forms, and rules of inference.
sidebar:
  label: "1. Propositional logic"
  order: 1
lesson:
  module: Logic and proof
  outcomes:
    - Build a truth table for any compound proposition
    - Write the converse, inverse and contrapositive of a conditional
    - Prove two propositions equivalent using the standard laws
    - Check whether an argument is valid using rules of inference
  keyIdea: A **proposition** is a statement that is either true or false. Connectives combine propositions, truth tables give their meaning, and **equivalence laws** let you rewrite one formula into another without changing its truth value.
---

Logic is the foundation of proofs, of circuit design, of database queries and of program verification. This lesson covers the logic of whole statements; the next adds variables and quantifiers.

## 1. Propositions and connectives

A **proposition** is a declarative sentence that is either true (T) or false (F), but not both.

- "Dhaka is the capital of Bangladesh" is a proposition (true).
- "$2 + 2 = 5$" is a proposition (false).
- "Close the door" and "$x + 1 = 3$" are **not** propositions: the first is a command, and the second depends on $x$.

Propositions are combined with **connectives**:

| Connective | Symbol | Read as | True when |
|---|---|---|---|
| Negation | $\neg p$ | not $p$ | $p$ is false |
| Conjunction | $p \land q$ | $p$ and $q$ | both are true |
| Disjunction | $p \lor q$ | $p$ or $q$ | at least one is true |
| Exclusive or | $p \oplus q$ | $p$ xor $q$ | exactly one is true |
| Conditional | $p \to q$ | if $p$ then $q$ | except when $p$ is true and $q$ is false |
| Biconditional | $p \leftrightarrow q$ | $p$ if and only if $q$ | both have the same value |

**Precedence**, highest first: $\neg$, $\land$, $\lor$, $\to$, $\leftrightarrow$. So $\neg p \lor q \to r$ means $((\neg p) \lor q) \to r$.

## 2. Truth tables

A truth table lists every combination of truth values. With $n$ variables there are $2^n$ rows.

| $p$ | $q$ | $p \land q$ | $p \lor q$ | $p \oplus q$ | $p \to q$ | $p \leftrightarrow q$ |
|---|---|---|---|---|---|---|
| T | T | T | T | F | T | T |
| T | F | F | T | T | **F** | F |
| F | T | F | T | T | T | F |
| F | F | F | F | F | T | T |

:::caution[The conditional trips people up]
$p \to q$ is **true whenever $p$ is false**. "If it rains, I take an umbrella" is not broken on a dry day, whatever I do. The only way to break the promise is $p$ true and $q$ false.
:::

A compound proposition is a:

- **Tautology** if it is always true, for example $p \lor \neg p$.
- **Contradiction** if it is always false, for example $p \land \neg p$.
- **Contingency** otherwise.

## 3. Variants of a conditional

For $p \to q$:

| Name | Form | Equivalent to $p \to q$? |
|---|---|---|
| Converse | $q \to p$ | No |
| Inverse | $\neg p \to \neg q$ | No |
| **Contrapositive** | $\neg q \to \neg p$ | **Yes** |

The converse and inverse are equivalent **to each other** (one is the contrapositive of the other).

**Example.** "If a number is divisible by 4, then it is even."

- Converse: "If a number is even, it is divisible by 4." False (6 is a counterexample).
- Contrapositive: "If a number is not even, it is not divisible by 4." True, like the original.

Ways to say $p \to q$ in English: "$p$ only if $q$", "$q$ if $p$", "$p$ is sufficient for $q$", "$q$ is necessary for $p$", "$q$ unless $\neg p$".

## 4. Logical equivalences

Two propositions are **logically equivalent**, written $p \equiv q$, if they have the same truth value in every row; that is, $p \leftrightarrow q$ is a tautology.

| Law | Equivalence |
|---|---|
| Identity | $p \land T \equiv p$, $\quad p \lor F \equiv p$ |
| Domination | $p \lor T \equiv T$, $\quad p \land F \equiv F$ |
| Idempotent | $p \lor p \equiv p$, $\quad p \land p \equiv p$ |
| Double negation | $\neg(\neg p) \equiv p$ |
| Commutative | $p \lor q \equiv q \lor p$, $\quad p \land q \equiv q \land p$ |
| Associative | $(p \lor q) \lor r \equiv p \lor (q \lor r)$ |
| Distributive | $p \land (q \lor r) \equiv (p \land q) \lor (p \land r)$, $\quad p \lor (q \land r) \equiv (p \lor q) \land (p \lor r)$ |
| **De Morgan** | $\neg(p \land q) \equiv \neg p \lor \neg q$, $\quad \neg(p \lor q) \equiv \neg p \land \neg q$ |
| Absorption | $p \lor (p \land q) \equiv p$, $\quad p \land (p \lor q) \equiv p$ |
| Negation | $p \lor \neg p \equiv T$, $\quad p \land \neg p \equiv F$ |
| **Implication** | $p \to q \equiv \neg p \lor q$ |
| Contrapositive | $p \to q \equiv \neg q \to \neg p$ |
| Biconditional | $p \leftrightarrow q \equiv (p \to q) \land (q \to p)$ |

**Worked example.** Show that $\neg(p \lor (\neg p \land q)) \equiv \neg p \land \neg q$.

$$
\begin{aligned}
\neg(p \lor (\neg p \land q)) &\equiv \neg p \land \neg(\neg p \land q) && \text{De Morgan} \\
&\equiv \neg p \land (p \lor \neg q) && \text{De Morgan, double negation} \\
&\equiv (\neg p \land p) \lor (\neg p \land \neg q) && \text{distributive} \\
&\equiv F \lor (\neg p \land \neg q) && \text{negation} \\
&\equiv \neg p \land \neg q && \text{identity}
\end{aligned}
$$

:::tip[Exam tip]
Name the law at every step. A truth table also proves equivalence, but a law-by-law derivation is what "using the laws of logic" asks for.
:::

<details class="go-deeper">
<summary>Go deeper: normal forms</summary>

Every proposition can be rewritten in two standard shapes:

- **Disjunctive normal form (DNF):** an OR of ANDs, for example $(p \land q) \lor (\neg p \land r)$. Read it off a truth table: one AND-term for each row that is true.
- **Conjunctive normal form (CNF):** an AND of ORs, for example $(p \lor q) \land (\neg p \lor r)$. One OR-clause for each false row, negating the variables in that row.

CNF is the input format for SAT solvers, and DNF corresponds to sum-of-products circuits in digital logic.

A set of connectives is **functionally complete** if every truth table can be expressed with it. $\{\neg, \land\}$ and $\{\neg, \lor\}$ are complete, and so is NAND on its own.
</details>

## 5. Rules of inference

An **argument** is a list of premises followed by a conclusion. It is **valid** if the conclusion must be true whenever all the premises are true.

| Rule | Premises | Conclusion |
|---|---|---|
| Modus ponens | $p$, $\;p \to q$ | $q$ |
| Modus tollens | $\neg q$, $\;p \to q$ | $\neg p$ |
| Hypothetical syllogism | $p \to q$, $\;q \to r$ | $p \to r$ |
| Disjunctive syllogism | $p \lor q$, $\;\neg p$ | $q$ |
| Addition | $p$ | $p \lor q$ |
| Simplification | $p \land q$ | $p$ |
| Conjunction | $p$, $\;q$ | $p \land q$ |
| Resolution | $p \lor q$, $\;\neg p \lor r$ | $q \lor r$ |

**Worked example.** Premises: "If it is sunny, we go swimming." "If we go swimming, we are home late." "We are not home late." Conclusion: "It is not sunny."

Let $s$ = sunny, $w$ = swimming, $h$ = home late.

1. $s \to w$ (premise)
2. $w \to h$ (premise)
3. $s \to h$ (hypothetical syllogism on 1, 2)
4. $\neg h$ (premise)
5. $\neg s$ (modus tollens on 3, 4)

:::caution[Two common fallacies]
**Affirming the conclusion:** from $p \to q$ and $q$, concluding $p$. **Denying the hypothesis:** from $p \to q$ and $\neg p$, concluding $\neg q$. Both are invalid.
:::

## Summary

- A proposition is either true or false; connectives build compound propositions, and truth tables define them.
- $p \to q$ is false only when $p$ is true and $q$ is false.
- A conditional is equivalent to its contrapositive, not to its converse or inverse.
- Equivalence laws, especially De Morgan's laws and $p \to q \equiv \neg p \lor q$, let you simplify formulas step by step.
- An argument is valid when its conclusion follows from its premises by rules of inference such as modus ponens and modus tollens.

## Check yourself

<details>
<summary>Is "If 2 + 2 = 5, then the moon is made of cheese" true or false?</summary>

True. A conditional with a false hypothesis is always true.
</details>

<details>
<summary>Write the negation of "It is raining and I have an umbrella."</summary>

By De Morgan's law: "It is not raining, or I do not have an umbrella."
</details>

<details>
<summary>Is (p → q) ∧ (q → p) a tautology?</summary>

No. It is equivalent to $p \leftrightarrow q$, which is false when $p$ and $q$ differ. It is a contingency.
</details>

<details>
<summary>How many rows does the truth table of a formula with 5 variables have?</summary>

$2^5 = 32$.
</details>
