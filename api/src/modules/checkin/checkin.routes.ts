/**
 * POST /api/v1/checkins — Pain5 branch: no protocol, show_exercise_card false.
 * TechSpec 4.4. P2: buildAIContext wired for personalized copy; protocol/location from DB.
 */

import type { FastifyInstance } from 'fastify';
import { authGuard } from '../../shared/middleware/auth-guard.js';
import { pool } from '../../shared/db.js';
import { AppError } from '../../shared/errors.js';
import { buildAIContext } from '../protocol-engine/prompts/context-builder.js';
import { getCheckinResponse } from '../ai/openrouter.js';
import { getSubscriptionStatus, requireActiveSubscription } from '../billing/subscription.service.js';

const TRIGGER_EVENT_VALUES = ['morning', 'midday', 'pre_sleep', 'post_exercise', 'manual'] as const;

export async function checkinRoutes(app: FastifyInstance): Promise<void> {
  app.get<{ Querystring: { condition_id: string } }>('/api/v1/checkins/today', { preHandler: [authGuard] }, async (request, reply) => {
    const userId = request.user!.id;
    const conditionId = request.query.condition_id;
    if (!conditionId) return reply.status(400).send({ success: false, code: 'VALIDATION_ERROR', message: 'condition_id required' });
    const tz = 'Asia/Ho_Chi_Minh';
    const res = await pool.query(
      `SELECT id, pain_score, ai_response, response_type, protocol_id, created_at
       FROM checkins WHERE user_id = $1 AND condition_id = $2 AND DATE(created_at AT TIME ZONE $3) = CURRENT_DATE LIMIT 1`,
      [userId, conditionId, tz]
    );
    const row = res.rows[0] as { pain_score: number; ai_response: unknown; response_type: string; protocol_id: string | null } | undefined;
    if (!row) return reply.status(200).send({ success: true, data: null });
    let exercise_card: { name_vi: string; duration_sec: number; location: string } | null = null;
    if (row.protocol_id) {
      const protRes = await pool.query(`SELECT exercises FROM protocols WHERE id = $1`, [row.protocol_id]);
      const exercises = (protRes.rows[0] as { exercises: Array<{ exercise_id: string }> } | undefined)?.exercises ?? [];
      const firstId = exercises[0]?.exercise_id;
      if (firstId) {
        const exRes = await pool.query(`SELECT name_vi, duration_sec, location FROM exercises WHERE id = $1`, [firstId]);
        const ex = exRes.rows[0] as { name_vi: string; duration_sec: number; location: string | null } | undefined;
        if (ex) exercise_card = { name_vi: ex.name_vi, duration_sec: ex.duration_sec, location: ex.location ?? 'Tại nhà' };
      }
    }
    return reply.status(200).send({
      success: true,
      data: {
        pain_score: row.pain_score,
        ai_response: row.ai_response ?? {},
        response_type: row.response_type,
        protocol_id: row.protocol_id,
        exercise_card,
      },
    });
  });

  app.post<{
    Body: { condition_id: string; pain_score: number; trigger_event?: string; free_text?: string };
  }>('/api/v1/checkins', {
    preHandler: [authGuard],
    schema: {
      body: {
        type: 'object',
        required: ['condition_id', 'pain_score'],
        properties: {
          condition_id: { type: 'string' },
          pain_score: { type: 'number', minimum: 1, maximum: 5 },
          trigger_event: { type: 'string', enum: [...TRIGGER_EVENT_VALUES] },
          free_text: { type: 'string' },
        },
      },
    },
  }, async (request, reply) => {
    const userId = request.user!.id;
    const sub = await getSubscriptionStatus(userId);
    requireActiveSubscription(sub);

    const { condition_id, pain_score, trigger_event, free_text } = request.body;
    if (typeof condition_id !== 'string') throw new AppError('VALIDATION_ERROR', 400);
    if (trigger_event != null && !TRIGGER_EVENT_VALUES.includes(trigger_event as (typeof TRIGGER_EVENT_VALUES)[number])) {
      throw new AppError('VALIDATION_ERROR', 400, { details: { trigger_event: `must be one of: ${TRIGGER_EVENT_VALUES.join(', ')}` } });
    }
    if (free_text != null && typeof free_text !== 'string') throw new AppError('VALIDATION_ERROR', 400);

    const tz = 'Asia/Ho_Chi_Minh';
    const todayRes = await pool.query(
      `SELECT id FROM checkins WHERE user_id = $1 AND condition_id = $2 AND DATE(created_at AT TIME ZONE $3) = CURRENT_DATE`,
      [userId, condition_id, tz]
    );
    if (todayRes.rows.length > 0) throw new AppError('CHECKIN_ALREADY_EXISTS', 409);

    const isPain5 = pain_score === 5;
    const condRes = await pool.query(
      `SELECT c.pain_track FROM conditions c WHERE c.id = $1 AND c.user_id = $2 AND c.is_active = TRUE`,
      [condition_id, userId]
    );
    const painTrack = (condRes.rows[0] as { pain_track: string } | undefined)?.pain_track ?? 'joint';
    const isTendonPain4 = pain_score === 4 && painTrack === 'tendon';

    let responseType: string;
    let aiResponse: Record<string, unknown>;
    let showExerciseCard: boolean;

    if (isPain5) {
      responseType = 'pain5';
      aiResponse = {
        acknowledge: 'Mức 5 — nghe rồi, hôm nay nặng thật.',
        rest_permission: 'Nghỉ hoàn toàn đi — không cần cố.',
        red_flag_check: 'Nếu tê chân hoặc đau lan xuống đùi — đừng chờ, gặp bác sĩ.',
        response_type: 'pain5',
      };
      showExerciseCard = false;
    } else if (isTendonPain4) {
      responseType = 'tendon_working_signal';
      aiResponse = {
        working_signal_explanation: 'Đau 3–4 khi làm bài gân = working signal. Gân đang được kích thích đúng cách — đây là mục tiêu, không phải cảnh báo.',
        sub_note: 'Chỉ giảm range nếu đau lên 5. Dừng hẳn là sai với tendon track.',
        response_type: 'tendon_working_signal',
      };
      showExerciseCard = true;
    } else {
      responseType = 'standard';
      let protocolName: string | null = null;
      const protResForName = await pool.query(
        `SELECT exercises FROM protocols WHERE condition_id = $1 AND user_id = $2 AND is_current = TRUE LIMIT 1`,
        [condition_id, userId]
      );
      const firstExIdForName = (protResForName.rows[0] as { exercises: Array<{ exercise_id: string }> } | undefined)?.exercises?.[0]?.exercise_id;
      if (firstExIdForName) {
        const exNameRes = await pool.query(`SELECT name_vi FROM exercises WHERE id = $1`, [firstExIdForName]);
        protocolName = (exNameRes.rows[0] as { name_vi: string } | undefined)?.name_vi ?? null;
      }
      try {
        const ctx = await buildAIContext(userId, condition_id, pain_score);
        const openRouterResult = await getCheckinResponse(ctx, protocolName, free_text);
        if (openRouterResult) {
          aiResponse = {
            fear_reduction: openRouterResult.fear_reduction,
            insight: openRouterResult.insight,
            ...(protocolName ? { protocol: protocolName } : {}),
            response_type: 'standard',
          };
        } else {
          const regionLabel = ctx.body_region === 'back' ? 'lưng' : ctx.body_region === 'neck' ? 'cổ' : ctx.body_region;
          aiResponse = {
            fear_reduction: `Pattern này rất phổ biến với vùng ${regionLabel}.`,
            insight: `Ngày ${ctx.day_number} — bài tập phù hợp giúp giảm dần.`,
            ...(protocolName ? { protocol: protocolName } : {}),
            response_type: 'standard',
          };
        }
      } catch {
        aiResponse = {
          fear_reduction: 'Pattern này rất phổ biến với người ngồi nhiều.',
          insight: 'Bài tập phù hợp giúp giảm dần.',
          ...(protocolName ? { protocol: protocolName } : {}),
          response_type: 'standard',
        };
      }
      showExerciseCard = true;
    }

    const insertRes = await pool.query(
      `INSERT INTO checkins (user_id, condition_id, pain_score, trigger_event, free_text, ai_response, protocol_id, show_exercise_card, response_type)
       VALUES ($1, $2, $3, $4, $5, $6, NULL, $7, $8) RETURNING id`,
      [userId, condition_id, pain_score, trigger_event ?? null, free_text ?? null, JSON.stringify(aiResponse), showExerciseCard, responseType]
    );
    const checkinId = insertRes.rows[0].id;

    let protocolId: string | null = null;
    let exerciseCard: { name_vi: string; duration_sec: number; location: string } | null = null;
    if (showExerciseCard) {
      const protRes = await pool.query(
        `SELECT id, exercises FROM protocols WHERE condition_id = $1 AND user_id = $2 AND is_current = TRUE LIMIT 1`,
        [condition_id, userId]
      );
      const protocolRow = protRes.rows[0] as { id: string; exercises: Array<{ exercise_id: string; order: number; duration_sec: number }> } | undefined;
      protocolId = protocolRow?.id ?? null;
      if (protocolId) {
        await pool.query(
          `UPDATE checkins SET protocol_id = $1 WHERE id = $2`,
          [protocolId, checkinId]
        );
        const exercises = protocolRow?.exercises ?? [];
        const firstExId = exercises[0]?.exercise_id;
        if (firstExId) {
          const exRes = await pool.query(
            `SELECT name_vi, duration_sec, location FROM exercises WHERE id = $1`,
            [firstExId]
          );
          const ex = exRes.rows[0] as { name_vi: string; duration_sec: number; location: string | null } | undefined;
          if (ex) exerciseCard = { name_vi: ex.name_vi, duration_sec: ex.duration_sec, location: ex.location ?? 'Tại nhà' };
        }
      }
    }

    return reply.status(201).send({
      success: true,
      data: {
        checkin_id: checkinId,
        protocol_id: protocolId,
        show_exercise_card: showExerciseCard,
        response_type: responseType,
        ai_response: aiResponse,
        exercise_card: exerciseCard,
      },
    });
  });
}
