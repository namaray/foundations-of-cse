---
title: Trees & Binary Search Trees
description: Tree terminology, binary tree properties and formulas, the four traversals, building a tree from traversals, and BST search, insertion and deletion.
sidebar:
  label: "7. Trees and BSTs"
  order: 7
lesson:
  module: Hashing and trees
  prerequisites:
    - label: Queues
      link: /data-structures/queues/
  outcomes:
    - Use tree terminology (depth, height, degree, leaf) correctly
    - State the node-count properties of binary trees
    - Traverse a tree in preorder, inorder, postorder and level order, and rebuild it from two traversals
    - Search, insert and delete in a BST, including the two-child case
  keyIdea: >-
    A tree is a hierarchy with one root and no cycles. In a **binary search tree** every left subtree holds smaller keys and every right subtree larger ones, so search, insert and delete follow one root-to-leaf path: $O(h)$. That is $O(\log n)$ when the tree is balanced and $O(n)$ when it degenerates into a chain.
---

A **tree** is a hierarchical structure of nodes connected by edges, with one **root** and no cycles. A tree with $n$ nodes always has exactly $n - 1$ edges.

## 1. Terminology

<figure class="diagram"><svg style="--dg-min:440px" class="dg" viewBox="0 0 440 220" role="img" aria-labelledby="tterm-t"><title id="tterm-t">A tree with root A, children B and C, and leaves D, E and F.</title><defs><marker id="ah-tterm" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-tterm-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-a" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-tterm-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-b" d="M0,0 L10,5 L0,10 z"/></marker></defs><line class="dg-line" x1="156.6" y1="42" x2="103.4" y2="90"/><line class="dg-line" x1="81.3" y1="117.7" x2="58.7" y2="158.3"/><line class="dg-line" x1="98.7" y1="117.7" x2="121.3" y2="158.3"/><line class="dg-line" x1="183.4" y1="42" x2="236.6" y2="90"/><line class="dg-line" x1="258.7" y1="117.7" x2="281.3" y2="158.3"/><circle class="dg-cell-c" cx="50" cy="174" r="18"/><text class="dg-t-c" x="50" y="174" text-anchor="middle">D</text><circle class="dg-cell-c" cx="130" cy="174" r="18"/><text class="dg-t-c" x="130" y="174" text-anchor="middle">E</text><circle class="dg-cell" cx="90" cy="102" r="18"/><text x="90" y="102" text-anchor="middle">B</text><circle class="dg-cell-c" cx="290" cy="174" r="18"/><text class="dg-t-c" x="290" y="174" text-anchor="middle">F</text><circle class="dg-cell" cx="250" cy="102" r="18"/><text x="250" y="102" text-anchor="middle">C</text><circle class="dg-cell-a" cx="170" cy="30" r="18"/><text class="dg-t-a" x="170" y="30" text-anchor="middle">A</text><text class="dg-t-muted" x="330" y="30">depth 0  (root)</text><text class="dg-t-muted" x="330" y="102">depth 1</text><text class="dg-t-muted" x="330" y="174">depth 2  (leaves)</text></svg><ul class="dg-legend"><li><span class="dg-swatch a"></span>root</li><li><span class="dg-swatch c"></span>leaf</li></ul><figcaption>The tree used in the table below. It has 6 nodes and 5 edges, and its height is 2 (counting edges).</figcaption></figure>

| Term | Meaning (using the tree above) |
|---|---|
| Root | The top node: **A** |
| Parent / child | B is the parent of D and E |
| Siblings | Nodes with the same parent: D and E |
| Leaf | A node with no children: D, E, F |
| Internal node | A node with at least one child: A, B, C |
| Degree of a node | Number of children: deg(B) = 2, deg(C) = 1 |
| Depth of a node | Edges from the root to the node: depth(E) = 2 |
| Height of a node | Edges on the longest path down to a leaf: height(B) = 1 |
| Height of the tree | Height of the root: **2** |
| Subtree | A node together with all its descendants |

