---
title: Circuit Basics
description: Charge, current, voltage, power and energy, resistance and Ohm's law, series and parallel resistors, voltage and current dividers, and ideal voltage and current sources.
sidebar:
  label: "1. Circuit basics"
  order: 1
lesson:
  module: DC circuits
  outcomes:
    - Relate current, voltage, resistance and power with Ohm's law and P = VI
    - Combine resistors in series and parallel
    - Use the voltage-divider and current-divider rules
  keyIdea: >-
    Current is the flow of charge, voltage is the energy per charge that pushes it, and resistance opposes it: **V = IR**. Resistors in **series** add; in **parallel** their conductances add. Dividers split a voltage or a current in proportion to resistance.
---

## 1. Basic quantities

| Quantity | Symbol | Unit | Meaning |
|---|---|---|---|
| Charge | $Q$ | coulomb (C) | An electron carries $1.6 \times 10^{-19}$ C |
| **Current** | $I$ | ampere (A) = C/s | Rate of flow of charge: $I = dQ/dt$ |
| **Voltage** | $V$ | volt (V) = J/C | Energy per unit charge between two points (potential difference) |
| Resistance | $R$ | ohm (Ω) | Opposition to current |
| Conductance | $G = 1/R$ | siemens (S) | Ease of current flow |
| **Power** | $P$ | watt (W) = J/s | Rate of energy transfer |
| Energy | $W$ | joule (J), or kWh | $W = P \cdot t$ |

By convention, current flows from + to − through a load (conventional current), opposite to the actual electron flow.

## 2. Ohm's law and power

$$
V = IR
$$

$$
P = VI = I^2 R = \frac{V^2}{R}
$$

**Example.** A 220 V supply drives a 1100 W heater: $I = P/V = 5$ A, and $R = V/I = 44$ Ω. Running it for 2 hours uses $1.1 \text{ kW} \times 2 \text{ h} = 2.2$ kWh.

**Passive sign convention:** if current enters the + terminal of an element, $P = VI$ is the power **absorbed**; negative means the element supplies power. In any circuit, total power absorbed = total power supplied.

## 3. Series and parallel resistors

| | Series | Parallel |
|---|---|---|
| Same quantity | **Current** | **Voltage** |
| Equivalent resistance | $R_{eq} = R_1 + R_2 + \dots$ | $\dfrac{1}{R_{eq}} = \dfrac{1}{R_1} + \dfrac{1}{R_2} + \dots$ |
| Two resistors | $R_1 + R_2$ | $\dfrac{R_1 R_2}{R_1 + R_2}$ (product over sum) |
| $R_{eq}$ compared with each resistor | Larger than any | **Smaller** than the smallest |

**Examples.**

- 2 Ω, 3 Ω and 5 Ω in series across 20 V: $R_{eq} = 10$ Ω, so $I = 2$ A; the 5 Ω resistor drops $2 \times 5 = 10$ V.
- 6 Ω in parallel with 3 Ω: $\dfrac{6 \times 3}{6 + 3} = 2$ Ω.
- $n$ equal resistors $R$ in parallel give $R/n$.

## 4. Voltage and current dividers

**Voltage divider** (resistors in series): the voltage splits in proportion to resistance.

$$
V_2 = V_{in} \cdot \frac{R_2}{R_1 + R_2}
$$

**Example.** $V_{in} = 12$ V, $R_1 = 4$ kΩ, $R_2 = 8$ kΩ: $V_2 = 12 \times 8/12 = 8$ V.

**Current divider** (two resistors in parallel): the current splits in **inverse** proportion to resistance, so more current takes the smaller resistance.

$$
I_1 = I_{total} \cdot \frac{R_2}{R_1 + R_2}
$$

**Example.** 6 A into 2 Ω in parallel with 4 Ω: $I_{2\Omega} = 6 \times 4/6 = 4$ A and $I_{4\Omega} = 2$ A.

## 5. Sources

- An **ideal voltage source** keeps a fixed voltage whatever current is drawn. A real one has a small **internal resistance** in series.
- An **ideal current source** keeps a fixed current whatever the voltage. A real one has a large internal resistance in parallel.
- **Dependent sources** have a value controlled by another voltage or current in the circuit; they model transistors and amplifiers.

**Open circuit:** infinite resistance, no current. **Short circuit:** zero resistance, no voltage across it.

## Summary

- $V = IR$; $P = VI = I^2R = V^2/R$; energy = power × time.
- Series: same current, resistances add. Parallel: same voltage, reciprocals add; two in parallel = product over sum.
- Voltage divider: $V_2 = V_{in} R_2/(R_1 + R_2)$. Current divider: the current through one branch is proportional to the **other** branch's resistance.
- Ideal voltage sources fix voltage; ideal current sources fix current.

## Check yourself

<details>
<summary>What is the equivalent resistance of 10 Ω, 10 Ω and 5 Ω in parallel?</summary>

$1/R = 1/10 + 1/10 + 1/5 = 0.4$, so $R = 2.5$ Ω.
</details>

<details>
<summary>A 60 W bulb runs on 220 V. What current does it draw, and what is its resistance?</summary>

$I = 60/220 \approx 0.27$ A, and $R = V^2/P = 220^2/60 \approx 807$ Ω.
</details>

<details>
<summary>Why is the equivalent of parallel resistors smaller than the smallest one?</summary>

Each extra parallel path gives current another route, so the total current increases for the same voltage, which means the overall resistance falls.
</details>
