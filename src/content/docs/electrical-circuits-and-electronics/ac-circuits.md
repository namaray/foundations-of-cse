---
title: AC Circuits
description: Sinusoidal signals, peak, RMS and average values, phasors, inductors and capacitors, reactance and impedance, a worked series RLC example, phase angle and power factor, real, reactive and apparent power, and resonance.
sidebar:
  label: "4. AC circuits"
  order: 4
lesson:
  module: AC circuits
  prerequisites:
    - label: Network theorems
      link: /electrical-circuits-and-electronics/network-theorems/
  outcomes:
    - Convert between peak and RMS values and read a sinusoid's frequency and phase
    - Compute the reactance and impedance of R, L and C combinations
    - Solve a series RLC circuit, including phase angle and power factor
    - Find the resonant frequency of an LC circuit
  keyIdea: >-
    AC circuits are analysed like DC circuits by replacing resistance with **impedance** $Z$, a complex number. Inductors oppose change in current ($X_L = \omega L$, current lags voltage) and capacitors oppose change in voltage ($X_C = 1/\omega C$, current leads voltage). Power depends on the phase angle through the **power factor** $\cos\phi$.
---

## 1. Sinusoids

$$
v(t) = V_m \sin(\omega t + \phi)
$$

| Symbol | Meaning |
|---|---|
| $V_m$ | Peak (maximum) value |
| $\omega = 2\pi f$ | Angular frequency (rad/s) |
| $f = 1/T$ | Frequency (Hz); $T$ is the period |
| $\phi$ | Phase angle |

**RMS (effective) value:** the DC value that would deliver the same power to a resistor. For a sine wave,

$$
V_{rms} = \frac{V_m}{\sqrt{2}} \approx 0.707\,V_m
$$

Mains electricity is quoted in RMS. In Bangladesh the supply is **220 V RMS at 50 Hz**, so the peak is $220\sqrt{2} \approx 311$ V and $\omega = 2\pi \times 50 \approx 314$ rad/s.

The **average** over a full cycle is zero; the average over a half cycle is $2V_m/\pi \approx 0.637\,V_m$.

## 2. Phasors

A sinusoid of a given frequency is fully described by its amplitude and phase, so it can be written as a complex number, a **phasor**:

$$
V_m \sin(\omega t + \phi) \;\longleftrightarrow\; V \angle \phi
$$

(often using RMS magnitudes). Differentiation becomes multiplication by $j\omega$, which turns differential equations into algebra. Polar ↔ rectangular: $V\angle\phi = V\cos\phi + jV\sin\phi$.

## 3. Inductors and capacitors

| | Resistor | Inductor | Capacitor |
|---|---|---|---|
| Voltage–current law | $v = iR$ | $v = L\,\dfrac{di}{dt}$ | $i = C\,\dfrac{dv}{dt}$ |
| Stores energy as | — (dissipates it) | Magnetic field: $\tfrac{1}{2}Li^2$ | Electric field: $\tfrac{1}{2}Cv^2$ |
| Behaviour in steady DC | Resistance | **Short circuit** | **Open circuit** |
| Reactance | — | $X_L = \omega L = 2\pi f L$ | $X_C = \dfrac{1}{\omega C} = \dfrac{1}{2\pi f C}$ |
| Impedance | $R$ | $jX_L$ | $-jX_C$ |
| Phase | $V$ and $I$ in phase | **Current lags** voltage by 90° | **Current leads** voltage by 90° |

Memory aid: **ELI the ICE man**: in an inductor (L), E (voltage) comes before I; in a capacitor (C), I comes before E.

$X_L$ grows with frequency (inductors block high frequencies); $X_C$ shrinks with frequency (capacitors pass high frequencies and block DC).

## 4. Impedance

**Impedance** $Z = R + jX$ (in ohms) generalises resistance: $\mathbf{V} = \mathbf{I}Z$. Impedances combine exactly like resistances: add in series, combine reciprocals in parallel.

$$
\lvert Z \rvert = \sqrt{R^2 + X^2} \qquad \phi = \tan^{-1}\frac{X}{R}
$$

