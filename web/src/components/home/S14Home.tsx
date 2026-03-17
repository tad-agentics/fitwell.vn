/**
 * S14 Home / Hôm nay — DateHeader, ConsistencyGrid, Sparkline, TodayExerciseCard, Re-engagement, PatternInsightCard. Spec: screen-spec-S14-S15-S16-S17.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { ConsistencyDotGrid, PrimaryButton, GhostButton, Sparkline, ProtocolBlock, PainScoreSelector, ExerciseCard, SkeletonBlock, colors } from '@/design-system';
import { getApiBase, getAuthHeader } from '@/lib/auth';
import { getReanchorShown, setReanchorShown } from '@/lib/prefs';

const PULL_THRESHOLD = 72;

interface CalendarDay {
  date: string;
  pain_score: number | null;
  session_completed: boolean;
}

interface CheckinResponseData {
  response_type: string;
  ai_response: Record<string, string>;
  exercise_card?: { name_vi: string; duration_sec: number; location: string } | null;
  protocol_id?: string | null;
}

export default function S14Home() {
  const [conditions, setConditions] = useState<Array<{ id: string; display_name_vi: string }>>([]);
  const [selectedConditionId, setSelectedConditionId] = useState<string | null>(null);
  const [protocol, setProtocol] = useState<{ protocol_id: string; exercises: Array<{ name_vi: string; duration_sec: number }> } | null>(null);
  const [painScores, setPainScores] = useState<number[]>([]);
  const [daysSinceCheckin, setDaysSinceCheckin] = useState<number | null>(null);
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);
  const [completedDays, setCompletedDays] = useState(0);
  const [checkinToday, setCheckinToday] = useState<boolean | null>(null);
  const [sessionDoneToday, setSessionDoneToday] = useState(false);
  const [dayNumber, setDayNumber] = useState(1);
  const [onboardingDateStr, setOnboardingDateStr] = useState<string | null>(null);
  const [painAvg14d, setPainAvg14d] = useState<number | null>(null);
  const [patternObservation, setPatternObservation] = useState<{ description_vi: string; is_first_pattern: boolean } | null>(null);
  const [loading, setLoading] = useState(true);
  const [reengagementScore, setReengagementScore] = useState<number | null>(null);
  const [reengagementSubmitting, setReengagementSubmitting] = useState(false);
  const [reengagementResponse, setReengagementResponse] = useState<CheckinResponseData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pullY, setPullY] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [reanchorShown, setReanchorShownState] = useState(false);
  const touchStartY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') setReanchorShownState(getReanchorShown());
  }, []);

  const loadData = useCallback((conditionId?: string | null) => {
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
        if (d?.success && d?.data?.length) {
          const conds = d.data as Array<{ id: string; display_name_vi: string }>;
          setConditions(conds);
          const cid = conditionId && conds.some((c) => c.id === conditionId) ? conditionId : conds[0].id;
          if (!conditionId && conds.length) setSelectedConditionId(conds[0].id);
          return Promise.all([
            fetch(`${base}/api/v1/me`, { headers: { Authorization: auth } }),
            fetch(`${base}/api/v1/protocols/current?condition_id=${cid}`, { headers: { Authorization: auth } }),
            fetch(`${base}/api/v1/progress/pain-trend?days=14&condition_id=${cid}`, { headers: { Authorization: auth } }),
            fetch(`${base}/api/v1/progress/calendar?condition_id=${cid}`, { headers: { Authorization: auth } }),
            fetch(`${base}/api/v1/progress/pattern?condition_id=${cid}`, { headers: { Authorization: auth } }),
          ]);
        }
        setLoading(false);
      })
      .then((arr) => {
        if (!arr) return;
        const [meRes, protRes, trendRes, calRes, patternRes] = arr;
        return Promise.all([meRes?.json(), protRes?.json(), trendRes?.json(), calRes?.json(), patternRes?.json()]).then(
          ([meData, protData, trendData, calData, patternData]) => {
            const at = meData?.success && meData?.data?.onboarding_completed_at;
            if (at) {
              setOnboardingDateStr(at.slice(0, 10));
              const baseDate = new Date(at).getTime();
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              setDayNumber(Math.max(1, Math.floor((today.getTime() - baseDate) / 86400000) + 1));
            }
            if (protData?.success && protData?.data) setProtocol(protData.data);
            const points = ((trendData?.success && trendData?.data?.points) ?? []) as Array<{ pain_score: number; created_at: string }>;
            if (points.length > 0) {
              const scores = points.slice(-5).map((p) => p.pain_score);
              setPainScores(scores);
              const avg14 = points.reduce((s, p) => s + p.pain_score, 0) / points.length;
              setPainAvg14d(avg14);
              const last = new Date(points[points.length - 1].created_at);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              last.setHours(0, 0, 0, 0);
              setDaysSinceCheckin(Math.floor((today.getTime() - last.getTime()) / 86400000));
            }
            const days = ((calData?.success && calData?.data?.days) ?? []) as CalendarDay[];
            if (days.length > 0) {
              setCalendarDays(days);
              setCompletedDays(days.filter((d) => d.session_completed).length);
              const todayStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;
              const todayDay = days.find((d) => d.date === todayStr);
              setCheckinToday(todayDay ? todayDay.pain_score != null : false);
              setSessionDoneToday(todayDay?.session_completed ?? false);
            }
            const obs = patternData?.success && patternData?.data?.observation;
            if (obs && typeof obs === 'string') {
              setPatternObservation({
                description_vi: obs,
                is_first_pattern: patternData?.success && patternData?.data?.is_first_pattern === true,
              });
            }
          }
        );
      })
      .then(() => { setLoading(false); setError(null); setRefreshing(false); })
      .catch(() => { setLoading(false); setError('Không tải được dữ liệu. Kéo để thử lại.'); setRefreshing(false); });
  }, []);

  const onPullRefresh = useCallback(() => {
    setRefreshing(true);
    setPullY(0);
    loadData();
  }, [loadData]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (typeof window === 'undefined') return;
    if (window.scrollY > 0) return;
    const y = e.touches[0].clientY;
    const delta = y - touchStartY.current;
    if (delta > 0) setPullY(Math.min(delta, 100));
  }, []);
  const handleTouchEnd = useCallback(() => {
    if (pullY >= PULL_THRESHOLD) onPullRefresh();
    else setPullY(0);
  }, [pullY, onPullRefresh]);

  useEffect(() => { loadData(); }, [loadData]);

  const currentConditionId = selectedConditionId ?? conditions[0]?.id;
  const switchCondition = (id: string) => {
    setSelectedConditionId(id);
    loadData(id);
  };

  const dayLabel = (() => {
    const d = new Date();
    const days = ['Chủ nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    return days[d.getDay()];
  })();
  const firstEx = protocol?.exercises?.[0];
  const durationStr = firstEx ? `${Math.round((firstEx.duration_sec || 0) / 60)} phút` : '';
  const showReengagement = daysSinceCheckin != null && daysSinceCheckin > 2;
  const conditionName = conditions.find((c) => c.id === currentConditionId)?.display_name_vi ?? conditions[0]?.display_name_vi ?? '';

  const submitReengagementCheckin = async (score: number) => {
    const cid = currentConditionId ?? conditions[0]?.id;
    const auth = getAuthHeader();
    if (!cid || !auth) return;
    setReengagementSubmitting(true);
    try {
      const res = await fetch(`${getApiBase()}/api/v1/checkins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: auth },
        body: JSON.stringify({ condition_id: cid, pain_score: score }),
      });
      const data = await res.json();
      if (data?.success && data?.data) {
        setReengagementResponse({
          response_type: data.data.response_type ?? 'standard',
          ai_response: data.data.ai_response ?? {},
          exercise_card: data.data.exercise_card ?? null,
          protocol_id: data.data.protocol_id ?? null,
        });
      }
    } finally {
      setReengagementSubmitting(false);
    }
  };

  const startExerciseFromReengagement = () => {
    const auth = getAuthHeader();
    if (!auth || !reengagementResponse?.protocol_id) return;
    fetch(`${getApiBase()}/api/v1/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: auth },
      body: JSON.stringify({ protocol_id: reengagementResponse.protocol_id, source: 'checkin' }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (d?.success && d?.data?.session_id) window.location.href = `/exercise?session_id=${encodeURIComponent(d.data.session_id)}`;
      });
  };

  const painTrendDelta = painScores.length >= 2 ? painScores[painScores.length - 1] - painScores[0] : null;
  const painTrendLabel = painTrendDelta != null && painTrendDelta < 0 ? '↓ đang cải thiện' : '';

  const todayStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`;
  const consistencyPct =
    onboardingDateStr != null && dayNumber > 0 && calendarDays.length > 0
      ? (() => {
          const inRange = calendarDays.filter((d) => d.date >= onboardingDateStr && d.date <= todayStr);
          const completed = inRange.filter((d) => d.session_completed).length;
          return Math.min(100, Math.round((completed / Math.max(1, dayNumber)) * 100));
        })()
      : null;
  const showReanchor =
    dayNumber >= 26 &&
    dayNumber <= 30 &&
    painAvg14d != null &&
    painAvg14d <= 2.5 &&
    consistencyPct != null &&
    consistencyPct >= 70 &&
    !reanchorShown;

  useEffect(() => {
    if (showReanchor) setReanchorShown(true);
  }, [showReanchor]);

  if (loading && !conditions.length) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400 }}>
        <SkeletonBlock height={14} width={120} />
        <SkeletonBlock height={40} rounded />
        <SkeletonBlock height={60} rounded />
        <SkeletonBlock height={80} rounded />
      </div>
    );
  }
  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400 }}>
        <p style={{ color: colors.t1, fontSize: 14 }}>{error}</p>
        <PrimaryButton label="Thử lại" onClick={loadData} />
      </div>
    );
  }
  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 400, position: 'relative' }}
    >
      {conditions.length > 1 && (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
          {conditions.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => switchCondition(c.id)}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                border: `1px solid ${currentConditionId === c.id ? colors.amber : colors.border}`,
                background: currentConditionId === c.id ? colors.bg2 : 'transparent',
                color: currentConditionId === c.id ? colors.t0 : colors.t2,
                fontSize: 13,
                fontWeight: currentConditionId === c.id ? 600 : 400,
              }}
            >
              {c.display_name_vi}
            </button>
          ))}
        </div>
      )}
      {(pullY > 0 || refreshing) && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '8px 0', textAlign: 'center', color: colors.t2, fontSize: 12, zIndex: 1 }}>
          {refreshing ? 'Đang làm mới...' : pullY >= PULL_THRESHOLD ? 'Thả để làm mới' : 'Kéo để làm mới'}
        </div>
      )}
      <p className="text-t2 text-sm" style={{ marginTop: pullY > 0 ? Math.min(pullY / 2, 32) : 0 }}>{dayLabel} · Ngày {dayNumber}</p>
      <p className="text-t2 text-sm">Consistency · {dayNumber <= 30 ? dayNumber : 30} ngày</p>
      <ConsistencyDotGrid totalDays={Math.min(30, dayNumber)} completedDays={Math.min(completedDays, Math.min(30, dayNumber))} />
      {painScores.length >= 2 && (
        <>
          <p className="text-t2 text-sm">5 ngày · điểm đau</p>
          <Sparkline scores={painScores} />
          {painTrendLabel && (
            <p className="text-t2 text-sm" style={{ color: colors.teal }}>{painScores.join(' → ')} · {painTrendLabel}</p>
          )}
        </>
      )}
      {showReanchor && (
        <div style={{ borderTop: `3px solid ${colors.amber}`, borderRadius: 8, padding: 16, background: colors.bg2 }}>
          <p style={{ color: colors.t0, fontSize: 14, marginBottom: 8 }}>
            Tháng đầu xong rồi — ổn đấy. Giảm xuống 3 ngày/tuần thay vì dừng — giữ được lâu hơn nhiều.
          </p>
          <a href="/notifications/setup" style={{ color: colors.amber, fontSize: 14, fontWeight: 600 }}>
            Điều chỉnh lịch
          </a>
        </div>
      )}
      {!showReanchor && patternObservation && (
        <ProtocolBlock variant="pattern">
          {patternObservation.is_first_pattern && 'Đủ data rồi — bắt đầu thấy pattern của bạn. '}
          {patternObservation.description_vi}
          {' Bạn quyết định làm gì với thông tin đó.'}
        </ProtocolBlock>
      )}
      {showReengagement && !reengagementResponse && (
        <>
          <ProtocolBlock variant="zero-guilt">
            {daysSinceCheckin !== null && daysSinceCheckin >= 7
              ? '1 tuần không thấy — không sao, không hỏi lý do. Cơ thể vẫn nhớ — tiếp tục bài cũ, không cần restart.'
              : 'Vài ngày không thấy — không sao, không hỏi lý do. Cơ thể vẫn nhớ. Làm bài hôm nay bình thường, như chưa có gì.'}
          </ProtocolBlock>
          <PainScoreSelector
            value={reengagementScore}
            onChange={(n) => {
              setReengagementScore(n);
              submitReengagementCheckin(n);
            }}
            conditionName={conditionName || undefined}
          />
          {reengagementSubmitting && <p className="text-t2 text-sm">Đang gửi...</p>}
        </>
      )}
      {showReengagement && reengagementResponse && (() => {
        const r = reengagementResponse;
        const ai = r.ai_response;
        const ex = r.exercise_card;
        if (r.response_type === 'pain5') {
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <ProtocolBlock variant="honest">{ai.acknowledge ?? 'Mức 5 — nghe rồi, hôm nay nặng thật.'}</ProtocolBlock>
              <ProtocolBlock variant="dry">{ai.rest_permission ?? 'Nghỉ hoàn toàn đi — không cần cố.'}</ProtocolBlock>
              {ai.red_flag_check && <ProtocolBlock variant="honest">{ai.red_flag_check}</ProtocolBlock>}
              <p style={{ color: colors.teal, fontSize: 14 }}>Đã ghi nhận check-in.</p>
              <GhostButton label="Về trang chủ" onClick={() => { window.location.href = '/home'; }} fullWidth />
            </div>
          );
        }
        if (r.response_type === 'tendon_working_signal') {
          const durationStr = ex ? `${Math.round((ex.duration_sec || 0) / 60)} phút` : '';
          return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <ProtocolBlock variant="insight">
                {ai.working_signal_explanation ?? 'Đau 3–4 khi làm bài gân = working signal. Gân đang được kích thích đúng cách — đây là mục tiêu, không phải cảnh báo.'}
              </ProtocolBlock>
              {ai.sub_note && <p className="text-t2 text-xs">Chỉ giảm range nếu đau lên 5. Dừng hẳn là sai với tendon track.</p>}
              {ex && (
                <>
                  <ExerciseCard name={ex.name_vi} duration={durationStr} location={ex.location} onPlay={startExerciseFromReengagement} />
                  <PrimaryButton label="Tiếp tục bài →" onClick={startExerciseFromReengagement} />
                </>
              )}
              <p style={{ color: colors.teal, fontSize: 14 }}>Đã ghi nhận check-in.</p>
            </div>
          );
        }
        const durationStr = ex ? `${Math.round((ex.duration_sec || 0) / 60)} phút` : '';
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <ProtocolBlock variant="dry">{ai.insight ?? 'Bài tập phù hợp giúp giảm dần.'}</ProtocolBlock>
            {ex && (
              <>
                <ExerciseCard name={ex.name_vi} duration={durationStr} location={ex.location} onPlay={startExerciseFromReengagement} />
                <PrimaryButton label="Làm bài →" onClick={startExerciseFromReengagement} />
              </>
            )}
            <p style={{ color: colors.teal, fontSize: 14 }}>Đã ghi nhận check-in.</p>
          </div>
        );
      })()}
      {!showReengagement && (
      <>
      <p className="text-t2 text-sm">Bài hôm nay</p>
      {firstEx ? (
        <>
          {sessionDoneToday && (
            <p style={{ color: colors.teal, fontSize: 14, marginBottom: 4 }}>Đã xong hôm nay ✓</p>
          )}
          {checkinToday === false && currentConditionId && (
            <GhostButton
              label="Chưa check-in hôm nay"
              onClick={() => { window.location.href = `/checkin?condition_id=${encodeURIComponent(currentConditionId)}`; }}
              fullWidth={false}
            />
          )}
          <p className="font-display text-sm font-semibold text-t0">{firstEx.name_vi}</p>
          <p className="text-t2 text-sm">{durationStr} · Tại nhà</p>
          <div style={sessionDoneToday ? { opacity: 0.7 } : undefined}>
            <PrimaryButton
              label="Làm bài ▶"
              disabled={sessionDoneToday}
              onClick={() => {
                if (sessionDoneToday) return;
                const auth = getAuthHeader();
                if (!auth || !currentConditionId) return;
                fetch(`${getApiBase()}/api/v1/sessions`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', Authorization: auth },
                  body: JSON.stringify({ protocol_id: protocol?.protocol_id ?? '', source: 'manual' }),
                })
                  .then((r) => r.json())
                  .then((d) => {
                    if (d?.success && d?.data?.session_id) window.location.href = `/exercise?session_id=${encodeURIComponent(d.data.session_id)}`;
                  });
              }}
            />
          </div>
        </>
      ) : (
        <p className="text-t2 text-sm">Bài của bạn đang được chuẩn bị — quay lại sau.</p>
      )}
      {currentConditionId && (
        <GhostButton
          label="Check-in hôm nay"
          onClick={() => { window.location.href = `/checkin?condition_id=${encodeURIComponent(currentConditionId)}`; }}
          fullWidth={false}
        />
      )}
      </>
      )}
    </div>
  );
}
