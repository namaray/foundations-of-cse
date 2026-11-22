---
title: Operating Systems Cheat Sheet
description: One-page revision of OS formulas, scheduling, synchronization, deadlock, memory, virtual memory, file systems and disk scheduling.
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

## [Processes](/operating-systems/processes/) and [threads](/operating-systems/threads/)

- States: new → ready ⇄ running → terminated; running → waiting → ready (never waiting → running).
- PCB: PID, state, program counter, registers, scheduling, memory and I/O information.
- $n$ consecutive `fork()` calls → $2^n$ processes. `fork()` returns 0 to the child.
- Threads share code, data, heap and files; each has its own stack, registers and program counter.
- Amdahl: speedup $\le 1 / (S + (1 - S)/N)$.

## [CPU scheduling](/operating-systems/cpu-scheduling/)

- Turnaround = completion − arrival; waiting = turnaround − burst; response = first run − arrival.
- SJF (non-preemptive) and SRTF (preemptive) minimise average waiting time; both can starve.
- RR: large $q$ → FCFS; small $q$ → overhead. Best response time.
- Convoy effect (FCFS); starvation (SJF, priority) is fixed by aging.

## [Synchronization](/operating-systems/synchronization/)

- Requirements: mutual exclusion, progress, bounded waiting.
- Semaphore initial values: 1 for mutual exclusion, 0 for ordering, $n$ for $n$ resources.
- [Bounded buffer](/operating-systems/classic-problems/): `mutex = 1`, `empty = n`, `full = 0`; producer does `wait(empty)` then `wait(mutex)`.

## [Deadlocks](/operating-systems/deadlocks/)

- Four conditions: mutual exclusion, hold and wait, no preemption, circular wait.
- RAG cycle: deadlock if single-instance resources; only possible otherwise.
- Banker's: Need = Max − Allocation; grant only if a safe sequence remains.
- $n$ processes needing at most $k$ units each: $n(k - 1) + 1$ units guarantee no deadlock.

## [Memory](/operating-systems/memory-management/)

- Physical address = frame × page size + offset; offset bits = $\log_2(\text{page size})$.
- $\text{EAT}_{\text{TLB}} = \alpha(t + m) + (1 - \alpha)(t + 2m)$.
- Paging: internal fragmentation only. Contiguous allocation and segmentation: external fragmentation.
- Page table size = number of pages × entry size.

## [Virtual memory](/operating-systems/virtual-memory/)

- $\text{EAT} = (1 - p)m + p\,s$.
- FIFO (Belady's anomaly possible), OPT (fewest faults, needs the future), LRU (approximated by the clock algorithm).
- 1,2,3,4,1,2,5,1,2,3,4,5 with 3 frames: FIFO 9, OPT 7, LRU 10. FIFO with 4 frames: 10.
- Thrashing: too few frames; fix with the working-set model or page-fault frequency.

## [File systems](/operating-systems/file-systems/) and [disks](/operating-systems/disk-scheduling/)

- Allocation: contiguous (fast, fragments), linked (no random access), indexed (inodes).
- Inode with 4 KB blocks and 4-byte pointers: $(12 + 2^{10} + 2^{20} + 2^{30}) \times 4$ KB ≈ 4 TB.
- Access time = seek + rotational latency + transfer; average latency = half a revolution.
- Example from 53 (queue 98, 183, 37, 122, 14, 124, 65, 67): FCFS 640, SSTF 236, SCAN 236, C-SCAN 382, LOOK 299, C-LOOK 322.
- RAID 0 stripe, 1 mirror, 5 distributed parity (survives 1), 6 double parity (survives 2).

## Top viva questions

1. What is the difference between a process and a thread?
2. Explain what happens during a context switch.
3. Draw a Gantt chart for SRTF or round robin and compute average waiting time.
4. What are the requirements of a critical-section solution?
5. Semaphore vs mutex vs monitor.
6. Solve the producer–consumer problem with semaphores.
7. State the four conditions for deadlock and how to prevent each.
8. Run the Banker's algorithm on a small example.
9. Paging vs segmentation; internal vs external fragmentation.
10. What happens on a page fault?
11. Count page faults for FIFO, LRU and OPT; what is Belady's anomaly?
12. What is thrashing, and how is it prevented?
