---
title: "Computer Architecture"
description: "Instruction sets, datapaths, pipelining, memory hierarchy and performance."
sidebar:
  label: Overview
  order: 0
---

Instruction sets, datapaths, pipelining, memory hierarchy and performance.

## Topics to master

- [ ] Instruction set architecture and addressing modes
- [ ] Datapath and control: single-cycle and multi-cycle
- [ ] Pipelining and hazards
- [ ] Memory hierarchy and cache design
- [ ] Virtual memory and TLBs
- [ ] I/O, interrupts and DMA
- [ ] Performance metrics: CPI, MIPS, Amdahl’s law
- [ ] Parallelism and multicore processors

## Standard textbooks

- David A. Patterson & John L. Hennessy: *Computer Organization and Design*
- William Stallings: *Computer Organization and Architecture*

## Key formula

Amdahl’s law, where $p$ is the fraction of work that is sped up by a factor of $s$:

$$
\text{Speedup} = \frac{1}{(1 - p) + \frac{p}{s}}
$$
