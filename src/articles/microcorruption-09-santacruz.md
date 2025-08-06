---
id: study-microcorruption-santacruz
aliases: []
tags:
  - microcorruption
  - santa cruz
---

# Microcorruption

[Microcorruption](https://www.microcorruption.com) CTF is a capture the flag (CTF) competition designed to teach
low-level reverse engineering by pitting the user against a lock mechanism
running on a simulated MSP430 controller. The user exploits MSP430 assembly
to gain access to the device and unlock the door.

## Microcorruption (Santa Cruz)

- This is Software Revision 05. We have added further mechanisms to
  verify that passwords which are too long will be rejected.

## `<main>`

```assembly
add    #0xffce, sp      ; 0x4400 + 0xFFCE = 0x43CE
call   #0x4550 <login>
```

Nothing new here, except for the `0xFFCE` operation. That seems
to be where `<login>` is going to be returning, so we'll keep
the `0x43CE` address in mind when testing inputs.

## `<unlock_door>`

```assembly
444a <unlock_door>
push   #0x7f
call   #0x46c4 <INT>
incd   sp
ret
```

This function is where we want to redirect to open the door.

## New Prompt

> Authentication now requires a username and password.
> Remember: both are between 8 and 16 characters.
> Please enter your username:
> Please enter your password:

## Long Passwords

Let's test a long input for username: `0102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F`

This stores the username input from `0x2404` to `0x2466`,
which is then copied to `0x43A2-0x4404` (63 bytes)

Let's try another one for password: `A1A2A3A4A5A6A7A8A9AAABACADAEAFB0B1B2B3B4B5B6B7B8B9BABBBCBDBEBF`

This stores the password at `0x2404` to `0x2466` again, and
copies to `0x43B5-0x4418`. This range will allow us to overwrite
`0x43CE`, so if we include the address of `<unlock_door>` in
the 19th and 20th byte of our password input, it should work.

> Invalid Password Length: password too long.

Damn it.

Let's see where the password length is being checked.

## `<login>`

The `<login>` function starts by setting some values in memory around the
stack pointer value set in `<main>`.

```assembly
push  r11               ; SP = 0x43CA
push  r4                ; SP = 0x43C8
mov   sp, r4            ; R4 = 0x43C8
add   #0x4, r4          ; R4 = 0x43CC
add   #0xffd8, sp       ; SP = 0x43A0
mov.b #0x0, -0x6(r4)    ; R4 - 0x06 = 0x43C6
mov.b #0x8, -0x19(r4)   ; R4 - 0x19 = 0x43B3 (The minimum size)
mov.b #0x10, -0x18(r4)  ; R4 - 0x18 = 0x43B4 (The maximum size)
```

The `0x8` and `0x10` are used as the high and low bounds, and the
`0x00` is likely used as the NULL byte to detect the end of input.

After the password and username are copied to their 2nd locations
we can see that when passing 16 byte values for both, they are
sandwiching these three values, the `0x00`, `0x08` and `0x10`.

We can try our approach from before, with some larger values to take their
spot so we still pass length checks. If we overwrite the return address
with the first input and preserve the `NULL` character, we should be ok.

## Solution

Username: `0102030405060708090A0B0C0D0E0F101002122232425262728292A2B2C2D2E2F30313233435363738394A44`

Password: `404142434445464748494A4B4C4D4E4F50`
