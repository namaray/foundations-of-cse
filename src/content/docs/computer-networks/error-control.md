---
title: Framing and Error Control
description: Framing with byte and bit stuffing, error detection with parity, checksums and CRC (worked long division), and error correction with Hamming codes.
sidebar:
  label: "3. Framing and error control"
  order: 3
lesson:
  module: Physical and data link layers
  prerequisites:
    - label: Physical layer
      link: /computer-networks/physical-layer/
  outcomes:
    - Apply bit stuffing to a bit string
    - Compute a CRC by modulo-2 long division
    - Build a Hamming (7,4) code and locate a single-bit error
  keyIdea: >-
    The data link layer splits the bit stream into **frames** and checks each one for errors. **Parity** and **checksums** are simple; **CRC** treats the frame as a polynomial and catches burst errors very reliably. **Hamming codes** go further and pinpoint, then fix, a single flipped bit.
---

## 1. Framing

The receiver needs to know where each frame starts and ends.

- **Byte stuffing:** frames begin and end with a special FLAG byte. If FLAG (or the ESC byte) appears in the data, put an ESC byte in front of it. Used by PPP.
- **Bit stuffing:** frames begin and end with the flag `01111110`. After **five consecutive 1s** in the data, the sender inserts a 0; the receiver removes any 0 that follows five 1s. Used by HDLC.

**Example (bit stuffing).** Data `0111111101` becomes `01111101101`: a 0 is inserted after the first five 1s, so the data can never contain the flag pattern.

## 2. Error detection

### Parity

Add one bit so the total number of 1s is even (**even parity**) or odd (**odd parity**). It detects any **odd** number of flipped bits but misses an even number. **Two-dimensional parity** (a parity bit for each row and each column of a block) can detect, and even correct, a single-bit error.

### Checksum

Add up the data as 16-bit words using one's complement arithmetic (carries wrap around to the low end), then send the complement of the sum. The receiver adds everything, including the checksum; the result should be all 1s. Used by IP, TCP and UDP. It is simple but weaker than CRC.

### Cyclic redundancy check (CRC)

Treat bit strings as polynomials with coefficients 0 or 1: `1101` is $x^3 + x^2 + 1$. Sender and receiver agree on a **generator** $G(x)$ of degree $r$.

**Sender:**

1. Append $r$ zeros to the data.
2. Divide by $G$ using **modulo-2 division** (subtraction is XOR, with no borrows).
3. The remainder ($r$ bits) is the CRC. Append it to the original data and send.

**Receiver:** divide the whole received frame by $G$. A remainder of zero means no error was detected.

**Worked example.** Data `101101`, generator `1101` ($x^3 + x^2 + 1$, so $r = 3$).

Append three zeros: `101101000`. Divide, XOR-ing the generator under each leading 1:

```text
1 0 1 1 0 1 0 0 0
1 1 0 1                ← XOR (leading bit is 1)
-------
0 1 1 0 0 1 0 0 0
  1 1 0 1              ← XOR
  -------
0 0 0 0 1 1 0 0 0      (next leading 1 is at position 5)
        1 1 0 1        ← XOR
        -------
0 0 0 0 0 0 0 1 0      remainder = 010
```

Transmitted frame: **`101101` + `010` = `101101010`**. Dividing it by `1101` gives remainder `000`.

**What CRC catches.** With a well-chosen generator of degree $r$: all single-bit errors, all double-bit errors, every odd number of errors (if $x + 1$ is a factor of $G$), and **every burst error of length up to $r$**. Ethernet uses CRC-32.

## 3. Error correction: Hamming codes

Detection asks for a resend; correction fixes the error at the receiver. That is useful when resending is expensive, for example in memory chips or deep-space links.

The **Hamming distance** between two codewords is the number of bit positions where they differ. A code with minimum distance $d$ can **detect** up to $d - 1$ errors and **correct** up to $\lfloor (d-1)/2 \rfloor$.

**How many check bits?** To correct one error in $m$ data bits you need $r$ check bits with

$$
2^r \ge m + r + 1
$$

For $m = 4$: $r = 3$, giving the Hamming (7,4) code.

**Hamming (7,4).** Number the bit positions 1 to 7. Positions that are powers of 2 (1, 2, 4) hold **parity bits**; the others (3, 5, 6, 7) hold data. Each parity bit covers the positions whose binary number includes that power of 2:

| Parity bit | Covers positions |
|---|---|
| $p_1$ | 1, 3, 5, 7 |
| $p_2$ | 2, 3, 6, 7 |
| $p_4$ | 4, 5, 6, 7 |

**Worked example.** Encode data `1011` with even parity, placing $d_1 d_2 d_3 d_4$ = 1, 0, 1, 1 in positions 3, 5, 6, 7.

| Position | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
|---|---|---|---|---|---|---|---|
| Role | $p_1$ | $p_2$ | $d_1$ | $p_4$ | $d_2$ | $d_3$ | $d_4$ |
| Bit | **0** | **1** | 1 | **0** | 0 | 1 | 1 |

- $p_1 = d_1 \oplus d_2 \oplus d_4 = 1 \oplus 0 \oplus 1 = 0$
- $p_2 = d_1 \oplus d_3 \oplus d_4 = 1 \oplus 1 \oplus 1 = 1$
- $p_4 = d_2 \oplus d_3 \oplus d_4 = 0 \oplus 1 \oplus 1 = 0$

Codeword: **`0110011`**.

**Finding an error.** Suppose bit 6 flips, so `0110001` arrives. Recheck each parity group:

- Group 1 (positions 1, 3, 5, 7): $0 \oplus 1 \oplus 0 \oplus 1 = 0$ ✓
- Group 2 (positions 2, 3, 6, 7): $1 \oplus 1 \oplus 0 \oplus 1 = 1$ ✗
- Group 4 (positions 4, 5, 6, 7): $0 \oplus 0 \oplus 0 \oplus 1 = 1$ ✗

The failed groups give the **syndrome** $4 + 2 = 6$: bit 6 is wrong. Flip it back.

## Summary

- Frames are delimited by flags; bit stuffing adds a 0 after five 1s so the flag never appears in the data.
- Parity detects an odd number of errors; checksums are simple; CRC detects all bursts up to the generator's degree.
- CRC: append $r$ zeros, divide by the generator using XOR, send the remainder with the data.
- Hamming codes place parity bits at powers of 2; the failed checks add up to the position of the bad bit.

## Check yourself

<details>
<summary>Apply bit stuffing to 11111111110.</summary>

Insert a 0 after each run of five 1s: `11111 0 11111 0 0` → `1111101111100`.
</details>

<details>
<summary>How many check bits are needed to correct single errors in 8 data bits?</summary>

The smallest $r$ with $2^r \ge 8 + r + 1$ is $r = 4$ ($16 \ge 13$). This gives a (12,8) code.
</details>

<details>
<summary>A code has minimum Hamming distance 5. How many errors can it detect and correct?</summary>

It detects up to 4 and corrects up to 2.
</details>
