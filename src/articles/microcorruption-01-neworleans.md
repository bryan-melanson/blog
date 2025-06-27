---
id: study-microcorruption-neworleans
aliases: []
tags:
  - microcorruption
  - new orleans
---

# Microcorruption

[Microcorruption](https://www.microcorruption.com) CTF is a capture the flag (CTF) competition designed to teach low-level reverse engineering by pitting the user against a lock mechanism running on a simulated MSP430 controller. The user exploits MSP430 assembly to gain access to the device and unlock the door.

## Microcorruption (New Orleans)

- Password set by connecting to an app

### `<main>`

```assembly
call 0x447e <create_password>
; get the user input password
call 0x44b2 <get_password>          ; retrieve the user input password
call 0x44bc <check_password>        ; check the input against the created password
tst r15
jnz $+0xc; jump to <unlock_door>
```

#### `<create_password>`

```assembly
mov #0x2400, r15        ; store the address 0x2400 in r15
mov.b #0x54, 0x00(r15)  ; store #0x54 byte at 0x2400 + 0
mov.b #0x5b, 0x01(r15)  ; store #0x5b byte at 0x2400 + 1
mov.b #0x28, 0x02(r15)  ; etc.
mov.b #0x7b, 0x03(r15)
mov.b #0x71, 0x04(r15)
mov.b #0x66, 0x05(r15)
mov.b #0x67, 0x06(r15)
mov.b #0x0, 0x07(r15)
```

#### `<check_password>`

```assembly
clr r14
mov r15, r13            ; copy the input pointer address to r13
add r14, r13            ; add the index to the pointer
cmp.b @r13, 0x2400(r14) ; compare byte in 0x2400 + r14 with the first byte
jnz $+0xc               ; jump 0xc bytes if not equal
inc r14                 ; increment the index
cmp $0x8, r14           ; check the bounds of the index
jnz $-0xe               ; if not at the limit jump to the cmp.b
mov #0x1, r15           ; set the flag to indicate password is valid
ret
```

### Solution

Input is the password initially stored at 0x2400:
`0x54 0x5b 0x28 0x7b 0x71 0x66 0x67 0x0`
