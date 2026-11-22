---
title: Registers and Counters
description: Registers and parallel load, shift registers (SISO, SIPO, PISO, PIPO), asynchronous ripple counters, designing synchronous counters with flip-flop excitation tables, mod-N counters, and ring and Johnson counters.
sidebar:
  label: "6. Registers and counters"
  order: 6
lesson:
  module: Sequential logic
  prerequisites:
    - label: Latches and flip-flops
      link: /digital-logic-design/flip-flops/
  outcomes:
    - Describe the four types of shift register
    - Explain why ripple counters are slow and can glitch
    - Design a synchronous counter using excitation tables
    - Give the number of states of ring and Johnson counters
  keyIdea: >-
    A **register** is a group of flip-flops sharing a clock. **Shift registers** move bits along one position per clock; **counters** step through a sequence of states. Ripple counters are simple but slow, so synchronous counters clock every flip-flop together and compute their inputs with logic designed from excitation tables.
---

## 1. Registers

An $n$-bit **register** is $n$ D flip-flops with a common clock, storing an $n$-bit word. A **parallel-load** register adds a load control: when load = 1 the inputs are stored on the clock edge, otherwise each flip-flop feeds its own output back (holds).

## 2. Shift registers

Flip-flops in a chain: on each clock edge, every bit moves one position.

| Type | Input | Output | Use |
|---|---|---|---|
| SISO (serial in, serial out) | one bit per clock | one bit per clock | Delay lines |
| **SIPO** (serial in, parallel out) | one bit per clock | all bits at once | Serial-to-parallel conversion (receiving serial data) |
| **PISO** (parallel in, serial out) | all bits at once | one bit per clock | Parallel-to-serial conversion (transmitting) |
| PIPO (parallel in, parallel out) | all at once | all at once | Ordinary storage |

A **universal shift register** can shift left, shift right, load in parallel or hold, chosen by control inputs. Shifting left multiplies a binary number by 2; shifting right divides by 2.

Loading an $n$-bit SISO register takes $n$ clocks, and reading it out takes another $n - 1$.

## 3. Ripple (asynchronous) counters

Chain T flip-flops with $T = 1$ (or JK with $J = K = 1$), where each flip-flop's output **clocks the next** one. Each stage toggles at half the rate of the previous one, so the flip-flops count in binary.

- An $n$-bit ripple counter counts from 0 to $2^n - 1$ (it is **mod $2^n$**).
- Each stage also **divides the frequency by 2**, so counters are used as frequency dividers.

**Drawbacks:** the change ripples from stage to stage, so the total delay grows with $n$, and during the ripple the outputs briefly show wrong values (**glitches**). That limits the maximum speed.

**Mod-N ripple counters:** detect state N with a gate and use it to **clear** all flip-flops. A mod-10 (decade) counter clears on 1010. The momentary state 1010 can cause glitches.

## 4. Synchronous counters

All flip-flops share **one clock**, and combinational logic decides which ones toggle. They are faster and glitch-free.

**3-bit binary up counter with T flip-flops.** A bit toggles exactly when all lower bits are 1:

$$
T_0 = 1 \qquad T_1 = Q_0 \qquad T_2 = Q_1 Q_0
$$

### Designing a synchronous counter

**Steps:**

1. Draw the state diagram and the state table (present state → next state).
2. Use the flip-flop's **excitation table** to find the required inputs for each transition.
3. Simplify each input with a K-map (unused states are don't-cares).
4. Draw the circuit.

**Worked example: a mod-6 counter (0 → 1 → … → 5 → 0) with T flip-flops.**

| $Q_2 Q_1 Q_0$ | Next | $T_2$ | $T_1$ | $T_0$ |
|---|---|---|---|---|
| 000 | 001 | 0 | 0 | 1 |
| 001 | 010 | 0 | 1 | 1 |
| 010 | 011 | 0 | 0 | 1 |
| 011 | 100 | 1 | 1 | 1 |
| 100 | 101 | 0 | 0 | 1 |
| 101 | 000 | 1 | 0 | 1 |
| 110, 111 | unused | X | X | X |

For a T flip-flop, $T = 1$ wherever the bit changes. Simplifying with K-maps (using 110 and 111 as don't-cares):

$$
T_0 = 1 \qquad T_1 = \overline{Q_2} Q_0 \qquad T_2 = Q_1 Q_0 + Q_2 Q_0
$$

**Check unused states:** a good design also makes sure that if the counter somehow starts in 110 or 111, it returns to the main cycle (it is **self-starting**). Here, from 110: $T_2 = 0$, $T_1 = 0$, $T_0 = 1$ gives 111; from 111: $T_2 = 1$, $T_1 = 0$, $T_0 = 1$ gives 010, which is in the cycle.

## 5. Ring and Johnson counters

| Counter | Construction | States with $n$ flip-flops | Example ($n = 4$) |
|---|---|---|---|
| **Ring** | Shift register with the last output fed back to the first input; start with one 1 | $n$ | 1000 → 0100 → 0010 → 0001 → 1000 |
| **Johnson** (twisted ring) | Feed back the **complement** of the last output | $2n$ | 0000 → 1000 → 1100 → 1110 → 1111 → 0111 → 0011 → 0001 → 0000 |

Ring counters give one active output per state with no decoding (useful for sequencing). Johnson counters get twice as many states from the same flip-flops, and each state is decoded with a single 2-input gate.

## Summary

- A register is a set of flip-flops on one clock; shift registers move bits one place per clock (SISO, SIPO, PISO, PIPO).
- Ripple counters clock each stage from the previous one: simple but slow and glitchy. Each stage halves the frequency.
- Synchronous counters clock all stages together; design them with state tables, excitation tables and K-maps.
- Unused states should lead back into the main sequence (self-starting).
- Ring counters have $n$ states, Johnson counters $2n$.

## Check yourself

<details>
<summary>How many flip-flops are needed for a mod-12 counter?</summary>

4, since $2^3 = 8 < 12 \le 16 = 2^4$.
</details>

<details>
<summary>A 4-bit ripple counter is driven by a 16 kHz clock. What is the frequency of its last output?</summary>

Each stage divides by 2: $16 / 2^4 = 1$ kHz.
</details>

<details>
<summary>How many states does a 5-flip-flop Johnson counter have?</summary>

$2 \times 5 = 10$.
</details>
