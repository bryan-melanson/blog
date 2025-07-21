--
id: study-microcorruption-hanoi
aliases: []
tags:

- microcorruption
- hanoi

---

# Microcorruption

[Microcorruption](https://www.microcorruption.com) CTF is a capture the flag (CTF) competition designed to teach low-level reverse engineering by pitting the user against a lock mechanism running on a simulated MSP430 controller. The user exploits MSP430 assembly to gain access to the device and unlock the door.

## Microcorruption (Hanoi)

- There is no default password on the LockIT Pro HSM-1. Upon receiving the LockIT Pro, a new password must be set by first connecting the LockitPRO HSM to output port two, connecting it to the LockIT Pro App, and entering a new password when prompted, and then restarting the LockIT Pro using the red button on the back.
- LockIT Pro Hardware Security Module 1 stores the login password, ensuring users can not access the password through other means. The LockIT Pro can send the LockIT Pro HSM-1 a password, and _the HSM will return if the password is correct by setting a flag in memory_.

## `<main>`

```assembly
call  #0x4520 <login>
clr   r15
```

## `<login>`

```assembly
...                           ; Enter the password
mov    #0x2400, r15           ; Store address 0x2400 in R15
mov    #0x1C, r14             ; Store 0x1C in R14
call   <test_password_valid>
cmp.b  #0x1C, &0x2410         ; Test if &0x2410 is 0x1C
jnz    $+0x10                 ; If no, jump to the fail condition
call   #0x4448                ; else jump to <unlock_door>
```

```

## Solution

There doesn't seem to be any functioning check for password length. It specified 8-16 characters, but doesn't catch either case.

Write any hex value password with the 0x10 byte == 0x1C: `0x000102030405060708090A0B0C0D0E0F1C`

```
