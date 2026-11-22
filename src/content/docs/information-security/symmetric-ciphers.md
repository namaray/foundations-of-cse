---
title: Symmetric Block Ciphers
description: Confusion and diffusion, substitution–permutation networks and Feistel networks, DES (structure, round function, S-boxes, key schedule, weaknesses), double DES and the meet-in-the-middle attack, triple DES, and AES (state, rounds, SubBytes, ShiftRows, MixColumns, AddRoundKey).
sidebar:
  label: "3. DES and AES"
  order: 3
lesson:
  module: Symmetric cryptography
  prerequisites:
    - label: Classical ciphers
      link: /information-security/classical-ciphers/
  outcomes:
    - Explain Shannon's confusion and diffusion and the avalanche effect
    - Describe a Feistel round and why decryption uses the same structure
    - Describe the structure of DES and explain why it is no longer secure
    - Describe the four AES round operations and the number of rounds per key size
  keyIdea: >-
    Modern block ciphers encrypt fixed-size blocks through many **rounds** of substitution (confusion) and permutation (diffusion). **DES** is a 16-round **Feistel** cipher with a 56-bit key, now too short. **AES** is a substitution–permutation network on 128-bit blocks with 128-, 192- or 256-bit keys and 10, 12 or 14 rounds, and is today's standard.
---

## 1. Design principles

Claude Shannon named two properties a good cipher needs:

- **Confusion:** make the relationship between the **key** and the ciphertext as complex as possible (achieved by **substitution**, such as S-boxes).
- **Diffusion:** spread each **plaintext** bit's influence over many ciphertext bits, hiding statistical patterns (achieved by **permutation** and mixing).

**Avalanche effect:** flipping one bit of the plaintext or key should flip about **half** the ciphertext bits.

A **block cipher** encrypts a fixed-size block (64 or 128 bits) at a time; a **stream cipher** encrypts bit by bit or byte by byte with a keystream. Block ciphers are built by iterating a simple **round function** many times, using a different **round key** (subkey), derived from the main key by a **key schedule**, in each round.

## 2. Feistel networks

Split the block into halves $L$ and $R$. Each round:

$$
L_i = R_{i-1} \qquad R_i = L_{i-1} \oplus F(R_{i-1}, K_i)
$$

```text
   L(i-1)            R(i-1)
     │                 │
     │        ┌────────┤
     │        ▼        │
     └──► ⊕ ◄── F ◄── K(i)
          │            │
          ▼            ▼
        R(i)         L(i)      (halves swap)
```

The key property: **decryption uses the same structure with the round keys in reverse order**, and $F$ **doesn't need to be invertible**, since it is only ever XORed in. So the same hardware does both directions.

## 3. DES (Data Encryption Standard)

Adopted in 1977.

| Parameter | Value |
|---|---|
| Block size | **64 bits** |
| Key | **56 bits** (written as 64 bits; every 8th bit is parity) |
| Rounds | **16** Feistel rounds |
| Round keys | 48 bits each, from the key schedule (permutations and circular left shifts) |

**Structure:** initial permutation (IP) → 16 rounds → swap halves → final permutation ($IP^{-1}$).

**The round function** $F(R, K)$ on the 32-bit half:

1. **Expansion** E: 32 → 48 bits (some bits are duplicated).
2. **XOR** with the 48-bit round key.
3. **S-boxes:** eight boxes, each mapping **6 bits → 4 bits** (48 → 32). The S-boxes are the only **non-linear** part, and the heart of DES's security. (The outer two of each 6 bits pick the row, the middle four the column.)
4. **Permutation** P on the 32 bits.

**Weaknesses:** the **56-bit key is too short**: the EFF's "Deep Crack" machine found a key in 56 hours in 1998. (DES has no practical analytic break; differential and linear cryptanalysis need $2^{47}$ and $2^{43}$ known or chosen plaintexts.) It also has weak keys and a 64-bit block, which is small for large volumes of data.

## 4. Double and triple DES

