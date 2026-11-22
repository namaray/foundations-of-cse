---
title: IP Addressing and the Network Layer
description: IPv4 addresses, classful addressing, subnet masks, subnetting and VLSM worked examples, CIDR and route aggregation, the IPv4 header and fragmentation, NAT, ARP, DHCP, ICMP and IPv6.
sidebar:
  label: "6. IP addressing"
  order: 6
lesson:
  module: Network layer
  prerequisites:
    - label: Models and performance
      link: /computer-networks/network-models/
  outcomes:
    - Find the network address, broadcast address and host range from any IP address and prefix
    - Split a network into subnets, including variable-length subnets
    - Fragment a datagram for a smaller MTU
    - Explain what NAT, ARP and DHCP do
  keyIdea: >-
    An IPv4 address is 32 bits split into a **network part** and a **host part**; the prefix length (such as /24) says where the split is. Subnetting borrows host bits to make smaller networks, and each subnet loses two addresses to the network and broadcast addresses.
---

## 1. IPv4 addresses

An IPv4 address is **32 bits**, written as four decimal octets: `192.168.1.10`. It has two parts:

- **Network part:** identifies the network (all hosts on it share this).
- **Host part:** identifies the interface within that network.

The **prefix length** (CIDR notation, `/n`) or the **subnet mask** says how many leading bits are the network part.

| Prefix | Subnet mask | Hosts |
|---|---|---|
| /8 | 255.0.0.0 | $2^{24} - 2 = 16{,}777{,}214$ |
| /16 | 255.255.0.0 | $2^{16} - 2 = 65{,}534$ |
| /24 | 255.255.255.0 | 254 |
| /25 | 255.255.255.128 | 126 |
| /26 | 255.255.255.192 | 62 |
| /27 | 255.255.255.224 | 30 |
| /28 | 255.255.255.240 | 14 |
| /30 | 255.255.255.252 | 2 (point-to-point links) |

In each network, the address with **all host bits 0** is the **network address**, and the one with **all host bits 1** is the **broadcast address**. Neither can be given to a host, hence the $-2$.

## 2. Classful addressing (historical)

| Class | First octet | Default prefix | Use |
|---|---|---|---|
| A | 1–126 | /8 | Very large networks |
| B | 128–191 | /16 | Medium networks |
| C | 192–223 | /24 | Small networks |
| D | 224–239 | — | Multicast |
| E | 240–255 | — | Reserved |

`127.x.x.x` is **loopback**. Classes wasted addresses (an organisation needing 300 hosts had to take a whole class B with 65,534), so the Internet moved to classless **CIDR** in 1993. Exam questions still use the class names.

**Private ranges**, not routed on the Internet: `10.0.0.0/8`, `172.16.0.0/12` and `192.168.0.0/16`.

## 3. Finding the network, broadcast and host range

**Method:** the block size in the "interesting" octet (where the mask is neither 255 nor 0) is $256 - \text{mask octet}$. The network address is the largest multiple of the block size not above the address's octet.

**Worked example.** `172.16.45.200/20`.

- Mask: /20 = `255.255.240.0`. The interesting octet is the third; block size $256 - 240 = 16$.
- Multiples of 16 near 45: 32, 48. So the network's third octet is **32**.
- Network address: **172.16.32.0**
- Broadcast address: next network minus one = **172.16.47.255**
- Host range: **172.16.32.1 – 172.16.47.254**, giving $2^{12} - 2 = 4094$ hosts.

## 4. Subnetting

**Borrowing $s$ bits** from the host part makes $2^s$ subnets, each with $2^h - 2$ hosts where $h$ is the remaining host bits.

**Worked example.** Split `192.168.10.0/24` into 4 equal subnets.

- 4 subnets need $s = 2$ borrowed bits → /26, block size 64, 62 hosts each.

| Subnet | Network | First host | Last host | Broadcast |
|---|---|---|---|---|
| 1 | 192.168.10.0 | .1 | .62 | .63 |
| 2 | 192.168.10.64 | .65 | .126 | .127 |
| 3 | 192.168.10.128 | .129 | .190 | .191 |
| 4 | 192.168.10.192 | .193 | .254 | .255 |

### VLSM (variable-length subnet masks)

Give each subnet only the size it needs. **Allocate the largest first** so blocks line up.

**Worked example.** From `192.168.1.0/24`, make subnets for 100, 50 and 20 hosts.

