/**
 * S04C Condition Confirm — Path A (slugs from session) or Path B (suggest from onboard). Spec: screen-spec-S04C-condition-confirm.md
 */

import { useState, useEffect } from 'react';
import { StepProgressBar, CheckRow, SecondaryButton, PrimaryButton } from '@/design-system';
import { getApiBase, getAnonymousId, setAnonymousId } from '@/lib/auth';

const CONFIRM_SLUGS_KEY = 'fw_confirm_slugs';
const REGION_TO_BODY: Record<string, string> = {
  'Lưng dưới': 'low_back',
  'Cổ vai gáy': 'neck',
  'Đầu gối': 'knee',
  'Bàn chân': 'foot',
  'Vai': 'shoulder',
  'Khuỷu tay': 'elbow',
  'Cổ tay': 'wrist',
  'Hông': 'hip',
};

interface ConditionRow {
  slug: string;
  name_vi: string;
  body_region: string;
}

export default function S04CConfirm() {
  const [conditions, setConditions] = useState<ConditionRow[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [pathB, setPathB] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const slugsRaw = sessionStorage.getItem(CONFIRM_SLUGS_KEY);
    if (slugsRaw) {
      try {
        const slugs = JSON.parse(slugsRaw) as string[];
        if (slugs.length > 0) {
          setPathB(false);
          fetch(`${getApiBase()}/api/v1/msk-conditions?limit=50`)
            .then((r) => r.json())
            .then((d) => {
              if (d.success && d.data) {
                const list = (d.data as ConditionRow[]).filter((c) => slugs.includes(c.slug));
                setConditions(list.slice(0, 5));
                setSelected(new Set(list.slice(0, 5).map((c) => c.slug)));
              }
              setLoading(false);
            })
            .catch(() => setLoading(false));
          return;
        }
      } catch {
        // fall through to Path B
      }
    }
    const regionsRaw = sessionStorage.getItem('fw_onboard_regions');
    if (regionsRaw) {
      try {
        const regions = JSON.parse(regionsRaw) as string[];
        const firstRegion = regions[0];
        const bodyRegion = firstRegion ? REGION_TO_BODY[firstRegion] ?? firstRegion : null;
        setPathB(true);
        fetch(`${getApiBase()}/api/v1/msk-conditions?limit=50`)
          .then((r) => r.json())
          .then((d) => {
            if (d.success && d.data) {
              const list = (d.data as ConditionRow[]).filter(
                (c) => !bodyRegion || c.body_region === bodyRegion
              );
              const trigger = sessionStorage.getItem('fw_onboard_trigger') || 'constant';
              const items = list.slice(0, 3);
              setConditions(items);
              setSelected(new Set(items.map((c) => c.slug)));
            }
            setLoading(false);
          })
          .catch(() => setLoading(false));
        return;
      } catch {
        // ignore
      }
    }
    setLoading(false);
    setError('Không có dữ liệu. Quay lại chọn tình trạng.');
  }, []);

  const handleAdjust = () => {
    if (pathB) window.location.href = '/onboarding/location';
    else window.location.href = '/onboarding/choose';
  };

  const handleContinue = async () => {
    const slugs = [...selected];
    if (slugs.length === 0) return;
    setSubmitting(true);
    setError(null);
    let anonId = getAnonymousId();
    if (!anonId) {
      try {
        const res = await fetch(`${getApiBase()}/api/v1/auth/anonymous/init`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        const data = await res.json();
        if (!data.success || !data.data?.anonymous_id) throw new Error('init failed');
        anonId = data.data.anonymous_id;
        setAnonymousId(anonId);
      } catch {
        setError('Không tạo được phiên làm việc. Kiểm tra kết nối và thử lại.');
        setSubmitting(false);
        return;
      }
    }
    const trigger = sessionStorage.getItem('fw_onboard_trigger') || 'constant';
    const treatmentsRaw = sessionStorage.getItem('fw_onboard_treatments');
    const current_treatments = treatmentsRaw ? (JSON.parse(treatmentsRaw) as string[]) : [];
    const body_regions = (() => {
      const r = sessionStorage.getItem('fw_onboard_regions');
      if (!r) return undefined;
      try {
        return JSON.parse(r) as string[];
      } catch {
        return undefined;
      }
    })();
    let lastConditionId: string | null = null;
    let safetyWarning: { content_vi: string } | null = null;
    for (const slug of slugs) {
      try {
        const body = pathB
          ? { msk_condition_slug: slug, body_regions: body_regions ?? [slug], trigger_pattern: trigger, current_treatments }
          : { msk_condition_slug: slug };
        const res = await fetch(`${getApiBase()}/api/v1/onboarding/intake`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Anonymous ${anonId}`,
          },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (data.success && data.data?.condition_id) {
          lastConditionId = data.data.condition_id;
          if (data.data?.safety_warning?.content_vi) safetyWarning = { content_vi: data.data.safety_warning.content_vi };
        }
      } catch {
        setError('Không lưu được tình trạng. Thử lại.');
        setSubmitting(false);
        return;
      }
    }
    sessionStorage.removeItem(CONFIRM_SLUGS_KEY);
    sessionStorage.removeItem('fw_onboard_regions');
    sessionStorage.removeItem('fw_onboard_trigger');
    sessionStorage.removeItem('fw_onboard_treatments');
    if (safetyWarning) {
      sessionStorage.setItem('fw_safety_warning', JSON.stringify(safetyWarning));
    }
    window.location.href = '/onboarding/insight';
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400 }}>
        <StepProgressBar total={4} current={4} />
        <p className="text-t2 text-sm">Đang xác định tình trạng...</p>
      </div>
    );
  }
  if (error && conditions.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400 }}>
        <StepProgressBar total={4} current={4} />
        <p className="text-t2 text-sm">{error}</p>
        <PrimaryButton label="Quay lại" onClick={() => (pathB ? (window.location.href = '/onboarding/location') : (window.location.href = '/onboarding/choose'))} />
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400 }}>
      <StepProgressBar total={4} current={4} />
      <p className="text-t2 text-sm font-medium">FitWell · nhận diện tình trạng</p>
      <p className="text-t1 text-sm">
        {pathB
          ? `Dựa trên vùng đau + pattern bạn mô tả, FitWell nhận ra ${conditions.length} tình trạng. Đúng không?`
          : 'Tình trạng FitWell nhận ra:'}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {conditions.map((c) => (
          <CheckRow
            key={c.slug}
            label={`${c.name_vi} · ${c.body_region}`}
            checked={selected.has(c.slug)}
            onChange={() => {
              setSelected((prev) => {
                const next = new Set(prev);
                if (next.has(c.slug)) next.delete(c.slug);
                else next.add(c.slug);
                return next;
              });
            }}
          />
        ))}
      </div>
      {error && <p className="text-risk text-sm">{error}</p>}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <SecondaryButton label="Điều chỉnh" onClick={handleAdjust} fullWidth={false} />
        <PrimaryButton
          label={selected.size === 0 ? 'Chọn ít nhất 1 tình trạng' : 'Đúng rồi, tiếp tục →'}
          onClick={handleContinue}
          disabled={selected.size === 0 || submitting}
        />
      </div>
    </div>
  );
}