**Double DES**, $C = E_{K_2}(E_{K_1}(P))$, looks like 112 bits of key but gives only about **57 bits** of security because of the **meet-in-the-middle** attack: with one known pair $(P, C)$, encrypt $P$ under all $2^{56}$ values of $K_1$ and store the results; decrypt $C$ under all $2^{56}$ values of $K_2$ and look for a match in the middle. That costs about $2 \times 2^{56} = 2^{57}$ operations (plus a lot of memory), not $2^{112}$.

**Triple DES** (3DES) uses **encrypt–decrypt–encrypt**:

$$
C = E_{K_3}(D_{K_2}(E_{K_1}(P)))
$$

- With three keys: 168 key bits, about **112 bits** of security (meet-in-the-middle again).
- With two keys ($K_3 = K_1$): 112 key bits.
- EDE rather than EEE makes it **backward-compatible**: setting $K_1 = K_2 = K_3$ gives single DES.

3DES is secure but slow (three DES operations) and still has a 64-bit block; it is deprecated in favour of AES.

## 5. AES (Advanced Encryption Standard)

Chosen by NIST in 2001 from an open competition; the winning design is **Rijndael** (by Daemen and Rijmen).

| Key size | Rounds |
|---|---|
| 128 bits | **10** |
| 192 bits | 12 |
| 256 bits | 14 |

The **block is always 128 bits**, arranged as a 4 × 4 matrix of bytes called the **state**. AES is a **substitution–permutation network**, not a Feistel cipher: every round transforms the whole block.

**Each round:**

| Step | Operation | Provides |
|---|---|---|
| **SubBytes** | Replace each byte using a fixed S-box (inversion in $GF(2^8)$ plus an affine map) | **Confusion** (non-linearity) |
| **ShiftRows** | Rotate row $r$ of the state left by $r$ bytes (row 0 unchanged) | **Diffusion** across columns |
| **MixColumns** | Multiply each column by a fixed matrix over $GF(2^8)$ | **Diffusion** within columns |
| **AddRoundKey** | XOR the state with the round key | Brings in the key |

The whole cipher: an initial AddRoundKey, then $N - 1$ full rounds, then a **final round without MixColumns**. Decryption applies the inverse operations (InvSubBytes, InvShiftRows, InvMixColumns) in reverse.

After two rounds, every output bit depends on every input bit. No practical attack on full AES is known; the best attacks are only slightly faster than brute force. Modern CPUs have dedicated AES instructions (AES-NI).

| | DES | AES |
|---|---|---|
| Structure | Feistel | Substitution–permutation network |
| Block | 64 bits | 128 bits |
| Key | 56 bits | 128 / 192 / 256 bits |
| Rounds | 16 | 10 / 12 / 14 |
| Status | Broken by brute force | Current standard |

Other block ciphers to recognise: Blowfish and Twofish, IDEA, Serpent, Camellia.

## Summary

- Confusion (substitution, key ↔ ciphertext) and diffusion (permutation, spread plaintext influence); avalanche effect.
- Feistel: $L_i = R_{i-1}$, $R_i = L_{i-1} \oplus F(R_{i-1}, K_i)$; decrypt with reversed round keys; $F$ need not be invertible.
- DES: 64-bit block, 56-bit key, 16 rounds; expansion, XOR, eight 6→4 S-boxes, permutation. Broken by brute force.
- Double DES ≈ 57-bit security (meet-in-the-middle); 3DES EDE ≈ 112 bits.
- AES: 128-bit block, 10/12/14 rounds; SubBytes, ShiftRows, MixColumns, AddRoundKey; the last round skips MixColumns.

## Check yourself

<details>
<summary>Why doesn't the Feistel function F need to be invertible?</summary>

Decryption recomputes $F(R_{i-1}, K_i)$ from values it already knows (the other half and the round key) and XORs it out again. $F$ is only ever evaluated forwards.
</details>

<details>
<summary>Which is the only non-linear component of DES, and why does that matter?</summary>

The S-boxes. Without a non-linear step, the whole cipher would be a linear function of the plaintext and key, solvable with linear algebra.
</details>

<details>
<summary>How many rounds does AES-256 use, and which step is missing from the last round?</summary>

14 rounds; the final round has no MixColumns.
</details>
