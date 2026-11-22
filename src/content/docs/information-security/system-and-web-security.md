---
title: System, Network and Web Security
description: Authentication factors, challenge–response and Kerberos, TLS 1.3 and HTTPS, IPsec (AH, ESP, transport and tunnel modes) and VPNs, firewalls and intrusion detection, malware, buffer overflows, denial of service, and web attacks (SQL injection, XSS, CSRF) with their defences.
sidebar:
  label: "7. System and web security"
  order: 7
lesson:
  module: Security in practice
  prerequisites:
    - label: Hashes, MACs and signatures
      link: /information-security/hashes-and-signatures/
    - label: Network security overview
      link: /computer-networks/network-security/
  outcomes:
    - Compare authentication factors and explain how Kerberos works
    - Describe how TLS establishes a secure channel and compare IPsec modes
    - Compare firewall types and signature-based and anomaly-based intrusion detection
    - Explain SQL injection, XSS, CSRF and buffer overflows, and how to prevent each
  keyIdea: >-
    Real systems combine the primitives: **TLS** uses certificates, ECDHE and AES-GCM to build a secure channel; **Kerberos** uses tickets so passwords never cross the network. Most real breaches, though, exploit **software flaws** (injection, XSS, buffer overflows) or **people** (phishing), so input validation, least privilege and defence in depth matter as much as strong ciphers.
---

## 1. Authentication

**Factors:**

| Factor | Examples |
|---|---|
| Something you **know** | Password, PIN |
| Something you **have** | Phone (one-time codes), hardware key, smart card |
| Something you **are** | Fingerprint, face, iris |

**Multi-factor authentication (MFA)** combines factors from **different** categories (two passwords is still one factor). **Passkeys** / FIDO2 use a public-key pair per site: the private key never leaves the device, so there is nothing to phish or leak from the server.

**Challenge–response:** the server sends a random **nonce**; the client returns a function of it and the secret (such as an HMAC). The secret never crosses the network, and a recorded response is useless later, which defeats **replay** attacks.

**Kerberos** (single sign-on in Windows domains and university networks) uses a trusted third party, the **Key Distribution Centre** (KDC), made up of an Authentication Server (AS) and a Ticket-Granting Server (TGS):

1. The client authenticates to the **AS** and receives a **ticket-granting ticket** (TGT), encrypted so that only the client's password-derived key unlocks the session key inside.
2. To use a service, the client presents the TGT to the **TGS** and receives a **service ticket**.
3. The client presents the service ticket to the **service**, which verifies it.

The password is never sent over the network; tickets expire, and timestamps prevent replay (so clocks must be synchronised).

## 2. TLS and HTTPS

**TLS** (Transport Layer Security; its predecessor was SSL) secures a TCP connection; **HTTPS** is HTTP over TLS. It provides confidentiality, integrity and server authentication (and optionally client authentication).

**TLS 1.3 handshake** (one round trip):

