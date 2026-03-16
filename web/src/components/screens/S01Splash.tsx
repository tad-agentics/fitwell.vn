/**
 * S01 Splash — design-system PrimaryButtonLG + GhostButton.
 * Redirect to /home if valid session (anonymous or JWT).
 */

import { useEffect } from 'react';
import { PrimaryButtonLG, GhostButton } from '@/design-system';
import { getAuthHeader } from '@/lib/auth';

export default function S01Splash() {
  useEffect(() => {
    if (getAuthHeader()) window.location.href = '/home';
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, width: '100%', maxWidth: 320 }}>
      <PrimaryButtonLG label="Bắt đầu ngay" onClick={() => { window.location.href = '/start'; }} fullWidth />
      <GhostButton label="Đã có tài khoản — đăng nhập" onClick={() => { window.location.href = '/login'; }} />
    </div>
  );
}
