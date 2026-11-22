---
title: TCP Congestion Control
description: Why congestion happens, the congestion window, slow start, congestion avoidance (AIMD), fast retransmit and fast recovery, Tahoe vs Reno with a worked cwnd trace, and fairness.
sidebar:
  label: "9. Congestion control"
  order: 9
lesson:
  module: Transport layer
  prerequisites:
    - label: UDP and TCP
      link: /computer-networks/transport-layer/
  outcomes:
    - Trace the congestion window through slow start and congestion avoidance
    - Explain how TCP Tahoe and Reno react differently to timeouts and triple duplicate ACKs
    - Explain why AIMD leads to fair sharing
  keyIdea: >-
    TCP probes for spare capacity and backs off on loss. In **slow start** the congestion window doubles each round trip until it reaches **ssthresh**; after that it grows by one segment per round trip (**additive increase**). On a loss, ssthresh is halved (**multiplicative decrease**): Tahoe restarts from 1, while Reno resumes from the new threshold after a triple duplicate ACK.
---

## 1. Why congestion control?

When senders push more traffic into the network than links can carry, router queues fill, packets are dropped, senders retransmit, and the network spends its capacity on duplicates. In the worst case, throughput collapses (**congestion collapse**, seen on the early Internet in 1986).

TCP has no direct signal from routers. It treats **packet loss** as the sign of congestion, and each sender adjusts its rate on its own.

## 2. The congestion window

Besides the receiver's window (rwnd), the sender keeps a **congestion window** (cwnd). The amount of unacknowledged data is limited by the smaller of the two:

$$
\text{in flight} \le \min(\text{cwnd}, \text{rwnd})
$$

So the sending rate is roughly $\text{cwnd} / \text{RTT}$. Below, cwnd is measured in **MSS** (maximum segment size) units.

## 3. The phases

| Phase | Rule | Growth |
|---|---|---|
| **Slow start** | Start with cwnd = 1; add 1 MSS for every ACK | **Doubles** every RTT (exponential) |
| **Congestion avoidance** | Once cwnd ≥ ssthresh, add 1 MSS per RTT | **Linear** (additive increase) |
| **Timeout** | ssthresh = cwnd / 2; cwnd = 1; back to slow start | |
| **Triple duplicate ACK** (Reno) | ssthresh = cwnd / 2; cwnd = ssthresh (plus 3); **fast recovery**, then congestion avoidance | |

A timeout means nothing is getting through: a serious problem, so start over. Three duplicate ACKs mean later segments **are** arriving, so the network is only mildly congested and halving is enough.

**TCP Tahoe** treats both kinds of loss like a timeout (cwnd back to 1). **TCP Reno** adds **fast recovery** for triple duplicate ACKs.

## 4. Worked trace

Initial ssthresh = 8. A loss is detected when cwnd = 12, during round 9.

| Round (RTT) | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|
| cwnd | 1 | 2 | 4 | 8 | 9 | 10 | 11 | 12 | *loss* |
| Phase | SS | SS | SS | CA | CA | CA | CA | CA | |

Rounds 1–3 are slow start (doubling); from cwnd = 8 = ssthresh, growth is linear. At the loss, the new ssthresh = 12 / 2 = **6**.

**If the loss was a timeout** (Tahoe and Reno behave the same):

| Round | 10 | 11 | 12 | 13 | 14 | 15 |
|---|---|---|---|---|---|---|
| cwnd | 1 | 2 | 4 | 6 | 7 | 8 |

Slow start again up to the new ssthresh of 6, then linear growth.

**If the loss was a triple duplicate ACK under Reno:**

| Round | 10 | 11 | 12 | 13 |
|---|---|---|---|---|
| cwnd | 6 | 7 | 8 | 9 |

Fast recovery skips slow start and continues linearly from the new ssthresh. (Many textbooks write cwnd = ssthresh + 3 during fast recovery, then deflate to ssthresh; questions usually simplify to the table above. State which you use.)

Plotted over time, Reno's cwnd forms the famous **sawtooth**: linear climbs, then halving on each loss. Its average is about $\frac{3}{4}$ of the peak window, so average throughput $\approx 0.75 \times W / \text{RTT}$.

## 5. AIMD and fairness

Congestion avoidance is **AIMD**: additive increase, multiplicative decrease. If two TCP flows share a bottleneck, every loss cuts the larger flow by more (in absolute terms) than the smaller one, while both grow at the same rate in between. Over time their rates converge to an **equal share**.

Fairness is per **connection**, not per application: a browser opening 6 parallel connections gets roughly 6 shares. UDP applications ignore TCP's rules entirely.

<details class="go-deeper">
<summary>Go deeper: modern variants</summary>

- **CUBIC** (the Linux default) grows cwnd as a cubic function of the time since the last loss, so it recovers quickly on fast, long-distance links.
- **BBR** (Google) estimates the bottleneck bandwidth and round-trip time directly instead of waiting for losses, keeping queues short.
- **ECN** (explicit congestion notification) lets routers mark packets instead of dropping them, warning senders before loss occurs.
</details>

## Summary

- The sender limits data in flight to $\min(\text{cwnd}, \text{rwnd})$.
- Slow start doubles cwnd every RTT up to ssthresh; congestion avoidance then adds 1 MSS per RTT.
- On a timeout: ssthresh = cwnd/2 and cwnd = 1. On a triple duplicate ACK (Reno): ssthresh = cwnd/2 and cwnd = ssthresh.
- Tahoe always restarts from 1; Reno uses fast recovery.
- AIMD makes competing TCP flows converge to fair shares.

## Check yourself

<details>
<summary>Why is it called "slow start" if the window grows exponentially?</summary>

Compared with earlier TCP, which sent a whole receiver window at once, starting from a window of 1 is slow. It just ramps up quickly from there.
</details>

<details>
<summary>cwnd is 20 when a timeout occurs. What are the new ssthresh and cwnd, and what happens next?</summary>

ssthresh = 10 and cwnd = 1. Slow start doubles cwnd (1, 2, 4, 8) until it reaches 10, then it grows by 1 per RTT.
</details>

<details>
<summary>Why does TCP react less severely to triple duplicate ACKs than to a timeout?</summary>

Duplicate ACKs show that later segments are still arriving, so the network is still delivering most traffic. A timeout suggests nothing is getting through.
</details>
