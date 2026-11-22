---
title: Public-Key Cryptography
description: The idea of trapdoor one-way functions, RSA key generation, encryption and decryption with a worked example and why it works, Diffie–Hellman key exchange with a worked example and the man-in-the-middle attack, ElGamal encryption, elliptic-curve cryptography, and key sizes.
sidebar:
  label: "5. Public-key cryptography"
  order: 5
lesson:
  module: Public-key cryptography
  prerequisites:
    - label: Number theory (modular arithmetic, RSA in miniature)
      link: /discrete-mathematics/number-theory/
    - label: Security fundamentals
      link: /information-security/security-fundamentals/
  outcomes:
    - Generate an RSA key pair and encrypt and decrypt with it
    - Explain why RSA decryption works and what its security rests on
    - Carry out a Diffie–Hellman exchange and explain the man-in-the-middle attack
    - Compare RSA, Diffie–Hellman, ElGamal and ECC and their key sizes
  keyIdea: >-
    Public-key cryptography rests on **trapdoor one-way functions**: easy to compute, hard to invert without secret information. **RSA** relies on the difficulty of **factoring** $n = pq$; **Diffie–Hellman** and **ElGamal** rely on the **discrete logarithm** problem; **ECC** uses the same idea on elliptic curves, with much smaller keys.
---

## 1. The idea

Each user has a **public key** (published) and a **private key** (kept secret).

- **Confidentiality:** encrypt with the recipient's **public** key; only their **private** key decrypts.
- **Signatures:** sign with your **private** key; anyone verifies with your **public** key (next lesson).

This needs a **trapdoor one-way function**: easy to compute, infeasible to invert, unless you know the trapdoor (the private key). Public-key algorithms are much slower than symmetric ones, so they are used mainly to **exchange keys** and **sign**, not to encrypt bulk data.

## 2. RSA

**Key generation:**

1. Choose two large random primes $p$ and $q$.
2. $n = pq$ (the **modulus**, public).
3. $\varphi(n) = (p - 1)(q - 1)$.
4. Choose $e$ with $1 < e < \varphi(n)$ and $\gcd(e, \varphi(n)) = 1$ (65537 is common).
5. Compute $d = e^{-1} \bmod \varphi(n)$ (extended Euclidean algorithm).

**Public key** $(e, n)$; **private key** $(d, n)$, keeping $p$, $q$ and $\varphi(n)$ secret too.

$$
C = M^e \bmod n \qquad M = C^d \bmod n
$$

**Worked example** (the classic textbook numbers):

- $p = 17$, $q = 11$, so $n = 187$ and $\varphi(n) = 16 \times 10 = 160$.
- $e = 7$ ($\gcd(7, 160) = 1$).
- $d = 23$, since $7 \times 23 = 161 = 160 + 1 \equiv 1 \pmod{160}$.
- Encrypt $M = 88$: $C = 88^7 \bmod 187 = $ **11**.
- Decrypt: $11^{23} \bmod 187 = $ **88** ✓.

Large powers are computed by **square-and-multiply** (fast modular exponentiation), in about $\log_2$ of the exponent steps.

**Why it works:** $ed = 1 + k\varphi(n)$, so $M^{ed} = M \cdot (M^{\varphi(n)})^k \equiv M \cdot 1^k = M \pmod n$ by **Euler's theorem** (the result also holds when $M$ shares a factor with $n$).

**Security:** anyone who can **factor** $n$ gets $p$ and $q$, then $\varphi(n)$, then $d$. Factoring a 2048-bit $n$ is infeasible with known classical algorithms (the best is the general number field sieve).

**Pitfalls:** "textbook" RSA is **deterministic** (the same message always gives the same ciphertext) and malleable. Real RSA uses randomised **padding** (OAEP for encryption, PSS for signatures). A small $e$ with a small message and no padding is also insecure.

## 3. Diffie–Hellman key exchange

Lets two parties agree on a **shared secret over a public channel**, without having shared anything before. Public parameters: a large prime $p$ and a generator $g$.

| Alice | Public channel | Bob |
|---|---|---|
| Picks secret $a$ | | Picks secret $b$ |
| Sends $A = g^a \bmod p$ | $A$ → , ← $B$ | Sends $B = g^b \bmod p$ |
| Computes $s = B^a \bmod p$ | | Computes $s = A^b \bmod p$ |

Both get $s = g^{ab} \bmod p$.

**Worked example.** $p = 23$, $g = 5$, $a = 6$, $b = 15$:

- $A = 5^6 \bmod 23 = 8$; $B = 5^{15} \bmod 23 = 19$.
- Alice: $19^6 \bmod 23 = 2$. Bob: $8^{15} \bmod 23 = 2$. Shared secret **2**.

