/**
 * S08 AI First Response — same 3 blocks + ExerciseCard + "Làm ngay — X phút →". Spec: screen-spec-S07-S08.
 * Tap CTA → POST session, redirect to /exercise/{session_id}.
 */

import { useState, useEffect } from 'react';
import { ProtocolBlock, ExerciseCard, PrimaryButton } from '@/design-system';
import { getApiBase, getAuthHeader } from '@/lib/auth';

interface ProtocolData {
  protocol_id: string;
  exercises: Array<{ name_vi: string; duration_sec: number; exercise_id: string }>;
}

export default function S08FirstExercise() {
  const [conditionId, setConditionId] = useState<string | null>(null);
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
    fetch(`${getApiBase()}/api/v1/protocols/current?condition_id=${cid}`, { headers: { Authorization: auth } })
      .then((r) => r.json())
      .then((d) => {
        if (d?.success?.data) setProtocol(d.data);
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
      if (data?.success?.data?.session_id) {
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400 }}>
      <ProtocolBlock variant="fear">
        Pattern này rất phổ biến với người ngồi 8 tiếng — không phải dấu hiệu bệnh nặng.
      </ProtocolBlock>
      <ProtocolBlock variant="insight">
        Đau cải thiện khi vận động đúng hướng — không phải nghỉ nhiều. Bài đầu phù hợp với pattern của bạn.
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
