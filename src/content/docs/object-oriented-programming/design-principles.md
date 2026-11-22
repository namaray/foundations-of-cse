---
title: Design Principles and Patterns
description: Coupling and cohesion, the SOLID principles with examples, and an introduction to design patterns - Singleton, Factory, Observer, Strategy, Adapter and Decorator.
sidebar:
  label: "9. SOLID and design patterns"
  order: 9
lesson:
  module: Design
  prerequisites:
    - label: Abstract classes and interfaces
      link: /object-oriented-programming/abstraction/
  outcomes:
    - Explain coupling and cohesion and why designs aim for low coupling and high cohesion
    - State each SOLID principle with an example of a violation and a fix
    - Recognise and explain common design patterns
  keyIdea: >-
    Good object-oriented design keeps classes **focused** (high cohesion) and **independent** (low coupling). The **SOLID** principles turn this into five rules, and **design patterns** are proven, named solutions to problems that keep recurring.
---

## 1. Coupling and cohesion

- **Cohesion:** how closely the responsibilities within one class belong together. **High** cohesion is good: a class does one well-defined job.
- **Coupling:** how much one class depends on the internals of others. **Low** coupling is good: changing one class rarely forces changes in others.

Aim for **high cohesion and low coupling**. Depending on interfaces rather than concrete classes is the main tool for reducing coupling.

## 2. The SOLID principles

### S: Single responsibility principle

*A class should have only one reason to change.*

A `Report` class that calculates figures, formats them as HTML **and** saves them to disk has three reasons to change. Split it into `ReportCalculator`, `ReportFormatter` and `ReportRepository`.

### O: Open/closed principle

*Classes should be open for extension but closed for modification.*

```java
// Violation: every new shape means editing this method
double area(Object s) {
    if (s instanceof Circle c) return Math.PI * c.r * c.r;
    if (s instanceof Square q) return q.side * q.side;
    // add a branch for every new shape...
}

// Following OCP: new shapes add a class; existing code is untouched
interface Shape { double area(); }
class Circle implements Shape { public double area() { return Math.PI * r * r; } }
```

Polymorphism is the usual way to achieve it.

### L: Liskov substitution principle

*Objects of a subclass must be usable wherever the base class is expected, without breaking correctness.*

The classic violation: `Square extends Rectangle`. Code that sets a rectangle's width to 5 and height to 4 expects an area of 20; a square that forces both sides to be equal gives 16. A subclass must not strengthen preconditions, weaken guarantees or throw unexpected exceptions.

### I: Interface segregation principle

*Clients should not be forced to depend on methods they don't use.*

A single `Worker` interface with `work()` and `eat()` forces a `Robot` class to implement `eat()`. Split it into `Workable` and `Eatable`, and let each class implement only what applies.

### D: Dependency inversion principle

*High-level modules should not depend on low-level modules; both should depend on abstractions.*

```java
// Violation: OrderService is welded to MySQL
class OrderService { private MySqlDatabase db = new MySqlDatabase(); }

// Following DIP: depend on an interface and receive the implementation
interface Database { void save(Order o); }
class OrderService {
    private final Database db;
    OrderService(Database db) { this.db = db; }    // dependency injection
}
```

Now `OrderService` works with any database, including a fake one in unit tests.

| Principle | One-line summary |
|---|---|
| **S**ingle responsibility | One reason to change |
| **O**pen/closed | Extend without modifying |
| **L**iskov substitution | Subtypes must be substitutable for their base types |
| **I**nterface segregation | Many small interfaces beat one large one |
| **D**ependency inversion | Depend on abstractions, not concrete classes |

## 3. Design patterns

A **design pattern** is a reusable, named solution to a common design problem. The "Gang of Four" catalogued 23, in three groups:

- **Creational:** how objects are created (Singleton, Factory Method, Abstract Factory, Builder, Prototype).
- **Structural:** how classes and objects are composed (Adapter, Decorator, Facade, Composite, Proxy).
- **Behavioural:** how objects interact and share responsibility (Observer, Strategy, Command, Iterator, State, Template Method).

### Singleton (creational)

Ensures a class has **only one instance**, with a global access point: for example, a configuration manager or logger.

```java
public class Config {
    private static final Config INSTANCE = new Config();
    private Config() {}                       // private constructor: no outside "new"
    public static Config getInstance() { return INSTANCE; }
}
```

Use sparingly: singletons are global state, which makes testing harder.

### Factory Method (creational)

Lets code create objects through a method instead of naming the concrete class, so the exact type can vary.

```java
interface Notification { void send(String msg); }
class EmailNotification implements Notification { public void send(String m) { /* ... */ } }
class SmsNotification   implements Notification { public void send(String m) { /* ... */ } }

class NotificationFactory {
    static Notification create(String type) {
        return switch (type) {
            case "email" -> new EmailNotification();
            case "sms"   -> new SmsNotification();
            default      -> throw new IllegalArgumentException(type);
        };
    }
}
```

### Observer (behavioural)

When one object (the **subject**) changes, all its registered **observers** are notified automatically. Used for event listeners, GUI updates, and publish/subscribe systems.

```java
interface Observer { void update(int temperature); }

class WeatherStation {
    private final List<Observer> observers = new ArrayList<>();
    void subscribe(Observer o) { observers.add(o); }
    void setTemperature(int t) {
        for (Observer o : observers) o.update(t);   // notify everyone
    }
}
```

### Strategy (behavioural)

Defines a family of interchangeable algorithms behind one interface, so the algorithm can be chosen at run time.

```java
interface PaymentStrategy { void pay(double amount); }
class CardPayment   implements PaymentStrategy { public void pay(double a) { /* ... */ } }
class BkashPayment  implements PaymentStrategy { public void pay(double a) { /* ... */ } }

class Checkout {
    private PaymentStrategy strategy;
    void setStrategy(PaymentStrategy s) { strategy = s; }
    void complete(double amount) { strategy.pay(amount); }
}
```

Strategy replaces long `if`/`switch` chains with polymorphism, following the open/closed principle.

### Adapter and Decorator (structural)

- **Adapter** converts one interface into another that clients expect, like a plug adapter: wrapping an old library class so it fits a new interface.
- **Decorator** adds behaviour to an object dynamically by wrapping it in another object with the same interface. Java I/O does this: `new BufferedReader(new FileReader("f.txt"))` adds buffering to a reader.

## Summary

- Aim for high cohesion and low coupling; depend on interfaces.
- SOLID: single responsibility, open/closed, Liskov substitution, interface segregation, dependency inversion.
- Patterns come in creational, structural and behavioural families.
- Singleton (one instance), Factory (create without naming the class), Observer (notify subscribers), Strategy (swap algorithms), Adapter (convert interfaces), Decorator (wrap to add behaviour).

## Check yourself

<details>
<summary>Which SOLID principle does a long if-else chain over object types usually violate?</summary>

The open/closed principle: adding a new type means modifying the chain. Replacing it with polymorphism lets new types be added as new classes.
</details>

<details>
<summary>How does the Singleton pattern stop other code creating instances?</summary>

Its constructor is private, so only the class itself can call it. Other code obtains the single instance through a static method such as `getInstance()`.
</details>

<details>
<summary>Which pattern does Java's BufferedReader(new FileReader(...)) illustrate?</summary>

Decorator: `BufferedReader` wraps another `Reader` and adds buffering while presenting the same `Reader` interface.
</details>