:::note[Conventions differ]
Some textbooks count height in **nodes** rather than edges, so a single node has height 1 instead of 0. State which convention you are using in exams.
:::

## 2. Binary trees

A **binary tree** gives every node at most two children, called **left** and **right**.

| Kind | Definition |
|---|---|
| Full (strict) | Every node has 0 or 2 children |
| Complete | Every level is full except possibly the last, which is filled from the left |
| Perfect | All internal nodes have 2 children and all leaves are at the same depth |
| Skewed | Every node has only one child; the tree is effectively a linked list |

### Properties to memorise

With the root at level 0 and height counted in edges:

- Maximum nodes at level $i$: $2^i$
- Maximum nodes in a tree of height $h$: $2^{h+1} - 1$
- Minimum height of a binary tree with $n$ nodes: $\lfloor \log_2 n \rfloor$
- In any binary tree, $n_0 = n_2 + 1$, where $n_0$ is the number of leaves and $n_2$ the number of nodes with two children
- Number of structurally different binary trees with $n$ nodes is the Catalan number $C_n = \dfrac{1}{n+1}\dbinom{2n}{n}$. For $n = 3$ that is **5**.

### Array representation

A **complete** binary tree fits neatly in an array with no pointers. With 0-based indexing, for the node at index $i$:

$$
\text{left} = 2i + 1, \qquad \text{right} = 2i + 2, \qquad \text{parent} = \left\lfloor \frac{i - 1}{2} \right\rfloor
$$

This is exactly how [heaps](/data-structures/heaps/) are stored. For a skewed tree it wastes a lot of space, so linked nodes are used instead:

```c
typedef struct TreeNode {
    int key;
    struct TreeNode *left, *right;
} TreeNode;
```

## 3. Traversals

| Traversal | Order | Result for the tree above |
|---|---|---|
| Preorder | **Node**, left, right | A B D E C F |
| Inorder | Left, **node**, right | D B E A C F |
| Postorder | Left, right, **node** | D E B F C A |
| Level order | Level by level, left to right (uses a queue) | A B C D E F |

```c
void inorder(TreeNode *t) {
    if (!t) return;
    inorder(t->left);
    printf("%d ", t->key);
    inorder(t->right);
}
```

All four traversals take $O(n)$ time. The recursive ones use $O(h)$ stack space.

### Building a tree from traversals

**Inorder plus preorder** (or inorder plus postorder) identifies a binary tree uniquely. Preorder plus postorder alone does not, unless the tree is full.

**Example.** Preorder `A B D E C F`, inorder `D B E A C F`.

1. The first preorder item, **A**, is the root.
2. In the inorder list, everything left of A (`D B E`) is the left subtree and everything right (`C F`) is the right subtree.
3. Repeat on each part: the next preorder item, **B**, is the root of `D B E`, so D is its left child and E its right child.
4. In `C F`, **C** comes first in preorder, so it is the root, and F is to its right in inorder, so F is C's right child.

This rebuilds the tree shown at the top of the page.

## 4. Binary search trees (BST)

A **BST** is a binary tree where, for every node, all keys in the **left** subtree are smaller and all keys in the **right** subtree are larger. An inorder traversal of a BST therefore lists the keys in **sorted order**.

### Search

Compare with the root and go left or right. Each step goes one level down, so the cost is $O(h)$.

```c
TreeNode *search(TreeNode *t, int key) {
    while (t && t->key != key)
        t = (key < t->key) ? t->left : t->right;
    return t;
}
```

### Insertion

Search for the key; where the search falls off the tree, attach a new leaf.

**Example:** insert 50, 30, 70, 20, 40, 60, 80 in that order.

