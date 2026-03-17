/**
 * S08 AI First Response — same 3 blocks + ExerciseCard + "Làm ngay — X phút →". Spec: screen-spec-S07-S08.
 * Tap CTA → POST session, redirect to /exercise/{session_id}.
 */

import { useState, useEffect } from 'react';
import { ProtocolBlock, ExerciseCard, PrimaryButton } from '@/design-system';
import { getApiBase, getAuthHeader } from '@/lib/auth';

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
}

export default function S08FirstExercise() {
  const [conditionId, setConditionId] = useState<string | null>(null);
  const [mskSlug, setMskSlug] = useState<string | null>(null);
  const [protocol, setProtocol] = useState<ProtocolData | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
    const cid = params.get('condition_id');
    setConditionId(cid);
    if (!cid) {
      setLoading(false);
      return;
    }
    const auth = getAuthHeader();
    if (!auth) {
      setLoading(false);
      return;
    }
    Promise.all([
      fetch(`${getApiBase()}/api/v1/protocols/current?condition_id=${cid}`, { headers: { Authorization: auth } }).then((r) => r.json()),
      fetch(`${getApiBase()}/api/v1/conditions/${cid}`, { headers: { Authorization: auth } }).then((r) => r.json()).catch(() => null),
    ])
      .then(([pd, cd]) => {
        if (pd?.success && pd?.data) setProtocol(pd.data);
        if (cd?.success && cd?.data?.msk_slug) setMskSlug(cd.data.msk_slug);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handlePlay = async () => {
    if (!protocol?.protocol_id || !conditionId) return;
    setStarting(true);
    const auth = getAuthHeader();
    if (!auth) return;
    try {
      const res = await fetch(`${getApiBase()}/api/v1/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: auth },
        body: JSON.stringify({ protocol_id: protocol.protocol_id, source: 'onboarding' }),
      });
      const data = await res.json();
      if (data?.success && data?.data?.session_id) {
        window.location.href = `/exercise?session_id=${encodeURIComponent(data.data.session_id)}`;
      }
    } finally {
      setStarting(false);
    }
  };

  if (loading || !conditionId) return <p className="text-t2 text-sm p-6">Đang tải...</p>;
  if (!protocol) return <p className="text-t1 text-sm p-6">Không tìm thấy bài. Về trang chủ.</p>;
  const firstEx = protocol.exercises?.[0];
  const durationStr = firstEx ? `${Math.round((firstEx.duration_sec || 0) / 60)} phút` : '';
  const copy = INSIGHT_COPY[mskSlug ?? ''] ?? INSIGHT_COPY.default;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400 }}>
      <ProtocolBlock variant="fear">
        {copy.fear}
      </ProtocolBlock>
      <ProtocolBlock variant="insight">
        {copy.insight}
      </ProtocolBlock>
      <ProtocolBlock variant="protocol">
        {firstEx ? `${firstEx.name_vi} · ${durationStr} · Tại nhà` : 'Bài đầu tiên'}
      </ProtocolBlock>
      <ExerciseCard
        name={firstEx?.name_vi ?? 'Bài đầu tiên'}
        duration={durationStr}
        location="Tại nhà"
        thumbnailUrl={null}
        onPlay={handlePlay}
        isLoading={false}
      />
      <PrimaryButton
        label={durationStr ? `Làm ngay — ${durationStr} →` : 'Làm ngay →'}
        onClick={handlePlay}
        disabled={starting}
      />
    </div>
  );
}
