---
title: Classes, Constructors and Destructors
description: Defining classes in C++ and Java, access specifiers, creating objects on the stack and heap, default, parameterised and copy constructors, constructor overloading and initialiser lists, destructors and object lifetime, this, static members, and const member functions.
sidebar:
  label: "2. Classes and constructors"
  order: 2
lesson:
  module: Core ideas
  prerequisites:
    - label: OOP concepts
      link: /object-oriented-programming/oop-concepts/
  outcomes:
    - Write classes with constructors in C++ and Java
    - Explain when each kind of constructor and the destructor runs
    - Explain the difference between shallow and deep copies
    - Use this, static members and const member functions
  keyIdea: >-
    A **constructor** initialises an object when it is created; a **destructor** (C++) cleans up when it is destroyed. The **copy constructor** controls how objects are copied, which matters as soon as a class owns memory. **Static** members belong to the class as a whole, not to any one object.
---

## 1. Defining a class

```cpp
// C++
class Rectangle {
private:                        // only member functions can access these
    double width, height;

public:                         // accessible from anywhere
    Rectangle(double w, double h) : width(w), height(h) {}   // constructor
    double area() const { return width * height; }
};

int main() {
    Rectangle r(3, 4);          // object on the stack
    cout << r.area();           // 12
    Rectangle *p = new Rectangle(2, 5);   // object on the heap
    cout << p->area();          // 10
    delete p;                   // must free heap objects in C++
}
```

```java
// Java
class Rectangle {
    private double width, height;

    Rectangle(double w, double h) { width = w; height = h; }
    double area() { return width * height; }
}

Rectangle r = new Rectangle(3, 4);   // objects always live on the heap
System.out.println(r.area());        // 12.0; no delete: the garbage collector frees it
```

### Access specifiers

| Specifier | C++ | Java |
|---|---|---|
| `public` | Accessible everywhere | Accessible everywhere |
| `private` | This class only (and friends) | This class only |
| `protected` | This class and derived classes | This class, subclasses and the same package |
| (none) | `class` members default to **private**; `struct` members to public | **Package-private**: same package only |

## 2. Constructors

A constructor has the **same name as the class**, **no return type**, and runs automatically when an object is created.

| Kind | Purpose | Example |
|---|---|---|
| **Default** | No arguments | `Rectangle() : width(1), height(1) {}` |
| **Parameterised** | Takes initial values | `Rectangle(double w, double h)` |
| **Copy** (C++) | Builds an object as a copy of another | `Rectangle(const Rectangle &other)` |

- If you write **no** constructor, the compiler supplies a default one. Once you write any constructor, it no longer does.
- Constructors can be **overloaded** (several with different parameter lists).
- In C++, prefer **initialiser lists** (`: width(w), height(h)`): they initialise members directly, and they are required for `const` members, references, and base classes without default constructors.
- In Java, one constructor can call another with `this(...)`.

### Copy constructors: shallow vs deep copy

The compiler-generated copy constructor copies each member as it is (a **shallow copy**). If a member is a pointer to heap memory, both objects end up pointing to the **same** memory, and both destructors will try to free it.

```cpp
class Buffer {
    int *data;
    int size;
public:
    Buffer(int n) : data(new int[n]), size(n) {}
    Buffer(const Buffer &o) : data(new int[o.size]), size(o.size) {   // deep copy
        for (int i = 0; i < size; i++) data[i] = o.data[i];
    }
    ~Buffer() { delete[] data; }
};
```

The copy constructor runs when an object is **initialised** from another (`Buffer b2 = b1;`), **passed by value**, or **returned by value**. Assignment between existing objects (`b2 = b1;`) uses the assignment operator instead.

**Rule of three:** a C++ class that needs a custom destructor almost certainly needs a custom copy constructor and copy assignment operator too (C++11 adds move operations: the rule of five).

## 3. Destructors and lifetime

A C++ **destructor** `~ClassName()` takes no arguments, has no return type, cannot be overloaded, and runs automatically when the object is destroyed:

- a local (stack) object: when it goes out of scope
- a heap object: when `delete` is called
- objects are destroyed in the **reverse order** of their construction

```cpp
{
    Rectangle a(1, 1);   // constructor of a
    Rectangle b(2, 2);   // constructor of b
}                        // destructor of b, then destructor of a
```

Tying resource clean-up to destructors is called **RAII** (resource acquisition is initialisation): files, locks and memory are released automatically.

Java has **no destructors**: the garbage collector reclaims objects that are no longer reachable, at an unpredictable time. Resources such as files are closed explicitly, ideally with `try-with-resources`.

## 4. The this pointer

Inside a member function, **`this`** refers to the object the function was called on. (In C++ it is a pointer, used as `this->x`; in Java a reference, `this.x`.)

```java
class Point {
    int x, y;
    Point(int x, int y) {
        this.x = x;          // field x = parameter x
        this.y = y;
    }
}
```

It also lets a method return the object itself, so calls can be chained: `obj.setX(1).setY(2)`.

## 5. Static members

A **static** member belongs to the **class**, not to individual objects: there is exactly **one** copy shared by all objects.

```java
class Student {
    static int count = 0;        // shared by all students
    String name;

    Student(String name) {
        this.name = name;
        count++;                 // every new student increments the same counter
    }

    static int getCount() { return count; }   // called on the class
}

new Student("A"); new Student("B");
System.out.println(Student.getCount());       // 2
```

**Static methods** have no `this`, so they cannot use instance fields or call instance methods directly. `main` is static because it runs before any object exists.

In C++, a static data member is declared inside the class and **defined once** outside it: `int Student::count = 0;`.

## 6. const member functions (C++)

A member function marked `const` promises not to change the object, and is the only kind that can be called on a `const` object:

```cpp
double area() const { return width * height; }   // can't modify width or height

const Rectangle r(2, 3);
r.area();      // allowed only because area() is const
```

## Summary

- Classes group private data with public methods; C++ class members default to private, Java's to package access.
- Constructors (default, parameterised, copy) initialise objects; writing any constructor removes the compiler's default one.
- Shallow copies share heap memory; classes owning resources need deep copy constructors (rule of three).
- C++ destructors run automatically, in reverse order of construction (RAII); Java relies on garbage collection.
- `this` refers to the current object; static members are shared by the whole class; `const` member functions don't modify the object.

## Check yourself

<details>
<summary>When is a copy constructor called?</summary>

When a new object is initialised from an existing one (`A b = a;` or `A b(a);`), when an object is passed by value, and when one is returned by value (unless the compiler elides the copy).
</details>

<details>
<summary>Can a static method access instance variables directly?</summary>

No. It is not called on any particular object, so there is no `this` and no instance fields to refer to. It can access them only through an object reference.
</details>

<details>
<summary>In what order are destructors called for three local objects a, b, c declared in that order?</summary>

c, then b, then a: the reverse of the order of construction.
</details>
