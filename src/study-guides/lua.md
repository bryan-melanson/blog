---
title: 'Lua'
---

# Lua

[[toc]]

## Syntax

Lua is open source, written as a library in the C programming language. It provides a host program called `lua` that operates as a standalone interpreter. This host program can execute pieces of Lua code, write and read Lua variables and register C functions to be called by Lua code. Because of it's light weight, open source community, cooperation with C and portability, it's a good choice for some embedded devices.

Lua ignores whitespace except for use as a delimiter between tokens, and interprets symbols such as a new line, tab, or carriage return as whitespace. Because Lua allows for parentheses, there can be some ambiguity when interpreting a command like:

```
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

```
statement = 
  do
    block 
  end
```

## Data Structures

### `local` Variables

### Tables

Tables are the only data structuring mechanism in Lua, and operate similarly to arrays of non-heterogeneous data type which can be indexed with any value. 

### Assignment

Lua allows variable assignment via a list of variables on the left side, and a list of expressions on the right side, each separated by commas.

```
a, b, c = 1, 2, { 3, 4 }
```

## Metatables and Metamethods

Metatables are a concept used for defining special behaviors for tables. They define metamethods used to implement features like operator overloading, object-oriented programming and more. 

```
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

## Control Structures

### `if...else`

```
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

#### `#` Length Operator

The `variable#` syntax provides the length of the given variable, if it is a string or a table. In the case of strings, it will return the number of bytes in the variable. In case of tables, it will return the last numeric key whose value is not nil for tables, starting from 1. This behavior is only defined for tables with array-like qualities, such as keys which are a sequence `{1..n}`. When indexed with non-integer values, the result is *undefined*.

```
print (#"oranges")        -- 7
print (#{"a","b","c"})    -- 3
print (#{"a", [3] = "b"}) -- 1
print (#{a = "a"})        -- 0
```

This can be a useful tool for `for` loop conditions iterate over strings.

```
local myString = "Hello, World!"

for i = 1, #myString do
    local character = string.sub(myString, i, i)
    print(character)
end

-- "H"
-- "e"
-- ...
```
#### `pairs()`

### `while`
`while` loops continue to evaluate the statements in the body until the `while` condition is no longer true, or a `break` statement is reached.

```
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

```
control condition
do
  statement
end
```

#### `break`

For all loops, the `break` command will terminate execution of the loop and continue with the statement immediately following the loop or switch.


### `repeat...until`
The `repeat...until` expression evaluates the body statement at least once, similarly to `do...while` loops in other languages, and repeats until the condition is evaluated to be true.

```
repeat
   statement(s)
until( condition )
```

## Error Handling

## C API

## Functions

### Var Args

## Coroutines

## Modules

## File I/O

## Garbage Collection
