---
title: Medium Access Control and Ethernet
description: Multiple access, pure and slotted ALOHA efficiency, CSMA, CSMA/CD and the minimum frame size, CSMA/CA in Wi-Fi, Ethernet frames and MAC addresses, switches and VLANs.
sidebar:
  label: "5. Medium access and Ethernet"
  order: 5
lesson:
  module: Physical and data link layers
  prerequisites:
    - label: Framing and error control
      link: /computer-networks/error-control/
  outcomes:
    - Compute the throughput of pure and slotted ALOHA
    - Derive the minimum frame size for CSMA/CD
    - Explain why Wi-Fi uses collision avoidance instead of collision detection
    - Describe how a switch learns where hosts are
  keyIdea: >-
    When many stations share one channel, they need rules for who transmits. **ALOHA** just sends and retries, reaching at most 18% or 37% efficiency. **CSMA/CD** listens first and stops on a collision, which requires frames long enough to still be sending when a collision echoes back. Wi-Fi cannot detect collisions, so it **avoids** them with CSMA/CA.
---

## 1. The multiple-access problem

On a **broadcast** link (a shared cable or a radio channel), if two stations transmit at once their signals **collide** and both frames are lost. **Medium access control (MAC)** protocols decide who may send.

| Family | Idea | Examples |
|---|---|---|
| Channel partitioning | Divide the channel into pieces | FDMA, TDMA, CDMA |
| **Random access** | Send when you like; recover from collisions | ALOHA, CSMA/CD, CSMA/CA |
| Taking turns | Pass permission around | Polling, token passing |

## 2. ALOHA

**Pure ALOHA:** send whenever you have a frame; if it collides, wait a random time and resend. A frame is vulnerable to collision for **two** frame times (any frame started up to one frame time before or after it overlaps it).

**Slotted ALOHA:** time is divided into slots one frame long, and frames may start only at a slot boundary. The vulnerable period shrinks to **one** frame time.

With offered load $G$ (average frames attempted per frame time), the throughput $S$ (successful frames per frame time) is:

| | Throughput | Maximum |
|---|---|---|
| Pure ALOHA | $S = G e^{-2G}$ | $\frac{1}{2e} \approx 18.4\%$ at $G = 0.5$ |
| Slotted ALOHA | $S = G e^{-G}$ | $\frac{1}{e} \approx 36.8\%$ at $G = 1$ |

## 3. CSMA and CSMA/CD

**CSMA (carrier sense multiple access):** **listen before talking**. If the channel is busy, wait. Collisions still happen, because a signal takes time to propagate: two stations can both hear silence and start together.

| Variant | If the channel is busy | If idle |
|---|---|---|
| 1-persistent | keep listening, send the moment it goes idle | send |
| Non-persistent | wait a random time, then listen again | send |
| $p$-persistent (slotted) | wait for the next slot | send with probability $p$ |

**CSMA/CD (collision detection)**, used by classic Ethernet: while transmitting, keep listening. If a collision is detected, stop at once, send a short **jam** signal, and retry after **binary exponential backoff**: after the $k$-th collision, wait a random number of slots between 0 and $2^k - 1$ (with $k$ capped at 10, and giving up after 16 attempts).

### Minimum frame size

A station only knows its frame collided if it is **still transmitting** when the collision's echo returns. In the worst case, that takes a full round trip, $2T_p$. So the transmission time must be at least $2T_p$:

$$
\frac{L_{\min}}{R} \ge 2T_p \implies L_{\min} = 2 \cdot T_p \cdot R
$$

**Example.** A 1 km cable (signal speed $2 \times 10^8$ m/s, so $T_p = 5\ \mu$s) at 10 Mbps: $L_{\min} = 2 \times 5 \times 10^{-6} \times 10^7 = 100$ bits.

Standard 10 Mbps Ethernet uses a **512-bit (64-byte)** minimum frame, called the **slot time** (51.2 µs), which allows for its maximum network size including repeaters.

**Efficiency** of CSMA/CD is roughly $\dfrac{1}{1 + 5a}$, with $a = T_p/T_t$: good when frames are long compared with the propagation delay.

## 4. CSMA/CA in Wi-Fi

Wireless stations **cannot detect collisions** while transmitting: their own signal drowns out everything else, and of two stations that cannot hear each other (the **hidden terminal** problem), neither can detect the clash. So 802.11 tries to **avoid** collisions:

1. Sense the channel. If it is idle for a short interval (DIFS), start a **random backoff** countdown, pausing while the channel is busy.
2. Transmit when the countdown reaches zero.
3. The receiver replies with an **ACK** after a short gap (SIFS). No ACK means assume a collision and back off longer.
4. Optionally, reserve the channel first with a short **RTS** (request to send) and **CTS** (clear to send) exchange, which tells hidden stations to stay quiet.

## 5. Ethernet

**MAC addresses** are 48-bit hardware addresses, written as six hex pairs such as `3C:22:FB:9A:01:7E`. The first 24 bits identify the manufacturer. `FF:FF:FF:FF:FF:FF` is the broadcast address.

**Ethernet frame:**

| Preamble | Dest MAC | Source MAC | Type | Data | CRC |
|---|---|---|---|---|---|
| 8 bytes | 6 | 6 | 2 | 46–1500 | 4 |

The 46-byte minimum payload makes the frame (header + data + CRC) at least 64 bytes, as CSMA/CD requires. The 1,500-byte maximum is the Ethernet **MTU**.

## 6. Hubs, switches and VLANs

- A **hub** (layer 1) repeats every bit out of every port. All its ports share one **collision domain**.
- A **switch** (layer 2) forwards each frame only to the port where the destination lives. Each port is its own collision domain, and modern full-duplex switched Ethernet has no collisions at all.

**How a switch learns.** It keeps a table mapping MAC addresses to ports. When a frame arrives, it records the **source** MAC and the incoming port. To forward, it looks up the **destination**: if known, send it out that one port; if unknown (or broadcast), **flood** it out of every other port.

A switched network is still one **broadcast domain**: a broadcast reaches everyone. **VLANs** split one physical switch into several logical networks, each its own broadcast domain. Traffic between VLANs must go through a router.

## Summary

- Pure ALOHA peaks at 18.4% throughput ($G e^{-2G}$); slotted ALOHA at 36.8% ($G e^{-G}$).
- CSMA/CD listens before and during sending, and backs off exponentially after a collision.
- Minimum frame size $L_{\min} = 2 T_p R$, so a sender is still transmitting when a collision returns; 64 bytes in Ethernet.
- Wi-Fi uses CSMA/CA (random backoff, ACKs, optional RTS/CTS) because wireless collisions cannot be detected.
- Switches learn MAC-to-port mappings from source addresses and flood unknown destinations.

## Check yourself

<details>
<summary>Why is slotted ALOHA twice as efficient as pure ALOHA?</summary>

Frames can start only at slot boundaries, so a frame can only collide with frames starting in the same slot. Its vulnerable period halves from two frame times to one.
</details>

<details>
<summary>If the data rate of a CSMA/CD network increases tenfold with the same cable, what happens to the minimum frame size?</summary>

It increases tenfold, since $L_{\min} = 2 T_p R$. Alternatively, keep the frame size and shorten the maximum cable length by a factor of 10.
</details>

<details>
<summary>What does a switch do with a frame whose destination MAC is not in its table?</summary>

It floods the frame out of every port except the one it arrived on. When the destination replies, the switch learns its port.
</details>
