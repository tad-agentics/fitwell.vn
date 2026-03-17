/**
 * POST /api/v1/onboarding/intake — create condition + phase gate, rule-based protocol or assessment.
 */

import type { FastifyInstance } from 'fastify';
import { authGuard } from '../../shared/middleware/auth-guard.js';
import { pool } from '../../shared/db.js';
import { createConditionWithPhaseGate } from './condition-factory.service.js';
import type { MskConditionRow } from './condition-factory.service.js';
import { AppError } from '../../shared/errors.js';

export async function onboardingRoutes(app: FastifyInstance): Promise<void> {
  app.post<{
    Body: { body_regions?: string[]; trigger_pattern?: string; current_treatments?: string[]; msk_condition_slug?: string };
  }>('/api/v1/onboarding/intake', { preHandler: [authGuard] }, async (request, reply) => {
    const userId = request.user!.id;
    const body = request.body || {};
    const slug = body.msk_condition_slug ?? body.body_regions?.[0];
    if (!slug) throw new AppError('VALIDATION_ERROR', 400, { details: { body_regions: 'required or msk_condition_slug' } });

    const mskRes = await pool.query<MskConditionRow>(
      `SELECT id, slug, name_vi, body_region, pain_track, phase_count, assessment_required, assessment_test_slug, safety_warning_vi FROM msk_conditions WHERE slug = $1 AND is_active = TRUE`,
      [slug]
    );
    if (mskRes.rows.length === 0) throw new AppError('NOT_FOUND', 404);
    const msk = mskRes.rows[0];

    const result = await createConditionWithPhaseGate(userId, msk, {
      body_regions: body.body_regions ?? [msk.body_region],
      trigger_pattern: body.trigger_pattern ?? 'constant',
      current_treatments: body.current_treatments ?? [],
      primary_region: msk.body_region,
      msk_condition_id: msk.id,
      display_name_vi: msk.name_vi,
    });

    const aiMessage = {
      insight: result.safety_warning?.content_vi ?? null,
      protocol: result.protocol?.exercises[0]?.name_vi ?? null,
    };
    return reply.status(201).send({ success: true, data: { ...result, ai_message: aiMessage } });
  });

  app.post<{ Body: { symptom_text?: unknown } }>('/api/v1/onboarding/symptom-map', { preHandler: [authGuard] }, async (request, reply) => {
    const raw = request.body?.symptom_text;
    if (typeof raw !== 'string') throw new AppError('VALIDATION_ERROR', 400, { details: { symptom_text: 'must be a string' } });
    const text = raw.slice(0, 500).trim();
    const words = text.length >= 2 ? text.split(/\s+/).filter((w) => w.length >= 1) : [];
    const res = await pool.query<{ id: string; slug: string; name_vi: string; body_region: string; insight_hook_vi: string | null }>(
      `SELECT id, slug, name_vi, body_region, insight_hook_vi FROM msk_conditions WHERE is_active = TRUE`
    );
    let suggestions: Array<{ msk_condition_id: string; slug: string; name_vi: string; body_region: string; confidence: number; match_reason_vi: string }>;
    if (words.length === 0) {
      suggestions = res.rows.slice(0, 5).map((r) => ({
        msk_condition_id: r.id,
        slug: r.slug,
        name_vi: r.name_vi,
        body_region: r.body_region,
        confidence: 0.5,
        match_reason_vi: 'Gợi ý theo catalog',
      }));
    } else {
      const scored = res.rows.map((r) => {
        const nameVi = (r.name_vi ?? '').toLowerCase();
        const bodyRegion = (r.body_region ?? '').toLowerCase();
        const hook = (r.insight_hook_vi ?? '').toLowerCase();
        let hits = 0;
        for (const w of words) {
          const term = w.toLowerCase();
          if (nameVi.includes(term) || bodyRegion.includes(term) || hook.includes(term)) hits += 1;
        }
        return { row: r, score: hits };
      });
      scored.sort((a, b) => b.score - a.score);
      const top = scored.slice(0, 5);
      suggestions = top.map(({ row, score }) => ({
        msk_condition_id: row.id,
        slug: row.slug,
        name_vi: row.name_vi,
        body_region: row.body_region,
        confidence: Math.min(0.95, 0.5 + score * 0.15),
        match_reason_vi: score > 0 ? 'Khớp với mô tả của bạn' : 'Gợi ý theo catalog',
      }));
    }
    return reply.status(200).send({ success: true, data: { suggestions, below_threshold: text.length < 10 } });
  });
}
