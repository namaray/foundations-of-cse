---
title: Exception Handling
description: Errors vs exceptions, try, catch, throw and finally, the exception hierarchy, checked and unchecked exceptions in Java, custom exceptions, stack unwinding, try-with-resources, and RAII in C++.
sidebar:
  label: "7. Exception handling"
  order: 7
lesson:
  module: Language features
  prerequisites:
    - label: Classes and constructors
      link: /object-oriented-programming/classes-objects/
  outcomes:
    - Use try, catch, throw and finally correctly
    - Distinguish checked and unchecked exceptions in Java
    - Write a custom exception class
    - Explain stack unwinding and how resources are released safely
  keyIdea: >-
    Exceptions separate **error handling** from normal code. A problem is signalled with **throw**, travels up the call stack (**unwinding** it) until a matching **catch** handles it, and **finally** or destructors make sure resources are released either way.
---

## 1. Why exceptions?

Returning error codes (like C's `-1`) is easy to ignore and mixes error checks into every line. Exceptions:

- separate normal logic from error handling,
- cannot be silently ignored (an unhandled exception stops the program),
- carry information about what went wrong,
- propagate automatically to a caller that knows how to handle them.

## 2. try, catch, throw, finally

```java
// Java
static int divide(int a, int b) {
    if (b == 0) throw new ArithmeticException("Division by zero");
    return a / b;
}

try {
    System.out.println(divide(10, 0));
    System.out.println("not reached");
} catch (ArithmeticException e) {
    System.out.println("Error: " + e.getMessage());
} finally {
    System.out.println("Always runs");
}
// Error: Division by zero
// Always runs
```

```cpp
// C++
double divide(double a, double b) {
    if (b == 0) throw std::invalid_argument("Division by zero");
    return a / b;
}

try {
    cout << divide(10, 0);
} catch (const std::invalid_argument &e) {
    cout << "Error: " << e.what();
} catch (...) {                      // catches anything
    cout << "Unknown error";
}
```

- **Order catch blocks from most specific to most general.** A general handler first would catch everything (Java reports it as an error).
- **finally** (Java) runs whether or not an exception happened, even after a `return`. Use it for clean-up. C++ has no `finally`; it uses destructors (RAII) instead.
- An exception that no handler catches terminates the program with a stack trace (Java) or calls `std::terminate` (C++).

## 3. Stack unwinding

When an exception is thrown, the runtime leaves the current function and each calling function in turn until it finds a matching handler. In C++, the **destructors of all local objects** in the abandoned functions run along the way. That is why RAII objects (such as `std::ifstream`, `std::unique_ptr` and lock guards) release their resources automatically even when an error occurs.

**Don't throw from destructors**: if one is called during unwinding and throws, C++ terminates the program.

## 4. Java's exception hierarchy

```text
Throwable
├── Error                   serious JVM problems: OutOfMemoryError, StackOverflowError
└── Exception
    ├── IOException, SQLException, ...      checked
    └── RuntimeException                     unchecked
        ├── NullPointerException
        ├── ArithmeticException
        ├── ArrayIndexOutOfBoundsException
        └── IllegalArgumentException, ...
```

| | Checked exceptions | Unchecked exceptions |
|---|---|---|
| Which | `Exception` and subclasses, except `RuntimeException` | `RuntimeException`, `Error` and their subclasses |
| Compiler rule | **Must** be caught or declared with `throws` | No requirement |
| Typically mean | Recoverable conditions outside the program's control (missing file, network down) | Programming bugs (null reference, bad index) |

```java
void readConfig() throws IOException {      // declares a checked exception
    Files.readString(Path.of("config.txt"));
}
```

`throw` raises an exception; `throws` (in a method signature) declares that a method may raise one.

C++ has no checked exceptions; `noexcept` marks functions that promise not to throw.

## 5. Custom exceptions

```java
class InsufficientFundsException extends Exception {     // checked
    private final double shortfall;

    InsufficientFundsException(double shortfall) {
        super("Short by " + shortfall);
        this.shortfall = shortfall;
    }
    double getShortfall() { return shortfall; }
}

void withdraw(double amount) throws InsufficientFundsException {
    if (amount > balance) throw new InsufficientFundsException(amount - balance);
    balance -= amount;
}
```

In C++, derive from `std::exception` (or `std::runtime_error`) and override `what()`.

## 6. Releasing resources safely

**Java try-with-resources** closes anything implementing `AutoCloseable`, even if an exception occurs:

```java
try (BufferedReader r = new BufferedReader(new FileReader("data.txt"))) {
    System.out.println(r.readLine());
}   // r.close() is called automatically
```

**C++ RAII:** the resource is owned by a local object whose destructor releases it.

```cpp
{
    std::ifstream file("data.txt");        // opened in the constructor
    std::string line;
    std::getline(file, line);
}                                           // closed in the destructor, even if an exception is thrown
```

## 7. Good practice

- Throw exceptions for **exceptional** situations, not for normal control flow.
- Catch an exception only where you can do something useful with it; otherwise let it propagate.
- Never swallow exceptions silently with an empty `catch`.
- In C++, throw by value and catch by (const) reference, which avoids slicing and copies.
- Include useful context in exception messages.

## Summary

- `throw` signals an error; it propagates up the stack until a matching `catch`; uncaught exceptions end the program.
- Order catch blocks from specific to general; `finally` (Java) always runs.
- Stack unwinding runs C++ destructors, which is how RAII guarantees clean-up.
- Java checked exceptions must be caught or declared with `throws`; unchecked ones (`RuntimeException`) need not be.
- Custom exceptions extend `Exception` (Java) or `std::exception` (C++); use try-with-resources or RAII for resources.

## Check yourself

<details>
<summary>Does finally run if the try block executes a return statement?</summary>

Yes. The `finally` block runs before the method actually returns. (Only something like `System.exit()` or the JVM crashing prevents it.)
</details>

<details>
<summary>Is NullPointerException checked or unchecked?</summary>

Unchecked: it extends `RuntimeException`, so the compiler does not require it to be caught or declared.
</details>

<details>
<summary>What is the difference between throw and throws in Java?</summary>

`throw` is a statement that raises an exception object. `throws` appears in a method signature to declare which checked exceptions the method may raise.
</details>
