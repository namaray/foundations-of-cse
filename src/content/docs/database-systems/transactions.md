---
title: Transactions and Serializability
description: Transactions and the ACID properties, transaction states, concurrency anomalies, schedules, conflict serializability with precedence graphs, view serializability, recoverable and cascadeless schedules, and SQL isolation levels.
sidebar:
  label: "9. Transactions"
  order: 9
lesson:
  module: Transactions
  prerequisites:
    - label: SQL
      link: /database-systems/sql/
  outcomes:
    - State the ACID properties and which part of the DBMS guarantees each
    - Test a schedule for conflict serializability with a precedence graph
    - Classify a schedule as recoverable, cascadeless or strict
    - Match SQL isolation levels to the anomalies they allow
  keyIdea: >-
    A **transaction** is a unit of work that must be all-or-nothing and must behave as if it ran alone. Interleaved transactions are correct when their schedule is **serializable**: equivalent to some serial order. A **precedence graph** tests conflict serializability, and a cycle means the schedule is not.
---

## 1. Transactions and ACID

A **transaction** is a sequence of operations that forms one logical unit, such as transferring money:

```text
read(A); A = A − 500; write(A);
read(B); B = B + 500; write(B);
```

| Property | Meaning | Ensured by |
|---|---|---|
| **Atomicity** | All of the transaction happens, or none of it | Recovery manager (undo using the log) |
| **Consistency** | A correct transaction takes the database from one valid state to another | The programmer, plus integrity constraints |
| **Isolation** | Concurrent transactions do not see each other's partial work; the result is as if they ran one at a time | Concurrency control |
| **Durability** | Once committed, changes survive crashes | Recovery manager (redo using the log) |

**Transaction states:** active → partially committed (last statement done) → **committed**; or active → failed → **aborted** (rolled back), after which it may be restarted.

## 2. Why run transactions concurrently?

Interleaving gives better **throughput** (one transaction uses the CPU while another waits for disk) and shorter **waiting time** for short transactions. Without control, though, it causes anomalies:

| Anomaly | What happens |
|---|---|
| **Lost update** | T1 and T2 both read A, both update it; one write overwrites the other |
| **Dirty read** | T2 reads a value written by T1, which then aborts; T2 used data that never existed |
| **Unrepeatable read** | T1 reads A twice and gets different values, because T2 updated it in between |
| **Phantom** | T1 runs the same query twice and new rows appear, because T2 inserted them |

## 3. Schedules

A **schedule** is the order in which the operations of concurrent transactions are executed. A **serial** schedule runs transactions one after another. A schedule is **serializable** if its effect equals that of **some** serial schedule.

### Conflicts

Two operations **conflict** if they belong to **different transactions**, access the **same item**, and **at least one is a write**:

| | Read(X) | Write(X) |
|---|---|---|
| **Read(X)** | no conflict | conflict |
| **Write(X)** | conflict | conflict |

Swapping adjacent **non-conflicting** operations does not change the result. A schedule is **conflict serializable** if such swaps can turn it into a serial schedule.

### The precedence-graph test

1. Draw a node for each transaction.
2. For each pair of conflicting operations where $T_i$'s comes **first**, draw an edge $T_i \to T_j$.
3. The schedule is conflict serializable **if and only if the graph has no cycle**. A topological order of the graph gives an equivalent serial order.

**Example 1.** $R_1(A)\; W_1(A)\; R_2(A)\; W_2(A)\; R_1(B)\; W_1(B)\; R_2(B)\; W_2(B)$

Every conflict on A and on B has $T_1$'s operation first: edges $T_1 \to T_2$ only. No cycle, so it is **serializable**, equivalent to $T_1, T_2$.

**Example 2.** $R_1(A)\; R_2(A)\; W_1(A)\; W_2(A)$

- $R_1(A)$ before $W_2(A)$: edge $T_1 \to T_2$.
- $R_2(A)$ before $W_1(A)$: edge $T_2 \to T_1$.

There is a cycle, so it is **not** conflict serializable. This is the lost-update pattern.

### View serializability

**View serializability** is a weaker condition: each transaction reads the same values and the final writes are the same as in some serial schedule. Every conflict-serializable schedule is view serializable, but not the reverse; the extra schedules involve **blind writes** (writing without reading first). Testing view serializability is NP-complete, so DBMSs use conflict serializability.

## 4. Recoverability

Serializability is not enough if transactions can abort.

| Schedule type | Rule | Why |
|---|---|---|
| **Recoverable** | If $T_j$ reads data written by $T_i$, then $T_i$ commits **before** $T_j$ commits | Otherwise $T_j$ might commit based on data from a transaction that later aborts |
| **Cascadeless** | Transactions read only **committed** data | Prevents **cascading rollbacks**, where one abort forces others to abort |
| **Strict** | No transaction reads **or writes** an item until the last transaction that wrote it has committed or aborted | Makes undo simple: just restore the old value |

Strict ⊂ cascadeless ⊂ recoverable.

**Not recoverable:** $W_1(A)\; R_2(A)\; C_2\; \dots\; A_1$. $T_2$ committed after reading $T_1$'s write, and then $T_1$ aborted. $T_2$'s result cannot be undone.

## 5. Isolation levels in SQL

Full serializability can be expensive, so SQL lets applications choose weaker levels:

| Isolation level | Dirty read | Unrepeatable read | Phantom |
|---|---|---|---|
| Read uncommitted | possible | possible | possible |
| Read committed | prevented | possible | possible |
| Repeatable read | prevented | prevented | possible |
| **Serializable** | prevented | prevented | prevented |

```sql
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
BEGIN;
  UPDATE Account SET balance = balance - 500 WHERE id = 1;
  UPDATE Account SET balance = balance + 500 WHERE id = 2;
COMMIT;      -- or ROLLBACK;
```

Many databases default to **read committed**.

## Summary

- ACID: atomicity and durability come from recovery, isolation from concurrency control, consistency from correct transactions and constraints.
- Uncontrolled concurrency causes lost updates, dirty reads, unrepeatable reads and phantoms.
- Operations conflict if they are from different transactions, on the same item, and at least one writes.
- A schedule is conflict serializable iff its precedence graph is acyclic.
- Recoverable: commit after the transactions you read from. Cascadeless: read only committed data. Strict: also write only committed data.

## Check yourself

<details>
<summary>Is the schedule R1(A) W2(A) W1(A) conflict serializable?</summary>

$R_1(A)$ before $W_2(A)$ gives $T_1 \to T_2$; $W_2(A)$ before $W_1(A)$ gives $T_2 \to T_1$. There is a cycle, so no.
</details>

<details>
<summary>Which ACID property does the log help guarantee?</summary>

Atomicity (undo the changes of aborted transactions) and durability (redo the changes of committed ones after a crash).
</details>

<details>
<summary>What is a cascading rollback?</summary>

When one transaction aborts, every transaction that read its uncommitted data must also abort, and so on. Cascadeless schedules prevent it.
</details>
