---
title: Runtime Environments
description: Storage organisation, static, stack and heap allocation, activation records and the call sequence, access to non-local data with static links and displays, parameter passing methods, and garbage collection.
sidebar:
  label: "7. Runtime environments"
  order: 7
lesson:
  module: Back end
  prerequisites:
    - label: Intermediate code
      link: /compiler-design/intermediate-code/
  outcomes:
    - List what an activation record contains
    - Explain the difference between static and dynamic links
    - Predict the results of call by value, reference, value-result and name
    - Compare reference counting with tracing garbage collection
  keyIdea: >-
    At run time, each procedure call gets an **activation record** on the stack holding its parameters, local variables, return address and links. The **static link** finds variables of enclosing procedures; the **dynamic link** returns to the caller. Objects that outlive calls go on the **heap**, which needs explicit freeing or **garbage collection**.
---

## 1. Memory layout

A running program's memory is typically divided into:

| Area | Holds | Allocated |
|---|---|---|
| Code | Machine instructions | At compile/load time, fixed |
| Static data | Global and static variables, constants | At compile/load time, fixed |
| **Stack** | Activation records for calls | Grows and shrinks with calls and returns |
| **Heap** | Dynamically allocated objects (`malloc`, `new`) | On request; freed explicitly or by a garbage collector |

The stack and heap usually grow towards each other from opposite ends of the free space.

| Allocation | When used | Supports recursion? |
|---|---|---|
| **Static** | Fortran 77, global variables | No: each procedure has one fixed set of locals |
| **Stack** | Locals in C, Java and most languages | Yes: each call gets a fresh record |
| **Heap** | Objects whose lifetime is not tied to one call | Yes |

## 2. Activation records

Each call creates an **activation record** (stack frame), typically containing:

```text
┌──────────────────────────┐
│ Actual parameters        │
│ Returned value           │
│ Control link (dynamic)   │  → caller's activation record
│ Access link (static)     │  → record of the enclosing procedure
│ Saved machine status     │  return address, saved registers
│ Local variables          │
│ Temporaries              │
└──────────────────────────┘
```

The **activation tree** shows the calls made during execution: each node is one activation, and its children are the calls it made. The stack at any moment holds the path from the root to the current activation.

**Calling sequence.** The caller evaluates the arguments, saves its state and jumps; the callee saves registers, sets up its frame, and allocates locals. On return, the callee places the return value, restores registers, and the caller pops the frame. How this work is split is fixed by the **calling convention**.

## 3. Non-local variables

In languages with **nested procedures** (Pascal, and closures in many modern languages), a procedure can use variables of the procedures it is defined inside.

- **Control (dynamic) link:** points to the **caller's** frame. Used to return.
- **Access (static) link:** points to the frame of the procedure that **lexically encloses** this one. Following $k$ static links reaches a variable declared $k$ nesting levels out.

These differ whenever a procedure is called from somewhere other than where it was defined. **Lexical (static) scoping**, used by almost all languages, resolves names using static links; **dynamic scoping** (old Lisp, Bash) would use the call chain.

A **display** is an array where entry $i$ points to the most recent frame at nesting depth $i$, giving direct access instead of following a chain of links.

## 4. Parameter passing

**Example.**

```c
void f(int x, int y) {
    x = x + 1;
    y = y + x;
}
int a = 1;
f(a, a);
```

| Method | What is passed | Value of `a` afterwards |
|---|---|---|
| **Call by value** | A copy of the value | **1**: the copies `x` and `y` change, `a` does not |
| **Call by reference** | The address | **4**: `x` and `y` both alias `a`; `a = 2`, then `a = 2 + 2` |
| **Call by value-result** | A copy, copied back on return | **3**: `x` becomes 2 and `y` becomes 3; copying back `x` then `y` leaves `a = 3` (the order of copying back matters) |
| **Call by name** | The unevaluated expression, re-evaluated at each use | **4** here, the same as by reference, since the argument is a simple variable |

C uses call by value (with pointers to simulate reference); C++ adds references (`int &x`); Java passes object references by value; call by name (Algol 60) is like macro substitution and survives in lazy evaluation (Haskell's call by need).

## 5. Heap management and garbage collection

Heap blocks are allocated by finding a free block (first fit, best fit, or size-class free lists, like [memory allocation in operating systems](/operating-systems/memory-management/#2-contiguous-allocation)), and suffer fragmentation.

Manual freeing (`free`, `delete`) risks **memory leaks** (forgetting to free) and **dangling pointers** (using memory after freeing it). **Garbage collection** reclaims unreachable objects automatically.

| Method | Idea | Pros | Cons |
|---|---|---|---|
| **Reference counting** | Each object counts the references to it; free it when the count reaches 0 | Immediate, incremental | Cannot collect **cycles**; overhead on every pointer update |
| **Mark and sweep** | From the **roots** (globals, stack, registers), mark everything reachable; sweep away the rest | Handles cycles | Pauses the program; leaves fragmentation |
| **Copying** | Copy reachable objects to a fresh area, compacting them | No fragmentation; cost depends only on live data | Needs twice the space |
| **Generational** | Most objects die young: collect the young generation often and the old one rarely | Fast in practice | More complex |

Java, C# and Go use tracing collectors (generational in Java and C#); Python uses reference counting plus a cycle detector.

## Summary

- Memory has code, static data, stack and heap areas; stack allocation is what makes recursion work.
- An activation record holds parameters, the return value, control and access links, saved state, locals and temporaries.
- The control link returns to the caller; the access link reaches the lexically enclosing procedure's variables.
- Call by value copies; by reference aliases; by value-result copies back; by name re-evaluates the argument at each use.
- Garbage collection: reference counting misses cycles; tracing collectors (mark-sweep, copying, generational) do not.

## Check yourself

<details>
<summary>Why couldn't early Fortran support recursion?</summary>

It allocated each procedure's locals statically, in one fixed place. A recursive call would overwrite the caller's locals, since there was no separate activation record per call.
</details>

<details>
<summary>What is the difference between the control link and the access link?</summary>

The control link points to the caller's frame (who called me). The access link points to the frame of the enclosing procedure in the source code (where I was defined).
</details>

<details>
<summary>Why can't reference counting reclaim two objects that point to each other?</summary>

Each keeps the other's count at 1 even when nothing else refers to them, so neither count ever reaches 0.
</details>
