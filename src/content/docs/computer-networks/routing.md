---
title: Routing
description: Forwarding with longest prefix match, distance-vector routing (Bellman–Ford, count to infinity, split horizon), link-state routing (Dijkstra, OSPF), RIP, OSPF and BGP, and autonomous systems.
sidebar:
  label: "7. Routing"
  order: 7
lesson:
  module: Network layer
  prerequisites:
    - label: IP addressing
      link: /computer-networks/ip-addressing/
  outcomes:
    - Choose the outgoing link for a packet using longest prefix match
    - Update a distance vector with the Bellman–Ford equation
    - Explain the count-to-infinity problem and how split horizon helps
    - Compare RIP, OSPF and BGP
  keyIdea: >-
    **Forwarding** moves a packet to the right output port using the routing table; **routing** builds that table. **Distance-vector** routers share their distance estimates with neighbours (Bellman–Ford) and can count to infinity; **link-state** routers flood the whole topology and each runs Dijkstra. BGP connects the networks of the whole Internet.
---

## 1. Forwarding and longest prefix match

A router's **forwarding table** maps address prefixes to output links. If several entries match a destination, the router uses the **most specific** one: the **longest prefix match**.

| Prefix | Next hop |
|---|---|
| 10.0.0.0/8 | A |
| 10.1.0.0/16 | B |
| 10.1.2.0/24 | C |
| 0.0.0.0/0 (default) | D |

| Destination | Matching entries | Chosen |
|---|---|---|
| 10.1.2.5 | /8, /16, /24, default | **C** (/24) |
| 10.1.9.9 | /8, /16, default | **B** (/16) |
| 10.200.0.1 | /8, default | **A** (/8) |
| 8.8.8.8 | default only | **D** |

## 2. Distance-vector routing

Each router keeps a **distance vector**: its best known cost to every destination. Periodically it sends its vector to its **neighbours**, and updates its own using the **Bellman–Ford equation**:

$$
D_x(y) = \min_{v \in \text{neighbours}(x)} \big\{\, c(x, v) + D_v(y) \,\big\}
$$

**Example.** Router A has neighbours B (link cost 1) and C (link cost 4). B reports a distance of 5 to D, and C reports 1.

$$
D_A(D) = \min(1 + 5,\; 4 + 1) = 5, \text{ via } C
$$

Each router knows only its neighbours' vectors, not the whole map. The algorithm is distributed, iterative and asynchronous.

### Count to infinity

Good news (a cheaper path) spreads quickly, but **bad news spreads slowly**. Consider A — B — C in a line, with each link cost 1. B reaches C at cost 1, and A reaches C at cost 2 via B. Now the B–C link fails:

1. B no longer reaches C directly. A advertises a cost of 2 to C, so B thinks "I can reach C via A at cost 3", not realising A's route goes through B itself.
2. A then updates to 4 via B, B to 5 via A, and so on: the costs **count upward**, slowly, towards infinity.

**Fixes:**

- **Split horizon:** never advertise a route back to the neighbour you learned it from.
- **Poisoned reverse:** advertise it back with cost **infinity**.
- **A small "infinity":** RIP uses 16, so counting stops quickly.

These fix two-node loops but not every longer loop.

## 3. Link-state routing

1. Each router learns the cost of its links to its neighbours.
2. It **floods** a **link-state advertisement** (LSA) describing them to **every** router in the network.
3. Every router then has the **complete map** and runs [Dijkstra's algorithm](/algorithms/shortest-paths/#dijkstras-algorithm) to compute shortest paths from itself.

## 4. Distance vector vs link state

| | Distance vector | Link state |
|---|---|---|
| Information shared | Whole distance vector, with **neighbours** only | Own link costs, with **everyone** (flooding) |
| Algorithm | Bellman–Ford (distributed) | Dijkstra (local, on the full map) |
| Convergence | Slow; count-to-infinity possible | Fast |
| Message overhead | Low per message | Higher (flooding) |
| Memory and CPU | Low | Higher (whole topology) |
| Example | RIP | OSPF, IS-IS |

## 5. Routing in the Internet

The Internet is a network of **autonomous systems (ASes)**: networks run by one organisation, such as an ISP or university.

- **Intra-AS routing** (interior gateway protocols), inside one AS:
  - **RIP:** distance vector; hop count as cost; maximum 15 hops (16 = infinity); updates every 30 seconds. Simple, for small networks.
  - **OSPF:** link state; configurable costs; areas for scaling; fast convergence; authenticated messages. The usual choice in large enterprises and ISPs.
- **Inter-AS routing:** **BGP** (Border Gateway Protocol), a **path-vector** protocol. Routes are advertised with the full list of ASes they pass through, which avoids loops (a router rejects a path containing its own AS). Route choice is driven largely by **policy** (business relationships), not just shortest paths.

## Summary

- Forwarding uses longest prefix match; routing builds the table.
- Distance vector: $D_x(y) = \min_v \{c(x,v) + D_v(y)\}$, shared with neighbours; prone to count-to-infinity, eased by split horizon and poisoned reverse.
- Link state: flood link costs, then every router runs Dijkstra; converges fast.
- RIP is distance vector (max 15 hops), OSPF is link state, and BGP is path vector between autonomous systems.

## Check yourself

<details>
<summary>A router has entries for 192.168.0.0/16 and 192.168.4.0/22. Which one handles 192.168.5.10?</summary>

Both match (192.168.4.0/22 covers 192.168.4.0–192.168.7.255), so the longer prefix, /22, is used.
</details>

<details>
<summary>Why does RIP use 16 to mean infinity?</summary>

A small infinity makes count-to-infinity stop quickly. The cost is that RIP cannot handle networks wider than 15 hops.
</details>

<details>
<summary>Why does BGP use path vectors rather than just distances?</summary>

Listing the ASes on the path lets a router detect and reject loops, and lets each AS apply policies about which networks its traffic may pass through.
</details>
