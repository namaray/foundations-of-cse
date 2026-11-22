---
title: Computer Networks Cheat Sheet
description: One-page revision of network formulas, layers, error control, sliding windows, MAC protocols, IP subnetting, routing, TCP and application protocols.
sidebar:
  label: "12. Cheat sheet"
  order: 20
  badge:
    text: Revision
    variant: note
lesson:
  module: Revision
---

Use this page for last-minute revision. Each heading links back to the full lesson.

## [Layers and delay](/computer-networks/network-models/)

- OSI: physical, data link, network, transport, session, presentation, application. TCP/IP: link, internet, transport, application.
- Data units: bit, frame, packet, segment, message.
- Transmission delay $L/R$; propagation delay $d/s$ ($s \approx 2 \times 10^8$ m/s). Bandwidth–delay product $= R \times T_p$.

## [Physical layer](/computer-networks/physical-layer/)

- Nyquist: $C = 2B \log_2 L$. Shannon: $C = B \log_2(1 + \text{SNR})$, with $\text{SNR} = 10^{\text{dB}/10}$.
- Manchester: self-clocking, twice the bandwidth.

## [Error control](/computer-networks/error-control/) and [sliding windows](/computer-networks/flow-control/)

- Bit stuffing: insert 0 after five 1s. CRC: append $r$ zeros, XOR-divide by the generator, send the remainder.
- Hamming: check bits $r$ with $2^r \ge m + r + 1$; distance $d$ detects $d - 1$, corrects $\lfloor (d-1)/2 \rfloor$.
- Stop-and-wait: $U = 1/(1 + 2a)$, $a = T_p/T_t$. Window $W$: $U = \min(1, W/(1 + 2a))$.
- Go-Back-N window $\le 2^m - 1$; Selective Repeat $\le 2^{m-1}$.

## [Medium access](/computer-networks/medium-access/)

- Pure ALOHA $S = Ge^{-2G}$, max 18.4%. Slotted $S = Ge^{-G}$, max 36.8%.
- CSMA/CD minimum frame $L = 2 T_p R$; Ethernet 64 bytes (512 bits), MTU 1500 bytes.
- Wi-Fi: CSMA/CA with backoff, ACKs and optional RTS/CTS (hidden terminals).
- Switches learn source MACs and flood unknown destinations; each port is a collision domain.

## [IP addressing](/computer-networks/ip-addressing/) and [routing](/computer-networks/routing/)

- Hosts per subnet $= 2^h - 2$. Block size $= 256 -$ mask octet.
- Private: 10/8, 172.16/12, 192.168/16. Loopback 127/8.
- VLSM: allocate largest first. Aggregate consecutive blocks into one shorter prefix.
- Fragment offset in 8-byte units; payload per fragment $= \text{MTU} - 20$, rounded down to a multiple of 8.
- Longest prefix match. Distance vector: $D_x(y) = \min_v\{c(x,v) + D_v(y)\}$ (RIP, max 15 hops). Link state: flood + Dijkstra (OSPF). BGP: path vector between ASes.

## [TCP and UDP](/computer-networks/transport-layer/)

- UDP header 8 bytes; TCP header 20+ bytes. Sequence numbers count bytes; ACK = next byte expected.
- Handshake: SYN($x$) → SYN-ACK($y$, ack $x+1$) → ACK($y+1$). Close: FIN/ACK each way, then TIME_WAIT.
- Timeout = EstimatedRTT + 4·DevRTT. Throughput $\le$ window / RTT.
- [Congestion](/computer-networks/congestion-control/): slow start doubles to ssthresh, then +1 per RTT. Timeout: ssthresh = cwnd/2, cwnd = 1. Triple dup ACK (Reno): ssthresh = cwnd/2, cwnd = ssthresh.

## [Applications](/computer-networks/application-layer/)

- DNS: root → TLD → authoritative; records A, AAAA, CNAME, MX, NS; UDP 53.
- HTTP non-persistent: 2 RTT per object; persistent: 1 RTT per object after the first.
- Ports: FTP 20/21, SSH 22, Telnet 23, SMTP 25, DNS 53, DHCP 67/68, HTTP 80, POP3 110, IMAP 143, HTTPS 443.

## Top viva questions

1. Compare the OSI and TCP/IP models.
2. Transmission vs propagation delay, with a calculation.
3. Compute a CRC for a short message.
4. Compare stop-and-wait, Go-Back-N and Selective Repeat; give their window limits.
5. Why does CSMA/CD need a minimum frame size?
6. Why does Wi-Fi use CSMA/CA rather than CSMA/CD?
7. Subnet a given network; find network and broadcast addresses.
8. Distance vector vs link state; what is count to infinity?
9. TCP vs UDP: when would you use each?
10. Explain the three-way handshake.
11. Trace TCP's congestion window through slow start and a loss.
12. How does DNS resolve a name?
