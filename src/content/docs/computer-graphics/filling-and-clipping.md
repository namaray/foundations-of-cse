---
title: Filling and Clipping
description: Polygon filling with the scan-line algorithm, boundary fill and flood fill, 4- and 8-connectivity, the inside–outside test, window-to-viewport mapping, Cohen–Sutherland and Liang–Barsky line clipping, and Sutherland–Hodgman polygon clipping.
sidebar:
  label: "3. Filling and clipping"
  order: 3
lesson:
  module: Raster graphics
  prerequisites:
    - label: Line and circle drawing
      link: /computer-graphics/line-and-circle-drawing/
  outcomes:
    - Explain the scan-line polygon fill algorithm and its edge tables
    - Compare boundary fill and flood fill with 4- and 8-connectivity
    - Map a point from a window to a viewport
    - Clip a line with Cohen–Sutherland outcodes and a polygon with Sutherland–Hodgman
  keyIdea: >-
    **Filling** colours the interior of a region, either geometrically (scan-line, one horizontal span at a time) or by spreading from a seed pixel (flood or boundary fill). **Clipping** removes what lies outside the window; **Cohen–Sutherland** uses 4-bit outcodes to accept or reject most lines without computing any intersections.
---

## 1. Scan-line polygon fill

For each horizontal scan line crossing the polygon:

1. Find where the line **intersects** the polygon's edges.
2. **Sort** the intersection $x$ values.
3. **Fill between pairs**: from the 1st to the 2nd, the 3rd to the 4th, and so on.

Efficiency comes from **coherence**: an edge's intersection moves by a constant $1/m$ from one scan line to the next, so it is updated incrementally.

- **Edge table (ET):** all edges, bucketed by their lower $y$, each storing $y_{max}$, the $x$ at $y_{min}$, and $1/m$.
- **Active edge table (AET):** the edges crossing the current scan line, kept sorted by $x$. Add edges from the ET as the scan line reaches them; remove them when it passes $y_{max}$.

**Vertices** need care: where a scan line passes through a vertex, count it **once** if the two edges are on opposite sides of the scan line (one goes up, one down), but **twice** if both edges are on the same side (a local maximum or minimum). Otherwise the pairing goes wrong.

**Horizontal edges** are ignored.

## 2. Seed fills: boundary fill and flood fill

These start from a **seed pixel** inside the region and spread outwards.

| | **Boundary fill** | **Flood fill** |
|---|---|---|
| Region defined by | A **boundary colour** | All connected pixels of the same **interior colour** |
| Spreads while | The pixel is not the boundary colour and not yet filled | The pixel has the old interior colour |
| Use | Regions outlined in one colour | Paint-bucket tools; regions with multicoloured boundaries |

```text
boundaryFill(x, y, fill, boundary):
    c = getPixel(x, y)
    if c != boundary and c != fill:
        setPixel(x, y, fill)
        boundaryFill(x+1, y, ...); boundaryFill(x-1, y, ...)
        boundaryFill(x, y+1, ...); boundaryFill(x, y-1, ...)
```

- **4-connected:** spread to the 4 neighbours (left, right, up, down).
- **8-connected:** also the 4 diagonals. It can **leak** through a diagonal gap in a boundary that a 4-connected fill would respect.

Plain recursion can overflow the stack on large regions; practical versions use an explicit stack or fill whole horizontal **spans** at a time.

**Inside–outside tests** (for complex, self-intersecting polygons): the **odd–even rule** casts a ray from the point and counts edge crossings (odd = inside); the **non-zero winding rule** counts edges crossing left-to-right minus right-to-left (non-zero = inside).

## 3. Windows and viewports

- **Window:** the region of the world (in world coordinates) we want to show.
- **Viewport:** the region of the screen where it appears.

Map window $[x_{w,min}, x_{w,max}] \times [y_{w,min}, y_{w,max}]$ to viewport $[x_{v,min}, x_{v,max}] \times [y_{v,min}, y_{v,max}]$:

$$
x_v = x_{v,min} + (x_w - x_{w,min})\,s_x \qquad s_x = \frac{x_{v,max} - x_{v,min}}{x_{w,max} - x_{w,min}}
$$

and similarly for $y$ with $s_y$. If $s_x \ne s_y$, the image is stretched.

