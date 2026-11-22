---
title: Maintenance, Configuration and Quality
description: Types of maintenance, legacy systems and re-engineering, version control and configuration management, CI/CD and DevOps, software quality attributes and models, CMMI maturity levels, metrics, and professional ethics.
sidebar:
  label: "8. Maintenance and quality"
  order: 8
lesson:
  module: Management
  prerequisites:
    - label: Testing
      link: /software-engineering/testing/
  outcomes:
    - Classify maintenance work into its four types
    - Explain version control, CI/CD and DevOps
    - Name the main software quality attributes and the CMMI levels
    - Describe the main ethical responsibilities of software engineers
  keyIdea: >-
    Most of a system's lifetime cost is **maintenance**, so software must be built to change. **Version control** and **CI/CD** make change safe and routine, quality models define what "good software" means, and **CMMI** measures how mature an organisation's process is.
---

## 1. Maintenance

Maintenance often accounts for **60–80%** of total software cost.

| Type | Purpose | Example |
|---|---|---|
| **Corrective** | Fix defects | Patch a crash |
| **Adaptive** | Adapt to a changed environment | Support a new OS version or a new tax law |
| **Perfective** | Improve or add features, performance | Add a dark mode, speed up search |
| **Preventive** | Make future maintenance easier | Refactor messy code, update documentation |

Perfective and adaptive maintenance usually make up most of the work, not bug fixing.

**Lehman's laws** of software evolution say, among other things, that a system in use must keep changing or become less useful, and that its complexity increases unless work is done to reduce it.

**Legacy systems** are old systems still critical to a business. Options: keep maintaining them, **re-engineer** them (restructure and document without changing functionality), **reverse engineer** them (recover the design from the code), wrap them behind modern interfaces, or replace them.

**Refactoring** improves the internal structure of code without changing its behaviour, backed by tests to prove nothing broke.

## 2. Version control and configuration management

**Software configuration management (SCM)** tracks and controls changes to every artefact: code, documents, configuration and builds.

**Version control systems** (Git, and older SVN):

- record every change with its author, time and reason;
- let teams work in parallel on **branches** and **merge** them;
- allow any earlier version to be restored;
- support code review through **pull requests**.

Git is **distributed**: every developer has the full history. Common Git workflow: create a feature branch, commit, push, open a pull request, review, merge into `main`.

Other SCM activities: **baselines** (formally agreed versions), **change control** (requests are reviewed and approved), **release management**, and configuration audits.

## 3. CI/CD and DevOps

- **Continuous integration (CI):** developers merge into the main branch often (at least daily); every merge triggers an automatic **build and test**, so integration problems are caught within minutes.
- **Continuous delivery (CD):** every change that passes the pipeline is ready to release with one click.
- **Continuous deployment:** every passing change is released to production automatically.
- **DevOps:** a culture and set of practices that bring development and operations together: automation of building, testing and deployment, **infrastructure as code**, monitoring, and fast feedback from production.

A typical pipeline: commit → build → unit tests → static analysis → integration tests → deploy to staging → acceptance tests → deploy to production.

## 4. Software quality

**Quality attributes** (from the ISO/IEC 25010 model, which replaced ISO 9126):

| Attribute | Meaning |
|---|---|
| Functional suitability | Does it do what is needed, correctly? |
| Performance efficiency | Response time, resource use |
| Compatibility | Works with other systems |
| Usability | Easy to learn and use; accessible |
| Reliability | Available, fault-tolerant, recoverable |
| Security | Confidentiality, integrity, authentication |
| Maintainability | Modular, analysable, modifiable, testable |
| Portability | Easy to move to other environments |

**Quality assurance (QA)** is about the **process** (preventing defects through standards, reviews and audits); **quality control (QC)** is about the **product** (finding defects through testing and inspection).

**Software metrics** quantify quality and progress: lines of code, cyclomatic complexity, defect density (defects per KLOC), test coverage, mean time between failures (MTBF), and code churn.

## 5. CMMI

The **Capability Maturity Model Integration** rates how mature an organisation's development process is:

| Level | Name | Characteristics |
|---|---|---|
| 1 | Initial | Ad hoc and chaotic; success depends on individual heroes |
| 2 | Managed | Basic project management: planning, tracking, requirements and configuration management |
| 3 | Defined | Standard processes documented and used across the organisation |
| 4 | Quantitatively managed | Processes measured and controlled with statistics |
| 5 | Optimising | Continuous process improvement |

**ISO 9001** is a general quality management standard that organisations can be certified against.

## 6. Professional ethics

The ACM/IEEE **Software Engineering Code of Ethics** asks engineers to act in the **public interest**, serve their clients and employers consistently with that interest, keep their products and judgment to high standards, and be honest about their abilities and the limitations of their work.

In practice: protect users' privacy and data, don't hide known defects that could cause harm, respect intellectual property and licences, consider accessibility and bias, and refuse work that endangers people.

## Summary

- Maintenance is most of a system's cost: corrective, adaptive, perfective and preventive.
- Version control (Git) records and merges changes; SCM controls all artefacts.
- CI builds and tests every merge; CD keeps the product always releasable; DevOps joins development and operations.
- Quality attributes include reliability, usability, security, performance and maintainability; QA improves the process, QC checks the product.
- CMMI levels: initial, managed, defined, quantitatively managed, optimising.

## Check yourself

<details>
<summary>Updating an app to work on a new Android version is which type of maintenance?</summary>

Adaptive maintenance: adapting to a change in the environment.
</details>

<details>
<summary>What is the difference between continuous delivery and continuous deployment?</summary>

In continuous delivery, every change that passes the pipeline is ready to release, but a person decides when to release. In continuous deployment, it is released to production automatically.
</details>

<details>
<summary>At which CMMI level do organisations have standard, documented processes used across all projects?</summary>

Level 3, Defined.
</details>
