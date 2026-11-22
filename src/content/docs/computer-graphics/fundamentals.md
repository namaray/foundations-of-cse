---
title: Graphics Fundamentals
description: Raster and vector (random-scan) displays, pixels, resolution and aspect ratio, the frame buffer and its memory size, refresh and double buffering, colour models (RGB, CMY, HSV), and the graphics pipeline.
sidebar:
  label: "1. Fundamentals"
  order: 1
lesson:
  module: Raster graphics
  outcomes:
    - Compare raster-scan and random-scan displays
    - Calculate the memory needed for a frame buffer
    - Convert between the RGB and CMY colour models and describe HSV
    - Outline the stages of the graphics pipeline
  keyIdea: >-
    A raster display shows a grid of **pixels** whose colours are stored in a **frame buffer**: memory size = width × height × bits per pixel. Everything in graphics is ultimately about deciding the colour of each pixel, through a **pipeline** that transforms, clips, projects and rasterises geometry.
---

## 1. Displays

| | **Raster scan** | **Random scan** (vector) |
|---|---|---|
| How it draws | Sweeps the whole screen row by row (scan lines), lighting pixels | Moves the beam directly along each line to draw |
| Stores | A **frame buffer** of pixel values | A **display list** of line-drawing commands |
| Good at | Filled areas, shading, realistic images | Smooth, sharp line drawings |
| Weakness | Jagged edges (**aliasing**) on diagonal lines | Can't fill areas well; flickers with complex scenes |
| Examples | Every modern monitor, TV and phone | Old CAD terminals, oscilloscopes |

Modern displays (LCD, OLED) are raster devices. The old **CRT** (cathode-ray tube) fired an electron beam at phosphor dots; terms like *refresh*, *scan line* and *retrace* come from it.

- **Horizontal retrace:** the beam returns to the left of the next line. **Vertical retrace:** it returns to the top after a full frame.
- **Interlacing:** draw odd lines, then even lines, to reduce visible flicker at a low refresh rate.

## 2. Pixels, resolution and aspect ratio

- **Pixel:** the smallest addressable picture element.
- **Resolution:** the number of pixels, for example 1920 × 1080.
- **Aspect ratio:** width : height, for example 16 : 9 (1920/1080).
- **Bit depth (colour depth):** bits per pixel. 1 bit gives 2 colours, 8 bits 256 colours, **24 bits** ("true colour", 8 bits each for R, G and B) about 16.7 million colours.

## 3. The frame buffer

The **frame buffer** is the memory holding the colour of every pixel. The display controller reads it repeatedly to refresh the screen.

$$
\text{memory} = \text{width} \times \text{height} \times \text{bits per pixel}
$$

**Example.** 1920 × 1080 at 24 bits per pixel: $1920 \times 1080 \times 24 = 49{,}766{,}400$ bits $= 6{,}220{,}800$ bytes $\approx$ **6.22 MB** per frame.

**Refresh rate:** how many times per second the screen is redrawn (60 Hz, 120 Hz…). Data rate = frame size × refresh rate: 6.22 MB × 60 ≈ 373 MB/s for the example.

**Double buffering:** draw the next frame into a hidden **back buffer**, then swap it with the visible **front buffer**, so the viewer never sees a half-drawn frame (avoids flicker and tearing).

A **colour lookup table** (palette) lets a frame buffer with few bits per pixel index into a table of full colours: 8 bits per pixel can show any 256 of 16.7 million colours.

## 4. Colour models

| Model | Components | Additive or subtractive | Used for |
|---|---|---|---|
| **RGB** | Red, green, blue | **Additive** (light): R + G + B = white | Monitors, cameras |
| **CMY(K)** | Cyan, magenta, yellow (+ black) | **Subtractive** (ink): C + M + Y = black | Printers |
| **HSV** (HSB) | Hue (colour angle 0–360°), saturation (purity), value (brightness) | — | Colour pickers: matches how people describe colour |
| YIQ / YUV / YCbCr | Luminance (Y) + two chrominance channels | — | TV and video compression (the eye is more sensitive to brightness than colour) |

**RGB ↔ CMY** (values from 0 to 1):

$$
\begin{bmatrix} C \\ M \\ Y \end{bmatrix} = \begin{bmatrix} 1 \\ 1 \\ 1 \end{bmatrix} - \begin{bmatrix} R \\ G \\ B \end{bmatrix}
$$

So red (1, 0, 0) is CMY (0, 1, 1): magenta + yellow ink. **K** (black) is added in printing because mixed CMY inks give a muddy dark brown and waste ink.

## 5. The graphics pipeline

The sequence of steps from a 3D scene to pixels:

```text
Modelling       →  Viewing         →  Projection   →  Clipping  →  Viewport       →  Rasterisation  →  Shading /
transformation     transformation                                 transformation     (scan conversion)   visibility
(object → world)   (world → camera)   (3D → 2D)                   (→ screen)
```

1. **Modelling:** place each object in the world (translate, rotate, scale).
2. **Viewing:** express everything relative to the camera.
3. **Projection:** flatten 3D to 2D (perspective or parallel).
4. **Clipping:** discard what lies outside the view.
5. **Viewport transformation:** map to screen coordinates.
6. **Rasterisation** (scan conversion): decide which pixels each primitive covers.
7. **Shading and visible-surface determination:** colour each pixel and keep only the nearest surface.

GPUs implement this pipeline in hardware; in modern APIs (OpenGL, Vulkan, DirectX) the vertex and fragment stages are programmable **shaders**.

## Summary

- Raster displays refresh a pixel grid from a frame buffer; random-scan displays draw lines from a display list.
- Frame buffer size = width × height × bits per pixel (1920 × 1080 × 24 bits ≈ 6.22 MB).
- Double buffering avoids flicker; a lookup table saves memory.
- RGB is additive (screens), CMY subtractive (printing), $CMY = 1 - RGB$; HSV suits people.
- Pipeline: modelling → viewing → projection → clipping → viewport → rasterisation → shading.

## Check yourself

<details>
<summary>How much memory does a 1024 × 768 frame buffer need at 8 bits per pixel?</summary>

$1024 \times 768 = 786{,}432$ bytes, which is 768 KB.
</details>

<details>
<summary>What is pure yellow in RGB and in CMY?</summary>

RGB (1, 1, 0); CMY (0, 0, 1).
</details>

<details>
<summary>Why do raster displays show jagged diagonal lines?</summary>

Lines must be approximated by whole pixels on a grid, giving a staircase effect (aliasing). Antialiasing softens it by shading edge pixels in proportion to coverage.
</details>
