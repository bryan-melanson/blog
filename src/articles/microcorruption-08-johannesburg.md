---
id: study-microcorruption-johannesburg
aliases: []
tags:
  - microcorruption
  - johannesburg
---

# Microcorruption

[Microcorruption](https://www.microcorruption.com) CTF is a capture the flag (CTF) competition designed to teach
low-level reverse engineering by pitting the user against a lock mechanism
running on a simulated MSP430 controller. The user exploits MSP430 assembly
to gain access to the device and unlock the door.

## Microcorruption (Johannesburg)

- This is Software Revision 04. We have improved the security of the
  lock by ensuring passwords that are too long will be rejected.

## Long Passwords

Let's test a long input: `0102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F`

This stores the input starting at `0x2400` and allows input up to `0x243E`
(62 bytes) and copies the input to `0x43EC`-`0x442F` (43 bytes)

## `<main>`

```assembly
call  #0x452c <login>
```

## `<login>`

```assembly
add     #0xffee, sp
mov.b   #0xec, 0x11(sp)                 ; Move 0xEC to SP + 0x11
;
call    #0x4624 <strcpy>                ; Copy the input string from 0x2400
mov     sp, r15
call    #0x4452 <test_password_valid>   ; Check the validity of the password
tst     r15
jz      $+0xc <login+0x44>              ; If not valid jump over this line
call    #0x4446 <unlock_door>           ; If valid, unlock th door
cmp.b   #0xec, 0x11(sp)                 ; Is 0xEC still at SP + 0x11?
jz      $+0xe <login+0x60>              ; Jump if 0xEC hasn't been overwritten
mov     #0x44ff "Invalid Password Length: password too long.", r15
call    #0x45f8 <puts>
br      #0x443c <__stop_progExec__>
add     #0x12, sp                       ; Jump here if 0xEC isn't overwritten
ret
```

The login function is storing a guard value `0xEC` at `0x43FD` and using it to
check that the copied input string is under 16 bytes (in theory; it actually
only triggers if you write 18 bytes). If the password has overwritten the
`0xEC` it will print the error to the user and exit.

If it's not overwritten, the `<login>` function returns to the address stored
in the stack pointer `0x43FE`. Since this is within our buffer overflow range,
at byte 18, we can write an address in our password as long as the `0xEC`
value is still at byte 17.

## `<unlock_door>`

```assembly
push    #0x7f
call    #0x4594 <INT>
incd    sp
ret
```

This function will pass the `0x7F` argument that will open the door for us.

## Solution

`0102030405060708090A0B0C0D0E0F1011EC4644`
