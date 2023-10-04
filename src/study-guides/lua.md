---
title: 'Lua'
---

# Lua

[[toc]]

## Syntax

Lua is open source, written as a library in the C programming language. It provides a host program called `lua` that operates as a standalone interpreter. This host program can execute pieces of Lua code, write and read Lua variables and register C functions to be called by Lua code. Because of it's light weight, open source community, cooperation with C and portability, it's a good choice for some embedded devices.

Lua ignores whitespace except for use as a delimiter between tokens, and interprets symbols such as a new line, tab, or carriage return as whitespace. Because Lua allows for parentheses, there can be some ambiguity when interpreting a command like:

``` lua
a = b + c
(print or io.write)('done')
```

Which could see the `c` as a function call `c(print...)` or a separate line `c; (print...)`. To avoid these ambiguities, the semicolon `;` can be used as an empty instruction to delimit the statement:

```
a = b + c;
(print or io.write)('done');
```

When using statements with open parentheses, the semicolon can also be used at the start of the `(print...)` line as a fail-safe.

To avoid ambiguity, a block can be explicitly defined as a single statement using a `do...end` wrap.

``` lua
statement = 
  do
    block 
  end
```

## Data Structures

Variables in Lua are dynamically typed, so their data types are not explicitly declared when assigning them. The basic data types are *nil*, *boolean*, *number*, *string*, *function*, *userdata*, *thread* and *table*.

### nil

`nil` represents the absence of any useful data. 

### Numbers

The *Numbers* type represents both integer and float data types, and represent both using 64 bits in standard Lua. Since this can be excessive for embedded devices, Lua can be set to 32-bit representation using the `LUA_32BITS` configuration flag.  In the case where an integer `n` overflows in a system with `x` bit representation, the result will be $n mod(2^x)$. 

### String

In Lua, strings are an immutable sequence of bytes, represented as sequences of characters. The index of the string starts with `1`, and accept negative integers as an index, which index from the end of the string.

``` lua
local myString = 'Hello, World!'
local anotherString = 'This is a single-quoted string.'

local myString = "Hello, World!"
local anotherString = "This is a double-quoted string."
```

Lua also allows the creation of long strings, which can span multiple lines and are often used for multiline text, such as documentation or large blocks of text. Long strings are enclosed by double square brackets [[ and ]].

```
local longString = [[
   This is a long string
   that spans multiple lines.
]]
```

Lua strings can also be concatenated using the `..` operator.

### Boolean

Booleans in Lua can have the values `true` or `false`. Any value other than `nil` will make a value evaluate as `true`, so they should be carefully expressed. The values `nil` and `false` are also interchangeable, with the key difference that `false` can be used as a table value, while `nil` will represent an absent key.

### Function

