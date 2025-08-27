import type Braintree from 'braintree';

export interface BraintreeOptions extends Braintree.ClientGatewayConfig {
  environment: 'production' | 'sandbox' | 'development' | 'qa';
  merchantId: string;
  publicKey: string;
  privateKey: string;
  enable3DSecure: boolean;
  savePaymentMethod: boolean;
  webhookSecret: string;
  autoCapture: boolean;
}

export const PaymentProviderKeys = {
  BRAINTREE: 'braintree',
  IMPORTED: 'imported',
};

export interface CustomFields {
  medusa_payment_session_id?: string;
  cart_id?: string;
  customer_id: string;
}

export interface DecodedClientToken {
  version: number;
  authorizationFingerprint: string;
  configUrl: string;
  graphQL: GraphQl;
  clientApiUrl: string;
  environment: string;
  merchantId: string;
  assetsUrl: string;
  authUrl: string;
  venmo: string;
  challenges: string[];
  threeDSecureEnabled: boolean;
  analytics: Analytics;
  paypalEnabled: boolean;
  paypal: Paypal;
}

export interface GraphQl {
  url: string;
  date: string;
  features: string[];
}

export interface Analytics {
  url: string;
}

export interface Paypal {
  billingAgreementsEnabled: boolean;
  environmentNoNetwork: boolean;
  unvettedMerchant: boolean;
  allowHttp: boolean;
  displayName: string;
  clientId: string;
  baseUrl: string;
  assetsUrl: string;
  directBaseUrl: string;
  environment: string;
  braintreeClientId: string;
  merchantAccountId: string;
  currencyIsoCode: string;
}

export interface DecodedClientTokenAuthorization {
  exp: number;
  jti: string;
  sub: string;
  iss: string;
  merchant: Merchant;
  rights: string[];
  scope: string[];
  options: Options;
}

export interface Merchant {
  public_id: string;
  verify_card_by_default: boolean;
  verify_wallet_by_default: boolean;
}

export interface Options {}
