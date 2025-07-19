---
id: study-microcorruption-sydney
aliases: []
tags:
  - microcorruption
  - sydney
---

# Microcorruption (Sydney)

## `main`

```assembly
; call <get_password>
; move stack pointer to r15
; call <check_password>
; if r15 is not zero, success
```

### `get_password`

```assembly
; load r14 = 0x64 (max input length)
; call <getsn> (read string input)
; returns SP buffer
```

#### `getsn`

```assembly
; pushes r14 to stack (size value)
; pushes r15 to stack (buffer pointer)
; pushses #0x2 to stack (<INT> arg)
; calls <INT> with arg #2
; restores stack to original position by adding 6 to value

; with each push stack value grows downward, subtracted by 2
; add is the same as pop 3 times, without returning a value
```

### `check_password`

```assembly
; compare byte 1 of sp to 0x577b
; jump if not zero
; compare byte 2 of sp to 0x605b
; jump if not zero
; compare byte 3 of sp to 0x5862
; jump if not zero
; compare byte 2 of sp to 0x3d77
; jump if not zero
; clear r14
; load r14 to r15
```

## Solution

Enter hex value 0x7B575B606258773D
