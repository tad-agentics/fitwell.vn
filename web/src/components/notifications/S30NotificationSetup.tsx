/**
 * S30 Notification Permission — Modal/BottomSheet. iOS message, denied fallback. Spec: screen-spec-S30-S12-S13.
 */

import { useState, useEffect } from 'react';
import { ProtocolBlock, PrimaryButton, GhostButton, colors } from '@/design-system';

function isIosSafari(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  return /iPad|iPhone|iPod/.test(ua) || (ua.includes('Mac') && navigator.maxTouchPoints > 1);
}

function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export default function S30NotificationSetup() {
  const [outcome, setOutcome] = useState<'none' | 'granted' | 'denied'>('none');
  const [ios] = useState(() => isIosSafari());
  const [supported] = useState(() => isNotificationSupported());

  useEffect(() => {
    if (outcome !== 'none') {
      const t = setTimeout(() => { window.location.href = '/home'; }, 3000);
      return () => clearTimeout(t);
    }
  }, [outcome]);

  const handleAllow = async () => {
    if (typeof localStorage !== 'undefined') localStorage.setItem('fw_notif_asked', 'true');
    if (ios) {
      setOutcome('granted');
      return;
    }
    if (!supported) {
      setOutcome('denied');
      return;
    }
    try {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') setOutcome('granted');
      else setOutcome('denied');
    } catch {
      setOutcome('denied');
    }
  };

  const handleSkip = () => {
    if (typeof localStorage !== 'undefined') localStorage.setItem('fw_notif_asked', 'skipped');
    window.location.href = '/home';
  };

  if (outcome === 'granted') {
    return (
      <div style={{ position: 'fixed', inset: 0, background: colors.bg0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 50 }}>
        <p style={{ color: colors.teal, fontSize: 14, textAlign: 'center' }}>Đã bật — FitWell sẽ nhắc vào 7 giờ sáng.</p>
      </div>
    );
  }
  if (outcome === 'denied') {
    return (
      <div style={{ position: 'fixed', inset: 0, background: colors.bg0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 50 }}>
        <p style={{ color: colors.t1, fontSize: 14, textAlign: 'center' }}>Bạn có thể bật lại thông báo trong Settings trình duyệt.</p>
      </div>
    );
  }

  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400, background: colors.bg1, borderRadius: 12, border: `1px solid ${colors.border}`, padding: 24 }}>
      <p style={{ fontFamily: "'Figtree', sans-serif", fontSize: 14, fontWeight: 700, color: colors.t0 }}>FitWell nhắc đúng lúc — bài buổi sáng hiệu quả hơn nhiều.</p>
      <ProtocolBlock variant="honest">
        Nhắc nhở đúng thời điểm là lý do app này work. Không phải để bán thêm thứ gì.
      </ProtocolBlock>
      <ul style={{ color: colors.t1, fontSize: 14, listStyle: 'disc', paddingLeft: 20, margin: 0 }}>
        <li>Sáng — trước khi đặt chân xuống sàn</li>
        <li>Chiều — sau cuộc họp dài</li>
      </ul>
      <p style={{ color: colors.t2, fontSize: 14 }}>Tối đa 2 thông báo / ngày</p>
      {ios ? (
        <>
          <p style={{ color: colors.t1, fontSize: 14 }}>Trên iPhone: mở FitWell mỗi ngày — thông báo sẽ xuất hiện khi app đang mở.</p>
          <PrimaryButton label="Đồng ý" onClick={handleAllow} />
        </>
      ) : !supported ? (
        <p style={{ color: colors.t1, fontSize: 14 }}>Trình duyệt của bạn chưa hỗ trợ thông báo. Mở FitWell mỗi sáng để không bỏ bài.</p>
      ) : (
        <PrimaryButton label="Đồng ý — bật thông báo" onClick={handleAllow} />
      )}
      <GhostButton label="Để sau — tôi tự nhớ mở app" onClick={handleSkip} fullWidth />
    </div>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, zIndex: 50 }}>
      {content}
    </div>
  );
}
