---
title: Electrical Circuits Cheat Sheet
description: One-page revision of circuit laws, series and parallel, dividers, nodal and mesh analysis, network theorems, AC circuits, diodes, transistors and op-amps.
sidebar:
  label: "8. Cheat sheet"
  order: 20
  badge:
    text: Revision
    variant: note
lesson:
  module: Revision
---

Use this page for last-minute revision. Each heading links back to the full lesson.

## [DC basics](/electrical-circuits-and-electronics/circuit-basics/) and [analysis](/electrical-circuits-and-electronics/circuit-analysis/)

- $V = IR$; $P = VI = I^2R = V^2/R$.
- Series: $R_1 + R_2$ (same current). Parallel: $R_1R_2/(R_1 + R_2)$ (same voltage).
- Voltage divider $V_2 = V \cdot R_2/(R_1 + R_2)$. Current divider $I_1 = I \cdot R_2/(R_1 + R_2)$.
- KCL: currents into a node sum to 0. KVL: voltages around a loop sum to 0.
- Nodal: $n - 1$ KCL equations with node voltages. Mesh: KVL per mesh, shared resistor carries $I_1 - I_2$.

## [Network theorems](/electrical-circuits-and-electronics/network-theorems/)

- Superposition: one source at a time (short V sources, open I sources); not for power.
- Thevenin: $V_{th}$ = open-circuit voltage; $R_{th}$ = resistance with sources off. Norton: $I_N = V_{th}/R_{th}$.
- Maximum power at $R_L = R_{th}$: $P = V_{th}^2/(4R_{th})$, efficiency 50%.

## [AC circuits](/electrical-circuits-and-electronics/ac-circuits/)

- $V_{rms} = V_m/\sqrt{2}$; BD mains 220 V RMS (311 V peak), 50 Hz.
- $X_L = 2\pi fL$ (I lags), $X_C = 1/(2\pi fC)$ (I leads). ELI the ICE man.
- $Z = R + j(X_L - X_C)$; $\lvert Z \rvert = \sqrt{R^2 + X^2}$; $\phi = \tan^{-1}(X/R)$.
- $P = VI\cos\phi$ (W), $Q = VI\sin\phi$ (VAR), $S = VI$ (VA); PF $= \cos\phi$.
- Resonance $f_0 = 1/(2\pi\sqrt{LC})$: series → minimum $Z$, maximum $I$, PF 1.

## [Diodes](/electrical-circuits-and-electronics/diodes/)

- n-type: pentavalent dopant (electrons). p-type: trivalent dopant (holes). Si barrier ≈ 0.7 V.
- Half-wave $V_{dc} = V_m/\pi$, ripple $f$, PIV $V_m$. Full-wave $V_{dc} = 2V_m/\pi$, ripple $2f$; PIV $2V_m$ (centre-tap), $V_m$ (bridge).
- Zener regulator: $I_Z = (V_{in} - V_Z)/R_s - V_Z/R_L$.

## [Transistors](/electrical-circuits-and-electronics/transistors/) and [op-amps](/electrical-circuits-and-electronics/op-amps/)

- $I_E = I_B + I_C$, $I_C = \beta I_B$, $\alpha = \beta/(\beta + 1)$.
- Cutoff (off), active (amplifier), saturation ($V_{CE} \approx 0.2$ V, on).
- MOSFET: gate voltage control, no gate current. CMOS inverter: no static power, $P \approx CV^2f$.
- Op-amp golden rules: no input current, $V_+ = V_-$.
- Inverting $-R_f/R_{in}$; non-inverting $1 + R_f/R_1$; follower 1; summer $-R_f\sum V_i/R_i$.
- Integrator $-\frac{1}{RC}\int V\,dt$; differentiator $-RC\,dV/dt$; no feedback → comparator.

## Top viva questions

1. State Ohm's law and Kirchhoff's laws.
2. Solve a circuit with nodal or mesh analysis.
3. State and apply Thevenin's and Norton's theorems.
4. What is the maximum power transfer theorem, and why isn't it used for power grids?
5. What is RMS value? Why is mains voltage quoted as RMS?
6. Explain reactance and impedance; solve a series RLC circuit.
7. What is power factor, and why does a low one matter?
8. Explain forward and reverse bias of a pn junction.
9. Compare half-wave and full-wave rectifiers.
10. What are the operating regions of a BJT?
11. How does a CMOS inverter work?
12. Derive the gain of an inverting op-amp amplifier.