| Needed | Smallest fit | Prefix | Allocated | Range |
|---|---|---|---|---|
| 100 | 126 hosts | /25 | 192.168.1.0/25 | .0 – .127 |
| 50 | 62 hosts | /26 | 192.168.1.128/26 | .128 – .191 |
| 20 | 30 hosts | /27 | 192.168.1.192/27 | .192 – .223 |
| — | spare | /27 | 192.168.1.224/27 | .224 – .255 |

## 5. CIDR and route aggregation

**CIDR** allows any prefix length. Consecutive blocks can be **aggregated** (summarised) into one route, which keeps routing tables small.

**Example.** `200.1.0.0/24`, `200.1.1.0/24`, `200.1.2.0/24` and `200.1.3.0/24` share their first 22 bits (the third octets 0–3 are `000000xx`), so they aggregate to **`200.1.0.0/22`**.

Routers forward using **longest prefix match**; see [Routing](/computer-networks/routing/#1-forwarding-and-longest-prefix-match).

## 6. The IPv4 header and fragmentation

The IPv4 header is at least **20 bytes**. Key fields: version, header length, total length, **identification, flags and fragment offset** (for fragmentation), **TTL** (decremented at each router; the packet is dropped at 0, which stops routing loops), **protocol** (6 = TCP, 17 = UDP), header checksum, and source and destination addresses.

**Fragmentation.** If a datagram is larger than the next link's **MTU**, it is split into fragments. Each fragment's data length must be a multiple of 8 bytes (except the last), and the **offset** is measured in 8-byte units. Fragments are reassembled only at the destination.

**Worked example.** A 4,000-byte datagram (20-byte header + 3,980 bytes of data) meets an MTU of 1,500.

- Each fragment can carry $1500 - 20 = 1480$ bytes of data (a multiple of 8).

| Fragment | Data bytes | Offset (÷ 8) | More-fragments flag |
|---|---|---|---|
| 1 | 1480 | 0 | 1 |
| 2 | 1480 | 185 | 1 |
| 3 | 1020 | 370 | 0 |

## 7. NAT, ARP, DHCP and ICMP

- **NAT (network address translation):** a home router gives devices private addresses and rewrites outgoing packets to use its one public address, tracking connections by **port** numbers. It saves IPv4 addresses but breaks the end-to-end principle (incoming connections need port forwarding).
- **ARP (address resolution protocol):** finds the **MAC address** for an IP address on the local network. A host broadcasts "Who has 192.168.1.1?"; the owner replies with its MAC, and the answer is cached.
- **DHCP:** gives a host its IP address, subnet mask, default gateway and DNS server automatically, in four messages: **D**iscover, **O**ffer, **R**equest, **A**cknowledge ("DORA"). Uses UDP ports 67 and 68.
- **ICMP:** error and diagnostic messages, such as "destination unreachable" and "time exceeded". `ping` uses ICMP echo; `traceroute` uses TTL expiry to discover each router on the path.

## 8. IPv6

IPv4's $2^{32} \approx 4.3$ billion addresses ran out. **IPv6** uses **128-bit** addresses, written as eight groups of four hex digits: `2001:0db8:0000:0000:0000:ff00:0042:8329`, shortened to `2001:db8::ff00:42:8329` (drop leading zeros, and replace one run of zero groups with `::`).

Other changes: a fixed 40-byte header with no checksum; **no fragmentation by routers** (only the source fragments, after path-MTU discovery); no broadcast (multicast and anycast instead); and built-in autoconfiguration. During the transition, IPv4 and IPv6 run side by side (dual stack) or IPv6 is tunnelled through IPv4.

## Summary

- An IPv4 address has 32 bits: network part plus host part, split by the prefix length.
- Hosts per subnet $= 2^h - 2$; the network and broadcast addresses are reserved.
- Block size $= 256 -$ mask octet; the network address is the multiple of the block size at or below the address.
- VLSM allocates the largest subnets first. CIDR aggregates consecutive blocks into one prefix.
- Fragment offsets count 8-byte units. NAT maps private addresses to one public one; ARP maps IP to MAC; DHCP assigns addresses.

## Check yourself

<details>
<summary>What are the network and broadcast addresses of 10.10.10.77/27?</summary>

/27 has block size 32 in the last octet. 77 lies in 64–95, so the network is 10.10.10.64 and the broadcast is 10.10.10.95.
</details>

<details>
<summary>How many /28 subnets fit in a /24, and how many hosts does each hold?</summary>

$2^{28-24} = 16$ subnets, each with $2^4 - 2 = 14$ hosts.
</details>

<details>
<summary>Why does an IPv6 router never fragment packets?</summary>

To simplify and speed up routers. The source discovers the path's smallest MTU and sends packets that fit; a router that receives a packet too large drops it and sends an ICMPv6 "packet too big" message.
</details>
