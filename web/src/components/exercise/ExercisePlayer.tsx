/**
 * Exercise player — S09. Step-by-step, timer, ExitModal, PATCH on advance/exit.
 * Load by session_id (query). POST complete on last step → S10.
 */

import { useState, useEffect, useCallback } from 'react';
import {
  StepProgressBar,
  PrimaryButton,
  SecondaryButton,
  IconButton,
  Icons,
  colors,
  typography,
  radius,
} from '@/design-system';
import { getApiBase, getAuthHeader } from '@/lib/auth';

interface ExerciseStep {
  order: number;
  instruction_vi: string;
  duration_sec: number;
}

interface Exercise {
  exercise_id: string;
  name_vi: string;
  duration_sec: number;
  steps: ExerciseStep[];
  video_url?: string | null;
}

interface ExercisePlayerProps {
  sessionId?: string | null;
}

function formatTimer(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function ExitModal({
  onStay,
  onExit,
}: {
  onStay: () => void;
  onExit: () => void;
}) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: 24,
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-title"
    >
      <div
        style={{
          background: colors.bg1,
          borderRadius: radius.r12,
          border: `1px solid ${colors.border}`,
          padding: 24,
          maxWidth: 320,
          width: '100%',
        }}
      >
        <p id="exit-title" style={{ fontFamily: typography.fontPrimary, fontSize: typography.size14, color: colors.t1, marginBottom: 20 }}>
          Thoát bài tập? Bạn có thể làm tiếp sau.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <PrimaryButton label="Tiếp tục bài" onClick={onStay} />
          <SecondaryButton label="Thoát — tiếp sau" onClick={onExit} />
        </div>
      </div>
    </div>
  );
}

/** R-H1: Resolve global 1-based step to (exerciseIndex, stepIndexInExercise) for multi-exercise protocols. */
function getStepLocation(exercises: Exercise[], globalStep1: number): { exIndex: number; stepIndex: number; steps: ExerciseStep[] } | null {
  let remaining = globalStep1;
  for (let i = 0; i < exercises.length; i++) {
    const steps = (exercises[i].steps as ExerciseStep[]) ?? [];
    const n = steps.length || 1;
    if (remaining <= n) return { exIndex: i, stepIndex: remaining - 1, steps: steps.length ? steps : [] };
    remaining -= n;
  }
  return null;
}

