---
title: Security Fundamentals
description: The CIA triad and other security goals, threats, vulnerabilities and risk, passive and active attacks, security services and mechanisms, Kerckhoffs's principle, cryptanalysis attack models, symmetric versus public-key cryptography, and access control models (DAC, MAC, RBAC, Bell–LaPadula, Biba).
sidebar:
  label: "1. Fundamentals"
  order: 1
lesson:
  module: Foundations
  outcomes:
    - Define confidentiality, integrity, availability and related security goals
    - Classify attacks as passive or active and name examples of each
    - State Kerckhoffs's principle and the four cryptanalysis attack models
    - Compare DAC, MAC and RBAC, and state the Bell–LaPadula and Biba rules
  keyIdea: >-
    Security protects **confidentiality**, **integrity** and **availability** (the CIA triad) against attackers who may only listen (**passive**) or also modify, replay and disrupt (**active**). Good cryptography assumes the attacker knows everything except the **key** (Kerckhoffs's principle).
---

## 1. Security goals

| Goal | Meaning | Threatened by | Typical mechanism |
|---|---|---|---|
| **Confidentiality** | Only authorised parties can read data | Eavesdropping, data leaks | Encryption, access control |
| **Integrity** | Data isn't changed without detection | Tampering, malware | Hashes, MACs, signatures |
| **Availability** | Systems and data are usable when needed | Denial of service, ransomware | Redundancy, rate limiting, backups |
| Authentication | Parties are who they claim to be | Spoofing, impersonation | Passwords, certificates, MFA |
| **Non-repudiation** | A sender can't deny having sent a message | False denial | **Digital signatures** |
| Accountability | Actions can be traced to whoever did them | — | Logging, auditing |

**Terms:**

- **Vulnerability:** a weakness (a bug, a weak password, a misconfiguration).
- **Threat:** a potential cause of harm that could exploit a vulnerability.
- **Attack:** an actual attempt to exploit it.
- **Risk** ≈ likelihood × impact. Security is about managing risk, not eliminating it.

## 2. Passive and active attacks

| | **Passive** | **Active** |
|---|---|---|
| What the attacker does | Observes only | Modifies, injects or blocks |
| Examples | **Eavesdropping** (release of message contents), **traffic analysis** (who talks to whom, when, how much) | **Masquerade** (impersonation), **replay** (resend a captured message), **modification**, **denial of service** |
| Hard to… | **Detect** (nothing changes), so the defence is prevention (encryption) | **Prevent** completely, so the defence is detection and recovery |

The ITU-T **X.800** standard lists the security **services** (authentication, access control, confidentiality, integrity, non-repudiation) and the **mechanisms** that provide them (encipherment, digital signatures, access control, data integrity, authentication exchange, traffic padding, routing control, notarisation).

## 3. Cryptography basics

- **Plaintext** $P$ is encrypted with a **key** $K$ into **ciphertext** $C = E_K(P)$; decryption recovers $P = D_K(C)$.
- **Cryptography** designs ciphers; **cryptanalysis** breaks them; together they are **cryptology**.

**Kerckhoffs's principle:** a cryptosystem should be secure even if **everything except the key** is public. Security through obscurity (a secret algorithm) fails once the algorithm leaks; public algorithms such as AES are trusted precisely because they have survived years of public analysis.

| | **Symmetric** (secret key) | **Asymmetric** (public key) |
|---|---|---|
| Keys | One shared secret key | A key pair: public key (shared) + private key (secret) |
| Speed | Fast (hundreds to thousands of times faster) | Slow |
| Key distribution | Hard: the key must be shared secretly in advance | Easy: publish the public key |
| Keys for $n$ users | $n(n-1)/2$ | $2n$ |
| Examples | DES, AES, ChaCha20 | RSA, Diffie–Hellman, ECC |
| Used for | Bulk data encryption | Key exchange, signatures |

In practice they are combined (**hybrid encryption**): public-key cryptography exchanges a fresh symmetric key, which then encrypts the data. TLS works this way.

## 4. Cryptanalysis

**Attack models**, from weakest attacker to strongest:

| Model | The attacker has |
|---|---|
| **Ciphertext-only** | Only ciphertexts |
| **Known-plaintext** | Some plaintext–ciphertext pairs |
| **Chosen-plaintext** | The ability to encrypt plaintexts of their choice |
| **Chosen-ciphertext** | The ability to decrypt ciphertexts of their choice (except the target) |

Modern ciphers must resist all four.

**Brute force** tries every key. A 56-bit key has $2^{56} \approx 7.2 \times 10^{16}$ possibilities: at $10^9$ keys per second, about 2.3 years, and far less with special hardware (DES was broken in days in 1998). A 128-bit key has $2^{128} \approx 3.4 \times 10^{38}$, which is out of reach.

- **Unconditionally secure:** unbreakable even with unlimited computing power. Only the **one-time pad** achieves this.
- **Computationally secure:** breaking it costs more than the information is worth, or takes longer than its useful life. All practical ciphers aim for this.

## 5. Access control models

| Model | Who decides access | Example |
|---|---|---|
| **DAC** (discretionary) | The resource's **owner** | Unix file permissions, sharing a Google Doc |
| **MAC** (mandatory) | A central **policy** using security labels; users can't override it | Military classification (Top Secret, Secret…), SELinux |
| **RBAC** (role-based) | Permissions attach to **roles**; users are assigned roles | "Nurse", "Doctor", "Admin" in a hospital system |
| ABAC (attribute-based) | Rules over attributes of user, resource and context | "Managers may view reports during office hours" |

**Bell–LaPadula** (confidentiality, used in MAC):

- **No read up** (simple security property): a subject can't read data above its clearance.
- **No write down** (★-property): a subject can't write data to a lower level, so secrets can't leak downwards.

**Biba** (integrity) is the mirror image: **no read down, no write up**, so trusted data isn't contaminated by less trustworthy sources.

Implementation structures: an **access control matrix** (subjects × objects); stored by column it becomes **access control lists** (per object), and by row **capability lists** (per subject).

**Principle of least privilege:** give each user and program only the access it needs.

## Summary

- CIA: confidentiality, integrity, availability; plus authentication and non-repudiation (signatures).
- Passive attacks (eavesdropping, traffic analysis) are hard to detect, so prevent them; active attacks (masquerade, replay, modification, DoS) are hard to prevent, so detect them.
- Kerckhoffs: only the key is secret. Symmetric is fast; public-key solves key distribution; combine them.
- Attack models: ciphertext-only < known-plaintext < chosen-plaintext < chosen-ciphertext.
- DAC (owner), MAC (labels and policy), RBAC (roles). Bell–LaPadula: no read up, no write down. Biba: no read down, no write up.

## Check yourself

<details>
<summary>Which security goal does a DDoS attack target?</summary>

Availability.
</details>

<details>
<summary>How many keys are needed for 100 users to communicate pairwise with symmetric encryption, and with public-key encryption?</summary>

Symmetric: $100 \times 99/2 = 4950$ shared keys. Public-key: 100 key pairs (200 keys).
</details>

<details>
<summary>Under Bell–LaPadula, can a Secret-cleared user write to a Confidential file?</summary>

No: that would be writing down, which could leak Secret information to a lower level.
</details>
