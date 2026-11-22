---
title: Templates and Generics
description: Generic programming, C++ function and class templates, template specialisation, Java generics with bounded types and wildcards, type erasure, and an overview of the C++ STL and Java Collections.
sidebar:
  label: "8. Templates and generics"
  order: 8
lesson:
  module: Language features
  prerequisites:
    - label: Polymorphism
      link: /object-oriented-programming/polymorphism/
  outcomes:
    - Write function and class templates in C++ and generic classes in Java
    - Explain bounded type parameters and wildcards
    - Compare C++ templates with Java generics
    - Choose an appropriate container from the STL or Java Collections
  keyIdea: >-
    Generic programming writes code once and uses it with many types. **C++ templates** generate a separate version of the code for each type used. **Java generics** check types at compile time, then **erase** them, so one version runs for all reference types. The standard containers (STL, Java Collections) are built this way.
---

## 1. Why generics?

Without generics you either write `maxInt`, `maxDouble`, `maxString` and so on, or store everything as a general type (`Object` in Java, `void *` in C) and cast, losing type safety. Generics give one piece of code that works for any suitable type, with the compiler still checking types.

## 2. C++ templates

**Function template:**

```cpp
template <typename T>
T maximum(T a, T b) {
    return (a > b) ? a : b;
}

maximum(3, 7);            // T deduced as int: 7
maximum(2.5, 1.5);        // T = double: 2.5
maximum<string>("ab", "cd");   // T = string: "cd"
```

**Class template:**

```cpp
template <typename T>
class Stack {
    vector<T> items;
public:
    void push(const T &x) { items.push_back(x); }
    T pop() { T top = items.back(); items.pop_back(); return top; }
    bool empty() const { return items.empty(); }
};

Stack<int> s;           // a stack of ints
s.push(10);
Stack<string> names;    // a separate stack of strings
```

- The compiler **instantiates** a separate version of the code for each type actually used (`Stack<int>`, `Stack<string>`). That makes templates fast (no casts, full optimisation), but can enlarge the program and slow compilation.
- Templates are usually defined entirely in **header files**, since the compiler needs the full definition to instantiate them.
- **Specialisation** provides a custom version for a particular type: `template <> class Stack<bool> { ... };`.
- Non-type parameters are allowed too: `template <typename T, int N> class Array { T data[N]; };`.

## 3. Java generics

```java
class Box<T> {
    private T value;
    void set(T v) { value = v; }
    T get() { return value; }
}

Box<String> b = new Box<>();     // diamond operator infers the type
b.set("hello");
String s = b.get();              // no cast needed
// b.set(42);                    // compile-time error
```

**Generic method:**

```java
static <T extends Comparable<T>> T max(T a, T b) {
    return a.compareTo(b) > 0 ? a : b;
}
```

**Bounded type parameters:** `<T extends Number>` accepts only `Number` and its subclasses, so the code can call `Number`'s methods on `T`.

**Wildcards:**

| Syntax | Means | Use |
|---|---|---|
| `List<?>` | a list of some unknown type | Read elements as `Object` |
| `List<? extends Number>` | a list of `Number` or a subtype | **Read** numbers from it (a producer) |
| `List<? super Integer>` | a list of `Integer` or a supertype | **Add** integers to it (a consumer) |

Memory aid: **PECS**, "producer extends, consumer super".

**Generics are not covariant:** a `List<Integer>` is **not** a `List<Number>`, even though `Integer` is a `Number`. Otherwise you could add a `Double` to a list of integers through the `List<Number>` reference.

**Primitives are not allowed** as type arguments: use the wrapper classes (`List<Integer>`, not `List<int>`); Java converts automatically (**autoboxing**).

### Type erasure

Java removes generic type information after compiling: `Box<String>` and `Box<Integer>` are both just `Box` at run time, with casts inserted by the compiler. Consequences:

- You cannot write `new T()`, `new T[10]`, or `instanceof Box<String>`.
- Only one copy of the code exists for all types.
- It kept compatibility with pre-generics Java code.

## 4. C++ templates vs Java generics

| | C++ templates | Java generics |
|---|---|---|
| Implementation | A separate copy per type (instantiation) | One copy; types erased |
| Primitive types | Yes (`vector<int>`) | No (wrappers only) |
| Type information at run time | Yes | No |
| Constraints on the type | Implicit (it must support the operations used), or C++20 **concepts** | Explicit bounds (`extends`) |
| Error messages | Can be long and confusing | Usually clear |
| Performance | No overhead | Casts and boxing overhead |

## 5. Standard containers

| Need | C++ STL | Java Collections |
|---|---|---|
| Resizable array | `vector` | `ArrayList` |
| Linked list | `list` | `LinkedList` |
| Stack | `stack` | `ArrayDeque` (or `Stack`) |
| Queue | `queue` | `ArrayDeque`, `LinkedList` |
| Priority queue (heap) | `priority_queue` | `PriorityQueue` |
| Sorted set / map (balanced tree) | `set`, `map` | `TreeSet`, `TreeMap` |
| Hash set / map | `unordered_set`, `unordered_map` | `HashSet`, `HashMap` |

The C++ STL has three parts: **containers**, **iterators** (a uniform way to step through any container) and **algorithms** (`sort`, `find`, `binary_search`, …) that work through iterators. The underlying data structures and their costs are covered in [Data Structures](/data-structures/cheat-sheet/).

## Summary

- Generics let one piece of code work for many types while keeping compile-time type checks.
- C++ templates generate code per type: fast, work with primitives, defined in headers.
- Java generics are checked at compile time and erased at run time; they need wrapper types and are not covariant.
- Bounded types (`extends`) and wildcards (`? extends` to read, `? super` to write) control what types are allowed.
- STL containers, iterators and algorithms, and the Java Collections Framework, are built on generics.

## Check yourself

<details>
<summary>Why can't you create a List&lt;int&gt; in Java?</summary>

Java generics work only with reference types, because of type erasure (everything becomes `Object` internally). Use `List<Integer>`; autoboxing converts between `int` and `Integer`.
</details>

<details>
<summary>Is List&lt;String&gt; a subtype of List&lt;Object&gt;?</summary>

No. Generics are invariant; otherwise you could add any object to a list meant to hold only strings. `List<? extends Object>` (or `List<?>`) accepts both.
</details>

<details>
<summary>Why are C++ templates usually written in header files?</summary>

The compiler needs the full template definition wherever the template is used, so it can generate code for the specific types used there.
</details>
