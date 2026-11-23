---
title: Balanced Trees (AVL, Red–Black, B-Trees)
description: Why BSTs need balancing, AVL trees and their four rotations with a worked example, red–black tree properties, and B-trees and B+ trees for disks and databases.
sidebar:
  label: "8. Balanced trees"
  order: 8
lesson:
  module: Hashing and trees
  prerequisites:
    - label: Trees and BSTs
      link: /data-structures/trees-and-bst/
  outcomes:
    - Identify the LL, RR, LR and RL cases and fix them with rotations
    - Insert a sequence of keys into an AVL tree, showing every rotation
    - State the red–black tree rules and compare red–black with AVL trees
    - Insert into a B-tree with splits and explain why databases use B+ trees
  keyIdea: >-
    Self-balancing trees keep their height $O(\log n)$ so every operation stays fast. **AVL** trees keep subtree heights within 1 using $O(1)$ **rotations**; **red–black** trees use colour rules for a looser, cheaper balance; **B-trees** pack many keys per node so a lookup touches only a few disk blocks.
---

A plain [BST](/data-structures/trees-and-bst/) can degrade to height $O(n)$. **Self-balancing** trees restructure themselves on insertion and deletion to keep the height at $O(\log n)$, so every operation stays $O(\log n)$ in the **worst case**.

## 1. AVL trees

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

<figure class="diagram"><svg style="--dg-min:460px" class="dg" viewBox="0 0 640 250" role="img" aria-labelledby="rotr-t"><title id="rotr-t">A right rotation at z: its left child y becomes the root of the subtree, z becomes y&#x27;s right child, and subtree T3 moves from y to z.</title><defs><marker id="ah-rotr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-rotr-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-a" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-rotr-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-b" d="M0,0 L10,5 L0,10 z"/></marker></defs><line class="dg-line" x1="184.9" y1="39.8" x2="119.1" y2="82.2"/><line class="dg-line" x1="93" y1="106.2" x2="67" y2="139.8"/><line class="dg-line" x1="48" y1="170.1" x2="32" y2="202"/><path class="dg-line" d="M32.0,202.0 L49.0,236.0 L15.0,236.0 Z"/><line class="dg-line" x1="64" y1="170.1" x2="80" y2="202"/><path class="dg-line" d="M80.0,202.0 L97.0,236.0 L63.0,236.0 Z"/><line class="dg-line" x1="116.7" y1="104.7" x2="152" y2="140"/><path class="dg-line" d="M152.0,140.0 L169.0,174.0 L135.0,174.0 Z"/><line class="dg-line" x1="216.1" y1="38" x2="296" y2="78"/><path class="dg-line" d="M296.0,78.0 L313.0,112.0 L279.0,112.0 Z"/><line class="dg-line" x1="475.8" y1="41" x2="424.2" y2="81"/><line class="dg-line" x1="398.5" y1="105.8" x2="370" y2="140"/><path class="dg-line" d="M370.0,140.0 L387.0,174.0 L353.0,174.0 Z"/><line class="dg-line" x1="421.5" y1="105.8" x2="450" y2="140"/><path class="dg-line" d="M450.0,140.0 L467.0,174.0 L433.0,174.0 Z"/><line class="dg-line" x1="504.2" y1="41" x2="555.8" y2="81"/><line class="dg-line" x1="558.5" y1="105.8" x2="530" y2="140"/><path class="dg-line" d="M530.0,140.0 L547.0,174.0 L513.0,174.0 Z"/><line class="dg-line" x1="581.5" y1="105.8" x2="610" y2="140"/><path class="dg-line" d="M610.0,140.0 L627.0,174.0 L593.0,174.0 Z"/><line class="dg-line" x1="312" y1="60" x2="376" y2="60" marker-end="url(#ah-rotr)"/><text class="dg-t-muted" x="32" y="224" text-anchor="middle">T1</text><text class="dg-t-muted" x="80" y="224" text-anchor="middle">T2</text><circle class="dg-cell" cx="56" cy="154" r="18"/><text x="56" y="154" text-anchor="middle">x</text><text class="dg-t-muted" x="152" y="162" text-anchor="middle">T3</text><circle class="dg-cell-a" cx="104" cy="92" r="18"/><text class="dg-t-a" x="104" y="92" text-anchor="middle">y</text><text class="dg-t-muted" x="296" y="100" text-anchor="middle">T4</text><circle class="dg-cell-b" cx="200" cy="30" r="18"/><text class="dg-t-b" x="200" y="30" text-anchor="middle">z</text><text class="dg-t-muted" x="370" y="162" text-anchor="middle">T1</text><text class="dg-t-muted" x="450" y="162" text-anchor="middle">T2</text><circle class="dg-cell" cx="410" cy="92" r="18"/><text x="410" y="92" text-anchor="middle">x</text><text class="dg-t-muted" x="530" y="162" text-anchor="middle">T3</text><text class="dg-t-muted" x="610" y="162" text-anchor="middle">T4</text><circle class="dg-cell-b" cx="570" cy="92" r="18"/><text class="dg-t-b" x="570" y="92" text-anchor="middle">z</text><circle class="dg-cell-a" cx="490" cy="30" r="18"/><text class="dg-t-a" x="490" y="30" text-anchor="middle">y</text><text class="dg-t-muted" x="344" y="46" text-anchor="middle" style="font-size:13px">rotate right</text></svg><ul class="dg-legend"><li><span class="dg-swatch b"></span>unbalanced node z</li><li><span class="dg-swatch a"></span>left child y</li></ul><figcaption>Right rotation at z (the LL case). Only three pointers change, and the inorder order T1 x T2 y T3 z T4 is the same before and after, so it is still a BST.</figcaption></figure>

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

