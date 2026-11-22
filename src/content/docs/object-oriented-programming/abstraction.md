---
title: Abstract Classes and Interfaces
description: Abstraction in practice, pure virtual functions and abstract classes in C++, abstract classes and interfaces in Java, default and static interface methods, and choosing between an abstract class and an interface.
sidebar:
  label: "6. Abstract classes and interfaces"
  order: 6
lesson:
  module: Core ideas
  prerequisites:
    - label: Polymorphism
      link: /object-oriented-programming/polymorphism/
  outcomes:
    - Write abstract classes in C++ and Java
    - Define and implement Java interfaces, including default methods
    - Choose between an abstract class and an interface for a design
  keyIdea: >-
    An **abstract class** is a partial blueprint that cannot be instantiated: it can hold state and some implemented methods, but leaves others for subclasses. An **interface** is a pure contract of what an object can do. Programming against these abstractions instead of concrete classes lets implementations change freely.
---

## 1. Abstraction in practice

Abstraction means exposing **what** something does while hiding **how**. In OOP it is achieved with abstract classes and interfaces: code depends on the abstract type, and any concrete class satisfying it can be plugged in.

```java
void printAll(List<String> items) { ... }   // works with ArrayList, LinkedList, ...
```

`printAll` neither knows nor cares which kind of list it receives.

## 2. Abstract classes in C++

A **pure virtual function** has `= 0` instead of a body. A class with at least one pure virtual function is **abstract**: you cannot create objects of it, only of derived classes that override every pure virtual function.

```cpp
class Shape {                            // abstract class
public:
    virtual double area() const = 0;     // pure virtual: no body
    virtual ~Shape() = default;
    void describe() const {              // an ordinary, implemented method
        cout << "Area: " << area() << "\n";
    }
};

class Circle : public Shape {
    double r;
public:
    Circle(double r) : r(r) {}
    double area() const override { return 3.14159 * r * r; }
};

// Shape s;           // error: cannot instantiate an abstract class
Shape *s = new Circle(2);   // fine: pointer to the abstract base
s->describe();              // Area: 12.5664
```

A derived class that doesn't override every pure virtual function is itself abstract. C++ has no separate "interface" keyword: a class with **only** pure virtual functions (and a virtual destructor) serves as one.

## 3. Abstract classes in Java

```java
abstract class Employee {
    protected String name;                       // can hold state
    Employee(String name) { this.name = name; }  // can have constructors

    abstract double salary();                    // no body: subclasses must implement

    void printPayslip() {                        // concrete method using the abstract one
        System.out.println(name + ": " + salary());
    }
}

class Manager extends Employee {
    Manager(String n) { super(n); }
    double salary() { return 80000; }
}
```

- Declared with `abstract`; cannot be instantiated with `new`.
- May have constructors, fields, and both abstract and concrete methods.
- A class can extend only **one** abstract class.

## 4. Interfaces in Java

An **interface** declares what a class can do, without saying how.

```java
interface Drawable {
    void draw();                         // implicitly public and abstract

    default void drawTwice() {           // Java 8+: method with a default body
        draw(); draw();
    }

    static Drawable empty() {            // Java 8+: static helper
        return () -> {};
    }
}

interface Resizable { void resize(double factor); }

class Image implements Drawable, Resizable {     // implements several interfaces
    public void draw() { System.out.println("Drawing image"); }
    public void resize(double f) { /* ... */ }
}
```

- Fields in an interface are implicitly `public static final` (constants).
- A class can **implement many** interfaces, which is how Java offers multiple inheritance of type.
- An interface can extend other interfaces.
- An interface with exactly one abstract method is a **functional interface** and can be implemented with a lambda (`Runnable`, `Comparator`).

## 5. Abstract class or interface?

| | Abstract class | Interface |
|---|---|---|
| Instantiable | No | No |
| State (instance fields) | Yes | No (constants only) |
| Constructors | Yes | No |
| Methods | Abstract and concrete | Abstract, plus `default`, `static` and `private` methods |
| Access modifiers on methods | Any | Public (or private helpers) |
| How many a class can use | **One** (extends) | **Many** (implements) |
| Relationship expressed | "**is-a** kind of" (shared identity and code) | "**can do**" (a capability) |

**Rules of thumb:**

- Use an **abstract class** when related classes share state and code, such as `Employee` with common fields and a payslip method.
- Use an **interface** to describe a capability that unrelated classes can have, such as `Comparable`, `Serializable` or `Drawable`, or when a class needs several such types.
- Many designs use both: an interface for the contract and an abstract class providing a partial implementation (Java's `List` and `AbstractList`).

## Summary

- Abstraction means depending on what an object does, not how; abstract classes and interfaces are the tools.
- C++: a class with a pure virtual function (`= 0`) is abstract and cannot be instantiated.
- Java abstract classes can hold state, constructors and concrete methods; a class extends only one.
- Java interfaces declare capabilities; a class implements many; Java 8 added default and static methods.
- Abstract class for shared identity and code; interface for a capability or a contract.

## Check yourself

<details>
<summary>Can an abstract class have a constructor? Why, if it can't be instantiated?</summary>

Yes. The constructor runs when a concrete subclass is created (through `super(...)` or the C++ base initialiser), to initialise the fields the abstract class declares.
</details>

<details>
<summary>Can a Java interface have instance fields?</summary>

No. Any field declared in an interface is implicitly `public static final`: a shared constant, not per-object state.
</details>

<details>
<summary>Comparable is an interface rather than an abstract class. Why?</summary>

Being comparable is a capability shared by unrelated types (strings, dates, numbers, your own classes). Those classes already have their own superclasses, and a class can implement many interfaces but extend only one class.
</details>
