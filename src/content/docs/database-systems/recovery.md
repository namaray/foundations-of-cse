---
title: Recovery
description: Failure types, log-based recovery, the write-ahead logging rule, deferred and immediate modification, undo and redo after a crash with a worked example, checkpoints, and an overview of ARIES and shadow paging.
sidebar:
  label: "11. Recovery"
  order: 11
lesson:
  module: Transactions
  prerequisites:
    - label: Transactions
      link: /database-systems/transactions/
  outcomes:
    - State the write-ahead logging rule and explain why it is needed
    - Decide which transactions to undo and which to redo after a crash
    - Explain how checkpoints shorten recovery
  keyIdea: >-
    The DBMS records every change in a **log** before applying it (**write-ahead logging**). After a crash, it **redoes** the changes of committed transactions and **undoes** those of uncommitted ones, giving atomicity and durability. **Checkpoints** limit how much of the log must be scanned.
---

## 1. Kinds of failure

| Failure | Example | What is lost |
|---|---|---|
| Transaction failure | Constraint violation, deadlock victim | That transaction's work; roll it back |
| **System crash** | Power cut, OS crash | Main memory (the buffer); disk survives |
| Disk failure | Head crash | Disk contents; restore from backup plus archived log |

Storage that survives crashes is **stable storage**, approximated by keeping copies on several disks.

The difficulty comes from **buffering**: changes are made in memory and written to disk later, so after a crash the disk may contain some uncommitted changes and miss some committed ones.

## 2. The log

The **log** is a sequential file on stable storage recording every action:

```text
<T1 start>
<T1, A, 1000, 500>       transaction, item, old value, new value
<T1, B, 2000, 2500>
<T1 commit>
```

**Write-ahead logging (WAL)** rules:

1. A log record describing a change must reach stable storage **before** the changed data page is written to disk. (So any change on disk can be undone.)
2. All of a transaction's log records, including `<T commit>`, must reach stable storage **before** the transaction is reported as committed. (So any committed change can be redone.)

A transaction **is committed** at the moment its commit record is safely in the log.

## 3. Undo and redo

- **undo(T):** restore the **old values** of T's writes, scanning the log **backwards**.
- **redo(T):** reapply the **new values** of T's writes, scanning **forwards**.

Both are **idempotent**: doing them twice has the same effect as once, which matters if the system crashes again during recovery.

**After a crash**, scan the log:

| Log contains for T | Action |
|---|---|
| `<T start>` and `<T commit>` (or `<T abort>`) | **Redo** T |
| `<T start>` but no commit or abort | **Undo** T |

## 4. Two update strategies

- **Deferred modification:** a transaction's writes are held back until it commits, so the disk never contains uncommitted data. Recovery needs only **redo**; old values need not be logged.
- **Immediate modification:** changes may reach disk before commit. Recovery needs both **undo** and **redo**. This is what real systems do, because it lets the buffer manager write pages whenever it likes.

## 5. Worked example

The log on disk at the moment of a crash:

```text
<T1 start>
<T1, A, 100, 150>
<T2 start>
<T2, B, 200, 250>
<T1 commit>
<T3 start>
<T3, C, 300, 350>
<T2, D, 400, 450>
                    ← crash
```

- **T1** has start and commit → **redo**: A = 150.
- **T2** has start but no commit → **undo**, backwards: D = 400, then B = 200.
- **T3** has start but no commit → **undo**: C = 300.

Undo is done first, scanning backwards, then redo scanning forwards (modern systems redo first, then undo).

## 6. Checkpoints

Without help, recovery would scan the whole log from the beginning of time. A **checkpoint**:

1. Writes all log records in memory to stable storage.
2. Writes all modified (dirty) buffer pages to disk.
3. Writes a `<checkpoint L>` record, where L lists the transactions active at that moment.

After a crash, only transactions in L or started after the checkpoint need attention. Anything that committed before the checkpoint is already safely on disk.

**Example.** In the log `… <T1 commit> <checkpoint {T2}> <T3 start> … crash`: T1 needs nothing; T2 and T3 are examined as above.

<details class="go-deeper">
<summary>Go deeper: ARIES and shadow paging</summary>

**ARIES**, used by most commercial systems, gives every log record a **log sequence number (LSN)** and stores in each page the LSN of the last change applied to it. Recovery has three passes:

1. **Analysis:** from the last checkpoint, work out which transactions were active and which pages were dirty.
2. **Redo:** **repeat history**, reapplying every logged change not yet on disk, including those of transactions that will be undone.
3. **Undo:** roll back the losers, writing **compensation log records** (CLRs) so that a crash during recovery never undoes the same work twice.

**Shadow paging** avoids a log: a transaction writes changed pages to new locations and, at commit, atomically switches a pointer from the old page table to the new one. It is simple but scatters data and makes concurrency hard, so it is rarely used for general databases (though the copy-on-write idea appears in file systems like ZFS).
</details>

## Summary

- A system crash loses memory but not disk; buffering means disk may hold uncommitted changes and miss committed ones.
- Write-ahead logging: log a change before writing its page, and log the commit before reporting success.
- After a crash, redo transactions with a commit record and undo those without one.
- Deferred modification needs only redo; immediate modification needs undo and redo.
- Checkpoints flush logs and dirty pages so recovery can start from the last checkpoint.

## Check yourself

<details>
<summary>Why must the log record be written before the data page?</summary>

If the page reached disk first and the system crashed before the log record did, there would be no record of the old value, so an uncommitted change could not be undone.
</details>

<details>
<summary>A log shows &lt;T start&gt;, &lt;T, X, 5, 9&gt; and then a crash. What happens to X?</summary>

T has no commit record, so it is undone: X is set back to 5.
</details>

<details>
<summary>Why must undo and redo be idempotent?</summary>

The system might crash again during recovery and restart it. Repeating an operation must not corrupt the data.
</details>
