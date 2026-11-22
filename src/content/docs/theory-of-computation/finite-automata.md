---
title: Languages and Finite Automata
description: Alphabets, strings and languages, the formal definition of a DFA, transition tables and diagrams, and how to design DFAs for common patterns with worked examples.
sidebar:
  label: "1. Finite automata (DFA)"
  order: 1
lesson:
  module: Regular languages
  outcomes:
    - Use the vocabulary of alphabets, strings and languages correctly
    - Give the formal 5-tuple definition of a DFA
    - Design a DFA for patterns such as "ends with", "contains" and "divisible by"
  keyIdea: >-
    A **DFA** reads a string one symbol at a time, moving between a finite number of states, and accepts if it ends in an accepting state. Each state stands for **what you need to remember** about the input so far; designing a DFA means choosing those states.
---

## 1. Strings and languages

- An **alphabet** $\Sigma$ is a finite set of symbols, such as $\{0, 1\}$ or $\{a, b\}$.
- A **string** is a finite sequence of symbols. Its **length** is $|w|$. The **empty string** $\varepsilon$ has length 0.
- $\Sigma^*$ is the set of **all** strings over $\Sigma$ (including $\varepsilon$); $\Sigma^+$ excludes $\varepsilon$.
- A **language** is any set of strings: $L \subseteq \Sigma^*$.

Operations on strings: **concatenation** $xy$, **reversal** $w^R$, **powers** $w^3 = www$. A **prefix** of $w$ is any starting part, a **suffix** any ending part.

**Examples over $\{0, 1\}$:** $\{w : w \text{ ends in } 01\}$; $\{0^n 1^n : n \ge 0\}$; $\emptyset$ (no strings) and $\{\varepsilon\}$ (one string) are different languages.

## 2. Deterministic finite automata

A **DFA** is a 5-tuple $M = (Q, \Sigma, \delta, q_0, F)$:

| Part | Meaning |
|---|---|
| $Q$ | Finite set of states |
| $\Sigma$ | Input alphabet |
| $\delta: Q \times \Sigma \to Q$ | Transition function: exactly **one** next state for each state and symbol |
| $q_0 \in Q$ | Start state |
| $F \subseteq Q$ | Accepting (final) states |

$M$ **accepts** $w$ if, starting at $q_0$ and following $\delta$ for each symbol of $w$, it ends in a state in $F$. The **language** $L(M)$ is the set of strings it accepts. A language is **regular** if some DFA accepts it.

In diagrams, states are circles, the start state has an incoming arrow, and accepting states have a double circle.

## 3. Worked example: strings ending in 01

States record how much of the pattern "01" the input has just matched:

- $A$: no useful progress (start)
- $B$: the last symbol was 0
- $C$: the last two symbols were 01 (accept)

| State | on 0 | on 1 |
|---|---|---|
| → $A$ | $B$ | $A$ |
| $B$ | $B$ | $C$ |
| \* $C$ | $B$ | $A$ |

(→ marks the start state and \* an accepting state.)

**Trace on 1101:** $A \xrightarrow{1} A \xrightarrow{1} A \xrightarrow{0} B \xrightarrow{1} C$. Ends in $C$: **accepted**.

**Trace on 0110:** $A \xrightarrow{0} B \xrightarrow{1} C \xrightarrow{1} A \xrightarrow{0} B$. Ends in $B$: **rejected**.

## 4. Worked example: binary numbers divisible by 3

Reading a binary number left to right, appending bit $b$ turns value $v$ into $2v + b$. So track the **remainder modulo 3**, with state $q_r$ meaning remainder $r$:

$$
\delta(q_r, b) = q_{(2r + b) \bmod 3}
$$

| State | on 0 | on 1 |
|---|---|---|
| → \* $q_0$ | $q_0$ | $q_1$ |
| $q_1$ | $q_2$ | $q_0$ |
| $q_2$ | $q_1$ | $q_2$ |

**Check 110 (= 6):** $q_0 \xrightarrow{1} q_1 \xrightarrow{1} q_0 \xrightarrow{0} q_0$. Accepted, and 6 is divisible by 3.

The same idea gives a DFA for divisibility by any $k$, with $k$ states.

## 5. Design patterns

| Language over $\{a, b\}$ | Idea | States |
|---|---|---|
| Contains $aba$ as a substring | Track progress through the pattern; once found, stay in an accepting trap state | 4 |
| Even number of $a$'s | Track the parity of $a$'s | 2 |
| Even $a$'s **and** odd $b$'s | Track both parities (a product construction) | 4 |
| Length divisible by 3 | Track length mod 3 | 3 |
| Starts with $ab$ | Check the first two symbols; a wrong start goes to a **dead state** | 4 |
| Exactly two $a$'s | Count 0, 1, 2 and "more than 2" (dead) | 4 |

A **dead (trap) state** is a non-accepting state that loops to itself on every symbol. A complete DFA needs one whenever some input can never lead to acceptance.

:::tip[Designing a DFA]
1. Decide what you must remember about the input so far; each possibility is a state.
2. Fill in **every** transition: one per state per symbol.
3. Test it on short accepted and rejected strings, including $\varepsilon$.
:::

**Complement.** To accept exactly the strings a complete DFA rejects, swap accepting and non-accepting states. So "does not contain $aba$" is easy once "contains $aba$" is built.

## Summary

- A language is a set of strings over an alphabet; $\Sigma^*$ includes $\varepsilon$.
- A DFA is $(Q, \Sigma, \delta, q_0, F)$ with exactly one transition per state and symbol.
- States represent what the machine must remember; DFAs have finite memory.
- Divisibility by $k$ uses remainder states: $\delta(q_r, b) = q_{(2r+b) \bmod k}$ for binary input.
- Complementing a complete DFA means swapping accepting and non-accepting states.

## Check yourself

<details>
<summary>How many states does the minimal DFA for "strings over {a, b} of length at least 2" need?</summary>

3: length 0, length 1, and length 2 or more (accepting, looping on both symbols).
</details>

<details>
<summary>Is ∅ the same language as {ε}?</summary>

No. $\emptyset$ contains no strings; $\{\varepsilon\}$ contains exactly one string, the empty one.
</details>

<details>
<summary>Why can't a DFA recognise {aⁿbⁿ : n ≥ 0}?</summary>

It would need to remember how many $a$'s it has seen, which can be any number, but it has only finitely many states. The [pumping lemma](/theory-of-computation/regular-properties/) makes this precise.
</details>
