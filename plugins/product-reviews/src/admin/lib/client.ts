import { MedusaPluginsSDK } from '@lambdacurry/medusa-plugins-sdk';
import Medusa from '@medusajs/js-sdk';

declare const __BACKEND_URL__: string | undefined;

export const backendUrl = __BACKEND_URL__ ?? 'http://localhost:9000';

// MedusaPluginsSDK for review operations
export const sdk = new MedusaPluginsSDK({
  baseUrl: backendUrl,
  auth: {
    type: 'session',
  },
});

// Official Medusa SDK for product operations
export const medusa = new Medusa({
  baseUrl: backendUrl,
  auth: {
    type: 'session',
  },
});