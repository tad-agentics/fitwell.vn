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
  msk_slug?: string;
  pain_track?: string;
  show_safety_warning?: boolean;
  safety_warning?: { content_vi: string; show_once?: boolean } | null;
}

const INSIGHT_COPY: Record<string, { fear: string; insight: string }> = {
  lumbar_disc: {
    fear: 'Pattern này rất phổ biến với người ngồi 8 tiếng — không phải dấu hiệu bệnh nặng.',
    insight: 'Đau cải thiện khi vận động đúng hướng — không phải nghỉ nhiều. Bài đầu phù hợp với pattern của bạn.',
  },
  neck_pain: {
    fear: 'Pattern này rất phổ biến với người làm việc màn hình — không phải dấu hiệu bệnh nặng.',
    insight: 'Cổ phục hồi tốt với bài nhẹ đúng cách — không phải nghỉ ngơi hoàn toàn.',
  },
  frozen_shoulder: {
    fear: 'Frozen shoulder thường gặp — không phải vĩnh viễn.',
    insight: 'Giai đoạn đầu: không kéo căng mạnh. Bài nhẹ giúp giảm viêm và duy trì range of motion.',
  },
  rotator_cuff: {
    fear: 'Đau vai khi giơ tay — rất phổ biến, không phải rách hoàn toàn.',
    insight: 'Cơ vòng bít cần tập lại sau đau. Bài nhẹ giúp phục hồi chức năng vai.',
  },
  knee_osteoarthritis: {
    fear: 'Đau khớp gối khi vận động rất phổ biến — không có nghĩa là phải nghỉ hẳn.',
    insight: 'Cơ đùi khỏe giúp giảm tải khớp. Bài nhẹ mỗi ngày hiệu quả hơn nghỉ ngơi.',
  },
  plantar_fasciitis: {
    fear: 'Đau gót chân buổi sáng rất phổ biến — không phải rách gân.',
    insight: 'Bước đầu cần giảm tải, không phải dừng đứng. Bài ngắn đúng kỹ thuật sẽ giảm đau.',
  },
  achilles_tendinopathy: {
    fear: 'Gân Achilles đau khi hoạt động — không cần nghỉ hoàn toàn.',
    insight: 'Gân cần tải có kiểm soát để phục hồi. Bài eccentric đúng cách là hiệu quả nhất.',
  },
  default: {
    fear: 'Pattern này rất phổ biến — không phải dấu hiệu bệnh nặng.',
    insight: 'Đau cải thiện khi vận động đúng hướng — không phải nghỉ nhiều. Bài đầu phù hợp với pattern của bạn.',
  },
};

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
        const first = d.data[0] as Condition;
        setCondition(first);
        if (first.show_safety_warning) {
          let content = first.safety_warning?.content_vi ?? null;
          if (!content && typeof sessionStorage !== 'undefined') {
            try {
              const raw = sessionStorage.getItem('fw_safety_warning');
              if (raw) content = (JSON.parse(raw) as { content_vi: string }).content_vi;
            } catch { /* ignore */ }
          }
          if (content) setSafetyWarning({ title: 'Lưu ý trước khi bắt đầu', content_vi: content });
        }
        return fetch(`${getApiBase()}/api/v1/protocols/current?condition_id=${first.id}`, { headers: { Authorization: auth } });
      })
      .then((r) => (r && r.ok ? r.json() : null))
      .then((d) => {
        if (d?.success && d?.data) setProtocol(d.data);
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
  if (safetyWarning && condition) {
    return (
      <SMSK08SafetyWarning
        title={safetyWarning.title}
        body={safetyWarning.content_vi}
        onAck={() => {
          const auth = getAuthHeader();
          if (auth) {
            fetch(`${getApiBase()}/api/v1/conditions/${condition.id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json', Authorization: auth },
              body: JSON.stringify({ safety_warning_acknowledged: true }),
            }).catch(() => {});
          }
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
  const copy = INSIGHT_COPY[condition.msk_slug ?? ''] ?? INSIGHT_COPY.default;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400 }}>
      <StepProgressBar total={4} current={4} />
      <ProtocolBlock variant="fear">
        {copy.fear}
      </ProtocolBlock>
      <ProtocolBlock variant="insight">
        {copy.insight}
      </ProtocolBlock>
      <ProtocolBlock variant="protocol">
        {firstEx ? `${firstEx.name_vi} · ${durationStr} · ${locationStr}` : 'Bài đầu tiên'}
      </ProtocolBlock>
      <PrimaryButton label="Bài đầu tiên →" onClick={handleNext} />
    </div>
  );
}
