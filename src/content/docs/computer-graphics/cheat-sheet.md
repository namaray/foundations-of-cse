---
title: Computer Graphics Cheat Sheet
description: One-page revision of displays and frame buffers, colour models, DDA, Bresenham and midpoint circle, filling and clipping, 2D and 3D transformations, projections, visible surfaces, shading and curves.
sidebar:
  label: "8. Cheat sheet"
  order: 20
  badge:
    text: Revision
    variant: note
lesson:
  module: Revision
---

Use this page for last-minute revision. Each heading links back to the full lesson.

## [Fundamentals](/computer-graphics/fundamentals/)

- Raster: pixel grid + frame buffer. Random scan: display list of lines.
- Frame buffer = width × height × bits per pixel (1920 × 1080 × 24 bits ≈ 6.22 MB).
- RGB additive (screens); CMY subtractive (print); $CMY = 1 - RGB$; HSV for people.
- Pipeline: modelling → viewing → projection → clipping → viewport → rasterisation → shading.

## [Lines and circles](/computer-graphics/line-and-circle-drawing/)

- DDA: steps $= \max(\lvert\Delta x\rvert, \lvert\Delta y\rvert)$; add increments; round.
- Bresenham: $p_0 = 2\Delta y - \Delta x$; $p < 0$ → $(x+1, y)$, $p \mathrel{+}= 2\Delta y$; else $(x+1, y+1)$, $p \mathrel{+}= 2\Delta y - 2\Delta x$.
- Midpoint circle: $p_0 = 1 - r$; $p < 0$ → $p \mathrel{+}= 2x + 1$; else $y{-}{-}$, $p \mathrel{+}= 2x + 1 - 2y$; eight-way symmetry; stop at $x \ge y$.

## [Filling and clipping](/computer-graphics/filling-and-clipping/)

- Scan-line: intersect, sort, fill pairs; edge table + active edge table.
- Boundary fill (stop at boundary colour) vs flood fill (replace interior colour); 4- vs 8-connected.
- Viewport: $x_v = x_{v,min} + (x_w - x_{w,min})\frac{x_{v,max} - x_{v,min}}{x_{w,max} - x_{w,min}}$.
- Cohen–Sutherland (TBRL): both 0000 → accept; AND ≠ 0 → reject; else clip and repeat.
- Sutherland–Hodgman: in→in: P; in→out: I; out→in: I, P; out→out: nothing.

## [2D](/computer-graphics/2d-transformations/) and [3D transformations](/computer-graphics/3d-and-projections/)

- Homogeneous $(x, y, 1)$; $P' = M_n \cdots M_1 P$ (first applied is rightmost); order matters.
- Rotation: $x' = x\cos\theta - y\sin\theta$, $y' = x\sin\theta + y\cos\theta$.
- About a pivot: $T(p)\,R(\theta)\,T(-p)$. Reflection $y = x$: swap $x$ and $y$.
- 3D: $4 \times 4$; arbitrary axis: translate, two rotations to align with $z$, rotate, undo.
- Perspective: $x_p = dx/z$, $y_p = dy/z$. Parallel: orthographic, oblique (cavalier full depth, cabinet half).

## [Visibility and shading](/computer-graphics/visible-surfaces-and-shading/)

- Back face: $N \cdot V > 0$. z-buffer: keep the nearest depth per pixel. Painter's: draw far to near.
- $I = k_aI_a + k_dI_L(N \cdot L) + k_sI_L(R \cdot V)^n$.
- Flat (per polygon), Gouraud (interpolate vertex intensities), Phong (interpolate normals).

## [Curves](/computer-graphics/curves/)

- Bézier: $\sum \binom{n}{i}t^i(1-t)^{n-i}P_i$; endpoints interpolated; convex hull; global control.
- De Casteljau: repeated linear interpolation.
- B-spline: local control, degree independent of point count; NURBS add weights.

## Top viva questions

1. Compare raster-scan and random-scan displays.
2. Calculate the frame buffer size for a given resolution and colour depth.
3. Trace Bresenham's line algorithm. Why is it better than DDA?
4. Trace the midpoint circle algorithm. What is eight-way symmetry?
5. Compare boundary fill and flood fill.
6. Clip a line with Cohen–Sutherland.
7. Why are homogeneous coordinates used?
8. Rotate a point about an arbitrary pivot.
9. Compare parallel and perspective projection.
10. Explain the z-buffer algorithm.
11. Compare Gouraud and Phong shading.
12. State the properties of Bézier curves. How do B-splines differ?
