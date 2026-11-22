---
title: Flow Control and Reliable Delivery
description: Stop-and-wait ARQ, Go-Back-N and Selective Repeat, link utilisation formulas, window size limits from sequence numbers, and piggybacking.
sidebar:
  label: "4. Sliding windows"
  order: 4
lesson:
  module: Physical and data link layers
  prerequisites:
    - label: Framing and error control
      link: /computer-networks/error-control/
  outcomes:
    - Compute the utilisation of stop-and-wait and sliding-window protocols
    - Explain how Go-Back-N and Selective Repeat recover from a lost frame
    - Give the maximum window size for m-bit sequence numbers
  keyIdea: >-
    Stop-and-wait wastes the link when the propagation delay is long. **Sliding windows** keep up to $W$ frames in flight. **Go-Back-N** resends everything after a loss and needs only a simple receiver; **Selective Repeat** resends only the lost frame but needs buffering and a smaller window relative to the sequence-number space.
---

These protocols use **ARQ** (automatic repeat request): the receiver acknowledges frames, and the sender retransmits on a timeout. The same ideas reappear in [TCP](/computer-networks/transport-layer/).

## 1. Stop-and-wait

Send one frame, then wait for its acknowledgement (ACK) before sending the next. If no ACK arrives before the timer expires, resend. A 1-bit sequence number (0, 1) lets the receiver spot duplicates.

**Utilisation.** Let $T_t$ be the transmission time of a frame and $T_p$ the one-way propagation delay, and let $a = T_p / T_t$. One cycle takes $T_t + 2T_p$ (ignoring the ACK's own transmission time), of which only $T_t$ is useful:

$$
U = \frac{T_t}{T_t + 2T_p} = \frac{1}{1 + 2a}
$$

**Example.** 1,000-bit frames on a 1 Mbps link with 10 ms propagation delay: $T_t = 1$ ms, $a = 10$, so $U = 1/21 \approx 4.8\%$. The link is idle 95% of the time.

## 2. Sliding windows

Allow up to $W$ unacknowledged frames in flight. If $W$ frames can be sent in one round trip, the link stays busy.

$$
U = \min\left(1, \frac{W}{1 + 2a}\right)
$$

In the example, $W \ge 21$ frames gives 100% utilisation. In general, the window should cover the bandwidth–delay product of the round trip.

With **$m$-bit sequence numbers**, frames are numbered $0$ to $2^m - 1$ and then wrap around.

## 3. Go-Back-N

- The sender may have up to $W$ unacknowledged frames.
- The receiver accepts frames **only in order**. It discards any out-of-order frame and re-sends the ACK for the last in-order frame.
- ACKs are **cumulative**: ACK $n$ confirms every frame up to $n$.
- On a timeout, the sender **resends the lost frame and every frame after it**.

**Example.** With $W = 4$, frames 0, 1, 2, 3 are sent and frame 1 is lost. The receiver accepts 0, then discards 2 and 3. When frame 1's timer expires, the sender resends **1, 2, 3**.

**Maximum window:** $W \le 2^m - 1$. With $W = 2^m$, if every ACK were lost the receiver could not tell new frame 0 from a resent old frame 0.

## 4. Selective Repeat

- The receiver **buffers** out-of-order frames within its window and acknowledges each frame **individually**.
- The sender resends **only** the frames that time out.

**Example.** Same situation: frame 1 is lost. The receiver buffers 2 and 3. The sender resends **only 1**; the receiver then delivers 1, 2, 3 in order.

**Maximum window:** $W \le 2^{m-1}$, half the sequence space. Otherwise the receiver's new window could overlap the old one, and a retransmitted old frame would be mistaken for a new one.

## 5. Comparison

| | Stop-and-wait | Go-Back-N | Selective Repeat |
|---|---|---|---|
| Sender window | 1 | $2^m - 1$ | $2^{m-1}$ |
| Receiver window | 1 | 1 | $2^{m-1}$ |
| On a loss, resend | that frame | that frame and all after it | only that frame |
| ACKs | per frame | cumulative | individual |
| Receiver complexity | Simple | Simple | Needs buffers and reordering |
| Best when | Short links | Few errors | Many errors or long delays |

**Piggybacking.** In two-way communication, an ACK can ride inside a data frame going the other way instead of being sent separately, saving bandwidth.

## Summary

- Stop-and-wait utilisation is $1/(1 + 2a)$ with $a = T_p / T_t$, which is tiny on long links.
- Sliding windows send up to $W$ frames per round trip: $U = \min(1, W/(1 + 2a))$.
- Go-Back-N resends from the lost frame onward; window up to $2^m - 1$.
- Selective Repeat resends only the lost frame and buffers the rest; window up to $2^{m-1}$.

## Check yourself

<details>
<summary>With 3-bit sequence numbers, what are the maximum windows for Go-Back-N and Selective Repeat?</summary>

Go-Back-N: $2^3 - 1 = 7$. Selective Repeat: $2^{3-1} = 4$.
</details>

<details>
<summary>A satellite link has T_p = 270 ms and T_t = 1 ms per frame. What window size keeps it fully busy?</summary>

$a = 270$, so $W \ge 1 + 2 \times 270 = 541$ frames.
</details>

<details>
<summary>In Go-Back-N with W = 5, frame 2 of frames 0–4 is lost. Which frames are resent?</summary>

Frames 2, 3 and 4.
</details>
