---
title: 8086 Interrupts
description: Hardware, software and exception interrupts, the interrupt vector table and vector address calculation, the predefined interrupt types, the interrupt response sequence and IRET, priorities, and the 8259 programmable interrupt controller.
sidebar:
  label: "4. Interrupts"
  order: 4
lesson:
  module: Interfacing
  prerequisites:
    - label: Assembly programming
      link: /microprocessors/assembly-programming/
  outcomes:
    - Find where the vector for any interrupt type is stored
    - Describe what the 8086 does when it accepts an interrupt
    - Name the predefined interrupt types and the priority order
    - Explain how the 8259 PIC expands and prioritises hardware interrupts
  keyIdea: >-
    The 8086 supports **256 interrupt types**. The handler address for type $n$ is stored in the **interrupt vector table** at physical address $4n$ (IP first, then CS). On an interrupt, the CPU pushes the flags, CS and IP, clears IF and TF, and jumps to the handler; **IRET** undoes this.
---

## 1. Sources of interrupts

| Kind | Source | Examples |
|---|---|---|
| **Hardware** | External pins | **NMI** (non-maskable), **INTR** (maskable) |
| **Software** | The `INT n` instruction | `INT 21H` (DOS services), `INT 10H` (video BIOS) |
| **Exceptions** | Conditions inside the CPU | Divide error, single step, overflow with `INTO` |

## 2. The interrupt vector table

The first **1 KB** of memory, physical addresses **00000H–003FFH**, holds 256 vectors of **4 bytes** each: the handler's **IP** (offset) at the lower address, then its **CS** (segment).

$$
\text{Vector address of type } n = 4 \times n
$$

**Examples.**

- Type 2 (NMI): $4 \times 2 = 8$, so bytes 00008H–0000BH.
- `INT 21H`: $4 \times 21\text{H} = 84\text{H}$, so bytes 00084H–00087H.

If the bytes at 00084H are `00 10 00 20` (from low to high address), the handler's IP = 1000H and CS = 2000H, so the handler starts at 21000H.

## 3. Predefined types

| Type | Name | Cause |
|---|---|---|
| 0 | Divide error | Division by zero, or quotient too large |
| 1 | Single step | After every instruction while TF = 1 (used by debuggers) |
| 2 | NMI | The non-maskable interrupt pin (for example, a power failure or memory parity error) |
| 3 | Breakpoint | `INT 3`, a special 1-byte instruction a debugger inserts into code |
| 4 | Overflow | `INTO` when OF = 1 |
| 5–31 | Reserved by Intel | |
| 32–255 | Available | Software interrupts and hardware interrupts via INTR |

## 4. The interrupt response

When the 8086 accepts an interrupt (at the end of the current instruction):

1. **Push the flags** register.
2. **Clear IF and TF** (no nested maskable interrupts or single-stepping inside the handler, unless the handler re-enables them).
3. **Push CS**, then **push IP** (the return address).
4. Load the new **IP** from address $4n$ and **CS** from $4n + 2$.
5. Execute the handler, which ends with **`IRET`**: pop IP, CS and the flags.

Compare `RET`, which pops only the return address and does not restore the flags.

## 5. Hardware interrupts

| | NMI | INTR |
|---|---|---|
| Maskable? | **No** | Yes: only accepted if IF = 1 (`STI` enables, `CLI` disables) |
| Trigger | Rising edge | Level (high) |
| Type number | Always 2 | Supplied by the external device during **two INTA̅** (interrupt acknowledge) bus cycles |
| Use | Critical events | Ordinary devices (through an 8259) |

**Priority**, highest first: divide error, `INT n` and `INTO` (internal), then NMI, then INTR, then single step.

## 6. The 8259 programmable interrupt controller

The 8086 has only one INTR pin, but many devices need interrupts. The **8259A PIC**:

- Accepts **8** interrupt requests (IR0–IR7) and **prioritises** them.
- Sends INTR to the CPU and, during INTA̅, supplies the **type number** of the highest-priority pending request.
- Can be **cascaded**: one master plus up to 8 slaves gives **64** interrupt inputs.
- Lets software **mask** individual inputs through the interrupt mask register (IMR).

**Internal registers:** IRR (interrupt request register: who is asking), ISR (in-service register: who is being served), IMR (mask).

**Programming:** **initialisation command words** ICW1–ICW4 set up edge or level triggering, the base type number (for example, IR0 → type 08H), cascading and the CPU mode. **Operation command words** OCW1–OCW3 set masks, send end-of-interrupt commands, and select priority modes.

**Priority modes:** **fully nested** (IR0 highest, IR7 lowest; the default), **rotating** (a device that was just served drops to lowest priority, giving equal service), and special mask mode.

At the end of a handler, software sends an **EOI** (end-of-interrupt) command to the 8259 so it clears the ISR bit and allows lower-priority requests.

## Summary

- 256 interrupt types; the vector table occupies 00000H–003FFH, 4 bytes per type (IP, then CS), at address $4n$.
- Types 0–4: divide error, single step, NMI, breakpoint, overflow.
- Response: push flags, clear IF and TF, push CS and IP, load the vector; return with IRET.
- NMI cannot be masked; INTR depends on IF and gets its type number during INTA̅ cycles.
- The 8259 PIC prioritises 8 requests (64 when cascaded), supplies type numbers and supports masking.

## Check yourself

<details>
<summary>Where is the vector for INT 10H stored?</summary>

At $4 \times 10\text{H} = 40\text{H}$: bytes 00040H–00043H.
</details>

<details>
<summary>Why does an interrupt handler end with IRET instead of RET?</summary>

The interrupt pushed the flags as well as the return address. IRET pops IP, CS and the flags, restoring the interrupted program's exact state; RET would leave the flags on the stack.
</details>

<details>
<summary>How many interrupt inputs can be handled with one master and three slave 8259s?</summary>

Each slave uses one master input. The master has $8 - 3 = 5$ free inputs and the slaves give $3 \times 8 = 24$: 29 in total.
</details>
