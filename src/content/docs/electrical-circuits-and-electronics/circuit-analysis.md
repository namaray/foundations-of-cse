---
title: Kirchhoff's Laws, Nodal and Mesh Analysis
description: Kirchhoff's current and voltage laws, nodal analysis and mesh analysis with worked examples, supernodes and supermeshes, and choosing between the two methods.
sidebar:
  label: "2. Nodal and mesh analysis"
  order: 2
lesson:
  module: DC circuits
  prerequisites:
    - label: Circuit basics
      link: /electrical-circuits-and-electronics/circuit-basics/
  outcomes:
    - Apply KCL at nodes and KVL around loops
    - Solve a circuit with nodal analysis
    - Solve a circuit with mesh analysis
    - Choose the more convenient method for a given circuit
  keyIdea: >-
    **KCL**: the currents into a node add to zero (charge is conserved). **KVL**: the voltages around any closed loop add to zero (energy is conserved). **Nodal analysis** applies KCL with node voltages as unknowns; **mesh analysis** applies KVL with loop currents as unknowns. Either turns any circuit into simultaneous equations.
---

## 1. Kirchhoff's laws

**Kirchhoff's current law (KCL):** the algebraic sum of currents at any node is zero. Equivalently, current in = current out.

$$
\sum I_{in} = \sum I_{out}
$$

**Kirchhoff's voltage law (KVL):** the algebraic sum of voltages around any closed loop is zero. Equivalently, the voltage rises equal the voltage drops.

$$
\sum V = 0 \text{ around a loop}
$$

Terms: a **node** is a point where elements connect; a **branch** is a single element between nodes; a **loop** is any closed path; a **mesh** is a loop containing no other loop inside it.

## 2. Nodal analysis

**Steps:**

1. Choose a **reference node** (ground, 0 V), usually the one with the most connections.
2. Label the voltages of the other nodes.
3. Write KCL at each non-reference node, expressing each current through a resistor as (voltage difference) / $R$.
4. Solve the simultaneous equations.

**Worked example.** A 12 V source, positive terminal through $R_1 = 2$ Ω to node $V$. From node $V$, $R_2 = 6$ Ω and $R_3 = 3$ Ω each go to ground.

KCL at $V$ (current in through $R_1$ = currents out through $R_2$ and $R_3$):

$$
\frac{12 - V}{2} = \frac{V}{6} + \frac{V}{3}
$$

Multiply by 6: $3(12 - V) = V + 2V$, so $36 = 6V$ and **$V = 6$ V**.

Currents: through $R_1$: $(12 - 6)/2 = 3$ A; through $R_2$: $6/6 = 1$ A; through $R_3$: $6/3 = 2$ A. Check: $3 = 1 + 2$ ✓.

**Supernode:** if a voltage source connects two non-reference nodes, treat the two nodes and the source as one **supernode**: write KCL for the whole supernode, plus the source's equation ($V_a - V_b = V_s$).

## 3. Mesh analysis

**Steps** (for planar circuits):

1. Assign a **mesh current** to each mesh, all clockwise.
2. Write KVL around each mesh. A resistor shared by two meshes carries the **difference** of their currents.
3. Solve.

**Worked example.** Mesh 1: a 10 V source and $R_1 = 2$ Ω. Mesh 2: $R_3 = 6$ Ω. The meshes share $R_2 = 4$ Ω.

$$
\begin{aligned}
\text{Mesh 1:}\quad & 10 = 2I_1 + 4(I_1 - I_2) \\
\text{Mesh 2:}\quad & 0 = 6I_2 + 4(I_2 - I_1)
\end{aligned}
$$

From mesh 2: $10 I_2 = 4 I_1$, so $I_1 = 2.5 I_2$. Substituting: $10 = 6(2.5 I_2) - 4 I_2 = 11 I_2$.

$$
I_2 = \frac{10}{11} \approx 0.909 \text{ A} \qquad I_1 = 2.5 I_2 \approx 2.273 \text{ A}
$$

The current through the shared 4 Ω resistor is $I_1 - I_2 \approx 1.364$ A.

**Check by simplification:** $4 \parallel 6 = 2.4$ Ω, plus 2 Ω gives 4.4 Ω, so $I_1 = 10/4.4 \approx 2.273$ A ✓.

**Supermesh:** if a current source lies on the boundary between two meshes, write one KVL equation around the combined outer loop, plus the source's equation ($I_a - I_b = I_s$).

## 4. Which method?

| Use nodal analysis when | Use mesh analysis when |
|---|---|
| There are fewer nodes than meshes | There are fewer meshes than nodes |
| The circuit has current sources | The circuit has voltage sources |
| You need node voltages | You need branch currents |
| The circuit is non-planar | — (mesh analysis needs a planar circuit) |

With $n$ nodes, nodal analysis needs $n - 1$ equations; with $b$ branches, mesh analysis needs $b - n + 1$.

## Summary

- KCL: currents at a node sum to zero. KVL: voltages around a loop sum to zero.
- Nodal: pick a ground, write KCL at each other node using $(V_a - V_b)/R$; supernodes handle voltage sources between nodes.
- Mesh: clockwise mesh currents, KVL per mesh, shared resistors carry the difference; supermeshes handle shared current sources.
- Choose the method that gives fewer equations.

## Check yourself

<details>
<summary>Three currents enter a node: 2 A, 3 A and −1 A. What current leaves?</summary>

$2 + 3 - 1 = 4$ A.
</details>

<details>
<summary>How many nodal equations does a circuit with 5 nodes need?</summary>

$5 - 1 = 4$: one per non-reference node.
</details>

<details>
<summary>In mesh analysis, what current flows through a resistor shared by meshes with currents I₁ and I₂ (both clockwise)?</summary>

$I_1 - I_2$ (in the direction of $I_1$): the two clockwise mesh currents flow in opposite directions through the shared branch.
</details>
