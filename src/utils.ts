import APIS from './apiConst';
import type { PaymentRequest } from './types';

export function randomness(): string {
  return Math.random().toString(16).slice(2);
}

export async function fetchPaymentDetails(paymentRequest: PaymentRequest) {
  const { orderId } = paymentRequest;
  try {
    const res = await fetch(APIS.INIT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...paymentRequest,
        orderId: `${orderId}${randomness()}`,
      }),
    });
    if (!res.ok) {
      const result = await res.json();
      throw new Error(
        `Failed to fetch payment details ${JSON.stringify(result)}`
      );
    }
    const json = await res.json();
    return json;
  } catch (error) {
    console.error('Error fetching payment details:', error);
    return { error };
  }
}
export async function checkPaymentStatus(PAYPUR_KEY: string, txnId: string) {
  const url = `${APIS.CHECK_PAYMENT_STATUS}?txn_id=${txnId}`;
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-PAYPUR-KEY': PAYPUR_KEY,
      },
    });
    if (!res.ok) {
      const result = await res.json();
      throw new Error(
        `Failed to check payment status ${JSON.stringify(result)}`
      );
    }
    const json = await res.json();
    return json;
  } catch (error) {
    console.error('Error checking payment status:', error);
    return { error };
  }
}
