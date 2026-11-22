---
title: Relational Algebra
description: Selection, projection, set operations, Cartesian product, rename, the join family (theta, natural, outer) and division, with worked queries on a university schema.
sidebar:
  label: "3. Relational algebra"
  order: 3
lesson:
  module: Query languages
  prerequisites:
    - label: Relational model
      link: /database-systems/relational-model/
  outcomes:
    - Write relational algebra expressions for common queries
    - Explain natural, theta and outer joins and when each is used
    - Use division for "for all" queries
  keyIdea: >-
    Relational algebra is a small set of operators that take tables and return tables, so they compose into queries. **Select** picks rows, **project** picks columns, **join** combines tables, and **division** answers "for all" questions. SQL is built on these ideas, and query optimizers rewrite them.
---

The examples use Student(sid, name, dept, cgpa), Course(cid, title, credits, dept) and Enrolled(sid, cid, grade).

## 1. Basic operators

| Operator | Symbol | Result | Example |
|---|---|---|---|
| Selection | $\sigma_{\text{condition}}(R)$ | Rows of $R$ satisfying the condition | $\sigma_{\text{dept} = \text{'CSE'}}(\text{Student})$ |
| Projection | $\pi_{\text{attributes}}(R)$ | Only those columns (duplicates removed) | $\pi_{\text{name}}(\text{Student})$ |
| Union | $R \cup S$ | Rows in either | |
| Difference | $R - S$ | Rows in $R$ but not $S$ | |
| Intersection | $R \cap S$ | Rows in both; equals $R - (R - S)$ | |
| Cartesian product | $R \times S$ | Every row of $R$ paired with every row of $S$ | |
| Rename | $\rho_{T}(R)$ | The same relation called $T$ | |

Union, difference and intersection need **union-compatible** relations: the same number of attributes with matching domains.

Conditions in $\sigma$ can use $=, \ne, <, \le, >, \ge$ combined with $\land$, $\lor$ and $\neg$.

**Example.** Names of CSE students with a CGPA above 3.5:

$$
\pi_{\text{name}}\big(\sigma_{\text{dept} = \text{'CSE'} \,\land\, \text{cgpa} > 3.5}(\text{Student})\big)
$$

## 2. Joins

A **theta join** is a Cartesian product followed by a selection:

$$
R \bowtie_{\theta} S = \sigma_{\theta}(R \times S)
$$

An **equijoin** is a theta join using only equality. A **natural join** $R \bowtie S$ is an equijoin on **all attributes with the same name**, keeping one copy of each.

**Example.** Names of students enrolled in course CSE-2213:

$$
\pi_{\text{name}}\big(\text{Student} \bowtie \sigma_{\text{cid} = \text{'CSE-2213'}}(\text{Enrolled})\big)
$$

The natural join matches on `sid`, the only common attribute.

**Outer joins** keep rows that have no match, padding the missing side with NULL:

| Join | Keeps unmatched rows from |
|---|---|
| Left outer $R ⟕ S$ | $R$ |
| Right outer $R ⟖ S$ | $S$ |
| Full outer $R ⟗ S$ | both |

$\text{Student} ⟕ \text{Enrolled}$ lists every student, including those enrolled in nothing (with NULL course and grade).

## 3. Division

**Division** answers "for all" queries. If $R(A, B)$ and $S(B)$, then $R \div S$ gives the values of $A$ that appear in $R$ **paired with every** $B$ in $S$.

**Example.** Students who have taken **every** CSE course:

$$
\pi_{\text{sid}, \text{cid}}(\text{Enrolled}) \div \pi_{\text{cid}}\big(\sigma_{\text{dept} = \text{'CSE'}}(\text{Course})\big)
$$

**Small worked example.**

| Enrolled (sid, cid) |
|---|
| (1, C1), (1, C2), (2, C1), (3, C1), (3, C2), (3, C3) |

With $S = \{C1, C2\}$: student 1 has both, student 2 is missing C2, student 3 has both. Result: **{1, 3}**.

Division can be written with the basic operators:

$$
R \div S = \pi_A(R) - \pi_A\big((\pi_A(R) \times S) - R\big)
$$

That is: all candidates, minus those for which some required pairing is missing.

## 4. More worked queries

**Students not enrolled in any course:**

$$
\pi_{\text{sid}}(\text{Student}) - \pi_{\text{sid}}(\text{Enrolled})
$$

**Students enrolled in both C1 and C2:**

$$
\pi_{\text{sid}}\big(\sigma_{\text{cid} = \text{'C1'}}(\text{Enrolled})\big) \cap \pi_{\text{sid}}\big(\sigma_{\text{cid} = \text{'C2'}}(\text{Enrolled})\big)
$$

**Pairs of students in the same department** (a self-join, using rename):

$$
\pi_{S_1.\text{sid}, S_2.\text{sid}}\big(\rho_{S_1}(\text{Student}) \bowtie_{S_1.\text{dept} = S_2.\text{dept} \,\land\, S_1.\text{sid} < S_2.\text{sid}} \rho_{S_2}(\text{Student})\big)
$$

The condition $S_1.\text{sid} < S_2.\text{sid}$ stops each pair from appearing twice, and a student being paired with themselves.

<details class="go-deeper">
<summary>Go deeper: extended operators and relational calculus</summary>

- **Aggregation** $\gamma$: $_{\text{dept}}\gamma_{\text{avg(cgpa)}}(\text{Student})$ gives the average CGPA per department, matching SQL's `GROUP BY`.
- **Generalised projection** allows expressions: $\pi_{\text{name},\, \text{credits} \times 2}$.
- **Relational calculus** is the declarative counterpart: tuple calculus writes $\{t \mid t \in \text{Student} \land t.\text{cgpa} > 3.5\}$. Codd's theorem says relational algebra and safe relational calculus are equally expressive. A language with this power is called **relationally complete**.
</details>

## Summary

- $\sigma$ filters rows, $\pi$ picks columns, $\times$ pairs every row, $\rho$ renames.
- Union, intersection and difference need union-compatible relations.
- A theta join is $\sigma_\theta(R \times S)$; a natural join matches on all same-named attributes; outer joins keep unmatched rows.
- Division $R \div S$ answers "for all" questions.

## Check yourself

<details>
<summary>If R has 5 rows and S has 4 rows, how many rows does R × S have?</summary>

$5 \times 4 = 20$.
</details>

<details>
<summary>What is the difference between σ and π?</summary>

$\sigma$ (selection) keeps some **rows** and all columns. $\pi$ (projection) keeps some **columns** and, in relational algebra, removes duplicate rows.
</details>

<details>
<summary>Which operator would you use to find suppliers who supply all parts?</summary>

Division: $\pi_{\text{supplier}, \text{part}}(\text{Supplies}) \div \pi_{\text{part}}(\text{Parts})$.
</details>
