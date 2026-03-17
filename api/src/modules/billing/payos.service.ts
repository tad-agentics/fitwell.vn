/**
 * PayOS API — create payment link, get link info. R-C1.
 * Docs: https://payos.vn/docs/api/ (v2/payment-requests)
 */

import crypto from 'crypto';

const PAYOS_BASE = 'https://api-merchant.payos.vn';

function getConfig(): { clientId: string; apiKey: string; checksumKey: string } | null {
  const clientId = process.env.PAYOS_CLIENT_ID;
  const apiKey = process.env.PAYOS_API_KEY;
  const checksumKey = process.env.PAYOS_CHECKSUM_KEY;
  if (!clientId || !apiKey || !checksumKey) return null;
  return { clientId, apiKey, checksumKey };
}

function createSignature(checksumKey: string, data: string): string {
  return crypto.createHmac('sha256', checksumKey).update(data).digest('hex');
}

export interface CreateOrderParams {
  orderCode: number;
  amount: number;
  description: string;
  returnUrl: string;
  cancelUrl: string;
  expiredAt?: number;
}

export interface CreateOrderResult {
  orderCode: number;
  checkoutUrl: string;
  qrCode: string;
  paymentLinkId: string;
  amount: number;
  status: string;
}

export async function createPaymentLink(params: CreateOrderParams): Promise<CreateOrderResult | null> {
  const config = getConfig();
  if (!config) return null;

  const { orderCode, amount, description, returnUrl, cancelUrl, expiredAt } = params;
  const exp = expiredAt ?? Math.floor(Date.now() / 1000) + 15 * 60; // 15 min default

  const dataStr = `amount=${amount}&cancelUrl=${cancelUrl}&description=${description}&orderCode=${orderCode}&returnUrl=${returnUrl}`;
  const signature = createSignature(config.checksumKey, dataStr);

  const body = {
    orderCode,
    amount,
    description: description.slice(0, 255),
    returnUrl,
    cancelUrl,
    expiredAt: exp,
    signature,
  };

  const res = await fetch(`${PAYOS_BASE}/v2/payment-requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-client-id': config.clientId,
      'x-api-key': config.apiKey,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) return null;
  const json = (await res.json()) as { code?: string; data?: { orderCode: number; checkoutUrl: string; qrCode: string; paymentLinkId: string; amount: number; status: string } };
  if (json.code !== '00' || !json.data) return null;
  const d = json.data;
  return {
    orderCode: d.orderCode,
    checkoutUrl: d.checkoutUrl,
    qrCode: d.qrCode,
    paymentLinkId: d.paymentLinkId,
    amount: d.amount,
    status: d.status,
  };
}

export async function getPaymentLinkInfo(orderCodeOrLinkId: string | number): Promise<{ status: string; orderCode?: number } | null> {
  const config = getConfig();
  if (!config) return null;

  const res = await fetch(`${PAYOS_BASE}/v2/payment-requests/${encodeURIComponent(String(orderCodeOrLinkId))}`, {
    headers: {
      'x-client-id': config.clientId,
      'x-api-key': config.apiKey,
    },
  });

  if (!res.ok) return null;
  const json = (await res.json()) as { code?: string; data?: { status: string; orderCode?: number } };
  if (json.code !== '00' || !json.data) return null;
  return { status: json.data.status, orderCode: json.data.orderCode };
}

/** Verify webhook payload signature. PayOS sends code, desc, success, data, signature. Signature is over data object only (sorted keys). */
export function verifyWebhookSignature(payload: { data?: Record<string, unknown>; signature?: string }): boolean {
  const config = getConfig();
  if (!config || !payload.signature || !payload.data) return false;
  const sorted = Object.keys(payload.data)
    .sort()
    .reduce((acc: Record<string, unknown>, k) => {
      acc[k] = payload.data![k];
      return acc;
    }, {});
  const parts = Object.keys(sorted).map((key) => {
    let val = sorted[key];
    if (val === null || val === undefined || val === 'null' || val === 'undefined') val = '';
    if (Array.isArray(val)) val = JSON.stringify(val.map((v) => (typeof v === 'object' && v !== null ? Object.keys(v).sort().reduce((o, k) => ({ ...o, [k]: (v as Record<string, unknown>)[k] }), {}) : v)));
    return `${key}=${val}`;
  });
  const dataStr = parts.join('&');
  const expected = createSignature(config.checksumKey, dataStr);
  return payload.signature === expected;
}