**Example.** Window $x \in [10, 50]$, $y \in [20, 60]$; viewport $x \in [0, 200]$, $y \in [0, 100]$. Then $s_x = 200/40 = 5$ and $s_y = 100/40 = 2.5$. The point (30, 40) maps to $(0 + 20 \times 5,\ 0 + 20 \times 2.5) = (100, 50)$.

## 4. Cohen–Sutherland line clipping

Give each endpoint a 4-bit **outcode**, one bit per window edge it lies beyond:

```text
         |        |
  1001   |  1000  |  1010        bit order:  Top Bottom Right Left
---------+--------+---------     (T = y > ymax, B = y < ymin,
  0001   |  0000  |  0010         R = x > xmax, L = x < xmin)
---------+--------+---------
  0101   |  0100  |  0110
         |        |
```

1. If both codes are 0000: **trivially accept** (the line is fully inside).
2. If code₁ AND code₂ ≠ 0000: **trivially reject** (both ends are beyond the same edge).
3. Otherwise, pick an endpoint that is outside, intersect the line with an edge it is beyond, replace that endpoint with the intersection, recompute its code, and repeat.

Intersections, with slope $m = (y_2 - y_1)/(x_2 - x_1)$: with a vertical edge $x = x_e$, $y = y_1 + m(x_e - x_1)$; with a horizontal edge $y = y_e$, $x = x_1 + (y_e - y_1)/m$.

**Example.** Window $(0, 0)$ to $(10, 10)$; line from $P_1(-2, 4)$ to $P_2(8, 14)$, slope 1.

- $P_1$: $x < 0$, so code 0001 (left). $P_2$: $y > 10$, so code 1000 (top).
- AND = 0000, and neither is 0000: no trivial decision.
- Clip $P_1$ to the left edge $x = 0$: $y = 4 + 1 \times 2 = 6$, giving $(0, 6)$, code 0000.
- Clip $P_2$ to the top edge $y = 10$: $x = -2 + (10 - 4)/1 = 4$, giving $(4, 10)$, code 0000.
- Both are now 0000: accept the segment **(0, 6) to (4, 10)**.

**Liang–Barsky** writes the line parametrically, $P(t) = P_1 + t(P_2 - P_1)$ for $0 \le t \le 1$, and computes the entering and leaving values of $t$ for each edge directly. It needs fewer intersection calculations than Cohen–Sutherland.

## 5. Sutherland–Hodgman polygon clipping

Clip the polygon against **one window edge at a time** (left, right, bottom, top), feeding the output polygon of each stage into the next. For each edge of the polygon, from vertex $S$ to vertex $P$:

| $S$ | $P$ | Output |
|---|---|---|
| Inside | Inside | $P$ |
| Inside | Outside | The intersection $I$ |
| Outside | Inside | $I$, then $P$ |
| Outside | Outside | Nothing |

It works for any **convex** clip window. Clipping a concave polygon can leave extra "connecting" edges along the window boundary; the **Weiler–Atherton** algorithm handles concave cases properly.

## Summary

- Scan-line fill: intersect, sort, fill between pairs; use edge tables and coherence; count vertices once or twice correctly.
- Boundary fill stops at a boundary colour; flood fill replaces an interior colour; 8-connected fills can leak through diagonal gaps.
- Window to viewport: $x_v = x_{v,min} + (x_w - x_{w,min})s_x$.
- Cohen–Sutherland: both codes 0000 → accept; AND ≠ 0 → reject; otherwise clip and repeat.
- Sutherland–Hodgman clips against each edge in turn, using the four in/out cases.

## Check yourself

<details>
<summary>With window (0, 0) to (10, 10), what are the outcodes of (12, −3) and (5, 5)? Can the line between them be trivially accepted or rejected?</summary>

(12, −3) is right and below: 0110. (5, 5) is inside: 0000. Neither test applies (one code is non-zero, and the AND is 0000), so it must be clipped.
</details>

<details>
<summary>Why can an 8-connected boundary fill leak out of a region that a 4-connected fill keeps in?</summary>

If the boundary is only 4-connected, it can have diagonal gaps; an 8-connected fill steps diagonally through them.
</details>

<details>
<summary>In Sutherland–Hodgman, what is output when an edge goes from outside to inside?</summary>

The intersection point, followed by the inside vertex.
</details>
