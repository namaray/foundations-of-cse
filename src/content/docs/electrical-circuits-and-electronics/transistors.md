---
title: Transistors
description: BJT structure and currents, operating regions, a worked biasing example, common-emitter, common-base and common-collector configurations, the transistor as a switch and as an amplifier, MOSFETs, and the CMOS inverter.
sidebar:
  label: "6. Transistors"
  order: 6
lesson:
  module: Electronics
  prerequisites:
    - label: Diodes
      link: /electrical-circuits-and-electronics/diodes/
  outcomes:
    - Relate a BJT's base, collector and emitter currents using β and α
    - Determine a BJT's operating region from a circuit
    - Explain how transistors act as switches and amplifiers
    - Explain how a CMOS inverter works and why it uses so little power
  keyIdea: >-
    A transistor uses a small input to control a large current. In a **BJT** a small base current controls a collector current about **β** times larger; in a **MOSFET** a gate voltage controls the channel. Driven fully on or off, transistors are **switches**, the basis of digital logic; biased in between, they are **amplifiers**.
---

## 1. The bipolar junction transistor (BJT)

A BJT has three layers, **NPN** or **PNP**, with three terminals: **emitter** (E, heavily doped), **base** (B, thin and lightly doped) and **collector** (C).

**Currents:**

$$
I_E = I_B + I_C \qquad I_C = \beta I_B \qquad \alpha = \frac{I_C}{I_E} = \frac{\beta}{\beta + 1}
$$

$\beta$ (also written $h_{FE}$), the **current gain**, is typically 50–300, so $\alpha$ is just below 1.

**Example.** $\beta = 100$ and $I_B = 20$ μA: $I_C = 2$ mA, $I_E = 2.02$ mA, $\alpha = 100/101 \approx 0.99$.

## 2. Operating regions (NPN)

| Region | Base–emitter junction | Base–collector junction | Behaviour | Use |
|---|---|---|---|---|
| **Cutoff** | Reverse (or < 0.7 V) | Reverse | $I_C \approx 0$: switch **off** | Digital "0" / off |
| **Active** | Forward ($V_{BE} \approx 0.7$ V) | Reverse | $I_C = \beta I_B$ | **Amplifier** |
| **Saturation** | Forward | Forward | $V_{CE} \approx 0.2$ V; $I_C < \beta I_B$: switch **on** | Digital "1" / on |

## 3. Worked example: biasing

$V_{BB} = 5$ V through $R_B = 100$ kΩ to the base; $V_{CC} = 10$ V through $R_C = 1$ kΩ to the collector; emitter grounded; $\beta = 100$.

- $I_B = (5 - 0.7)/100\text{k} = 43$ μA
- $I_C = \beta I_B = 4.3$ mA
- $V_{CE} = V_{CC} - I_C R_C = 10 - 4.3 = 5.7$ V

$V_{CE} = 5.7$ V is well above 0.2 V, so the transistor is in the **active** region, as assumed. (If the calculation had given $V_{CE} < 0.2$ V, the transistor would be saturated, and $I_C$ would be limited to about $(V_{CC} - 0.2)/R_C$.)

The **DC load line** joins $I_C = V_{CC}/R_C$ (saturation) to $V_{CE} = V_{CC}$ (cutoff); the operating point (**Q-point**) lies on it. For an amplifier, it should sit near the middle, so the signal can swing both ways. **Voltage-divider bias** makes the Q-point nearly independent of $\beta$, which varies between transistors and with temperature.

## 4. Configurations

| Configuration | Input / output | Voltage gain | Current gain | Use |
|---|---|---|---|---|
| **Common emitter** | Base / collector | High (inverting, 180° phase shift) | High (β) | General amplification |
| Common base | Emitter / collector | High | About 1 (α) | High-frequency circuits |
| **Common collector** (emitter follower) | Base / emitter | About 1 | High | **Buffer**: high input, low output impedance |

## 5. The transistor as a switch

Drive it between **cutoff** (off, like an open switch) and **saturation** (on, like a closed switch). To switch a load on, give the base enough current to saturate: $I_B > I_{C(sat)}/\beta$, with a safety margin.

**Example.** Switch a 100 mA lamp from a microcontroller pin (5 V), with $\beta = 100$: the base needs more than 1 mA; using 2 mA, $R_B = (5 - 0.7)/2\text{ mA} \approx 2.2$ kΩ.

This is how logic gates were built (TTL), and how microcontrollers drive relays, motors and LEDs.

## 6. MOSFETs

A **MOSFET** (metal–oxide–semiconductor field-effect transistor) has a **gate**, **source** and **drain**. The gate is insulated by a thin oxide layer, so it draws essentially **no current**: the gate **voltage** controls the current through a channel between source and drain.

- **n-channel enhancement MOSFET (NMOS):** off when $V_{GS} < V_{th}$ (threshold voltage); on when $V_{GS} > V_{th}$.
- **p-channel (PMOS):** the opposite polarity; on when the gate is pulled low relative to the source.

| | BJT | MOSFET |
|---|---|---|
| Controlled by | Base **current** | Gate **voltage** |
| Input impedance | Moderate | Very high |
| Static power in digital circuits | Higher | Almost none (CMOS) |
| Main use today | Analogue, high-current and RF circuits | Almost all digital ICs, power switching |

## 7. The CMOS inverter

A **PMOS** transistor connects the output to $V_{DD}$, and an **NMOS** transistor connects it to ground; both gates are driven by the input.

| Input | PMOS | NMOS | Output |
|---|---|---|---|
| 0 (low) | on | off | **1** (pulled up to $V_{DD}$) |
| 1 (high) | off | on | **0** (pulled down to ground) |

In either steady state, one transistor is always off, so there is **no direct path from $V_{DD}$ to ground** and almost no static power is used. Power is consumed mainly when switching: $P \approx C V_{DD}^2 f$. This is why CMOS is used in essentially all modern chips, and NAND and NOR gates are built from the same complementary idea.

## Summary

- BJT: $I_E = I_B + I_C$, $I_C = \beta I_B$, $\alpha = \beta/(\beta + 1)$.
- Regions: cutoff (off), active (amplifier, $I_C = \beta I_B$), saturation (on, $V_{CE} \approx 0.2$ V); check $V_{CE}$ to confirm.
- Common emitter: high, inverting gain; common collector: unity-gain buffer.
- Switch: saturate with $I_B > I_C/\beta$. MOSFETs are voltage-controlled with almost no gate current.
- CMOS inverter: PMOS pull-up plus NMOS pull-down; almost no static power, $P \approx CV^2f$.

## Check yourself

<details>
<summary>A BJT has β = 150 and I_C = 3 mA. What are I_B and I_E?</summary>

$I_B = 3/150 = 20$ μA, and $I_E = 3 + 0.02 = 3.02$ mA.
</details>

<details>
<summary>In which region does a BJT operate as an amplifier?</summary>

The active region: base–emitter forward biased, base–collector reverse biased, so $I_C = \beta I_B$.
</details>

<details>
<summary>Why does a CMOS inverter use almost no power when its input isn't changing?</summary>

One of its two transistors is always off, so there is no conducting path from the supply to ground; current flows only briefly while switching.
</details>
