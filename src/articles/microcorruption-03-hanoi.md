---
id: study-microcorruption-hanoi
aliases: []
tags:
  - microcorruption
  - hanoi
---

# Microcorruption (Hanoi)

## `<main>`

```assembly
call  #0x4520 <login>
clr   r15
```

## `<login>`

```assembly
; Enter the password, stored at &0x2400
; Store 0x1C in R15 (&0x2410)
call <test_password_valid>
; Test if &0x2410 is 0x1C
; If yes, jump to <unlock_door>
```

## Solution

Write any hex value password with the 0x10 byte == 0x1C: `0x000102030405060708090A0B0C0D0E0F1C`
