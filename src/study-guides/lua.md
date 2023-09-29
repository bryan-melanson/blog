---
title: 'Lua'
---

# Lua

[[toc]]

## Syntax

## Data Structures

### Local Variables

## Control Flow

### If Else

## Looping

Because Lua [ignores whitespace](#syntax), most loops have to surround the body with `do` and `end` to delimit the body from the control condition. The exception to this is the [`repeat...until`](#repeat-until) loop, because the arguments are found after the body of the loop, and the `until` keyword is hit, removing any ambiguity about where args begin and the control body ends.

```
control condition
do
  statement
end
```

#### `break`

For all loops, the `break` command will terminate execution of the loop and continue with the statement immediately following the loop or switch.

### `for`

#### `#` Length Operator

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
