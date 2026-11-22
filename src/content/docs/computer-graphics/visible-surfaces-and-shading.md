---
title: Visible Surfaces and Shading
description: Hidden-surface removal with back-face culling, the z-buffer, the painter's algorithm, scan-line, area subdivision and BSP trees; the Phong illumination model with ambient, diffuse and specular light; flat, Gouraud and Phong shading; ray tracing, texture mapping and antialiasing.
sidebar:
  label: "6. Visibility and shading"
  order: 6
lesson:
  module: Rendering and curves
  prerequisites:
    - label: 3D transformations and projections
      link: /computer-graphics/3d-and-projections/
  outcomes:
    - Apply the back-face test and explain the z-buffer algorithm
    - Compare z-buffer, painter's, scan-line and area-subdivision methods
    - Compute ambient plus diffuse intensity with Lambert's law
    - Compare flat, Gouraud and Phong shading
  keyIdea: >-
    **Visible-surface** algorithms decide which surface is nearest at each pixel; the **z-buffer** does it simply by storing the depth of the nearest surface so far at every pixel. **Illumination** models how much light a point reflects (ambient + diffuse $\propto \cos\theta$ + specular highlight), and **shading** spreads that across a polygon: flat (one colour), Gouraud (interpolate colours) or Phong (interpolate normals).
---

## 1. Back-face culling

In a closed object, faces pointing away from the viewer can never be seen. With $N$ the face's outward normal and $V$ the **viewing direction** (from the eye into the scene), a polygon is a **back face** if

$$
N \cdot V > 0
$$

