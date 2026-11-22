---
title: Encapsulation and Information Hiding
description: Bundling data with behaviour, private fields with getters and setters, validating invariants, immutable classes, friend functions in C++, and packages in Java.
sidebar:
  label: "3. Encapsulation"
  order: 3
lesson:
  module: Core ideas
  prerequisites:
    - label: Classes and constructors
      link: /object-oriented-programming/classes-objects/
  outcomes:
    - Explain why fields should be private
    - Write getters and setters that protect a class's invariants
    - Design an immutable class
    - Explain what C++ friend functions are and when they break encapsulation
  keyIdea: >-
    Encapsulation keeps an object's data **private** and lets the outside world change it only through methods that enforce the rules, so the object can never be put in an invalid state. It also lets the internal representation change without breaking any code that uses the class.
---

## 1. Why hide data?

Compare a class with public fields:

```java
class Account {
    public double balance;
}

acct.balance = -1000;      // nothing stops an invalid state
```

with an encapsulated one:

```java
class Account {
    private double balance;

    public void deposit(double amount) {
        if (amount <= 0) throw new IllegalArgumentException("Deposit must be positive");
        balance += amount;
    }

    public void withdraw(double amount) {
        if (amount > balance) throw new IllegalStateException("Insufficient funds");
        balance -= amount;
    }

    public double getBalance() { return balance; }
}
```

Now every change goes through code that checks the rules. Benefits:

- **Validity:** the class guarantees its **invariants** (rules that must always hold, such as "balance is never negative").
- **Flexibility:** the internal representation can change (store balance in paisa as a `long`, say) without changing any code outside the class.
- **Easier debugging:** if the balance is wrong, only the class's own methods could have changed it.
- **Controlled access:** read-only or write-only properties are possible.

## 2. Getters and setters

```java
class Student {
    private String name;
    private double cgpa;

    public String getName() { return name; }

    public double getCgpa() { return cgpa; }
    public void setCgpa(double cgpa) {
        if (cgpa < 0 || cgpa > 4) throw new IllegalArgumentException("CGPA must be 0-4");
        this.cgpa = cgpa;
    }
}
```

- A getter with no setter makes a **read-only** property.
- Setters are where validation belongs.

:::caution[Getters and setters for everything is not encapsulation]
A class whose every field has a plain public getter and setter is barely better than public fields. Prefer methods that express **behaviour** (`withdraw`, `enrol`) over methods that expose raw data.
:::

**Don't leak mutable internals.** Returning a reference to an internal list lets callers change it behind the class's back. Return a copy or an unmodifiable view instead:

```java
public List<String> getCourses() {
    return Collections.unmodifiableList(courses);
}
```

## 3. Immutable classes

An **immutable** object cannot change after it is constructed. Java's `String` and the wrapper classes such as `Integer` are immutable.

How to make one (in Java):

1. Make all fields `private final`.
2. Provide no setters.
3. Make the class `final` (so no subclass can add mutable behaviour).
4. Copy mutable objects passed into the constructor, and return copies from getters.

```java
public final class Money {
    private final long amount;
    private final String currency;

    public Money(long amount, String currency) {
        this.amount = amount;
        this.currency = currency;
    }

    public Money add(Money other) {            // returns a new object instead of changing this one
        return new Money(amount + other.amount, currency);
    }
}
```

Immutable objects are simple to reason about and **thread-safe** without locks.

## 4. Friend functions and classes (C++)

A **friend** function or class is allowed to access another class's private members:

```cpp
class Box {
    double width;
public:
    Box(double w) : width(w) {}
    friend void printWidth(const Box &b);     // grant access
};

void printWidth(const Box &b) {
    cout << b.width;                           // allowed: it's a friend
}
```

Friendship is **granted** by the class (it cannot be taken), is **not inherited**, and is **not transitive**. It is useful for operators that need access to two classes' internals, such as `operator<<` for output, but overusing it weakens encapsulation.

Java has no friends; its closest equivalent is **package-private** access (no modifier), which lets classes in the same package see each other's members.

## 5. Encapsulation at larger scales

The same idea applies above the class level:

- **Packages** (Java) and **namespaces** (C++) group related classes and hide helper classes.
- **Modules** (Java 9+) control which packages other modules can see.
- **Interfaces** expose a contract while the implementing classes stay hidden.

## Summary

- Keep fields private; let methods enforce invariants such as "balance never negative".
- Setters validate; getters can make read-only properties; don't return references to mutable internals.
- Prefer behaviour methods over blanket getters and setters.
- Immutable classes (final fields, no setters, defensive copies) are simple and thread-safe.
- C++ friends can access private members; use them sparingly.

## Check yourself

<details>
<summary>What is a class invariant? Give an example.</summary>

A condition that must be true for every object of the class whenever no method is running. For example, "an account's balance is never negative", or "a date's month is between 1 and 12".
</details>

<details>
<summary>Why is Java's String class immutable?</summary>

Strings are shared widely (as map keys, in the string pool, across threads). Immutability makes this safe: no one can change a string that someone else is using, it can be cached, and it needs no synchronisation.
</details>

<details>
<summary>Does friendship in C++ break encapsulation?</summary>

Partly: a friend can access private members. But the class itself grants it explicitly, so the class still controls exactly who has access. Overusing friends defeats the purpose.
</details>
