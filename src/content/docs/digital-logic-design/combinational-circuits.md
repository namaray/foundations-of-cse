---
title: Combinational Circuits
description: Half and full adders, ripple-carry and carry-lookahead adders, subtractors and adder-subtractors, comparators, multiplexers, demultiplexers, decoders, encoders and priority encoders, and implementing functions with multiplexers and decoders.
sidebar:
  label: "4. Combinational circuits"
  order: 4
lesson:
  module: Combinational logic
  prerequisites:
    - label: Karnaugh maps
      link: /digital-logic-design/karnaugh-maps/
  outcomes:
    - Design half and full adders and explain carry propagation
    - Explain how carry lookahead speeds up addition
    - Implement a Boolean function with a multiplexer or a decoder
    - Describe encoders, decoders and priority encoders
  keyIdea: >-
    A combinational circuit's outputs depend **only on its current inputs**. Adders, comparators, multiplexers, decoders and encoders are the standard building blocks. A **multiplexer** selects one input, and can implement any function; a **decoder** turns a binary number into one active output line.
---

## 1. Adders

**Half adder:** adds two bits.

$$
S = A \oplus B \qquad C = AB
$$

**Full adder:** adds two bits and a carry in.

$$
S = A \oplus B \oplus C_{\text{in}} \qquad C_{\text{out}} = AB + C_{\text{in}}(A \oplus B)
$$

| $A$ | $B$ | $C_{\text{in}}$ | $S$ | $C_{\text{out}}$ |
|---|---|---|---|---|
| 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 1 | 0 |
| 0 | 1 | 0 | 1 | 0 |
| 0 | 1 | 1 | 0 | 1 |
| 1 | 0 | 0 | 1 | 0 |
| 1 | 0 | 1 | 0 | 1 |
| 1 | 1 | 0 | 0 | 1 |
| 1 | 1 | 1 | 1 | 1 |

A full adder can be built from two half adders and an OR gate.

### Ripple-carry adder

Chain $n$ full adders, each passing its carry to the next. Simple, but the carry may have to **ripple** through all $n$ stages, so the delay grows linearly: about $2n$ gate delays for $n$ bits.

### Carry-lookahead adder

Compute carries in parallel. For each bit position define

$$
G_i = A_i B_i \ (\text{generate}) \qquad P_i = A_i \oplus B_i \ (\text{propagate})
$$

Then $C_{i+1} = G_i + P_i C_i$. Expanding,

$$
\begin{aligned}
C_1 &= G_0 + P_0 C_0 \\
C_2 &= G_1 + P_1 G_0 + P_1 P_0 C_0 \\
C_3 &= G_2 + P_2 G_1 + P_2 P_1 G_0 + P_2 P_1 P_0 C_0
\end{aligned}
$$

Every carry is a two-level expression of the inputs, so all carries appear after a **constant** number of gate delays, at the cost of more gates. Large adders combine 4-bit lookahead blocks hierarchically.

## 2. Subtraction and the adder-subtractor

$A - B = A + \overline{B} + 1$ in two's complement. One circuit does both: XOR each $B_i$ with a control signal $M$, and feed $M$ in as the first carry.

- $M = 0$: the XORs pass $B$ unchanged, carry in 0 → $A + B$.
- $M = 1$: the XORs invert $B$, carry in 1 → $A - B$.

