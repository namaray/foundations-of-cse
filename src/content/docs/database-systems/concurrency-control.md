---
title: Concurrency Control
description: Shared and exclusive locks, two-phase locking and strict 2PL, deadlock handling with wait-die and wound-wait, timestamp ordering and the Thomas write rule, multiversion concurrency control, and lock granularity.
sidebar:
  label: "10. Concurrency control"
  order: 10
lesson:
  module: Transactions
  prerequisites:
    - label: Transactions
      link: /database-systems/transactions/
  outcomes:
    - Explain why two-phase locking guarantees conflict serializability
    - Compare basic, strict and rigorous 2PL
    - Apply the wait-die and wound-wait rules
    - Decide whether timestamp ordering allows a read or write
  keyIdea: >-
    Concurrency control enforces isolation. **Two-phase locking** (acquire all locks before releasing any) guarantees conflict serializability; holding exclusive locks until commit (**strict 2PL**) also prevents cascading rollbacks. **Timestamp** protocols order transactions by start time instead of locking, and **MVCC** lets readers see an old snapshot without blocking writers.
---

## 1. Locks

| Lock | Allows | Compatible with |
|---|---|---|
| **Shared (S)** | Reading | Other S locks |
| **Exclusive (X)** | Reading and writing | Nothing |

| Held \ Requested | S | X |
|---|---|---|
| **S** | grant | wait |
| **X** | wait | wait |

Locking alone does not guarantee serializability: a transaction that unlocks A, then later locks B, can let another transaction slip in between and see an inconsistent state.

## 2. Two-phase locking (2PL)

Each transaction has two phases:

1. **Growing phase:** it may acquire locks but not release any.
2. **Shrinking phase:** it may release locks but not acquire any.

The moment of its last lock acquisition is its **lock point**. **2PL guarantees conflict serializability**: transactions are equivalent to the serial order of their lock points.

| Variant | Rule | Gives |
|---|---|---|
| Basic 2PL | Two phases | Conflict serializability; cascading rollbacks still possible |
| **Strict 2PL** | Also hold all **X** locks until commit or abort | Serializable and **cascadeless** (and strict) schedules |
| Rigorous 2PL | Hold **all** locks until commit or abort | Transactions serialise in commit order |

Strict 2PL is what most lock-based databases use.

**Lock conversion:** a transaction may **upgrade** S to X (only in the growing phase) or **downgrade** X to S (only in the shrinking phase).

**2PL does not prevent deadlocks.** $T_1$ locks A and wants B, while $T_2$ locks B and wants A.

## 3. Handling deadlocks

**Detection:** keep a **wait-for graph** ($T_i \to T_j$ when $T_i$ waits for a lock held by $T_j$). A cycle means deadlock: abort a victim, preferably the one that has done the least work.

**Prevention with timestamps.** Each transaction gets a timestamp when it starts: **older means smaller**. When $T_i$ requests a lock held by $T_j$:

| Scheme | If $T_i$ is older | If $T_i$ is younger |
|---|---|---|
| **Wait-die** (non-preemptive) | $T_i$ **waits** | $T_i$ **dies** (aborts, restarts later with the same timestamp) |
| **Wound-wait** (preemptive) | $T_i$ **wounds** $T_j$ ($T_j$ aborts) | $T_i$ **waits** |

In both, older transactions get priority, so no transaction starves: a restarted transaction keeps its original timestamp and eventually becomes the oldest.

Memory aid: in **wait-die**, the old *wait* and the young *die*. In **wound-wait**, the old *wound* and the young *wait*.

**Timeouts:** a simpler approach is to abort any transaction that waits longer than some limit.

## 4. Timestamp ordering

Instead of locks, each transaction $T$ gets a timestamp $TS(T)$, and the protocol makes conflicting operations happen in timestamp order. Each data item $Q$ records:

- $\text{R-TS}(Q)$: the largest timestamp of any transaction that read $Q$
- $\text{W-TS}(Q)$: the largest timestamp of any transaction that wrote $Q$

**Rules:**

| $T$ wants to | Condition | Action |
|---|---|---|
| Read $Q$ | $TS(T) < \text{W-TS}(Q)$ (a younger transaction already wrote it) | **Reject**: roll back $T$ |
| Read $Q$ | otherwise | Allow; set $\text{R-TS}(Q) = \max(\text{R-TS}(Q), TS(T))$ |
| Write $Q$ | $TS(T) < \text{R-TS}(Q)$ (a younger transaction already read it) | **Reject**: roll back $T$ |
| Write $Q$ | $TS(T) < \text{W-TS}(Q)$ (a younger transaction already wrote it) | **Reject** (or **ignore** the write under the Thomas write rule) |
| Write $Q$ | otherwise | Allow; set $\text{W-TS}(Q) = TS(T)$ |

Timestamp ordering is **deadlock-free** (nobody waits) but can cause many restarts. The **Thomas write rule** skips an outdated write instead of aborting, since a newer value would overwrite it anyway; it allows some view-serializable schedules that are not conflict serializable.

## 5. Multiversion concurrency control (MVCC)

Keep **several versions** of each item. A reader sees the latest version committed before it started (a **snapshot**), so **readers never block writers and writers never block readers**. Writers still conflict with each other.

PostgreSQL, Oracle and MySQL's InnoDB use MVCC. **Snapshot isolation** is fast but not quite serializable: it allows the *write skew* anomaly, where two transactions each read overlapping data and update different items based on it.

## 6. Lock granularity

Locks can be taken on a whole database, a table, a page or a single row. Coarse locks are cheap to manage but limit concurrency; fine locks allow more concurrency at more overhead.

**Multiple-granularity locking** adds **intention locks** (IS, IX, SIX) on ancestors: to lock a row in X mode, first take IX on the table, so another transaction that wants to lock the whole table can see the conflict immediately without checking every row.

## Summary

- S locks are shared for reading; X locks are exclusive for writing.
- 2PL (grow then shrink) guarantees conflict serializability; strict 2PL also holds X locks until commit, avoiding cascading rollbacks.
- 2PL can deadlock: detect with a wait-for graph, or prevent with wait-die or wound-wait, which favour older transactions.
- Timestamp ordering rejects operations that arrive "too late" in timestamp order; it never deadlocks.
- MVCC gives readers a snapshot, so reads and writes do not block each other.

## Check yourself

<details>
<summary>T1 has timestamp 10 and T2 has 20. T1 requests a lock held by T2. What happens under wait-die and under wound-wait?</summary>

T1 is older. Wait-die: T1 waits. Wound-wait: T1 wounds T2, which aborts.
</details>

<details>
<summary>Why does basic 2PL still allow cascading rollbacks?</summary>

A transaction can release an X lock in its shrinking phase before committing. Another transaction can then read the uncommitted value; if the first aborts, the second must too.
</details>

<details>
<summary>Under timestamp ordering, T with TS = 5 tries to write Q where R-TS(Q) = 8. What happens?</summary>

It is rejected and T rolls back: a younger transaction (timestamp 8) has already read the old value of Q.
</details>
