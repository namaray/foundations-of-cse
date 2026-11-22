---
title: Input/Output and Buses
description: Memory-mapped and isolated I/O, programmed I/O with polling, interrupt-driven I/O, direct memory access, buses and their types, synchronous and asynchronous transfer, and bus arbitration.
sidebar:
  label: "7. I/O and buses"
  order: 7
lesson:
  module: Memory, I/O and parallelism
  prerequisites:
    - label: Caches
      link: /computer-architecture/memory-hierarchy/
  outcomes:
    - Compare memory-mapped and isolated I/O
    - Compare polling, interrupts and DMA, and choose one for a device
    - Explain synchronous and asynchronous bus transfer and handshaking
  keyIdea: >-
    The CPU talks to devices through registers in a device controller. **Polling** wastes CPU time checking devices; **interrupts** let devices signal when they need attention; **DMA** lets a controller move whole blocks of data to memory without the CPU touching each byte.
---

## 1. Device controllers and addressing

Each device has a **controller** with registers the CPU reads and writes: typically a **data** register, a **status** register (ready? busy? error?) and a **control/command** register.

| | Memory-mapped I/O | Isolated (port-mapped) I/O |
|---|---|---|
| Device registers | Occupy part of the **memory address space** | Have their own **separate** address space |
| Instructions | Ordinary loads and stores | Special `IN` and `OUT` instructions |
| Pros | Any instruction and addressing mode works; simpler CPU | Memory space is not reduced; easy to protect |
| Used by | ARM, most RISC; also much of x86 | x86 (for legacy ports) |

## 2. Programmed I/O (polling)

The CPU repeatedly reads the status register until the device is ready, then transfers one word.

```text
loop: read status register
      if not ready, goto loop
      transfer data
```

Simple, but the CPU is **busy waiting** and does no useful work. Acceptable only for very fast devices or when nothing else needs doing.

**Cost example.** Polling a device 30 times per second for 400 cycles each time, on a 1 GHz CPU, uses $30 \times 400 / 10^9 = 0.0012\%$ of the CPU: negligible. Polling a fast disk often enough to keep up with it could use a large fraction of the CPU.

## 3. Interrupt-driven I/O

The CPU starts the operation and carries on with other work. When the device is ready, it raises an **interrupt**:

1. The CPU finishes the current instruction.
2. It saves the PC and status, and disables further interrupts as needed.
3. It identifies the source, by polling the devices or, faster, through a **vectored** interrupt that supplies the handler's address directly.
4. It runs the **interrupt service routine**, which transfers the data.
5. It restores the saved state and resumes the interrupted program.

**Priorities:** when several devices interrupt at once, a priority scheme (daisy chaining, or a programmable interrupt controller) decides which is served first, and higher-priority interrupts can interrupt lower-priority handlers.

Interrupts still need the CPU to move **every word**, which is too slow for disks and network cards transferring large blocks.

## 4. Direct memory access (DMA)

A **DMA controller** transfers a whole block between a device and memory by itself.

1. The CPU tells the DMA controller the memory address, the byte count, the direction and the device.
2. The DMA controller takes control of the bus and moves the data, one word at a time, directly to or from memory.
3. When the block is done, it sends **one interrupt** to the CPU.

| Mode | How DMA uses the bus |
|---|---|
| **Burst** (block) | Holds the bus for the whole block: fastest, but the CPU cannot use the bus meanwhile |
| **Cycle stealing** | Takes the bus for one word at a time, between CPU memory accesses |
| Transparent | Uses the bus only when the CPU is not using it |

DMA and caches must be kept **coherent**: if DMA writes memory, stale copies in the cache must be invalidated.

| | Polling | Interrupts | DMA |
|---|---|---|---|
| CPU involvement | Constant checking | Per word | Only at start and end |
| Best for | Simple, fast or rare events | Keyboards, mice, slow devices | Disks, network cards, graphics |

## 5. Buses

A **bus** is a shared set of wires connecting components. It has **data**, **address** and **control** lines.

- **Synchronous bus:** a shared clock times every transfer. Fast and simple, but every device must keep up, and clock skew limits its length.
- **Asynchronous bus:** no clock; a **handshake** protocol coordinates each transfer: the sender asserts *request*, the receiver responds *acknowledge*, and both release in turn. It works with devices of any speed.

**Bus arbitration** decides who uses the bus when several devices (the CPU, DMA controllers) want it:

- **Daisy chain:** a grant signal passes from device to device; the nearest device has the highest priority. Simple but unfair.
- **Centralised parallel arbitration:** an arbiter receives every request and grants one.
- **Distributed:** devices settle priority among themselves.

Modern systems use point-to-point **serial links** rather than wide shared buses: **PCI Express** (lanes of serial pairs) inside the computer, and **USB**, Thunderbolt and SATA to devices.

## Summary

- Device controllers have data, status and control registers, reached by memory-mapped or isolated I/O.
- Polling wastes CPU time; interrupts let devices signal readiness; DMA moves whole blocks without the CPU.
- An interrupt saves state, identifies the source (vectored is fastest), runs the handler and resumes.
- Synchronous buses use a clock; asynchronous buses use request/acknowledge handshaking; arbitration picks the next bus master.

## Check yourself

<details>
<summary>Why is DMA better than interrupts for a disk?</summary>

A disk transfers large blocks quickly. With interrupt-driven I/O the CPU would handle every word; with DMA it only sets up the transfer and handles one interrupt at the end.
</details>

<details>
<summary>What is the difference between memory-mapped and isolated I/O?</summary>

In memory-mapped I/O, device registers have memory addresses and are accessed with ordinary loads and stores. In isolated I/O they have a separate address space and need special I/O instructions.
</details>

<details>
<summary>What is cycle stealing?</summary>

A DMA mode where the controller takes the bus for one memory cycle at a time, slipping its transfers in between the CPU's accesses, so the CPU slows down slightly instead of stopping.
</details>
