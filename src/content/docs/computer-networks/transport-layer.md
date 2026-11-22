---
title: Transport Layer - UDP and TCP
description: Ports and multiplexing, UDP, TCP segments and sequence numbers, the three-way handshake and connection teardown, reliable delivery, timeout estimation, and flow control.
sidebar:
  label: "8. UDP and TCP"
  order: 8
lesson:
  module: Transport layer
  prerequisites:
    - label: Sliding windows
      link: /computer-networks/flow-control/
  outcomes:
    - Explain how port numbers deliver data to the right process
    - Compare TCP and UDP and choose between them
    - Trace the three-way handshake and the four-way teardown with sequence numbers
    - Compute the maximum throughput allowed by a window and round-trip time
  keyIdea: >-
    The transport layer delivers data between **processes**, identified by **port numbers**. **UDP** adds only ports and a checksum: fast, connectionless, unreliable. **TCP** builds a reliable, ordered byte stream on top of unreliable IP, using sequence numbers, ACKs, retransmission timers, and a receive window for flow control.
---

## 1. Ports and multiplexing

IP delivers packets to a **host**; the transport layer delivers them to the right **process** on that host using **port numbers** (16 bits, 0–65535).

- **Well-known ports** (0–1023) belong to standard services: HTTP 80, HTTPS 443, DNS 53, SSH 22.
- Clients use temporary **ephemeral ports**.

A UDP socket is identified by (destination IP, destination port). A TCP connection is identified by the **4-tuple** (source IP, source port, destination IP, destination port), so a web server on port 80 can tell thousands of simultaneous clients apart.

## 2. UDP

**UDP** (User Datagram Protocol) is minimal: an **8-byte** header with source port, destination port, length and checksum.

- **Connectionless:** no handshake.
- **Unreliable:** no ACKs, no retransmission, no ordering.
- **No congestion control:** sends as fast as the application wants.

**Used for:** DNS queries, streaming audio and video, online games, VoIP, DHCP, and as the base for QUIC (HTTP/3). These either tolerate some loss or handle reliability themselves, and all benefit from low delay.

## 3. TCP overview

**TCP** (Transmission Control Protocol) provides a **connection-oriented, reliable, in-order, full-duplex byte stream** with flow control and congestion control.

Key header fields (20 bytes minimum):

| Field | Purpose |
|---|---|
| Source and destination port | Identify the processes |
| **Sequence number** | Number of the **first byte** of this segment's data |
| **Acknowledgement number** | Next byte the receiver expects (cumulative ACK) |
| Flags | SYN, ACK, FIN, RST, PSH, URG |
| **Receive window** | Free buffer space at the receiver, for flow control |
| Checksum | Error detection |

**Sequence numbers count bytes, not segments.** If a segment starts at byte 1000 and carries 500 bytes, the next starts at 1500, and the ACK for it is 1500.

## 4. The three-way handshake

```text
Client                                     Server
  │ ── SYN, seq = x ───────────────────────▶ │   client picks a random x
  │ ◀── SYN + ACK, seq = y, ack = x + 1 ──── │   server picks a random y
  │ ── ACK, seq = x + 1, ack = y + 1 ──────▶ │
  │          connection established          │
```

The handshake synchronises both sides' starting sequence numbers. Random initial numbers stop old, delayed segments from a previous connection being mistaken for new data, and make spoofing harder.

A **SYN flood** attack sends many SYNs without completing the handshake, filling the server's table of half-open connections. **SYN cookies** defend against it.

## 5. Closing a connection

Each direction closes separately, usually with four segments:

```text
Client                         Server
  │ ── FIN ──────────────────▶ │   client is done sending
  │ ◀── ACK ────────────────── │
  │ ◀── FIN ────────────────── │   server is done too
  │ ── ACK ──────────────────▶ │
  │  TIME_WAIT (2 × MSL)        │
```

The side that closes first waits in **TIME_WAIT** for twice the maximum segment lifetime, so that its final ACK can be resent if lost and old segments die out before the port is reused.

## 6. Reliable delivery

TCP combines the [sliding-window](/computer-networks/flow-control/) ideas:

- **Cumulative ACKs**, like Go-Back-N, but the receiver usually buffers out-of-order segments, like Selective Repeat.
- A **retransmission timer**; on timeout, resend the oldest unacknowledged segment.
- **Fast retransmit:** three **duplicate ACKs** for the same byte strongly suggest that segment was lost, so resend it at once without waiting for the timer.

**Choosing the timeout.** Too short causes needless resends; too long reacts slowly to loss. TCP tracks a smoothed RTT and its variation:

$$
\begin{aligned}
\text{EstimatedRTT} &= (1 - \alpha)\,\text{EstimatedRTT} + \alpha\,\text{SampleRTT} && (\alpha = 0.125) \\
\text{DevRTT} &= (1 - \beta)\,\text{DevRTT} + \beta\,|\text{SampleRTT} - \text{EstimatedRTT}| && (\beta = 0.25) \\
\text{TimeoutInterval} &= \text{EstimatedRTT} + 4 \cdot \text{DevRTT}
\end{aligned}
$$

## 7. Flow control

**Flow control** stops a fast sender overwhelming a slow **receiver**. The receiver advertises its free buffer space in the **receive window** (rwnd), and the sender keeps the amount of unacknowledged data at or below it. If rwnd reaches 0, the sender stops and periodically sends a tiny probe to learn when space frees up.

**Throughput limit.** At most one window can be sent per round trip:

$$
\text{max throughput} = \frac{\text{window size}}{\text{RTT}}
$$

**Example.** The original 16-bit window field allows at most 65,535 bytes. With an RTT of 100 ms: $65{,}535 \times 8 / 0.1 \approx 5.2$ Mbps, however fast the link is. The **window scale** option multiplies the window to support fast, long-distance links.

Flow control protects the **receiver**; [congestion control](/computer-networks/congestion-control/) protects the **network**.

## 8. TCP vs UDP

| | TCP | UDP |
|---|---|---|
| Connection | Connection-oriented (handshake) | Connectionless |
| Reliability | Reliable, ordered | Best effort, may lose or reorder |
| Header | 20+ bytes | 8 bytes |
| Flow and congestion control | Yes | No |
| Speed and delay | More overhead | Low delay |
| Unit | Byte stream | Individual datagrams (message boundaries kept) |
| Used by | HTTP/1.1 and HTTP/2, email, file transfer, SSH | DNS, streaming, games, VoIP, DHCP, QUIC |

## Summary

- Ports identify processes; a TCP connection is identified by its 4-tuple.
- UDP is fast and simple, with no reliability; TCP is reliable, ordered and controlled.
- TCP sequence numbers count bytes; ACKs name the next byte expected.
- Connections open with SYN, SYN-ACK, ACK and close with FIN/ACK in each direction, followed by TIME_WAIT.
- Three duplicate ACKs trigger fast retransmit; the timeout adapts to the measured RTT.
- Flow control uses the receive window; throughput $\le$ window / RTT.

## Check yourself

<details>
<summary>A segment carries bytes 2000–2499. What acknowledgement number will the receiver send?</summary>

2500, the next byte it expects.
</details>

<details>
<summary>Why does DNS use UDP?</summary>

A query and its answer each fit in one small message. A TCP handshake would add a full round trip of delay; if the reply is lost, the client simply asks again.
</details>

<details>
<summary>What is the difference between flow control and congestion control?</summary>

Flow control prevents the sender from overflowing the receiver's buffer (using rwnd). Congestion control prevents senders from overloading the network between them (using cwnd).
</details>
