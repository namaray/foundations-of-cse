---
title: 2D Transformations
description: Translation, scaling, rotation, reflection and shear, homogeneous coordinates and 3×3 matrices, composite transformations, rotation and scaling about an arbitrary point, reflection about an arbitrary line, and why order matters.
sidebar:
  label: "4. 2D transformations"
  order: 4
lesson:
  module: Transformations and viewing
  prerequisites:
    - label: Filling and clipping
      link: /computer-graphics/filling-and-clipping/
    - label: Linear algebra (matrices)
      link: /linear-algebra/
  outcomes:
    - Write the homogeneous matrices for translation, scaling, rotation, reflection and shear
    - Explain why homogeneous coordinates are used
    - Build a composite matrix for rotation or scaling about an arbitrary point
    - Explain why the order of transformations matters
  keyIdea: >-
    Writing a 2D point as $(x, y, 1)$ (**homogeneous coordinates**) lets every basic transformation, including translation, be a $3 \times 3$ matrix. A sequence of transformations then **multiplies** into a single matrix. To rotate or scale about a point other than the origin, **translate it to the origin, transform, and translate back**.
---

## 1. The basic transformations

| Transformation | Equations | Notes |
|---|---|---|
| **Translation** by $(t_x, t_y)$ | $x' = x + t_x$, $y' = y + t_y$ | Moves without changing shape |
| **Scaling** by $(s_x, s_y)$ | $x' = s_x x$, $y' = s_y y$ | About the origin; $s_x = s_y$ is uniform |
| **Rotation** by $\theta$ | $x' = x\cos\theta - y\sin\theta$, $y' = x\sin\theta + y\cos\theta$ | About the origin, anticlockwise for $\theta > 0$ |
| **Reflection** | About the x-axis $(x, -y)$; y-axis $(-x, y)$; origin $(-x, -y)$; line $y = x$ gives $(y, x)$ | A scaling by −1, or a swap |
| **Shear** | x-shear $x' = x + sh_x \cdot y$; y-shear $y' = y + sh_y \cdot x$ | Slants the shape |

**Example.** Rotating (4, 3) by 90° ($\cos = 0$, $\sin = 1$): $x' = 0 - 3 = -3$, $y' = 4 + 0 = 4$, giving $(-3, 4)$.

## 2. Homogeneous coordinates

Scaling and rotation are matrix **multiplications**, but translation is an **addition**, so it doesn't fit a $2 \times 2$ matrix. Adding a third coordinate, $(x, y) \to (x, y, 1)$, makes all of them $3 \times 3$ matrices:

$$
T = \begin{bmatrix} 1 & 0 & t_x \\ 0 & 1 & t_y \\ 0 & 0 & 1 \end{bmatrix} \quad
S = \begin{bmatrix} s_x & 0 & 0 \\ 0 & s_y & 0 \\ 0 & 0 & 1 \end{bmatrix} \quad
R = \begin{bmatrix} \cos\theta & -\sin\theta & 0 \\ \sin\theta & \cos\theta & 0 \\ 0 & 0 & 1 \end{bmatrix}
$$

$$
\text{Shear}_x = \begin{bmatrix} 1 & sh_x & 0 \\ 0 & 1 & 0 \\ 0 & 0 & 1 \end{bmatrix} \quad
\text{Reflect}_{y=x} = \begin{bmatrix} 0 & 1 & 0 \\ 1 & 0 & 0 \\ 0 & 0 & 1 \end{bmatrix}
$$

A point is transformed as $P' = M \cdot P$ with $P$ a column vector $[x, y, 1]^T$. (Some books use row vectors, $P' = P \cdot M$, with the matrices transposed and the multiplication order reversed.)

**Why it matters:** a whole chain of transformations multiplies into **one matrix**, computed once and applied to thousands of vertices. A homogeneous point $(x, y, w)$ with $w \ne 1$ represents $(x/w, y/w)$, which becomes essential for perspective projection.

**Inverses:** $T^{-1}$ translates by $(-t_x, -t_y)$; $S^{-1}$ scales by $(1/s_x, 1/s_y)$; $R^{-1}(\theta) = R(-\theta) = R^T$ (rotation matrices are orthogonal).

## 3. Composite transformations and order

To apply $M_1$ first, then $M_2$, then $M_3$:

$$
P' = M_3 \cdot M_2 \cdot M_1 \cdot P
$$

The matrix applied **first** is written **rightmost**.

Matrix multiplication is **not commutative**, so the order matters: "rotate then translate" moves the rotated object along the original axes, while "translate then rotate" swings the moved object around the origin. Some pairs do commute: two translations, two rotations about the same point, two scalings.

## 4. Rotation about an arbitrary point

To rotate by $\theta$ about a pivot $(x_r, y_r)$:

1. **Translate** the pivot to the origin: $T(-x_r, -y_r)$.
2. **Rotate** by $\theta$: $R(\theta)$.
3. **Translate back**: $T(x_r, y_r)$.

$$
M = T(x_r, y_r)\, R(\theta)\, T(-x_r, -y_r)
$$

**Example.** Rotate (5, 3) by 90° about (2, 2).

- Translate: $(5 - 2, 3 - 2) = (3, 1)$.
- Rotate 90°: $(-1, 3)$.
- Translate back: $(-1 + 2, 3 + 2) = $ **(1, 5)**.

**Scaling about a fixed point** $(x_f, y_f)$ works the same way: $M = T(x_f, y_f)\, S(s_x, s_y)\, T(-x_f, -y_f)$, which gives $x' = x_f + s_x(x - x_f)$. For example, scaling (6, 4) by 2 about (2, 2) gives $(2 + 2 \times 4,\ 2 + 2 \times 2) = (10, 6)$, while the fixed point stays put.

## 5. Reflection about an arbitrary line

To reflect about a line $y = mx + c$ at angle $\theta = \tan^{-1} m$ to the x-axis:

1. Translate by $(0, -c)$ so the line passes through the origin.
2. Rotate by $-\theta$ so the line lies on the x-axis.
3. Reflect about the x-axis.
4. Rotate by $+\theta$.
5. Translate by $(0, c)$.

$$
M = T(0, c)\, R(\theta)\, \text{Ref}_x\, R(-\theta)\, T(0, -c)
$$

The same pattern (move to a standard position, do the simple thing, undo the move) solves most "about an arbitrary …" questions, in 2D and 3D.

## Summary

- Homogeneous coordinates $(x, y, 1)$ make translation a matrix, so any chain becomes one $3 \times 3$ matrix.
- $P' = M_n \cdots M_2 M_1 P$: the first transformation is rightmost; order matters.
- Rotation: $x' = x\cos\theta - y\sin\theta$, $y' = x\sin\theta + y\cos\theta$.
- About a point: $T(p)\,R\,T(-p)$ or $T(p)\,S\,T(-p)$. About a line: translate, rotate to the axis, reflect, undo.
- Inverses: $T(-t)$, $S(1/s)$, $R(-\theta) = R^T$.

## Check yourself

<details>
<summary>Rotate the point (2, 0) by 90° about (1, 1).</summary>

Translate to $(1, -1)$; rotate to $(1, 1)$; translate back to $(2, 2)$.
</details>

<details>
<summary>What single matrix reflects a point about the line y = x? Where does (3, 7) go?</summary>

The matrix that swaps $x$ and $y$; (3, 7) goes to (7, 3).
</details>

<details>
<summary>Why can't 2D translation be written as a 2 × 2 matrix?</summary>

A $2 \times 2$ matrix always maps the origin to itself (it is linear), but translation moves the origin. Homogeneous coordinates add the extra column that holds the translation.
</details>
