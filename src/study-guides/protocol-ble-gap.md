---
id: protocol-ble-gap
aliases: []
tags:
  - BLE
  - Bluetooth
  - Bluetooth Low Energy
  - GAP
---

# BLE Generic Access Profile

The Generic Access Profile defines how Bluetooth devices find each other,
connect, and interact. It defines the parameters for how the devices
display their presence to one another, establish links once discovered,
pair and authenticate, and their roles when transferring information
after connection.

## GAP Roles

In Bluetooth Low Energy devices can operate as connected devices which
pair and exchange data, or Beacons. In either case, their device roles fall
under **Central** devices and **Peripheral** devices.

### Central vs. Peripheral Devices

Central devices are the user device which is central in the network topology
and can establish connections between multiple Peripheral nodes. Typically
a device such as a computer or mobile device with greater processing power
and memory.

Peripheral devices are low-resource devices in the network which can have
connections established with Central devices. Peripheral devices can only
be connected to a single other device, while the Central device can maintain
connections to multiple Peripheral devices. Each peripheral device fulfills
a service defined by the [GATT](protocol-ble-gatt.md).

### Beacons

Beacons are low-power Bluetooth devices that advertise their data at
regular intervals. The packets contain the device ID, and in their
payload can contain data such as telemetry or URL for the scanner.

These can be used in public scenarios such as retail for sending
notifications to user devices with retail information, as well as
retaining some informatics such as interaction telemetry.

#### Broadcaster vs. Observer

In a Beacon system, the **Broadcaster** is typically the BLE device
advertising its presence and data packet, in a one-way exchange.

The **Observer** is the user device scanning for beacons in the area
and viewing their advertised data. No data is sent from the Observer,
and it will digest the Beacon data.

## Advertising

### Advertising Data

Advertising Data is a mandatory 31 byte payload that is constantly
broadcast to central devices within range to advertise the peripheral
device's existence.

The device will set an advertising interval and broadcast the Advertising
Data periodically. The listening device can scan the advertised device for
an additional payload, the Scan Response Data.

### Scan Response Data

Scan Response Data is an optional 31 byte payload that the peripheral
can deliver when the Central device scans an advertised device within range.
This optional payload can contain additional data to supplement that
advertising data, such as device name, manufacturer, etc.
