---
title: 'Arm Cortex-M'
---

# ARM Cortex-M

[[toc]]

## Cortex-M Background

## How Does a CPU Start?

## Vector Table

Diagram of Vector Table

Each entry is an address offset from a given start value handling exceptions

VTOR is the offset register for the vector table

The Vector Table knows to execute offsets from that location based on cases (Usage Fault, Hard Fault, etc.)

VTOR can be changed by the application - different memory regions for application and bootloader

Bootloader and Application can handle exceptions differently and independently

VTOR is 0x0 but not always, according to designer modifed by boot rom

The first 16 are fixed system exceptions, and anything above interrupts that are vendor specific

## Boot Flow

At boot the first two vector table values are read and loaded - stack pointer, reset vector

Reset Vector is loaded to program counter - loads the start of application execution in memory

Thread and handler mode?

### Stack Pointer

### Program Counter

### Reset Vector

32-bit CPU - generate 2^32 combinations of signals

## Bootloader

## Bus Matrix

BUS MATRIX DIAGRAM

### Memory Mapped I/O

CPU instructions sent to bus matrix, which has slaves connected for different address ranges

For 0xA80404 - a bus matrix undestands 0xA, and for 0x_4, a bridge will handle narrowing it down, etc.

UART register could be that memory address

MEMORY MAPPED DIAGRAM

Memory has an address, and physical peripheral registers also have addresses

Memory as a signal in a flip flop? Memory can be visualized as a series of flip flops (physical logic)

## Memory Map

Memory Map diagram

Implementation is dictated by ARM (address range)

Code - SRAM - Peripherals - External RAM - External Device - Private Peripheral Bus - Vendor Specific Memory

## Interrupt Handling

Handler is a function that doesn't take any values, pointed to in Vector Table

Some handlers have static offsets (31 for Timer Handler)

Each address is a 4 byte word

void TIMER_Handler()

### Nested Vector Interrupt Controller (NVIC)

Priorities and overriding interrupts - diagram

This triggers handler mode - handler mode can only access the main stack pointer, not system stack

Handlers stores the context of the CPU (zero flag, etc) and return address

Stack pointer shifts to MSP

PC is changed to the interrupt handler address

The stack keeps the relavant context (8 registers) MSP

Once the handler returns, it goes to the return address from MSP and restores context, and restores to PSP stack pointer
G
MSP and PSP? Shadow registers?
