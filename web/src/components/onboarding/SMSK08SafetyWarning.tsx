/**
 * SMSK08 Safety Warning — BottomSheet modal. One CTA "Đã hiểu — tiếp tục". Spec: screen-spec-SMSK08.
 */

import { PrimaryButton } from '@/design-system';

interface SMSK08SafetyWarningProps {
  title: string;
  body: string;
  onAck: () => void;
}

export default function SMSK08SafetyWarning({ title, body, onAck }: SMSK08SafetyWarningProps) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 100,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          background: '#1E1E1A',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          padding: 24,
          paddingBottom: 32,
        }}
      >
        <h2 className="font-display text-sm font-semibold text-t0" style={{ marginBottom: 12 }}>
          {title}
        </h2>
        <p className="text-t1 text-sm" style={{ marginBottom: 24 }}>
          {body}
        </p>
        <PrimaryButton label="Đã hiểu — tiếp tục" onClick={onAck} />
      </div>
    </div>
  );
}
