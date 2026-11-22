---
title: Line and Circle Drawing
description: Scan-converting lines and circles with the DDA algorithm, Bresenham's line algorithm and the midpoint circle algorithm, with full step-by-step traces, eight-way symmetry, and the midpoint ellipse idea.
sidebar:
  label: "2. Lines and circles"
  order: 2
lesson:
  module: Raster graphics
  prerequisites:
    - label: Graphics fundamentals
      link: /computer-graphics/fundamentals/
  outcomes:
    - Trace the DDA algorithm for a line
    - Trace Bresenham's line algorithm and explain its decision parameter
    - Trace the midpoint circle algorithm using eight-way symmetry
    - Explain why integer algorithms are preferred over floating-point ones
  keyIdea: >-
    Scan conversion picks the pixels nearest to an ideal line or curve. **DDA** steps along the line adding floating-point increments. **Bresenham** and the **midpoint** algorithms make the same choices using only integer additions, by tracking a **decision parameter** whose sign says which of two candidate pixels is closer.
---

## 1. The problem

A line from $(x_0, y_0)$ to $(x_1, y_1)$ has slope $m = \Delta y / \Delta x$. The screen has only whole-number pixels, so at each step we pick the pixel closest to the true line. The algorithms below assume $0 \le m \le 1$ (step in $x$, choose $y$); other slopes are handled by symmetry (swap the roles of $x$ and $y$, or step backwards).

## 2. DDA (digital differential analyser)

1. $\text{steps} = \max(\lvert\Delta x\rvert, \lvert\Delta y\rvert)$
2. $x_{inc} = \Delta x / \text{steps}$, $y_{inc} = \Delta y / \text{steps}$
3. Start at $(x_0, y_0)$; repeat `steps` times: $x \mathrel{+}= x_{inc}$, $y \mathrel{+}= y_{inc}$, plot $(\text{round}(x), \text{round}(y))$.

**Trace:** $(2, 3)$ to $(10, 8)$. $\Delta x = 8$, $\Delta y = 5$, steps = 8, $x_{inc} = 1$, $y_{inc} = 0.625$.

| $k$ | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|---|
| $x$ | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
| $y$ (exact) | 3 | 3.625 | 4.25 | 4.875 | 5.5 | 6.125 | 6.75 | 7.375 | 8 |
| Plotted $y$ | 3 | 4 | 4 | 5 | 6 | 6 | 7 | 7 | 8 |

DDA is simple but uses **floating-point** additions and rounding at every step, and rounding error accumulates over long lines.

## 3. Bresenham's line algorithm

At each step the next pixel is either $(x+1, y)$ ("east") or $(x+1, y+1)$ ("north-east"). The **decision parameter** $p_k$ is proportional to the difference between the two candidates' distances from the true line, so its sign decides. It needs only **integer** addition.

For $0 \le m \le 1$:

1. $p_0 = 2\Delta y - \Delta x$
2. At each step $k$:
   - If $p_k < 0$: plot $(x_k + 1, y_k)$, and $p_{k+1} = p_k + 2\Delta y$.
   - Else: plot $(x_k + 1, y_k + 1)$, and $p_{k+1} = p_k + 2\Delta y - 2\Delta x$.
3. Repeat $\Delta x$ times.

**Trace:** $(20, 10)$ to $(30, 18)$. $\Delta x = 10$, $\Delta y = 8$, so $2\Delta y = 16$, $2\Delta y - 2\Delta x = -4$, and $p_0 = 16 - 10 = 6$.

| $k$ | $p_k$ | Next pixel |
|---|---|---|
| 0 | 6 | (21, 11) |
| 1 | 2 | (22, 12) |
| 2 | −2 | (23, 12) |
| 3 | 14 | (24, 13) |
| 4 | 10 | (25, 14) |
| 5 | 6 | (26, 15) |
| 6 | 2 | (27, 16) |
| 7 | −2 | (28, 16) |
| 8 | 14 | (29, 17) |
| 9 | 10 | (30, 18) |

When $p_k \ge 0$, add $-4$; when $p_k < 0$, add 16. The line ends exactly at $(30, 18)$.

<details class="go-deeper">
<summary>Go deeper: where the decision parameter comes from</summary>

At column $x_k + 1$, the true line is at $y = m(x_k + 1) + b$. The distances to the two candidates are $d_1 = y - y_k$ and $d_2 = (y_k + 1) - y$. Then

$$
d_1 - d_2 = 2m(x_k + 1) - 2y_k + 2b - 1
$$