(With the camera looking along $-z$, this is simply: the normal's $z$ component is $\le 0$.) Culling removes about **half** the polygons cheaply, but it is not a complete solution: front faces can still hide each other.

## 2. The z-buffer (depth buffer)

Keep, alongside the frame buffer, a **depth buffer** holding the depth of the nearest surface drawn so far at each pixel.

```text
initialise depth[x][y] = ∞ (farthest), frame[x][y] = background
for each polygon:
    for each pixel (x, y) the polygon covers:
        z = depth of the polygon at (x, y)        // interpolated incrementally
        if z < depth[x][y]:                       // nearer than what is there
            depth[x][y] = z
            frame[x][y] = colour of the polygon at (x, y)
```

| Advantages | Disadvantages |
|---|---|
| Simple; polygons in **any order**, no sorting | Extra memory (one depth value per pixel) |
| Works for any kind of primitive | Finite depth precision causes "**z-fighting**" between nearby surfaces |
| Easy to build in hardware: **used by all GPUs** | Transparency needs extra handling (objects drawn in order) |

## 3. Other visible-surface methods

| Method | Idea | Space | Notes |
|---|---|---|---|
| **Painter's algorithm** (depth sort) | Sort polygons by depth; draw **farthest first**, so nearer ones paint over | Object | Fails for cyclically overlapping or interpenetrating polygons unless they are split |
| **Scan-line** | Process one scan line at a time with an active edge list, keeping the nearest span | Image | Coherence along the line; little memory |
| **Area subdivision** (Warnock) | If a screen area is simple (empty, or one polygon covers it), draw it; otherwise split it into four and recurse | Image | Divide and conquer |
| **BSP tree** | Pre-build a binary space partition of the polygons; traverse it back-to-front from any viewpoint | Object | Fast for static scenes (classic in early 3D games) |
| **Ray casting** | For each pixel, shoot a ray and find the nearest intersection | Image | Basis of ray tracing |
| **A-buffer** | z-buffer storing a list of fragments per pixel | Image | Supports transparency and antialiasing |

**Object-space** methods compare objects with each other (precision of the scene); **image-space** methods decide per pixel (precision of the display).

## 4. Illumination: the Phong reflection model

The light reflected from a point is the sum of three terms:

$$
I = \underbrace{k_a I_a}_{\text{ambient}} + \underbrace{k_d I_L (N \cdot L)}_{\text{diffuse}} + \underbrace{k_s I_L (R \cdot V)^n}_{\text{specular}}
$$

| Term | Models | Depends on |
|---|---|---|
| **Ambient** $k_a I_a$ | Light scattered around the scene, so nothing is fully black | Nothing directional |
| **Diffuse** (Lambert's cosine law) | Matte surfaces scattering light equally in all directions | $\cos\theta = N \cdot L$, the angle between the normal $N$ and the light direction $L$ (unit vectors) |
| **Specular** | Shiny highlights | $R \cdot V$: the angle between the reflected ray $R$ and the viewer $V$; the **shininess** exponent $n$ (large = small, sharp highlight) |

$k_a$, $k_d$, $k_s$ are the material's reflection coefficients (0 to 1). If $N \cdot L < 0$, the light is behind the surface and the diffuse term is 0.

**Example.** $k_a = 0.2$, $I_a = 1$; $k_d = 0.5$, $I_L = 1$; $N = (0, 0, 1)$ and $L = (0, 0.6, 0.8)$, so $N \cdot L = 0.8$. Ambient + diffuse $= 0.2 + 0.5 \times 1 \times 0.8 = $ **0.6**.

**Blinn–Phong** replaces $R \cdot V$ with $N \cdot H$, where $H$ is the **halfway vector** between $L$ and $V$; it is cheaper and the default in classic OpenGL. **Attenuation** divides by a function of distance so farther lights are dimmer.

## 5. Shading polygons

| Method | What is computed | Where | Result |
|---|---|---|---|
| **Flat** (constant) | One intensity per polygon | Once, at one point | Faceted look; fast |
| **Gouraud** | Intensity at each **vertex** (using vertex normals), then **interpolated** across the polygon | Vertices | Smooth, but can **miss or smear specular highlights** that fall inside a polygon; Mach bands |
| **Phong** | **Normals** interpolated across the polygon; the full illumination model evaluated **per pixel** | Every pixel | Accurate highlights; more expensive |

A vertex normal is usually the average of the normals of the faces that meet there. Don't confuse the Phong **reflection model** (section 4) with Phong **shading** (interpolating normals); they are often used together.

**Mach bands:** the eye exaggerates intensity changes at boundaries, making the edges between flat-shaded or Gouraud-shaded polygons look more visible.

## 6. Beyond local illumination

- **Ray tracing:** from the eye through each pixel, follow rays recursively: at each hit, cast **shadow** rays to the lights, plus **reflected** and **refracted** rays. It gives shadows, mirrors and glass naturally, at a high cost.
- **Radiosity:** models diffuse light bouncing between surfaces (colour bleeding), independent of the viewpoint.
- **Texture mapping:** maps a 2D image onto a surface using $(u, v)$ coordinates; **bump mapping** perturbs normals to fake surface detail; **mipmaps** are pre-shrunk textures that reduce aliasing at a distance.
- **Antialiasing:** reduces jagged edges, for example by **supersampling** (render at a higher resolution and average) or area sampling.

## Summary

- Back face if $N \cdot V > 0$ ($V$ from the eye into the scene); removes about half the polygons.
- z-buffer: keep the nearest depth per pixel; any order; all GPUs use it. Painter's: sort and draw back to front.
- $I = k_aI_a + k_dI_L(N \cdot L) + k_sI_L(R \cdot V)^n$.
- Flat: one colour per polygon. Gouraud: interpolate vertex colours (may miss highlights). Phong: interpolate normals, light per pixel.
- Ray tracing adds shadows, reflection and refraction; textures add detail.

## Check yourself

<details>
<summary>A z-buffer pixel holds depth 0.7. A new fragment there has depth 0.4 (smaller = nearer). What happens?</summary>

It is nearer, so the depth becomes 0.4 and the pixel takes the new fragment's colour.
</details>

<details>
<summary>Why can Gouraud shading miss a specular highlight?</summary>

It evaluates lighting only at the vertices. A highlight that falls in the middle of a polygon, away from every vertex, never gets computed, so interpolating the vertex colours can't produce it.
</details>

<details>
<summary>When does the painter's algorithm fail?</summary>

When polygons overlap cyclically (A over B over C over A) or pass through each other, so no back-to-front order exists; they must be split first.
</details>
