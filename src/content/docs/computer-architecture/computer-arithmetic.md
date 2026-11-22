---
title: Computer Arithmetic
description: Shift-and-add multiplication, Booth's algorithm with a worked example, restoring division, IEEE 754 floating-point format with encoding and decoding examples, special values, and floating-point addition.
sidebar:
  label: "5. Computer arithmetic"
  order: 5
lesson:
  module: Processor design
  prerequisites:
    - label: Number systems (DLD)
      link: /digital-logic-design/number-systems/
  outcomes:
    - Multiply signed numbers with Booth's algorithm
    - Encode and decode numbers in IEEE 754 single precision
    - List the IEEE 754 special values and when they occur
    - Describe the steps of floating-point addition
  keyIdea: >-
    Hardware multiplies by repeated shifting and adding; **Booth's algorithm** handles two's-complement numbers directly and skips runs of 1s. Real numbers use **IEEE 754** floating point: a sign bit, a **biased exponent** and a **fraction** with a hidden leading 1, giving $(-1)^s \times 1.f \times 2^{e - 127}$ in single precision.
---

## 1. Shift-and-add multiplication

Binary long multiplication: for each bit of the multiplier, add a shifted copy of the multiplicand if the bit is 1. Hardware keeps a running product register, and in each step adds the multiplicand if the current multiplier bit is 1, then shifts right. $n$-bit operands give a $2n$-bit product after $n$ steps. This works for **unsigned** numbers.

## 2. Booth's algorithm

Booth's algorithm multiplies **two's-complement** numbers directly. Registers: $A$ (starts at 0), $Q$ (the multiplier), an extra bit $Q_{-1}$ (starts at 0), and $M$ (the multiplicand). Repeat $n$ times:

| $Q_0$ $Q_{-1}$ | Action |
|---|---|
| 0 0 or 1 1 | nothing |
| 1 0 | $A = A - M$ |
| 0 1 | $A = A + M$ |

then **arithmetic shift right** $A$, $Q$, $Q_{-1}$ together (copying $A$'s sign bit). The product is in $A$ and $Q$.

**Worked example:** $7 \times (-3)$ with 4 bits. $M = 0111$, $Q = 1101$ ($-3$), so $-M = 1001$.

| Step | $Q_0 Q_{-1}$ | Action | $A$ after action | After shift: $A$, $Q$, $Q_{-1}$ |
|---|---|---|---|---|
| start | | | | 0000, 1101, 0 |
| 1 | 1 0 | $A - M$ | 1001 | 1100, 1110, 1 |
| 2 | 0 1 | $A + M$ | 0011 | 0001, 1111, 0 |
| 3 | 1 0 | $A - M$ | 1010 | 1101, 0111, 1 |
| 4 | 1 1 | none | 1101 | 1110, 1011, 1 |

Result: $A\,Q = 1110\,1011 = -21$. ✓

**Why it works:** a run of 1s from bit $i$ to bit $j$ equals $2^{j+1} - 2^i$, so it needs only one subtraction (at the start of the run) and one addition (at its end), instead of one addition per 1 bit. This speeds up multipliers containing long runs of 1s.

## 3. Division

**Restoring division** for unsigned numbers repeats $n$ times: shift the remainder–quotient pair left; subtract the divisor from the remainder; if the result is negative, **restore** it (add the divisor back) and set the new quotient bit to 0, otherwise set it to 1. **Non-restoring division** avoids the restore step by adding instead of subtracting in the next step. Division is much slower than multiplication in hardware.

## 4. IEEE 754 floating point

A floating-point number is stored as **sign**, **exponent** and **fraction** (mantissa), representing $(-1)^s \times 1.f \times 2^{E - \text{bias}}$. The leading 1 is not stored (the **hidden bit**), gaining one bit of precision.

| Format | Sign | Exponent | Fraction | Bias | Approximate precision |
|---|---|---|---|---|---|
| Single (32-bit) | 1 | 8 | 23 | 127 | 7 decimal digits |
| Double (64-bit) | 1 | 11 | 52 | 1023 | 16 decimal digits |

### Encoding: −6.75 in single precision

1. Sign: negative, so $s = 1$.
2. Binary: $6.75 = 110.11_2$.
3. Normalise: $110.11 = 1.1011 \times 2^2$.
4. Exponent: $2 + 127 = 129 = 10000001_2$.
5. Fraction: the bits after the leading 1, padded: $1011\,0000\dots0$ (23 bits).

$$
\underbrace{1}_{s}\;\underbrace{10000001}_{E}\;\underbrace{10110000000000000000000}_{f} = \texttt{C0D80000}_{16}
$$

### Decoding: `0x41200000`

Binary: $0\;10000010\;0100\dots0$. Sign 0; $E = 130$, so the exponent is $130 - 127 = 3$; fraction $.01$. Value $= +1.01_2 \times 2^3 = 1010_2 = 10$.

### Special values

| Exponent field | Fraction | Meaning |
|---|---|---|
| 0 | 0 | $\pm 0$ |
| 0 | non-zero | **Denormalised** number: $(-1)^s \times 0.f \times 2^{-126}$ (fills the gap near zero) |
| 1–254 | any | Normal number |
| 255 (all 1s) | 0 | $\pm \infty$ (for example $1/0$) |
| 255 (all 1s) | non-zero | **NaN**, "not a number" (for example $0/0$, $\sqrt{-1}$) |

The largest single-precision value is about $3.4 \times 10^{38}$; the smallest normal positive value is $2^{-126} \approx 1.2 \times 10^{-38}$.

## 5. Floating-point addition

1. **Align** the exponents: shift the smaller number's fraction right until both exponents match.
2. **Add** (or subtract) the fractions.
3. **Normalise** the result, adjusting the exponent; check for overflow or underflow.
4. **Round** to the available fraction bits (by default, round to nearest, ties to even), and renormalise if rounding overflows.

**Example** (decimal, 4 digits): $9.999 \times 10^1 + 1.610 \times 10^{-1}$. Align: $0.016 \times 10^1$; add: $10.015 \times 10^1$; normalise: $1.0015 \times 10^2$; round: $1.002 \times 10^2$.

**Consequences:** floating-point addition is **not associative**, since $(a + b) + c$ can differ from $a + (b + c)$ because of rounding; and $0.1 + 0.2 \ne 0.3$ exactly, because 0.1 has no exact binary representation. Never compare floats for exact equality.

## Summary

- Booth's algorithm: look at $Q_0 Q_{-1}$; 10 subtracts $M$, 01 adds $M$; then arithmetic-shift right. $n$ steps give a $2n$-bit product.
- IEEE 754 single: 1 sign bit, 8-bit exponent with bias 127, 23-bit fraction with a hidden 1.
- Exponent field 0 means zero or denormalised; 255 means infinity or NaN.
- Floating-point addition: align, add, normalise, round. It is not associative.

## Check yourself

<details>
<summary>Encode 0.75 in IEEE 754 single precision.</summary>

$0.75 = 0.11_2 = 1.1 \times 2^{-1}$. Sign 0; exponent $-1 + 127 = 126 = 01111110$; fraction $1000\dots0$. Result `0x3F400000`.
</details>

<details>
<summary>What does an exponent field of all 1s with a zero fraction represent?</summary>

Infinity, positive or negative depending on the sign bit.
</details>

<details>
<summary>In Booth's algorithm, what action is taken when Q₀Q₋₁ = 01?</summary>

Add the multiplicand ($A = A + M$), then shift right arithmetically.
</details>
