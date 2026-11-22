---
title: Polymorphism
description: Compile-time polymorphism (function and operator overloading) and run-time polymorphism (virtual functions, dynamic binding, vtables), upcasting and downcasting, virtual destructors, and how Java handles dynamic dispatch.
sidebar:
  label: "5. Polymorphism"
  order: 5
lesson:
  module: Core ideas
  prerequisites:
    - label: Inheritance
      link: /object-oriented-programming/inheritance/
  outcomes:
    - Distinguish compile-time and run-time polymorphism with examples
    - Overload functions and operators in C++
    - Explain how virtual functions and vtables give dynamic binding
    - Explain why base classes need virtual destructors
  keyIdea: >-
    Polymorphism lets one interface work with many types. **Compile-time** polymorphism (overloading) picks a function from the argument types. **Run-time** polymorphism (overriding virtual functions) picks the method from the object's **actual** type, even through a base-class pointer or reference, so new types can be added without changing existing code.
---

## 1. Two kinds

| | Compile-time (static) | Run-time (dynamic) |
|---|---|---|
| Mechanism | Function overloading, operator overloading, templates | Overriding **virtual** functions |
| Decided | By the compiler, from the declared types | At run time, from the object's actual type |
| Also called | Early binding | Late binding, dynamic dispatch |
| Speed | No overhead | A small indirection (vtable lookup) |

## 2. Function overloading

Several functions with the **same name** but **different parameter lists** (number, types or order):

```cpp
int    area(int side)               { return side * side; }
double area(double r)               { return 3.14159 * r * r; }
int    area(int length, int width)  { return length * width; }

area(4);        // square: 16
area(2.0);      // circle: 12.566
area(3, 5);     // rectangle: 15
```

The **return type alone cannot distinguish** overloads: `int f(int)` and `double f(int)` conflict. Default arguments can also create ambiguous calls.

## 3. Operator overloading (C++)

Give operators meaning for your own types:

```cpp
class Complex {
    double re, im;
public:
    Complex(double r = 0, double i = 0) : re(r), im(i) {}

    Complex operator+(const Complex &o) const {          // member operator
        return Complex(re + o.re, im + o.im);
    }

    friend ostream &operator<<(ostream &out, const Complex &c) {   // friend for output
        return out << c.re << " + " << c.im << "i";
    }
};

Complex a(1, 2), b(3, 4);
cout << a + b;        // 4 + 6i
```

- Operators that **cannot** be overloaded: `::`, `.`, `.*`, `?:` and `sizeof`.
- You cannot invent new operators or change precedence or the number of operands.
- `<<` and `>>` for streams are written as non-member (often friend) functions, because the left operand is the stream, not your object.

Java does **not** allow user-defined operator overloading (only the built-in `+` for strings).

## 4. Run-time polymorphism

A **base-class pointer or reference** can refer to a **derived-class object** (**upcasting**, always safe). Calling a **virtual** function through it runs the **derived** class's version.

```cpp
class Shape {
public:
    virtual double area() const { return 0; }    // virtual: decided at run time
    virtual ~Shape() {}                          // virtual destructor (see below)
};

class Circle : public Shape {
    double r;
public:
    Circle(double r) : r(r) {}
    double area() const override { return 3.14159 * r * r; }
};

class Square : public Shape {
    double s;
public:
    Square(double s) : s(s) {}
    double area() const override { return s * s; }
};

Shape *shapes[] = { new Circle(1), new Square(2) };
for (Shape *s : shapes)
    cout << s->area() << "\n";      // 3.14159, then 4: each object's own version
```

**Without `virtual`**, `s->area()` would call `Shape::area()` for both, because the compiler would choose by the **pointer's** type (static binding).

Polymorphism through **objects held by value** does not work: assigning a `Circle` to a `Shape` variable **slices** off the Circle part, leaving a plain `Shape`. Use pointers or references.

### How it works: vtables

Each class with virtual functions has a **virtual table (vtable)**: an array of pointers to that class's versions of the virtual functions. Each object carries a hidden **vptr** pointing to its class's vtable. A virtual call follows the object's vptr to the vtable and jumps to the right function. Cost: one extra pointer per object and one indirection per call.

## 5. Virtual destructors

```cpp
Shape *s = new Circle(1);
delete s;
```

If `Shape`'s destructor is **not virtual**, `delete s` calls only `~Shape()`, so `Circle`'s destructor never runs and any resources it owns leak (formally, the behaviour is undefined). **Rule:** any class meant to be used polymorphically must have a **virtual destructor**.

## 6. Downcasting

Converting a base pointer or reference back to a derived type is **not** always safe: the object might not be of that type.

```cpp
Shape *s = getShape();
if (Circle *c = dynamic_cast<Circle *>(s)) {     // checked at run time
    // s really points to a Circle
}                                                 // otherwise c is nullptr
```

```java
if (shape instanceof Circle c) {                 // Java 16+ pattern matching
    System.out.println(c.radius());
}
```

Frequent downcasting is a design smell: a virtual method usually does the job better.

## 7. Polymorphism in Java

In Java, **every non-static, non-private, non-final method is virtual** automatically: no keyword is needed.

```java
Animal a = new Dog("Rex");
a.sound();       // calls Dog's sound(): dynamic dispatch
```

- Static methods are **hidden**, not overridden: the call is chosen by the declared type.
- Fields are not polymorphic: `a.name` uses the declared type's field.
- Overloading is chosen at compile time from the **declared** argument types, even if the object is more specific at run time.

## Summary

- Compile-time polymorphism: overloading (different parameter lists; return type alone isn't enough) and operator overloading.
- Run-time polymorphism: virtual functions called through base pointers or references run the object's own version.
- Without `virtual`, C++ binds by the pointer's declared type; passing objects by value slices them.
- Vtables and a hidden vptr per object implement dynamic dispatch.
- Polymorphic base classes need virtual destructors; downcast with `dynamic_cast` or `instanceof`.
- Java methods are virtual by default (except static, private and final ones).

## Check yourself

<details>
<summary>Which C++ operators cannot be overloaded?</summary>

The scope resolution `::`, member access `.`, pointer-to-member `.*`, the conditional `?:`, and `sizeof`.
</details>

<details>
<summary>Base *p = new Derived(); p->show(); — which show() runs if show() is not virtual?</summary>

`Base::show()`. Without `virtual`, the call is bound at compile time using the pointer's type.
</details>

<details>
<summary>Why should a base class with virtual functions have a virtual destructor?</summary>

So that deleting a derived object through a base pointer runs the derived destructor too. Otherwise only the base destructor runs, leaking the derived part's resources.
</details>
