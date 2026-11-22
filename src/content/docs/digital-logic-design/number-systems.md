---
title: Number Systems and Codes
description: Binary, octal and hexadecimal conversion, fractions, signed-magnitude, one's and two's complement, binary arithmetic and overflow, and codes such as BCD, excess-3, Gray code, ASCII and parity.
sidebar:
  label: "1. Number systems and codes"
  order: 1
lesson:
  module: Combinational logic
  outcomes:
    - Convert between decimal, binary, octal and hexadecimal, including fractions
    - Represent negative numbers in two's complement and detect overflow
    - Convert between binary and Gray code, and encode numbers in BCD
  keyIdea: >-
    Computers store numbers in **binary**. Octal and hexadecimal are compact ways to write binary (3 and 4 bits per digit). Negative numbers use **two's complement**, which lets the same adder handle addition and subtraction; an $n$-bit two's-complement number ranges from $-2^{n-1}$ to $2^{n-1} - 1$.
---

## 1. Positional number systems

In base $r$, the digits $d_{n-1} \dots d_1 d_0 . d_{-1} d_{-2}$ mean

$$
\sum_i d_i \times r^i
$$

| Base | Digits | Example |
|---|---|---|
| 2 (binary) | 0, 1 | $1011_2 = 8 + 2 + 1 = 11$ |
| 8 (octal) | 0–7 | $17_8 = 8 + 7 = 15$ |
| 10 (decimal) | 0–9 | |
| 16 (hexadecimal) | 0–9, A–F | $2F_{16} = 32 + 15 = 47$ |

## 2. Conversions

**Decimal → base $r$ (integer part):** divide by $r$ repeatedly and read the remainders **from the bottom up**.

**Example.** $156_{10}$ to binary:

| ÷ 2 | Quotient | Remainder |
|---|---|---|
| 156 | 78 | 0 |
| 78 | 39 | 0 |
| 39 | 19 | 1 |
| 19 | 9 | 1 |
| 9 | 4 | 1 |
| 4 | 2 | 0 |
| 2 | 1 | 0 |
| 1 | 0 | 1 |

Reading upward: $156_{10} = 10011100_2$.

**Fractions:** multiply by $r$ repeatedly and read the integer parts **from the top down**. $0.625 \times 2 = 1.25 \to 1$; $0.25 \times 2 = 0.5 \to 0$; $0.5 \times 2 = 1.0 \to 1$. So $0.625_{10} = 0.101_2$. Some fractions, such as $0.1_{10}$, repeat forever in binary.

**Binary ↔ octal and hex:** group bits in threes (octal) or fours (hex) from the binary point outwards.

$$
10011100_2 = \underbrace{10}_{2}\,\underbrace{011}_{3}\,\underbrace{100}_{4} = 234_8 = \underbrace{1001}_{9}\,\underbrace{1100}_{C} = 9C_{16}
$$

## 3. Signed numbers

| Representation | +5 (8 bits) | −5 (8 bits) | Range ($n$ bits) | Zeros |
|---|---|---|---|---|
| Sign-magnitude | 00000101 | **1**0000101 | $-(2^{n-1}-1)$ to $2^{n-1}-1$ | two (+0, −0) |
| One's complement | 00000101 | 11111010 (flip every bit) | $-(2^{n-1}-1)$ to $2^{n-1}-1$ | two |
| **Two's complement** | 00000101 | 11111011 (flip, then add 1) | $-2^{n-1}$ to $2^{n-1}-1$ | one |

**Two's complement of −45 in 8 bits:** $45 = 00101101$; flip to $11010010$; add 1 to get $\mathbf{11010011}$.

**Shortcut:** copy bits from the right up to and including the first 1, then flip the rest.

**Reading a two's-complement number:** the leftmost bit has weight $-2^{n-1}$. So $11010011 = -128 + 64 + 16 + 2 + 1 = -45$.

Two's complement is universal because addition works the same for signed and unsigned numbers, and there is only one zero.

## 4. Binary arithmetic and overflow

**Subtraction** $A - B$ is done as $A + (\text{two's complement of } B)$, discarding any carry out of the leftmost bit.

**Example (8 bits):** $20 - 45 = 00010100 + 11010011 = 11100111 = -25$. ✓

**Overflow** happens when the true result does not fit in $n$ bits. In two's complement:

- Adding two positives gives a negative, or adding two negatives gives a positive.
- Equivalently, the **carry into** the sign bit differs from the **carry out** of it: $V = C_n \oplus C_{n-1}$.

Adding numbers of opposite sign can never overflow.

**Example (4 bits, range −8 to 7):** $5 + 4 = 0101 + 0100 = 1001 = -7$. Overflow: two positives gave a negative.

## 5. Codes

| Code | Idea | Example |
|---|---|---|
| **BCD** (8421) | Each decimal digit in 4 bits | $59 = 0101\ 1001$ (codes 1010–1111 unused) |
| Excess-3 | BCD + 3 per digit; self-complementing | $5 \to 1000$ |
| **Gray code** | Consecutive values differ in exactly **one** bit | 0, 1, 3, 2, 6, 7, 5, 4 → 000, 001, 011, 010, 110, 111, 101, 100 |
| ASCII | 7-bit character codes | 'A' = 65, 'a' = 97, '0' = 48 |
| Unicode / UTF-8 | All the world's characters; UTF-8 uses 1–4 bytes | |

**Binary → Gray:** keep the first bit; each next Gray bit is the XOR of neighbouring binary bits. $1011_2 \to 1\ (1{\oplus}0)\ (0{\oplus}1)\ (1{\oplus}1) = 1110$.

**Gray → binary:** keep the first bit; each next binary bit is the previous **binary** bit XOR the current Gray bit. $1110 \to 1,\ 1{\oplus}1 = 0,\ 0{\oplus}1 = 1,\ 1{\oplus}0 = 1 = 1011$.

Gray code is used in rotary encoders and in [Karnaugh map](/digital-logic-design/karnaugh-maps/) row and column labels, where only one bit should change at a time.

**Parity bit:** one extra bit makes the number of 1s even (even parity) or odd (odd parity), detecting any single-bit error. See also [Hamming codes](/computer-networks/error-control/#3-error-correction-hamming-codes).

## Summary

- Decimal to base $r$: repeated division (integer part, read upwards) and multiplication (fraction, read downwards).
- Group bits in 3s for octal and 4s for hex.
- Two's complement: flip and add 1; range $-2^{n-1}$ to $2^{n-1} - 1$; one zero.
- Overflow when two same-sign operands give a result of the other sign; $V = C_n \oplus C_{n-1}$.
- BCD stores decimal digits in 4 bits; Gray code changes one bit at a time.

## Check yourself

<details>
<summary>What is the range of an 8-bit two's-complement number?</summary>

$-128$ to $127$.
</details>

<details>
<summary>Convert 3A7 (hex) to binary and octal.</summary>

$3A7_{16} = 0011\ 1010\ 0111_2 = 001\ 110\ 100\ 111_2 = 1647_8$.
</details>

<details>
<summary>In 4-bit two's complement, does −6 + (−3) overflow?</summary>

Yes. $1010 + 1101 = 1\,0111$; dropping the carry leaves $0111 = +7$. Two negatives gave a positive. (The true answer, −9, is below the range −8 to 7.)
</details>
