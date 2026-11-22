---
title: Threads
description: Threads vs processes, the benefits of multithreading, user-level and kernel-level threads, multithreading models, and concurrency vs parallelism with Amdahl's law.
sidebar:
  label: "3. Threads"
  order: 3
lesson:
  module: Processes and threads
  prerequisites:
    - label: Processes
      link: /operating-systems/processes/
  outcomes:
    - State what threads of the same process share and what each has of its own
    - Compare user-level and kernel-level threads
    - Describe the many-to-one, one-to-one and many-to-many models
  keyIdea: >-
    A **thread** is a single flow of execution inside a process. Threads of one process **share** its code, data and open files but each has its **own** stack, registers and program counter, so they are cheaper to create and switch than processes.
---

## 1. What a thread is

A process can contain several **threads**, each running its own sequence of instructions.

| Shared by all threads of a process | Private to each thread |
|---|---|
| Code (text) | Program counter |
| Global data and heap | Registers |
| Open files | Stack |
| Address space | Thread ID and state |

**Example.** A web browser might use one thread to draw the page, one to download images and one to respond to clicks.

## 2. Why use threads?

- **Responsiveness:** the interface stays responsive while another thread does slow work.
- **Resource sharing:** threads share memory naturally, with no IPC needed.
- **Economy:** creating a thread and switching between threads is much cheaper than for processes. There is no new address space to set up.
- **Scalability:** threads can run in **parallel** on multiple cores.

The price is that shared memory needs careful [synchronization](/operating-systems/synchronization/).

## 3. Processes vs threads

| | Process | Thread |
|---|---|---|
| Memory | Separate address space | Shares the process's address space |
| Creation cost | High | Low |
| Context switch | Slower (switch address space, flush TLB) | Faster |
| Communication | Needs IPC | Through shared variables |
| Isolation | A crash affects only that process | A crash kills the whole process |

## 4. User-level and kernel-level threads

| | User-level threads | Kernel-level threads |
|---|---|---|
| Managed by | A library in user space | The kernel |
| Kernel aware of them? | No: it sees one process | Yes |
| Switching | Very fast (no system call) | Slower (needs the kernel) |
| One thread blocks on I/O | **The whole process blocks** | Only that thread blocks |
| Use multiple cores | No | Yes |

## 5. Multithreading models

How user threads map onto kernel threads:

| Model | Mapping | Behaviour | Example |
|---|---|---|---|
| **Many-to-one** | Many user threads → 1 kernel thread | Fast, but one blocking call blocks all; no parallelism | Old Green Threads (Solaris) |
| **One-to-one** | Each user thread → its own kernel thread | True parallelism; creating many threads is costly | Linux, Windows |
| **Many-to-many** | $m$ user threads → $n$ kernel threads | Flexible: parallel and lightweight | Some older Unix systems; Go's goroutines use a similar idea |

## 6. Concurrency vs parallelism

- **Concurrency:** several tasks make progress over the same period, possibly by taking turns on one core.
- **Parallelism:** several tasks run at the **same instant** on different cores.

Parallelism needs multiple cores; concurrency does not.

**Amdahl's law** limits the speed-up from adding cores. If a fraction $S$ of a program is serial, then with $N$ cores

$$
\text{speedup} \le \frac{1}{S + \frac{1 - S}{N}}
$$

If 25% is serial, even infinitely many cores give at most $1 / 0.25 = 4\times$.

<details class="go-deeper">
<summary>Go deeper: Pthreads in C</summary>

```c
#include <pthread.h>

void *worker(void *arg) {
    int id = *(int *)arg;
    printf("thread %d\n", id);
    return NULL;
}

int main(void) {
    pthread_t t[4];
    int ids[4];
    for (int i = 0; i < 4; i++) {
        ids[i] = i;
        pthread_create(&t[i], NULL, worker, &ids[i]);
    }
    for (int i = 0; i < 4; i++) pthread_join(t[i], NULL);  // wait for all
}
```

The threads may print in any order: the scheduler decides.
</details>

## Summary

- Threads share a process's code, data and files, but each has its own stack, registers and program counter.
- Threads are cheaper than processes to create and switch, and communicate through shared memory.
- User-level threads are fast but block together and cannot use multiple cores; kernel threads avoid both problems.
- Linux and Windows use the one-to-one model.
- Amdahl's law: the serial part of a program limits the speed-up from more cores.

## Check yourself

<details>
<summary>Two threads of the same process each declare a local variable x inside a function. Do they share x?</summary>

No. Local variables live on each thread's own stack. Global and heap variables are shared.
</details>

<details>
<summary>Why does a blocking system call block all user-level threads in the many-to-one model?</summary>

The kernel sees only one schedulable entity. When it blocks for I/O, the kernel has nothing else to run for that process, so every user thread stops.
</details>

<details>
<summary>A program is 10% serial. What is its maximum speed-up on 8 cores?</summary>

$1 / (0.1 + 0.9/8) = 1 / 0.2125 \approx 4.7\times$.
</details>
