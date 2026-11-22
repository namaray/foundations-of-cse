---
title: Semiconductors and Diodes
description: Intrinsic and extrinsic semiconductors, the pn junction, forward and reverse bias, diode models, half-wave, centre-tapped and bridge rectifiers with their formulas, filtering, Zener regulators, and LEDs.
sidebar:
  label: "5. Diodes"
  order: 5
lesson:
  module: Electronics
  prerequisites:
    - label: Circuit basics
      link: /electrical-circuits-and-electronics/circuit-basics/
  outcomes:
    - Explain how doping creates n-type and p-type semiconductors and a pn junction
    - Analyse simple diode circuits with the constant-voltage model
    - Compare half-wave and full-wave rectifiers
    - Design a simple Zener voltage regulator
  keyIdea: >-
    Doping silicon creates **n-type** (extra electrons) and **p-type** (extra holes) material. Their junction forms a **diode**, which conducts in one direction (forward bias, about 0.7 V drop for silicon) and blocks the other. Diodes convert AC to DC in **rectifiers**, and **Zener** diodes hold a fixed voltage in reverse breakdown.
---

## 1. Semiconductors

**Semiconductors** (silicon, germanium) conduct better than insulators but worse than metals, and their conductivity can be controlled.

- **Intrinsic** (pure) silicon has few free charge carriers at room temperature.
- **Doping** adds impurities:
  - **n-type:** add a **pentavalent** element (phosphorus, arsenic), giving extra free **electrons** (the majority carriers).
  - **p-type:** add a **trivalent** element (boron, gallium), giving **holes** (missing electrons, which act as positive carriers).

## 2. The pn junction

Where p-type and n-type meet, electrons and holes diffuse across and recombine, leaving a **depletion region** with no free carriers and a built-in **barrier potential** (about 0.7 V for silicon, 0.3 V for germanium).

| Bias | Connection | Effect |
|---|---|---|
| **Forward** | p (anode) to +, n (cathode) to − | The barrier shrinks; once the applied voltage exceeds about 0.7 V, current flows freely |
| **Reverse** | p to −, n to + | The depletion region widens; only a tiny leakage current flows, until **breakdown** at a large reverse voltage |

**Diode equation (Shockley):** $I = I_S\left(e^{V/(nV_T)} - 1\right)$, where $V_T \approx 26$ mV at room temperature: current grows exponentially with forward voltage.

## 3. Diode models

| Model | Forward | Reverse | Use |
|---|---|---|---|
| Ideal | Short circuit (0 V drop) | Open circuit | Quick reasoning |
| **Constant-voltage** | Fixed **0.7 V** drop (silicon) | Open circuit | **Most hand calculations** |
| Piecewise-linear | 0.7 V plus a small series resistance | Open | More accuracy |

**Example.** 5 V source, silicon diode (forward biased) and a 1 kΩ resistor in series: $I = (5 - 0.7)/1\text{k} = 4.3$ mA.

**Checking the state:** assume each diode is on or off, solve, then check the assumption: an "on" diode must carry forward current, and an "off" diode must have less than 0.7 V across it in the forward direction.

## 4. Rectifiers

A **rectifier** converts AC into pulsating DC.

| | Half-wave | Full-wave, centre-tapped | Full-wave, bridge |
|---|---|---|---|
| Diodes | 1 | 2 | 4 |
| Conducts during | One half-cycle | Both half-cycles | Both half-cycles |
| Average output $V_{dc}$ | $V_m/\pi \approx 0.318\,V_m$ | $2V_m/\pi \approx 0.637\,V_m$ | $2V_m/\pi$ |
| RMS output | $V_m/2$ | $V_m/\sqrt{2}$ | $V_m/\sqrt{2}$ |
| Ripple frequency | $f$ (50 Hz) | $2f$ (100 Hz) | $2f$ (100 Hz) |
| Peak inverse voltage per diode | $V_m$ | $2V_m$ | $V_m$ |
| Notes | Simple, inefficient | Needs a centre-tapped transformer | Most common; two diode drops per half-cycle |

(Ideal diodes; with real silicon diodes, subtract 0.7 V per conducting diode from $V_m$: one for half-wave and centre-tapped, two for a bridge.)

**Filtering:** a **capacitor** across the output charges to the peak and discharges slowly between peaks, smoothing the output. The ripple is roughly $V_r \approx \dfrac{I_{load}}{f_r C}$, where $f_r$ is the ripple frequency; a bigger capacitor or a full-wave rectifier (double $f_r$) gives less ripple.

## 5. Zener diodes and regulators

A **Zener diode** is designed to operate in reverse breakdown, where its voltage stays almost constant at $V_Z$ over a wide range of current. It is used as a **voltage regulator**:

```text
V_in ──[ R_s ]──┬───────┬── V_out = V_Z
                │       │
              Zener    R_L
           (reversed)   │
                │       │
GND ────────────┴───────┘
```

- Series current: $I_s = (V_{in} - V_Z)/R_s$
- Load current: $I_L = V_Z / R_L$
- Zener current: $I_Z = I_s - I_L$, which must stay positive (above a minimum) and below the Zener's maximum rating.

**Example.** $V_{in} = 12$ V, $V_Z = 5$ V, $R_s = 100$ Ω, $R_L = 500$ Ω: $I_s = 70$ mA, $I_L = 10$ mA, so $I_Z = 60$ mA. The Zener must handle $5 \times 0.06 = 0.3$ W.

## 6. Other diodes

- **LED** (light-emitting diode): emits light when forward biased; the forward voltage is about 1.8–3.3 V depending on colour. Always use a series current-limiting resistor.
- **Photodiode:** reverse current increases with light; used in sensors and optical receivers.
- **Schottky diode:** a metal–semiconductor junction with a low forward drop (about 0.3 V) and very fast switching.
- **Varactor:** junction capacitance varies with reverse voltage; used for electronic tuning.

## Summary

- n-type has extra electrons, p-type extra holes; their junction forms a depletion region with a barrier of about 0.7 V (Si).
- Forward bias conducts with about a 0.7 V drop; reverse bias blocks until breakdown.
- Half-wave: $V_{dc} = V_m/\pi$, ripple at $f$. Full-wave: $V_{dc} = 2V_m/\pi$, ripple at $2f$. PIV: half-wave $V_m$, centre-tap $2V_m$, bridge $V_m$.
- Capacitor filters smooth the output; Zener diodes regulate voltage in reverse breakdown.

## Check yourself

<details>
<summary>What is the average output of a full-wave rectifier with a 20 V peak input (ideal diodes)?</summary>

$2 \times 20/\pi \approx 12.7$ V.
</details>

<details>
<summary>Why does a centre-tapped rectifier need diodes with twice the PIV of a bridge rectifier?</summary>

When one diode is off, it has the full secondary voltage across it (both halves, $2V_m$) in reverse. In a bridge, each off diode sees only $V_m$.
</details>

<details>
<summary>Which impurity makes silicon p-type: phosphorus or boron?</summary>

Boron (trivalent), which creates holes. Phosphorus (pentavalent) makes n-type.
</details>
