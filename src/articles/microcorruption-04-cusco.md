---
id: study-microcorruption-cusco
aliases: []
tags:
  - microcorruption
  - cusco
---

# Microcorruption

[Microcorruption](https://www.microcorruption.com) CTF is a capture the flag (CTF) competition designed to teach low-level reverse engineering by pitting the user against a lock mechanism running on a simulated MSP430 controller. The user exploits MSP430 assembly to gain access to the device and unlock the door.

## Microcorruption (Cusco)

- This is Software Revision 02. We have improved the security of the
  lock by removing a conditional flag that could accidentally get
  set by passwords that were too long.

## `<main>`

```assembly
call  #0x4500 <login>
```

## `<login>`

```assembly
...                                ; Store the 8-16 char password
mov  #0x30, r14                    ; Store a value (length?)
...
call #0x4452 <test_password_valid>
tst  r15                           ; Check R15 value
jz   $+0xc <login+0x32>            ; If it's zero, jump to fail condition
call #0x4446 <unlock_door>
```

We're told only 8-16 character passwords are allowed, but the password is stored starting at 0x43F0, and stores up to 0x4420.

We can overflow up to 0x4420, so we will look for anything referencing addresses in the range of 0x43EE-0x4420.

When `<login>` is called, it stores its position 0x43FE in `sp`, and returns to it at the end of the function. Knowing `<unlock_door>` is at 0x4446, we can overflow the input buffer until 0x43FE contains the address we want to jump to.

## Solution

Any 16 bytes followed by the `<unlock_door>` address in little-endian: `0x000102030405060708090A0B0C0D0E0F4644`.
