---
title: 3D Transformations and Projections
description: 3D homogeneous transformations, rotation about the x, y and z axes and about an arbitrary axis, the viewing transformation, parallel projections (orthographic, oblique, cavalier, cabinet), perspective projection and vanishing points, and the view volume.
sidebar:
  label: "5. 3D and projections"
  order: 5
lesson:
  module: Transformations and viewing
  prerequisites:
    - label: 2D transformations
      link: /computer-graphics/2d-transformations/
  outcomes:
    - Write the 4×4 matrices for 3D translation, scaling and rotation about each axis
    - Outline how to rotate about an arbitrary axis
    - Compare parallel and perspective projections and their subtypes
    - Project a 3D point with a simple perspective projection
  keyIdea: >-
    3D transformations extend 2D ones to $4 \times 4$ homogeneous matrices. A **projection** maps 3D to 2D: **parallel** projections keep parallel lines parallel and preserve relative sizes (engineering drawings), while **perspective** projection divides by depth, so distant objects look smaller and parallel lines meet at **vanishing points** (realism).
---

## 1. 3D transformations

Points become $(x, y, z, 1)$ and matrices are $4 \times 4$.

$$
T = \begin{bmatrix} 1 & 0 & 0 & t_x \\ 0 & 1 & 0 & t_y \\ 0 & 0 & 1 & t_z \\ 0 & 0 & 0 & 1 \end{bmatrix} \qquad
S = \begin{bmatrix} s_x & 0 & 0 & 0 \\ 0 & s_y & 0 & 0 \\ 0 & 0 & s_z & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}
$$

**Rotations about the coordinate axes** (anticlockwise looking from the positive axis towards the origin, right-handed system):

$$
R_z = \begin{bmatrix} \cos\theta & -\sin\theta & 0 & 0 \\ \sin\theta & \cos\theta & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix} \quad
R_x = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & \cos\theta & -\sin\theta & 0 \\ 0 & \sin\theta & \cos\theta & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}
$$

$$
R_y = \begin{bmatrix} \cos\theta & 0 & \sin\theta & 0 \\ 0 & 1 & 0 & 0 \\ -\sin\theta & 0 & \cos\theta & 0 \\ 0 & 0 & 0 & 1 \end{bmatrix}
$$

Memory aid: the axis of rotation keeps a 1 on the diagonal; the other two coordinates rotate in cyclic order $x \to y \to z \to x$. That is why the signs of $\sin\theta$ in $R_y$ look "swapped": in the cycle, $z$ comes before $x$.

## 2. Rotation about an arbitrary axis

To rotate by $\theta$ about an axis through points $P_1$ and $P_2$:

1. **Translate** $P_1$ to the origin.
2. **Rotate about $x$** so the axis lies in the xz-plane.
3. **Rotate about $y$** so the axis lies along the z-axis.
4. **Rotate by $\theta$ about $z$.**
5. Apply the inverses of steps 3, 2 and 1, in that order.

$$
M = T^{-1} R_x^{-1} R_y^{-1}\, R_z(\theta)\, R_y R_x T
$$

It is the same "move to a standard position, do the simple thing, undo" pattern as in 2D. (**Quaternions** are a compact alternative that avoids **gimbal lock** in animation.)

## 3. Viewing

The **viewing transformation** moves the world so that the camera sits at the origin looking along an axis (conventionally $-z$). It is defined by:

- the **eye** (camera position),
- the **look-at** point (or view-plane normal), and
- the **view-up** vector.

From these, build an orthonormal camera frame $(u, v, n)$ and use it as a rotation, combined with a translation by $-\text{eye}$.

## 4. Projections

| Family | Projectors | Preserves | Use |
|---|---|---|---|
| **Parallel** | Parallel to each other (centre of projection at infinity) | Parallel lines, relative lengths along each axis | Engineering and architectural drawings |
| **Perspective** | Meet at a **centre of projection** (the eye) | Straight lines (but not parallelism or sizes) | Realistic images, games, films |

**Parallel projections:**

| Type | Projectors | Notes |
|---|---|---|
| **Orthographic** | Perpendicular to the view plane | **Multiview** (front, top, side views); **axonometric** shows several faces: **isometric** (all three axes equally foreshortened, 120° apart), dimetric, trimetric |
| **Oblique** | At an angle to the view plane | **Cavalier**: 45°, depth drawn at full length (looks too deep). **Cabinet**: about 63.4°, depth drawn at **half** length (looks more natural) |

Orthographic projection onto the xy-plane simply drops $z$: $(x, y, z) \to (x, y)$.

## 5. Perspective projection

With the eye at the origin and the projection plane at distance $d$ (the plane $z = d$), similar triangles give

$$
x_p = \frac{d \cdot x}{z} \qquad y_p = \frac{d \cdot y}{z}
$$

Dividing by $z$ makes **farther objects smaller** (**foreshortening**).

**Example.** $d = 5$, point $(2, 4, 10)$: $x_p = 5 \times 2/10 = 1$ and $y_p = 5 \times 4/10 = 2$, so it projects to **(1, 2)**. The point $(2, 4, 20)$, twice as far, projects to (0.5, 1).

As a homogeneous matrix, the projection puts $z/d$ into $w$; dividing by $w$ (the **perspective divide**) gives the result:

$$
\begin{bmatrix} x \\ y \\ z \\ z/d \end{bmatrix} = \begin{bmatrix} 1 & 0 & 0 & 0 \\ 0 & 1 & 0 & 0 \\ 0 & 0 & 1 & 0 \\ 0 & 0 & 1/d & 0 \end{bmatrix} \begin{bmatrix} x \\ y \\ z \\ 1 \end{bmatrix}
$$

**Vanishing points:** parallel lines not parallel to the view plane appear to converge at a vanishing point. Perspective views are classified by how many of the three principal axes cut the view plane: **one-point**, **two-point** or **three-point** perspective.

## 6. The view volume

Only objects inside the **view volume** are drawn:

- Parallel projection: a rectangular box.
- Perspective projection: a **frustum** (a truncated pyramid) bounded by the **near** and **far** clipping planes and four side planes, set by the **field of view** and aspect ratio.

Graphics systems transform the frustum into a standard cube (normalised device coordinates) so that 3D clipping is done against simple planes.

## Summary

- 3D uses $4 \times 4$ homogeneous matrices; $R_x$, $R_y$, $R_z$ keep the rotation axis fixed.
- Arbitrary axis: translate, align with $z$ using two rotations, rotate, undo.
- Parallel projection: orthographic (multiview, isometric) or oblique (cavalier full depth, cabinet half depth).
- Perspective: $x_p = dx/z$, $y_p = dy/z$; farther looks smaller; one-, two- or three-point perspective.
- The perspective view volume is a frustum with near and far planes.

## Check yourself

<details>
<summary>Project (6, 3, 12) with the projection plane at d = 4.</summary>

$x_p = 4 \times 6/12 = 2$ and $y_p = 4 \times 3/12 = 1$, giving (2, 1).
</details>

<details>
<summary>What is the difference between cavalier and cabinet projection?</summary>

Both are oblique parallel projections. Cavalier draws receding lines at full length; cabinet draws them at half length, which looks more realistic.
</details>

<details>
<summary>Which projection keeps parallel lines parallel?</summary>

Parallel projection. In perspective projection, parallel lines not parallel to the view plane converge to a vanishing point.
</details>
