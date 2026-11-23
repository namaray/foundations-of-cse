---
title: Storage and Indexing
description: How tables are stored in blocks, why disk I/O dominates, dense and sparse indexes, primary, clustering and secondary indexes, B+ trees with height calculations, and hash indexes.
sidebar:
  label: "7. Indexing"
  order: 7
lesson:
  module: Storage and queries
  prerequisites:
    - label: SQL
      link: /database-systems/sql/
  outcomes:
    - Explain why database cost is measured in block transfers
    - Distinguish dense, sparse, clustering and secondary indexes
    - Compute the fan-out and height of a B+ tree
    - Choose between a B+ tree index and a hash index
  keyIdea: >-
    Databases live on disk, where reading a block costs far more than any computation, so performance means **reading fewer blocks**. An **index** maps key values to the blocks holding them; a **B+ tree** has such a large fan-out that even a billion rows need only 3 or 4 block reads, and it supports range queries that hash indexes cannot.
---

## 1. Blocks and records

Data is stored in fixed-size **blocks** (pages), typically 4–16 KB, each holding many records. The disk transfers whole blocks, and one transfer takes milliseconds on a hard disk (or tens of microseconds on an SSD), far longer than processing the records in memory.

So query cost is measured in **block transfers** (and disk seeks). The **buffer manager** keeps recently used blocks in memory to avoid repeated reads.

**Blocking factor** = records per block = $\lfloor \text{block size} / \text{record size} \rfloor$.

**Example.** 1,000,000 records of 200 bytes in 4 KB (4,096-byte) blocks: blocking factor $\lfloor 4096 / 200 \rfloor = 20$, so the table occupies $1{,}000{,}000 / 20 = 50{,}000$ blocks.

- Scanning everything: 50,000 block reads.
- If the file is **sorted** on the search key, binary search finds a record in $\lceil \log_2 50000 \rceil = 16$ reads.

## 2. Index basics

An **index** is a separate structure of (search key, pointer) entries that leads quickly to the records with a given key, like the index at the back of a book.

| Index type | Meaning |
|---|---|
| **Dense** | An entry for **every** search-key value (or every record) |
| **Sparse** | Entries for only **some** values, typically one per data block; needs the file sorted on the key |
| **Primary / clustering** | The data file is **sorted on** the index's search key. At most one per table |
| **Secondary / non-clustering** | The file is **not** sorted on this key; the index must be dense |
| Multilevel | An index on the index, used when the index itself is too large |

**Example.** For the 50,000-block file above, a sparse primary index has one entry per block: 50,000 entries. With 16-byte entries (key plus pointer), $4096 / 16 = 256$ entries fit per block, so the index takes $\lceil 50000 / 256 \rceil = 196$ blocks. Binary search on the index needs $\lceil \log_2 196 \rceil = 8$ reads, plus 1 for the data block: **9** instead of 16.

**Trade-off:** indexes speed up searches but **slow down** inserts, updates and deletes (every index must be updated) and use space. Index columns that are frequently searched, joined or sorted on.

## 3. B+ trees

The **B+ tree** is the standard database index. It is a balanced, multi-way search tree, related to the [B-trees in Data Structures](/data-structures/balanced-trees/#3-b-trees):

- All **records (or pointers to them) are in the leaves**, which are linked left to right.
- Internal nodes hold only keys for routing.
- Every path from root to leaf has the **same length**.
- Every node except the root is at least half full.

**Fan-out.** A node fills one disk block. With $n$ the maximum number of pointers per node (the **order**):

$$
n \approx \frac{\text{block size}}{\text{key size} + \text{pointer size}}
$$

**Height.** With fan-out $n$ and $N$ search keys, the height is about $\lceil \log_{n} N \rceil$ (less than $\lceil \log_{\lceil n/2 \rceil} N \rceil$ in the worst case).

**Worked example.** Block size 4,096 bytes, key 8 bytes, pointer 8 bytes: $n = 4096 / 16 = 256$.

| Levels | Keys reachable (about $256^h$) |
|---|---|
| 1 | 256 |
| 2 | 65,536 |
| 3 | 16.7 million |
| 4 | 4.3 billion |

So a billion-row table needs a tree of height **4**, and the root (and often the second level) stays cached in memory. A lookup costs just **2–4 block reads**.

**Operations:**

- **Search:** follow keys from the root to a leaf: $O(\log_n N)$ reads.
- **Range query** (`WHERE cgpa BETWEEN 3.5 AND 4.0`): find the first leaf, then walk along the linked leaves.
- **Insert:** add to the right leaf; if it overflows, **split** it and push a separator key up, splitting parents as needed. The tree grows taller only when the root splits.
- **Delete:** remove from the leaf; if it becomes less than half full, borrow from or **merge** with a sibling.

## 4. Hash indexes

A **hash index** applies a hash function to the key to find a **bucket** of entries, using the same ideas as [hash tables](/data-structures/hashing/).

- **Equality lookups** (`WHERE sid = 101`) take about 1–2 block reads on average.
- **Range queries are not supported**: hashing scatters neighbouring keys.
- **Static hashing** degrades as buckets overflow. **Extendible** and **linear hashing** grow the number of buckets gradually.

| | B+ tree | Hash index |
|---|---|---|
| Equality search | $O(\log_n N)$, about 3–4 reads | About 1–2 reads |
| Range search, ORDER BY | Yes | No |
| Default in most DBMSs | Yes | Available for special cases |

<details class="go-deeper">
<summary>Go deeper: composite and bitmap indexes</summary>

A **composite index** on (dept, cgpa) helps queries filtering on dept, or on dept and cgpa, but not on cgpa alone: the order of columns matters. A **covering index** contains every column a query needs, so the table itself need not be read. **Bitmap indexes** keep one bit-vector per distinct value; they suit low-cardinality columns (such as gender or status) in read-heavy data warehouses.
</details>

## Summary

- Cost is measured in block transfers; blocking factor = records per block.
- Dense indexes have an entry per key; sparse ones per block and need a sorted file.
- A table has at most one clustering (primary) index but can have many secondary indexes.
- B+ trees keep data in linked leaves; with fan-out in the hundreds, height is 3–4 even for billions of rows.
- Hash indexes are fastest for equality but cannot do range queries.

## Check yourself

<details>
<summary>Why can a table have only one clustering index?</summary>

A clustering index requires the data file to be physically sorted on its key, and a file can only be sorted one way.
</details>

<details>
<summary>A B+ tree node holds 100 pointers. Roughly how many levels are needed for 1 million keys?</summary>

$100^3 = 10^6$, so about 3 levels.
</details>

<details>
<summary>Which index type would you use for WHERE price BETWEEN 100 AND 500?</summary>

A B+ tree. It finds the first matching leaf and scans along the linked leaves; a hash index cannot handle ranges.
</details>
