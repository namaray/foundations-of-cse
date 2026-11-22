---
title: What an Operating System Does
description: The role of the OS, user and kernel mode, interrupts and traps, system calls, OS structures (monolithic, layered, microkernel, modular) and booting.
sidebar:
  label: "1. OS structure"
  order: 1
lesson:
  module: Foundations
  outcomes:
    - Explain why hardware has a user mode and a kernel mode
    - Trace what happens during a system call
    - Compare monolithic kernels with microkernels
  keyIdea: >-
    The OS is a **resource manager** and a **protector**. Programs run in **user mode** and must ask the kernel, through **system calls**, for anything privileged such as I/O or memory. The hardware enforces this split with a mode bit and interrupts.
---

## 1. What the OS is for

An operating system sits between programs and hardware. It has two jobs:

- **Resource manager:** share the CPU, memory, disks and devices among many programs, fairly and efficiently.
- **Extended machine:** hide messy hardware behind clean abstractions: processes instead of raw CPUs, files instead of disk sectors, sockets instead of network cards.

The **kernel** is the part that is always running with full privileges. Everything else (shells, compilers, browsers) is an ordinary program.

## 2. User mode and kernel mode

The CPU has a **mode bit**:

| | User mode | Kernel mode |
|---|---|---|
| Who runs | Application programs | The kernel |
| Privileged instructions (I/O, changing page tables, disabling interrupts, halting) | Not allowed: attempting one causes a trap | Allowed |
| Memory access | Only the program's own memory | All memory |

This **dual-mode operation** protects the system: a buggy or malicious program cannot directly wreck the hardware or other programs. A **timer** interrupt also guarantees the kernel regains control periodically, so one program cannot hog the CPU forever.

## 3. Interrupts, traps and system calls

The CPU switches to kernel mode only through well-defined entry points:

- **Interrupt** (asynchronous, from hardware): a disk finishes, a key is pressed, the timer fires.
- **Trap / exception** (synchronous, from software): division by zero, an invalid memory access, or a deliberate **system call**.

On either, the hardware saves the current state, switches to kernel mode, and jumps to a handler found through the **interrupt vector table**. When the handler finishes, the CPU returns to user mode and resumes the program.

### System calls

A **system call** is how a program asks the kernel for a service.

```text
User program            C library              Kernel
    │  read(fd, buf, n)     │                      │
    ├──────────────────────▶│ put call number      │
    │                       │ and args in registers│
    │                       │ execute trap ───────▶│ switch to kernel mode
    │                       │                      │ look up handler, check args,
    │                       │                      │ do the I/O
    │                       │◀──────────────────── │ return to user mode
    │◀──────────────────────│ return value         │
```

| Category | Examples (POSIX) |
|---|---|
| Process control | `fork`, `exec`, `exit`, `wait` |
| File management | `open`, `read`, `write`, `close` |
| Device management | `ioctl`, `read`, `write` |
| Information | `getpid`, `time` |
| Communication | `pipe`, `socket`, `shmget` |

A system call costs much more than an ordinary function call, because of the mode switch and the safety checks.

## 4. Kernel structures

| Structure | Idea | Pros | Cons | Examples |
|---|---|---|---|---|
| **Monolithic** | All services (scheduling, memory, file systems, drivers) in one large kernel | Fast: services call each other directly | A bug anywhere can crash everything; hard to maintain | Traditional Unix, Linux |
| **Layered** | Each layer uses only the one below it | Easy to verify layer by layer | Hard to choose layers; slow crossing many layers | THE OS |
| **Microkernel** | Kernel does only the minimum (IPC, scheduling, basic memory); drivers and file systems run as user processes | Reliable and secure: a crashed driver can restart | Slower, because services talk through messages | Mach, QNX, MINIX 3 |
| **Modular** | Monolithic core plus loadable modules | Flexible and fast | Modules still run with full privilege | Linux (loadable modules), Solaris |
| **Hybrid** | Mix of the above | Balance | Complexity | Windows NT, macOS (XNU) |

## 5. Booting

1. Power on: the CPU starts running **firmware** (BIOS or UEFI) from ROM.
2. Firmware runs self-tests and finds a **bootloader** on disk (for example GRUB).
3. The bootloader loads the **kernel** into memory and jumps to it.
4. The kernel initialises hardware and memory management, mounts the root file system and starts the first user process (`init` or `systemd`), which starts everything else.

<details class="go-deeper">
<summary>Go deeper: virtual machines and containers</summary>

A **hypervisor** runs several operating systems at once, each believing it owns the hardware. Type 1 hypervisors run on bare metal (VMware ESXi, Xen); type 2 run on a host OS (VirtualBox). **Containers** (Docker) are lighter: they share the host kernel but isolate processes, file systems and networks using kernel features such as namespaces and cgroups.
</details>

## Summary

- The OS manages resources and provides abstractions; the kernel runs with full privileges.
- Dual-mode operation plus a timer stops user programs from harming the system or hogging the CPU.
- Interrupts (hardware) and traps (software, including system calls) are the only ways into kernel mode.
- Monolithic kernels are fast; microkernels are more reliable; most real systems are hybrids or modular.

## Check yourself

<details>
<summary>Why can't a user program simply disable interrupts?</summary>

Disabling interrupts is a privileged instruction. If a user program could do it, it could stop the timer and never give up the CPU. Trying it in user mode causes a trap to the kernel.
</details>

<details>
<summary>What is the difference between an interrupt and a trap?</summary>

An interrupt comes from hardware and is asynchronous (it can happen at any time). A trap is caused by the running instruction itself, such as an error or a system call, so it is synchronous.
</details>

<details>
<summary>Why are microkernels more reliable than monolithic kernels?</summary>

Drivers and services run as separate user-mode processes, so a crash in one does not bring down the kernel, and the service can be restarted.
</details>
