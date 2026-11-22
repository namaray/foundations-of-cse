---
title: Cryptography & Security Cheat Sheet
description: One-page revision of security goals and attacks, access control, classical ciphers, DES and AES, modes of operation, RSA, Diffie–Hellman, ElGamal and ECC, hashes, MACs, signatures and PKI, and system and web security.
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

## [Fundamentals](/information-security/security-fundamentals/)

- CIA: confidentiality, integrity, availability; plus authentication, non-repudiation.
- Passive (eavesdropping, traffic analysis) vs active (masquerade, replay, modification, DoS).
- Kerckhoffs: only the key is secret. Symmetric keys for $n$ users: $n(n-1)/2$.
- Attack models: ciphertext-only < known-plaintext < chosen-plaintext < chosen-ciphertext.
- DAC (owner), MAC (labels), RBAC (roles). Bell–LaPadula: no read up, no write down. Biba: the reverse.

## [Classical ciphers](/information-security/classical-ciphers/)

- Caesar $C = P + k$ (HELLO → KHOOR, $k = 3$). Affine $C = aP + b$, $\gcd(a, 26) = 1$, 312 keys.
- Monoalphabetic: $26!$ keys, broken by frequency analysis.
- Playfair: row → right, column → below, rectangle → swap columns.
- Vigenère: HELLO + KEY → RIJVS; broken via the key length (Kasiski). Hill: $C = KP \bmod 26$.
- Transposition keeps letter frequencies. One-time pad: perfect secrecy; never reuse the key.

## [DES and AES](/information-security/symmetric-ciphers/) and [modes](/information-security/block-cipher-modes/)

- Feistel: $L_i = R_{i-1}$, $R_i = L_{i-1} \oplus F(R_{i-1}, K_i)$; decrypt with reversed keys.
- DES: 64-bit block, 56-bit key, 16 rounds, eight 6→4 S-boxes. 2DES ≈ $2^{57}$ (meet-in-the-middle). 3DES EDE ≈ 112 bits.
- AES: 128-bit block; 10/12/14 rounds; SubBytes, ShiftRows, MixColumns, AddRoundKey; no MixColumns in the last round.
- ECB leaks patterns. CBC $C_i = E(P_i \oplus C_{i-1})$. CTR $C_i = P_i \oplus E(\text{nonce} \parallel i)$, parallel.
- Use authenticated encryption: AES-GCM, ChaCha20-Poly1305, encrypt-then-MAC.

## [Public-key cryptography](/information-security/public-key-cryptography/)

- RSA: $n = pq$, $\varphi = (p-1)(q-1)$, $ed \equiv 1 \pmod{\varphi}$, $C = M^e$, $M = C^d \bmod n$. ($p = 17$, $q = 11$, $e = 7$, $d = 23$: $88 \to 11$.)
- DH: $A = g^a$, $B = g^b$, $s = g^{ab} \bmod p$ ($p = 23$, $g = 5$, $a = 6$, $b = 15$ → 2). Vulnerable to man-in-the-middle without authentication.
- ElGamal: $c_1 = g^k$, $c_2 = m y^k$. ECC 256 bits ≈ RSA 3072 bits ≈ 128-bit symmetric.

## [Hashes and signatures](/information-security/hashes-and-signatures/)

- Preimage, second-preimage, collision resistance; collisions in about $2^{n/2}$.
- MD5, SHA-1 broken; SHA-256, SHA-3 secure. Use HMAC, not $H(K \parallel m)$.
- Signature $s = H(m)^d$, verify $s^e = H(m)$. Only signatures give non-repudiation.
- X.509 certificates, chain to a root CA; revocation via CRL or OCSP. Passwords: salt + bcrypt/scrypt/Argon2.

## [System and web security](/information-security/system-and-web-security/)

- Factors: know, have, are. Kerberos: AS → TGT → TGS → service ticket.
- TLS 1.3: ECDHE, certificate, AEAD, forward secrecy. IPsec: AH vs ESP; transport vs tunnel.
- Firewalls: packet filter, stateful, proxy. IDS: signature vs anomaly.
- SQL injection → parameterised queries. XSS → escape output, CSP. CSRF → tokens, SameSite. Buffer overflow → canaries, NX, ASLR.

## Top viva questions

1. Explain the CIA triad with examples of attacks on each.
2. What is Kerckhoffs's principle?
3. Compare symmetric and asymmetric cryptography. Why are they combined?
4. Encrypt a word with Playfair, Vigenère or Hill.
5. Why is the one-time pad perfectly secure, and why is it rarely used?
6. Explain the Feistel structure and the DES round function.
7. Why is double DES not much stronger than DES?
8. Describe the AES round operations.
9. Why is ECB insecure? Compare CBC and CTR.
10. Generate RSA keys and encrypt a small message. Why does RSA work?
11. Explain Diffie–Hellman and the man-in-the-middle attack.
12. Compare a MAC and a digital signature.
13. How does a browser trust a website's certificate?
14. Explain SQL injection and XSS and how to prevent them.
