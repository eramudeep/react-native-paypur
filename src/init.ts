import { type Credentials, type PaymentRequest } from './types';
import { fetchPaymentDetails, checkPaymentStatus } from './utils';

class Paypur {
  private credentials: Credentials | null = null;

  /**
   * @description initlise the payment gateway
   * @param credentials
   */
  public init(credentials: Credentials): void {
    this.credentials = credentials;
  }

  /**
   * @description start payment
   * @param paymentRequest
   */
  public async startPayment(paymentRequest: PaymentRequest): Promise<void> {
    if (!this.credentials) {
      throw new Error('Paypur not initialized');
    }
    const res = await fetchPaymentDetails(paymentRequest);
    console.log('res', res);
  }

  /**
   * @description cancel payment
   * @param paymentRequest
   */
  public cancelPayment(): void {}
  /**
   * @description verify payment gateway initialization
   * @returns
   */
  public verifyInit() {
    return this.credentials;
  }
  /**
   * @description verify payment status
   * @par am txnId  Transaction Id
   * @returns
   */
  public async verifyPaymentStatus(txnId: string) {
    if (!this.credentials) {
      throw new Error('Paypur not initialized');
    }
    return checkPaymentStatus(this.credentials.gatewayKey, txnId);
  }
}

export default new Paypur();
