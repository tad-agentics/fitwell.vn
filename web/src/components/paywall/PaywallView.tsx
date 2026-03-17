/**
 * Paywall D7 — trial conversion. L5: create-order, QR/link, poll payment-status.
 */

import { useState, useEffect, useCallback } from 'react';
import { getApiBase, getAuthHeader } from '@/lib/auth';

interface SubscriptionData {
  plan_type: string;
  status: string;
  expires_at: string;
  is_active: boolean;
}

type Step = 'loading' | 'plans' | 'paying' | 'success' | 'cancelled' | 'error' | 'no_auth';

const POLL_INTERVAL_MS = 3000;
const QR_IMAGE_URL = (url: string) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;

export default function PaywallView() {
  const [step, setStep] = useState<Step>('loading');
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [amountVnd, setAmountVnd] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [platform, setPlatform] = useState<'desktop' | 'mobile'>('desktop');

  const base = getApiBase();
  const auth = typeof window !== 'undefined' ? getAuthHeader() : null;

  const fetchSubscription = useCallback(async () => {
    if (!auth) {
      setStep('no_auth');
      return;
    }
    try {
      const res = await fetch(`${base}/api/v1/billing/subscription`, { headers: { Authorization: auth } });
      const data = await res.json();
      if (!res.ok) {
        setStep('error');
        setErrorMessage(data?.message ?? 'Lỗi tải gói.');
        return;
      }
      const sub = data?.data as SubscriptionData | undefined;
      setSubscription(sub ?? null);
      if (sub?.is_active) {
        window.location.href = '/home';
        return;
      }
      setStep('plans');
    } catch {
      setStep('error');
      setErrorMessage('Lỗi kết nối.');
    }
  }, [base, auth]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const success = params.get('success');
    const order = params.get('order');
    const cancel = params.get('cancel');
    if (cancel === '1') {
      setStep('cancelled');
      return;
    }
    if (success === '1' && order) {
      setOrderId(order);
      setStep('paying');
      return;
    }
    setPlatform(/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? 'mobile' : 'desktop');
    fetchSubscription();
  }, [fetchSubscription]);

  useEffect(() => {
    if (step !== 'paying' || !orderId || !auth) return;
    const poll = async () => {
      try {
        const res = await fetch(`${base}/api/v1/billing/payment-status?order_id=${encodeURIComponent(orderId)}`, {
          headers: { Authorization: auth },
        });
        const data = await res.json();
        const status = data?.data?.status;
        if (status === 'confirmed') {
          setStep('success');
          return;
        }
        if (status === 'cancelled' || status === 'expired') {
          setStep('cancelled');
          return;
        }
      } catch {
        // keep polling
      }
    };
    poll();
    const t = setInterval(poll, POLL_INTERVAL_MS);
    return () => clearInterval(t);
  }, [step, orderId, auth, base]);

  const createOrder = async (planType: '6month' | '1year') => {
    if (!auth) {
      setStep('no_auth');
      return;
    }
    setErrorMessage(null);
    setStep('loading');
    try {
      const res = await fetch(`${base}/api/v1/billing/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: auth },
        body: JSON.stringify({ plan_type: planType, platform }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStep('error');
        setErrorMessage(data?.message ?? 'Tạo đơn thất bại.');
        setStep('plans');
        return;
      }
      const d = data?.data as { order_id: string; checkout_url: string; amount_vnd: number };
      setOrderId(d.order_id);
      setCheckoutUrl(d.checkout_url);
      setAmountVnd(d.amount_vnd);
      setStep('paying');
      if (platform === 'mobile') {
        window.open(d.checkout_url, '_blank');
      }
    } catch {
      setStep('error');
      setErrorMessage('Lỗi kết nối.');
      setStep('plans');
    }
  };

  if (step === 'no_auth') {
    return (
      <main className="min-h-screen p-6 bg-bg0 text-t0 flex flex-col justify-center items-center">
        <p className="text-t1 text-sm">Vui lòng đăng nhập để nâng cấp gói.</p>
        <a href="/" className="mt-4 text-sm underline text-accent">Về trang chủ</a>
      </main>
    );
  }

  if (step === 'loading') {
    return (
      <main className="min-h-screen p-6 bg-bg0 text-t0 flex flex-col justify-center items-center">
        <p className="text-t1 text-sm">Đang tải...</p>
      </main>
    );
  }

  if (step === 'error') {
    return (
      <main className="min-h-screen p-6 bg-bg0 text-t0 flex flex-col justify-center">
        <p className="text-red-500 text-sm">{errorMessage}</p>
        <button type="button" onClick={() => { setStep('plans'); setErrorMessage(null); }} className="mt-4 text-sm underline text-accent">
          Thử lại
        </button>
      </main>
    );
  }

  if (step === 'cancelled') {
    return (
      <main className="min-h-screen p-6 bg-bg0 text-t0 flex flex-col justify-center">
        <h1 className="font-display text-lg font-semibold text-t0">Đã hủy thanh toán</h1>
        <p className="mt-2 text-t1 text-sm">Bạn có thể chọn gói và thanh toán lại bất cứ lúc nào.</p>
        <button type="button" onClick={() => { setStep('plans'); setOrderId(null); setCheckoutUrl(null); }} className="mt-6 px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium">
          Chọn gói
        </button>
      </main>
    );
  }

  if (step === 'success') {
    return (
      <main className="min-h-screen p-6 bg-bg0 text-t0 flex flex-col justify-center">
        <h1 className="font-display text-lg font-semibold text-t0">Thanh toán thành công</h1>
        <p className="mt-2 text-t1 text-sm">Gói của bạn đã được kích hoạt.</p>
        <a href="/home" className="mt-6 inline-block px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium text-center">
          Vào trang chủ
        </a>
      </main>
    );
  }

  if (step === 'paying') {
    return (
      <main className="min-h-screen p-6 bg-bg0 text-t0 flex flex-col justify-center">
        <h1 className="font-display text-lg font-semibold text-t0">Hoàn tất thanh toán</h1>
        <p className="mt-2 text-t1 text-sm">
          {platform === 'mobile'
            ? 'Mở link thanh toán trên trình duyệt vừa mở và thanh toán. Trang này sẽ tự cập nhật khi thanh toán xong.'
            : 'Quét mã QR bằng app ngân hàng hoặc mở link bên dưới để thanh toán.'}
        </p>
        {checkoutUrl && platform === 'desktop' && (
          <div className="mt-6 flex flex-col items-center gap-4">
            <img src={QR_IMAGE_URL(checkoutUrl)} alt="QR thanh toán" width={200} height={200} />
            <a href={checkoutUrl} target="_blank" rel="noreferrer" className="text-sm underline text-accent">
              Mở link thanh toán
            </a>
          </div>
        )}
        {amountVnd != null && (
          <p className="mt-4 text-t1 text-sm">Số tiền: {(amountVnd / 1000).toFixed(0)}.000 ₫</p>
        )}
        <p className="mt-4 text-t2 text-xs">Đang kiểm tra trạng thái thanh toán...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 bg-bg0 text-t0 flex flex-col justify-center">
      <h1 className="font-display text-lg font-semibold text-t0">Trial hết hạn</h1>
      <p className="mt-2 text-t1 text-sm">Nâng cấp gói để tiếp tục dùng FitWell.</p>
      <div className="mt-6 flex flex-col gap-4">
        <button
          type="button"
          onClick={() => createOrder('6month')}
          className="w-full px-4 py-3 rounded-lg border border-border bg-bg0 text-t0 text-left"
        >
          <span className="font-medium">Gói 6 tháng</span>
          <span className="block text-sm text-t1">299.000 ₫</span>
        </button>
        <button
          type="button"
          onClick={() => createOrder('1year')}
          className="w-full px-4 py-3 rounded-lg border border-border bg-bg0 text-t0 text-left"
        >
          <span className="font-medium">Gói 1 năm</span>
          <span className="block text-sm text-t1">499.000 ₫</span>
        </button>
      </div>
      {subscription?.expires_at && new Date(subscription.expires_at).getTime() > 0 && (
        <p className="mt-4 text-t2 text-xs">Gói trial hết hạn: {new Date(subscription.expires_at).toLocaleDateString('vi-VN')}</p>
      )}
    </main>
  );
}
