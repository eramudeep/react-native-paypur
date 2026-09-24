# react-native-paypur

[![npm version](https://img.shields.io/npm/v/react-native-paypur.svg)](https://www.npmjs.com/package/react-native-paypur)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Official React Native SDK for **Paypur** payment gateway.

No paperwork, just sign up. Add your UPI ID, get your gateway keys, and start accepting payments from 100+ UPI apps worldwide directly in your React Native applications.

---

## Features

- ⚡ **Instant Setup**: Initialize with gateway keys in seconds.
- 💳 **100+ UPI Apps Supported**: Seamless UPI payment flows across apps like Google Pay, PhonePe, Paytm, and more.
- 🔍 **Payment Verification**: Verify payment transaction status in real-time.
- 🛡️ **Type-Safe**: Full TypeScript definitions included.

---

## Installation

```sh
npm install react-native-paypur
```

or with Yarn:

```sh
yarn add react-native-paypur
```

or with Bun / pnpm:

```sh
bun add react-native-paypur
# or
pnpm add react-native-paypur
```

---

## Quick Start

### 1. Initialize Paypur

Initialize the SDK early in your application lifecycle (e.g. in your root component or app entry point) using your gateway credentials from the [Paypur Dashboard](https://upi.paypur.in).

```ts
import { Paypur } from 'react-native-paypur';

Paypur.init({
  gatewayKey: 'YOUR_GATEWAY_KEY',
  gatewaySalt: 'YOUR_GATEWAY_SALT',
});
```

### 2. Initiate a Payment

Call `startPayment` with order details and customer information:

```ts
import { Paypur, type PaymentRequest } from 'react-native-paypur';

async function handleCheckout() {
  const paymentRequest: PaymentRequest = {
    orderId: `order_id`,
    amount: '100.00',
    surl: 'https://example.com/payment/success',
    furl: 'https://example.com/payment/failure',
    customer: {
      firstname: 'John Doe',
      email: 'john.doe@example.com',
      phone: '9876543210',
    },
  };

  try {
    const response = await Paypur.startPayment(paymentRequest);
    console.log('Payment initiated successfully:', response);
  } catch (error) {
    console.error('Payment initiation failed:', error);
  }
}
```

### 3. Verify Payment Status

Verify transaction status using the transaction ID:

```ts
async function checkStatus(transactionId: string) {
  try {
    const status = await Paypur.verifyPaymentStatus(transactionId);
    console.log('Payment Status:', status);
  } catch (error) {
    console.error('Error verifying payment status:', error);
  }
}
```

---

## Complete Example

```tsx
import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { Paypur } from 'react-native-paypur';

// Initialize Paypur SDK
Paypur.init({
  gatewayKey: 'YOUR_GATEWAY_KEY',
  gatewaySalt: 'YOUR_GATEWAY_SALT',
});

export default function App() {
  const handlePayment = async () => {
    try {
      await Paypur.startPayment({
        orderId: `order_id`,
        amount: '199.00',
        surl: 'https://your-domain.com/payment/success',
        furl: 'https://your-domain.com/payment/failure',
        customer: {
          firstname: 'Alex',
          email: 'alex@example.com',
          phone: '9876543210',
        },
      });
      Alert.alert('Payment Initialized', 'Processing payment request...');
    } catch (error: any) {
      Alert.alert('Error', error?.message || 'Payment initiation failed');
    }
  };

  const handleVerifyStatus = async () => {
    try {
      const status = await Paypur.verifyPaymentStatus('TXN_ID_HERE');
      Alert.alert('Payment Status', JSON.stringify(status));
    } catch (error: any) {
      Alert.alert('Status Check Failed', error?.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Paypur Checkout</Text>
      <View style={styles.buttonGroup}>
        <Button title="Pay ₹199" onPress={handlePayment} />
        <Button title="Check Status" onPress={handleVerifyStatus} color="#666" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonGroup: {
    gap: 12,
    width: '100%',
    maxWidth: 280,
  },
});
```

---

## API Reference

### `Paypur.init(credentials: Credentials): void`

Configures the SDK with your merchant credentials.

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `credentials.gatewayKey` | `string` | Yes | Your Paypur gateway key. |
| `credentials.gatewaySalt` | `string` | Yes | Your Paypur gateway salt. |

---

### `Paypur.startPayment(paymentRequest: PaymentRequest): Promise<any>`

Initiates a payment request with Paypur gateway.

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `orderId` | `string` | Yes | Unique order identifier. |
| `amount` | `string` | Yes | Amount in INR (e.g. `'100.50'`). |
| `surl` | `string` | Yes | Success callback URL. |
| `furl` | `string` | Yes | Failure callback URL. |
| `customer.firstname` | `string` | Yes | Customer's full/first name. |
| `customer.email` | `string` | Yes | Customer's email address. |
| `customer.phone` | `string` | Yes | Customer's 10-digit phone number. |

---

### `Paypur.verifyPaymentStatus(txnId: string): Promise<any>`

Checks and returns the status of a specific transaction ID.

| Parameter | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `txnId` | `string` | Yes | Transaction ID returned during payment. |

---

### `Paypur.verifyInit(): Credentials | null`

Returns currently loaded credentials or `null` if not yet initialized.

---

### `Paypur.cancelPayment(): void`

Cancels an active payment session.

---

## TypeScript Interfaces

```ts
export interface Credentials {
  gatewayKey: string;
  gatewaySalt: string;
}

export interface Customer {
  firstname: string;
  email: string;
  phone: string;
}

export interface PaymentRequest {
  orderId: string;
  amount: string;
  surl: string;
  furl: string;
  customer: Customer;
}
```

---

## Contributing

- [Development workflow](CONTRIBUTING.md#development-workflow)
- [Sending a pull request](CONTRIBUTING.md#sending-a-pull-request)
- [Code of conduct](CODE_OF_CONDUCT.md)

---

## License

MIT © [Ram Singh](https://github.com/eramudeep)