<figure class="diagram"><svg style="--dg-min:440px" class="dg" viewBox="0 0 440 200" role="img" aria-labelledby="avlrr-t"><title id="avlrr-t">Inserting 10, 20, 30 makes a right-leaning chain; a left rotation at 10 makes 20 the root.</title><defs><marker id="ah-avlrr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-avlrr-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-a" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-avlrr-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-b" d="M0,0 L10,5 L0,10 z"/></marker></defs><line class="dg-line" x1="71.5" y1="43.8" x2="98.5" y2="76.2"/><line class="dg-line" x1="116.9" y1="106.6" x2="128.1" y2="133.4"/><line class="dg-line" x1="317.7" y1="73.1" x2="282.3" y2="110.9"/><line class="dg-line" x1="342.3" y1="73.1" x2="377.7" y2="110.9"/><line class="dg-line" x1="190" y1="90" x2="250" y2="90" marker-end="url(#ah-avlrr)"/><circle class="dg-cell" cx="135" cy="150" r="18"/><text x="135" y="150" text-anchor="middle">30</text><circle class="dg-cell-a" cx="110" cy="90" r="18"/><text class="dg-t-a" x="110" y="90" text-anchor="middle">20</text><circle class="dg-cell-b" cx="60" cy="30" r="18"/><text class="dg-t-b" x="60" y="30" text-anchor="middle">10</text><circle class="dg-cell-b" cx="270" cy="124" r="18"/><text class="dg-t-b" x="270" y="124" text-anchor="middle">10</text><circle class="dg-cell" cx="390" cy="124" r="18"/><text x="390" y="124" text-anchor="middle">30</text><circle class="dg-cell-a" cx="330" cy="60" r="18"/><text class="dg-t-a" x="330" y="60" text-anchor="middle">20</text><text class="dg-t-muted" x="220" y="76" text-anchor="middle" style="font-size:13px">rotate left at 10</text><text class="dg-t-b" x="60" y="6" text-anchor="middle" style="font-size:13px">balance −2</text></svg><ul class="dg-legend"><li><span class="dg-swatch b"></span>unbalanced node</li></ul><figcaption>RR case: 10 has balance factor −2 and the new key went right, then right. One left rotation at 10 fixes it.</figcaption></figure>

**Insert 25.** It goes to the left of 30. All balance factors are within range.

**Insert 28.** It goes to the right of 25. Node 30 now has balance factor $+2$, and the path from 30 goes left (to 25) then right (to 28): **LR case**. Rotate left at 25, then right at 30.

<figure class="diagram"><svg style="--dg-min:460px" class="dg" viewBox="0 0 680 250" role="img" aria-labelledby="avllr-t"><title id="avllr-t">Inserting 28 unbalances 30 (LR case): a left rotation at 25 then a right rotation at 30 make 28 the parent of 25 and 30.</title><defs><marker id="ah-avllr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-avllr-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-a" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-avllr-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-b" d="M0,0 L10,5 L0,10 z"/></marker></defs><line class="dg-line" x1="78.5" y1="43.8" x2="51.5" y2="76.2"/><line class="dg-line" x1="101.5" y1="43.8" x2="128.5" y2="76.2"/><line class="dg-line" x1="133.1" y1="106.6" x2="121.9" y2="133.4"/><line class="dg-line" x1="118.7" y1="167.6" x2="123.8" y2="192.4"/><line class="dg-line" x1="308.5" y1="43.8" x2="281.5" y2="76.2"/><line class="dg-line" x1="331.5" y1="43.8" x2="358.5" y2="76.2"/><line class="dg-line" x1="363.1" y1="106.6" x2="351.9" y2="133.4"/><line class="dg-line" x1="341.3" y1="167.6" x2="336.2" y2="192.4"/><line class="dg-line" x1="568.5" y1="43.8" x2="541.5" y2="76.2"/><line class="dg-line" x1="591.5" y1="43.8" x2="618.5" y2="76.2"/><line class="dg-line" x1="623.1" y1="106.6" x2="611.9" y2="133.4"/><line class="dg-line" x1="636.9" y1="106.6" x2="648.1" y2="133.4"/><line class="dg-line" x1="196" y1="120" x2="250" y2="120" marker-end="url(#ah-avllr)"/><line class="dg-line" x1="430" y1="120" x2="500" y2="120" marker-end="url(#ah-avllr)"/><circle class="dg-cell" cx="40" cy="90" r="18"/><text x="40" y="90" text-anchor="middle">10</text><circle class="dg-cell-c" cx="127.5" cy="210" r="18"/><text class="dg-t-c" x="127.5" y="210" text-anchor="middle">28</text><circle class="dg-cell-a" cx="115" cy="150" r="18"/><text class="dg-t-a" x="115" y="150" text-anchor="middle">25</text><circle class="dg-cell-b" cx="140" cy="90" r="18"/><text class="dg-t-b" x="140" y="90" text-anchor="middle">30</text><circle class="dg-cell" cx="90" cy="30" r="18"/><text x="90" y="30" text-anchor="middle">20</text><circle class="dg-cell" cx="270" cy="90" r="18"/><text x="270" y="90" text-anchor="middle">10</text><circle class="dg-cell-a" cx="332.5" cy="210" r="18"/><text class="dg-t-a" x="332.5" y="210" text-anchor="middle">25</text><circle class="dg-cell-c" cx="345" cy="150" r="18"/><text class="dg-t-c" x="345" y="150" text-anchor="middle">28</text><circle class="dg-cell-b" cx="370" cy="90" r="18"/><text class="dg-t-b" x="370" y="90" text-anchor="middle">30</text><circle class="dg-cell" cx="320" cy="30" r="18"/><text x="320" y="30" text-anchor="middle">20</text><circle class="dg-cell" cx="530" cy="90" r="18"/><text x="530" y="90" text-anchor="middle">10</text><circle class="dg-cell-a" cx="605" cy="150" r="18"/><text class="dg-t-a" x="605" y="150" text-anchor="middle">25</text><circle class="dg-cell-b" cx="655" cy="150" r="18"/><text class="dg-t-b" x="655" y="150" text-anchor="middle">30</text><circle class="dg-cell-c" cx="630" cy="90" r="18"/><text class="dg-t-c" x="630" y="90" text-anchor="middle">28</text><circle class="dg-cell" cx="580" cy="30" r="18"/><text x="580" y="30" text-anchor="middle">20</text><text class="dg-t-muted" x="223" y="106" text-anchor="middle" style="font-size:13px">left at 25</text><text class="dg-t-muted" x="465" y="106" text-anchor="middle" style="font-size:13px">right at 30</text></svg><ul class="dg-legend"><li><span class="dg-swatch b"></span>unbalanced node 30</li><li><span class="dg-swatch c"></span>new key 28</li></ul><figcaption>LR case: from 30 the path to the new key goes left (to 25) then right (to 28). Rotate left at the child 25, then right at 30.</figcaption></figure>

The final tree has root 20 with balance factor $-1$: balanced.

:::tip[Exam method]
1. Insert as in a normal BST.
2. Recompute balance factors on the path back to the root.
3. Fix the **first** node that reaches $\pm 2$. Name the case by the next **two** steps from it towards the new key.
4. Show the tree after every rotation.
:::

## 2. Red–black trees

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

## 3. B-trees

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

<figure class="diagram"><svg style="--dg-min:460px" class="dg" viewBox="0 0 560 170" role="img" aria-labelledby="bsplit-t"><title id="bsplit-t">A B-tree node of order 3 holding 10 and 20 overflows when 30 is added and splits: 20 moves up, 10 and 30 become two nodes.</title><defs><marker id="ah-bsplit" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-bsplit-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-a" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-bsplit-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-b" d="M0,0 L10,5 L0,10 z"/></marker></defs><line class="dg-line" x1="160" y1="77" x2="196" y2="77" marker-end="url(#ah-bsplit)"/><line class="dg-line" x1="336" y1="77" x2="372" y2="77" marker-end="url(#ah-bsplit)"/><line class="dg-line" x1="446" y1="54" x2="414" y2="110"/><line class="dg-line" x1="466" y1="54" x2="498" y2="110"/><rect class="dg-cell" x="16" y="60" width="40" height="34" rx="4"/><text x="36" y="77" text-anchor="middle">10</text><rect class="dg-cell" x="56" y="60" width="40" height="34" rx="4"/><text x="76" y="77" text-anchor="middle">20</text><text class="dg-t-b" x="118" y="77">+ 30</text><rect class="dg-cell" x="204" y="60" width="40" height="34" rx="4"/><text x="224" y="77" text-anchor="middle">10</text><rect class="dg-cell-b" x="244" y="60" width="40" height="34" rx="4"/><text class="dg-t-b" x="264" y="77" text-anchor="middle">20</text><rect class="dg-cell" x="284" y="60" width="40" height="34" rx="4"/><text x="304" y="77" text-anchor="middle">30</text><text class="dg-t-b" x="264" y="118" text-anchor="middle" style="font-size:13px">overflow</text><rect class="dg-cell-b" x="436" y="20" width="40" height="34" rx="4"/><text class="dg-t-b" x="456" y="37" text-anchor="middle">20</text><rect class="dg-cell" x="390" y="112" width="40" height="34" rx="4"/><text x="410" y="129" text-anchor="middle">10</text><rect class="dg-cell" x="482" y="112" width="40" height="34" rx="4"/><text x="502" y="129" text-anchor="middle">30</text></svg><ul class="dg-legend"><li><span class="dg-swatch b"></span>median key</li></ul><figcaption>Order 3 allows at most 2 keys per node. The overflowing node splits around its median, which moves up; here it becomes a new root, so the tree grows taller from the top.</figcaption></figure>

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

## Summary

- AVL: balance factor $\in \{-1, 0, 1\}$ at every node; height $< 1.44 \log_2 n$.
- Fix the first unbalanced node: LL → right rotation, RR → left, LR → left then right, RL → right then left.
- Red–black: root and NIL leaves black, no red–red, equal black height; $h \le 2\log_2(n + 1)$; fewer rotations than AVL.
- B-tree of order $m$: at most $m - 1$ keys per node, all leaves at the same depth; overflowing nodes split around the median.
- B+ trees keep all records in linked leaves, ideal for range queries; databases and file systems use them.

## Check yourself

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
