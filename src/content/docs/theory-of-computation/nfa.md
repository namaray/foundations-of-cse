---
title: Nondeterministic Finite Automata
description: NFAs and ε-NFAs, ε-closure, why NFAs and DFAs are equally powerful, and converting an NFA to a DFA with the subset construction.
sidebar:
  label: "2. NFA and subset construction"
  order: 2
lesson:
  module: Regular languages
  prerequisites:
    - label: Finite automata (DFA)
      link: /theory-of-computation/finite-automata/
  outcomes:
    - Design small NFAs, including ones with ε-moves
    - Compute the ε-closure of a set of states
    - Convert an NFA to an equivalent DFA with the subset construction
  keyIdea: >-
    An **NFA** may have zero, one or many moves on a symbol, and free **ε-moves**; it accepts if **any** path ends in an accepting state. NFAs are often much easier to design, but no more powerful: the **subset construction** turns any NFA into a DFA whose states are sets of NFA states.
---

## 1. What changes in an NFA

An **NFA** is like a DFA, except the transition function returns a **set** of states:

$$
\delta: Q \times (\Sigma \cup \{\varepsilon\}) \to \mathcal{P}(Q)
$$

- On a symbol it may move to **several** states, or to **none** (that path dies).
- An **ε-transition** moves without reading input.
- The NFA **accepts** $w$ if **at least one** way of reading $w$ ends in an accepting state.

Think of an NFA as exploring all possibilities in parallel, or as guessing correctly.

**Example.** Strings over $\{0, 1\}$ ending in 01. The NFA just stays in $q_0$ until it "guesses" the final 01 has started:

| State | on 0 | on 1 |
|---|---|---|
| → $q_0$ | $\{q_0, q_1\}$ | $\{q_0\}$ |
| $q_1$ | $\emptyset$ | $\{q_2\}$ |
| \* $q_2$ | $\emptyset$ | $\emptyset$ |

Compare the DFA for the same language in the [previous lesson](/theory-of-computation/finite-automata/#3-worked-example-strings-ending-in-01): the NFA is easier to write, especially for longer patterns.

## 2. ε-closure

The **ε-closure** of a state $q$, written $\text{ECLOSE}(q)$, is the set of states reachable from $q$ using only ε-moves, including $q$ itself. For a set of states, take the union.

**Example.** With ε-moves $1 \to 2$, $2 \to 3$ and $1 \to 4$:

$$
\text{ECLOSE}(1) = \{1, 2, 3, 4\}, \quad \text{ECLOSE}(2) = \{2, 3\}, \quad \text{ECLOSE}(3) = \{3\}
$$

## 3. The subset construction (NFA → DFA)

Each DFA state is a **set** of NFA states: the set the NFA could be in after reading the input so far.

1. **Start state:** $\text{ECLOSE}(q_0)$.
2. For each new DFA state $S$ and each symbol $a$: the next state is $\text{ECLOSE}\big(\bigcup_{q \in S} \delta(q, a)\big)$.
3. Repeat until no new sets appear.
4. A DFA state is **accepting** if it contains **any** accepting NFA state.

**Worked example:** the NFA above (no ε-moves, so ECLOSE does nothing).

| DFA state | on 0 | on 1 |
|---|---|---|
| → $\{q_0\}$ | $\{q_0, q_1\}$ | $\{q_0\}$ |
| $\{q_0, q_1\}$ | $\{q_0, q_1\}$ | $\{q_0, q_2\}$ |
| \* $\{q_0, q_2\}$ | $\{q_0, q_1\}$ | $\{q_0\}$ |

For example, from $\{q_0, q_1\}$ on 1: $\delta(q_0, 1) \cup \delta(q_1, 1) = \{q_0\} \cup \{q_2\} = \{q_0, q_2\}$.

Only 3 of the $2^3 = 8$ possible subsets are reachable, and the result matches the hand-built DFA exactly.

:::tip[Exam tip]
Build the table **lazily**: only add a subset when it appears as a target. Include $\emptyset$ as a dead state if it shows up.
:::

## 4. How big can the DFA get?

An NFA with $n$ states can need a DFA with up to $2^n$ states. The classic example is "the $n$-th symbol from the end is 1": an NFA with $n + 1$ states, but the DFA must remember the last $n$ symbols, needing $2^n$ states. In practice the reachable part is usually small.

## 5. Equivalence

**Theorem.** A language is accepted by some NFA if and only if it is accepted by some DFA.

- DFA → NFA: every DFA already is an NFA.
- NFA → DFA: the subset construction.

So DFAs, NFAs and ε-NFAs all recognise exactly the **regular languages**. Nondeterminism adds convenience, not power, for finite automata. (For pushdown automata it does add power.)

**Using NFAs to prove closure.** Given NFAs for $L_1$ and $L_2$, you can build NFAs for:

- $L_1 \cup L_2$: a new start state with ε-moves to both start states.
- $L_1 L_2$: ε-moves from $L_1$'s accepting states to $L_2$'s start state.
- $L_1^*$: a new accepting start state, with ε-moves into $L_1$'s start and from $L_1$'s accepting states back to it.

This is the basis of converting regular expressions to automata ([next lesson](/theory-of-computation/regular-expressions/)).

## Summary

- An NFA may branch, or move on ε, and accepts if any path accepts.
- ECLOSE($q$) is everything reachable by ε-moves, including $q$.
- The subset construction makes DFA states from sets of NFA states; a set is accepting if it contains an accepting NFA state.
- NFAs and DFAs recognise the same class: the regular languages. The DFA can be exponentially larger.

## Check yourself

<details>
<summary>An NFA has 4 states. What is the maximum number of states in the DFA from the subset construction?</summary>

$2^4 = 16$, including the empty set.
</details>

<details>
<summary>When is a subset-construction state accepting?</summary>

When it contains at least one accepting state of the NFA.
</details>

<details>
<summary>Does nondeterminism make finite automata more powerful?</summary>

No. Every NFA can be converted to an equivalent DFA, so they recognise exactly the same languages.
</details>