export default function ExercisePlayer({ sessionId: propSessionId }: ExercisePlayerProps = {}) {
  const [protocol, setProtocol] = useState<{
    protocol_id: string;
    exercises: Exercise[];
    total_duration: number;
  } | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [timerSec, setTimerSec] = useState(0);
  const [exitOpen, setExitOpen] = useState(false);

  const sessionIdFromUrl =
    typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('session_id') : null;
  const effectiveSessionId = propSessionId ?? sessionIdFromUrl ?? sessionId;

  const authHeader = getAuthHeader();
  const apiBase = getApiBase();

  useEffect(() => {
    if (!authHeader) {
      setLoading(false);
      return;
    }
    const sid = propSessionId ?? sessionIdFromUrl;
    if (sid) {
      fetch(`${apiBase}/api/v1/sessions/${sid}`, { headers: { Authorization: authHeader } })
        .then((r) => r.json())
        .then((d) => {
          if (d?.success && d?.data) {
            setProtocol({
              protocol_id: d.data.protocol_id,
              exercises: d.data.exercises ?? [],
              total_duration: d.data.total_duration ?? 0,
            });
            setSessionId(d.data.session_id);
            const savedStep = typeof d.data.current_step === 'number' ? Math.max(1, d.data.current_step) : 1;
            setCurrentStep(savedStep);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
      return;
    }
    const cid = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('condition_id') : null;
    if (!cid) {
      setLoading(false);
      return;
    }
    fetch(`${apiBase}/api/v1/protocols/current?condition_id=${cid}`, { headers: { Authorization: authHeader } })
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.data) {
          setProtocol(d.data);
          return fetch(`${apiBase}/api/v1/sessions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: authHeader },
            body: JSON.stringify({ protocol_id: d.data.protocol_id, source: 'checkin' }),
          });
        }
        setLoading(false);
      })
      .then((r) => (r && r.ok ? r.json() : null))
      .then((d) => {
        if (d?.success && d?.data?.session_id) setSessionId(d.data.session_id);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [propSessionId, sessionIdFromUrl, authHeader, apiBase]);

  const patchSession = useCallback(
    (payload: { current_step?: number; status?: string; completion_pct?: number }) => {
      if (!effectiveSessionId || !authHeader) return;
      fetch(`${apiBase}/api/v1/sessions/${effectiveSessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: authHeader },
        body: JSON.stringify(payload),
      }).catch(() => {});
    },
    [effectiveSessionId, authHeader, apiBase]
  );

  const exercises = protocol?.exercises ?? [];
  const location = getStepLocation(exercises, currentStep);
  const ex = location ? exercises[location.exIndex] : exercises[0];
  const steps: ExerciseStep[] = location?.steps ?? (ex ? ((ex.steps as ExerciseStep[]) ?? []) : []);
  const totalStepsInExercise = steps.length || 1;
  const stepIndex = location ? Math.min(location.stepIndex, steps.length - 1) : 0;
  const step = steps[stepIndex];
  const totalStepsGlobal = exercises.reduce((acc, e) => acc + Math.max(1, (e.steps as ExerciseStep[])?.length ?? 0), 0);
  const isLastStepGlobal = currentStep >= totalStepsGlobal;

  useEffect(() => {
    if (!step) return;
    setTimerSec(step.duration_sec);
  }, [currentStep, step?.order]);

  useEffect(() => {
    if (timerSec <= 0) return;
    const t = setInterval(() => setTimerSec((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [currentStep]);

  useEffect(() => {
    const onPopState = () => {
      setExitOpen(true);
      history.pushState(null, '', window.location.href);
    };
    history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const handlePrev = () => {
    if (currentStep <= 1) return;
    setCurrentStep((s) => s - 1);
    patchSession({ current_step: currentStep - 1 });
  };

  const handleNext = async () => {
    if (currentStep < totalStepsGlobal) {
      const next = currentStep + 1;
      setCurrentStep(next);
      patchSession({ current_step: next });
      return;
    }
    if (!effectiveSessionId || !authHeader) return;
    try {
      await fetch(`${apiBase}/api/v1/sessions/${effectiveSessionId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: authHeader },
        body: JSON.stringify({ completion_pct: 100, feedback: 'same' }),
      });
    } catch {
      // fire-and-forget
    }
    window.location.href = `/exercise/done?session_id=${encodeURIComponent(effectiveSessionId)}`;
  };

  const handleExitConfirm = () => {
    const pct = totalStepsGlobal > 0 ? Math.round((currentStep / totalStepsGlobal) * 100) : 0;
    patchSession({ status: 'exited', completion_pct: pct });
    setExitOpen(false);
    window.location.href = '/home';
  };

  if (loading) {
    return (
      <div className="p-6 text-t1 text-sm" style={{ color: colors.t1, padding: 24, fontSize: 14 }}>
        Đang tải bài tập...
      </div>
    );
  }
  if (!protocol || !protocol.exercises?.length) {
    return (
      <div className="p-6 text-t1 text-sm" style={{ color: colors.t1, padding: 24, fontSize: 14 }}>
        Không tìm thấy bài tập. Bắt đầu từ onboarding.
      </div>
    );
  }

  const isFirstStep = currentStep <= 1;
  const isLastStep = isLastStepGlobal;
  const instruction = step?.instruction_vi ?? ex?.name_vi ?? '';

  return (
    <div style={{ padding: 24, paddingBottom: 32, minHeight: '100vh', background: colors.bg0 }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <IconButton
          icon={<Icons.Close />}
          onClick={() => setExitOpen(true)}
          label="Thoát"
          size="sm"
        />
      </div>

      <h1 style={{ fontFamily: typography.fontDisplay, fontSize: typography.size12, fontWeight: 600, color: colors.t0, marginBottom: 8 }}>
        {ex?.name_vi}
      </h1>

      {totalStepsInExercise > 0 && (
        <StepProgressBar total={totalStepsInExercise} current={stepIndex} />
      )}
      <p style={{ fontFamily: typography.fontMono, fontSize: typography.size09, color: colors.t2, marginTop: 6, marginBottom: 12 }}>
        Bước {stepIndex + 1} / {totalStepsInExercise}
        {exercises.length > 1 ? ` · Bài ${(location?.exIndex ?? 0) + 1}/${exercises.length}` : ''}
      </p>

      <p style={{ fontFamily: typography.fontPrimary, fontSize: typography.size11, color: colors.t1, marginBottom: 16 }}>
        {instruction}
      </p>

      {steps.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: typography.fontMono, fontSize: typography.size26, fontWeight: 700, color: colors.t0 }}>
            {formatTimer(timerSec)}
          </div>
          <div style={{ fontFamily: typography.fontMono, fontSize: typography.size07, color: colors.t2 }}>còn lại</div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
        <SecondaryButton
          label="← Bước trước"
          onClick={handlePrev}
          disabled={isFirstStep}
          fullWidth
        />
        <div style={timerSec === 0 && !isLastStep ? { animation: 'fw-step-pulse 1.5s ease-in-out infinite' } : undefined}>
          <PrimaryButton
            label={isLastStep ? 'Hoàn thành ✓' : 'Bước tiếp →'}
            onClick={handleNext}
            fullWidth
          />
        </div>
      </div>
      {timerSec === 0 && !isLastStep && (
        <style>{`@keyframes fw-step-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.75; } }`}</style>
      )}

      {exitOpen && (
        <ExitModal
          onStay={() => setExitOpen(false)}
          onExit={handleExitConfirm}
        />
      )}
    </div>
  );
}
