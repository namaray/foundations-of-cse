---
title: Processes
description: What a process is, its memory layout, the process control block, process states and transitions, context switches, fork and exec, and inter-process communication.
sidebar:
  label: "2. Processes"
  order: 2
lesson:
  module: Processes and threads
  prerequisites:
    - label: OS structure
      link: /operating-systems/os-structure/
  outcomes:
    - Draw the five-state process diagram and explain each transition
    - List what the PCB stores and what a context switch does
    - Predict the output of programs that call fork()
    - Compare shared memory with message passing
  keyIdea: >-
    A **process** is a program in execution: code plus its current state. The OS tracks each one in a **process control block**, moves it between **ready**, **running** and **waiting**, and switches between processes by saving one PCB and loading another.
---

## 1. Program vs process

A **program** is a passive file on disk. A **process** is that program running, with its own state. Running the same program twice gives two separate processes.

A process's memory is laid out as:

```text
high addresses ┌──────────────┐
               │    Stack     │  local variables, return addresses (grows down)
               │      ↓       │
               │              │
               │      ↑       │
               │     Heap     │  malloc / new (grows up)
               ├──────────────┤
               │     Data     │  global and static variables
               ├──────────────┤
low addresses  │     Text     │  program code
               └──────────────┘
```

## 2. The process control block (PCB)

The kernel keeps one **PCB** per process, containing everything needed to stop the process and resume it later:

- Process ID (PID) and parent's PID
- Process **state**
- **Program counter** and CPU **registers**
- Scheduling information (priority, pointers into scheduling queues)
- Memory-management information (page table or base/limit registers)
- Accounting information (CPU time used)
- I/O status (open files, devices)

## 3. Process states

```text
                     dispatch
  New ───▶ Ready ──────────────▶ Running ───▶ Terminated
             ▲   ◀──────────────    │
             │   time slice over    │ waits for
             │                      │ I/O or an event
             │                      ▼
             └─────────────────── Waiting
               I/O or event done
```

| Transition | Cause |
|---|---|
| New → Ready | The OS admits the process |
| Ready → Running | The scheduler picks it (**dispatch**) |
| Running → Ready | Its time slice ends, or a higher-priority process arrives (**preemption**) |
| Running → Waiting | It requests I/O or waits for an event |
| Waiting → Ready | The I/O or event completes |
| Running → Terminated | It exits |

Note there is **no** Waiting → Running transition: a process that finishes waiting goes back to the ready queue first.

## 4. Context switching

A **context switch** saves the state of the running process into its PCB and loads the state of the next one. It is pure overhead (no useful work happens), typically a few microseconds, and it also cools the CPU caches and TLB. This is why time slices cannot be made too short.

## 5. Creating processes: fork and exec

In Unix, `fork()` creates a **child** that is a copy of the parent. It returns **twice**: 0 in the child, and the child's PID in the parent. `exec()` replaces the calling process's program with a new one.

```c
pid_t pid = fork();
if (pid == 0) {
    execlp("ls", "ls", NULL);   // child becomes "ls"
} else if (pid > 0) {
    wait(NULL);                 // parent waits for the child to finish
    printf("Child done\n");
}
```

**Counting processes.** Each `fork()` doubles the number of processes executing the code after it, so $n$ calls in a row create $2^n$ processes in total.

```c
fork();
fork();
fork();
printf("hello\n");   // printed 2^3 = 8 times
```

- A **zombie** is a child that has exited but whose parent has not yet called `wait()` to collect its exit status.
- An **orphan** is a child whose parent exited first; it is adopted by `init`.

Modern systems use **copy-on-write**: after `fork()`, parent and child share memory pages until one of them writes, so forking is cheap.

## 6. Inter-process communication (IPC)

Processes have separate memory, so they need help from the OS to cooperate.

| | Shared memory | Message passing |
|---|---|---|
| How | The OS maps the same region into both processes | Processes call `send()` and `receive()` through the kernel |
| Speed | Fast after setup (no kernel involvement per access) | Slower: a system call per message |
| Synchronization | The programmer must handle it (see [Synchronization](/operating-systems/synchronization/)) | Built into send/receive |
| Best for | Large amounts of data on one machine | Small messages; distributed systems |
| Examples | `shmget`, `mmap` | pipes, message queues, sockets |

**Pipes** connect the output of one process to the input of another: `ls | grep txt`.

## Summary

- A process is a running program with its own memory (text, data, heap, stack) and state.
- The PCB stores the PID, state, program counter, registers, scheduling, memory and I/O information.
- Processes move between new, ready, running, waiting and terminated; waiting processes return to ready, not straight to running.
- A context switch saves one PCB and loads another; it is overhead.
- `fork()` copies the process and returns 0 to the child; $n$ forks give $2^n$ processes.
- Processes communicate through shared memory (fast) or message passing (simpler, works across machines).

## Check yourself

<details>
<summary>Why can't a process go directly from Waiting to Running?</summary>

When its I/O finishes, another process is usually running. The waiting process becomes ready and must be picked by the scheduler like any other ready process.
</details>

<details>
<summary>How many times is "hi" printed by: fork(); fork(); printf("hi");</summary>

4 times. Each fork doubles the number of processes: 1 → 2 → 4.
</details>

<details>
<summary>What is a zombie process?</summary>

A process that has finished but still has an entry in the process table, because its parent has not yet read its exit status with `wait()`.
</details>
