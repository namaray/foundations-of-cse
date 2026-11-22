---
title: Operational Amplifiers
description: The ideal op-amp and its golden rules, inverting and non-inverting amplifiers, the voltage follower, summing and difference amplifiers, integrators and differentiators, comparators, and real op-amp limitations.
sidebar:
  label: "7. Op-amps"
  order: 7
lesson:
  module: Electronics
  prerequisites:
    - label: Transistors
      link: /electrical-circuits-and-electronics/transistors/
  outcomes:
    - State the ideal op-amp golden rules
    - Derive and use the gain of inverting and non-inverting amplifiers
    - Analyse summing, difference, integrator and differentiator circuits
    - Explain how an op-amp works as a comparator
  keyIdea: >-
    An op-amp has enormous gain, so with **negative feedback** it adjusts its output until its two inputs are at the **same voltage**, while drawing no input current. Those two golden rules make most op-amp circuits a few lines of algebra: inverting gain $-R_f/R_{in}$, non-inverting gain $1 + R_f/R_1$.
---

## 1. The ideal op-amp

An op-amp has two inputs, **non-inverting** ($V_+$) and **inverting** ($V_-$), and one output:

$$
V_{out} = A(V_+ - V_-)
$$

with an open-loop gain $A$ of $10^5$ or more.

| Property | Ideal | Typical real (741) |
|---|---|---|
| Open-loop gain | ∞ | about 200,000 |
| Input impedance | ∞ | about 2 MΩ (far higher for FET-input op-amps) |
| Output impedance | 0 | about 75 Ω |
| Bandwidth | ∞ | gain × bandwidth ≈ 1 MHz |

**Golden rules** (with negative feedback):

1. **No current flows into either input.**
2. **The output makes $V_+ = V_-$** (the inputs are a "virtual short").

## 2. Inverting amplifier

The input goes through $R_{in}$ to $V_-$; feedback resistor $R_f$ connects the output to $V_-$; $V_+$ is grounded.

Since $V_+ = 0$, rule 2 makes $V_- = 0$ (a **virtual ground**). The current through $R_{in}$ is $V_{in}/R_{in}$; by rule 1 it all flows through $R_f$, so $V_{out} = -R_f \cdot V_{in}/R_{in}$:

$$
\frac{V_{out}}{V_{in}} = -\frac{R_f}{R_{in}}
$$

**Example.** $R_{in} = 10$ kΩ, $R_f = 100$ kΩ: gain $-10$. An input of 0.5 V gives $-5$ V. The input impedance is $R_{in}$.

## 3. Non-inverting amplifier and voltage follower

The input goes to $V_+$; $R_f$ goes from the output to $V_-$, and $R_1$ from $V_-$ to ground. $V_-$ is a voltage divider of the output, and it must equal $V_{in}$:

$$
\frac{V_{out}}{V_{in}} = 1 + \frac{R_f}{R_1}
$$

**Example.** $R_1 = 10$ kΩ, $R_f = 40$ kΩ: gain 5, with no inversion. The input impedance is very high.

**Voltage follower (buffer):** connect the output directly to $V_-$ ($R_f = 0$, no $R_1$): gain exactly **1**. It copies the voltage but can supply current, so a weak source can drive a heavy load.

## 4. Summing and difference amplifiers

**Inverting summer:** several inputs, each through its own resistor, into the virtual-ground node:

$$
V_{out} = -R_f\left(\frac{V_1}{R_1} + \frac{V_2}{R_2} + \dots\right)
$$

With all resistors equal, $V_{out} = -(V_1 + V_2 + \dots)$. Used in audio mixers and simple digital-to-analogue converters (with binary-weighted resistors).

**Difference amplifier:** with matched resistor ratios,

$$
V_{out} = \frac{R_f}{R_1}(V_2 - V_1)
$$

amplifying the difference while rejecting what the inputs have in common (noise picked up on both wires). **Instrumentation amplifiers** improve on this for sensor signals.

## 5. Integrator and differentiator

Replace a resistor with a capacitor:

| Circuit | Capacitor position | Output |
|---|---|---|
| **Integrator** | In the feedback path ($R$ at the input) | $V_{out} = -\dfrac{1}{RC}\displaystyle\int V_{in}\, dt$ |
| **Differentiator** | At the input ($R$ in feedback) | $V_{out} = -RC\,\dfrac{dV_{in}}{dt}$ |

A square wave into an integrator gives a triangle wave; a triangle wave into a differentiator gives a square wave. Integrators are used in analogue computers, PID controllers and waveform generators; practical differentiators need extra components to tame high-frequency noise.

## 6. Comparator

**Without feedback**, the huge gain drives the output to one of its supply limits (**saturation**):

$$
V_{out} = \begin{cases} +V_{sat} & \text{if } V_+ > V_- \\ -V_{sat} & \text{if } V_+ < V_- \end{cases}
$$

So the op-amp **compares** two voltages and outputs a digital-like high or low. Uses: zero-crossing detectors, threshold alarms ("is the temperature above the limit?"), and analogue-to-digital converters.

A **Schmitt trigger** adds **positive** feedback to give two different switching thresholds (**hysteresis**), so a noisy input near the threshold doesn't make the output chatter.

## 7. Real limitations

- **Saturation:** the output can't exceed the supply rails (minus a volt or two, unless the op-amp is "rail-to-rail").
- **Gain–bandwidth product** is roughly constant: an op-amp with a GBW of 1 MHz set to a gain of 100 has a bandwidth of only about 10 kHz.
- **Slew rate:** the maximum rate the output can change (0.5 V/μs for a 741), which limits large, fast signals.
- Small **input offset voltage** and **bias currents** cause errors in precision circuits.

## Summary

- Golden rules (with negative feedback): no input current; $V_+ = V_-$.
- Inverting gain $-R_f/R_{in}$ (virtual ground); non-inverting gain $1 + R_f/R_1$; voltage follower gain 1.
- Summer: $V_{out} = -R_f \sum V_i/R_i$. Difference amplifier: $\frac{R_f}{R_1}(V_2 - V_1)$.
- Integrator: $-\frac{1}{RC}\int V_{in}\,dt$. Differentiator: $-RC\,dV_{in}/dt$.
- Without feedback the op-amp saturates and acts as a comparator; a Schmitt trigger adds hysteresis.

## Check yourself

<details>
<summary>What gain does an inverting amplifier with R_in = 2 kΩ and R_f = 20 kΩ have? What output for an input of −0.3 V?</summary>

Gain $-10$; output $+3$ V.
</details>

<details>
<summary>Why is the inverting input of an inverting amplifier called a virtual ground?</summary>

The non-inverting input is grounded, and negative feedback forces the two inputs to the same voltage, so the inverting input sits at 0 V even though it isn't physically connected to ground.
</details>

<details>
<summary>Why is a voltage follower useful if its gain is only 1?</summary>

It has a very high input impedance and a very low output impedance, so it can take a signal from a weak source without loading it and drive a heavy load: a buffer.
</details>
