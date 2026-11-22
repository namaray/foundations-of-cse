---
title: Finite State Machines
description: Moore and Mealy machines, state diagrams and state tables, designing a sequence detector (worked Mealy and Moore examples), state assignment and minimisation, and the full synchronous design procedure.
sidebar:
  label: "7. State machines"
  order: 7
lesson:
  module: Sequential logic
  prerequisites:
    - label: Registers and counters
      link: /digital-logic-design/counters/
  outcomes:
    - Distinguish Moore and Mealy machines
    - Design a sequence detector from a word description
    - Turn a state diagram into a circuit using flip-flops and logic
  keyIdea: >-
    A finite state machine is a sequential circuit described by **states** and **transitions**. In a **Moore** machine the output depends only on the state; in a **Mealy** machine it depends on the state and the current input, which usually needs fewer states. Design follows a fixed recipe: diagram, table, state assignment, excitation equations, circuit.
---

## 1. Moore and Mealy machines

| | Moore | Mealy |
|---|---|---|
| Output depends on | the **current state** only | the current state **and the input** |
| Where outputs are written | inside the state circles | on the transition arrows (input/output) |
| Number of states | often more | often fewer |
| Output timing | changes only after a clock edge (one cycle later) | can change as soon as the input changes |
| Glitches on the output | fewer | inputs pass straight to outputs, so possible |

The same idea in theory of computation: a [DFA](/theory-of-computation/finite-automata/) is a Moore machine whose output is just "accept" or "reject".

## 2. Worked example: a "101" sequence detector (Mealy)

**Specification:** the input $x$ arrives one bit per clock. Output $z = 1$ whenever the last three bits were 101. Overlapping occurrences count: 10101 contains two.

**States** record how much of the pattern has just been seen:

- $S_0$: nothing useful yet
- $S_1$: the last bit was 1
- $S_2$: the last two bits were 10

| Present state | $x = 0$: next / $z$ | $x = 1$: next / $z$ |
|---|---|---|
| $S_0$ | $S_0$ / 0 | $S_1$ / 0 |
| $S_1$ | $S_2$ / 0 | $S_1$ / 0 |
| $S_2$ | $S_0$ / 0 | $S_1$ / **1** |

The key transitions: from $S_1$ on another 1, stay in $S_1$ (the new 1 could start the pattern); from $S_2$ on 1, output 1 and go to $S_1$, because that final 1 can be the start of the next 101 (overlap).

**Trace** on input 1 0 1 0 1 1:

| Input | 1 | 0 | 1 | 0 | 1 | 1 |
|---|---|---|---|---|---|---|
| State before | $S_0$ | $S_1$ | $S_2$ | $S_1$ | $S_2$ | $S_1$ |
| Output | 0 | 0 | **1** | 0 | **1** | 0 |

## 3. The same detector as a Moore machine

Moore needs an extra state, $S_3$ ("just saw 101"), whose **output** is 1:

| Present state | Output $z$ | $x = 0$ | $x = 1$ |
|---|---|---|---|
| $S_0$ | 0 | $S_0$ | $S_1$ |
| $S_1$ | 0 | $S_2$ | $S_1$ |
| $S_2$ | 0 | $S_0$ | $S_3$ |
| $S_3$ | **1** | $S_2$ | $S_1$ |

From $S_3$: a 0 means the last two bits are "10", so go to $S_2$; a 1 means only the last bit counts, so go to $S_1$. The output appears one clock later than in the Mealy version.

**Non-overlapping** detection would instead return to $S_0$ after a match.

## 4. From state table to circuit

1. **State assignment:** give each state a binary code. With $k$ states you need $\lceil \log_2 k \rceil$ flip-flops. For the Mealy detector: $S_0 = 00$, $S_1 = 01$, $S_2 = 10$ (and 11 unused).
2. **Encoded state table:** rewrite the table with the codes.
3. **Excitation:** choose a flip-flop type and use its [excitation table](/digital-logic-design/flip-flops/#4-excitation-tables) to find the inputs for each transition. With D flip-flops, $D$ simply equals the next-state bit.
4. **Simplify** each flip-flop input and each output with K-maps, using unused codes as don't-cares.
5. **Draw** the circuit.

**For the Mealy detector with D flip-flops** (state bits $Q_1 Q_0$):

| $Q_1 Q_0$ | $x$ | Next $Q_1 Q_0$ | $z$ |
|---|---|---|---|
| 00 | 0 | 00 | 0 |
| 00 | 1 | 01 | 0 |
| 01 | 0 | 10 | 0 |
| 01 | 1 | 01 | 0 |
| 10 | 0 | 00 | 0 |
| 10 | 1 | 01 | 1 |

Reading off the 1s (with 11 as don't-care):

$$
D_1 = Q_0 \overline{x} \qquad D_0 = x \qquad z = Q_1 x
$$

The whole detector is two D flip-flops, one AND gate with an inverted input, and one AND gate.

## 5. State minimisation and assignment

**Equivalent states** have the same output for every input and go to equivalent next states. Merge them to reduce the number of flip-flops and gates. The method is the same as [DFA minimisation](/theory-of-computation/regular-properties/#5-dfa-minimization): mark pairs that differ in output, then repeatedly mark pairs whose next states are marked.

**State assignment** affects how simple the logic is. Common choices: plain binary codes; **Gray codes**, so that consecutive states differ in one bit; and **one-hot** encoding, one flip-flop per state, which uses more flip-flops but very simple logic and is popular in FPGAs.

## Summary

- Moore outputs depend on the state; Mealy outputs depend on the state and input, usually with fewer states.
- A sequence detector's states record how much of the pattern has just been seen; handle overlap by going to the state matching the longest useful suffix.
- "101" detector: 3 states as Mealy, 4 as Moore.
- Design: state diagram → state table → state assignment → excitation equations (K-maps) → circuit.
- Merge equivalent states; choose binary, Gray or one-hot state codes.

## Check yourself

<details>
<summary>How many flip-flops does a machine with 6 states need with binary encoding? With one-hot?</summary>

Binary: $\lceil \log_2 6 \rceil = 3$. One-hot: 6.
</details>

<details>
<summary>In an overlapping "110" Mealy detector, where does the machine go after detecting the pattern?</summary>

After 110, the last bit is 0, which is not a useful prefix of 110, so it goes back to the start state.
</details>

<details>
<summary>Why does a Moore machine usually need more states than a Mealy machine for the same job?</summary>

A Moore output is attached to a state, so "just completed the pattern" needs its own state. A Mealy machine can produce that output on a transition instead.
</details>
