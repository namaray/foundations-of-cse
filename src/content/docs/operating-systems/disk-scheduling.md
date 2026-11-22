---
title: Disk Scheduling
description: Hard disk structure and access time, the FCFS, SSTF, SCAN, C-SCAN, LOOK and C-LOOK disk scheduling algorithms on one worked example, SSDs, and RAID levels.
sidebar:
  label: "11. Disk scheduling"
  order: 11
lesson:
  module: Storage
  outcomes:
    - Compute total head movement for FCFS, SSTF, SCAN, C-SCAN, LOOK and C-LOOK
    - Explain why SSTF can starve requests
    - Compare the common RAID levels
  keyIdea: >-
    On a hard disk, moving the head (**seek time**) dominates. Disk schedulers reorder requests to cut head movement. **SSTF** is greedy and can starve far requests; the **elevator** algorithms (SCAN, LOOK and their circular versions) sweep back and forth for fair, predictable service.
---

## 1. Disk structure and access time

A hard disk has spinning **platters**, each surface divided into concentric **tracks**, and each track into **sectors**. The tracks at the same position on every surface form a **cylinder**. A read/write **head** on an arm moves between cylinders.

$$
\text{access time} = \text{seek time} + \text{rotational latency} + \text{transfer time}
$$

- **Seek time:** moving the head to the right cylinder, several milliseconds. This is what scheduling reduces.
- **Rotational latency:** waiting for the sector to come round, on average half a revolution. At 7,200 RPM, a revolution takes $60/7200$ s $\approx 8.33$ ms, so the average latency is about 4.17 ms.
- **Transfer time:** actually reading the data, usually small.

## 2. The worked example

All algorithms use the same request queue, by cylinder number:

**98, 183, 37, 122, 14, 124, 65, 67**, with the head at **cylinder 53** and cylinders numbered **0–199**.

We measure **total head movement** in cylinders.

## 3. FCFS

Serve requests in arrival order.

53 → 98 → 183 → 37 → 122 → 14 → 124 → 65 → 67

$$
45 + 85 + 146 + 85 + 108 + 110 + 59 + 2 = \mathbf{640}
$$

Fair, but the head swings wildly.

## 4. SSTF (shortest seek time first)

Always serve the request **closest** to the current head position.

53 → 65 → 67 → 37 → 14 → 98 → 122 → 124 → 183

$$
12 + 2 + 30 + 23 + 84 + 24 + 2 + 59 = \mathbf{236}
$$

Much better, but like SJF it can **starve** requests at the edges if new requests keep arriving near the head. It is also not optimal: going 53 → 37 → 14 first and then sweeping up would give 208.

## 5. SCAN (elevator)

The head moves in one direction serving requests until it reaches the **end of the disk**, then reverses. Here it starts moving towards 0.

53 → 37 → 14 → **0** → 65 → 67 → 98 → 122 → 124 → 183

$$
(53 - 0) + (183 - 0) = 53 + 183 = \mathbf{236}
$$

## 6. C-SCAN (circular SCAN)

Serve requests in **one direction only**. At the end of the disk, jump straight back to the other end without serving anything, then continue. Here it moves towards 199.

53 → 65 → 67 → 98 → 122 → 124 → 183 → **199** ⟶ **0** → 14 → 37

$$
(199 - 53) + 199 + 37 = 146 + 199 + 37 = \mathbf{382}
$$

(Some textbooks do not count the return jump, giving 183.) C-SCAN gives a more **uniform** waiting time: requests just behind the head do not wait for two full sweeps.

## 7. LOOK and C-LOOK

The same as SCAN and C-SCAN, but the head only goes as far as the **last request** in each direction, not the end of the disk.

**LOOK** (moving towards 199): 53 → 65 → 67 → 98 → 122 → 124 → 183 → 37 → 14

$$
(183 - 53) + (183 - 14) = 130 + 169 = \mathbf{299}
$$

**C-LOOK** (moving towards 199): 53 → … → 183 ⟶ 14 → 37

$$
(183 - 53) + (183 - 14) + (37 - 14) = 130 + 169 + 23 = \mathbf{322}
$$

:::tip[Exam tip]
Always state the **initial direction** and whether you count the **return jump** for C-SCAN and C-LOOK. Both change the answer.
:::

## 8. Comparison

| Algorithm | Total movement (example) | Starvation? | Notes |
|---|---|---|---|
| FCFS | 640 | No | Simple, slow |
| SSTF | 236 | Yes | Greedy |
| SCAN | 236 (towards 0) | No | Goes to the disk edge |
| C-SCAN | 382 (towards 199, return counted) | No | Most uniform wait |
| LOOK | 299 (towards 199) | No | Practical SCAN |
| C-LOOK | 322 (towards 199, jump counted) | No | Practical C-SCAN |

**SSDs** have no moving parts, so seek time is essentially zero. Their schedulers simply merge requests and keep things fair, usually close to FCFS.

## 9. RAID

**RAID** (redundant array of independent disks) combines several disks for speed, reliability or both.

| Level | Technique | Minimum disks | Survives | Notes |
|---|---|---|---|---|
| RAID 0 | **Striping** across disks | 2 | No failures | Fast; capacity of all disks; no redundancy |
| RAID 1 | **Mirroring** | 2 | 1 disk per mirror | Fast reads; half the capacity |
| RAID 5 | Striping with **distributed parity** | 3 | 1 disk | Good balance; capacity $(n-1)$ disks; slow small writes |
| RAID 6 | Striping with **two** parity blocks | 4 | 2 disks | Capacity $(n-2)$ disks |
| RAID 10 | Mirrored pairs, then striped | 4 | 1 per mirrored pair | Fast and reliable; half the capacity |

Parity is the XOR of the data blocks in a stripe, so any one lost block can be rebuilt by XOR-ing the others.

## Summary

- Access time = seek + rotational latency + transfer; seek time dominates on hard disks.
- On the standard example from cylinder 53: FCFS 640, SSTF 236, SCAN 236, C-SCAN 382, LOOK 299, C-LOOK 322.
- SSTF can starve distant requests; SCAN, LOOK and their circular versions do not.
- RAID 0 stripes, RAID 1 mirrors, RAID 5 adds distributed parity and survives one failure.

## Check yourself

<details>
<summary>Why is C-SCAN fairer than SCAN?</summary>

After SCAN reverses, requests near the end it just left get served again soon, while those at the far end wait for nearly two sweeps. C-SCAN always sweeps the same way, so every cylinder waits about the same time.
</details>

<details>
<summary>A disk spins at 6,000 RPM. What is its average rotational latency?</summary>

One revolution takes $60/6000 = 10$ ms, so the average latency is half of that: 5 ms.
</details>

<details>
<summary>Four 2 TB disks are in RAID 5. What is the usable capacity?</summary>

$(4 - 1) \times 2 = 6$ TB. One disk's worth of space holds parity.
</details>
