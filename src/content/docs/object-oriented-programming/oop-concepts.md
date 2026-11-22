---
title: OOP Concepts
description: Procedural vs object-oriented programming, classes and objects, the four pillars (encapsulation, abstraction, inheritance, polymorphism), message passing, and reading UML class diagrams.
sidebar:
  label: "1. OOP concepts"
  order: 1
lesson:
  module: Core ideas
  outcomes:
    - Contrast procedural and object-oriented programming
    - Explain the difference between a class and an object
    - Define the four pillars of OOP with an example of each
    - Read a simple UML class diagram
  keyIdea: >-
    OOP models a program as **objects** that combine **state** (data) and **behaviour** (methods). A **class** is the blueprint; an **object** is an instance of it. The four pillars are **encapsulation** (hide the data), **abstraction** (show only what matters), **inheritance** (reuse by extending) and **polymorphism** (one interface, many forms).
---

## 1. Procedural vs object-oriented

| | Procedural (C) | Object-oriented (C++, Java) |
|---|---|---|
| Program is built from | Functions acting on separate data | Objects bundling data and functions |
| Data | Often global and shared, open to any function | Hidden inside objects; changed only through methods |
| Focus | The **steps** to perform | The **things** in the problem and their responsibilities |
| Reuse | Copying and calling functions | Inheritance and composition |
| Scales to large systems | Harder: changing data affects every function using it | Easier: changes stay inside a class |

OOP does not replace procedural thinking (methods are still written step by step); it adds a way to organise large programs.

## 2. Classes and objects

- A **class** is a blueprint describing what data an object holds (**attributes**, **fields**) and what it can do (**methods**, **member functions**).
- An **object** is a concrete **instance** of a class, with its own values. Many objects can be made from one class.

**Analogy:** the class `Car` is the design drawing; your car and my car are objects, each with its own colour and mileage.

```java
// Java
class BankAccount {
    private String owner;
    private double balance;

    BankAccount(String owner) { this.owner = owner; }

    void deposit(double amount) { balance += amount; }
    double getBalance() { return balance; }
}

BankAccount a = new BankAccount("Rina");   // an object
a.deposit(500);
```

Every object has **state** (its field values), **behaviour** (its methods) and **identity** (it is a distinct object, even if another has equal values).

**Message passing:** objects interact by calling each other's methods: `a.deposit(500)` sends the message "deposit 500" to object `a`.

## 3. The four pillars

| Pillar | Idea | Example |
|---|---|---|
| **Encapsulation** | Bundle data with the methods that use it, and **hide** the data behind an interface | `balance` is private; it can only change through `deposit` and `withdraw`, which check the rules |
| **Abstraction** | Expose **what** an object does, hide **how** | You call `list.sort()` without knowing the sorting algorithm; an abstract `Shape` has `area()` without saying how |
| **Inheritance** | Create a new class from an existing one, reusing and extending it ("is-a") | `SavingsAccount` extends `BankAccount` and adds interest |
| **Polymorphism** | The same call behaves differently depending on the object's actual type | `shape.area()` computes a circle's or a rectangle's area, whichever `shape` really is |

**Encapsulation vs abstraction**, a common viva question: encapsulation is about **hiding data** and protecting it (an implementation technique: private fields with public methods). Abstraction is about **hiding complexity** and showing only essential features (a design idea: interfaces and abstract classes). Encapsulation is one way to achieve abstraction.

## 4. Benefits of OOP

- **Modularity:** each class is a self-contained unit that can be built and tested separately.
- **Reusability:** classes can be reused and extended through inheritance and composition.
- **Maintainability:** hidden data can change without breaking code that uses the class.
- **Modelling:** objects map naturally onto real-world entities.
- **Extensibility:** polymorphism lets new types be added without changing existing code.

## 5. UML class diagrams

A class is drawn as a box with three compartments: name, attributes, methods. Visibility markers: `+` public, `-` private, `#` protected.

```text
┌─────────────────────────┐
│       BankAccount       │
├─────────────────────────┤
│ - owner : String        │
│ - balance : double      │
├─────────────────────────┤
│ + deposit(amt : double) │
│ + getBalance() : double │
└─────────────────────────┘
```

| Relationship | Meaning | UML notation | Example |
|---|---|---|---|
| **Inheritance** (generalisation) | is-a | Hollow triangle arrow to the parent | `Savings` → `Account` |
| **Association** | uses or knows | Plain line | `Teacher` — `Student` |
| **Aggregation** | has-a; the part can exist alone | Hollow diamond at the whole | `Department` ◇— `Professor` |
| **Composition** | owns; the part dies with the whole | Filled diamond at the whole | `House` ◆— `Room` |
| Dependency | temporarily uses | Dashed arrow | A method parameter of another type |
| Realisation | implements an interface | Dashed line with a hollow triangle | `Circle` ⇢ `Drawable` |

## Summary

- OOP organises programs around objects that combine data and behaviour; a class is the blueprint, an object an instance.
- Encapsulation hides data behind methods; abstraction hides complexity behind interfaces.
- Inheritance reuses a class by extending it (is-a); polymorphism lets one call act differently per type.
- UML: `+ - #` for visibility; triangle for inheritance; hollow diamond for aggregation, filled for composition.

## Check yourself

<details>
<summary>What is the difference between a class and an object?</summary>

A class is a definition (a type, a blueprint) and uses no memory for data by itself. An object is a specific instance created from it, with its own memory and field values.
</details>

<details>
<summary>Give an example distinguishing aggregation from composition.</summary>

Aggregation: a department has professors, but a professor still exists if the department closes. Composition: a house has rooms, and the rooms cease to exist if the house is demolished.
</details>

<details>
<summary>Is encapsulation the same as abstraction?</summary>

No. Encapsulation hides an object's data and controls access to it. Abstraction hides unnecessary detail and exposes only the essential behaviour. Encapsulation is a means of achieving abstraction.
</details>
