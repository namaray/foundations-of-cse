---
title: NoSQL and Distributed Databases
description: Why NoSQL emerged, key-value, document, column-family and graph databases, the CAP theorem, BASE vs ACID, replication and sharding, and when to choose SQL or NoSQL.
sidebar:
  label: "12. NoSQL"
  order: 12
lesson:
  module: Transactions
  outcomes:
    - Name the four main families of NoSQL databases with an example of each
    - State the CAP theorem and what it means during a network partition
    - Compare ACID and BASE, and SQL and NoSQL, for a given application
  keyIdea: >-
    NoSQL databases trade some relational features (fixed schemas, joins, strict ACID) for easy horizontal scaling and flexible data models. The **CAP theorem** says that when the network partitions, a distributed system must choose between **consistency** and **availability**.
---

## 1. Why NoSQL?

From the 2000s, web companies needed to store huge, fast-changing data across thousands of cheap machines. Relational databases scale **vertically** (a bigger server) more easily than **horizontally** (more servers), and their fixed schemas made rapidly changing data awkward. **NoSQL** ("not only SQL") systems were built for horizontal scale and flexible schemas.

## 2. The four families

| Family | Data model | Good for | Examples |
|---|---|---|---|
| **Key-value** | A giant hash map: key → opaque value | Caches, sessions, shopping carts | Redis, Amazon DynamoDB |
| **Document** | Key → semi-structured document (JSON), queryable by field | Content, catalogues, user profiles | MongoDB, CouchDB |
| **Column-family** (wide-column) | Rows with flexible column groups, stored by column family | Huge write-heavy data, time series | Apache Cassandra, HBase |
| **Graph** | Nodes and edges with properties | Social networks, recommendations, fraud detection | Neo4j |

A document example:

```json
{
  "_id": 101,
  "name": "Rina",
  "dept": "CSE",
  "courses": [
    { "cid": "C1", "grade": "A" },
    { "cid": "C2", "grade": "B+" }
  ]
}
```

The enrolments are **embedded** in the student document, so reading a student needs no join, at the cost of duplicating data if courses are embedded in many places.

## 3. Replication and sharding

- **Replication:** keep copies of data on several machines, for availability and read throughput. Leader–follower (one node takes writes) or leaderless (any node takes writes).
- **Sharding (partitioning):** split the data across machines by key (for example, by hash of the user ID), so each machine stores and serves a fraction. This is what gives horizontal scaling.

## 4. The CAP theorem

A distributed data store can guarantee at most two of:

- **Consistency (C):** every read sees the most recent write (as if there were one copy).
- **Availability (A):** every request to a working node gets a response.
- **Partition tolerance (P):** the system keeps working even if network messages between nodes are lost.

Network partitions **will** happen in real distributed systems, so the practical choice is **during a partition**:

- **CP:** refuse some requests to stay consistent (for example, HBase, or MongoDB with its default settings).
- **AP:** keep answering, possibly with stale data, and reconcile later (for example, Cassandra, DynamoDB).

When there is no partition, a system can offer both consistency and availability; the trade-off then is between consistency and **latency** (the PACELC refinement).

## 5. ACID vs BASE

| ACID (traditional) | BASE (many NoSQL systems) |
|---|---|
| Atomic, consistent, isolated, durable | **B**asically **A**vailable, **S**oft state, **E**ventually consistent |
| Strong consistency on every transaction | Replicas may disagree briefly, but converge if updates stop (**eventual consistency**) |
| Easier to reason about | Easier to scale and keep available |

The line has blurred: many NoSQL systems now offer transactions, and "NewSQL" or distributed SQL systems (Google Spanner, CockroachDB) provide ACID at scale.

## 6. SQL or NoSQL?

| Choose relational (SQL) when | Choose NoSQL when |
|---|---|
| Data is structured with clear relationships | Data is semi-structured or its shape changes often |
| You need complex queries and joins | Access patterns are simple (by key) and known in advance |
| Strong consistency and transactions matter (banking, inventory) | Scale and availability matter more than immediate consistency |
| Data fits comfortably on one server or a few | You need to scale across many machines |

Many systems use both: a relational database for core records and a NoSQL store for caching, search or analytics (**polyglot persistence**).

## Summary

- NoSQL systems trade fixed schemas, joins and strict ACID for horizontal scaling and flexible models.
- Families: key-value, document, column-family and graph.
- Sharding splits data across machines; replication copies it.
- CAP: during a network partition, choose consistency (CP) or availability (AP).
- BASE systems are eventually consistent; ACID systems are strongly consistent.

## Check yourself

<details>
<summary>Which NoSQL family suits "friends of friends who like the same page"?</summary>

A graph database: the query is a short traversal over relationships, which graph databases store and follow directly.
</details>

<details>
<summary>Why can't a distributed database have all three CAP properties at once?</summary>

If the network splits, a node that cannot reach the others must either answer (staying available but possibly returning stale data) or refuse (staying consistent but unavailable). It cannot do both.
</details>

<details>
<summary>What does eventual consistency promise?</summary>

If no new updates are made, all replicas will eventually return the same, latest value. It does not promise that every read sees the newest write immediately.
</details>