1. **ClientHello:** supported cipher suites, a random value, and an ECDHE **key share**.
2. **ServerHello:** the chosen suite and the server's key share. Both sides can now derive the session keys; everything after this is encrypted.
3. The server sends its **certificate** and a **signature** over the handshake (proving it owns the certificate's private key), then **Finished** (a MAC over the whole handshake).
4. The client verifies the certificate chain and signature, sends **Finished**, and application data flows, encrypted with an AEAD cipher (AES-GCM or ChaCha20-Poly1305).

TLS 1.3 removed older weak options (RSA key transport, CBC suites, RC4, SHA-1), so every connection has **forward secrecy**.

## 3. IPsec and VPNs

**IPsec** secures traffic at the **network layer**, protecting all IP traffic between two hosts or networks.

| Protocol | Provides |
|---|---|
| **AH** (Authentication Header) | Integrity and authentication of the packet, including most of the IP header; **no encryption** |
| **ESP** (Encapsulating Security Payload) | **Encryption** plus integrity of the payload (the common choice) |

| Mode | Protects | Use |
|---|---|---|
| **Transport** | The payload only; the original IP header stays | Host to host |
| **Tunnel** | The **entire original packet**, wrapped in a new IP header | Gateway to gateway: **site-to-site VPNs** |

Keys are negotiated with **IKE** (Internet Key Exchange). A **VPN** creates an encrypted tunnel over the internet, using IPsec, TLS (OpenVPN) or WireGuard.

## 4. Firewalls and intrusion detection

| Firewall type | Decides using | Notes |
|---|---|---|
| **Packet filter** (stateless) | Each packet's IP addresses, ports and protocol | Fast, but no context; easily fooled |
| **Stateful inspection** | Packets plus the **connection state** table | Allows replies to connections opened from inside |
| **Application-level gateway** (proxy) | The application protocol's content | Can filter commands and content; slower |
| Next-generation / WAF | Deep packet inspection, application identity; web-attack patterns | A **web application firewall** blocks attacks such as SQL injection |

A **DMZ** (demilitarised zone) is a separate network segment for public-facing servers, firewalled from both the internet and the internal network.

**Intrusion detection systems (IDS):**

| | **Signature-based** (misuse) | **Anomaly-based** |
|---|---|---|
| Detects | Known attack patterns | Deviations from normal behaviour |
| Strength | Few false positives | Can catch **new** (zero-day) attacks |
| Weakness | Misses new attacks | More **false positives** |

An **IPS** (intrusion prevention system) also blocks what it detects. Host-based (HIDS) and network-based (NIDS) variants exist. **Honeypots** are decoy systems that attract attackers.

## 5. Malware and system attacks

| Malware | Characteristic |
|---|---|
| **Virus** | Attaches to a host file; spreads when the file is run |
| **Worm** | **Self-propagating** across networks, with no host file or user action needed |
| **Trojan horse** | Appears useful but hides malicious functions |
| **Ransomware** | Encrypts the victim's files and demands payment |
| Rootkit | Hides itself and other malware deep in the system |
| Spyware / keylogger | Secretly collects information |
| Botnet | Many compromised machines under remote control (often used for DDoS) |

**Buffer overflow:** a program writes past the end of a buffer (for example C's `gets` or `strcpy` with no length check), overwriting adjacent memory such as the function's **return address** on the stack, so the attacker can redirect execution to their own code. Defences: bounds-checked functions and memory-safe languages, **stack canaries**, **non-executable stacks** (NX/DEP), and **ASLR** (address space layout randomisation).

**Denial of service (DoS)** exhausts a resource. A **SYN flood** sends many TCP SYNs without completing the handshake, filling the server's half-open connection table (defence: **SYN cookies**). **DDoS** uses a botnet; **amplification** attacks spoof the victim's address in small requests that produce large replies (DNS, NTP).

**Social engineering:** **phishing** (fake emails or sites that steal credentials), spear phishing (targeted), pretexting. Often the easiest way in.

## 6. Web attacks

**SQL injection:** user input is pasted into an SQL query and changes its meaning.

```sql
-- query built by string concatenation:
SELECT * FROM users WHERE name = '<input>' AND pass = '<input>';
-- attacker enters  ' OR '1'='1' --  as the name, giving:
SELECT * FROM users WHERE name = '' OR '1'='1' --' AND pass = '...';
```

`--` starts an SQL comment, so the password check disappears and `'1'='1'` makes the condition true for every row, logging the attacker in without a password. **Defence: parameterised queries** (prepared statements), which send the input separately from the SQL so it can never become code; plus least-privilege database accounts.

**Cross-site scripting (XSS):** the attacker gets their JavaScript to run in other users' browsers on a trusted site, where it can steal session cookies or act as the user.

- **Stored:** the script is saved on the server (for example in a comment) and served to every visitor.
- **Reflected:** the script is in a link's parameter and echoed back in the response.
- **DOM-based:** client-side JavaScript inserts untrusted data into the page.

**Defence:** **escape output** for its context (HTML, attribute, JavaScript), validate input, a **Content Security Policy** (CSP), and `HttpOnly` cookies (unreadable by scripts).

**Cross-site request forgery (CSRF):** a malicious site makes the victim's browser send a request to a site where they are logged in (for example, a hidden form that transfers money); the browser attaches the session cookie automatically. **Defence:** unpredictable **anti-CSRF tokens** in forms, `SameSite` cookies, and re-authentication for sensitive actions.

The **OWASP Top 10** lists the most critical web risks, including broken access control, cryptographic failures, injection, insecure design and security misconfiguration.

## 7. Principles

- **Defence in depth:** multiple independent layers, so one failure isn't fatal.
- **Least privilege:** the minimum access needed.
- **Fail securely:** errors should deny access, not grant it.
- **Complete mediation:** check every access, every time.
- **Keep it simple**, and don't rely on obscurity (Kerckhoffs).
- **Patch** promptly; most attacks exploit known, already-fixed vulnerabilities.

## Summary

- Factors: know, have, are; MFA uses different categories. Challenge–response defeats replay. Kerberos: AS → TGT → TGS → service ticket; no password on the wire.
- TLS 1.3: ECDHE key share, certificate + signature, Finished MACs, AEAD; forward secrecy.
- IPsec: AH (integrity only) vs ESP (encryption); transport (payload) vs tunnel (whole packet, VPNs).
- Firewalls: packet filter, stateful, application proxy. IDS: signature (known attacks) vs anomaly (new attacks, more false alarms).
- Buffer overflow → canaries, NX, ASLR. SQL injection → parameterised queries. XSS → output escaping, CSP. CSRF → tokens, SameSite.

## Check yourself

<details>
<summary>Is a password plus a security question multi-factor authentication?</summary>

No. Both are something you know, so it is still single-factor.
</details>

<details>
<summary>Which IPsec mode would connect two office networks over the internet, and why?</summary>

Tunnel mode (with ESP), because it encrypts the entire original packet, including the internal addresses, and wraps it in a new header between the two gateways.
</details>

<details>
<summary>Why do parameterised queries prevent SQL injection while escaping by hand is risky?</summary>

With parameters, the database receives the query structure and the data separately, so input is always treated as a value and can never change the query. Hand escaping is easy to get wrong or forget in one place.
</details>
