---
title: File Systems
description: Files and their attributes, access methods, directory structures, contiguous, linked and indexed allocation, Unix inodes and maximum file size, free-space management, journaling, and protection.
sidebar:
  label: "10. File systems"
  order: 10
lesson:
  module: Storage
  outcomes:
    - Compare contiguous, linked and indexed allocation
    - Compute the maximum file size supported by an inode
    - Describe how free space is tracked
    - Explain why journaling makes file systems crash-safe
  keyIdea: >-
    A file system turns raw disk blocks into named files and folders. The key design choice is **allocation**: contiguous is fast but fragments, linked avoids fragmentation but is slow for random access, and **indexed** allocation (Unix **inodes**) gives fast random access to large files.
---

## 1. Files

A **file** is a named collection of related data stored on disk. The OS records its **attributes**: name, type, size, location, owner, protection bits and timestamps.

Typical operations: create, open, read, write, seek (reposition), delete and truncate. Opening a file puts an entry in the **open-file table**, so later operations do not need to search the directory again.

**Access methods:**

- **Sequential:** read records in order. Natural for tapes and logs.
- **Direct (random):** jump to any block by number. Needed by databases.
- **Indexed:** an index points to the blocks holding each key.

## 2. Directories

| Structure | Description | Problem |
|---|---|---|
| Single-level | One directory for everyone | Name clashes; no grouping |
| Two-level | One directory per user | No grouping within a user |
| **Tree** | Directories inside directories, with absolute and relative paths | Standard; sharing a file in two places is awkward |
| Acyclic graph | A tree plus **links**, so a file can appear in several directories | Deleting needs reference counts; must prevent cycles |

Unix offers **hard links** (another directory entry pointing to the same inode) and **symbolic links** (a small file containing a path).

## 3. Allocation methods

How are a file's blocks placed on disk?

### Contiguous allocation

Each file occupies a run of consecutive blocks; the directory stores the start block and length.

- **Pros:** fast sequential and random access (block $i$ is at start + $i$); minimal seeking.
- **Cons:** **external fragmentation**; files are hard to grow, since the size must often be known in advance.

### Linked allocation

Each block holds a pointer to the next; the directory stores the first (and last) block.

- **Pros:** no external fragmentation; files grow easily.
- **Cons:** random access is slow (reaching block $i$ means following $i$ pointers); pointers use space; one damaged pointer loses the rest of the file.

The **FAT** (file allocation table) variant keeps all the next-pointers in one table at the start of the disk. The table can be cached in memory, which makes random access much faster. It was used by MS-DOS and is still used on USB drives.

### Indexed allocation

Each file has an **index block** holding the addresses of all its data blocks.

- **Pros:** fast random access; no external fragmentation.
- **Cons:** the index block is overhead, even for tiny files; a single index block limits file size, so large files need linked or multilevel index blocks.

| | Contiguous | Linked | Indexed |
|---|---|---|---|
| Sequential access | Excellent | Good | Good |
| Random access | Excellent | Poor | Good |
| External fragmentation | Yes | No | No |
| Growing a file | Hard | Easy | Easy (up to the index limit) |

## 4. Unix inodes

Unix uses a combined indexed scheme. Each file's **inode** holds its attributes and pointers to its blocks:

- 12 **direct** pointers to data blocks
- 1 **single indirect** pointer: to a block full of pointers to data blocks
- 1 **double indirect** pointer: to a block of pointers to single-indirect blocks
- 1 **triple indirect** pointer

Small files need only the direct pointers (fast); huge files are still supported.

**Worked example: maximum file size.** Block size 4 KB, pointer size 4 bytes, so one block holds $4096 / 4 = 1024$ pointers.

| Pointers | Data blocks reachable |
|---|---|
| 12 direct | 12 |
| Single indirect | $1024$ |
| Double indirect | $1024^2 \approx 1.05$ million |
| Triple indirect | $1024^3 \approx 1.07$ billion |

Maximum size $\approx (12 + 2^{10} + 2^{20} + 2^{30}) \times 4 \text{ KB} \approx 2^{30} \times 2^{12} \text{ bytes} = 4$ TB.

A directory is just a file mapping names to inode numbers. The name is **not** stored in the inode, which is how hard links work.

## 5. Free-space management

| Method | How | Notes |
|---|---|---|
| **Bit vector (bitmap)** | One bit per block: 1 = free, 0 = used (or the reverse) | Simple; finding runs of free blocks is easy. A 1 TB disk with 4 KB blocks needs a 32 MB bitmap |
| Linked list | Free blocks point to the next free block | No wasted space, but slow to traverse |
| Grouping | The first free block stores the addresses of $n$ free blocks | Quickly finds many free blocks |
| Counting | Store (start, count) for each run of free blocks | Compact when free space is in runs |

## 6. Reliability: journaling

A single operation, such as creating a file, updates several structures: the directory, the inode, the bitmap. A crash halfway through leaves them **inconsistent**. Old systems ran a slow consistency checker (`fsck`) after every crash.

A **journaling** file system first writes the intended changes to a **log** (the journal) as a transaction, then applies them. After a crash, it replays completed transactions and discards incomplete ones, so recovery is fast. ext4, NTFS and APFS all journal.

<details class="go-deeper">
<summary>Go deeper: protection</summary>

The **access matrix** model has a row for each user (domain), a column for each object, and the allowed operations in each cell. Real systems store it by column as **access-control lists** (ACLs: each file lists who may do what) or by row as **capabilities** (each user holds unforgeable tickets).

Unix simplifies ACLs to three classes (owner, group, others) times three rights (read, write, execute). `rwxr-x---` is octal 750: the owner can do everything, the group can read and execute, and others have no access.
</details>

## Summary

- Contiguous allocation is fastest but fragments; linked avoids fragmentation but is slow for random access; indexed gives fast random access.
- Unix inodes use 12 direct pointers plus single, double and triple indirect blocks; with 4 KB blocks and 4-byte pointers that supports about 4 TB.
- Free space is tracked with a bitmap, a linked list, grouping or counting.
- Journaling logs changes before applying them, so recovery after a crash is fast and consistent.

## Check yourself

<details>
<summary>Why is random access slow with linked allocation, and how does FAT help?</summary>

Reaching block $i$ means following $i$ pointers stored in the data blocks, each needing a disk read. FAT keeps all the pointers in one table that can be cached in memory, so following them needs no disk reads.
</details>

<details>
<summary>With 1 KB blocks and 4-byte pointers, how many data blocks can a single indirect block address?</summary>

$1024 / 4 = 256$ blocks.
</details>

<details>
<summary>What is the difference between a hard link and a symbolic link?</summary>

A hard link is a second directory entry pointing to the same inode; the file survives until every link is removed. A symbolic link is a separate file containing a path, and it breaks if the target is deleted or moved.
</details>
