---
title: Process Synchronization
description: Race conditions, the critical-section problem and its three requirements, Peterson's solution, hardware atomic instructions, mutex locks, semaphores and monitors.
sidebar:
  label: "5. Synchronization"
  order: 5
lesson:
  module: Synchronization
  prerequisites:
    - label: Threads
      link: /operating-systems/threads/
  outcomes:
    - Explain how a race condition corrupts a shared variable
    - State the three requirements of a critical-section solution
    - Use semaphores for mutual exclusion and for ordering
    - Compare spinlocks, mutexes, semaphores and monitors
  keyIdea: >-
    When threads share data, the result can depend on timing: a **race condition**. The fix is to make each **critical section** run alone. Atomic hardware instructions make this possible, and **mutexes**, **semaphores** and **monitors** package it into tools programmers can use.
---

## 1. Race conditions

Two threads each run `count++` on a shared variable that starts at 5. In machine code, `count++` is three steps:

```text
register = count       (load)
register = register + 1
count = register       (store)
```

If the scheduler switches threads in the middle:

| Step | Thread A | Thread B | count |
|---|---|---|---|
| 1 | load 5 | | 5 |
| 2 | | load 5 | 5 |
| 3 | add → 6 | | 5 |
| 4 | | add → 6 | 5 |
| 5 | store 6 | | 6 |
| 6 | | store 6 | **6** (should be 7) |

A **race condition** is when the outcome depends on the order in which threads happen to run. Races are hard to find because they appear only occasionally.

## 2. The critical-section problem

A **critical section** is a piece of code that accesses shared data. Each process follows the pattern:

```text
do {
    entry section        // ask permission
        critical section
    exit section         // release
        remainder section
} while (true);
```

A correct solution must satisfy three requirements:

1. **Mutual exclusion:** at most one process is in its critical section at a time.
2. **Progress:** if no one is in the critical section, the choice of who enters next cannot be postponed forever, and only processes that want to enter take part in the choice.
3. **Bounded waiting:** there is a limit on how many times others can enter before a waiting process gets its turn (no starvation).

## 3. Peterson's solution

A software solution for two processes, $P_0$ and $P_1$, using two shared variables:

```c
int turn;            // whose turn it is
bool flag[2];        // flag[i] = true means Pi wants to enter

// code for process i (j is the other one)
flag[i] = true;
turn = j;                       // politely let the other go first
while (flag[j] && turn == j)
    ;                           // busy wait
/* critical section */
flag[i] = false;
/* remainder section */
```

It satisfies all three requirements. If both want to enter, `turn` decides, and whoever set `turn` last waits. On modern CPUs, which reorder memory operations, it needs memory barriers to work, so it is mainly of teaching value.

## 4. Hardware support

Modern CPUs provide **atomic** instructions that read and modify memory in one indivisible step.

```c
// test_and_set: returns the old value and sets the target to true, atomically
bool test_and_set(bool *target) {
    bool old = *target;
    *target = true;
    return old;
}

// spinlock built from it
while (test_and_set(&lock))
    ;            // spin until the lock was false
/* critical section */
lock = false;
```

`compare_and_swap` is the other common primitive. These give mutual exclusion, but a simple spinlock does not guarantee bounded waiting.

## 5. Mutex locks

A **mutex** (mutual exclusion lock) wraps this in two operations: `acquire()` and `release()`.

- A **spinlock** busy-waits. That wastes CPU, but is efficient when locks are held only very briefly on multi-core systems (no context switch).
- A **blocking mutex** puts the waiting thread to sleep and wakes it on release.

## 6. Semaphores

A **semaphore** $S$ is an integer accessed only through two atomic operations (Dijkstra's names in brackets):

```text
wait(S)   [P]:  S = S - 1;  if S < 0, block this process on S's queue
signal(S) [V]:  S = S + 1;  if S <= 0, wake one process from S's queue
```

In this blocking version, a negative value $-k$ means $k$ processes are waiting.

- **Binary semaphore** (0 or 1): works like a mutex.
- **Counting semaphore**: initialised to $n$, it controls access to $n$ identical resources, such as buffer slots or printers.

**Mutual exclusion** with a semaphore initialised to 1:

```c
semaphore mutex = 1;
wait(mutex);
    /* critical section */
signal(mutex);
```

**Ordering:** to make statement S2 in process B run only after S1 in process A, use a semaphore initialised to 0:

```text
Process A:  S1;  signal(sync);
Process B:  wait(sync);  S2;
```

:::caution[Semaphores are easy to misuse]
Swapping `wait` and `signal`, forgetting a `signal`, or taking two semaphores in different orders in two processes causes deadlocks or broken mutual exclusion.
:::

## 7. Monitors

A **monitor** is a language construct that bundles shared data with the procedures that use it, and guarantees that **only one process is active inside the monitor at a time**. Mutual exclusion is automatic.

For waiting on conditions inside a monitor, **condition variables** provide `x.wait()` (suspend and release the monitor) and `x.signal()` (wake one waiting process, if any). Unlike a semaphore's `signal`, a condition's `signal` does nothing if nobody is waiting.

Java's `synchronized` methods with `wait()` and `notify()` work like a monitor.

## Comparison

| Tool | Waiting | Counts resources? | Ease of use |
|---|---|---|---|
| Spinlock | Busy-waits | No | Simple; good for very short sections |
| Mutex | Sleeps | No | Simple |
| Semaphore | Sleeps | Yes (counting) | Powerful but error-prone |
| Monitor | Sleeps on condition variables | Via its own data | Safest: exclusion is automatic |

## Summary

- A race condition happens when interleaved access to shared data gives timing-dependent results.
- A critical-section solution needs mutual exclusion, progress and bounded waiting.
- Peterson's algorithm solves it in software for two processes; atomic instructions like test-and-set solve it in hardware.
- Semaphores use `wait` and `signal`: initialise to 1 for mutual exclusion, to 0 for ordering, to $n$ for $n$ resources.
- Monitors make mutual exclusion automatic and use condition variables for waiting.

## Check yourself

<details>
<summary>Why isn't disabling interrupts a good solution to the critical-section problem on a multiprocessor?</summary>

Disabling interrupts only stops preemption on the current CPU. Threads on other CPUs can still enter the critical section. It is also too dangerous to allow user programs to do it.
</details>

<details>
<summary>A counting semaphore has value −3. What does that mean?</summary>

In the blocking implementation, three processes are waiting on it.
</details>

<details>
<summary>What is the difference between a semaphore's signal() and a condition variable's signal()?</summary>

A semaphore's `signal()` always increments the count, so the "signal" is remembered even if no one is waiting. A condition variable's `signal()` does nothing if no process is waiting.
</details>
