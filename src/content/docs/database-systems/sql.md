---
title: SQL
description: Creating tables with constraints, inserting, updating and deleting, SELECT with joins, aggregation with GROUP BY and HAVING, subqueries, set operations, NULL handling, views, and the order SQL clauses are evaluated in.
sidebar:
  label: "4. SQL"
  order: 4
lesson:
  module: Query languages
  prerequisites:
    - label: Relational algebra
      link: /database-systems/relational-algebra/
  outcomes:
    - Create tables with primary keys, foreign keys and checks
    - Write queries with joins, GROUP BY, HAVING and subqueries
    - Explain how NULL behaves in comparisons and aggregates
    - Use views to simplify queries and restrict access
  keyIdea: >-
    SQL is **declarative**: you say what you want, and the optimizer decides how. A query is evaluated in the order **FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY**, which explains most of the rules about what can go where.
---

## 1. Creating tables (DDL)

```sql
CREATE TABLE Student (
    sid   INT PRIMARY KEY,
    name  VARCHAR(50) NOT NULL,
    dept  VARCHAR(10),
    cgpa  DECIMAL(3, 2) CHECK (cgpa BETWEEN 0 AND 4)
);

CREATE TABLE Enrolled (
    sid    INT,
    cid    VARCHAR(10),
    grade  CHAR(2),
    PRIMARY KEY (sid, cid),
    FOREIGN KEY (sid) REFERENCES Student(sid) ON DELETE CASCADE,
    FOREIGN KEY (cid) REFERENCES Course(cid)
);
```

Other DDL: `ALTER TABLE Student ADD email VARCHAR(100);` and `DROP TABLE Student;`. Constraints include `NOT NULL`, `UNIQUE`, `PRIMARY KEY`, `FOREIGN KEY`, `CHECK` and `DEFAULT`.

## 2. Changing data (DML)

```sql
INSERT INTO Student VALUES (101, 'Rina', 'CSE', 3.75);
UPDATE Student SET cgpa = 3.80 WHERE sid = 101;
DELETE FROM Student WHERE dept = 'EEE';
```

A `DELETE` or `UPDATE` without a `WHERE` clause affects **every** row.

## 3. Basic queries

```sql
SELECT name, cgpa
FROM Student
WHERE dept = 'CSE' AND cgpa > 3.5
ORDER BY cgpa DESC;
```

- `SELECT DISTINCT dept FROM Student;` removes duplicates. Plain SQL keeps them, unlike relational algebra.
- Pattern matching: `WHERE name LIKE 'R%'` (`%` matches any string, `_` exactly one character).
- Ranges and lists: `cgpa BETWEEN 3 AND 4`, `dept IN ('CSE', 'EEE')`.

## 4. Joins

```sql
-- inner join: students with their enrolments
SELECT S.name, E.cid, E.grade
FROM Student S
JOIN Enrolled E ON S.sid = E.sid;

-- left join: every student, even those with no enrolments
SELECT S.name, E.cid
FROM Student S
LEFT JOIN Enrolled E ON S.sid = E.sid;
```

`NATURAL JOIN` joins on all same-named columns; it is convenient but fragile if columns are added later.

## 5. Aggregation

Aggregate functions: `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`.

```sql
-- average CGPA per department, only departments with more than 50 students
SELECT dept, AVG(cgpa) AS avg_cgpa, COUNT(*) AS students
FROM Student
GROUP BY dept
HAVING COUNT(*) > 50
ORDER BY avg_cgpa DESC;
```

- **`WHERE`** filters **rows** before grouping. **`HAVING`** filters **groups** after aggregation.
- Every column in `SELECT` must either be in `GROUP BY` or inside an aggregate.

### Evaluation order

| Order | Clause | Does |
|---|---|---|
| 1 | `FROM` / `JOIN` | Build the combined rows |
| 2 | `WHERE` | Filter rows |
| 3 | `GROUP BY` | Form groups |
| 4 | `HAVING` | Filter groups |
| 5 | `SELECT` | Compute output columns |
| 6 | `DISTINCT` | Remove duplicates |
| 7 | `ORDER BY` | Sort |
| 8 | `LIMIT` / `FETCH` | Take the first rows |

