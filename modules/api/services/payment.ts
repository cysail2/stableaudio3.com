import { API_CONFIG, getHeaders, handleApiError } from "./api-core";

export type PaymentProvider = "stripe" | "paypal" | "creem" | "square";

const paymentEndpointByProvider: Record<PaymentProvider, string> = {
  stripe: "stripe",
  paypal: "paypal",
  creem: "creem",
  square: "square",
};

export const paymentApi = {
  createSession: async (priceId: string, provider: PaymentProvider = "stripe") => {
    const endpoint = paymentEndpointByProvider[provider];
    const response = await fetch(`${API_CONFIG.API_BASE}/api/pay/${endpoint}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ price_id: priceId }),
    });
    return handleApiError(response);
  },
};

