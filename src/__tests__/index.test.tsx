import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  jest,
} from '@jest/globals';
import { Paypur } from '../index';
import APIS, { BASE_URI } from '../apiConst';
import { randomness, fetchPaymentDetails, checkPaymentStatus } from '../utils';
import type { Credentials, PaymentRequest } from '../types';

describe('react-native-paypur', () => {
  const mockCredentials: Credentials = {
    gatewayKey: 'test_gateway_key',
    gatewaySalt: 'test_gateway_salt',
  };

  const mockPaymentRequest: PaymentRequest = {
    orderId: 'order_12345',
    amount: '100.00',
    surl: 'https://example.com/success',
    furl: 'https://example.com/failure',
    customer: {
      firstname: 'John Doe',
      email: 'john@example.com',
      phone: '9999999999',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Paypur class', () => {
    it('should export Paypur instance', () => {
      expect(Paypur).toBeDefined();
      expect(typeof Paypur.init).toBe('function');
      expect(typeof Paypur.startPayment).toBe('function');
      expect(typeof Paypur.verifyPaymentStatus).toBe('function');
      expect(typeof Paypur.verifyInit).toBe('function');
      expect(typeof Paypur.cancelPayment).toBe('function');
    });

    it('should correctly initialize and verify credentials', () => {
      Paypur.init(mockCredentials);
      expect(Paypur.verifyInit()).toEqual(mockCredentials);
    });

    it('should throw error when calling startPayment before initialization', async () => {
      // Temporarily set credentials to null via reset
      (Paypur as any).credentials = null;

      await expect(Paypur.startPayment(mockPaymentRequest)).rejects.toThrow(
        'Paypur not initialized'
      );
    });

    it('should throw error when calling verifyPaymentStatus before initialization', async () => {
      (Paypur as any).credentials = null;

      await expect(Paypur.verifyPaymentStatus('txn_123')).rejects.toThrow(
        'Paypur not initialized'
      );
    });

    it('should execute startPayment successfully when initialized', async () => {
      Paypur.init(mockCredentials);

      const mockResponse = { status: 'SUCCESS', message: 'Payment initiated' };
      const originalFetch = global.fetch;
      global.fetch = jest.fn<typeof fetch>().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await expect(
        Paypur.startPayment(mockPaymentRequest)
      ).resolves.toBeUndefined();

      expect(global.fetch).toHaveBeenCalledWith(
        APIS.INIT,
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        })
      );

      global.fetch = originalFetch;
    });

    it('should verify payment status successfully when initialized', async () => {
      Paypur.init(mockCredentials);

      const mockStatusResponse = {
        status: 'SUCCESS',
        txnId: 'txn_123',
        amount: '100.00',
      };
      const originalFetch = global.fetch;
      global.fetch = jest.fn<typeof fetch>().mockResolvedValue({
        ok: true,
        json: async () => mockStatusResponse,
      } as Response);

      const result = await Paypur.verifyPaymentStatus('txn_123');
      expect(result).toEqual(mockStatusResponse);

      expect(global.fetch).toHaveBeenCalledWith(
        `${APIS.CHECK_PAYMENT_STATUS}?txn_id=txn_123`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-PAYPUR-KEY': mockCredentials.gatewayKey,
          },
        }
      );

      global.fetch = originalFetch;
    });

    it('should handle cancelPayment without errors', () => {
      expect(() => Paypur.cancelPayment()).not.toThrow();
    });
  });

  describe('Utils and API constants', () => {
    let originalFetch: typeof fetch;

    beforeEach(() => {
      originalFetch = global.fetch;
    });

    afterEach(() => {
      global.fetch = originalFetch;
    });

    it('should have correct API endpoints', () => {
      expect(BASE_URI).toBe('https://upi.paypur.in');
      expect(APIS.INIT).toBe('https://upi.paypur.in/api/paypur/init');
      expect(APIS.CHECK_PAYMENT_STATUS).toBe(
        'https://upi.paypur.in/api/merchant/status'
      );
    });

    it('randomness should generate a non-empty string', () => {
      const rand1 = randomness();
      const rand2 = randomness();
      expect(typeof rand1).toBe('string');
      expect(rand1.length).toBeGreaterThan(0);
      expect(rand1).not.toBe(rand2);
    });

    it('fetchPaymentDetails should return json on success', async () => {
      const mockSuccessData = { success: true, paymentUrl: 'upi://pay...' };
      global.fetch = jest.fn<typeof fetch>().mockResolvedValue({
        ok: true,
        json: async () => mockSuccessData,
      } as Response);

      const result = await fetchPaymentDetails(mockPaymentRequest);
      expect(result).toEqual(mockSuccessData);
    });

    it('fetchPaymentDetails should catch and return error on HTTP failure', async () => {
      const mockErrorResponse = { error: 'Invalid order amount' };
      global.fetch = jest.fn<typeof fetch>().mockResolvedValue({
        ok: false,
        json: async () => mockErrorResponse,
      } as Response);

      const result = await fetchPaymentDetails(mockPaymentRequest);
      expect(result).toHaveProperty('error');
    });

    it('checkPaymentStatus should return json on success', async () => {
      const mockStatusData = { status: 'COMPLETED', txn_id: 'txn_999' };
      global.fetch = jest.fn<typeof fetch>().mockResolvedValue({
        ok: true,
        json: async () => mockStatusData,
      } as Response);

      const result = await checkPaymentStatus(
        mockCredentials.gatewayKey,
        'txn_999'
      );
      expect(result).toEqual(mockStatusData);
    });

    it('checkPaymentStatus should catch and return error on HTTP failure', async () => {
      const mockErrorResponse = { error: 'Transaction not found' };
      global.fetch = jest.fn<typeof fetch>().mockResolvedValue({
        ok: false,
        json: async () => mockErrorResponse,
      } as Response);

      const result = await checkPaymentStatus(
        mockCredentials.gatewayKey,
        'txn_999'
      );
      expect(result).toHaveProperty('error');
    });
  });
});