## 5. Worked example: series RLC

$R = 30$ Ω, $X_L = 80$ Ω, $X_C = 40$ Ω, supply 100 V (RMS).

- $Z = 30 + j(80 - 40) = 30 + j40$ Ω
- $\lvert Z \rvert = \sqrt{30^2 + 40^2} = 50$ Ω
- $I = 100 / 50 = 2$ A
- $\phi = \tan^{-1}(40/30) = 53.13°$: the net reactance is inductive, so the current **lags** the voltage.
- Voltages: $V_R = 60$ V, $V_L = 160$ V, $V_C = 80$ V. (The inductor's voltage exceeds the supply; the voltages add as phasors, not as plain numbers: $\sqrt{60^2 + (160 - 80)^2} = 100$ V.)

## 6. Power in AC circuits

| Power | Formula | Unit | Meaning |
|---|---|---|---|
| **Real (active)** | $P = V I \cos\phi$ | watt (W) | Actually converted to heat or work |
| Reactive | $Q = V I \sin\phi$ | volt-ampere reactive (VAR) | Shuttled back and forth by L and C |
| **Apparent** | $S = V I$ | volt-ampere (VA) | What the supply must provide |

$$
S^2 = P^2 + Q^2 \qquad \text{power factor} = \cos\phi = \frac{P}{S}
$$

**In the example:** $\cos\phi = 30/50 = 0.6$ (lagging); $P = 100 \times 2 \times 0.6 = 120$ W (check: $I^2R = 4 \times 30 = 120$ W ✓); $Q = 100 \times 2 \times 0.8 = 160$ VAR; $S = 200$ VA.

Only resistors consume real power. A **low power factor** means more current for the same useful power, so bigger losses in the wires; utilities penalise it, and industries add **capacitors** to correct inductive loads such as motors.

## 7. Resonance

A series RLC circuit is **resonant** when $X_L = X_C$:

$$
f_0 = \frac{1}{2\pi\sqrt{LC}}
$$

At resonance, the reactances cancel: $Z = R$ (its **minimum**), the current is **maximum**, and voltage and current are **in phase** (power factor 1). The **quality factor** $Q = \omega_0 L / R$ measures how sharp the resonance is, and the bandwidth is $f_0 / Q$.

**Example.** $L = 10$ mH and $C = 100$ nF: $f_0 = 1/(2\pi\sqrt{10^{-2} \times 10^{-7}}) = 1/(2\pi \times 10^{-4.5}) \approx 5.03$ kHz.

Resonance is how radios tune to one station. (In a **parallel** resonant circuit, the impedance is instead at its **maximum**.)

## Summary

- $V_{rms} = V_m/\sqrt{2}$; Bangladesh mains: 220 V RMS (311 V peak), 50 Hz.
- $X_L = 2\pi f L$ (current lags), $X_C = 1/(2\pi f C)$ (current leads); inductors short and capacitors open in steady DC.
- $Z = R + j(X_L - X_C)$, $\lvert Z \rvert = \sqrt{R^2 + X^2}$, $\phi = \tan^{-1}(X/R)$.
- $P = VI\cos\phi$, $Q = VI\sin\phi$, $S = VI$; power factor $= \cos\phi$.
- Series resonance at $f_0 = 1/(2\pi\sqrt{LC})$: minimum impedance, maximum current, unity power factor.

## Check yourself

<details>
<summary>What is the reactance of a 10 μF capacitor at 50 Hz?</summary>

$X_C = 1/(2\pi \times 50 \times 10^{-5}) \approx 318$ Ω.
</details>

<details>
<summary>A load draws 10 A from a 220 V supply with a power factor of 0.8. What real power does it use?</summary>

$P = 220 \times 10 \times 0.8 = 1760$ W.
</details>

<details>
<summary>What happens to the current in a series RLC circuit at resonance, and why?</summary>

It reaches its maximum, because the inductive and capacitive reactances cancel, leaving only the resistance.
</details>
