---
title: Hashes, MACs and Digital Signatures
description: Cryptographic hash function properties, the birthday attack, MD5, SHA-1, SHA-2 and SHA-3, the Merkle–Damgård construction and length extension, MACs and HMAC, digital signatures with RSA and DSA, certificates, PKI and chains of trust, and password hashing.
sidebar:
  label: "6. Hashes and signatures"
  order: 6
lesson:
  module: Public-key cryptography
  prerequisites:
    - label: Public-key cryptography
      link: /information-security/public-key-cryptography/
  outcomes:
    - State the three security properties of cryptographic hash functions
    - Explain the birthday attack and its effect on hash output size
    - Compare MACs and digital signatures and explain why only signatures give non-repudiation
    - Explain how certificates and a chain of trust bind public keys to identities
  keyIdea: >-
    A **hash** gives a short fingerprint of any message; finding collisions should take about $2^{n/2}$ work (the **birthday bound**). A **MAC** (such as HMAC) uses a shared key to prove integrity and origin; a **digital signature** uses a private key, so anyone can verify it and the signer can't deny it. **Certificates** signed by trusted authorities bind public keys to identities.
---

## 1. Cryptographic hash functions

A hash function $H$ maps a message of any length to a fixed-length **digest** (for example 256 bits). Beyond being fast and deterministic, a **cryptographic** hash must have:

| Property | Hard to… | Attack cost for an $n$-bit hash |
|---|---|---|
| **Preimage resistance** (one-way) | Find any $m$ with $H(m) = h$, given $h$ | $2^n$ |
| **Second-preimage resistance** | Find $m' \ne m$ with $H(m') = H(m)$, given $m$ | $2^n$ |
| **Collision resistance** | Find **any** pair $m \ne m'$ with $H(m) = H(m')$ | $2^{n/2}$ (birthday attack) |

Collisions must exist (infinitely many inputs, finitely many outputs); the point is that they must be infeasible to **find**. Hashes should also show the avalanche effect: change one input bit and about half the output bits change.

## 2. The birthday attack

In a room of just **23 people**, the chance that two share a birthday is about **50.7%**, because there are $\binom{23}{2} = 253$ pairs. In general, among about $\sqrt{N}$ random values from $N$ possibilities, a repeat is likely.

For an $n$-bit hash, $N = 2^n$, so a collision is expected after about $2^{n/2}$ hashes. A 128-bit hash gives only **64-bit** collision resistance, which is why modern hashes are at least 256 bits.

## 3. Common hash functions

| Hash | Output | Status |
|---|---|---|
| MD5 | 128 bits | **Broken**: collisions found in seconds; don't use for security |
| SHA-1 | 160 bits | **Broken**: practical collision published in 2017 (SHAttered) |
| **SHA-2** (SHA-256, SHA-512) | 224–512 bits | Secure; most widely used |
| **SHA-3** (Keccak) | 224–512 bits | Secure; a different design (the **sponge** construction) chosen as a backup |
| BLAKE2 / BLAKE3 | Variable | Secure and very fast |

**Merkle–Damgård construction** (MD5, SHA-1, SHA-2): pad the message (including its length), split it into blocks, and feed each block with the running state into a **compression function**; the final state is the digest. Its weakness is **length extension**: knowing $H(m)$ and the length of $m$, an attacker can compute $H(m \parallel \text{padding} \parallel x)$ without knowing $m$. That is why $H(\text{key} \parallel m)$ is **not** a safe MAC.

**Uses:** integrity checks (download checksums), digital signatures (sign the hash), password storage, commitments, blockchains (proof of work, Merkle trees), and deduplication.

## 4. Message authentication codes

A hash alone doesn't stop tampering: an attacker who changes the message just recomputes the hash. A **MAC** mixes in a **shared secret key**: $\text{tag} = \text{MAC}_K(m)$. Only someone with $K$ can produce a valid tag, so it proves **integrity and authenticity**.

**HMAC** (used in TLS, JWTs, APIs):

$$
\text{HMAC}_K(m) = H\big((K \oplus \text{opad}) \parallel H((K \oplus \text{ipad}) \parallel m)\big)
$$

