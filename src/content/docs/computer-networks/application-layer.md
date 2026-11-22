---
title: Application Layer
description: Client–server and peer-to-peer architectures, DNS resolution and record types, HTTP methods, status codes, persistent connections and cookies, email with SMTP, POP3 and IMAP, FTP, DHCP and common port numbers.
sidebar:
  label: "10. Application layer"
  order: 10
lesson:
  module: Application layer
  prerequisites:
    - label: UDP and TCP
      link: /computer-networks/transport-layer/
  outcomes:
    - Trace how a domain name is resolved by DNS
    - Explain HTTP requests, responses, status codes and persistent connections
    - Compute page load time for persistent and non-persistent HTTP
    - Explain the roles of SMTP, POP3 and IMAP
  keyIdea: >-
    Applications run on end hosts and talk through the transport layer. **DNS** turns names into IP addresses through a hierarchy of servers and caches. **HTTP** fetches web objects with stateless request/response messages; **persistent connections** reuse one TCP connection to save round trips.
---

## 1. Architectures

- **Client–server:** an always-on server with a fixed address serves many clients (the web, email). Simple to manage, but the server can become a bottleneck.
- **Peer-to-peer (P2P):** peers act as both clients and servers and share resources directly (BitTorrent). It scales naturally, since every new peer adds capacity, but is harder to manage and secure.

## 2. DNS

The **Domain Name System** maps names like `www.example.com` to IP addresses. It is a **distributed, hierarchical database**:

- **Root servers** know where the top-level-domain servers are.
- **TLD servers** (`.com`, `.org`, `.bd`) know the authoritative servers for each domain.
- **Authoritative servers** hold the actual records for a domain.
- A **local DNS server** (run by your ISP or organisation) does the lookups for its clients and **caches** the answers.

**Resolving `www.example.com`:**

```text
Host ──(1) query──▶ Local DNS server
                       │ (2) ──▶ Root server:          "ask the .com TLD server"
                       │ (3) ──▶ .com TLD server:      "ask example.com's authoritative server"
                       │ (4) ──▶ Authoritative server: "www.example.com = 93.184.216.34"
Host ◀──(5) answer──── Local DNS server (caches the answer for its TTL)
```

The host's query to its local server is **recursive** ("get me the answer"); the local server's queries to the others are usually **iterative** ("tell me who to ask next").

| Record | Maps |
|---|---|
| A | name → IPv4 address |
| AAAA | name → IPv6 address |
| CNAME | alias → canonical name |
| MX | domain → mail server |
| NS | domain → authoritative name server |

DNS mostly uses **UDP port 53** (TCP for large responses and zone transfers).

## 3. HTTP

**HTTP** fetches web pages. A page is a base HTML file plus referenced **objects** (images, scripts, style sheets), each with its own URL. HTTP runs over TCP (port 80, or 443 for HTTPS) and is **stateless**: the server remembers nothing between requests.

**Request:**

```text
GET /index.html HTTP/1.1
Host: www.example.com
User-Agent: Mozilla/5.0
Accept-Language: en
```

**Response:**

```text
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 3120

<html> ...
```

| Method | Purpose |
|---|---|
| GET | Fetch a resource |
| POST | Send data (forms, uploads) |
| PUT / PATCH | Replace / modify a resource |
| DELETE | Remove a resource |
| HEAD | Like GET, but headers only |

| Status | Meaning |
|---|---|
| 1xx | Informational |
| 2xx Success | 200 OK, 201 Created |
| 3xx Redirection | 301 Moved Permanently, 304 Not Modified |
| 4xx Client error | 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found |
| 5xx Server error | 500 Internal Server Error, 503 Service Unavailable |

### Persistent vs non-persistent connections

- **Non-persistent (HTTP/1.0):** a new TCP connection for **every** object. Each object costs **2 RTTs** (one for the TCP handshake, one for the request and response) plus its transmission time.
- **Persistent (HTTP/1.1 default):** one connection carries many objects. After the first, each object costs about **1 RTT**, or less with pipelining.

**Example.** A page with a base file and 10 images, RTT = 50 ms, transmission time ignored:

- Non-persistent, one at a time: $11 \times 2 \times 50 = 1100$ ms.
- Persistent without pipelining: $2 \times 50 + 10 \times 50 = 600$ ms.
- Persistent with pipelining (all 10 requests sent at once): $2 \times 50 + 50 = 150$ ms.

**HTTP/2** multiplexes many requests over one connection with binary framing; **HTTP/3** runs over **QUIC** (on UDP) to avoid TCP's head-of-line blocking.

### Cookies and caching

- **Cookies** give stateless HTTP a memory: the server sends `Set-Cookie`, and the browser returns the cookie with later requests. Used for logins, shopping carts and tracking.
- **Web caches (proxies)** store recently fetched objects close to users. A **conditional GET** (`If-Modified-Since`) lets the cache check freshness; the server replies `304 Not Modified` without resending the object.

## 4. Email

| Protocol | Role | Port |
|---|---|---|
| **SMTP** | **Push** mail from the sender's client to its server, and between mail servers | 25 (587 for clients) |
| POP3 | **Pull** mail to one device, usually deleting it from the server | 110 |
| **IMAP** | Access mail kept **on the server**, with folders synced across devices | 143 |

Webmail uses HTTP between the browser and the mail server, and SMTP between mail servers.

## 5. Other protocols and well-known ports

- **FTP** transfers files using **two** connections: control (port 21) and data (port 20). Commands are sent **out of band** on the control connection.
- **DHCP** assigns IP configuration (see [IP addressing](/computer-networks/ip-addressing/#7-nat-arp-dhcp-and-icmp)).
- **SSH** gives encrypted remote login; **Telnet** is the old unencrypted version.

| Port | Service | Transport |
|---|---|---|
| 20, 21 | FTP data, control | TCP |
| 22 | SSH | TCP |
| 23 | Telnet | TCP |
| 25 | SMTP | TCP |
| 53 | DNS | UDP (and TCP) |
| 67, 68 | DHCP server, client | UDP |
| 80 | HTTP | TCP |
| 110 | POP3 | TCP |
| 143 | IMAP | TCP |
| 443 | HTTPS | TCP (QUIC uses UDP) |

## Summary

- DNS is a hierarchy (root → TLD → authoritative) with caching; the host's query is recursive, the local server's queries iterative.
- HTTP is stateless request/response over TCP; cookies add state.
- Non-persistent HTTP costs 2 RTTs per object; persistent connections save the repeated handshakes.
- SMTP pushes mail; POP3 and IMAP pull it, with IMAP keeping it on the server.

## Check yourself

<details>
<summary>What does a 304 status code mean, and why is it useful?</summary>

"Not Modified": the cached copy is still current, so the server sends headers only. It saves bandwidth and time.
</details>

<details>
<summary>Why does FTP use two connections?</summary>

The control connection stays open for commands for the whole session, while a separate data connection is opened for each file transfer or directory listing. This separates commands from data ("out-of-band" control).
</details>

<details>
<summary>Why is DNS caching important?</summary>

Most lookups are answered from a nearby cache instead of querying root, TLD and authoritative servers each time. That cuts delay and keeps the load on root servers manageable.
</details>
