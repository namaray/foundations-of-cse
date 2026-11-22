---
title: Memory Management
description: Logical vs physical addresses, contiguous allocation with first, best and worst fit, fragmentation, paging and address translation, the TLB and effective access time, multilevel page tables, and segmentation.
sidebar:
  label: "8. Memory management"
  order: 8
lesson:
  module: Memory
  prerequisites:
    - label: Processes
      link: /operating-systems/processes/
  outcomes:
    - Allocate processes to holes with first, best and worst fit
    - Translate a logical address to a physical address under paging
    - Compute effective memory access time with a TLB
    - Explain internal vs external fragmentation
  keyIdea: >-
    Programs use **logical addresses**; the hardware's MMU translates them to **physical** ones. **Paging** splits memory into fixed-size frames, which ends external fragmentation, and a **TLB** caches recent translations so that the extra lookup is usually free.
---

## 1. Logical and physical addresses

- A **logical (virtual) address** is what the program uses.
- A **physical address** is the actual location in RAM.

The **memory management unit (MMU)** translates one to the other on every access. The simplest scheme uses a **base** (relocation) register and a **limit** register: physical = logical + base, and any logical address $\ge$ limit causes a trap. This both relocates and protects processes.

**Address binding** can happen at compile time (absolute code), load time (relocatable code) or **execution time**. Execution-time binding, done by the MMU, lets the OS move processes around in memory.

## 2. Contiguous allocation

Each process gets one contiguous block. Over time memory becomes a patchwork of allocated blocks and free **holes**. To place a process:

| Strategy | Choose | Notes |
|---|---|---|
| **First fit** | the first hole big enough | fast |
| **Best fit** | the smallest hole big enough | leaves tiny useless holes |
| **Worst fit** | the largest hole | leaves big holes; usually worst in practice |

**Worked example.** Holes, in order: 100, 500, 200, 300, 600 KB. Processes arrive: 212, 417, 112, 426 KB.

| Process | First fit | Best fit | Worst fit |
|---|---|---|---|
| 212 | 500 → leaves 288 | 300 → leaves 88 | 600 → leaves 388 |
| 417 | 600 → leaves 183 | 500 → leaves 83 | 500 → leaves 83 |
| 112 | 288 → leaves 176 | 200 → leaves 88 | 388 → leaves 276 |
| 426 | **must wait** | 600 → leaves 174 | **must wait** |

Here only best fit places all four processes.

### Fragmentation

- **External fragmentation:** enough free memory in total, but split into holes too small to use. Fixed by **compaction** (moving processes together), which is slow, or by paging.
- **Internal fragmentation:** memory wasted **inside** an allocated block, because blocks come in fixed sizes larger than requested.

## 3. Paging

Divide physical memory into fixed-size **frames** and each process's logical memory into **pages** of the same size. Any page can go in any free frame, so there is **no external fragmentation**. The only waste is internal: on average half a page at the end of each process.

A logical address splits into a **page number** $p$ and an **offset** $d$. With page size $2^n$, the low $n$ bits are the offset.

$$
\text{physical address} = \text{frame}(p) \times \text{page size} + d
$$

The **page table** (one per process) maps each page number to a frame number.

**Worked example.** Page size 1 KB (1024 bytes). Translate logical address 2500, given that page 2 is in frame 5.

- $p = \lfloor 2500 / 1024 \rfloor = 2$, $\;d = 2500 - 2048 = 452$
- Physical address $= 5 \times 1024 + 452 = 5572$

**Address-size arithmetic.** A 32-bit logical address with 4 KB ($2^{12}$) pages has a 12-bit offset and a 20-bit page number, so up to $2^{20}$ pages. With 4-byte page-table entries, each process's page table needs $2^{20} \times 4 = 4$ MB.

## 4. The TLB

With the page table in memory, every access needs **two** memory reads: one for the page-table entry and one for the data. The **translation lookaside buffer (TLB)** is a small, fast associative cache of recent page-to-frame translations.

**Effective access time (EAT)**, with TLB hit ratio $\alpha$, TLB lookup time $t$ and memory access time $m$:

$$
\text{EAT} = \alpha\,(t + m) + (1 - \alpha)\,(t + 2m)
$$

**Example.** $t = 20$ ns, $m = 100$ ns, $\alpha = 0.8$:

$$
\text{EAT} = 0.8 \times 120 + 0.2 \times 220 = 96 + 44 = 140 \text{ ns}
$$

With $\alpha = 0.98$ it drops to 122 ns, close to the bare 100 ns. Programs have good **locality**, so real hit ratios are usually above 99%.

:::note[Check the question's convention]
Some textbooks ignore the TLB lookup time, giving $\text{EAT} = \alpha m + (1-\alpha) 2m$. Use whichever form the question implies, and say which.
:::

## 5. Page table structures

A 4 MB page table per process is too big to keep contiguous. Options:

- **Multilevel (hierarchical) paging:** page the page table itself. With two levels, a 32-bit address might split into a 10-bit outer index, a 10-bit inner index and a 12-bit offset. Only the inner tables actually in use need to exist.
- **Hashed page tables:** hash the page number into a table of chains; common for 64-bit address spaces.
- **Inverted page table:** one entry per **physical frame** (recording which process and page it holds), so the table size depends on RAM, not on the address space. Lookups are slower and need hashing.

Each page-table entry also carries a **valid bit** (is this page in the process's address space?), **protection bits** (read, write, execute), and for virtual memory a **dirty** and a **reference** bit.

## 6. Segmentation

**Segmentation** divides a program into variable-size logical units: code, data, stack, and so on. A logical address is a pair (segment number, offset). The **segment table** stores each segment's **base** and **limit**; an offset beyond the limit causes a trap.

| | Paging | Segmentation |
|---|---|---|
| Unit size | Fixed (pages) | Variable (segments) |
| Visible to programmer | No | Yes: matches the program's structure |
| Fragmentation | Internal only | External |
| Sharing and protection | Per page | Per logical unit, more natural |

Some systems combine the two: segments made of pages (for example, older Intel x86).

## Summary

- The MMU translates logical to physical addresses at run time, which allows relocation and protection.
- Contiguous allocation suffers external fragmentation; first, best and worst fit choose which hole to use.
- Paging splits memory into equal frames and pages: physical = frame × page size + offset. No external fragmentation.
- The TLB caches translations; $\text{EAT} = \alpha(t + m) + (1 - \alpha)(t + 2m)$.
- Large page tables are handled with multilevel, hashed or inverted tables.
- Segmentation uses variable-size logical segments with base and limit.

## Check yourself

<details>
<summary>A system uses 16-bit addresses and 256-byte pages. How many pages can a process have, and how many bits is the offset?</summary>

$256 = 2^8$, so the offset is 8 bits and the page number is $16 - 8 = 8$ bits: up to $2^8 = 256$ pages.
</details>

<details>
<summary>Does paging suffer from internal or external fragmentation?</summary>

Internal only: the last page of a process is usually not full. Because any page fits any frame, there is no external fragmentation.
</details>

<details>
<summary>Memory access takes 200 ns and the TLB lookup is negligible. What hit ratio gives an EAT of 220 ns?</summary>

$220 = 200\alpha + 400(1 - \alpha) = 400 - 200\alpha$, so $\alpha = 0.9$.
</details>
