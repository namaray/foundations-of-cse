---
title: Latches and Flip-Flops
description: Sequential vs combinational logic, the SR latch, gated D latch, edge-triggered SR, D, JK and T flip-flops with characteristic tables, equations and excitation tables, the race-around condition and master–slave design, and timing constraints.
sidebar:
  label: "5. Latches and flip-flops"
  order: 5
lesson:
  module: Sequential logic
  prerequisites:
    - label: Combinational circuits
      link: /digital-logic-design/combinational-circuits/
  outcomes:
    - Explain the difference between a latch and a flip-flop
    - Give the characteristic table and equation of SR, D, JK and T flip-flops
    - Use excitation tables to find the inputs that cause a desired transition
    - Explain the race-around condition and how it is avoided
  keyIdea: >-
    Sequential circuits have **memory**: their outputs depend on past inputs as well as present ones. The basic memory element stores one bit. A **latch** follows its input while enabled; a **flip-flop** changes only on a **clock edge**, which keeps an entire synchronous circuit in step.
---

## 1. Sequential logic

A **combinational** circuit's output depends only on its current inputs. A **sequential** circuit also has **state** (stored bits), fed back so the output depends on input history. In **synchronous** sequential circuits, a **clock** signal tells every storage element when to update, all at once.

## 2. The SR latch

Two cross-coupled NOR gates store one bit.

| $S$ | $R$ | $Q_{\text{next}}$ | Meaning |
|---|---|---|---|
| 0 | 0 | $Q$ | hold |
| 0 | 1 | 0 | reset |
| 1 | 0 | 1 | set |
| 1 | 1 | — | **not allowed**: both outputs forced to 0, and the final state is unpredictable when the inputs return to 0 |

(With NAND gates, the inputs are active-low: $\overline{S}\,\overline{R} = 00$ is the forbidden combination.)

**Gated D latch:** add an enable input and make $R = \overline{S}$, which removes the forbidden case. While enable is 1, $Q$ follows $D$ (the latch is **transparent**); while enable is 0, $Q$ holds.

## 3. Flip-flops

A **flip-flop** samples its inputs only at a clock **edge** (rising or falling), so the output changes at most once per clock cycle. This stops signals racing through several storage elements in one cycle.

| Flip-flop | Inputs | Characteristic equation | Behaviour |
|---|---|---|---|
| **SR** | $S$, $R$ | $Q^+ = S + \overline{R}Q$ (with $SR = 0$) | Set, reset, hold; $S = R = 1$ not allowed |
| **D** | $D$ | $Q^+ = D$ | Stores whatever is on $D$ |
| **JK** | $J$, $K$ | $Q^+ = J\overline{Q} + \overline{K}Q$ | Like SR, but $J = K = 1$ **toggles** |
| **T** | $T$ | $Q^+ = T \oplus Q$ | $T = 1$ toggles, $T = 0$ holds |

**JK characteristic table:**

| $J$ | $K$ | $Q^+$ |
|---|---|---|
| 0 | 0 | $Q$ (hold) |
| 0 | 1 | 0 (reset) |
| 1 | 0 | 1 (set) |
| 1 | 1 | $\overline{Q}$ (toggle) |

The D flip-flop is by far the most used in practice. The JK is the most flexible, and a T flip-flop is a JK with $J$ and $K$ tied together.

## 4. Excitation tables

To **design** a circuit, you know the transition you want ($Q \to Q^+$) and need the inputs that cause it. X means "don't care".

| $Q \to Q^+$ | $S\ R$ | $J\ K$ | $D$ | $T$ |
|---|---|---|---|---|
| 0 → 0 | 0 X | 0 X | 0 | 0 |
| 0 → 1 | 1 0 | 1 X | 1 | 1 |
| 1 → 0 | 0 1 | X 1 | 0 | 1 |
| 1 → 1 | X 0 | X 0 | 1 | 0 |

For example, a JK flip-flop goes from 0 to 1 when $J = 1$, whatever $K$ is: with $K = 0$ it sets, and with $K = 1$ it toggles; either way the result is 1.

These tables are the key step in [counter](/digital-logic-design/counters/) and [state machine](/digital-logic-design/state-machines/) design.

## 5. The race-around condition

In a **level-triggered** JK latch with $J = K = 1$, the output toggles, then the new output feeds back and toggles it again, repeatedly, for as long as the clock stays high. The final value is unpredictable.

**Fixes:**

- **Master–slave JK:** two latches in series. The master responds while the clock is high; the slave copies the master when the clock goes low. The output changes only once per cycle.
- **Edge triggering:** respond only at the instant of the clock edge (the usual modern solution).

## 6. Timing and asynchronous inputs

- **Setup time:** the input must be stable for this long **before** the clock edge.
- **Hold time:** it must stay stable for this long **after** the edge.
- **Clock-to-Q delay:** how long after the edge the output changes.

The clock period must be at least clock-to-Q delay + the longest combinational path delay + setup time, which sets the **maximum clock frequency**. Violating setup or hold can leave a flip-flop **metastable** (stuck between 0 and 1 for a while).

**Preset** and **clear** are asynchronous inputs that force $Q$ to 1 or 0 immediately, regardless of the clock; they are used to initialise circuits.

## Summary

- Sequential circuits store state; synchronous ones update on clock edges.
- An SR latch holds a bit; $S = R = 1$ is forbidden. A D latch is transparent while enabled.
- Characteristic equations: SR $Q^+ = S + \overline{R}Q$; D $Q^+ = D$; JK $Q^+ = J\overline{Q} + \overline{K}Q$; T $Q^+ = T \oplus Q$.
- Excitation tables give the inputs needed for each transition and drive circuit design.
- Race-around in level-triggered JK latches is avoided by master–slave or edge-triggered designs.

## Check yourself

<details>
<summary>What is the difference between a latch and a flip-flop?</summary>

A latch is level-sensitive: while enabled, its output follows the input. A flip-flop is edge-triggered: it samples the input only at a clock edge.
</details>

<details>
<summary>A T flip-flop starts at 0 and receives T = 1 for 5 clock edges. What is Q?</summary>

It toggles 5 times: 1, 0, 1, 0, 1. So $Q = 1$.
</details>

<details>
<summary>What inputs must a JK flip-flop get to go from 1 to 0?</summary>

$J = X$ (don't care), $K = 1$: with $J = 0$ it resets, with $J = 1$ it toggles; both give 0.
</details>