<figure class="diagram"><svg style="--dg-min:440px" class="dg" viewBox="0 0 440 220" role="img" aria-labelledby="bstins-t"><title id="bstins-t">The BST built from 50, 30, 70, 20, 40, 60, 80; inserting 60 went right at 50 and left at 70.</title><defs><marker id="ah-bstins" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-bstins-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-a" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-bstins-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-b" d="M0,0 L10,5 L0,10 z"/></marker></defs><line class="dg-line" x1="204.9" y1="39.9" x2="125.1" y2="92.1"/><line class="dg-line" x1="99.1" y1="116.3" x2="65.9" y2="159.7"/><line class="dg-line" x1="120.9" y1="116.3" x2="154.1" y2="159.7"/><line class="dg-line-a" x1="235.1" y1="39.9" x2="314.9" y2="92.1"/><line class="dg-line-a" x1="319.1" y1="116.3" x2="285.9" y2="159.7"/><line class="dg-line" x1="340.9" y1="116.3" x2="374.1" y2="159.7"/><circle class="dg-cell" cx="55" cy="174" r="18"/><text x="55" y="174" text-anchor="middle">20</text><circle class="dg-cell" cx="165" cy="174" r="18"/><text x="165" y="174" text-anchor="middle">40</text><circle class="dg-cell" cx="110" cy="102" r="18"/><text x="110" y="102" text-anchor="middle">30</text><circle class="dg-cell-b" cx="275" cy="174" r="18"/><text class="dg-t-b" x="275" y="174" text-anchor="middle">60</text><circle class="dg-cell" cx="385" cy="174" r="18"/><text x="385" y="174" text-anchor="middle">80</text><circle class="dg-cell-a" cx="330" cy="102" r="18"/><text class="dg-t-a" x="330" y="102" text-anchor="middle">70</text><circle class="dg-cell-a" cx="220" cy="30" r="18"/><text class="dg-t-a" x="220" y="30" text-anchor="middle">50</text><text class="dg-t-a" x="330" y="16" style="font-size:13px">60 &gt; 50: go right</text><text class="dg-t-a" x="352" y="120" style="font-size:13px">60 &lt; 70: go left</text></svg><ul class="dg-legend"><li><span class="dg-swatch a"></span>search path</li><li><span class="dg-swatch b"></span>new leaf</li></ul><figcaption>Each insertion walks down from the root, going left for smaller keys and right for larger ones, and attaches a new leaf where it falls off. The path for 60 is highlighted.</figcaption></figure>

### Deletion: three cases

1. **Leaf:** remove it.
2. **One child:** replace the node with its child.
3. **Two children:** replace the node's key with its **inorder successor** (the smallest key in its right subtree), then delete that successor, which has at most one child. Using the inorder predecessor works too.

**Example.** Deleting **50** from the tree above: the inorder successor is **60**. Copy 60 into the root and delete the original 60 leaf.

