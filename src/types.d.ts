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
