/**
 * S10 Post-Exercise — acknowledgment, feedback chips, NextDayCard (real next exercise), notification CTA. Spec: screen-spec-S09-S10.
 */

import { useState, useEffect } from 'react';
import { ProtocolBlock, PrimaryButton, GhostButton, Icons, colors, typography, radius } from '@/design-system';
import { getApiBase, getAuthHeader } from '@/lib/auth';

interface S10PostExerciseProps {
  sessionId?: string;
}

const CHIP_LABELS: Record<'better' | 'same' | 'worse', string> = {
  better: 'Nhẹ hơn',
  same: 'Như cũ',
  worse: 'Nặng hơn',
};

export default function S10PostExercise({ sessionId: propSessionId }: S10PostExerciseProps) {
  const sessionId = propSessionId ?? (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('session_id') : null) ?? '';
  const [feedback, setFeedback] = useState<'better' | 'same' | 'worse' | null>(null);
  const [nextExercise, setNextExercise] = useState<{ name_vi: string; duration_sec: number; location?: string } | null>(null);
  const [conditionName, setConditionName] = useState<string>('lưng');

  useEffect(() => {
    const auth = getAuthHeader();
    if (!auth) return;
    const base = getApiBase();
    fetch(`${base}/api/v1/conditions`, { headers: { Authorization: auth } })
      .then((r) => r.json())
      .then((d) => {
        if (d?.success?.data?.[0]) {
          const first = d.data[0];
          if (first.display_name_vi) setConditionName(first.display_name_vi);
          const cid = first.id;
          if (cid) {
            return fetch(`${base}/api/v1/protocols/current?condition_id=${encodeURIComponent(cid)}`, { headers: { Authorization: auth } });
          }
        }
      })
      .then((r) => (r && r.ok ? r.json() : null))
      .then((d) => {
        const ex = d?.success?.data?.exercises?.[0];
        if (ex?.name_vi != null) {
          setNextExercise({
            name_vi: ex.name_vi,
            duration_sec: ex.duration_sec ?? 0,
            location: 'Tại nhà',
          });
        }
      })
      .catch(() => {});
  }, []);

  const [completedSent, setCompletedSent] = useState(false);
  const handleFeedback = async (value: 'better' | 'same' | 'worse') => {
    setFeedback(value);
    const auth = getAuthHeader();
    if (!auth || completedSent) return;
    await fetch(`${getApiBase()}/api/v1/sessions/${sessionId}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: auth },
      body: JSON.stringify({ completion_pct: 100, feedback: value }),
    });
    setCompletedSent(true);
  };

  const ensureComplete = async () => {
    if (completedSent) return;
    const auth = getAuthHeader();
    if (!auth) return;
    await fetch(`${getApiBase()}/api/v1/sessions/${sessionId}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: auth },
      body: JSON.stringify({ completion_pct: 100, feedback: feedback ?? 'same' }),
    });
    setCompletedSent(true);
  };

  const handleNotif = async () => {
    await ensureComplete();
    window.location.href = '/notifications/setup';
  };

  const handleSkip = async () => {
    await ensureComplete();
    if (typeof localStorage !== 'undefined') localStorage.setItem('fw_notif_asked', 'skipped');
    window.location.href = '/home';
  };

  const alreadyAsked = typeof localStorage !== 'undefined' && localStorage.getItem('fw_notif_asked');

  useEffect(() => {
    if (!alreadyAsked) return;
    const t = setTimeout(() => { window.location.href = '/home'; }, 3000);
    return () => clearTimeout(t);
  }, [alreadyAsked]);

  if (!sessionId) {
    return (
      <p style={{ color: colors.t2, fontSize: typography.size12 }}>
        Không tìm thấy phiên. Về <a href="/home" style={{ color: colors.teal }}>trang chủ</a>.
      </p>
    );
  }

  const durationLabel = nextExercise?.duration_sec
    ? `${Math.round(nextExercise.duration_sec / 60)} phút`
    : '';
  const nextLine = nextExercise
    ? [nextExercise.name_vi, durationLabel, nextExercise.location ?? 'Tại nhà'].filter(Boolean).join(' · ')
    : 'Bài mới ngày mai — FitWell sẽ chuẩn bị';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: '50%',
            border: `2px solid ${colors.teal}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: colors.teal,
          }}
        >
          <Icons.Check />
        </div>
        <ProtocolBlock variant="dry">Xong rồi — đúng hướng đấy.</ProtocolBlock>
      </div>
      <p style={{ fontFamily: typography.fontPrimary, fontSize: typography.size14, color: colors.t1 }}>
        Sau khi làm xong, {conditionName} thấy thế nào?
      </p>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {(['better', 'same', 'worse'] as const).map((v) => (
          <button
            key={v}
            type="button"
            onClick={() => handleFeedback(v)}
            style={{
              padding: '10px 16px',
              borderRadius: radius.r8,
              border: `1.5px solid ${feedback === v ? colors.teal : colors.border}`,
              background: feedback === v ? colors.tealBg : colors.bg2,
              color: feedback === v ? colors.teal : colors.t1,
              fontFamily: typography.fontPrimary,
              fontSize: typography.size14,
              cursor: 'pointer',
            }}
          >
            {CHIP_LABELS[v]}
          </button>
        ))}
      </div>
      <div>
        <p style={{ fontFamily: typography.fontMono, fontSize: typography.size09, color: colors.t2, marginBottom: 6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          Ngày mai
        </p>
        <p style={{ fontFamily: typography.fontPrimary, fontSize: typography.size13, color: colors.t1 }}>
          {nextLine}
        </p>
      </div>
      {alreadyAsked ? (
        <p style={{ fontFamily: typography.fontPrimary, fontSize: typography.size12, color: colors.t2 }}>
          Nhắc đã bật — FitWell sẽ nhắc vào 7 giờ sáng. Về trang chủ sau 3 giây...
        </p>
      ) : (
        <>
          <PrimaryButton label="Bật nhắc sáng — 7am" onClick={handleNotif} />
          <GhostButton label="Để sau" onClick={handleSkip} fullWidth />
        </>
      )}
    </div>
  );
}
