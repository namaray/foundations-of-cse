---
title: Classical Ciphers
description: Substitution and transposition ciphers with worked examples, including Caesar, affine, monoalphabetic, Playfair, Vigenère and Hill ciphers, rail fence and columnar transposition, frequency analysis, and the one-time pad's perfect secrecy.
sidebar:
  label: "2. Classical ciphers"
  order: 2
lesson:
  module: Foundations
  prerequisites:
    - label: Security fundamentals
      link: /information-security/security-fundamentals/
    - label: Modular arithmetic
      link: /discrete-mathematics/number-theory/
  outcomes:
    - Encrypt with Caesar, affine, Playfair, Vigenère and Hill ciphers
    - Encrypt with rail fence and columnar transposition
    - Explain how frequency analysis breaks monoalphabetic ciphers
    - Explain why the one-time pad is perfectly secure and why it is rarely used
  keyIdea: >-
    Classical ciphers either **substitute** letters (Caesar, Vigenère, Playfair, Hill) or **rearrange** them (transposition). Single-alphabet substitutions leak letter **frequencies** and fall to frequency analysis; using several alphabets or blocks of letters hides them better. Only the **one-time pad**, with a truly random key as long as the message and never reused, is unbreakable.
---

Letters are numbered A = 0, B = 1, …, Z = 25, and arithmetic is mod 26.

## 1. Caesar (shift) cipher

$$
C = (P + k) \bmod 26 \qquad P = (C - k) \bmod 26
$$

**Example.** $k = 3$: HELLO → **KHOOR**.

Only 25 useful keys, so **brute force** breaks it instantly.

## 2. Affine cipher

$$
C = (aP + b) \bmod 26
$$

$a$ must be coprime to 26 (so it has an inverse and decryption works): $a \in \{1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25\}$, giving $12 \times 26 = 312$ keys. Decryption: $P = a^{-1}(C - b) \bmod 26$.

**Example.** $a = 5$, $b = 8$: AFFINE → **IHHWVC** (A: $5 \cdot 0 + 8 = 8$ = I; F: $5 \cdot 5 + 8 = 33 \equiv 7$ = H).

## 3. Monoalphabetic substitution and frequency analysis

Map each letter to any other letter (a permutation of the alphabet): $26! \approx 4 \times 10^{26}$ keys, far too many to brute-force.

But each plaintext letter always becomes the same ciphertext letter, so **letter frequencies survive**. In English, **E** is the most common letter (about 12.7%), followed by T, A, O, I, N; common pairs are TH, HE, IN. Matching the ciphertext's frequency profile to English, plus guessing common words, breaks it with a few hundred characters of ciphertext.

**Lesson:** a huge key space is necessary but **not sufficient** for security.

## 4. Playfair cipher

Encrypts **pairs** of letters with a 5 × 5 grid built from a keyword (I and J share a cell). With the key MONARCHY:

```text
M  O  N  A  R
C  H  Y  B  D
E  F  G  I/J K
L  P  Q  S  T
U  V  W  X  Z
```

Split the plaintext into pairs, inserting a filler (usually X) between repeated letters in a pair and at the end if needed. Then, for each pair:

| Case | Rule | Example |
|---|---|---|
| Same row | Take the letter to the **right** of each (wrapping) | ar → **RM** |
| Same column | Take the letter **below** each (wrapping) | mu → **CM** |
| Otherwise (rectangle) | Take the letter in the **same row** but the **other's column** | hs → **BP**, ea → **IM** |

Working on pairs flattens single-letter frequencies (there are 600 possible pairs), but pair frequencies still leak.

## 5. Vigenère cipher (polyalphabetic)

Use a keyword; each letter of the key gives the shift for one plaintext letter, repeating the key:

$$
C_i = (P_i + K_{i \bmod m}) \bmod 26
$$

**Example.** Plaintext HELLO, key KEY (shifts 10, 4, 24):

| Plaintext | H (7) | E (4) | L (11) | L (11) | O (14) |
|---|---|---|---|---|---|
| Key | K (10) | E (4) | Y (24) | K (10) | E (4) |
| Sum mod 26 | 17 | 8 | 9 | 21 | 18 |
| Ciphertext | **R** | **I** | **J** | **V** | **S** |