where ipad and opad are fixed constants (bytes 0x36 and 0x5C, repeated). The nested structure defeats length extension. Other MACs: CBC-MAC / CMAC (from a block cipher), Poly1305, and GMAC (inside GCM).

## 5. Digital signatures

A **signature** is computed with the signer's **private** key and verified with their **public** key.

**RSA signature** (on a hash $h = H(m)$):

$$
s = h^d \bmod n \qquad \text{verify: } s^e \bmod n \stackrel{?}{=} h
$$

**Example.** With the RSA keys from the previous lesson ($n = 187$, $e = 7$, $d = 23$), sign $h = 10$: $s = 10^{23} \bmod 187 = 175$. Verify: $175^7 \bmod 187 = 10$ ✓.

We sign the **hash** rather than the message because it is shorter (one RSA operation) and avoids algebraic attacks on raw RSA. Real RSA signatures use **PSS** padding.

Other schemes: **DSA** (based on discrete logs, from ElGamal), **ECDSA** and **EdDSA** (Ed25519) on elliptic curves. DSA and ECDSA need a fresh, secret random number for every signature: reusing it leaks the private key (this is how the PlayStation 3 signing key was recovered in 2010).

| | Hash | MAC | Digital signature |
|---|---|---|---|
| Key | None | Shared secret | Private key signs, public key verifies |
| Integrity | Only against accidents | Yes | Yes |
| Authenticates the sender | No | Yes (to the key holders) | Yes (to anyone) |
| **Non-repudiation** | No | **No**: either key holder could have made the tag | **Yes**: only the private-key holder could sign |
| Speed | Fastest | Fast | Slow |

## 6. Certificates and PKI

How do you know a public key really belongs to `bank.com` and not an attacker (the man-in-the-middle problem)? A **certificate** binds a public key to an identity, and is **signed by a certificate authority (CA)**.

An **X.509 certificate** contains the subject's name, the subject's public key, the issuer (CA), a validity period, a serial number, extensions (such as allowed domain names), and the **CA's signature** over all of it.

**Chain of trust:** browsers and operating systems ship with a set of trusted **root CA** certificates. A server presents its certificate plus any **intermediate** CA certificates; the client checks each signature up the chain to a trusted root, and checks the dates, the domain name and revocation status.

**Revocation** (for example, when a private key is stolen): **CRLs** (certificate revocation lists) and **OCSP** (online status queries, often "stapled" by the server).

**PKI** (public-key infrastructure) is the whole system: CAs, registration authorities, certificates, revocation and policies. An alternative is PGP's decentralised **web of trust**, where users sign each other's keys.

## 7. Storing passwords

Never store passwords in plain text, and don't store a plain fast hash either.

- **Salt:** a random value stored with each password and hashed with it, so identical passwords get different hashes and precomputed **rainbow tables** are useless.
- **Slow hash:** use a deliberately slow, memory-hard function such as **bcrypt**, **scrypt** or **Argon2** (or PBKDF2 with many iterations), so each guess is expensive for an attacker who steals the database.

## Summary

- Hash properties: preimage, second-preimage and collision resistance; collisions cost about $2^{n/2}$ (birthday).
- MD5 and SHA-1 are broken; use SHA-256, SHA-3 or BLAKE2.
- $H(K \parallel m)$ is unsafe (length extension); use HMAC.
- MAC: shared key, no non-repudiation. Signature: $s = H(m)^d$, verify $s^e = H(m)$; gives non-repudiation.
- Certificates (X.509) are CA-signed bindings of names to public keys; trust chains up to root CAs.
- Passwords: salt plus a slow hash (bcrypt, scrypt, Argon2).

## Check yourself

<details>
<summary>About how many hashes must an attacker compute to find a collision in a 160-bit hash by brute force?</summary>

About $2^{80}$ (the birthday bound, $2^{n/2}$).
</details>

<details>
<summary>Why doesn't a MAC provide non-repudiation?</summary>

Both parties share the key, so either could have produced the tag; a third party can't tell which one did.
</details>

<details>
<summary>What does a browser check when it receives a website's certificate?</summary>

That the signatures chain up to a trusted root CA, that the certificate is within its validity period, that it covers the site's domain name, and that it hasn't been revoked.
</details>
