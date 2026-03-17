/**
 * S04A Condition Search — Tab "Tên bệnh" / "Mô tả triệu chứng". Multi-select, Xác nhận (n) → S04C.
 * Spec: screen-spec-S04A-condition-search.md
 */

import { useState, useEffect, useMemo } from 'react';
import {
  StepProgressBar,
  TabToggle,
  TextInput,
  TextArea,
  CheckRow,
  PrimaryButton,
  EmptyState,
  ErrorBanner,
  ProtocolBlock,
  TypingIndicator,
} from '@/design-system';
import { getApiBase, getAuthHeader, getAnonymousId, setAnonymousId } from '@/lib/auth';

async function ensureAnonymous(): Promise<string | null> {
  let anon = getAnonymousId();
  if (anon) return anon;
  try {
    const res = await fetch(`${getApiBase()}/api/v1/auth/anonymous/init`, { method: 'POST', headers: { 'Content-Type': 'application/json' } });
    const data = await res.json();
    if (data?.success && data?.data?.anonymous_id) {
      anon = data.data.anonymous_id;
      setAnonymousId(anon);
      return anon;
    }
  } catch {
    // ignore
  }
  return null;
}

const CONFIRM_SLUGS_KEY = 'fw_confirm_slugs';
const MAX_SELECT = 5;

interface MskItem {
  slug: string;
  name_vi: string;
  body_region: string;
}

function groupByRegion(items: MskItem[]): Record<string, MskItem[]> {
  const map: Record<string, MskItem[]> = {};
  for (const item of items) {
    const key = item.body_region || 'Khác';
    if (!map[key]) map[key] = [];
    map[key].push(item);
  }
  return map;
}

