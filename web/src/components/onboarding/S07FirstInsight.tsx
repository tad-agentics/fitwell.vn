/**
 * S07 First Insight — 3 CP blocks + CTA "Bài đầu tiên →". Spec: screen-spec-S07-S08-first-insight-response.md
 * No back. Exits to SMSK07 assessment or S08 first-exercise.
 */

import { useState, useEffect } from 'react';
import { StepProgressBar, ProtocolBlock, PrimaryButton, colors } from '@/design-system';
import { getApiBase, getAuthHeader } from '@/lib/auth';
import SMSK08SafetyWarning from './SMSK08SafetyWarning';

interface Condition {
  id: string;
  display_name_vi: string;
  assessment_required?: boolean;
}

interface ProtocolData {
  protocol_id: string;
  exercises: Array<{ name_vi: string; duration_sec: number; exercise_id: string }>;
  total_duration: number;
}

export default function S07FirstInsight() {
  const [loading, setLoading] = useState(true);
  const [condition, setCondition] = useState<Condition | null>(null);
  const [protocol, setProtocol] = useState<ProtocolData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [safetyWarning, setSafetyWarning] = useState<{ title: string; content_vi: string } | null>(null);

  useEffect(() => {
    try {
      const raw = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('fw_safety_warning') : null;
      if (raw) {
        const w = JSON.parse(raw) as { content_vi: string };
        setSafetyWarning({ title: 'Lưu ý trước khi bắt đầu', content_vi: w.content_vi });
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const auth = getAuthHeader();
    if (!auth) {
      setLoading(false);
      setError('Phiên hết hạn. Bắt đầu lại từ đầu.');
      return;
    }
    fetch(`${getApiBase()}/api/v1/conditions`, { headers: { Authorization: auth } })
      .then((r) => r.json())
      .then((d) => {
        if (!d.success || !d.data?.length) {
          setLoading(false);
          return;
        }
        const first = d.data[0];
        setCondition(first);
        return fetch(`${getApiBase()}/api/v1/protocols/current?condition_id=${first.id}`, { headers: { Authorization: auth } });
      })
      .then((r) => (r && r.ok ? r.json() : null))
      .then((d) => {
        if (d?.success?.data) setProtocol(d.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleNext = () => {
    if (!condition) return;
    if (condition.assessment_required) {
      window.location.href = '/onboarding/assessment';
      return;
    }
    window.location.href = `/first-exercise?condition_id=${condition.id}`;
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400 }}>
        <StepProgressBar total={4} current={4} />
        <div style={{ height: 60, background: colors.bg2, borderRadius: 8, animation: 'pulse 1.5s ease-in-out infinite' }} />
        <div style={{ height: 60, background: colors.bg2, borderRadius: 8, animation: 'pulse 1.5s ease-in-out infinite' }} />
        <div style={{ height: 60, background: colors.bg2, borderRadius: 8, animation: 'pulse 1.5s ease-in-out infinite' }} />
      </div>
    );
  }
  if (safetyWarning) {
    return (
      <SMSK08SafetyWarning
        title={safetyWarning.title}
        body={safetyWarning.content_vi}
        onAck={() => {
          try {
            sessionStorage.removeItem('fw_safety_warning');
          } catch {
            // ignore
          }
          setSafetyWarning(null);
        }}
      />
    );
  }
  if (error || !condition) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400 }}>
        <p className="text-t1 text-sm">{error ?? 'Không tìm thấy tình trạng.'}</p>
        <PrimaryButton label="Về trang chủ" onClick={() => (window.location.href = '/home')} />
      </div>
    );
  }
  const firstEx = protocol?.exercises?.[0];
  const durationStr = firstEx ? `${Math.round((firstEx.duration_sec || 0) / 60)} phút` : '—';
  const locationStr = 'Tại nhà';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400 }}>
      <StepProgressBar total={4} current={4} />
      <ProtocolBlock variant="fear">
        Pattern này rất phổ biến với người ngồi 8 tiếng — không phải dấu hiệu bệnh nặng.
      </ProtocolBlock>
      <ProtocolBlock variant="insight">
        Đau cải thiện khi vận động đúng hướng — không phải nghỉ nhiều. Bài đầu phù hợp với pattern của bạn.
      </ProtocolBlock>
      <ProtocolBlock variant="protocol">
        {firstEx ? `${firstEx.name_vi} · ${durationStr} · ${locationStr}` : 'Bài đầu tiên'}
      </ProtocolBlock>
      <PrimaryButton label="Bài đầu tiên →" onClick={handleNext} />
    </div>
  );
}
