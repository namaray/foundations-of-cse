---
title: CPU Scheduling
description: Scheduling criteria, FCFS, SJF, SRTF, priority and round-robin scheduling with worked Gantt charts and average waiting times, multilevel queues, and the convoy effect and starvation.
sidebar:
  label: "4. CPU scheduling"
  order: 4
lesson:
  module: Processes and threads
  prerequisites:
    - label: Processes
      link: /operating-systems/processes/
  outcomes:
    - Draw a Gantt chart for FCFS, SJF, SRTF, priority and round-robin scheduling
    - Compute waiting, turnaround and response times
    - Explain the convoy effect, starvation and aging
    - Choose a sensible time quantum for round robin
  keyIdea: >-
    The scheduler picks which ready process runs next. **SJF/SRTF** minimise average waiting time but need burst lengths and can starve long jobs; **round robin** gives good response time; **FCFS** is simple but suffers the convoy effect. Every exam question here is a Gantt chart.
---

## 1. Terms and criteria

Processes alternate between **CPU bursts** and **I/O bursts**. The scheduler chooses among processes in the ready queue.

- **Non-preemptive:** once a process gets the CPU, it keeps it until it finishes its burst or blocks.
- **Preemptive:** the OS can take the CPU away, for example when a time slice ends or a more urgent process arrives.

For each process:

| Measure | Formula |
|---|---|
| Turnaround time | completion time − arrival time |
| Waiting time | turnaround time − burst time |
| Response time | first time on the CPU − arrival time |

Goals: high **CPU utilisation** and **throughput** (processes finished per unit time), low **turnaround**, **waiting** and **response** times.

## 2. The running example

All the algorithms below use the same four processes:

| Process | Arrival | Burst |
|---|---|---|
| P1 | 0 | 8 |
| P2 | 1 | 4 |
| P3 | 2 | 9 |
| P4 | 3 | 5 |

## 3. First-come, first-served (FCFS)

Run processes in order of arrival, non-preemptively.

```text
| P1          | P2     | P3            | P4      |
0             8        12              21        26
```

| | P1 | P2 | P3 | P4 | Average |
|---|---|---|---|---|---|
| Waiting | 0 | 7 | 10 | 18 | **8.75** |

Simple and fair in arrival order, but short jobs stuck behind a long one wait a long time: the **convoy effect**.

## 4. Shortest job first (SJF)

When the CPU becomes free, pick the ready process with the **shortest burst**. Non-preemptive.

At time 0 only P1 has arrived, so it runs to 8. Then P2 (4), P4 (5) and P3 (9) run in order of length.

```text
| P1          | P2     | P4      | P3            |
0             8        12        17              26
```

| | P1 | P2 | P3 | P4 | Average |
|---|---|---|---|---|---|
| Waiting | 0 | 7 | 15 | 9 | **7.75** |

SJF gives the **minimum average waiting time** of any non-preemptive algorithm. Its problems: burst lengths are not known in advance (they are predicted from past bursts with **exponential averaging**), and long jobs can **starve** if short ones keep arriving.

## 5. Shortest remaining time first (SRTF)

The preemptive version of SJF: whenever a process arrives, run the one with the shortest **remaining** time.

- t = 0: P1 starts.
- t = 1: P2 arrives with burst 4, less than P1's remaining 7. **Preempt** P1; P2 runs.
- t = 5: P2 finishes. Remaining: P1 7, P3 9, P4 5. P4 runs.
- t = 10: P4 finishes. P1 runs (7), then P3 (9).

```text
|P1| P2     | P4      | P1          | P3            |
0  1        5         10            17              26
```

| | P1 | P2 | P3 | P4 | Average |
|---|---|---|---|---|---|
| Completion | 17 | 5 | 26 | 10 | |
| Turnaround | 17 | 4 | 24 | 7 | 13 |
| Waiting | 9 | 0 | 15 | 2 | **6.5** |

SRTF gives the minimum average waiting time of all algorithms, at the cost of more context switches and the same starvation risk.

## 6. Priority scheduling

Each process has a priority (here, a smaller number means higher priority), and the highest-priority ready process runs. It can be preemptive or non-preemptive. SJF is the special case where priority is the burst length.

**Starvation:** a low-priority process may never run. **Aging** fixes this by gradually raising the priority of processes that have waited a long time.

## 7. Round robin (RR)

Each process runs for at most one **time quantum** $q$, then goes to the back of the ready queue. Here $q = 4$.

The ready queue changes like this: P1 runs 0–4 while P2, P3 and P4 arrive, so the queue is P2, P3, P4, P1.

```text
| P1  | P2  | P3  | P4  | P1  | P3  |P4|P3|
0     4     8     12    16    20    24 25 26
```

| | P1 | P2 | P3 | P4 | Average |
|---|---|---|---|---|---|
| Completion | 20 | 8 | 26 | 25 | |
| Turnaround | 20 | 7 | 24 | 22 | 18.25 |
| Waiting | 12 | 3 | 15 | 17 | **11.75** |
| Response | 0 | 3 | 6 | 9 | 4.5 |

RR has higher average waiting time here, but much better **response time**, which is what interactive users notice.

**Choosing $q$:**

- Very large $q$: RR becomes FCFS.
- Very small $q$: too much time goes on context switches.
- Rule of thumb: about 80% of CPU bursts should finish within one quantum. Typical values are 10–100 ms.

:::tip[Exam tip]
When a new process arrives at the same moment another one's quantum expires, state your convention. The usual one is that the new arrival joins the queue first, then the preempted process.
:::

## 8. Multilevel queues

- **Multilevel queue:** separate queues for different kinds of process (for example, system, interactive and batch), each with its own algorithm, and fixed priority between the queues.
- **Multilevel feedback queue:** processes **move between queues** based on behaviour. A process that uses its whole quantum drops to a lower-priority queue with a longer quantum; one that waits too long moves up. This favours short and interactive jobs without needing to know burst lengths, and is used, in some form, by most real operating systems.

## Comparison

| Algorithm | Preemptive? | Average waiting time | Starvation? | Notes |
|---|---|---|---|---|
| FCFS | No | Often high | No | Convoy effect |
| SJF | No | Optimal (non-preemptive) | Yes | Needs burst estimates |
| SRTF | Yes | Optimal overall | Yes | More context switches |
| Priority | Either | Depends | Yes (fix with aging) | |
| Round robin | Yes | Higher | No | Best response time |
| Multilevel feedback | Yes | Good | Prevented by aging | Used in practice |

## Summary

- Turnaround = completion − arrival; waiting = turnaround − burst; response = first run − arrival.
- FCFS is simple but suffers the convoy effect.
- SJF (non-preemptive) and SRTF (preemptive) minimise average waiting time but can starve long jobs.
- Priority scheduling needs aging to prevent starvation.
- Round robin trades higher waiting time for good response time; the quantum must be neither too large nor too small.

## Check yourself

<details>
<summary>Three jobs arrive at time 0 with bursts 24, 3 and 3. What is the average waiting time under FCFS in that order, and under SJF?</summary>

FCFS: waits 0, 24, 27, average 17. SJF runs 3, 3, 24: waits 0, 3, 6, average 3. This is the convoy effect.
</details>

<details>
<summary>What happens to round robin as the time quantum grows very large?</summary>

Every process finishes its burst within one quantum, so RR behaves exactly like FCFS.
</details>

<details>
<summary>Why can't SJF be implemented exactly in a real OS?</summary>

The length of the next CPU burst is not known in advance. It can only be predicted, usually from an exponential average of previous bursts.
</details>
