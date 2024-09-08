---
title: 'Learn Rust'
---

# Rust

[[toc]]

## Variables
Variables are created using the `let`, or `const` keywords and values are statically typed, though types are usually inferred by the compiler for `let` variables. Primitive types include `bool`, `char`, and integer types such as `i8`,`i32`,`u8`, and `usize` (unsigned integer pointer size). Rust also supports tuples (`(1,2)`) and arrays (`[1,2,3]`). All variables have to be initialized before usage, or the build process will fail.

Though variable type is inferred by default when possible, variables can be coerced to a desired type using type annotation or casting.

``` rust
let x = 10u32; // suffix annotation
let y: u32 = 10; // regular annotation
let z = y as u8; // casting

const A: i32 = 5; // const requires annotation
```

### Mutability

To enforce a layer of safety, variables are by default *immutable*, or in other words, not capable of change. Adding the keyword `mut` before a variable assignment allows the targeted variable to be changed by future operations. This also helps imply a variable's purpose for readers.

### **Ownership**

Rust uses the concept of *Ownership* to avoid issues such as double resource freeing that occurs when a programming language with no *Garbage Collection* attempts to free a resource in memory that has already been freed. If ownership of a resource is transferred, the original owner can not access that data.

#### Stack and Heap

The *Stack* is a location in memory where variables are allocated based on a **Last In First Out** order. Any data that has a size that is fixed and known at compile time will be placed on the stack.

The *Heap* is a location in memory where memory is allocated dynamically, where data that has an unknown size or one that may change at runtime is stored. A variable with a pointer to this location in memory is stored on the stack. This memory should be freed after usage in typical low level programming languages, as newly allocating memory requires searching for an unallocated block of memory of the required size. This search process and associated book keeping makes allocating new Heap memory slower than Stack memory.

#### `Drop` and RAII

