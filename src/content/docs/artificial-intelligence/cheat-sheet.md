---
title: Artificial Intelligence Cheat Sheet
description: One-page revision of agents, uninformed, informed, local and adversarial search, CSPs, logic and inference, probability and Bayesian networks, and fuzzy logic.
sidebar:
  label: "9. Cheat sheet"
  order: 20
  badge:
    text: Revision
    variant: note
lesson:
  module: Revision
---

Use this page for last-minute revision. Each heading links back to the full lesson.

## [Agents](/artificial-intelligence/intelligent-agents/)

- Rational agent: maximise the expected performance measure. Turing test: indistinguishable conversation.
- PEAS: performance, environment, actuators, sensors.
- Environment: observable, agents, deterministic/stochastic, episodic/sequential, static/dynamic, discrete/continuous.
- Agent types: simple reflex, model-based, goal-based, utility-based, learning.

## [Uninformed](/artificial-intelligence/uninformed-search/) and [informed search](/artificial-intelligence/informed-search/)

| | Complete | Optimal | Time | Space |
|---|---|---|---|---|
| BFS | Yes | Equal costs | $b^d$ | $b^d$ |
| UCS | Yes | Yes | $b^{1+C^*/\varepsilon}$ | same |
| DFS | No | No | $b^m$ | $bm$ |
| IDS | Yes | Equal costs | $b^d$ | $bd$ |
| A* | Yes | Admissible $h$ | exponential | keeps all nodes |

- A*: $f = g + h$. Admissible: $h \le h^*$. Consistent: $h(n) \le c(n, n') + h(n')$. Relax the problem to design $h$.
- Greedy best-first ($h$ only) is fast but not optimal.
- Hill climbing: local maxima, plateaus, ridges. Simulated annealing: accept worse with $e^{\Delta E/T}$. Genetic: selection, crossover, mutation.

## [Games](/artificial-intelligence/adversarial-search/)

- Minimax: max at MAX nodes, min at MIN nodes.
- Alpha–beta: α = MAX's best, β = MIN's best; prune when α ≥ β; same result as minimax.
- Perfect ordering: $O(b^{m/2})$. Expectiminimax: expected value at chance nodes.

## [CSPs](/artificial-intelligence/csp/)

- Variables, domains, constraints. Backtracking = DFS assigning one variable per level.
- Forward checking: prune neighbours of the assigned variable. AC-3: make every arc consistent.
- MRV (fewest values first), degree (most constraints), LCV (least constraining value).

## [Logic](/artificial-intelligence/logic-knowledge/)

- Sound: only entailed sentences. Complete: all entailed sentences.
- Resolution refutation: CNF of KB ∧ ¬goal, resolve to the empty clause.
- Horn clauses: forward chaining (facts → goal), backward chaining (goal → facts).
- FOL: $\forall$ with $\to$, $\exists$ with $\land$; unification finds substitutions.

## [Uncertainty](/artificial-intelligence/uncertainty/) and [fuzzy logic](/artificial-intelligence/fuzzy-logic/)

- Bayes: $P(H \mid E) = P(E \mid H)P(H)/P(E)$. Rare disease + positive test → still unlikely (base rate).
- Naive Bayes: $P(C \mid x) \propto P(C)\prod P(x_i \mid C)$.
- Bayesian network: $P(x_1..x_n) = \prod P(x_i \mid \text{parents})$.
- Fuzzy: AND = min, OR = max, NOT = 1 − μ. Mamdani: fuzzify → rules → aggregate → defuzzify (centroid).

## Top viva questions

1. What is a rational agent? Give a PEAS description.
2. Classify an environment by its properties.
3. Compare BFS, DFS, UCS and IDS.
4. Run A*; why is it optimal with an admissible heuristic?
5. Admissible vs consistent heuristics; how do you design one?
6. Explain hill climbing's problems and how simulated annealing helps.
7. Compute minimax values and show alpha–beta pruning.
8. Formulate a CSP; explain MRV, LCV and forward checking.
9. Prove a statement by resolution.
10. Forward vs backward chaining.
11. Apply Bayes' theorem; explain naive Bayes.
12. What is fuzzy logic, and how does a fuzzy controller work?