That is why `WHERE AVG(cgpa) > 3` is an error (aggregates don't exist yet at step 2), and why a column alias from `SELECT` cannot be used in `WHERE`.

## 6. Subqueries

```sql
-- students with above-average CGPA (scalar subquery)
SELECT name FROM Student
WHERE cgpa > (SELECT AVG(cgpa) FROM Student);

-- students enrolled in CSE-2213 (IN)
SELECT name FROM Student
WHERE sid IN (SELECT sid FROM Enrolled WHERE cid = 'CSE-2213');

-- students enrolled in nothing (NOT EXISTS, correlated)
SELECT name FROM Student S
WHERE NOT EXISTS (SELECT * FROM Enrolled E WHERE E.sid = S.sid);

-- highest CGPA in each department (correlated)
SELECT name, dept, cgpa FROM Student S
WHERE cgpa = (SELECT MAX(cgpa) FROM Student T WHERE T.dept = S.dept);
```

A **correlated** subquery refers to the outer query (here `S.sid`, `S.dept`), so conceptually it runs once per outer row.

**Comparisons with sets:** `> ALL (subquery)` means greater than every value; `> ANY (subquery)` (or `SOME`) means greater than at least one.

**"For all" in SQL** (relational division) uses a double `NOT EXISTS`: students for whom there is no CSE course they have not taken.

```sql
SELECT S.name FROM Student S
WHERE NOT EXISTS (
    SELECT * FROM Course C
    WHERE C.dept = 'CSE'
      AND NOT EXISTS (SELECT * FROM Enrolled E
                      WHERE E.sid = S.sid AND E.cid = C.cid));
```

## 7. Set operations

`UNION`, `INTERSECT` and `EXCEPT` (`MINUS` in Oracle) remove duplicates; `UNION ALL` keeps them.

```sql
SELECT sid FROM Enrolled WHERE cid = 'C1'
INTERSECT
SELECT sid FROM Enrolled WHERE cid = 'C2';
```

## 8. NULL

`NULL` means unknown or missing. SQL uses **three-valued logic**: TRUE, FALSE and UNKNOWN.

- Any comparison with NULL is UNKNOWN: `NULL = NULL` is not TRUE. Use `IS NULL` and `IS NOT NULL`.
- `WHERE` keeps only rows where the condition is TRUE, so UNKNOWN rows are dropped.
- Aggregates **ignore** NULLs, except `COUNT(*)`, which counts rows. So `COUNT(grade)` can be smaller than `COUNT(*)`.
- `NOT IN` with a subquery that returns a NULL returns no rows. Prefer `NOT EXISTS`.

## 9. Views

A **view** is a saved query that behaves like a table:

```sql
CREATE VIEW CSE_Toppers AS
SELECT sid, name, cgpa FROM Student
WHERE dept = 'CSE' AND cgpa >= 3.75;

SELECT * FROM CSE_Toppers;
```

Views simplify complex queries, hide columns users should not see (security), and provide logical data independence. Simple views can be updated; views with joins or aggregates usually cannot. A **materialized view** stores its result physically and must be refreshed.

<details class="go-deeper">
<summary>Go deeper: privileges, triggers and stored procedures</summary>

- **Privileges:** `GRANT SELECT ON Student TO ta_user;` and `REVOKE ...`.
- **Triggers** run automatically on `INSERT`, `UPDATE` or `DELETE`, for example to keep an audit log.
- **Stored procedures and functions** keep logic inside the database.
- **Window functions** compute values over related rows without collapsing them: `RANK() OVER (PARTITION BY dept ORDER BY cgpa DESC)`.
</details>

## Summary

- DDL defines tables and constraints; DML inserts, updates and deletes.
- Evaluation order: FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY.
- WHERE filters rows; HAVING filters groups; non-aggregated SELECT columns must be grouped.
- Subqueries can be scalar, used with IN or EXISTS, or correlated with the outer query; double NOT EXISTS expresses "for all".
- NULL comparisons are UNKNOWN; aggregates skip NULLs except COUNT(*).
- Views are named queries used for simplicity, security and independence.

## Check yourself

<details>
<summary>Write a query for the number of students enrolled in each course, showing only courses with at least 30 students.</summary>

```sql
SELECT cid, COUNT(*) AS n
FROM Enrolled
GROUP BY cid
HAVING COUNT(*) >= 30;
```
</details>

<details>
<summary>Why does "SELECT dept, name, AVG(cgpa) FROM Student GROUP BY dept" fail?</summary>

`name` is neither grouped nor aggregated. A department has many names, so the database cannot choose one value per group.
</details>

<details>
<summary>A table has 10 rows, and 3 of them have grade NULL. What do COUNT(*) and COUNT(grade) return?</summary>

`COUNT(*)` returns 10; `COUNT(grade)` returns 7.
</details>
