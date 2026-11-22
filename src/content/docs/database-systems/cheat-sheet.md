---
title: Database Systems Cheat Sheet
description: One-page revision of ER mapping, keys, relational algebra, SQL, functional dependencies, normal forms, indexing, join costs, transactions, concurrency control and recovery.
sidebar:
  label: "13. Cheat sheet"
  order: 20
  badge:
    text: Revision
    variant: note
lesson:
  module: Revision
---

Use this page for last-minute revision. Each heading links back to the full lesson.

## [ER model](/database-systems/er-model/) and [relational model](/database-systems/relational-model/)

- Double oval = multivalued, dashed oval = derived, double rectangle = weak entity, double line = total participation.
- M:N relationship → new table with both keys; 1:N → foreign key on the "many" side; multivalued attribute → its own table.
- Superkey ⊇ candidate key (minimal) ⊇ primary key. Entity integrity: primary key not NULL. Referential integrity: foreign keys point to existing rows.

## [Relational algebra](/database-systems/relational-algebra/) and [SQL](/database-systems/sql/)

- $\sigma$ rows, $\pi$ columns, $\times$ all pairs, $\bowtie$ join, $\div$ "for all".
- $R \div S = \pi_A(R) - \pi_A((\pi_A(R) \times S) - R)$.
- SQL order: FROM → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY.
- WHERE filters rows, HAVING filters groups. NULL comparisons are UNKNOWN; aggregates skip NULL except `COUNT(*)`.
- "For all" in SQL: double `NOT EXISTS`.

## [Functional dependencies](/database-systems/functional-dependencies/) and [normalization](/database-systems/normalization/)

- Armstrong: reflexivity, augmentation, transitivity. $X$ is a superkey iff $X^+$ = all attributes.
- Attributes on no right-hand side are in every candidate key.
- 1NF atomic; 2NF no partial dependency; 3NF $X \to A$ has $X$ superkey or $A$ prime; BCNF $X$ superkey.
- Lossless iff $R_1 \cap R_2 \to R_1$ or $R_1 \cap R_2 \to R_2$.
- 3NF synthesis: lossless and dependency-preserving. BCNF: lossless, may lose dependencies.

## [Indexing](/database-systems/indexing/) and [query processing](/database-systems/query-processing/)

- Blocking factor $= \lfloor B / R \rfloor$. B+ tree fan-out $\approx B / (\text{key} + \text{pointer})$; height $\approx \lceil \log_n N \rceil$.
- Dense: entry per key. Sparse: entry per block (file sorted). One clustering index per table.
- Hash index: equality only. B+ tree: equality and ranges.
- Block nested loop: $b_r b_s + b_r$ (smaller outer). Hash join: $\approx 3(b_r + b_s)$. Sort-merge: $b_r + b_s$ plus sorting.
- Push selections and projections down.

## [Transactions](/database-systems/transactions/), [concurrency](/database-systems/concurrency-control/) and [recovery](/database-systems/recovery/)

- ACID: atomicity and durability (recovery), isolation (concurrency control), consistency (application and constraints).
- Conflict: different transactions, same item, at least one write. Conflict serializable iff the precedence graph is acyclic.
- Recoverable ⊃ cascadeless ⊃ strict.
- 2PL: grow, then shrink → conflict serializable. Strict 2PL: hold X locks until commit → cascadeless.
- Wait-die: old waits, young dies. Wound-wait: old wounds, young waits.
- Timestamp ordering: reject a read if $TS < \text{W-TS}$; reject a write if $TS < \text{R-TS}$ or $TS < \text{W-TS}$.
- WAL: log before data, commit record before success. After a crash: redo committed, undo uncommitted.
- [CAP](/database-systems/nosql/): during a partition, choose consistency or availability.

## Top viva questions

1. What are the advantages of a DBMS over a file system?
2. Physical vs logical data independence.
3. Map an ER diagram with an M:N relationship and a weak entity to tables.
4. Superkey vs candidate key vs primary key.
5. Write relational algebra and SQL for a "for all" query.
6. WHERE vs HAVING.
7. Find the candidate keys from a set of FDs.
8. 3NF vs BCNF, with an example that is 3NF but not BCNF.
9. When is a decomposition lossless?
10. Why are B+ trees preferred for database indexes?
11. Explain ACID and test a schedule for conflict serializability.
12. How does 2PL work, and how do wait-die and wound-wait prevent deadlock?
13. What is write-ahead logging, and how does recovery use the log?