Lua can call functions [written in C](#c-api).

### Userdata

In Lua, `userdata` is a special data type that allows you to create and manipulate values that are not under the direct control of the Lua garbage collector. It is a mechanism for integrating external data or objects written in a different programming language (usually C or C++) into Lua scripts. `userdata` objects are typically used for interfacing with C libraries or for creating custom user-defined types.

Working with userdata requires a good understanding of the C API in Lua, as well as proper memory management, as userdata objects are not automatically garbage collected by Lua; you typically need to manage their lifecycle from the C side.

``` lua
-- Assume that a C library provides a function to create a userdata object.
local myUserData = myClib.createUserData()

-- You can define Lua functions that operate on the userdata.
function myUserData:getValue()
    return myClib.getValue(self) -- Calls a C function to get the value.
end

function myUserData:setValue(newValue)
    myClib.setValue(self, newValue) -- Calls a C function to set the value.
end

-- Now you can use your custom userdata object in Lua.
print(myUserData:getValue()) -- Prints the value associated with the userdata.
myUserData:setValue(42) -- Sets a new value through Lua function.

```

This requires prerequisite setup for [C functions](#c-functions-in-lua).

### Thread

The type thread represents independent threads of execution and it is used to implement [coroutines](#coroutines). Lua threads are not related to operating-system threads. Lua supports coroutines on all systems, even those that do not support threads natively.

### Table

You can index Lua's tables with any values, but in Lua they are customarily indexed starting with `1` instead of `0` as expected.

```
({[0] = 'a', 'b'})
```

```
a = {}
for i=-5, 5 do
  a[i] = 0
end
```


### `local` Variables

The default scope of Lua variables is global. To constrict a variables values to its block, the 
`local` keyword can be used when assigning the variable.

```
a = 5

do 
  local a = 10
  print(a)
end

print(a)

-- 10
-- 5
```

Tables are the only data structuring mechanism in Lua, and operate similarly to arrays of non-heterogeneous data type which can be indexed with any value. 

### Assignment

Lua allows variable assignment via a list of variables on the left side, and a list of expressions on the right side, each separated by commas.

``` lua
a, b, c = 1, 2, { 3, 4 }
```

### Metatables and Metamethods

Metatables are a concept used for defining special behaviors for tables. They define metamethods used to implement features like operator overloading, object-oriented programming and more. 

``` lua
-- Create two tables
table1 = { x = 10, y = 20 }
table2 = { x = 5, y = 15 }

-- Set a metatable for table1
metatable = {
  __add = function(table1, table2)
    return { x = table1.x + table2.x, y = table1.y + table2.y }
  end
}

setmetatable(table1, metatable)

-- Now, when you use the '+' operator on table1 and table2, the metatable's '__add' function is called
result = table1 + table2
print(result.x, result.y) -- Output: 15 35
```

### Garbage Collection

Lua employs an automatic garbage collection mechanism to automatically manage memory and deallocate resources that are no longer in use. Lua's garbage collection operates using *Mark*, *Sweep*, *Finalization* and *Resize* phases, which are triggered depending on the Lua implmentation. These cycles can also be triggered with the `collectgarbage()` function.

## Control Structures
 
### `if...else`

``` lua
if (condition)
then
  statement
elseif (condition)
then
  condition
else
  statement
end
```

### `for`

 Lua `for` loops can be defined as numeric loops, or iterator loops:

``` lua
for variable = start, stop, step do -- step is optional
    -- Loop body
end

for key, value in iterator_function do
    -- Loop body
end
```

#### `#` Length Operator

The `variable#` syntax provides the length of the given variable, if it is a string or a table. In the case of strings, it will return the number of bytes in the variable. In case of tables, it will return the last numeric key whose value is not nil for tables, starting from 1. This behavior is only defined for tables with array-like qualities, such as keys which are a sequence `{1..n}`. When indexed with non-integer values, the result is *undefined*.

``` lua
print (#"oranges")        -- 7
print (#{"a","b","c"})    -- 3
print (#{"a", [3] = "b"}) -- 1
print (#{a = "a"})        -- 0
```

This can be a useful tool for `for` loop conditions iterate over strings.

``` lua
local myString = "Hello, World!"

for i = 1, #myString do
    local character = string.sub(myString, i, i)
    print(character)
end

-- "H"
-- "e"
-- ...

Lua's string manipulation libraries also make this operation easy.
```
#### `pairs()`

The `pairs()` function returns a `{ key, value }` pair when iterating over a table, can also be used to traverse in a `for` loop.

```
a = { "a", "b", "c", "d" }
for key, value in pairs(a) do
  print(key,value)
end

-- 1 a
-- 2 b
-- 3 c
-- 4 d
```

### `while`
`while` loops continue to evaluate the statements in the body until the `while` condition is no longer true, or a `break` statement is reached.

``` lua
while(condition)
do
   statement(s)
   if (condition)
   do
      break
   end
end
```
#### `do...end`

Because Lua [ignores whitespace](#syntax), most loops have to surround the body with `do` and `end` to delimit the body from the control condition. The exception to this is the [`repeat...until`](#repeat-until) loop, because the arguments are found after the body of the loop, and the `until` keyword is hit, removing any ambiguity about where arguments begin and the control body ends.

``` lua
control condition
do
  statement
end
```

#### `break`

For all loops, the `break` command will terminate execution of the loop and continue with the statement immediately following the loop or switch.


### `repeat...until`
The `repeat...until` expression evaluates the body statement at least once, similarly to `do...while` loops in other languages, and repeats until the condition is evaluated to be true.

``` lua
repeat
   statement(s)
until( condition )
```

## Functions
In Lua, functions are first-class citizens, which means you can assign them to variables, pass them as arguments, and return them from other functions. This flexibility allows you to create and work with a wide variety of distinct functions in your Lua programs.

Lua functions follow the following syntax:

``` lua
function func_name(args,...)
  body
end
```
### Var Args

The provided list of arguments is resized to the length of the function's defined parameters, unless the functions is defined as a *variadic function* which has `...` at the end of the parameters.

To access the varargs, the `select` function can be used, providing the index of the vararg to be selected as the first argument.

``` lua
function firstArg(...)
    return select('#', ...)
end
```

### Closures

 Lua functions can be distinct based on the closures they capture. Two functions that have the same name, parameters, and body but capture different variables from their enclosing environment are distinct due to the values they capture.

``` lua
function makeMultiplier(factor)
    return function(x)
        return x * factor
    end
end

local double = makeMultiplier(2)
local triple = makeMultiplier(3)
```

## C API

C can interact with Lua through the Lua C API, which allows C code to call Lua functions and manipulate Lua data structures. This interaction enables you to extend Lua with custom C functions, create Lua modules in C, and interface Lua with C libraries. 

### Lua Functions in C

To call Lua based functions in C code, the `lua_State` pointer must first be initialized:

``` c
lua_State* L = luaL_newstate();
luaL_openlibs(L); // Open Lua's std libraries
```

A Lua file can then be loaded and its functions imported into C. The arguments are called using a Stack for transferring data to Lua, and the args and return type must be defined before calling.

``` c
if (luaL_dofile(L, "my_lua_script.lua") != 0) {
    fprintf(stderr, "Error loading Lua script: %s\n", lua_tostring(L, -1));
    lua_close(L);
    return 1;
}

lua_getglobal(L, "myLuaFunction"); // Replace with the name of your Lua function

lua_pushnumber(L, 42); // Push argument 1
lua_pushnumber(L, 10); // Push argument 2

int numArgs = 2; // Number of arguments pushed onto the stack
int numResults = 1; // Number of expected return values
int error = lua_pcall(L, numArgs, numResults, 0);

if (error) {
    fprintf(stderr, "Error calling Lua function: %s\n", lua_tostring(L, -1));
    lua_pop(L, 1); // Pop the error message from the stack
}

double result = lua_tonumber(L, -1); // Retrieve the result from the stack

//close lua
lua_close(L);
```

### C Functions in Lua

To call C functions in Lua, a function must first be written that follows the following signature:
 
``` c
int myFunction(lua_State* L);
```

To make it accessible from Lua, it must be registered with Lua's C API, typically using the `lua_register()` function.

## Coroutines

Coroutines in Lua provide a way to create cooperative multitasking, allowing you to pause and resume the execution of functions. They are intitialized using the `coroutine.create` function, yielded using the `coroutine.yield` function, and started as well as resumed using the `coroutine.resume` function. The status can be polled (`suspended`, `running`, `dead`) using the `couroutine.status` function.  

## Modules

Third party libraries can be imported as modules. In Lua, modules are a way to organize code into reusable units that can be loaded and used in other Lua scripts. A module in Lua is essentially a Lua script file that defines a set of functions, variables, and tables. To create a module, you typically create a Lua script with the desired functionality and save it as a .lua file.

Modules can create private variables by declaring them as `local` in the script.

``` lua
local M = {}  -- Create a module table

-- Module variables
M.myVariable = "Hello, World!"

-- Module function
function M.myFunction()
    print("This is a function from mymodule")
end

return M  -- Return the module table
```

To use a module in another Lua script, you need to require it. The require function loads and executes the module, returning the module table that was returned from the module script. You can then access the module's functions and variables through this table.

``` lua
local mymodule = require("mymodule")

print(mymodule.myVariable)
mymodule.myFunction()
```

If nested in a folder structure, a `project/mymodule.lua` script can be imported using `local mymodule = require("project.mymodule")`.

## Errors

In Lua, errors are managed using a combination of the `error` function for generating errors and the `pcall` function for handling errors.

The `error` function takes a single string as its only argument, which is the error message presented when triggered. Optionally, a second argument can be provided which defines the error level. The error level is used in debugging to indicate where an error occurred in the call stack, and provides context about which function or level triggered the function.

``` lua
function divide(a, b)
    if b == 0 then
        error("Division by zero", 2) -- Specify error level 2
    end
    return a / b
end

local success, result = pcall(function()
    local result = divide(10, 0)
    print("Result:", result)
end)

if not success then
    print("Error:", result)
end
```

In this example, the `error` function is called with an error level of 2, indicating that the error message should report that the error occurred in the `divide` function (the caller of error), rather than in the immediate caller of the `pcall` function.

### `pcall`

To catch and handle errors in Lua, you can use the `pcall` (protected call) function. `pcall` takes a function and its arguments as arguments and attempts to call the function. If the function succeeds without errors, `pcall` returns true and any return values from the function. If an error occurs during the execution of the function, `pcall` returns false and the error message.

It can be viewed similarly to a `try` and `catch` block:

``` lua
local success, result = pcall(function()
    -- Code that may produce an error
end)

if success then
    -- The code executed successfully
    print("Result:", result)
else
    -- An error occurred
    print("Error:", result)
end
```

## String Manipulation

The Lua standard library provides generic functions for string manipulation.

### String Concatenation

The `..` operator is used to concatenate strings.

``` lua
local result = str1 .. str2
```

### String Length

The `#` operator is used to return a string's length.

``` lua
local length = #str
```

### String Substring

The `string.sub` function can be used to extract a substring.

``` lua
local substring = string.sub(str,7,11)
```

### String Search and Replace

The `string.find` and `string.gsub` functions are used to find and replace substrings.

``` lua
local pos = string.find(str,"substring")
local new = string.gsub(str, "find", "replace")
```

### String Splitting

The `string.gmatch` function is used to split according to the Regex pattern.

```lua
local text = "test, test1, test2"
for word in string.gmatch(str, "[^,]+") done
  print word
end

-- test
-- test1
-- test2
```

### String Formatting

The `string.format` function formats strings similarly to the `printf` function in C.

``` lua
string.format("%d", num)
```

### String Conversion

The `string.upper` and `string.lower` functions are used to convert between upper and lower case.

``` lua
local upperTest = string.upper(str)
local lowerTest = string.lower(str)
```

### Trim Whitespace

Lua's standard library does not include a `trim` function.