**Security:** an eavesdropper sees $p$, $g$, $A$ and $B$; finding $a$ from $A = g^a \bmod p$ is the **discrete logarithm problem**, believed infeasible for large $p$.

**Man-in-the-middle attack:** plain DH has **no authentication**. Mallory can intercept and run one exchange with Alice and another with Bob, then relay (and read) everything. The fix is to **authenticate** the exchanged values, with **signatures and certificates** (as TLS does).

Using fresh ("ephemeral") DH keys for each session (DHE, ECDHE) gives **forward secrecy**: stealing a server's long-term key later doesn't decrypt past sessions.

## 4. ElGamal encryption

Built on Diffie–Hellman. The private key is $x$; the public key is $(p, g, y = g^x \bmod p)$.

- **Encrypt** $m$: pick a random $k$; send $c_1 = g^k \bmod p$ and $c_2 = m \cdot y^k \bmod p$.
- **Decrypt:** $s = c_1^x \bmod p$ (equal to $y^k$), then $m = c_2 \cdot s^{-1} \bmod p$.

**Example.** $p = 23$, $g = 5$, $x = 6$, so $y = 8$. Encrypt $m = 10$ with $k = 3$: $c_1 = 5^3 \bmod 23 = 10$, $c_2 = 10 \times 8^3 \bmod 23 = 14$. Decrypt: $s = 10^6 \bmod 23 = 6$; $6^{-1} \bmod 23 = 4$ (since $6 \times 4 = 24 \equiv 1$); $m = 14 \times 4 \bmod 23 = 10$ ✓.

ElGamal is **randomised** (the same message encrypts differently each time) and the ciphertext is twice the length of the message. Its signature variant led to **DSA**.

## 5. Elliptic-curve cryptography (ECC)

An elliptic curve $y^2 = x^3 + ax + b$ over a finite field has points that can be "added" with a geometric rule (draw a line through two points, take the third intersection, reflect it). Multiplying a point by an integer ($kP = P + P + \dots + P$) is easy; recovering $k$ from $P$ and $kP$ (the **elliptic-curve discrete logarithm problem**) is much harder than ordinary discrete logs.

For example, on $y^2 = x^3 + 2x + 2 \pmod{17}$, doubling $P = (5, 1)$ gives $2P = (6, 3)$.

ECC versions of DH and DSA are **ECDH** and **ECDSA** (and EdDSA / Ed25519), used in TLS, SSH, Bitcoin and messaging apps.

## 6. Key sizes

Approximately equivalent security (NIST guidance):

| Symmetric | RSA / DH | ECC |
|---|---|---|
| 80 bits | 1024 bits | 160 bits |
| 112 bits | 2048 bits | 224 bits |
| **128 bits** | **3072 bits** | **256 bits** |
| 256 bits | 15360 bits | 512 bits |

ECC gives the same security with **much smaller keys**, so it is faster and suits phones and smart cards.

**Quantum threat:** Shor's algorithm on a large quantum computer would break RSA, DH and ECC. **Post-quantum** algorithms (such as the lattice-based ML-KEM, standardised by NIST in 2024) are being deployed. Symmetric ciphers survive with doubled key lengths (Grover's algorithm only halves the effective key length).

## Summary

- RSA: $n = pq$, $\varphi = (p-1)(q-1)$, $ed \equiv 1 \pmod{\varphi}$; $C = M^e$, $M = C^d \bmod n$. Security = hardness of factoring. Use padding (OAEP).
- Example: $p = 17$, $q = 11$, $e = 7$, $d = 23$; $88 \to 11 \to 88$.
- DH: $A = g^a$, $B = g^b$, $s = g^{ab} \bmod p$; secure against eavesdroppers (discrete log), but needs authentication against man-in-the-middle.
- ElGamal: $c_1 = g^k$, $c_2 = m y^k$; randomised.
- ECC: 256-bit keys ≈ 3072-bit RSA ≈ 128-bit symmetric.

## Check yourself

<details>
<summary>With p = 5, q = 11 and e = 3, what is d?</summary>

$n = 55$, $\varphi = 4 \times 10 = 40$, and $3d \equiv 1 \pmod{40}$ gives $d = 27$ ($3 \times 27 = 81 = 2 \times 40 + 1$).
</details>

<details>
<summary>Diffie–Hellman with p = 11, g = 2, a = 3, b = 4. What do Alice and Bob send, and what is the shared secret?</summary>

$A = 2^3 \bmod 11 = 8$, $B = 2^4 \bmod 11 = 5$. Secret: $5^3 \bmod 11 = 125 \bmod 11 = 4$, and $8^4 \bmod 11 = 4096 \bmod 11 = 4$.
</details>

<details>
<summary>Why isn't Diffie–Hellman alone enough to stop a man-in-the-middle attack?</summary>

It doesn't authenticate who sent each public value, so an attacker can substitute their own values and set up a separate shared key with each side.
</details>
