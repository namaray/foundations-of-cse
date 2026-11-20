---
title: Trees & Binary Search Trees
description: Tree terminology, binary tree properties and formulas, the four traversals, building a tree from traversals, and BST search, insertion and deletion.
sidebar:
  order: 7
---

A **tree** is a hierarchical structure of nodes connected by edges, with one **root** and no cycles. A tree with $n$ nodes always has exactly $n - 1$ edges.

## Terminology

```text
            A          ← root (depth 0)
          /   \
         B     C       ← depth 1
        / \     \
       D   E     F     ← leaves (depth 2)
```

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

## Binary trees

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

## Traversals

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

## Binary search trees (BST)

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

```text
            50
          /    \
        30      70
       /  \    /  \
      20  40  60  80
```

### Deletion: three cases

1. **Leaf:** remove it.
2. **One child:** replace the node with its child.
3. **Two children:** replace the node's key with its **inorder successor** (the smallest key in its right subtree), then delete that successor, which has at most one child. Using the inorder predecessor works too.

**Example.** Deleting **50** from the tree above: the inorder successor is **60**. Copy 60 into the root and delete the original 60 leaf.

```text
            60
          /    \
        30      70
       /  \       \
      20  40      80
```

### Cost depends on height

| | Balanced BST | Skewed BST |
|---|---|---|
| Height | $O(\log n)$ | $O(n)$ |
| Search, insert, delete | $O(\log n)$ | $O(n)$ |

Inserting keys in sorted order (1, 2, 3, 4, …) produces a skewed tree that is no better than a linked list. [Self-balancing trees](/data-structures/balanced-trees/) fix this.

## Viva questions

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
