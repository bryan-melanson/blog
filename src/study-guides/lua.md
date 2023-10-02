---
title: 'Lua'
---

# Lua

[[toc]]

## Syntax



## Data Structures

Variables in Lua are dynamically typed, so their data types are not explicitly declared when assigning them. The basic data types are *nil*, *boolean*, *number*, *string*, *function*, *userdata*, *thread* and *table*.

### nil

### Numbers

The *Numbers* type represents both integer and float data types, and represent both using 64 bits in standard Lua. Since this can be excessive for embedded devices, Lua can be set to 32-bit representation using the `LUA_32BITS` configuration flag.  In the case where an integer `n` overflows in a system with `x` bit representation, the result will be $n mod(2^x)$. 

### String

### Boolean

### Function

### Userdata

### Thread

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

## String Manipulation

## Garbage Collection
