---
id: study-microcorruption-reykjavik
aliases: []
tags:
  - microcorruption
  - reykjavik
---

# Microcorruption

[Microcorruption](https://www.microcorruption.com) CTF is a capture the flag (CTF) competition designed to teach low-level reverse engineering by pitting the user against a lock mechanism running on a simulated MSP430 controller. The user exploits MSP430 assembly to gain access to the device and unlock the door.

## Microcorruption (Reykjavik)

- We apologize for making it too easy for the password to be recovered on prior versions. The engineers responsible have been sacked. (`As a consumer, this fills me with confidence.`)

## `<main>`

The `<main>` has a little more going on this time:

```assembly
mov   #0x4520, r14    ; Move address of password prompt to R14
mov   r14, r15
mov   #0xf8, r14      ; An arg for the <enc> function?
mov   #0x2400, r15    ; Another arg for the <enc> function?
call  #0x4486 <enc>
call  #0x2400         ; Calls the 2nd arg?
clr   r15
```

## Weird String

At 0x4472 - `ThisIsSecureRight?`

## Testing input

Spamming super-long input, the input buffer is from 0x43DA-0x43F8. We can keep this range in mind when examining return values to see if we can exploit the flaw seen in the Cusco exercise.

## `<enc>`

A whole lot of fancy encoding that runs before the user inputs the password. This will make the forthcoming sacking all the sweeter.

```assembly
push   r11
push   r10
push   r9
push   r8
clr    r13                    ; Set R13 to 0
mov.b  r13, 0x247c(r13)       ; Move a byte from R13 to R13 + 0x247C
inc    r13                    ; Increase R13 by 1
cmp    #0x100, r13            ; If 0x100 bytes are moved, continue
```

When finished, this creates bytes from 0x00-0xFF and adds them in order to 0x247C-0x257B.

```assembly
mov    #0x247c, r12           ; Save the pointer to the 0x00-0xFF values
clr    r13                    ; Set R13 to 0
mov    r13, r11               ; Move value of R13 to R11
mov.b  @r12, r8               ; Move byte @ 0x247C to R8
mov.b  r8, r10                ; Move value at R8 to R10
add    r10, r13               ; Add R10 to R13
mov    r11, r10               ; Move R11 to R10
and    #0xf, r10              ; And the last 4-bytes of R10
mov.b  0x4472(r10), r10       ; Remember the weird string from before?
```

Stopping to try the `ThisIsSecureRight?` string as a solution here with no luck.

```assembly
clr    r11                    ; Set R11 to 0
mov    r11, r12               ; Move R11 to R12
jmp    $+0x32 <enc+0x86>      ; Jump to `tst r14 below`
inc    r12
and    #0xff, r12
mov    r12, r10               ; Move R12 to R10
add    #0x247c, r10           ; Add 0x247C to R10
mov.b  @r10, r8               ; Move the lower byte at R10 to R8
add.b  r8, r11                ; Add the lower byte of R8 to R11
mov.b  r11, r11               ; No op
mov    r11, r13               ; Move R11 to R13
add    #0x247c, r13
mov.b  @r13, r9               ; Move the lower byte at R13 to R9
mov.b  r8, 0x0(r13)
mov.b  r9, 0x0(r10)
add.b  @r13, r9
mov.b  r9, r13
xor.b  0x247c(r13), 0x0(r15)  ; XOR of lower byte of 0x247C + R13 and R15 (0x2400)
inc    r15                    ; Increase R15
```

Remember in `<main>` where it calls 0x2400? This function runs through the bytes starting at 0x2400 and ungarbles them. After `<enc>` runs it will be readable by assembly so that `<main>` can call it. This means we can use the Microcorruption disassembler to make this section readable after `<enc>` runs. Download the .bin and open it in something like VS Code's Hex Inspector to make it easier to copy it as Hex.

## Disassembly of `0x2400`

```assembly
push  r11
push  r4                     ; R4 (0x43FE) pushed to SP
mov   sp, r4
add   #0x4, r4
add   #0xffe0, sp
mov   #0x4520, r11
jmp   $+0x10
inc   r11
sxt   r15
push  r15
push  #0x0
call  #0x2464
add   #0x4, sp
mov.b @r11, r15
tst.b r15
jnz   $0x12
push  #0xa
push  #0x0
call  #0x2464
add   #0x4, sp
push  #0x1f
mov   #0xffdc, r15
add   r4, r15
push  r15
push  #0x2
call  #0x2464
add   #0x6, sp
cmp   #0xc9f3, -0x24(r4)   ; This checks for 0xC9F3 at R4 - 0x24 (0x43DA)
```

0x43DA is where our password input was stored earlier. Sack this man!

## Solution

The value checked for at 0x43DA in the disassembled code: `0xC9F3`
