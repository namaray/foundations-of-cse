---
title: Balanced Trees (AVL, Red–Black, B-Trees)
description: Why BSTs need balancing, AVL trees and their four rotations with a worked example, red–black tree properties, and B-trees and B+ trees for disks and databases.
sidebar:
  order: 8
---

A plain [BST](/data-structures/trees-and-bst/) can degrade to height $O(n)$. **Self-balancing** trees restructure themselves on insertion and deletion to keep the height at $O(\log n)$, so every operation stays $O(\log n)$ in the **worst case**.

## AVL trees

An **AVL tree** is a BST where, for every node, the heights of the left and right subtrees differ by at most 1.

$$
\text{balance factor}(x) = \text{height}(x.\text{left}) - \text{height}(x.\text{right}) \in \{-1, 0, +1\}
$$

(The height of an empty subtree is taken as $-1$.)

### Height bound

Let $N(h)$ be the minimum number of nodes in an AVL tree of height $h$. The sparsest tree has one subtree of height $h-1$ and one of height $h-2$:

$$
N(h) = N(h-1) + N(h-2) + 1, \qquad N(0) = 1,\; N(1) = 2
$$

This grows like the Fibonacci numbers, which gives $h < 1.44 \log_2(n + 2)$. So an AVL tree is never much taller than a perfect tree.

### Rotations

After an insertion, walk back up towards the root. At the **first** node whose balance factor becomes $\pm 2$, apply one of four fixes. The case is named by the path from that node down to the new key.

| Case | Where the new key went | Fix |
|---|---|---|
| **LL** | Left subtree of the left child | Single **right** rotation at the unbalanced node |
| **RR** | Right subtree of the right child | Single **left** rotation |
| **LR** | Right subtree of the left child | Left rotation at the child, then right rotation at the node |
| **RL** | Left subtree of the right child | Right rotation at the child, then left rotation at the node |

```text
Right rotation at z (LL case)

        z                y
       / \             /   \
      y   T4    →     x     z
     / \             / \   / \
    x   T3          T1 T2 T3 T4
   / \
  T1  T2
```

A rotation only changes a few pointers, so it costs $O(1)$, and it preserves the BST ordering.

```c
TreeNode *rotate_right(TreeNode *z) {
    TreeNode *y = z->left;
    z->left = y->right;   // T3 moves across
    y->right = z;
    // update heights of z, then y, here
    return y;             // y is the new root of this subtree
}
```

### Worked example

Insert **10, 20, 30, 25, 28** into an empty AVL tree.

**Insert 10, 20, 30.** Node 10 gets balance factor $-2$, and the new key went right then right: **RR case**. Rotate left at 10.

```text
10                      20
  \                    /  \
   20       →        10    30
     \
      30
```

**Insert 25.** It goes to the left of 30. All balance factors are within range.

**Insert 28.** It goes to the right of 25. Node 30 now has balance factor $+2$, and the path from 30 goes left (to 25) then right (to 28): **LR case**. Rotate left at 25, then right at 30.

```text
    20                   20                  20
   /  \                 /  \                /  \
 10    30      →      10    30     →      10    28
       /                    /                  /  \
     25                   28                 25    30
       \                 /
        28             25
```

The final tree has root 20 with balance factor $-1$: balanced.

:::tip[Exam method]
1. Insert as in a normal BST.
2. Recompute balance factors on the path back to the root.
3. Fix the **first** node that reaches $\pm 2$. Name the case by the next **two** steps from it towards the new key.
4. Show the tree after every rotation.
:::

## Red–black trees

A **red–black tree** is a BST where each node is coloured red or black, subject to five rules:

1. Every node is red or black.
2. The root is black.
3. Every leaf (the `NIL` sentinel) is black.
4. A red node has **no red child** (no two reds in a row).
5. Every path from a node down to its descendant `NIL` leaves has the **same number of black nodes** (its *black height*).

Rules 4 and 5 together mean the longest root-to-leaf path is at most twice the shortest, so

$$
h \le 2 \log_2(n + 1)
$$

Insertion fixes violations with **recolouring** and at most **two rotations**; deletion uses at most **three** rotations.

### AVL vs red–black

| | AVL | Red–black |
|---|---|---|
| Balance | Stricter (height ≈ 1.44 log n) | Looser (height ≤ 2 log n) |
| Lookups | Slightly faster | Slightly slower |
| Insert/delete | More rotations | Fewer rotations |
| Used in | Read-heavy workloads, in-memory indexes | C++ `std::map`, Java `TreeMap`, the Linux kernel scheduler |

## B-trees

Disks and SSDs read data in **blocks**. A binary tree with a million keys has about 20 levels, so a lookup could take 20 slow disk reads. A **B-tree** stores many keys per node, so the tree is short and wide: often only 3–4 levels for millions of keys.

A **B-tree of order $m$** (each node has at most $m$ children) satisfies:

- Every node has at most $m$ children and at most $m - 1$ keys.
- Every internal node except the root has at least $\lceil m/2 \rceil$ children.
- The root has at least 2 children unless it is a leaf.
- A node with $k$ children holds exactly $k - 1$ keys, kept in sorted order.
- **All leaves are at the same depth.**

### Insertion

Insert into the correct leaf. If the leaf **overflows** (has $m$ keys), **split** it: the median key moves up into the parent, and the remaining keys form two nodes. A split can cascade up to the root; splitting the root is the only way a B-tree grows taller.

**Example:** order 3 (at most 2 keys per node). Insert 10, 20, 30.

```text
[10 20]  + 30  →  [10 20 30] overflows  →      [20]
                                               /    \
                                            [10]    [30]
```

### B+ trees

A **B+ tree** is the variant almost every database and file system uses:

- **All keys and data records live in the leaves.** Internal nodes hold only copies of keys, used for routing.
- **Leaves are linked** in a list, so a range query finds the first key and then walks along the leaves.
- Internal nodes have room for more keys, so the tree is even shorter.

| | B-tree | B+ tree |
|---|---|---|
| Data stored in | Every node | Leaves only |
| Duplicate keys in internal nodes | No | Yes (as routing keys) |
| Range queries | Need a tree traversal | Walk the linked leaves |
| Typical use | General-purpose | Database indexes (MySQL InnoDB, PostgreSQL), file systems |

## Viva questions

<details>
<summary>Why do we need self-balancing trees?</summary>

A plain BST's operations cost $O(h)$, and $h$ can reach $n$ for sorted input. Balancing guarantees $h = O(\log n)$, so search, insert and delete are $O(\log n)$ in the worst case.
</details>

<details>
<summary>How many rotations can an AVL insertion need?</summary>

At most one single or one double rotation. After fixing the first unbalanced node, the subtree's height goes back to what it was before the insertion, so no ancestor needs fixing. (Deletion can need rotations at every level, up to $O(\log n)$.)
</details>

<details>
<summary>Why do databases use B+ trees instead of AVL or red–black trees?</summary>

B+ tree nodes match disk block sizes and hold hundreds of keys, so the tree has very few levels and each lookup needs only a few disk reads. Linked leaves also make range queries fast.
</details>

<details>
<summary>What is the minimum number of keys in a non-root node of a B-tree of order 5?</summary>

A non-root internal node needs at least $\lceil 5/2 \rceil = 3$ children, so at least **2 keys**. The maximum is 4 keys (5 children).
</details>
