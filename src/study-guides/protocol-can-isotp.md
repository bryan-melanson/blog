---
id: protol-can-isotp
aliases: []
tags:
  - CAN
  - Communication
  - Protocol
  - ISOTP
---

# ISO 15765-2 ISO-TP (Transport Protocol)

<!--toc:start-->

- [ISO 15765-2 ISO-TP (Transport Protocol)](#iso-15765-2-iso-tp-transport-protocol)
  - [Protocol Control Information](#protocol-control-information)
    - [ISO-TP Frame Types](#iso-tp-frame-types)
    - [Padding](#padding)
    - [CAN-TP Header](#can-tp-header)
      - [CAN 2.0A Frame](#can-20a-frame)
      - [ISOTP Data Payload](#isotp-data-payload)
    - [Flow Control](#flow-control)
    - [Sequences](#sequences)
      - [Control Flow Diagram](#control-flow-diagram)
      - [Use Case Example](#use-case-example)
      - [API](#api)
      - [User Shims](#user-shims)
      - [Example Use Case Diagram](#example-use-case-diagram)
      - [Example Use Case Code](#example-use-case-code)
      <!--toc:end-->

[CAN Protocol](protocol-can.md)

Allows for more than 8 bytes of data to be sent over a CAN bus.
Breaks the message into multiple frames with added metadata (CAN-TP Header).

Can carry up to $2^{32}- 1$ bytes of payload.

Most commonly used in diagnostic messages with OBD-2 equipped vehicles.

One or more byte of the 8 byte CAN payload is replaced by metadata,
this is called the _Protocol Control Information_ or PCI, which is
typically 1-3 bytes.

## Protocol Control Information

ISO-TP metadata uses a dynamic size header defined by the first 4 bits of the
header. This Protocol Control Information contains a value declaring the header
to be one of 4 types of PCI headers, as well as the size of the data following
the header.

- Single Frame (SF, first byte is 0x0X)
- First Frame (FF, first byte is 0x1X)
- Consecutive Frame (CF, first byte is 0x2X)
- Flow Control Frame (FC, first byte is 0x3X)

### ISO-TP Frame Types

| Type                   | Code | Description                                                              |
| ---------------------- | ---- | ------------------------------------------------------------------------ |
| Single Frame (SF)      | 0    | A complete payload (7 bytes max)                                         |
| First Frame (FF)       | 1    | Indicates more messages expected, contains the length of the full packet |
| Consecutive Frame (CF) | 2    | Contains the next data                                                   |
| Flow Control Frame     | 3    | The response from the receiver, with [FC Data](#flow-control)            |

### Padding

The data payload in the CAN message can be padded to 8 bytes with arbitrary
values (0xCC, 0xAA, 0x00).

### CAN-TP Header

#### CAN 2.0A Frame

```mermaid
packet-beta
0-1: "SOF"
2-14: "Arbirtation Field"
15-21: "Control Field"
22-30: "Data Field"
31-47: "CRC Field"
48-50: "ACK Field"
51-52: "EOF"
```

#### ISOTP Data Payload

```mermaid
packet-beta
title Single Frame Message
0-3: "ISOTP Size (0-7 bytes)"
4-7: "ISOTP Type (0)"
8-15: "Data (Byte 0)"
16-24: "Data (Byte 1)"
25-33: "Data (Byte 2)"
34-42: "Data (Byte 3)"
43-51: "Data (Byte 4)"
52-60: "Data (Byte 5)"
61-63: "Data (Byte 6)"
```

```mermaid
packet-beta
title First Frame Message
0-3: "ISOTP Size (High byte)"
4-7: "ISOTP Type (1)"
8-15: "ISOTP Size (Low byte)"
16-24: "Data (Byte 0)"
25-33: "Data (Byte 1)"
34-42: "Data (Byte 2)"
43-51: "Data (Byte 3)"
52-60: "Data (Byte 4)"
61-63: "Data (Byte 5)"
```

```mermaid
packet-beta
title Consecutive Frame Message
0-3: "Index (0..15)"
4-7: "ISOTP Type (2)"
8-15: "Data (Byte 0)"
16-24: "Data (Byte 1)"
25-33: "Data (Byte 2)"
34-42: "Data (Byte 3)"
43-51: "Data (Byte 4)"
52-60: "Data (Byte 5)"
61-63: "Data (Byte 6)"
```

```mermaid
packet-beta
title Control Flow Message
0-3: "Flow Control Flag"
4-7: "ISOTP Type (3)"
8-15: "Block Size"
16-24: "ST"
```

### Flow Control

| Bit Offset  | 7..4 (byte 0) | 3..0 (byte 0)                     | 15..8 (byte 1)                                                   | 23..16 (byte 2)                                |
| ----------- | ------------- | --------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------- |
| Description | Type          | If the transfer is allowed        | Block Size                                                       | Separation Time (Minimum Delay Between Frames) |
| Single      | Type = 3      | 0 = Continue, 1 = Wait, 2 = Abort | 0 = "Remaining Frames" to be sent before next FC                 | <= 127ms ST                                    |
| Single      | Type = 3      | 0 = Continue, 1 = Wait, 2 = Abort | > 0 = Send number of frames before waiting for the next FC frame | 100-900ms ST                                   |

FC dictates how many frames to send before expecting another FC frame.

### Sequences

#### Control Flow Diagram

```mermaid
sequenceDiagram
 Sender->>+Receiver: First Frame
 Receiver->>Sender: Flow Control Frame
 Note over Sender: Block Size of 3, ST time of x
 activate Receiver
 Note over Sender: Δt > x µs
 Sender->>Receiver: Consecutive Frame (Block 1)
 Note over Sender: Δt > x µs
 Sender->>Receiver: Consecutive Frame (Block 2)
 Note over Sender: Δt > x µs
 Sender->>Receiver: Consecutive Frame (Block 3)
 deactivate Receiver
 Receiver->>Sender: Flow Control Frame
 Note over Sender: Block Size of 3, ST time of x
 activate Receiver
 Note over Sender: Δt > x µs
 Sender->>Receiver: Consecutive Frame (Block 1)
 Note over Sender: Δt > x µs
 Sender->>Receiver: Consecutive Frame (Block 2)
 Note over Sender: Δt > x µs
 Sender->>Receiver: Consecutive Frame (Block 3)
 deactivate Receiver
```
