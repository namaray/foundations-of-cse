---
title: Virtual Memory
description: Demand paging and page faults, effective access time with page faults, page replacement with FIFO, optimal and LRU (worked examples), Belady's anomaly, frame allocation, thrashing and the working-set model.
sidebar:
  label: "9. Virtual memory"
  order: 9
lesson:
  module: Memory
  prerequisites:
    - label: Memory management
      link: /operating-systems/memory-management/
  outcomes:
    - Describe the steps the OS takes to handle a page fault
    - Count page faults for FIFO, optimal and LRU replacement
    - Explain Belady's anomaly and why LRU does not suffer from it
    - Explain thrashing and how the working-set model prevents it
  keyIdea: >-
    **Virtual memory** keeps only the pages a process is using in RAM and loads others on demand. A missing page causes a **page fault**, which is very expensive, so the choice of which page to evict matters. **LRU** approximates the unbeatable **optimal** policy; too few frames causes **thrashing**.
---

## 1. Demand paging

With **virtual memory**, a process does not need to be entirely in RAM. Pages are loaded only when first used (**demand paging**); the rest stay on disk in the **swap space**. This allows programs larger than physical memory, more processes in memory at once, and faster start-up.

Each page-table entry has a **valid bit**: 1 means the page is in memory, 0 means it is not (or is not part of the process).

## 2. Handling a page fault

When a process touches a page whose valid bit is 0:

1. The MMU **traps** to the OS: a **page fault**.
2. The OS checks the reference is legal. If not, the process is terminated (a segmentation fault).
3. Find a **free frame**. If there is none, choose a **victim** page to evict (writing it to disk first if it is **dirty**, meaning modified).
4. Schedule a disk read to bring the page into the frame. The process waits, and another process runs meanwhile.
5. Update the page table: set the frame number and valid bit = 1.
6. **Restart the instruction** that caused the fault.

### Effective access time with page faults

With page-fault rate $p$, memory access time $m$ and page-fault service time $s$:

$$
\text{EAT} = (1 - p)\,m + p\,s
$$

**Example.** $m = 200$ ns and $s = 8$ ms $= 8{,}000{,}000$ ns. With $p = 0.001$ (one fault in 1,000 accesses):

$$
\text{EAT} = 0.999 \times 200 + 0.001 \times 8{,}000{,}000 \approx 8{,}200 \text{ ns}
$$

That is **40 times slower** than with no faults. To keep the slowdown under 10% (EAT < 220 ns), $p$ must be below about $2.5 \times 10^{-6}$: fewer than one fault in 400,000 accesses.

## 3. Page replacement

When no frame is free, a **replacement algorithm** chooses the victim. The goal is the fewest page faults. We compare algorithms on a **reference string** of page numbers.

**Reference string:** 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5 with **3 frames**.

### FIFO

Evict the page that has been in memory **longest**.

| Ref | 1 | 2 | 3 | 4 | 1 | 2 | 5 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Frame 1 | 1 | 1 | 1 | **4** | 4 | 4 | **5** | 5 | 5 | 5 | 5 | 5 |
| Frame 2 | | 2 | 2 | 2 | **1** | 1 | 1 | 1 | 1 | **3** | 3 | 3 |
| Frame 3 | | | 3 | 3 | 3 | **2** | 2 | 2 | 2 | 2 | **4** | 4 |
| Fault? | F | F | F | F | F | F | F | | | F | F | |

**9 page faults.**

### Optimal (OPT)

Evict the page that will not be used for the **longest time in the future**. It gives the fewest possible faults, but needs knowledge of the future, so it is used only as a benchmark.

| Ref | 1 | 2 | 3 | 4 | 1 | 2 | 5 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Frame 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | 1 | **3** | 3 | 3 |
| Frame 2 | | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | 2 | **4** | 4 |
| Frame 3 | | | 3 | **4** | 4 | 4 | **5** | 5 | 5 | 5 | 5 | 5 |
| Fault? | F | F | F | F | | | F | | | F | F | |

**7 page faults.** For example, at the reference to 4, the pages in memory are 1, 2 and 3; 3 is needed furthest in the future, so it is evicted.

### LRU (least recently used)

Evict the page that has not been used for the **longest time in the past**: use the recent past to predict the future.

| Ref | 1 | 2 | 3 | 4 | 1 | 2 | 5 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Frame 1 | 1 | 1 | 1 | **4** | 4 | 4 | **5** | 5 | 5 | **3** | 3 | 3 |
| Frame 2 | | 2 | 2 | 2 | **1** | 1 | 1 | 1 | 1 | 1 | **4** | 4 |
| Frame 3 | | | 3 | 3 | 3 | **2** | 2 | 2 | 2 | 2 | 2 | **5** |
| Fault? | F | F | F | F | F | F | F | | | F | F | F |

**10 page faults.** (On this particular string LRU does worse than FIFO; on typical programs with locality, it does better.)

LRU needs to know the order of use, which is expensive to track exactly. Real systems **approximate** it with the hardware **reference bit**, for example the **second-chance (clock)** algorithm: sweep the frames in a circle; if a page's reference bit is 1, clear it and move on; evict the first page found with bit 0.

### Belady's anomaly

With FIFO, **more frames can cause more faults**. The same reference string with **4 frames** gives **10** faults under FIFO, one more than with 3.

LRU and OPT never show this anomaly. They are **stack algorithms**: the set of pages held with $n$ frames is always a subset of the set held with $n + 1$ frames.

## 4. Frame allocation and thrashing

Each process needs a minimum number of frames to run at all. Frames can be shared **equally** or **in proportion** to process size. **Global** replacement may take a frame from any process; **local** replacement takes only from the faulting process's own frames.

**Thrashing** happens when processes have too few frames to hold the pages they are actively using. They fault constantly, spend more time paging than computing, and CPU utilisation collapses. A naive OS sees low CPU use and admits **more** processes, which makes it worse.

**The working-set model.** A process's **working set** is the set of pages it referenced in the last $\Delta$ references (a window size). If the total working-set size of all processes exceeds the number of frames, the OS **suspends** a process to free its frames. An alternative is to monitor each process's **page-fault frequency** and give it more frames when its fault rate is too high.

## Summary

- Demand paging loads pages only when used; a missing page causes a page fault, which takes milliseconds.
- $\text{EAT} = (1 - p)m + p\,s$; even a tiny fault rate slows memory dramatically.
- FIFO is simple but suffers Belady's anomaly; OPT is optimal but needs the future; LRU uses the past and is approximated by the clock algorithm.
- On 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5 with 3 frames: FIFO 9, OPT 7, LRU 10 faults; FIFO with 4 frames gives 10.
- Thrashing comes from too few frames; the working-set model prevents it by limiting how many processes compete.

## Check yourself

<details>
<summary>Why must the faulting instruction be restarted after a page fault?</summary>

It could not finish because its data was not in memory. Once the page has been loaded, the instruction is run again from the beginning, as if the fault had never happened.
</details>

<details>
<summary>Why doesn't a dirty bit change which page is chosen in basic LRU, but still matter?</summary>

Basic LRU chooses by recency only. But evicting a dirty page costs an extra disk write, so practical algorithms prefer clean pages when choices are otherwise similar.
</details>

<details>
<summary>What is the symptom of thrashing, and what is a cure?</summary>

Very high paging activity with low CPU utilisation. Cure: reduce the number of processes in memory (suspend some), or give processes enough frames for their working sets.
</details>
