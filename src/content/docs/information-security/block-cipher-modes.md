---
title: Block Cipher Modes and Stream Ciphers
description: Why modes of operation are needed, ECB, CBC, CFB, OFB and CTR with their equations and properties, initialisation vectors, padding, authenticated encryption with GCM, stream ciphers (RC4, ChaCha20), and random number generation.
sidebar:
  label: "4. Modes and stream ciphers"
  order: 4
lesson:
  module: Symmetric cryptography
  prerequisites:
    - label: DES and AES
      link: /information-security/symmetric-ciphers/
  outcomes:
    - Explain why ECB is insecure for most data
    - Write the encryption and decryption equations for CBC and CTR
    - Compare the modes on parallelism, error propagation and IV requirements
    - Explain authenticated encryption and how stream ciphers work
  keyIdea: >-
    A block cipher alone encrypts one block; a **mode of operation** says how to encrypt longer messages. **ECB** encrypts each block separately, so identical blocks give identical ciphertext and patterns leak. **CBC** chains each block to the previous ciphertext, and **CTR** turns the cipher into a stream cipher by encrypting a counter. **GCM** adds authentication.
---

Notation: $E_K$ = block cipher encryption, $P_i$ / $C_i$ = the $i$-th plaintext / ciphertext block, IV = **initialisation vector**.

## 1. ECB (electronic codebook)

$$
C_i = E_K(P_i)
$$

Each block is encrypted independently. **Identical plaintext blocks produce identical ciphertext blocks**, so structure leaks: the famous example is an image encrypted with ECB, whose outline remains clearly visible. ECB is acceptable only for single blocks of random data (such as a key). **Don't use it for messages.**

## 2. CBC (cipher block chaining)

$$
C_i = E_K(P_i \oplus C_{i-1}) \qquad C_0 = IV
$$

$$
P_i = D_K(C_i) \oplus C_{i-1}
$$

```text
        P1             P2             P3
        │              │              │
 IV ──► ⊕      ┌─────► ⊕      ┌─────► ⊕
        │      │       │      │       │
       E_K     │      E_K     │      E_K
        │      │       │      │       │
        C1 ────┘       C2 ────┘       C3
```

- Identical blocks encrypt differently (each depends on all previous blocks).
- The **IV must be unpredictable** (random) for each message.
- Encryption is **sequential**; decryption can be **parallel** (it needs only $C_i$ and $C_{i-1}$).
- A corrupted ciphertext block garbles its own plaintext block completely and flips the same bits in the **next** one; later blocks are unaffected.
- Needs **padding** to a whole number of blocks (for example PKCS#7: add $n$ bytes each of value $n$). Badly handled padding errors enable **padding-oracle attacks**.

## 3. CFB, OFB and CTR: block ciphers as stream ciphers

These modes use $E_K$ to generate a **keystream** that is XORed with the plaintext, so they need **no padding** and use only the encryption direction of the cipher.

| Mode | Keystream | Equation |
|---|---|---|
| **CFB** (cipher feedback) | Encrypt the previous **ciphertext** | $C_i = P_i \oplus E_K(C_{i-1})$, $C_0 = IV$ |
| **OFB** (output feedback) | Encrypt the previous **keystream block** | $O_i = E_K(O_{i-1})$, $O_0 = IV$; $C_i = P_i \oplus O_i$ |
| **CTR** (counter) | Encrypt a **counter** | $C_i = P_i \oplus E_K(\text{nonce} \parallel i)$ |

**CTR** is the most popular: every block is independent, so both encryption and decryption run **in parallel**, and any block can be decrypted directly (**random access**). The nonce–counter pair must **never repeat** under the same key, or two messages share a keystream (the reused one-time pad problem).

## 4. Comparison

| | ECB | CBC | CFB | OFB | CTR |
|---|---|---|---|---|---|
| Hides patterns | **No** | Yes | Yes | Yes | Yes |
| Parallel encryption | Yes | No | No | No (keystream can be precomputed) | **Yes** |
| Parallel decryption | Yes | Yes | Yes | No (keystream can be precomputed) | **Yes** |
| Padding needed | Yes | Yes | No | No | No |
| One bad ciphertext bit affects | 1 block | 1 block + 1 bit | 1 bit + next block | **1 bit only** | **1 bit only** |
| IV / nonce | None | Random IV | Random IV | Unique IV | Unique nonce |

## 5. Authenticated encryption

Encryption alone provides **confidentiality**, not **integrity**: an attacker can flip bits in a CTR ciphertext and flip exactly the same plaintext bits, undetected. **Authenticated encryption** provides both:

- **GCM** (Galois/counter mode): CTR encryption plus a fast authentication tag computed in $GF(2^{128})$. AES-GCM is the most common cipher suite in TLS.
- **ChaCha20-Poly1305:** a stream cipher plus a MAC; fast on devices without AES hardware.
- Generic construction: **encrypt-then-MAC** (encrypt, then compute a MAC over the ciphertext) is the safe order.

## 6. Stream ciphers

A **stream cipher** generates a pseudorandom **keystream** from a key (and nonce) and XORs it with the data, imitating a one-time pad.

- **Synchronous:** the keystream is independent of the data (OFB, CTR, ChaCha20).
- **Self-synchronising:** the keystream depends on previous ciphertext (CFB).
- **RC4:** once widespread (WEP, early TLS), now **broken** because of keystream biases.
- **ChaCha20:** modern, fast in software, used in TLS 1.3 and WireGuard.
- **LFSRs** (linear feedback shift registers) are fast in hardware, but linear, so they must be combined non-linearly (A5/1 in GSM did this, weakly).

**Randomness:** keys, IVs and nonces must come from a **cryptographically secure** random number generator (such as `/dev/urandom`), not an ordinary one like `rand()`, whose outputs can be predicted.

## Summary

- ECB: $C_i = E(P_i)$; leaks patterns; avoid.
- CBC: $C_i = E(P_i \oplus C_{i-1})$; random IV; sequential encryption, parallel decryption; padding.
- CFB, OFB, CTR make a keystream; CTR $C_i = P_i \oplus E(\text{nonce} \parallel i)$ is parallel and random-access; never reuse a nonce.
- Encryption ≠ integrity; use authenticated encryption (AES-GCM, ChaCha20-Poly1305, or encrypt-then-MAC).
- Stream ciphers XOR a keystream; RC4 is broken, ChaCha20 is modern.

## Check yourself

<details>
<summary>Why does an image encrypted with AES in ECB mode still show its outline?</summary>

Regions of the same colour form identical plaintext blocks, which ECB encrypts to identical ciphertext blocks, so the pattern of regions survives.
</details>

<details>
<summary>In CBC mode, if ciphertext block C₂ is corrupted, which plaintext blocks are affected?</summary>

$P_2$ is garbled entirely, and $P_3$ has the same bits flipped as were flipped in $C_2$. $P_4$ onwards decrypt correctly.
</details>

<details>
<summary>What goes wrong if CTR mode reuses a nonce with the same key?</summary>

Both messages are XORed with the same keystream, so XORing the two ciphertexts gives the XOR of the two plaintexts, which can often be unpicked, and knowing one plaintext reveals the other.
</details>
