---
title: Deadlocks
description: The four necessary conditions for deadlock, resource-allocation graphs, prevention, avoidance with the Banker's algorithm (worked example), detection and recovery.
sidebar:
  label: "7. Deadlocks"
  order: 7
lesson:
  module: Synchronization
  prerequisites:
    - label: Synchronization
      link: /operating-systems/synchronization/
  outcomes:
    - State the four necessary conditions for deadlock
    - Read a resource-allocation graph and tell when a cycle means deadlock
    - Run the Banker's safety algorithm and decide whether to grant a request
    - Compare prevention, avoidance, detection and recovery
  keyIdea: >-
    A deadlock needs **all four** of mutual exclusion, hold and wait, no preemption and circular wait. Break one and deadlock is **prevented**. The **Banker's algorithm** **avoids** it by granting a request only if the system stays in a safe state. Otherwise, **detect** deadlocks and **recover**.
---

A set of processes is **deadlocked** when each one is waiting for a resource held by another process in the set, so none of them can ever proceed.

## 1. Four necessary conditions

Deadlock can happen only if **all four** hold at once:

1. **Mutual exclusion:** at least one resource can be held by only one process at a time.
2. **Hold and wait:** a process holds at least one resource while waiting for another.
3. **No preemption:** resources cannot be taken away; they are released only voluntarily.
4. **Circular wait:** there is a cycle $P_0 \to P_1 \to \dots \to P_n \to P_0$, each waiting for a resource held by the next.

## 2. Resource-allocation graphs

Circles are processes and boxes are resource types, with a dot for each instance.

- **Request edge** $P \to R$: $P$ is waiting for $R$.
- **Assignment edge** $R \to P$: an instance of $R$ is held by $P$.

```text
  P1 ───requests───▶ [R1 •]
  ▲                     │
  │ held by             │ held by
  │                     ▼
[R2 •] ◀───requests─── P2          cycle P1 → R1 → P2 → R2 → P1: deadlock
```

- **No cycle:** no deadlock.
- **Cycle, and every resource has a single instance:** deadlock.
- **Cycle, but some resource has several instances:** there **may** be a deadlock; check further.

## 3. Handling deadlocks

| Strategy | Idea | Cost |
|---|---|---|
| **Prevention** | Design the system so one of the four conditions can never hold | Low resource use; restrictive |
| **Avoidance** | Use advance knowledge of maximum needs; grant a request only if it is safe | Needs maximum needs in advance; runtime checks |
| **Detection and recovery** | Let deadlocks happen, detect them, then break them | Checking cost; lost work |
| **Ignore it** ("ostrich algorithm") | Assume deadlocks are rare; reboot if one happens | Used by most general-purpose OSes |

## 4. Prevention

| Condition to break | How | Drawback |
|---|---|---|
| Mutual exclusion | Make resources sharable (for example, read-only files) | Impossible for printers, locks |
| Hold and wait | Request all resources at once, or only when holding none | Low utilisation; starvation |
| No preemption | If a request fails, release what you hold (or let the OS take it) | Only works for resources whose state can be saved, like CPU registers |
| **Circular wait** | Number the resource types and always request them in increasing order | Practical; the most common approach |

## 5. Avoidance: the Banker's algorithm

Each process declares its **maximum** need in advance. The system is in a **safe state** if there is some order (a **safe sequence**) in which every process can get its remaining needs and finish. A safe state cannot deadlock; an unsafe state *might*.

Data, for $n$ processes and $m$ resource types:

- **Available**: free instances of each type.
- **Max**: maximum demand of each process.
- **Allocation**: currently held.
- **Need** = Max − Allocation.

**Safety algorithm:**

1. Set Work = Available, and mark every process unfinished.
2. Find an unfinished process with Need ≤ Work. If none exists, go to step 4.
3. Pretend it finishes: Work = Work + its Allocation; mark it finished. Go to step 2.
4. If every process is finished, the state is **safe**.

### Worked example

Resources: A = 10, B = 5, C = 7 instances. Available = (3, 3, 2).

| Process | Allocation (A B C) | Max (A B C) | Need (A B C) |
|---|---|---|---|
| P0 | 0 1 0 | 7 5 3 | 7 4 3 |
| P1 | 2 0 0 | 3 2 2 | 1 2 2 |
| P2 | 3 0 2 | 9 0 2 | 6 0 0 |
| P3 | 2 1 1 | 2 2 2 | 0 1 1 |
| P4 | 0 0 2 | 4 3 3 | 4 3 1 |

| Step | Pick | Need ≤ Work? | Work after |
|---|---|---|---|
| start | | | 3 3 2 |
| 1 | P1 | 1 2 2 ≤ 3 3 2 ✓ | 5 3 2 |
| 2 | P3 | 0 1 1 ≤ 5 3 2 ✓ | 7 4 3 |
| 3 | P4 | 4 3 1 ≤ 7 4 3 ✓ | 7 4 5 |
| 4 | P2 | 6 0 0 ≤ 7 4 5 ✓ | 10 4 7 |
| 5 | P0 | 7 4 3 ≤ 10 4 7 ✓ | 10 5 7 |

Safe sequence: **⟨P1, P3, P4, P2, P0⟩**, so the state is safe. (Other safe sequences exist; any one is enough.)

### Handling a request

**P1 requests (1, 0, 2).**

1. Request ≤ Need? (1, 0, 2) ≤ (1, 2, 2) ✓
2. Request ≤ Available? (1, 0, 2) ≤ (3, 3, 2) ✓
3. Pretend to grant it: Available = (2, 3, 0), P1's Allocation = (3, 0, 2), P1's Need = (0, 2, 0).
4. Run the safety algorithm on the new state: ⟨P1, P3, P4, P0, P2⟩ works, so it is safe and the request is **granted**.

If the new state had been unsafe, P1 would have to wait, even though the resources were available.

## 6. Detection and recovery

- **Single instance of each resource:** keep a **wait-for graph** (processes only; an edge $P_i \to P_j$ means $P_i$ waits for $P_j$). A cycle means deadlock.
- **Several instances:** run an algorithm like the Banker's safety check, using current **requests** instead of maximum needs. Processes that can never finish are deadlocked.

**Recovery:**

- **Terminate processes:** abort all deadlocked processes, or abort one at a time until the cycle breaks (choosing victims by priority, work done and so on).
- **Preempt resources:** take resources from a victim and **roll it back** to a safe checkpoint. Avoid always choosing the same victim, or it starves.

## Summary

- Deadlock requires mutual exclusion, hold and wait, no preemption and circular wait, all at once.
- In a resource-allocation graph, a cycle means deadlock if every resource has one instance; otherwise it only means deadlock is possible.
- Prevention breaks a condition, most practically circular wait by ordering resources.
- The Banker's algorithm grants a request only if the resulting state has a safe sequence.
- Detection uses a wait-for graph or a safety-style check; recovery aborts processes or preempts resources.

## Check yourself

<details>
<summary>Is an unsafe state the same as a deadlock?</summary>

No. Every deadlocked state is unsafe, but an unsafe state only means deadlock is possible; processes may still release resources in a way that avoids it.
</details>

<details>
<summary>A system has 3 processes each needing at most 2 units of one resource. What is the minimum number of units that guarantees no deadlock?</summary>

4. In the worst case each process holds 1 unit and wants 1 more; with 4 units one process can get its second, finish, and release both.
</details>

<details>
<summary>Why do most desktop operating systems simply ignore deadlocks?</summary>

Deadlocks are rare in practice, and prevention or avoidance would cost performance and flexibility all the time. Restarting the affected program is cheaper overall.
</details>
