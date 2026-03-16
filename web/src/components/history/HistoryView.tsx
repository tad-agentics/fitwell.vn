/**
 * S16 History — calendar 30 days, pain shading, stats row. Day tap → tooltip (pain + session). Spec: screen-spec-S14-S15-S16-S17.
 */

import { useState, useEffect } from 'react';
import { StatTile, typography } from '@/design-system';
import { getApiBase, getAuthHeader } from '@/lib/auth';
import { colors } from '@/design-system';

interface DayItem {
  date: string;
  pain_score: number | null;
  session_completed: boolean;
}

interface CalendarData {
  days: DayItem[];
  stats: { sessions_completed: number; checkins_total: number; days_low_pain: number };
}

export default function HistoryView() {
  const [data, setData] = useState<CalendarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [conditionId, setConditionId] = useState<string | null>(null);
  const [tooltipDay, setTooltipDay] = useState<DayItem | null>(null);

  useEffect(() => {
    const auth = getAuthHeader();
    if (!auth) {
      setLoading(false);
      return;
    }
    const base = getApiBase();
    fetch(`${base}/api/v1/conditions`, { headers: { Authorization: auth } })
      .then((r) => r.json())
      .then((d) => {
        const cid = d?.success?.data?.[0]?.id ?? null;
        setConditionId(cid);
        const q = cid ? `?condition_id=${cid}` : '';
        return fetch(`${base}/api/v1/progress/calendar${q}`, { headers: { Authorization: auth } });
      })
      .then((r) => (r?.ok ? r.json() : null))
      .then((d) => {
        if (d?.success?.data) setData(d.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (!getAuthHeader()) {
    return <p className="mt-4 text-t1 text-sm">Đăng nhập để xem lịch sử.</p>;
  }
  if (loading) {
    return (
      <div className="mt-4 space-y-4">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {Array.from({ length: 35 }, (_, i) => (
            <div key={i} className="bg-bg2 rounded animate-pulse" style={{ aspectRatio: '1', maxHeight: 36 }} />
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-bg2 rounded h-16 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }
  if (!data) {
    return <p className="mt-4 text-t1 text-sm">Không tải được lịch sử. Kéo để thử lại.</p>;
  }

  const monthLabel = new Date().toLocaleDateString('vi-VN', { month: 'long' });
  const painOpacity = (score: number) => 0.17 + (score / 5) * 0.6;

  const handleDayClick = (day: DayItem) => {
    setTooltipDay((prev) => (prev?.date === day.date ? null : day));
  };

  const formatTooltipDate = (dateStr: string) => {
    const [y, m, day] = dateStr.split('-').map(Number);
    const d = new Date(y, (m ?? 1) - 1, day ?? 1);
    return d.toLocaleDateString('vi-VN', { day: 'numeric', month: 'numeric' });
  };

  return (
    <div className="mt-4 space-y-4" style={{ maxWidth: 400 }}>
      <p className="text-t2 text-sm" style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
        Tháng {monthLabel}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {data.days.map((day) => (
          <div
            key={day.date}
            role="button"
            tabIndex={0}
            onClick={() => handleDayClick(day)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleDayClick(day); } }}
            title={day.pain_score != null ? `Điểm đau: ${day.pain_score}${day.session_completed ? ' · Đã làm bài' : ''}` : day.session_completed ? 'Đã làm bài' : ''}
            style={{
              aspectRatio: '1',
              maxHeight: 36,
              background: day.pain_score != null ? `rgba(0,0,0,${painOpacity(day.pain_score)})` : colors.bg1,
              border: `1px solid ${tooltipDay?.date === day.date ? colors.teal : colors.border}`,
              borderRadius: 4,
              cursor: 'pointer',
            }}
          />
        ))}
      </div>
      {tooltipDay && (
        <div
          style={{
            padding: '10px 12px',
            background: colors.bg2,
            border: `1px solid ${colors.border}`,
            borderRadius: 8,
            fontFamily: typography.fontPrimary,
            fontSize: typography.size12,
            color: colors.t1,
          }}
        >
          <span style={{ color: colors.t2 }}>Ngày {formatTooltipDate(tooltipDay.date)}</span>
          {tooltipDay.pain_score != null && (
            <span> · Điểm đau: {tooltipDay.pain_score}</span>
          )}
          {tooltipDay.session_completed ? ' · Đã làm bài' : ' · Chưa làm bài'}
        </div>
      )}
      <div style={{ display: 'flex', gap: 6, fontSize: 9, color: colors.t2, fontFamily: 'var(--font-mono)' }}>
        <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
        <span style={{ marginLeft: 8 }}>← Điểm đau</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        <StatTile value={String(data.stats.sessions_completed)} label="Bài hoàn thành" />
        <StatTile value={String(data.stats.checkins_total)} label="Check-in" />
        <StatTile value={String(data.stats.days_low_pain)} label="Điểm 1–2" />
      </div>
    </div>
  );
}