<figure class="diagram"><svg style="--dg-min:460px" class="dg" viewBox="0 0 600 210" role="img" aria-labelledby="bstdel-t"><title id="bstdel-t">Deleting 50, which has two children: its inorder successor 60 is copied into the root and the old 60 leaf is removed.</title><defs><marker id="ah-bstdel" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-bstdel-a" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-a" d="M0,0 L10,5 L0,10 z"/></marker><marker id="ah-bstdel-b" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="dg-head-b" d="M0,0 L10,5 L0,10 z"/></marker></defs><line class="dg-line" x1="127.3" y1="42.7" x2="82.7" y2="87.3"/><line class="dg-line" x1="62" y1="116.1" x2="43" y2="153.9"/><line class="dg-line" x1="78" y1="116.1" x2="97" y2="153.9"/><line class="dg-line" x1="152.7" y1="42.7" x2="197.3" y2="87.3"/><line class="dg-line" x1="202" y1="116.1" x2="183" y2="153.9"/><line class="dg-line" x1="218" y1="116.1" x2="237" y2="153.9"/><line class="dg-line" x1="447.3" y1="42.7" x2="402.7" y2="87.3"/><line class="dg-line" x1="382" y1="116.1" x2="363" y2="153.9"/><line class="dg-line" x1="398" y1="116.1" x2="417" y2="153.9"/><line class="dg-line" x1="472.7" y1="42.7" x2="517.3" y2="87.3"/><line class="dg-line" x1="538" y1="116.1" x2="557" y2="153.9"/><line class="dg-line" x1="268" y1="100" x2="330" y2="100" marker-end="url(#ah-bstdel)"/><circle class="dg-cell" cx="35" cy="170" r="18"/><text x="35" y="170" text-anchor="middle">20</text><circle class="dg-cell" cx="105" cy="170" r="18"/><text x="105" y="170" text-anchor="middle">40</text><circle class="dg-cell" cx="70" cy="100" r="18"/><text x="70" y="100" text-anchor="middle">30</text><circle class="dg-cell-c" cx="175" cy="170" r="18"/><text class="dg-t-c" x="175" y="170" text-anchor="middle">60</text><circle class="dg-cell" cx="245" cy="170" r="18"/><text x="245" y="170" text-anchor="middle">80</text><circle class="dg-cell" cx="210" cy="100" r="18"/><text x="210" y="100" text-anchor="middle">70</text><circle class="dg-cell-b" cx="140" cy="30" r="18"/><text class="dg-t-b" x="140" y="30" text-anchor="middle">50</text><circle class="dg-cell" cx="355" cy="170" r="18"/><text x="355" y="170" text-anchor="middle">20</text><circle class="dg-cell" cx="425" cy="170" r="18"/><text x="425" y="170" text-anchor="middle">40</text><circle class="dg-cell" cx="390" cy="100" r="18"/><text x="390" y="100" text-anchor="middle">30</text><circle class="dg-cell" cx="565" cy="170" r="18"/><text x="565" y="170" text-anchor="middle">80</text><circle class="dg-cell" cx="530" cy="100" r="18"/><text x="530" y="100" text-anchor="middle">70</text><circle class="dg-cell-c" cx="460" cy="30" r="18"/><text class="dg-t-c" x="460" y="30" text-anchor="middle">60</text><text class="dg-t-muted" x="299" y="86" text-anchor="middle" style="font-size:13px">delete 50</text></svg><ul class="dg-legend"><li><span class="dg-swatch b"></span>node to delete</li><li><span class="dg-swatch c"></span>inorder successor</li></ul><figcaption>Deleting a node with two children: copy in the inorder successor (the smallest key in the right subtree, here 60), then delete that successor, which has at most one child.</figcaption></figure>

### Cost depends on height

| | Balanced BST | Skewed BST |
|---|---|---|
| Height | $O(\log n)$ | $O(n)$ |
| Search, insert, delete | $O(\log n)$ | $O(n)$ |

Inserting keys in sorted order (1, 2, 3, 4, …) produces a skewed tree that is no better than a linked list. [Self-balancing trees](/data-structures/balanced-trees/) fix this.

## Summary

- $n$ nodes have $n - 1$ edges; depth counts down from the root, height up from the deepest leaf.
- Full, complete, perfect and skewed binary trees; a perfect tree of height $h$ has $2^{h+1} - 1$ nodes.
- Preorder (node first), inorder (node middle), postorder (node last), level order (queue): all $O(n)$.
- Inorder plus preorder or postorder rebuilds a binary tree uniquely.
- BST: inorder traversal gives sorted order; search, insert and delete cost $O(h)$.
- Deleting a node with two children: copy in its inorder successor, then delete the successor.

## Check yourself

<details>
<summary>Why does an inorder traversal of a BST give sorted output?</summary>

Inorder visits the whole left subtree (all smaller keys), then the node, then the whole right subtree (all larger keys). Applied recursively, every key is printed after all smaller keys and before all larger ones.
</details>

<details>
<summary>What is the worst-case time to search a BST, and when does it happen?</summary>

$O(n)$, when the tree is skewed. That happens, for example, when keys are inserted in sorted order.
</details>

<details>
<summary>Can preorder and postorder together reconstruct a binary tree?</summary>

Not uniquely in general. For example, a root with a single left child and a root with a single right child have the same preorder and postorder. You need inorder together with one of the other two (unless the tree is known to be full).
</details>

<details>
<summary>Prove that a tree with n nodes has n − 1 edges.</summary>

Every node except the root has exactly one edge connecting it to its parent, and every edge connects some child to its parent. So there is one edge per non-root node: $n - 1$ edges.
</details>