export default function S04AConditionSearch() {
  const [tab, setTab] = useState(0);
  const [list, setList] = useState<MskItem[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [tabBSymptom, setTabBSymptom] = useState('');
  const [tabBLoading, setTabBLoading] = useState(false);
  const [tabBSuggestions, setTabBSuggestions] = useState<MskItem[]>([]);
  const [tabBConfidence, setTabBConfidence] = useState(0);
  const [tabBError, setTabBError] = useState<string | null>(null);
  const [tabBEmpty, setTabBEmpty] = useState(false);

  const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const preFill = params.get('q') ?? '';

  useEffect(() => {
    setSearchQuery(preFill);
  }, [preFill]);

  useEffect(() => {
    void ensureAnonymous();
  }, []);
  useEffect(() => {
    fetch(`${getApiBase()}/api/v1/msk-conditions?limit=100`)
      .then((r) => r.json())
      .then((d) => {
        if (d?.success && d.data) setList(d.data);
        setLoadingList(false);
      })
      .catch(() => setLoadingList(false));
  }, []);

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return list;
    const q = searchQuery.trim().toLowerCase();
    return list.filter((c) => c.name_vi.toLowerCase().includes(q) || (c.body_region && c.body_region.toLowerCase().includes(q)));
  }, [list, searchQuery]);

  const grouped = useMemo(() => groupByRegion(filtered), [filtered]);
  const selectedCount = selected.size;
  const overLimit = selectedCount > MAX_SELECT;

  const toggle = (slug: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else if (next.size < MAX_SELECT) next.add(slug);
      return next;
    });
  };

  const handleTabBSearch = async () => {
    const text = tabBSymptom.trim().slice(0, 500);
    if (!text) return;
    setTabBError(null);
    setTabBEmpty(false);
    setTabBLoading(true);
    setTabBSuggestions([]);
    let auth = getAuthHeader();
    if (!auth) {
      const anon = await ensureAnonymous();
      auth = anon ? `Anonymous ${anon}` : null;
    }
    if (!auth) {
      setTabBError('Không tạo được phiên. Thử lại hoặc dùng Tab Tên bệnh.');
      setTabBLoading(false);
      return;
    }
    const minDelay = new Promise((r) => setTimeout(r, 800));
    try {
      const res = await fetch(`${getApiBase()}/api/v1/onboarding/symptom-map`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: auth! },
        body: JSON.stringify({ symptom_text: text }),
      });
      await minDelay;
      const data = await res.json();
      if (!data?.success || !data?.data) {
        setTabBError('Không kết nối được — thử lại hoặc dùng Tab Tên bệnh.');
        setTabBLoading(false);
        return;
      }
      const suggestions = (data.data.suggestions || []) as Array<{ slug: string; name_vi: string; body_region: string; confidence?: number }>;
      const conf = suggestions[0]?.confidence ?? 0;
      setTabBConfidence(conf);
      if (conf >= 0.25 && suggestions.length > 0) {
        const top = suggestions.slice(0, 3);
        setTabBSuggestions(top);
        setSelected((prev) => {
          const next = new Set(prev);
          top.forEach((s) => { if (next.size < MAX_SELECT) next.add(s.slug); });
          return next;
        });
      } else {
        setTabBEmpty(true);
      }
    } catch {
      setTabBError('Không kết nối được — thử lại hoặc dùng Tab Tên bệnh.');
    }
    setTabBLoading(false);
  };

  const handleConfirm = () => {
    if (selectedCount === 0) return;
    const slugs = [...selected];
    try {
      sessionStorage.setItem(CONFIRM_SLUGS_KEY, JSON.stringify(slugs));
    } catch {
      // ignore
    }
    window.location.href = '/onboarding/confirm';
  };

  const tabs = ['Tên bệnh', 'Mô tả triệu chứng'];
  const ctaLabel = selectedCount === 0 ? 'Chọn ít nhất 1 tình trạng' : `Xác nhận (${selectedCount} bệnh) →`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 400 }}>
      <StepProgressBar total={4} current={1} />
      <TabToggle tabs={tabs} activeIndex={tab} onChange={setTab} />

      {tab === 0 && (
        <>
          <TextInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Tìm: 'thoát vị', 'gân', 'đầu gối'..."
          />
          {loadingList && <p className="text-t2 text-sm">Đang tải danh sách...</p>}
          {!loadingList && filtered.length === 0 && (
            <EmptyState
              title="Không tìm thấy"
              message="Thử Tab Mô tả triệu chứng hoặc mô tả bằng tiếng Việt thông thường."
              action={tab === 0 ? { label: 'Chuyển sang Tab Mô tả triệu chứng', onClick: () => setTab(1) } : undefined}
            />
          )}
          {!loadingList && filtered.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {Object.entries(grouped).map(([region, items]) => (
                <div key={region}>
                  <p className="text-t2 text-xs uppercase tracking-wide mb-2" style={{ fontFamily: 'var(--font-mono)', fontSize: 9 }}>
                    {region}
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {items.map((c) => (
                      <CheckRow
                        key={c.slug}
                        label={c.name_vi}
                        checked={selected.has(c.slug)}
                        onChange={() => toggle(c.slug)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
          {overLimit && (
            <p className="text-amber text-xs">FitWell recommend bắt đầu với 1–2 tình trạng để tập trung.</p>
          )}
        </>
      )}

      {tab === 1 && (
        <>
          <TextArea
            value={tabBSymptom}
            onChange={setTabBSymptom}
            placeholder="Ví dụ: lưng đau khi thức dậy, cứng hơn sau ngồi lâu..."
            rows={4}
          />
          <PrimaryButton label="Tìm bệnh phù hợp →" onClick={handleTabBSearch} disabled={!tabBSymptom.trim() || tabBLoading} />
          {tabBLoading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <TypingIndicator />
              <span className="text-t2 text-sm">Đang tìm...</span>
            </div>
          )}
          {tabBError && <ErrorBanner message={tabBError} onRetry={handleTabBSearch} />}
          {tabBEmpty && !tabBLoading && (
            <EmptyState
              title="Không tìm thấy tình trạng phù hợp"
              message="Thử Tab Tên bệnh để duyệt danh sách."
              action={{ label: 'Chuyển sang Tab Tên bệnh', onClick: () => setTab(0) }}
            />
          )}
          {tabBSuggestions.length > 0 && !tabBLoading && tabBConfidence >= 0.25 && (
            <ProtocolBlock variant="insight">
              Khớp với mô tả — chọn bên dưới và xác nhận.
            </ProtocolBlock>
          )}
          {tabBSuggestions.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {tabBSuggestions.map((c) => (
                <CheckRow key={c.slug} label={c.name_vi} checked={selected.has(c.slug)} onChange={() => toggle(c.slug)} />
              ))}
            </div>
          )}
        </>
      )}

      <PrimaryButton label={ctaLabel} onClick={handleConfirm} disabled={selectedCount === 0} />
    </div>
  );
}
