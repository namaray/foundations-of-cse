---
title: C++ vs Java
description: How C++ and Java differ in compilation and execution, memory management, pointers and references, inheritance, polymorphism, generics, operator overloading, and parameter passing.
sidebar:
  label: "10. C++ vs Java"
  order: 10
lesson:
  module: Design
  prerequisites:
    - label: Polymorphism
      link: /object-oriented-programming/polymorphism/
  outcomes:
    - Compare how C++ and Java programs are compiled and run
    - Contrast manual memory management with garbage collection
    - Explain why Java is called pass-by-value even for objects
  keyIdea: >-
    C++ compiles to native machine code and gives the programmer direct control (pointers, manual memory, multiple inheritance). Java compiles to **bytecode** for the JVM and trades some control for safety: no pointer arithmetic, garbage collection, single class inheritance and methods that are virtual by default.
---

## 1. Side by side

| Feature | C++ | Java |
|---|---|---|
| Compilation | To **native machine code** for one platform | To **bytecode**, run by the **JVM** (interpreted and JIT-compiled): "write once, run anywhere" |
| Memory management | **Manual** (`new`/`delete`), RAII, smart pointers | **Garbage collection** |
| Pointers | Yes, with arithmetic | No explicit pointers; **references** only |
| Objects can live | On the stack or the heap | Only on the heap (primitives and references on the stack) |
| Destructors | Yes, deterministic | No (`finalize` is deprecated); use try-with-resources |
| Multiple inheritance | Of classes, yes | Of classes, no; of interfaces, yes |
| Virtual methods | Only if declared `virtual` | All non-static, non-private, non-final methods |
| Operator overloading | Yes | No (except `+` on strings) |
| Generics | Templates (code generated per type) | Generics with type erasure |
| Global functions and variables | Allowed | Everything belongs to a class |
| Multithreading | Standard library since C++11 | Built into the language and library since 1.0 |
| Header files | Yes (`#include`) | No (`import` of packages) |
| Preprocessor | Yes | No |
| Array bounds checking | No | Yes (`ArrayIndexOutOfBoundsException`) |
| Typical uses | Systems, games, embedded, high-performance code | Enterprise back ends, Android, large applications |

## 2. Memory management

**C++:** you control object lifetimes. Local objects are destroyed automatically at the end of their scope; heap objects must be deleted. Modern C++ uses **smart pointers** so you rarely write `delete`:

```cpp
#include <memory>
auto p = std::make_unique<Rectangle>(3, 4);   // freed automatically when p goes out of scope
auto s = std::make_shared<Rectangle>(2, 2);   // reference-counted shared ownership
```

**Java:** objects are created with `new` and never explicitly freed. The **garbage collector** finds objects no longer reachable from any live reference and reclaims them. There are no dangling pointers or double frees, but GC pauses happen at unpredictable times, and memory can still "leak" if references are kept unnecessarily (for example, in a growing static list).

## 3. Pointers and references

- A C++ **pointer** holds an address, can be null, can be reassigned and can do arithmetic.
- A C++ **reference** (`int &r = x;`) is an alias that must be initialised, cannot be reseated, and is never null.
- A Java **reference** is like a C++ pointer without arithmetic: it can be null and reassigned, and `.` accesses the object.

## 4. Parameter passing

**C++** offers both: pass by value (`void f(Widget w)`, a copy), by reference (`void f(Widget &w)`), or by const reference (`void f(const Widget &w)`, no copy and no modification).

**Java is always pass-by-value.** For objects, the **value passed is the reference**, so:

```java
void change(StringBuilder sb) {
    sb.append(" world");      // modifies the caller's object: same object, reached through a copy of the reference
    sb = new StringBuilder("new");   // only reassigns the local copy; the caller doesn't see it
}

StringBuilder s = new StringBuilder("hello");
change(s);
System.out.println(s);        // hello world
```

That's why a Java method can change an object's contents but cannot make the caller's variable refer to a different object, and why a `swap(a, b)` method that reassigns its parameters doesn't work in Java.

## 5. A small program in both

```cpp
// C++
#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> nums = {3, 1, 2};
    int sum = 0;
    for (int n : nums) sum += n;
    cout << "Sum: " << sum << endl;
}
```

```java
// Java
import java.util.List;

public class Main {
    public static void main(String[] args) {
        List<Integer> nums = List.of(3, 1, 2);
        int sum = 0;
        for (int n : nums) sum += n;
        System.out.println("Sum: " + sum);
    }
}
```

## Summary

- C++ compiles to native code; Java compiles to bytecode for the JVM.
- C++ manages memory manually (or with RAII and smart pointers); Java uses garbage collection.
- C++ has pointers with arithmetic and references; Java has references only.
- C++ allows multiple inheritance and operator overloading; Java allows neither for classes, and makes methods virtual by default.
- Java passes everything by value, including copies of object references.

## Check yourself

<details>
<summary>Why is Java described as platform independent?</summary>

It compiles to bytecode, not machine code. Any platform with a Java Virtual Machine can run the same bytecode.
</details>

<details>
<summary>Can a Java method swap two Integer variables of its caller?</summary>

No. It receives copies of the references; reassigning them inside the method has no effect on the caller's variables (and `Integer` objects are immutable anyway).
</details>

<details>
<summary>What does a C++ unique_ptr do?</summary>

It owns a heap object exclusively and deletes it automatically when the `unique_ptr` goes out of scope, so the memory cannot leak. It can be moved but not copied.
</details>
