---
title: Inheritance
description: Base and derived classes, types of inheritance, access modes in C++, constructor and destructor order, method overriding and super, the diamond problem and virtual inheritance, and composition vs inheritance.
sidebar:
  label: "4. Inheritance"
  order: 4
lesson:
  module: Core ideas
  prerequisites:
    - label: Encapsulation
      link: /object-oriented-programming/encapsulation/
  outcomes:
    - Write derived classes in C++ and Java and call base-class constructors
    - Name the types of inheritance and say which each language supports
    - Predict constructor and destructor call order
    - Explain the diamond problem and how C++ and Java avoid it
  keyIdea: >-
    Inheritance creates a **derived** (child) class from a **base** (parent) class, inheriting its members and adding or overriding behaviour. It models an **is-a** relationship. Base parts are constructed first and destroyed last. Multiple inheritance can cause the **diamond problem**, which C++ solves with virtual inheritance and Java avoids by allowing only single class inheritance.
---

## 1. Basics

```cpp
// C++
class Animal {
protected:
    string name;
public:
    Animal(string n) : name(n) {}
    void eat() { cout << name << " eats\n"; }
};

class Dog : public Animal {                 // Dog is-an Animal
public:
    Dog(string n) : Animal(n) {}            // call the base constructor
    void bark() { cout << name << " barks\n"; }
};

Dog d("Rex");
d.eat();     // inherited: "Rex eats"
d.bark();    // its own:   "Rex barks"
```

```java
// Java
class Animal {
    protected String name;
    Animal(String name) { this.name = name; }
    void eat() { System.out.println(name + " eats"); }
}

class Dog extends Animal {
    Dog(String name) { super(name); }       // must be the first statement
    void bark() { System.out.println(name + " barks"); }
}
```

What is **not** inherited: constructors, destructors, and (in C++) friends and the assignment operator. Private members are inherited in the sense that they exist inside the derived object, but the derived class's code cannot access them directly.

**Use inheritance only for a true "is-a" relationship.** A `Dog` is an `Animal`. A `Car` is **not** an `Engine`; it **has** an engine (use composition).

## 2. Types of inheritance

| Type | Shape | C++ | Java (classes) |
|---|---|---|---|
| **Single** | B extends A | ✓ | ✓ |
| **Multilevel** | C extends B, B extends A | ✓ | ✓ |
| **Hierarchical** | B and C both extend A | ✓ | ✓ |
| **Multiple** | C extends both A and B | ✓ | ✗ (but a class can **implement** many interfaces) |
| **Hybrid** | A combination, e.g. multiple + hierarchical (the diamond) | ✓ | ✗ with classes |

## 3. Access modes in C++

The access mode in `class D : public B` limits how inherited members appear in `D`:

| Base member | `public` inheritance | `protected` inheritance | `private` inheritance |
|---|---|---|---|
| public | public | protected | private |
| protected | protected | protected | private |
| private | not accessible | not accessible | not accessible |

**Public** inheritance is the normal one and the only one that models "is-a". Private inheritance means "implemented in terms of" and is rarely used. (Java has only one kind, equivalent to public.)

## 4. Constructor and destructor order

- **Constructors:** base first, then members, then the derived class's body.
- **Destructors:** the reverse: derived first, then base.

```cpp
class A { public: A() { cout << "A "; }  ~A() { cout << "~A "; } };
class B : public A { public: B() { cout << "B "; }  ~B() { cout << "~B "; } };
class C : public B { public: C() { cout << "C "; }  ~C() { cout << "~C "; } };

int main() { C obj; }
// prints: A B C ~C ~B ~A
```

If the base class has no default constructor, the derived constructor **must** call a base constructor explicitly (`: Animal(n)` in C++, `super(n)` in Java).

## 5. Method overriding

A derived class can **override** a base method by providing its own version with the **same signature**.

```java
class Animal { void sound() { System.out.println("..."); } }
class Cat extends Animal {
    @Override
    void sound() { System.out.println("Meow"); }   // replaces Animal's version
    void both() {
        super.sound();                             // call the parent's version
        sound();
    }
}
```

- In Java, `@Override` asks the compiler to check that you really are overriding.
- In C++, the base method must be **`virtual`** for overriding to work through base pointers (see [Polymorphism](/object-oriented-programming/polymorphism/)); C++11's `override` keyword checks it.
- `final` (Java and C++11) stops a method being overridden, or a class being extended.

| | Overloading | Overriding |
|---|---|---|
| Where | Same class (or scope) | Base and derived classes |
| Signature | **Different** parameters | **Same** signature |
| Resolved | At compile time | At run time (virtual / dynamic dispatch) |
| Purpose | Same operation on different argument types | Specialise inherited behaviour |

## 6. The diamond problem

```text
        A
      /   \
     B     C
      \   /
        D
```

`B` and `C` both inherit from `A`, and `D` inherits from both. Without care, a `D` object contains **two** copies of `A`'s members, and a call to an `A` method from `D` is **ambiguous**.

**C++ solution: virtual inheritance.** Declaring `class B : virtual public A` and `class C : virtual public A` makes `D` share a **single** `A` sub-object. The most-derived class (`D`) is then responsible for constructing `A`.

**Java's approach:** no multiple inheritance of **classes**, so the problem cannot arise with state. A class may implement several **interfaces**; if two interfaces provide default methods with the same signature, the class must override the method and choose (for example, `B.super.greet()`).

## 7. Composition vs inheritance

"**Favour composition over inheritance**" (a classic design guideline): build classes by **containing** objects of other classes rather than inheriting from them.

| | Inheritance (is-a) | Composition (has-a) |
|---|---|---|
| Coupling | Tight: the subclass depends on the parent's internals | Loose: depends only on the part's public interface |
| Changes at run time | Fixed at compile time | Parts can be swapped |
| Risk | Fragile base class: parent changes break children | Fewer surprises |
| Use when | A genuine is-a relationship, and you need polymorphism | Reusing behaviour, or the relationship is has-a |

```java
class Car {
    private final Engine engine;      // a Car has an Engine
    Car(Engine e) { engine = e; }
    void start() { engine.ignite(); }  // delegate to the part
}
```

## Summary

- A derived class inherits its base's members and can add or override them; use it only for is-a relationships.
- Java supports single, multilevel and hierarchical class inheritance; multiple inheritance only through interfaces. C++ supports all kinds.
- C++ public inheritance keeps public and protected members as they are; private base members are never accessible.
- Constructors run base to derived; destructors run derived to base.
- Overriding = same signature in a subclass, resolved at run time; overloading = different parameters, resolved at compile time.
- The diamond problem is solved by virtual inheritance in C++ and avoided in Java; prefer composition when the relationship is has-a.

## Check yourself

<details>
<summary>Why doesn't Java support multiple inheritance of classes?</summary>

To avoid the diamond problem and its ambiguities (two copies of shared state, conflicting method implementations). Java gets most of the benefit through implementing multiple interfaces.
</details>

<details>
<summary>class A { A() { print("A"); } } class B extends A { B() { print("B"); } } — what does new B() print?</summary>

`AB`. The base-class constructor always runs first (Java inserts an implicit `super()` call).
</details>

<details>
<summary>Is a Square a good subclass of Rectangle?</summary>

Usually not. A rectangle's width and height can be set independently, but a square's cannot, so code that works with rectangles can break when given a square. This violates the Liskov substitution principle; composition or a common `Shape` base works better.
</details>
