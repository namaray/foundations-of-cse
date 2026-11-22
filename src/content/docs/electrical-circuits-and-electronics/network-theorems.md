---
title: Network Theorems
description: Linearity and superposition, source transformation, Thevenin's and Norton's theorems with worked examples, and the maximum power transfer theorem.
sidebar:
  label: "3. Network theorems"
  order: 3
lesson:
  module: DC circuits
  prerequisites:
    - label: Nodal and mesh analysis
      link: /electrical-circuits-and-electronics/circuit-analysis/
  outcomes:
    - Analyse a circuit with several sources using superposition
    - Find the Thevenin and Norton equivalents of a circuit
    - Find the load that receives maximum power, and that power
  keyIdea: >-
    Any linear circuit, seen from two terminals, behaves exactly like one voltage source in series with one resistor (**Thevenin**) or one current source in parallel with one resistor (**Norton**). This makes it easy to analyse different loads, and shows that a load receives **maximum power** when its resistance equals the Thevenin resistance.
---

## 1. Superposition

In a **linear** circuit with several independent sources, any voltage or current is the **sum** of the contributions of each source acting alone.

**Steps:**

1. Keep one independent source; **turn off** the others: a voltage source becomes a **short circuit** (0 V), a current source an **open circuit** (0 A).
2. Find the contribution of that source.
3. Repeat for every source and add the results (with signs).

Dependent sources are never turned off. Superposition works for voltages and currents but **not for power**, since power is not linear ($P = I^2R$).

**Example.** A 10 V source in series with 2 Ω feeds a node that connects to ground through 4 Ω; a 3 A current source also injects into that node. Find the node voltage $V$.

- 10 V alone (current source open): $V' = 10 \times 4/(2 + 4) \approx 6.67$ V.
- 3 A alone (voltage source shorted): 2 Ω ∥ 4 Ω = 4/3 Ω, so $V'' = 3 \times 4/3 = 4$ V.
- Total: $V = 6.67 + 4 = 10.67$ V.

## 2. Source transformation

A voltage source $V_s$ in series with $R$ is equivalent (at its terminals) to a current source $I_s = V_s / R$ in parallel with the same $R$, and vice versa. Converting back and forth often simplifies a circuit step by step.

## 3. Thevenin's theorem

Any linear two-terminal circuit can be replaced by a **voltage source $V_{th}$ in series with a resistance $R_{th}$**.

- **$V_{th}$** = the **open-circuit voltage** across the terminals (with the load removed).
- **$R_{th}$** = the resistance seen from the terminals with all independent sources **turned off**. (With dependent sources, use $R_{th} = V_{oc} / I_{sc}$, or apply a test source.)

**Worked example.** A 12 V source in series with $R_1 = 4$ Ω connects to terminal $a$; $R_2 = 12$ Ω goes from $a$ to terminal $b$ (ground). Find the Thevenin equivalent at $a$–$b$, then the current in a 6 Ω load.

- $V_{th}$ (voltage divider, no load): $12 \times \dfrac{12}{4 + 12} = 9$ V.
- $R_{th}$ (12 V source shorted): $4 \parallel 12 = \dfrac{48}{16} = 3$ Ω.

With a 6 Ω load: $I_L = \dfrac{9}{3 + 6} = 1$ A. Changing the load to any other value now takes one line of arithmetic.

## 4. Norton's theorem

The same circuit can be replaced by a **current source $I_N$ in parallel with $R_N$**:

- **$I_N$** = the **short-circuit current** between the terminals.
- **$R_N = R_{th}$**.

They are linked by source transformation: $I_N = V_{th} / R_{th}$.

**In the example:** shorting $a$ to $b$ shorts out $R_2$, so $I_N = 12/4 = 3$ A, which matches $V_{th}/R_{th} = 9/3 = 3$ A. ✓

## 5. Maximum power transfer

A load $R_L$ connected to a Thevenin equivalent receives

$$
P_L = \left(\frac{V_{th}}{R_{th} + R_L}\right)^2 R_L
$$

which is greatest when

$$
R_L = R_{th} \qquad P_{max} = \frac{V_{th}^2}{4 R_{th}}
$$

**In the example:** maximum power at $R_L = 3$ Ω, with $P_{max} = 81 / 12 = 6.75$ W.

At maximum power transfer, the efficiency is only **50%**: as much power is lost in $R_{th}$ as is delivered. So it is the goal in communication and signal circuits (getting the most signal to an antenna or speaker), but **not** in power distribution, where efficiency matters more.

## Summary

- Superposition: add the effects of each independent source acting alone (short voltage sources, open current sources); not for power.
- Thevenin: $V_{th}$ = open-circuit voltage; $R_{th}$ = resistance with sources off.
- Norton: $I_N$ = short-circuit current; $R_N = R_{th}$; $I_N = V_{th}/R_{th}$.
- Maximum power when $R_L = R_{th}$: $P_{max} = V_{th}^2/(4R_{th})$, at 50% efficiency.

## Check yourself

<details>
<summary>How do you turn off a voltage source and a current source when using superposition or finding R_th?</summary>

Replace the voltage source with a short circuit (0 V) and the current source with an open circuit (0 A).
</details>

<details>
<summary>A circuit has V_th = 20 V and R_th = 5 Ω. What load gets maximum power, and how much?</summary>

$R_L = 5$ Ω, and $P_{max} = 20^2/(4 \times 5) = 20$ W.
</details>

<details>
<summary>Why can't superposition be used to find power directly?</summary>

Power depends on the square of current or voltage. The sum of the squares of the separate contributions is not the square of their sum, so powers don't add.
</details>
