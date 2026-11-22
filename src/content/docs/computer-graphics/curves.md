---
title: Curves
description: Parametric curves, continuity (C0, C1, C2 and G1), interpolation versus approximation, Hermite curves, Bézier curves with Bernstein polynomials and de Casteljau's algorithm, worked examples, and B-splines with local control.
sidebar:
  label: "7. Curves"
  order: 7
lesson:
  module: Rendering and curves
  prerequisites:
    - label: 2D transformations
      link: /computer-graphics/2d-transformations/
  outcomes:
    - Explain parametric curves and parametric and geometric continuity
    - Evaluate a Bézier curve with Bernstein polynomials or de Casteljau's algorithm
    - List the main properties of Bézier curves
    - Explain how B-splines improve on Bézier curves with local control
  keyIdea: >-
    Smooth shapes are modelled as **parametric curves** $P(t)$ controlled by a few **control points**. A **Bézier** curve passes through its first and last control points and is pulled towards the others; moving any point changes the whole curve. **B-splines** join low-degree pieces smoothly, so each control point affects only a local part of the curve.
---

## 1. Parametric curves and continuity

A **parametric** curve gives each coordinate as a function of a parameter $t \in [0, 1]$: $P(t) = (x(t), y(t))$. Unlike $y = f(x)$, it handles loops and vertical tangents, and it is easy to transform (transform the control points). Cubic polynomials are the usual choice: the lowest degree that can bend in 3D and join smoothly.

Long curves are built from **pieces**; continuity describes how smoothly they join:

| Continuity | Meaning at the joint |
|---|---|
| $C^0$ | The pieces meet (same point) |
| $C^1$ | Same first derivative (same tangent direction **and** speed) |
| $C^2$ | Same second derivative (same curvature change) |
| $G^1$ | Tangents point in the same direction, possibly with different lengths (looks smooth) |

**Interpolating** curves pass through all their control points; **approximating** curves only follow them (Bézier and B-splines mostly approximate).

**Hermite curves** are defined by two endpoints and the **tangent vectors** at them. They are interpolating, and they are the basis of cardinal and Catmull–Rom splines used in animation paths.

## 2. Bézier curves

A Bézier curve with $n + 1$ control points $P_0, \dots, P_n$ has degree $n$:

$$
P(t) = \sum_{i=0}^{n} \binom{n}{i} t^i (1 - t)^{n-i}\, P_i \qquad 0 \le t \le 1
$$

The weights $B_{i,n}(t) = \binom{n}{i} t^i (1-t)^{n-i}$ are the **Bernstein polynomials**; they are never negative and always sum to 1.

**Cubic** ($n = 3$, four control points):

$$
P(t) = (1-t)^3 P_0 + 3t(1-t)^2 P_1 + 3t^2(1-t) P_2 + t^3 P_3
$$

**Example (quadratic).** $P_0 = (0, 0)$, $P_1 = (2, 4)$, $P_2 = (4, 0)$, at $t = 0.5$: weights $(1-t)^2 = 0.25$, $2t(1-t) = 0.5$, $t^2 = 0.25$, so $P(0.5) = 0.25(0, 0) + 0.5(2, 4) + 0.25(4, 0) = $ **(2, 2)**. The curve reaches only halfway to $P_1$'s height.

**Example (cubic).** $P_0 = (0, 0)$, $P_1 = (1, 3)$, $P_2 = (3, 3)$, $P_3 = (4, 0)$, at $t = 0.5$: weights 0.125, 0.375, 0.375, 0.125, so $P(0.5) = (0.375 + 1.125 + 0.5,\ 1.125 + 1.125) = $ **(2, 2.25)**.

## 3. De Casteljau's algorithm

Evaluate a Bézier curve by **repeated linear interpolation**: for a given $t$, interpolate between each pair of neighbouring control points, then between those results, until one point remains.

For the cubic example at $t = 0.5$:

```text
Level 0:  (0,0)      (1,3)       (3,3)       (4,0)
Level 1:     (0.5,1.5)    (2,3)       (3.5,1.5)
Level 2:          (1.25,2.25)  (2.75,2.25)
Level 3:                 (2, 2.25)        ← P(0.5)
```

It is numerically stable, and the intermediate points also **split** the curve into two Bézier curves at $t$ (used for subdivision and rendering).

## 4. Properties of Bézier curves

- **Endpoint interpolation:** passes through $P_0$ (at $t = 0$) and $P_n$ (at $t = 1$).
- **Endpoint tangents:** the curve leaves $P_0$ towards $P_1$ and arrives at $P_n$ from $P_{n-1}$. So joining two pieces with $C^1$ continuity needs the three points around the joint to be **collinear** and evenly spaced.
- **Convex hull:** the curve lies inside the convex hull of its control points (useful for clipping and intersection tests).
- **Affine invariance:** transforming the control points transforms the curve.
- **Variation diminishing:** the curve wiggles no more than its control polygon.
- **Global control:** moving any control point changes the **whole** curve.
- **Degree is tied to the number of points:** $n + 1$ points give degree $n$, so many points mean a high, unwieldy degree.

## 5. B-splines

**B-splines** fix the last two problems. A B-spline of degree $d$ is made of polynomial pieces joined at **knots**:

- The **degree is independent** of the number of control points.
- **Local control:** each control point influences only $d + 1$ neighbouring pieces.
- A cubic B-spline has $C^2$ continuity everywhere automatically.
- In general it does **not** pass through its control points (it approximates), unless knots are repeated at the ends (a "clamped" B-spline passes through its endpoints).

**NURBS** (non-uniform rational B-splines) add a weight to each control point. They can represent conics exactly (circles, ellipses) and are the standard in CAD.

| | Bézier | B-spline |
|---|---|---|
| Degree | Number of points − 1 | Chosen independently |
| Control | Global | **Local** |
| Passes through endpoints | Yes | Only if clamped |
| Continuity of a long curve | Must be arranged when joining pieces | Built in ($C^{d-1}$) |

## Summary

- Parametric curves $P(t)$, $t \in [0, 1]$; continuity $C^0$, $C^1$, $C^2$, $G^1$.
- Bézier: $P(t) = \sum \binom{n}{i} t^i(1-t)^{n-i}P_i$; through the endpoints; tangent to the first and last segments; inside the convex hull; global control.
- De Casteljau: repeated linear interpolation; also splits the curve.
- B-splines: degree independent of the point count, local control, $C^2$ for cubics. NURBS add weights.

## Check yourself

<details>
<summary>Where is the quadratic Bézier curve with P₀ = (0, 0), P₁ = (4, 4), P₂ = (8, 0) at t = 0.5?</summary>

$0.25(0, 0) + 0.5(4, 4) + 0.25(8, 0) = (4, 2)$.
</details>

<details>
<summary>How many control points does a cubic Bézier curve have?</summary>

Four.
</details>

<details>
<summary>Why are B-splines preferred over a single Bézier curve for long, complex shapes?</summary>

A single Bézier curve's degree grows with the number of points and every point affects the whole curve; a B-spline keeps a low degree and local control, with smooth joins built in.
</details>
