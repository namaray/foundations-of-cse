---
title: Network Security Basics
description: Security goals, common network attacks, symmetric and public-key encryption in brief, TLS, IPsec and VPNs, firewalls and intrusion detection.
sidebar:
  label: "11. Network security"
  order: 11
lesson:
  module: Application layer
  outcomes:
    - Name the security goals and the attack that threatens each one
    - Outline how TLS secures an HTTPS connection
    - Compare packet-filtering, stateful and application-level firewalls
  keyIdea: >-
    Networks were built to be open, so security is added on top. **Encryption** gives confidentiality, **hashes and signatures** give integrity and authentication, and **TLS** combines them to protect web traffic. **Firewalls** and **intrusion detection** control and watch what crosses the network edge.
---

This is an overview for the networks course. The cryptography is covered in depth in [Cryptography & Security](/information-security/).

## 1. Security goals

| Goal | Meaning | Threat |
|---|---|---|
| **Confidentiality** | Only the intended parties can read the data | Eavesdropping (sniffing) |
| **Integrity** | Data is not altered in transit | Tampering, man-in-the-middle |
| **Authentication** | You know who you are talking to | Spoofing, impersonation |
| **Availability** | The service stays usable | Denial of service |
| Non-repudiation | A sender cannot deny sending | False denial |

## 2. Common attacks

- **Sniffing:** capturing packets on a shared or wireless network. Defence: encryption.
- **Spoofing:** forging a source IP or MAC address. **ARP spoofing** tricks hosts into sending traffic through the attacker.
- **Man-in-the-middle:** the attacker relays and possibly alters traffic between two parties. Defence: authenticated encryption with certificates.
- **Denial of service (DoS)** floods a target so legitimate users cannot reach it; **distributed DoS** (DDoS) uses many compromised machines (a botnet). Examples: SYN floods, UDP floods.
- **Phishing:** fake websites or emails that trick users into revealing passwords.
- **DNS spoofing (cache poisoning):** inserting false records so a name leads to the attacker's server. Defence: DNSSEC.

## 3. Cryptography in one table

| Tool | Gives | Examples |
|---|---|---|
| **Symmetric encryption** (one shared key) | Confidentiality, fast | AES |
| **Public-key encryption** (public/private key pair) | Key exchange; confidentiality without a shared secret, slow | RSA, Diffie–Hellman, elliptic curves |
| **Hash function** | Fixed-size fingerprint for integrity | SHA-256 |
| **MAC** (hash with a shared key) | Integrity and authentication | HMAC |
| **Digital signature** (hash signed with a private key) | Integrity, authentication, non-repudiation | RSA, ECDSA signatures |
| **Certificate** | Binds a public key to an identity, signed by a certificate authority | X.509 certificates |

Real protocols use public-key cryptography to **agree on a symmetric key**, then switch to fast symmetric encryption for the data.

## 4. TLS and HTTPS

**TLS** (Transport Layer Security) sits between TCP and the application. HTTPS is HTTP over TLS.

1. **Hello:** the client and server agree on a protocol version and cipher suite and exchange random numbers.
2. **Authentication:** the server sends its **certificate**; the client checks it was signed by a trusted certificate authority and matches the domain name.
3. **Key exchange:** the two sides agree on a shared secret, usually with (elliptic-curve) Diffie–Hellman, which gives **forward secrecy**: stealing the server's key later does not reveal past sessions.
4. **Session keys** derived from the secret encrypt and authenticate all further data with symmetric cryptography.

## 5. IPsec and VPNs

**IPsec** secures traffic at the network layer, protecting every packet regardless of application. A **VPN** (virtual private network) uses IPsec (or TLS-based protocols such as WireGuard and OpenVPN) to create an encrypted tunnel over the public Internet, so a remote worker appears to be on the office network.

## 6. Firewalls and intrusion detection

A **firewall** controls traffic between a trusted network and the outside.

| Type | Decides using | Pros and cons |
|---|---|---|
| **Packet filter** (stateless) | Each packet's header alone: addresses, ports, protocol | Fast; cannot tell whether a packet belongs to a legitimate connection |
| **Stateful** | Header plus the state of the connection it belongs to | Allows replies to outgoing connections automatically |
| **Application gateway** (proxy) | The application data itself (for example, HTTP requests) | Fine-grained control; slower; one per application |

A **DMZ** is a separate network segment for public-facing servers (web, mail), so a compromise there does not expose the internal network.

An **intrusion detection system (IDS)** watches traffic for attacks, using **signatures** of known attacks or **anomalies** compared with normal behaviour, and raises alerts. An **intrusion prevention system (IPS)** also blocks them.

## Summary

- Security goals: confidentiality, integrity, authentication, availability (and non-repudiation).
- Symmetric encryption is fast; public-key cryptography solves key exchange and enables signatures.
- TLS authenticates the server with a certificate, agrees on keys with Diffie–Hellman, then encrypts with symmetric keys.
- Firewalls range from stateless packet filters to stateful filters to application proxies; IDSs detect attacks.

## Check yourself

<details>
<summary>Why don't protocols use public-key encryption for all the data?</summary>

It is thousands of times slower than symmetric encryption. Public-key cryptography is used only to authenticate and agree on a symmetric session key.
</details>

<details>
<summary>What can a stateful firewall do that a stateless packet filter cannot?</summary>

It tracks connections, so it can allow incoming packets only when they belong to a connection started from inside, rather than opening fixed port ranges to everyone.
</details>

<details>
<summary>What is forward secrecy?</summary>

If a server's long-term private key is stolen later, past recorded sessions still cannot be decrypted, because each session used a temporary Diffie–Hellman key that was discarded.
</details>