In C++, the [*Resource Allocation is Initialization*](https://en.wikipedia.org/wiki/Resource_acquisition_is_initialization) pattern is used to handle the freeing of memory resources after an object's lifetime, using `destructor` commands that execute cleanup. In Rust, types implement a function called `drop` which performs these cleanup actions after a variable is out of its scope.

#### `Move` and `Copy`

Because variables are in charge of freeing their own resources, ownership of resources is assigned when a variable is created. This is known as a `Move`.  

`Copy` is a trait implemented by default for primitive data types of which the size is known as compile time, such as `i32`. A new variable is created and the value is copies, similarly to [Deep Copying](https://en.wikipedia.org/wiki/Object_copying#Deep_copy). For data types such as `String` where the value isn't known at compile time, a reference is passed by variable assignment, such as in a [Shallow Copy](https://en.wikipedia.org/wiki/Object_copying#Shallow_copy). The new variable will point to the same memory location and will now *own* it, so the first variable can no longer be accessed.

``` rust
/* COPY */
let x = 10u32;
let y = x; // y has copied x to a new resource
println!("x is {x}, and y is {y}"); // ALL GOOD

/* MOVE */
let a = Box::new(10u32);
let b = a; // b is the new owner
println!("a is {a}, and b is {b}"); // NO DICE
```

The `Copy` trait can be implemented by the user for custom data types (see [Traits](#traits)).

#### Borrowing

When operating on a variable isn't required, and access to data is required instead of ownership, a resource can be borrowed by passing an object by reference instead of by value. The reference can be taken by passed using `&T` instead of `T` and ownership will be retained by the original owner.

References can be mutable as well, by assigning a variable as `&mut T`. By passing a parameter using this type, a function can operate on a reference without taking ownership. After the function exits, the data being referenced can still be used by other functions and will not be freed until its ownership scope is finished. The only caveat of mutable references is that a value cannot be mutably borrowed more than once. This restriction prevents multiple pointers to one resource creating a race condition, and avoids creating pointers which may become out of sync.

If a value is borrowed as a mutable reference, it cannot be borrowed afterwards as an immutable reference, and vice versa.

#### Slices

Slices are references to contiguous collections of value in memory, such as a range of characters in a `String`, or the `str` data type. 

``` rust
let s = String::from("hello");

let len = s.len();

let slice = &s[0..2]; // hel
let slice = &s[..2]; // hel
let slice = &s[2..len] // lo
let slice = &s[2..] // lo
let slice = &s[..] // hello
```

### Variable Binding

The `let` keyword is used to bind some value to a name. In Rust this binding can be done on single variables or patterns, such as `let (x,y) = (1,2);`, so `let` is said to perform variable binding, where in other programming languages it would simple assign value to a variable.

### Expression Blocks

Expression blocks are any code between curly braces. All variable bindings inside a block will be freed afterwards, as they go out of scope. The expressions in a block are evaluated sequentially, and the last expression can return a value if no semi-colon follows the expression. Otherwise, the value of `()` is returned.

``` rust
let y = {
    let x_squared = x * x;
    let x_cube = x_squared * x;

    // This expression will be assigned to `y`
    x_cube + x_squared + x
};
```

### Scope and Shadows

Variable names can be reused and values redefined by using the `let` keyword repeatedly. Each declaration creates a new variable in a new location with a coincidentally identical name, though the type can differ. By enclosing a shadowed variable within a block, it can be referred to using the shadowed name, and when the block terminates and that shadowed variable value is freed, the name will refer to the original resource.

``` rust
let a = 10;
{
    let a = 11;
    println!("a is {a}"). // a is 11
}
println!("a is {a}"). // a is 10
```

## Types

Rust is a *statically typed* language, so the type of each variable must be known at compile time. 

### Scalar Types

Rust scalar data types include integers, floating points, chars and boolean values.

#### Integers

| Length |	Signed	| Unsigned |
| -- | --| -- |
| 8-bit | 	`i8` |	`u8` |
|16-bit	|`i16`	|`u16`
|32-bit|	`i32`|	`u32`|
|64-bit|	`i64`|	`u64`|
|128-bit|	`i128`	|`u128`|
|arch	|`isize` |	`usize` |

|Number literals	|Example|
|--|--|
|Decimal	|`98_222`|
|Hex|	`0xff`|
|Octal|	`0o77`|
|Binary|	`0b1111_0000`|
|Byte (`u8` only)|	`b'A'`|

#### Floating Point

Rust supports single precision (`f32`) and double precision (`f64`), which are 32-bit and 64-bit floats respectively. Similarly to languages like *C*, dividing any int values will truncate the result to the nearest int value, while dividing decimal representations of the numbers will result in a float (`f64` by default on modern computers).

#### Boolean

`bool` types are `true` and `false`.

#### Characters

Rust characters are assigned using single quotes `'`, as opposed to double quote `"` used for string literals. Rust `char` values are four bytes in size, and are able to support foreign characters, as well as non-alphanumeric and emojis, by allowing Unicode Scalar values from `U+0000` to `U+D7FF` and `U+E000` to `U+10FFFF`.

``` rust
let c = 'z';
let z: char = 'ℤ'; // with explicit type annotation
let heart_eyed_cat = '😻';
```

### Annotations

In cases where a variable type is derived from a function such as `parse`, an annotation should be used to let the compiler know which value is expected.

`let guess: u32 = "42".parse().expect("Not a number!");`

The `String` value `"42"`is converted by `parse()`, which defines its output as the generic `<F>`.

Because `parse()` is so general, it is one of the few times the ‘turbofish’: `::<>` syntax is used to annotate. 

`let four = "4".parse::<u32>();`

### Compound Types

*Compound Types* in Rust are data types that can collect multiple variables into a single variable or reference. 

#### Tuples

A tuple is data type capable of storing more than one value in a variable, where each value can be accessed by its index. The tuple isn't capable of growing or shrinking once declared.

``` rust
let test: (&str, &str, &str) = ("Test1", "Test2", "Test3");
println!("{} {} {}", test.0, test.1, test.2);
```

Tuples in Rust are also capable of holding mixed data types, and can be destructured easily.

``` rust
let me = ("Bryan", "Melanson", 38,30);
let (first, last, waist, length) = me;
println!("My name is {} {} and my pants are sized {} W {} L", first, last, waist, length);
```

#### Arrays

Similarly to Tuples, Arrays are fixed length objects capable of storing multiple variables in a single variable, and references the values by index, but the data types of Array values must be the same. 

If an index value refernced exceeds the length of the array, Rust will protect from unsafe memory accesses by exiting.

``` rust
let arr = ["Test1", "Test2", "Test3"];
println!("{} {} {}", arr[0], arr[1], arr[2]);
```

### Custom Types

Rust allows the user to define custom data types in `enum` and `struct` objects. 

#### Structs

Structs in Rust follow convention similar to C structs, but allow for named tuple structs as well as fieldless unit structs, which are used for generics.

``` rust
struct Person {
    name: String,
    age: u8,
}
// Create struct with field init shorthand
let name = String::from("Peter");
let age = 27;
let peter = Person { name, age };

// A unit struct
struct Unit;
// Instantiate a unit struct
let _unit = Unit;

// A tuple struct
struct Pair(i32, f32);
// Instantiate a tuple struct
let pair = Pair(1, 0.1);
```

##### Destructuring

``` rust
let point: Point = Point { x: 10.3, y: 0.4 };

// Destructure the point using a `let` binding
let Point { x: left_edge, y: top_edge } = point;

println!("point: ({left_edge}, {top_edge})");
```

#### Enums

Similarly to C, Rust enums allow for the creation of a type that may be on a of series of defined values. 

``` rust
enum WebEvent {
    // unit-like
    PageLoad,
    PageUnload,
    // tuple structs
    KeyPress(char),
    Paste(String),
    // c-like structs
    Click { x: i64, y: i64 },
}

let pressed = WebEvent::KeyPress('x');
let pasted  = WebEvent::Paste("my text".to_owned());
let click   = WebEvent::Click { x: 20, y: 80 };
let load    = WebEvent::PageLoad;
let unload  = WebEvent::PageUnload;
```

#### Type Alias

The `type` keyword allows Rust to create pseudonym for another data type for clarity. This can be useful when deriving from generic data types.

``` rust
type Name = String;
let x: Name = "Hello".to_string();
```

Type aliases will also pass equality tests, such as `Name == String`. 

### Conversion

Primitive data types can be converted between each other through (Casting)[Casting], but for custom data types such as `String`, or other `struct`s and `enum`s a `From` and `Into` trait will need to be implemented to define the behavior when converting between types.

After defining the `From` behavior, `Into` functions can also be called for free as they exist as the reciprocal. `Into` calls require the type annotation to compile.

``` rust
#[derive(Debug)]
struct Number {
    value: i32,
}

impl From<i32> for Number {
    fn from(item: i32) -> Self {
        Number { value: item }
    }
}

fn main() {
    let num1 = Number::from(30);
    let int = 5;
    let num2: Number = int.into();
}
```

For cases where the `From` or `Into` calls might fail, a `TryFrom` and `TryInto` case can be defined which potentially returns an error.

## Functions

`fn` prefix
`(var1: type, var2: type)` or `()` parameters 
`-> type` result type

*Parameters* are the inputs the function is defined as taking, while the actual concrete values passed into the function are the *Arguments*. Annotated type is required for Rust functions.

``` rust
fn square(value: u8) -> u32 {
    value * value // expression
    // value * value; is **statement**
    // or 
    return value * value;
}
```

Rust functions can also be called while being defined in a later place in code.

### Methods

Methods are functions defined in the context of a *Struct*, *Enum* or *Trait*. Wrapped in an implementation block, the methods always take the `self` object as the first argument. They can then be called on objects of the implementation type using the `obj.method()` syntax.

``` rust
impl Rectangle {
    fn area(&self) -> u32 {
        return self.height * self.width;
    }
}

let rect1 = Rectangle {
        width: 30,
        height: 50,
    };
let square = rect1.area();
```

The method is dereferencing the borrowed `&self` reference in the parameters, but Rust doesn't use the `->` syntax from `C`. Instead, it can determine the context of the usage.

### Closures

Rust Closures are similar to functions, but don't require the parameters or results to be annotated, and can infer each from their usage.

``` rust
fn  add_one_v1   (x: u32) -> u32 { x + 1 }
let add_one_v2 = |x: u32| -> u32 { x + 1 };
let add_one_v3 = |x|             { x + 1 };
let add_one_v4 = |x|               x + 1;
let add_one_void = | |               1;
```

Closures can be assigned to variables and passed into and called by other functions.

## Workspaces

A workspace is a file structure in which multiple packages store a single `Cargo.toml` and `target` folder. This way, multiple packages that are developed in tandem can be managed in a single project. The root `Cargo.toml` file is annotated with `[workspace]` instead of `[package]`, and any package developed in the workspace is added under the `members` field.

``` rust 
[workspace]

members = [
    "adder",
]
```

The `adder` member is a package that will be developed in the workspace in a separate source folder.

``` bash
$ cargo new adder
     Created binary (application) `adder` package
```

```
├── Cargo.lock
├── Cargo.toml
├── adder
│   ├── Cargo.toml
│   └── src
│       └── main.rs
└── target
```

Using this structure, functions can be referenced from the project's root folder in a `src/main.rs` file by adding the desired function to the root `Cargo.toml`:

``` rust 
[dependencies]
add_one = { path = "../add_one" }
```

And referencing the function in `src/main.rs`:

``` rust
use add_one;

fn main() {
    let num = 10;
    println!("Hello, world! {num} plus one is {}!", add_one::add_one(num));
}
```

Member packages share the `target` folder with the root when running `cargo build`. 

### Modules

The `mod` keyword allows the user to logically divide code into units of data structures such as functions, structs, traits, and`impl` blocks, and manage the visibility of each.

``` rust 
mod newModule {
  fn modFunction() {...}
  
  pub fn pubModFunction() {...}
  
  pub mod subModule {
    ...
  }
}
```

By default, items declared in a module are private, and can be set as public using the `pub` keyword. This allows the items in the module to be accessed from outside of the module.

Other modules declared inside of a module can be set as visible inside a parent or ancestor by using the `pub(in crate::parent)` annotation.

When compiling a crate, the module file contents are inserted anywhere the `mod` declaration is found before the crate is compiled.

### Crates

A crate is a compilation unit that houses a set of related functionalities, organized in a single or multiple source files. Think of it as a collection of code that can be easily reused in different projects. 

By breaking every project down into a series of crates, Rust ensures modularity, and maintainability.

Crates are published and shared on [crates.io](https://crates.io).

#### Binary Crates

Binary crates are compiled into executables with `main` functions. Binary crates are useful for distributing tools or applications to users without having them compile it themselves.

#### Library Crates

Library crates are similar to binary crates, but have no `main`. They don't compile as executables, but function as importable modules that can be shared across projects. The library file is compiled by executing the following, which creates a file with the `.rlib` extension and a `lib` prefix.

``` bash
$ rustc --crate-type=lib rary.rs
$ ls lib*
library.rlib
```

```rust
fn main() {
    rary::public_function();
}
```

``` bash
$ rustc executable.rs --extern rary=library.rlib && ./executable 
```

#### Packages and Crates

A package is a collection of crates which provide a set of functionality. It can include any number of binary crates, but at most only one library crate. Each package is defined by a `Cargo.toml` file, so when executing `cargo new xxx`, the file structure created represents a package.

```
xxx
├── Cargo.toml
└── src
    └── main.rs
```



## Implementations

Rust implementations refer to the actual code that defines the behavior of a Rust program. When we talk about "implementations" in Rust, we are usually referring to how the methods of a struct or trait are defined and executed.

### Display

The `Display` trait is used for converting a value to a string, primarily for end-user-facing output. It allows you to define how your custom data type should be formatted when it is displayed using the `println!` or `format!` macros or converted explicitly to a string with the `to_string()` method. This trait is commonly used when you want to present your data in a human-readable format.

```rust
use std::fmt;

struct Person {
    name: String,
    age: u32,
}

impl fmt::Display for Person {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "Name: {}, Age: {}", self.name, self.age)
    }
}

fn main() {
    let person = Person {
        name: "Alice".to_string(),
        age: 30,
    };
    println!("{}", person); // Output: Name: Alice, Age: 30
}
```

### Debug

The `Debug` trait is used for formatting a value for debugging purposes. It is similar to `Display`, but it is intended for developers and not end-users. The primary difference is that `Debug` provides a more verbose output that includes additional information, such as type annotations and escaped characters, to aid in debugging.

```rust
#[derive(Debug)]
struct Point {
    x: f64,
    y: f64,
}

fn main() {
    let p = Point { x: 1.5, y: -3.8 };
    println!("{:?}", p); // Output: Point { x: 1.5, y: -3.8 }
}
```

The `#[derive(Debug)]` attribute automatically generates the implementation of the `Debug` trait for the struct.

### Formatting

Rust provides a powerful formatting syntax that can be used with the `println!` and `format!` macros. The syntax is similar to the `printf` function in C, but it's type-safe and more expressive. It allows you to control how values are displayed, set precision, align output, and more.

```rust
fn main() {
    let name = "Bob";
    let age = 25;
    println!("My name is {}, and I am {} years old.", name, age);
    // Output: My name is Bob, and I am 25 years old.
}
```

## Flow of Control

All control flow conditions in Rust must evaluate to a `bool`, unlike other languages which will try to convert non-boolean types.

``` rust
let num = 3
if (num == 1) {
    println!("1");
} else if (num == 2) {
    println!("2");
} else {
    println!("Something else);
}
```

### If Let

`if` controls can be used to evaluate in the assignment of a variable:

``` rust
let condition = true;
let number = if condition { 5 } else { 6 };
```

An expression at the end of a block unterminated by semi colon will be treated as the return value, so in the case of `if let` assignment, the values should be unterminated.

### Loops

The `loop` keyword will loop the containing block indefinitely until cancelled by the user, or a `break` condition is encountered.

``` rust
loop {
    println!("again!");
}
```

The `break` keyword can be followed by an unterminated expression to return from the loop, and the whole `loop` block can be used to assign a variable.

``` rust
let mut counter = 0;

let result = loop {
    counter += 1;

    if counter == 10 {
        break counter * 2;
    }
};
```

#### Loop Labels

The `loop` keyword can also be prefixed with a label (`'counting_up: loop`) so that the labelled loop can be controlled with a `break` or `continue` from within nested loops by commands such a ` break 'counting_up`

### For

`for` loops in Rust are phrased in the syntax `for x in y`, allowing for the loop to iterate over items in collection, such as arrays. This can be used to safely iterate over a collection, and collections such as `Range` can be used for counting `for` loops:

``` rust
for number in (1..4).rev() {
    println!("{number}!");
}
```

### While Let

`while let` loops can be used as a way to evaluate a series of `Option` data until `None` value is reached, for example. As long as the `let` pattern matches, the `while` loop will continue to evaluate.

``` rust
let mut stack = Vec::new();

stack.push(1);
stack.push(2);
stack.push(3);

while let Some(top) = stack.pop() {
    println!("{}", top);
}
```

### Match

The `match` keyword allows for evaluation of a variable based on a series of patterns. The `match` arms must exhaust all possibilities of the given patterns, so a catchall value of `_` can be used to represent any default value.

``` rust
match x {
    None => None,
    Some(i) => Some(i + 1),
}
```

The `match` case can be useful for evaluation enums.

## Attributes

Attributes are an annotation type of the format `#[attribute]` (outer attributes) or `#![attribute]` (inner attributes) which are defined by the compiler. They're used to define metadata for the compiler, such as blocks which are used for tests, crates, lint suppression, etc.

The following is an index of all built-in attributes.

- Conditional compilation
  - `cfg` — Controls conditional compilation.
  - `cfg_attr` — Conditionally includes attributes.
- Testing 
  - `test` — Marks a function as a test.
  - `ignore` — Disables a test function.
  - `should_panic` — Indicates a test should generate a panic.
- Derive
  - `derive` — Automatic trait implementations.
  - `automatically_derived` — Marker for implementations created by derive.
- Macros
  - `macro_export` — Exports a macro_rules macro for cross-crate usage.
  - `macro_use` — Expands macro visibility, or imports macros from other crates.
  - `proc_macro` — Defines a function-like macro.
  - `proc_macro_derive` — Defines a derive macro.
  - `proc_macro_attribute` — Defines an attribute macro.
- Diagnostics
  - `allow`, `warn`, `deny`, `forbid` — Alters the default lint level.
  - `deprecated` — Generates deprecation notices.
  - `must_use` — Generates a lint for unused values.
- ABI, linking, symbols, and FFI
  - `link` — Specifies a native library to link with an extern block.
  - `link_name` — Specifies the name of the symbol for functions or statics in an extern block.
  - `link_ordinal` — Specifies the ordinal of the symbol for functions or statics in an extern block.
  - `no_link` — Prevents linking an extern crate.
  - `repr` — Controls type layout.
  - `crate_type` — Specifies the type of crate (library, executable, etc.).
  - `no_main` — Disables emitting the main symbol.
  - `export_name` — Specifies the exported symbol name for a function or static.
  - `link_section` — Specifies the section of an object file to use for a function or static.
  - `no_mangle` — Disables symbol name encoding.
  - `used` — Forces the compiler to keep a static item in the output object file.
  - `crate_name` — Specifies the crate name.
- Code generation
  - `inline` — Hint to inline code.
  - `cold` — Hint that a function is unlikely to be called.
  - `no_builtins` — Disables use of certain built-in functions.
  - `target_feature` — Configure platform-specific code generation.
  - `track_caller` - Pass the parent call location to `std::panic::Location::caller()`.
  - `instruction_set` - Specify the instruction set used to generate a functions code
- Documentation
  - `doc` — Specifies documentation. See The Rustdoc Book for more information. Doc comments are transformed into doc attributes.
- Preludes
  - `no_std` — Removes `std` from the prelude.
  - `no_implicit_prelude` — Disables prelude lookups within a module.
- Modules
  - `path` — Specifies the filename for a module.
- Limits
  - `recursion_limit` — Sets the maximum recursion limit for certain compile-time operations.
  - `type_length_limit` — Sets the maximum size of a polymorphic type.
- Runtime
  - `panic_handler` — Sets the function to handle panics.
  - `global_allocator` — Sets the global memory allocator.
  - `windows_subsystem` — Specifies the windows subsystem to link with.
- Features
  - `feature `— Used to enable unstable or experimental compiler features.
- Type System
  - `non_exhaustive` — Indicate that a type will have more fields/variants added in future.

## Generics

Generics can be used to generalize data types used in functions, structs, and enums and define the expected behavior across a number of possible inputs.

Generics are declared using the angled brackets `<>` and typically a capitalized letter `T, U, E, X1, X2`, etc.

If a concrete datatype argument to any defined Generic doesn't meet the definition, the compiler will complain. In other words, if `var1` and `var2` are expected to be `T` data type, they will have to be of the same concrete data type. Otherwise, they should be defined as separate generics.

### Generic Structs

```rust
struct My_Struct<T,U> {
    var1: T,
    var2: T,
    var3, U
}
```

### Generic Enums

Generics are already used in built-in Rust enums such as `Option`, and `Result`

```rust
enum Option<T> {
    Some(T),
    None,
}

enum Result<T,E> {
    Ok(T),
    Err(E),
}
```

### Generic Functions

```rust
fn generic_function<T,U>(var1: T, var2: U) -> &T {
    if (var1 > var2) {
        var1
    }
    var2
}
```

In this case, the datatypes must have implemented a trait that allows for this comparison, otherwise the compile will complain that leaving this comparison unrestricted will introduce potential unwanted behavior.

## Traits

A trait is a function that can be implemented for multiple data types while retaining the same signature.

``` rust
pub trait Summary {
    fn summarize(&self) -> String;
}
```

### `impl`

This signature is the definition, which can be implemented for data types using the `impl` keyword.

```rust
impl Summary for Tweet {
    fn summarize(&self) -> String {
        format!("{} tweeted {} on {}", self.username, self.tweet, self.date)
     }
}
```

### Default `impl`

When defining the trait, a default implementation can also be provided, and provided to a datatype by using an empty `impl` block.

```rust
pub trait Summary {
    fn summarize(&self) -> String {
        String::from("Click Here to Read More");
    }
}

impl Summary for Newspaper {}
```

### Trait Parameters

Traits can be used to constrain the parameters of a function, by defining the datatypes according to the traits they should implement. 

```rust
pub fn notify(item: &impl Summary) {
    println!("Extry extry! {}", item.summarize());
}
```

### Trait Bound Syntax

Traits can be bound to a function that implies that the specified generic data type will implement the given trait. 

```rust
pub fn notify<T: Summary>(item: &T) {
    println!("Extry extry! {}", item.summarize());
}
```

If more than one trait is required, they can be concatenated in the parameters or binding using the `+` operator, or the `where` keyword.

```rust
pub fn notify<T: Summary + Display>(item: &T) {
```

```rust
pub fn notify(item &(impl Summary + Display)) {
```

```rust
pub fn notify<T>(t: &T) 
where
    T: Display + Clone,
{
```

Traits can also be used to bind the return type.

```rust
fn returns_summarizable() -> impl Summary {
```

## Lifetimes

Because the Rust borrow checker is used to free up resources when not in use, a value can be freed up unexpectedly when working with references, for example. To communicate to the borrow checker that the value should not be freed up and avoid error messages, lifetime annotations are used to tie a variable to an expected lifetime.

### Lifetime Annotations

Lifetimes are annotated by an apostrophe followed by a variable name; typically a single lowercase letter such as `'a`, `'b`, etc.

### Lifetime Ellisions

In certain cases, the compiler can determine the lifetime of a function's arguments implicitly using some rules:

- The function does not return a reference
- There is only one reference input parameter
- The function is a method taking `&self` or `&mut self` as the first parameter

``` rust
// this does not compile
fn f(s: &str, t: &str) -> &str {
    if s.len() > 5 { s } else { t }
}
```

In the above example, because the lifetime is computer at compile time, it can't be determined which of the argument variables to free up after this function concludes.

To communicate that the returned value should be valid as long as the input parameters are valid, each is annotated with the same lifetime `'a`.

``` rust
fn f<'a>(s: &'a str, t: &'a str) -> &'a str {
    if s.len() > 5 { s } else { t }
}
```

In the case where you know which value will be returned, you can annotate the input which should live on as the value the returned reference refers to with the same lifetime, and the other input with a different lifetime.

``` rust
fn f<'a, 'b>(s: &'a str, _t: &'b str) -> &'a str {
    s
}
```

## Macros

Macros are a form of _Metaprogramming_ that allow the user to write that, in effect, generates other code. Macros are called at compile time, while functions are called at runtime, so they give the user access to code generation in stages that functions would not be able to, such as parameterized generation of traits.

Macros are also expanded at compile time, so they give the option to provide variable arguments, such as in the case of the `println!` macro.

### Declarative Macros

Declarative macros are a specific type of macros that are defined using the `macro_rules!` syntax. This allows you to specify patterns and replacement rules using a set of macro rules. When the compiler encounters the macro invocation, it applies the rules and generates the corresponding code.

#### Macro Rules
Macro rules consist of patterns and replacement patterns. The patterns are used to match specific code patterns, and the replacement patterns define the code to be generated when a match is found.

```rust
// Declare the macro using the `macro_rules!` syntax
macro_rules! square {
    // Define the pattern for matching the macro invocation
    ($x:expr) => {
        // Define the replacement code using the matched expression
        $x * $x
    };
}

fn main() {
    let num = 5;
    // Invoke the macro to generate code that calculates the square of 'num'
    let result = square!(num);
    println!("Square of {} is {}", num, result); // Output: Square of 5 is 25
}
```

In this example, the macro `square!` matches any expression `$x:expr`, and it replaces it with `$x * $x`. When we invoke `square!(num)`, it expands to `num * num`, effectively generating code to calculate the square of the provided number.

Declarative macros can become quite powerful and expressive. They allow you to abstract away complex operations, create domain-specific languages (DSLs), and provide reusable abstractions to improve the overall code structure and readability.

### Procedural Macros

Procedural macros in Rust are a more advanced and versatile type of macros compared to declarative macros. They allow you to define custom code transformations that operate on Rust code at compile-time. Unlike declarative macros that use pattern matching for code generation, procedural macros enable you to write Rust code that generates Rust code.

Procedural macros are often used with custom attribute-like syntax. You apply the macro to some Rust code using this syntax, and the macro processes the marked code to produce the desired output. These attributes may be applied to items like functions, structs, enums, or even entire modules.

Procedural macros are implemented as separate Rust libraries. When you want to use a procedural macro, you include the library in your project and use its provided macros. The library code is responsible for the actual code transformation.

There are three types of procedural macros in Rust, each serving a different purpose.

#### `derive` Macros

These generate code to implement certain traits automatically for custom data types.

#### Attribute Macros

These modify the items they are applied to, adding or modifying functionality based on the macro's implementation.

#### Function Macros

These are similar to traditional macros but are more flexible and enable you to generate entire blocks of code.

#### Example

```rust 
// Assume this is defined in an external crate (procedural macro library)
#[proc_macro]
pub fn double_input(input: TokenStream) -> TokenStream {
    // Parse the input, perform code transformation (e.g., doubling a numeric value), and generate new code
    // This is just a simplified example; procedural macros can be much more complex.
    let transformed = format!("{} * 2", input);
    transformed.parse().unwrap()
}

// Your Rust code using the procedural macro
fn main() {
    let num = 5;
    let result: i32 = double_input!(num);
    println!("Double of {} is {}", num, result); // Output: Double of 5 is 10
}
```

In this example, we define a procedural macro `double_input`, which doubles the value passed to it and generates the corresponding Rust code. When you use `double_input!(num)` in your code, the procedural macro transforms it into `5 * 2`, effectively doubling the value. Keep in mind that this example is highly simplified, and actual procedural macros can have much more sophisticated transformations and logic.

## Errors

Errors in Rust can be categorized as _Recoverable_ or _Unrecoverable_. When an error cannot be recovered from, such as when something unexpected happens versus something which may happen from normal user interaction, it is best to call the `panic!` function. This exits the program, and produces a backtrace and error log. If the error is something which can readily be predicted, such as a user entering a password string which is longer than the predefined length, a `Result` object can be returned.

``` rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

In the case where a user is attempting to open a file, and the file might or might not exist, an `Ok` object can be returned with the correct value if it exists, and an `Err` object can be returned if it doesn't.

When handling the `Result` using a `match` statement, the `Err` case can `panic!`, or recover from this specific error by creating the file and returning it.

The `Err` object can be an Error of different kinds, so further `match` arms can handle the error types accordingly.

``` rust
let greeting_file = match greeting_file_result {
    Ok(file) => file,
    Err(error) => match error.kind() {
        ErrorKind::NotFound => match File::create("hello.txt") {
            Ok(fc) => fc,
            Err(e) => panic!("Problem creating the file: {:?}", e),
        },
        other_error => {
            panic!("Problem opening the file: {:?}", other_error);
        }
    },
};
```

Some `match` cases can be replaced by the `unwrap_or_else` function when handling a `Result`, and functions such as `unwrap` and `expect` will implicitly panic when returning an error.

``` rust
File::create("hello.txt").unwrap_or_else(|error| {
    panic!("Problem creating the file: {:?}", error);
})
```

Errors can also be propagated upwards by retuning an error object to the caller:

``` rust
match username_file.read_to_string(&mut username) {
    Ok(_) => Ok(username),
    Err(e) => Err(e),
}
```

This can also be shortened using the `?` operator, so long as the return type of the function calling it is equivalent to the value the `?` is used on.

`username_file.read_to_string(&mut username)?`

## Testing

A test in Rust is essentially any function annotated with the `#[test]` attribute. By executing `cargo test` any functions with the test attribute inside the `tests` module will be executed.

The `tests` module is defined in a `mod tests` block, and the whole module is given the `#[cfg(test)]` attribute to denote that these functions should be executed when the test command is run.

``` rust
#[cfg(test)]

mod tests {
    #[test]
    fn hey() {
        let num = 0;
        assert_eq!(num, 0);
    }
}
```

### Test Attributes

`#[ignore]` can be used to skip a test when it hasn't been implemented yet.

`#[should_panic]` can be used to handle a test which is expected to raise a `panic!` when passed a certain parameter.

<BryanMelanson />
