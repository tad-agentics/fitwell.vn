/**
 * Check-in form — S12/S13/SMSK03. CheckinHeader, pain 1–5, POST checkins, AI response + exercise card or tendon working signal.
 */

import { useState, useEffect } from 'react';
import { CheckinHeader, ProtocolBlock, ExerciseCard, PrimaryButton, GhostButton, PainScoreSelector } from '@/design-system';
import { getApiBase, getAuthHeader } from '@/lib/auth';

interface CheckInFormProps {
  conditionId?: string | null;
}

interface ExerciseCardData {
  name_vi: string;
  duration_sec: number;
  location: string;
}

interface CheckinResponse {
  response_type: string;
  ai_response: Record<string, string>;
  exercise_card?: ExerciseCardData | null;
  protocol_id?: string | null;
}

const TYPING_INDICATOR_MS = 800;

export default function CheckInForm(_props: CheckInFormProps = {}) {
  const [conditions, setConditions] = useState<Array<{ id: string; display_name_vi: string }>>([]);
  const [conditionId, setConditionId] = useState('');
  const [painScore, setPainScore] = useState<number | null>(null);
  const [freeText, setFreeText] = useState('');
  const [showFreeText, setShowFreeText] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [response, setResponse] = useState<CheckinResponse | null>(null);
  const [dayNumber, setDayNumber] = useState(1);
  const [alreadyCheckedIn, setAlreadyCheckedIn] = useState(false);

  const conditionName = conditions.find((c) => c.id === conditionId)?.display_name_vi ?? '';
  const timeStr = (() => {
    const n = new Date();
    return n.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  })();

  useEffect(() => {
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
    const fromQuery = params.get('condition_id');
    const auth = getAuthHeader();
    if (!auth) return;
    fetch(`${getApiBase()}/api/v1/me`, { headers: { Authorization: auth } })
      .then((r) => r.json())
      .then((d) => {
        const at = d?.success?.data?.onboarding_completed_at;
        if (at) {
          const base = new Date(at).getTime();
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          setDayNumber(Math.max(1, Math.floor((today.getTime() - base) / 86400000) + 1));
        }
      })
      .catch(() => {});
    fetch(`${getApiBase()}/api/v1/conditions`, { headers: { Authorization: auth } })
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data?.length) {
          setConditions(d.data);
          const cid = fromQuery && d.data.some((c: { id: string }) => c.id === fromQuery) ? fromQuery : d.data[0].id;
          setConditionId(cid);
          return cid ? fetch(`${getApiBase()}/api/v1/checkins/today?condition_id=${encodeURIComponent(cid)}`, { headers: { Authorization: auth } }) : null;
        }
      })
      .then((r) => (r && r.ok ? r.json() : null))
      .then((d) => {
        if (d?.success?.data) {
          setAlreadyCheckedIn(true);
          setResponse({
            response_type: d.data.response_type ?? 'standard',
            ai_response: d.data.ai_response ?? {},
            exercise_card: d.data.exercise_card ?? null,
            protocol_id: d.data.protocol_id ?? null,
          });
          setPainScore(d.data.pain_score ?? null);
        }
      })
      .catch(() => {});
  }, []);

  const submit = async (scoreOverride?: number) => {
    const score = scoreOverride ?? painScore;
    if (score == null || !conditionId) return;
    const auth = getAuthHeader();
    if (!auth) return;
    setSubmitting(true);
    const start = Date.now();
    try {
      const res = await fetch(`${getApiBase()}/api/v1/checkins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: auth },
        body: JSON.stringify({ condition_id: conditionId, pain_score: score, free_text: freeText || undefined }),
      });
      const data = await res.json();
      if (res.status === 409 && data?.code === 'CHECKIN_ALREADY_EXISTS') {
        const todayRes = await fetch(`${getApiBase()}/api/v1/checkins/today?condition_id=${encodeURIComponent(conditionId)}`, { headers: { Authorization: auth } });
        const todayData = await todayRes.json();
        if (todayData?.success?.data) {
          setPainScore(todayData.data.pain_score ?? null);
          setResponse({
            response_type: todayData.data.response_type ?? 'standard',
            ai_response: todayData.data.ai_response ?? {},
            exercise_card: todayData.data.exercise_card ?? null,
            protocol_id: todayData.data.protocol_id ?? null,
          });
          setAlreadyCheckedIn(true);
        }
      } else if (data?.success?.data) {
        const elapsed = Date.now() - start;
        const wait = Math.max(0, TYPING_INDICATOR_MS - elapsed);
        await new Promise((r) => setTimeout(r, wait));
        setResponse({
          response_type: data.data.response_type ?? 'standard',
          ai_response: data.data.ai_response ?? {},
          exercise_card: data.data.exercise_card ?? null,
          protocol_id: data.data.protocol_id ?? null,
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const startExercise = async () => {
    const anonId = typeof localStorage !== 'undefined' ? localStorage.getItem('fw_anonymous_id') : null;
    if (!anonId || !response?.protocol_id) return;
    const res = await fetch(`${getApiBase()}/api/v1/sessions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Anonymous ${anonId}` },
      body: JSON.stringify({ protocol_id: response.protocol_id, source: 'checkin' }),
    });
    const data = await res.json();
    if (data?.success?.data?.session_id) {
      window.location.href = `/exercise?session_id=${encodeURIComponent(data.data.session_id)}`;
    }
  };

  if (response) {
    const isPain5 = response.response_type === 'pain5';
    const isTendonWorking = response.response_type === 'tendon_working_signal';
    const ai = response.ai_response;
    const ex = response.exercise_card;

    if (isPain5) {
      return (
        <div className="mt-4 space-y-4">
          <ProtocolBlock variant="honest">{ai.acknowledge ?? 'Mức 5 — nghe rồi, hôm nay nặng thật.'}</ProtocolBlock>
          <ProtocolBlock variant="dry">{ai.rest_permission ?? 'Nghỉ hoàn toàn đi — không cần cố.'}</ProtocolBlock>
          {ai.red_flag_check && (
            <ProtocolBlock variant="honest">{ai.red_flag_check}</ProtocolBlock>
          )}
          <p className="text-teal text-sm">Đã ghi nhận check-in.</p>
          {!alreadyCheckedIn && <GhostButton label="Về trang chủ" onClick={() => { window.location.href = '/home'; }} fullWidth />}
        </div>
      );
    }

    if (isTendonWorking) {
      const durationStr = ex ? `${Math.round((ex.duration_sec || 0) / 60)} phút` : '';
      return (
        <div className="mt-4 space-y-4">
          <ProtocolBlock variant="insight">
            {ai.working_signal_explanation ?? 'Đau 3–4 khi làm bài gân = working signal. Gân đang được kích thích đúng cách — đây là mục tiêu, không phải cảnh báo.'}
          </ProtocolBlock>
          {ai.sub_note && <p className="text-t2 text-xs">Chỉ giảm range nếu đau lên 5. Dừng hẳn là sai với tendon track.</p>}
          {ex && (
            <>
              <div className="relative">
                <ExerciseCard
                  name={ex.name_vi}
                  duration={durationStr}
                  location={ex.location}
                  thumbnailUrl={null}
                  onPlay={startExercise}
                />
                <span className="absolute top-2 right-2 text-t2 text-[9px] uppercase tracking-wide">Bài giữ nguyên</span>
              </div>
              <PrimaryButton label="Tiếp tục bài →" onClick={startExercise} />
            </>
          )}
          <p className="text-teal text-sm">Đã ghi nhận check-in.</p>
        </div>
      );
    }

    const durationStr = ex ? `${Math.round((ex.duration_sec || 0) / 60)} phút` : '';
    return (
      <div className="mt-4 space-y-4">
        <ProtocolBlock variant="dry">{ai.insight ?? 'Bài tập phù hợp giúp giảm dần.'}</ProtocolBlock>
        {ex && (
          <>
            <ExerciseCard
              name={ex.name_vi}
              duration={durationStr}
              location={ex.location}
              thumbnailUrl={null}
              onPlay={startExercise}
            />
            <PrimaryButton label="Làm bài →" onClick={startExercise} />
          </>
        )}
        <p className="text-teal text-sm">Đã ghi nhận check-in.</p>
      </div>
    );
  }

  if (conditions.length === 0) return <p className="mt-4 text-t2 text-sm">Chưa có tình trạng. Bắt đầu từ onboarding.</p>;

  return (
    <div className="mt-4 space-y-4">
      <CheckinHeader conditionName={conditionName} time={timeStr} dayNumber={dayNumber} />
      {conditions.length > 1 && (
        <div>
          <label className="text-t2 text-sm">Tình trạng</label>
          <select value={conditionId} onChange={(e) => setConditionId(e.target.value)} className="mt-1 w-full rounded-xl bg-bg2 border border-border p-3 text-t0 text-sm">
            {conditions.map((c) => (
              <option key={c.id} value={c.id}>{c.display_name_vi}</option>
            ))}
          </select>
        </div>
      )}
      <PainScoreSelector
        value={painScore}
        onChange={(n) => { setPainScore(n); void submit(n); }}
        conditionName={conditionName || undefined}
        promptTimeLabel="sáng nay"
      />
      {submitting && (
        <div className="flex items-center gap-2 text-t2 text-sm">
          <span className="inline-flex gap-1"><span style={{ animation: 'pulse 1s ease-in-out infinite' }}>.</span><span style={{ animation: 'pulse 1s ease-in-out 0.2s infinite' }}>.</span><span style={{ animation: 'pulse 1s ease-in-out 0.4s infinite' }}>.</span></span>
        </div>
      )}
      {!showFreeText ? (
        <button type="button" onClick={() => setShowFreeText(true)} className="text-t2 text-sm underline">Thêm ghi chú</button>
      ) : (
        <div>
          <label className="text-t2 text-sm">Ghi chú (tùy chọn)</label>
          <textarea value={freeText} onChange={(e) => setFreeText(e.target.value)} className="mt-1 w-full rounded-xl bg-bg2 border border-border p-3 text-t0 text-sm" rows={2} />
        </div>
      )}
      <PrimaryButton label="Gửi check-in" onClick={submit} disabled={painScore == null || submitting} />
    </div>
  );
}