The two L's encrypt differently (J and V), hiding frequencies. It is broken by finding the key length $m$ (the **Kasiski** test: repeated ciphertext fragments are spaced by multiples of $m$; or the index of coincidence), then solving $m$ separate Caesar ciphers.

## 6. Hill cipher

Encrypts blocks of $m$ letters with an $m \times m$ key matrix $K$: $C = KP \bmod 26$. $K$ must be invertible mod 26 (its determinant coprime to 26).

**Example.** $K = \begin{bmatrix} 3 & 3 \\ 2 & 5 \end{bmatrix}$ (determinant $15 - 6 = 9$, coprime to 26). Encrypt HELP:

- HE = (7, 4): $\begin{bmatrix} 3 \cdot 7 + 3 \cdot 4 \\ 2 \cdot 7 + 5 \cdot 4 \end{bmatrix} = \begin{bmatrix} 33 \\ 34 \end{bmatrix} \equiv \begin{bmatrix} 7 \\ 8 \end{bmatrix}$ = **HI**
- LP = (11, 15): $\begin{bmatrix} 33 + 45 \\ 22 + 75 \end{bmatrix} = \begin{bmatrix} 78 \\ 97 \end{bmatrix} \equiv \begin{bmatrix} 0 \\ 19 \end{bmatrix}$ = **AT**

HELP → **HIAT**. Decryption uses $K^{-1} \bmod 26$. Hill hides single-letter frequencies well, but it is linear, so a **known-plaintext** attack recovers $K$ from $m$ plaintext–ciphertext blocks.

## 7. Transposition ciphers

Transposition keeps the letters but **rearranges** them, so letter frequencies are unchanged (a clue that a transposition was used).

**Rail fence** (depth 2): write the letters alternately on two rails and read each rail. HELLOWORLD → rails HLOOL and ELWRD → **HLOOLELWRD**.

**Columnar transposition:** write the plaintext in rows under a numeric key, then read the **columns in key order**. ATTACKATDAWN with key 4 3 1 2:

```text
Key:   4  3  1  2
       A  T  T  A
       C  K  A  T
       D  A  W  N
```

Read column 1 (TAW), then 2 (ATN), 3 (TKA), 4 (ACD): **TAWATNTKAACD**.

Combining substitution and transposition (a **product cipher**) is much stronger than either alone, which is the idea behind modern block ciphers.

## 8. The one-time pad

Encrypt with a **truly random** key **as long as the message**, used **only once**: $C = P \oplus K$ (or letter-wise addition mod 26).

- **Perfect secrecy** (Shannon): the ciphertext reveals nothing about the plaintext, because every plaintext of that length is equally possible with some key. It is unconditionally secure.
- **Impractical:** the key is as long as all the data, must be truly random, and must be shared securely in advance.
- **Never reuse the key:** $C_1 \oplus C_2 = P_1 \oplus P_2$, which removes the key entirely and can be attacked.

**Stream ciphers** (next lessons) imitate the one-time pad with a pseudorandom keystream generated from a short key.

## Summary

- Caesar $C = P + k$ (25 keys); affine $C = aP + b$ with $\gcd(a, 26) = 1$ (312 keys).
- Monoalphabetic substitution has $26!$ keys but falls to frequency analysis.
- Playfair: digraphs with a 5 × 5 grid (row → right, column → below, rectangle → swap columns).
- Vigenère: repeating key shifts; broken by finding the key length (Kasiski).
- Hill: $C = KP \bmod 26$; vulnerable to known-plaintext attacks.
- Transposition rearranges letters (rail fence, columnar); frequencies unchanged.
- One-time pad: perfect secrecy, but the key must be random, as long as the message and never reused.

## Check yourself

<details>
<summary>Encrypt CAT with the Caesar cipher, k = 5.</summary>

C (2) → H (7), A (0) → F (5), T (19) → Y (24): **HFY**.
</details>

<details>
<summary>Why can't a = 13 be used in the affine cipher?</summary>

$\gcd(13, 26) = 13 \ne 1$, so 13 has no inverse mod 26: different letters would encrypt to the same letter and decryption would be impossible.
</details>

<details>
<summary>How can you tell from letter frequencies whether a ciphertext came from substitution or transposition?</summary>

A transposition's ciphertext has normal English letter frequencies (E most common, and so on), because the letters are only rearranged; a substitution changes which letters are frequent.
</details>
