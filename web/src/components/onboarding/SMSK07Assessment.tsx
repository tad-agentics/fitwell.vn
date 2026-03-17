/**
 * SMSK07 Assessment Fork — test instruction + RadioRow × 2, CTA "Xác nhận → bài của bạn →". Spec: screen-spec-SMSK07.
 */

import { useState, useEffect } from 'react';
import { RadioRow, PrimaryButton } from '@/design-system';
import { getApiBase, getAuthHeader } from '@/lib/auth';

type Result = 'protocol_a' | 'protocol_b' | null;

const INSTRUCTIONS: Record<string, string> = {
  prone_press_up: 'Thử nằm sấp, thư giãn 2 phút. Lưng cảm thấy thế nào sau đó?',
  thomas_test: 'Nằm ngửa, kéo đầu gối về ngực. Chân còn lại có tự nổi lên không?',
  slump_test: 'Ngồi thẳng, cúi đầu, duỗi chân từ từ. Có tê hoặc lan xuống không?',
};

export default function SMSK07Assessment() {
  const [conditions, setConditions] = useState<Array<{ id: string; display_name_vi: string; assessment_test_slug: string | null }>>([]);
  const [selected, setSelected] = useState<Result>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const auth = getAuthHeader();
    if (!auth) {
      setLoading(false);
      return;
    }
    fetch(`${getApiBase()}/api/v1/conditions`, { headers: { Authorization: auth } })
      .then((r) => r.json())
      .then((d) => {
        if (d?.success && d?.data) {
          const needAssessment = (d.data as Array<{ id: string; display_name_vi: string; assessment_required?: boolean; assessment_test_slug?: string | null }>).filter(
            (c) => c.assessment_required
          );
          setConditions(needAssessment.map((c) => ({ ...c, assessment_test_slug: c.assessment_test_slug ?? 'prone_press_up' })));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const condition = conditions[0];
  const testSlug = condition?.assessment_test_slug ?? 'prone_press_up';
  const instruction = INSTRUCTIONS[testSlug] ?? INSTRUCTIONS.prone_press_up;

  const handleSubmit = async () => {
    if (!selected || !condition) return;
    setSubmitting(true);
    const auth = getAuthHeader();
    if (!auth) return;
    const result = selected === 'protocol_a' ? 'negative' : 'positive';
    try {
      const res = await fetch(`${getApiBase()}/api/v1/conditions/${condition.id}/assessment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: auth },
        body: JSON.stringify({ test_slug: testSlug, result }),
      });
      const data = await res.json();
      if (data?.success) window.location.href = `/first-exercise?condition_id=${condition.id}`;
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p className="text-t2 text-sm p-6">Đang tải...</p>;
  if (conditions.length === 0) {
    window.location.href = '/onboarding/insight';
    return null;
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400 }}>
      <p className="text-t2 text-sm">Trước khi bắt đầu · Một bài test nhỏ</p>
      <p className="text-t1 text-sm font-medium">30 giây — để giao đúng bài cho bạn</p>
      <p className="text-t1 text-sm">{instruction}</p>
      <RadioRow
        label="Nhẹ hơn hoặc không đổi"
        subLabel="→ McKenzie protocol"
        selected={selected === 'protocol_a'}
        onClick={() => setSelected('protocol_a')}
      />
      <RadioRow
        label="Nặng hơn"
        subLabel="→ Lateral shift protocol"
        selected={selected === 'protocol_b'}
        onClick={() => setSelected('protocol_b')}
      />
      <PrimaryButton
        label="Xác nhận → bài của bạn →"
        onClick={handleSubmit}
        disabled={selected == null || submitting}
      />
    </div>
  );
}
