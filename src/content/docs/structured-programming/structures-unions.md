---
title: Structures, Unions and Enums
description: Defining and using structures, typedef, arrays of structures, nested structures, pointers to structures and the arrow operator, passing structures to functions, structure padding, unions, enumerations and bit fields.
sidebar:
  label: "6. Structures and unions"
  order: 6
lesson:
  module: Data and memory
  prerequisites:
    - label: Pointers
      link: /structured-programming/pointers/
  outcomes:
    - Define structures and access members with . and ->
    - Explain why sizeof a structure can exceed the sum of its members
    - Compare structures and unions
    - Use enums and typedef to make code clearer
  keyIdea: >-
    A **structure** groups related variables of different types under one name, each member with its **own** memory. A **union** overlaps its members in the **same** memory, so it is only as big as its largest member and holds one value at a time. Use `.` with a structure variable and `->` with a pointer to one.
---

## 1. Structures

```c
struct Student {
    int   id;
    char  name[50];
    float cgpa;
};

struct Student s1 = {101, "Rina", 3.75};
struct Student s2;
s2.id = 102;
strcpy(s2.name, "Tanvir");     // arrays inside structs still need strcpy
s2.cgpa = 3.50;

printf("%s %.2f\n", s1.name, s1.cgpa);
```

- The structure definition creates a **type**; variables of that type hold the data.
- Members are accessed with the **dot** operator.
- Whole structures **can** be assigned (`s2 = s1;` copies every member) but **cannot** be compared with `==`.

**typedef** gives a type a shorter name:

```c
typedef struct {
    int x, y;
} Point;

Point p = {3, 4};
```

## 2. Arrays of structures and nested structures

```c
struct Student class[60];
for (int i = 0; i < 60; i++)
    if (class[i].cgpa >= 3.75)
        printf("%s\n", class[i].name);
```

```c
struct Date { int day, month, year; };
struct Employee {
    char name[30];
    struct Date joined;          // nested structure
};

struct Employee e;
e.joined.year = 2024;
```

## 3. Pointers to structures

```c
struct Student *ptr = &s1;
printf("%d\n", (*ptr).id);   // parentheses needed: . binds tighter than *
printf("%d\n", ptr->id);     // the same thing, much neater
```

`ptr->member` is shorthand for `(*ptr).member`. Pointers to structures are how linked lists, trees and other [data structures](/data-structures/linked-lists/) are built in C.

### Passing structures to functions

- **By value:** the whole structure is copied. Safe, but slow for large structures.
- **By pointer:** only an address is copied, and the function can modify the original. Use `const struct Student *s` if it shouldn't.

```c
void raise_cgpa(struct Student *s, float bonus) {
    s->cgpa += bonus;
}
raise_cgpa(&s1, 0.1);
```

## 4. Padding and sizeof

Compilers insert **padding** so each member starts at an address that suits its type (its **alignment**), which makes memory access faster.

```c
struct A { char c; int i; char d; };   // typically 12 bytes
struct B { int i; char c; char d; };   // typically 8 bytes
```

In `struct A`, `c` takes 1 byte, then 3 bytes of padding so `i` starts at a multiple of 4, then `i` (4), then `d` (1) and 3 more bytes so the whole structure's size is a multiple of 4. **Ordering members from largest to smallest** usually reduces padding. Exact sizes depend on the compiler and machine.

## 5. Unions

All members of a union share the **same memory**:

```c
union Value {
    int   i;
    float f;
    char  c;
};

union Value v;
v.i = 65;
printf("%c\n", v.c);       // 'A' on a little-endian machine: the same bytes read as a char
v.f = 3.14;                // overwrites i and c
```

| | Structure | Union |
|---|---|---|
| Memory | Each member has its own space | All members share one space |
| Size | At least the sum of the members (plus padding) | The size of the **largest** member (plus padding) |
| Values held at once | All members | Only the last member written |
| Use | Grouping related data | Saving memory when only one of several types is needed at a time; viewing the same bytes in different ways |

Unions are often combined with a **tag** field recording which member is currently valid.

## 6. Enumerations

An **enum** gives names to integer constants:

```c
enum Day { MON, TUE, WED, THU, FRI, SAT, SUN };   // 0, 1, 2, ... 6
enum Level { LOW = 1, MEDIUM = 5, HIGH };         // HIGH = 6

enum Day today = WED;
if (today == WED) printf("Midweek\n");
printf("%d\n", today);                            // 2
```

Enums make code readable and work naturally in `switch` statements.

<details class="go-deeper">
<summary>Go deeper: bit fields</summary>

Members can be given a width in bits, packing several small values into one word:

```c
struct Flags {
    unsigned int is_ready : 1;
    unsigned int mode     : 3;   // values 0-7
};
```

Bit fields save memory in embedded systems and match hardware register layouts, but their exact layout is implementation-defined, and you can't take a bit field's address.
</details>

## Summary

- A structure groups different types; access members with `.`, or with `->` through a pointer.
- Structures can be assigned as a whole but not compared with `==`.
- Pass large structures by pointer for speed, using `const` when they shouldn't change.
- Padding aligns members, so `sizeof` can exceed the sum of the member sizes; order members largest first.
- A union's members share memory; its size is that of the largest member, and only one member is valid at a time.
- `enum` names integer constants, starting from 0 unless given values.

## Check yourself

<details>
<summary>What is the size of union { int i; double d; char c[3]; } on a typical machine?</summary>

8 bytes, the size of its largest member, `double` (already a multiple of its alignment).
</details>

<details>
<summary>What is the difference between ptr->x and *ptr.x?</summary>

`ptr->x` means `(*ptr).x`. `*ptr.x` parses as `*(ptr.x)`, which is an error when `ptr` is a pointer, because `.` binds tighter than `*`.
</details>

<details>
<summary>enum Color { RED = 3, GREEN, BLUE = 10, YELLOW }; What are GREEN and YELLOW?</summary>

GREEN = 4 (one more than RED), YELLOW = 11 (one more than BLUE).
</details>
