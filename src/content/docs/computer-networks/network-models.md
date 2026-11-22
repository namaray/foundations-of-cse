---
title: Network Models and Performance
description: The OSI and TCP/IP models, encapsulation, circuit vs packet switching, and the four kinds of delay, throughput and the bandwidth–delay product.
sidebar:
  label: "1. Models and performance"
  order: 1
lesson:
  module: Foundations
  outcomes:
    - Name the layers of the OSI and TCP/IP models and what each one does
    - Explain encapsulation and the name of the data unit at each layer
    - Compute transmission, propagation and total delay
    - Compare circuit switching with packet switching
  keyIdea: >-
    Networks are built in **layers**, each using the service of the one below and hiding its details from the one above. Data is **encapsulated** with a header at each layer on the way down and unwrapped on the way up. Performance comes down to delay (transmission plus propagation plus queuing) and throughput.
---

## 1. Why layers?

Networking is complicated: signals, error recovery, routing across the world, reliable delivery, applications. Splitting it into **layers** means each layer solves one problem, uses only the layer below, and can be changed without affecting the others. A **protocol** is the set of rules two peers at the same layer follow.

## 2. The OSI and TCP/IP models

| # | OSI layer | Job | TCP/IP layer | Data unit | Examples | Device |
|---|---|---|---|---|---|---|
| 7 | Application | Services for users | Application | Message | HTTP, DNS, SMTP | |
| 6 | Presentation | Encoding, encryption, compression | Application | | TLS, JPEG | |
| 5 | Session | Dialogue control, checkpoints | Application | | | |
| 4 | Transport | Process-to-process delivery, reliability | Transport | **Segment** (TCP), datagram (UDP) | TCP, UDP | |
| 3 | Network | Host-to-host delivery across networks, routing | Internet | **Packet** (datagram) | IP, ICMP | Router |
| 2 | Data link | Delivery to the next node, framing, error detection | Link | **Frame** | Ethernet, Wi-Fi | Switch |
| 1 | Physical | Bits as signals on a medium | Link | **Bit** | cables, radio | Hub, repeater |

A memory aid for OSI from the bottom: **P**lease **D**o **N**ot **T**hrow **S**ausage **P**izza **A**way.

The **TCP/IP model** is what the Internet actually uses. It merges OSI's top three layers into one application layer and its bottom two into a link layer.

## 3. Encapsulation

On the way **down**, each layer adds its own header (and the link layer also adds a trailer):

```text
Application   [              data              ]                 message
Transport     [TCP hdr][          data          ]                segment
Network       [IP hdr][TCP hdr][      data      ]                packet
Link          [Eth hdr][IP hdr][TCP hdr][ data ][Eth trailer]    frame
Physical      0110100101110...                                   bits
```

On the way **up**, each layer strips its header and passes the rest upward. A router only unwraps up to the network layer; a switch only up to the link layer.

## 4. Circuit vs packet switching

| | Circuit switching | Packet switching |
|---|---|---|
| Setup | A dedicated path is reserved first | None: each packet is sent independently |
| Resources | Reserved for the whole call, even when idle | Shared on demand |
| Delay | Constant after setup | Variable (queuing) |
| Efficiency for bursty traffic | Poor | Good |
| Example | Traditional telephone network | The Internet |

Packet switching wins for data because data traffic is **bursty**: links are shared statistically instead of sitting idle.

## 5. Delay

A packet crossing one link experiences four delays:

| Delay | Cause | Formula |
|---|---|---|
| **Transmission** | Pushing all the bits onto the link | $L / R$ (packet length ÷ link rate) |
| **Propagation** | Bits travelling the length of the link | $d / s$ (distance ÷ signal speed, about $2 \times 10^8$ m/s in cable) |
| Queuing | Waiting behind other packets at a router | Depends on traffic |
| Processing | Checking headers, choosing the output link | Usually microseconds |

**Worked example.** A 1,000-byte packet on a 1 Mbps link that is 2,000 km long:

- Transmission: $8000 \text{ bits} / 10^6 \text{ bps} = 8$ ms
- Propagation: $2 \times 10^6 \text{ m} / (2 \times 10^8 \text{ m/s}) = 10$ ms
- Total (ignoring queuing and processing): **18 ms**

:::tip[Don't mix them up]
Transmission delay depends on the **packet size and link rate**, not the distance. Propagation delay depends on the **distance**, not the packet size.
:::

Across $N$ links with store-and-forward (each router receives the whole packet before forwarding it), the transmission delay is paid $N$ times: end-to-end delay $\approx N \cdot L/R$ plus the propagation delays.

## 6. Throughput and the bandwidth–delay product

- **Throughput** is the rate at which data actually arrives. End to end, it is limited by the slowest link, the **bottleneck**.
- The **bandwidth–delay product** $R \times \text{propagation delay}$ is how many bits are "in flight" on the link at once. A 100 Mbps link with 20 ms one-way delay holds $10^8 \times 0.02 = 2 \times 10^6$ bits. This number matters for sliding windows and TCP.

## Summary

- OSI has 7 layers; TCP/IP has 4 or 5. Data units: message, segment, packet, frame, bit.
- Encapsulation adds a header at each layer going down; each layer removes its own going up.
- The Internet is packet switched, sharing links on demand.
- Transmission delay $= L/R$, propagation delay $= d/s$; the bottleneck link limits throughput.

## Check yourself

<details>
<summary>At which layers do a switch and a router operate?</summary>

A switch works at the data link layer (layer 2), forwarding frames by MAC address. A router works at the network layer (layer 3), forwarding packets by IP address.
</details>

<details>
<summary>Doubling the link rate halves which delay?</summary>

Transmission delay ($L/R$). Propagation delay is unchanged, since it depends only on distance and signal speed.
</details>

<details>
<summary>A file goes through links of 10 Mbps, 2 Mbps and 100 Mbps. What is the end-to-end throughput?</summary>

2 Mbps, the bottleneck link.
</details>