Overflow is detected as $V = C_n \oplus C_{n-1}$ (see [number systems](/digital-logic-design/number-systems/#4-binary-arithmetic-and-overflow)).

## 3. Magnitude comparator

Compares $A$ and $B$, giving $A > B$, $A = B$ and $A < B$. For 4 bits, let $x_i = \overline{A_i \oplus B_i}$ (1 when bit $i$ matches). Then

$$
(A = B) = x_3 x_2 x_1 x_0 \qquad (A > B) = A_3\overline{B_3} + x_3 A_2 \overline{B_2} + x_3 x_2 A_1 \overline{B_1} + x_3 x_2 x_1 A_0 \overline{B_0}
$$

That is: the first bit position (from the left) where they differ decides.

## 4. Multiplexers

A **multiplexer (MUX)** with $2^n$ data inputs and $n$ select lines routes the selected input to the single output, like a digital switch.

**4-to-1 MUX:**

$$
Y = \overline{S_1}\,\overline{S_0} I_0 + \overline{S_1} S_0 I_1 + S_1 \overline{S_0} I_2 + S_1 S_0 I_3
$$

### Implementing a function with a MUX

A $2^n$-to-1 MUX can implement any function of $n + 1$ variables: use $n$ variables as the select lines, and connect each data input to 0, 1, the last variable, or its complement.

**Example.** $F(A, B, C) = \sum m(1, 3, 5, 6)$ with a 4-to-1 MUX, using $A$ and $B$ as selects:

| $AB$ (input) | Minterms in that pair | $F$ in terms of $C$ | Connect |
|---|---|---|---|
| 00 ($I_0$) | 0 (no), 1 (yes) | $F = C$ | $C$ |
| 01 ($I_1$) | 2 (no), 3 (yes) | $F = C$ | $C$ |
| 10 ($I_2$) | 4 (no), 5 (yes) | $F = C$ | $C$ |
| 11 ($I_3$) | 6 (yes), 7 (no) | $F = \overline{C}$ | $\overline{C}$ |

A **demultiplexer** does the reverse: it sends one input to one of $2^n$ outputs chosen by the select lines.

## 5. Decoders and encoders

**Decoder:** $n$ inputs, $2^n$ outputs; exactly the output whose number matches the input is active. A 3-to-8 decoder's outputs are exactly the 8 minterms of its inputs.

**Implementing functions with a decoder:** a decoder plus OR gates implements any functions of its inputs. For $F(A, B, C) = \sum m(1, 3, 5, 6)$, OR together decoder outputs 1, 3, 5 and 6.

Decoders also select which memory chip responds to an address (see [Memory](/digital-logic-design/memory-and-pld/)). Larger decoders can be built from smaller ones with enable inputs: two 3-to-8 decoders make a 4-to-16.

**Encoder:** the reverse: $2^n$ inputs, $n$ outputs giving the number of the active input. An 8-to-3 encoder assumes exactly one input is active.

**Priority encoder:** if several inputs are active, it outputs the number of the **highest-priority** one, plus a **valid** output saying whether any input is active at all. Used for interrupt requests.

**4-to-2 priority encoder** (with $D_3$ highest):

| $D_3$ | $D_2$ | $D_1$ | $D_0$ | $Y_1$ | $Y_0$ | $V$ |
|---|---|---|---|---|---|---|
| 0 | 0 | 0 | 0 | X | X | 0 |
| 0 | 0 | 0 | 1 | 0 | 0 | 1 |
| 0 | 0 | 1 | X | 0 | 1 | 1 |
| 0 | 1 | X | X | 1 | 0 | 1 |
| 1 | X | X | X | 1 | 1 | 1 |

$Y_1 = D_3 + D_2$, $\;Y_0 = D_3 + \overline{D_2} D_1$, $\;V = D_3 + D_2 + D_1 + D_0$.

## Summary

- Full adder: $S = A \oplus B \oplus C_{\text{in}}$, $C_{\text{out}} = AB + C_{\text{in}}(A \oplus B)$.
- Ripple-carry delay grows with $n$; carry lookahead uses generate $G = AB$ and propagate $P = A \oplus B$ to compute carries in constant depth.
- An adder-subtractor XORs $B$ with the mode bit and feeds the mode bit in as the carry.
- A $2^n$-to-1 MUX implements any function of $n + 1$ variables; a decoder plus OR gates implements any function of its inputs.
- A priority encoder reports the highest-priority active input and a valid bit.

## Check yourself

<details>
<summary>How many select lines does a 16-to-1 multiplexer have?</summary>

$\log_2 16 = 4$.
</details>

<details>
<summary>Why is a ripple-carry adder slow for 64-bit numbers?</summary>

The carry out of each bit is needed by the next, so in the worst case it passes through all 64 full adders one after another.
</details>

<details>
<summary>Implement F(A, B) = A ⊕ B with a 2-to-1 MUX using A as the select line.</summary>

When $A = 0$, $F = B$; when $A = 1$, $F = \overline{B}$. Connect $I_0 = B$ and $I_1 = \overline{B}$.
</details>
