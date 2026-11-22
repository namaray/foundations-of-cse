---
title: OOP Cheat Sheet
description: One-page revision of OOP concepts, constructors and destructors, encapsulation, inheritance, polymorphism, abstraction, exceptions, generics, SOLID, design patterns and C++ vs Java.
sidebar:
  label: "11. Cheat sheet"
  order: 20
  badge:
    text: Revision
    variant: note
lesson:
  module: Revision
---

Use this page for last-minute revision. Each heading links back to the full lesson.

## [Concepts](/object-oriented-programming/oop-concepts/)

- Class = blueprint; object = instance with state, behaviour and identity.
- Encapsulation hides **data**; abstraction hides **complexity**; inheritance reuses (is-a); polymorphism = one interface, many forms.
- UML: `+` public, `-` private, `#` protected. Hollow diamond = aggregation; filled diamond = composition; hollow triangle = inheritance.

## [Classes](/object-oriented-programming/classes-objects/) and [encapsulation](/object-oriented-programming/encapsulation/)

- Constructors: same name, no return type; default, parameterised, copy. Writing any constructor removes the implicit default one.
- Shallow copy shares heap memory; deep copy duplicates it. Rule of three: destructor + copy constructor + copy assignment.
- Destructors run in reverse order of construction (RAII). Java has GC and no destructors.
- `static` members are shared by the class; static methods have no `this`.
- Private fields + validating methods protect invariants; immutable = final fields, no setters, defensive copies.

## [Inheritance](/object-oriented-programming/inheritance/) and [polymorphism](/object-oriented-programming/polymorphism/)

- Java: single class inheritance, many interfaces. C++: multiple inheritance; diamond solved with `virtual` inheritance.
- Construction base → derived; destruction derived → base.
- Overloading: same name, different parameters, compile time. Overriding: same signature in a subclass, run time.
- C++ needs `virtual` for dynamic dispatch; Java methods are virtual by default. Polymorphic bases need virtual destructors.
- Can't overload `::`, `.`, `.*`, `?:`, `sizeof`. Return type alone can't distinguish overloads.

## [Abstraction](/object-oriented-programming/abstraction/)

- C++ abstract class: at least one pure virtual function (`= 0`).
- Java abstract class: state, constructors, concrete methods, extend one. Interface: capabilities, default/static methods, implement many.

## [Exceptions](/object-oriented-programming/exception-handling/) and [generics](/object-oriented-programming/templates-generics/)

- Catch specific before general; `finally` always runs. C++ unwinds the stack and runs destructors.
- Java checked exceptions (not `RuntimeException`) must be caught or declared with `throws`.
- C++ templates: code per type, work with primitives. Java generics: type erasure, wrappers only, not covariant. PECS: producer `extends`, consumer `super`.

## [Design](/object-oriented-programming/design-principles/) and [C++ vs Java](/object-oriented-programming/cpp-vs-java/)

- High cohesion, low coupling. SOLID: single responsibility, open/closed, Liskov, interface segregation, dependency inversion.
- Singleton (private constructor), Factory, Observer (notify subscribers), Strategy (swappable algorithm), Adapter, Decorator.
- C++ native code, manual memory, pointers; Java bytecode on the JVM, GC, references, always pass-by-value.

## Top viva questions

1. What are the four pillars of OOP? Give an example of each.
2. Encapsulation vs abstraction.
3. Class vs object; aggregation vs composition.
4. Types of constructors; when is the copy constructor called? Shallow vs deep copy.
5. What does `static` mean for a member?
6. Types of inheritance; why doesn't Java support multiple inheritance of classes?
7. What is the diamond problem?
8. Overloading vs overriding.
9. How do virtual functions work? Why do we need a virtual destructor?
10. Abstract class vs interface.
11. Checked vs unchecked exceptions; `throw` vs `throws`; what does `finally` do?
12. State the SOLID principles; explain one design pattern.