Multiplying by $\Delta x$ (positive) removes the fraction $m = \Delta y/\Delta x$ without changing the sign: $p_k = \Delta x(d_1 - d_2) = 2\Delta y \cdot x_k - 2\Delta x \cdot y_k + c$. Subtracting $p_k$ from $p_{k+1}$ gives $p_{k+1} = p_k + 2\Delta y - 2\Delta x(y_{k+1} - y_k)$, which is the update rule, and substituting the starting point gives $p_0 = 2\Delta y - \Delta x$.
</details>

## 4. The midpoint circle algorithm

A circle has **eight-way symmetry**: computing one point $(x, y)$ in the octant from $(0, r)$ to $x = y$ gives eight points:

$$
(\pm x, \pm y) \quad \text{and} \quad (\pm y, \pm x)
$$

(then add the centre $(x_c, y_c)$). So we compute only one octant, stepping $x$ from 0 until $x \ge y$.

The circle function $f(x, y) = x^2 + y^2 - r^2$ is negative inside the circle and positive outside. At each step, test the **midpoint** between the two candidates $(x+1, y)$ and $(x+1, y-1)$:

1. Start at $(0, r)$ with $p_0 = 1 - r$ (from $\tfrac{5}{4} - r$, rounded for integer radii).
2. At each step, $x_{k+1} = x_k + 1$:
   - If $p_k < 0$ (midpoint inside): keep $y$; $p_{k+1} = p_k + 2x_{k+1} + 1$.
   - Else (midpoint outside or on the circle): $y_{k+1} = y_k - 1$; $p_{k+1} = p_k + 2x_{k+1} + 1 - 2y_{k+1}$.
3. Stop when $x \ge y$.

**Trace:** $r = 10$, centred at the origin. $p_0 = 1 - 10 = -9$.

| $k$ | $p_k$ | Next point | $2x_{k+1}$ | $2y_{k+1}$ |
|---|---|---|---|---|
| — | — | (0, 10) start | — | — |
| 0 | −9 | (1, 10) | 2 | 20 |
| 1 | −6 | (2, 10) | 4 | 20 |
| 2 | −1 | (3, 10) | 6 | 20 |
| 3 | 6 | (4, 9) | 8 | 18 |
| 4 | −3 | (5, 9) | 10 | 18 |
| 5 | 8 | (6, 8) | 12 | 16 |
| 6 | 5 | (7, 7) | 14 | 14 |

At (7, 7), $x = y$, so the octant is complete. Each point gives eight by symmetry; for example (4, 9) also gives (9, 4), (−4, 9), (4, −9) and so on.

**Midpoint ellipse:** the same idea, but an ellipse has only **four-way** symmetry, and the first quadrant is split into two regions (where the slope is shallower or steeper than −1), each with its own decision parameter.

## 5. Comparison

| | DDA | Bresenham / midpoint |
|---|---|---|
| Arithmetic | Floating-point add + rounding | **Integer** add and compare only |
| Speed | Slower | Faster; suits hardware |
| Accuracy | Rounding error can accumulate | Exact choice of the nearest pixel |
| Complexity | Simpler to write | Slightly more logic |

## Summary

- DDA: steps = $\max(\lvert\Delta x\rvert, \lvert\Delta y\rvert)$; add $\Delta x/\text{steps}$ and $\Delta y/\text{steps}$; round.
- Bresenham ($0 \le m \le 1$): $p_0 = 2\Delta y - \Delta x$; $p < 0$ → east, $p \mathrel{+}= 2\Delta y$; else north-east, $p \mathrel{+}= 2\Delta y - 2\Delta x$.
- Midpoint circle: $p_0 = 1 - r$; $p < 0$ → $p \mathrel{+}= 2x + 1$; else $y$ decreases, $p \mathrel{+}= 2x + 1 - 2y$ (new values); stop at $x \ge y$.
- Circles have eight-way symmetry, ellipses four-way.

## Check yourself

<details>
<summary>For a Bresenham line from (0, 0) to (8, 4), what is p₀, and which pixel comes next?</summary>

$p_0 = 2(4) - 8 = 0$. Since $p_0 \ge 0$, the next pixel is (1, 1).
</details>

<details>
<summary>What is the initial decision parameter of the midpoint circle algorithm for r = 8?</summary>

$p_0 = 1 - 8 = -7$, so the next point is (1, 8).
</details>

<details>
<summary>Why is Bresenham's algorithm faster than DDA?</summary>

It uses only integer additions and sign tests, with no floating-point arithmetic or rounding.
</details>
