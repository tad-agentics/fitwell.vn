/**
 * S17 Progress — PainChart, delta label, stats 2×2, consistency. Spec: screen-spec-S14-S15-S16-S17.
 */

import { useState, useEffect, useCallback } from 'react';
import { PainChart, ConsistencyDotGrid, StatTile, ProtocolBlock, SkeletonBlock, PrimaryButton } from '@/design-system';
import { getApiBase, getAuthHeader } from '@/lib/auth';
import { colors } from '@/design-system';

interface Stats {
  sessions_completed: number;
  checkins_total: number;
  days_low_pain: number;
  consistency_pct: number;
  avg_pain: number | null;
}

interface CalendarDay {
  date: string;
  pain_score: number | null;
  session_completed: boolean;
}

export default function ProgressView() {
  const [chartData, setChartData] = useState<Array<{ day: string; score: number }>>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [patternObservation, setPatternObservation] = useState<{ description_vi: string; is_first_pattern: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [conditionId, setConditionId] = useState<string | null>(null);

  const loadData = useCallback(() => {
    const auth = getAuthHeader();
    if (!auth) {
      setLoading(false);
      return;
    }
    setError(null);
    setLoading(true);
    const base = getApiBase();
    fetch(`${base}/api/v1/conditions`, { headers: { Authorization: auth } })
      .then((r) => r.json())
      .then((d) => {
        const cid = d?.success?.data?.[0]?.id ?? null;
        setConditionId(cid);
        const q = cid ? `?condition_id=${cid}` : '';
        return Promise.all([
          fetch(`${base}/api/v1/progress/pain-trend?days=14${cid ? `&condition_id=${cid}` : ''}`, { headers: { Authorization: auth } }),
          fetch(`${base}/api/v1/progress/calendar${q}`, { headers: { Authorization: auth } }),
          fetch(`${base}/api/v1/progress/pattern${q}`, { headers: { Authorization: auth } }),
        ]);
      })
      .then(([trendRes, calRes, patternRes]) => Promise.all([trendRes?.json(), calRes?.json(), patternRes?.json()]))
      .then(([trendData, calData, patternData]) => {
        const points = (trendData?.success?.data?.points ?? []) as Array<{ pain_score: number; created_at: string }>;
        setChartData(
          points.map((p) => ({
            day: new Date(p.created_at).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
            score: p.pain_score,
          }))
        );
        if (calData?.success?.data) {
          setStats(calData.data.stats as Stats);
          setCalendarDays((calData.data.days ?? []) as CalendarDay[]);
        }
        const obs = patternData?.success?.data?.observation;
        if (obs && typeof obs === 'string') {
          setPatternObservation({
            description_vi: obs,
            is_first_pattern: patternData?.success?.data?.is_first_pattern === true,
          });
        }
        setLoading(false);
      })
      .catch(() => { setLoading(false); setError('Không tải được dữ liệu tiến triển. Kéo để thử lại.'); });
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  if (!getAuthHeader()) {
    return <p className="mt-4 text-t1 text-sm">Đăng nhập để xem tiến độ.</p>;
  }

  const painDelta = chartData.length >= 2 ? chartData[chartData.length - 1].score - chartData[0].score : null;
  const deltaFormatted = painDelta != null ? (painDelta < 0 ? `↓ −${Math.abs(painDelta).toFixed(1)} điểm` : painDelta > 0 ? `↑ +${painDelta.toFixed(1)} điểm` : 'Không đổi') : '';
  const showChart = chartData.length >= 3;
  const showPatternCard = chartData.length >= 14 && patternObservation != null;

  if (error) {
    return (
      <div className="mt-4 space-y-6" style={{ maxWidth: 400 }}>
        <p style={{ color: colors.t1, fontSize: 14 }}>{error}</p>
        <PrimaryButton label="Thử lại" onClick={loadData} />
      </div>
    );
  }
  if (loading && !chartData.length) {
    return (
      <div className="mt-4 space-y-6" style={{ maxWidth: 400 }}>
        <p className="text-t2 text-sm mb-2">14 ngày gần nhất</p>
        <SkeletonBlock height={120} rounded />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[1, 2, 3, 4].map((i) => <SkeletonBlock key={i} height={56} rounded />)}
        </div>
        <SkeletonBlock height={40} rounded />
      </div>
    );
  }
  return (
    <div className="mt-4 space-y-6" style={{ maxWidth: 400 }}>
      <div>
        <p className="text-t2 text-sm mb-2">14 ngày gần nhất</p>
        {!loading && !showChart && (
          <p className="text-t1 text-sm" style={{ color: colors.t1 }}>
            Cần thêm check-in để thấy tiến triển — tiếp tục làm bài hàng ngày.
          </p>
        )}
        {showChart && <PainChart data={chartData} isLoading={loading} />}
        {showChart && deltaFormatted && (
          <p className="text-xs mt-2" style={{ color: painDelta! < 0 ? colors.teal : painDelta! > 0 ? colors.risk : colors.t2, fontFamily: 'var(--font-mono)' }}>
            {deltaFormatted}
          </p>
        )}
      </div>
      {stats && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <StatTile value={String(stats.sessions_completed)} label="Bài hoàn thành" />
          <StatTile value={`${stats.consistency_pct}%`} label="Consistency" />
          <StatTile value={String(stats.days_low_pain)} label="Điểm 1–2" />
          <StatTile value={stats.avg_pain != null ? String(stats.avg_pain) : '—'} label="Avg đau" />
        </div>
      )}
      {showPatternCard && patternObservation && (
        <ProtocolBlock variant="pattern">
          {patternObservation.is_first_pattern && 'Đủ data rồi — bắt đầu thấy pattern của bạn. '}
          {patternObservation.description_vi}
          {' Bạn quyết định làm gì với thông tin đó.'}
        </ProtocolBlock>
      )}
      <div>
        <p className="text-t2 text-sm mb-2">Consistency · 30 ngày</p>
        <ConsistencyDotGrid totalDays={30} completedDays={calendarDays.filter((d) => d.session_completed).length} />
      </div>
    </div>
  );
}
