---
title: Software Testing
description: Verification vs validation, errors, faults and failures, testing levels (unit, integration, system, acceptance), black-box techniques (equivalence partitioning, boundary value analysis, decision tables), white-box techniques (statement and branch coverage, cyclomatic complexity), regression testing, and TDD.
sidebar:
  label: "6. Testing"
  order: 6
lesson:
  module: Quality
  prerequisites:
    - label: Requirements
      link: /software-engineering/requirements/
  outcomes:
    - Distinguish verification from validation, and errors, faults and failures
    - Describe the testing levels and integration strategies
    - Design test cases with equivalence partitioning and boundary value analysis
    - Compute cyclomatic complexity and the number of basis paths
  keyIdea: >-
    Testing shows the presence of bugs, never their absence, so test cases must be chosen cleverly. **Black-box** techniques derive tests from the specification (partitions and boundaries); **white-box** techniques derive them from the code's structure (coverage, cyclomatic complexity). Tests run at every level, from units to the whole system.
---

## 1. Basic terms

- **Error (mistake):** a human action that produces a wrong result (a misunderstood requirement, a typo).
- **Fault (defect, bug):** the resulting flaw in the code or document.
- **Failure:** the observable wrong behaviour when the faulty code runs.

**Verification vs validation:**

| | Verification | Validation |
|---|---|---|
| Question | **Are we building the product right?** | **Are we building the right product?** |
| Checks against | The specification | The user's real needs |
| Methods | Reviews, inspections, walkthroughs, static analysis | Testing the running system, acceptance testing |

**Static** testing examines artefacts without running them (code reviews, inspections, static analysis); **dynamic** testing runs the code.

## 2. Testing levels

| Level | Tests | Done by | Usual technique |
|---|---|---|---|
| **Unit** | Individual functions or classes in isolation | Developers | White-box; test frameworks (JUnit, pytest) |
| **Integration** | Interfaces between combined units | Developers / testers | Both |
| **System** | The complete system against the requirements, including non-functional ones (performance, security, load) | Independent testers | Black-box |
| **Acceptance** | Whether the customer accepts the system | Customers / users | Black-box; **alpha** (at the developer's site) and **beta** (real users in their environment) |

**Integration strategies:**

- **Big bang:** combine everything at once. Simple, but failures are hard to locate.
- **Top-down:** start from the top-level modules, replacing lower modules not yet ready with **stubs**.
- **Bottom-up:** start from the lowest modules, using **drivers** to call them.
- **Sandwich:** a mix of both.

## 3. Black-box testing

Tests are designed from the **specification**, without looking at the code.

### Equivalence partitioning

Divide the inputs into **classes** that the program should treat the same way, and test one value from each.

**Example.** A field accepts an age from 18 to 60.

| Partition | Example test value |
|---|---|
| Below the range (invalid) | 10 |
| Within the range (valid) | 35 |
| Above the range (invalid) | 70 |

### Boundary value analysis

Errors cluster at the **edges** of partitions, so test at and around each boundary.

For 18–60: test **17, 18, 19** and **59, 60, 61** (a common shorter version uses just 17, 18, 60, 61). With $n$ variables, standard BVA (min, min+1, nominal, max−1, max for each, holding the others at nominal) needs $4n + 1$ test cases.

### Decision tables

For logic depending on combinations of conditions, list every combination and the expected action.

| Conditions / actions | Rule 1 | Rule 2 | Rule 3 | Rule 4 |
|---|---|---|---|---|
| Valid user? | Y | Y | N | N |
| Correct password? | Y | N | Y | N |
| **Grant access** | ✓ | | | |
| **Show error** | | ✓ | ✓ | ✓ |

Other black-box techniques: state transition testing, use case testing, error guessing.

## 4. White-box testing

Tests are designed from the **code's structure**.

| Coverage criterion | Every… is executed at least once | Strength |
|---|---|---|
| Statement coverage | statement | weakest |
| **Branch (decision) coverage** | outcome of every decision (true and false) | stronger: implies statement coverage |
| Condition coverage | true and false value of every individual condition | |
| **Path coverage** | possible path | strongest; often impossible (loops create infinitely many paths) |

### Cyclomatic complexity

McCabe's **cyclomatic complexity** $V(G)$ measures the number of independent paths through a program's control-flow graph, and therefore the minimum number of test cases for **basis path testing**:

$$
V(G) = E - N + 2P
$$

where $E$ is the number of edges, $N$ the number of nodes and $P$ the number of connected components (1 for a single function). Equivalently:

$$
V(G) = \text{number of decision points} + 1 = \text{number of regions in the flow graph}
$$

**Example.**

```c
int classify(int x) {
    if (x < 0)             // decision 1
        return -1;
    while (x > 10)         // decision 2
        x = x / 2;
    if (x % 2 == 0)        // decision 3
        return 0;
    return 1;
}
```

Three decisions, so $V(G) = 3 + 1 = 4$: at least **4 test cases** are needed to cover the independent paths. A $V(G)$ above about 10 suggests the function is too complex and should be split.

## 5. Other kinds of testing

- **Regression testing:** rerun existing tests after every change, to catch new bugs in old features. It is the main reason tests are **automated**.
- **Smoke testing:** a quick check that the build's basic functions work at all. **Sanity testing:** a quick check that a specific fix works.
- **Performance testing:** load (expected traffic), stress (beyond the limits), scalability.
- **Security testing**, **usability testing**, **compatibility testing**.
- **Mutation testing:** introduce small changes (mutants) into the code; good tests should fail ("kill" them).

## 6. Test-driven development

**TDD** repeats a short cycle:

1. **Red:** write a test for a small piece of new behaviour; it fails.
2. **Green:** write the simplest code that passes it.
3. **Refactor:** clean up the code while keeping all tests passing.

It produces a large automated test suite, encourages small testable units, and documents behaviour through tests.

## Summary

- Error → fault → failure. Verification: built right? Validation: right product?
- Levels: unit, integration (big bang, top-down with stubs, bottom-up with drivers), system, acceptance (alpha, beta).
- Black-box: equivalence partitioning, boundary value analysis, decision tables.
- White-box: statement ⊂ branch ⊂ path coverage; $V(G) = E - N + 2P$ = decisions + 1 = minimum basis-path tests.
- Regression tests guard old features after changes; TDD writes tests first.

## Check yourself

<details>
<summary>A control-flow graph has 9 edges and 7 nodes. What is its cyclomatic complexity?</summary>

$V(G) = 9 - 7 + 2 = 4$.
</details>

<details>
<summary>An input accepts integers from 1 to 100. Give boundary value test inputs.</summary>

0, 1, 2, 99, 100 and 101 (or at minimum 0, 1, 100, 101).
</details>

<details>
<summary>What are stubs and drivers?</summary>

Stubs are simplified replacements for lower-level modules that the code under test calls (used in top-down integration). Drivers are test code that calls lower-level modules that don't yet have their real callers (used in bottom-up integration).
</details>
