/**
 * OpenRouter AI provider — check-in responses via Claude (anthropic/claude-3-haiku).
 * TechSpec 2.1. Set OPENROUTER_API_KEY to enable; omit for template fallback.
 */

import type { AICheckinContext } from '../protocol-engine/prompts/context-builder.js';
import { FITWELL_SYSTEM_PROMPT } from '../protocol-engine/prompts/system-prompt.js';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'anthropic/claude-3-haiku';

export interface CheckinAIResult {
  fear_reduction: string;
  insight: string;
}

function buildCheckinUserMessage(ctx: AICheckinContext, protocolName: string | null, freeText?: string): string {
  const regionLabel = ctx.body_region === 'back' ? 'lưng' : ctx.body_region === 'neck' ? 'cổ' : ctx.body_region;
  const parts = [
    `Vùng: ${regionLabel}. Đau hôm nay: ${ctx.pain_score}/5. Ngày thứ ${ctx.day_number} trong chương trình.`,
    ctx.recent_pain_scores.length ? `Lịch sử đau gần đây: ${ctx.recent_pain_scores.join(', ')}.` : '',
    protocolName ? `Bài tập gợi ý: ${protocolName}.` : '',
    freeText && typeof freeText === 'string' && freeText.trim() ? `User ghi chú: ${freeText.trim()}` : '',
  ].filter(Boolean);
  return parts.join(' ');
}

const CHECKIN_JSON_INSTRUCTION = `
Trả lời ĐÚNG theo JSON sau, không thêm text ngoài JSON:
{"fear_reduction": "một câu ngắn xoa dịu lo lắng về vùng đau (8–14 từ)", "insight": "một câu ngắn về ngày tập và tiến độ (8–14 từ)"}
Tất cả bằng tiếng Việt. Không dấu chấm than, không emoji.`;

export async function getCheckinResponse(
  ctx: AICheckinContext,
  protocolName: string | null,
  freeText?: string
): Promise<CheckinAIResult | null> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || typeof apiKey !== 'string' || !apiKey.startsWith('sk-or-')) return null;

  const system = FITWELL_SYSTEM_PROMPT + CHECKIN_JSON_INSTRUCTION;
  const userMessage = buildCheckinUserMessage(ctx, protocolName, freeText);

  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.API_PUBLIC_URL || 'https://api.fitwell.vn',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: userMessage },
      ],
      max_tokens: 256,
      temperature: 0.3,
    }),
  });

  if (!res.ok) return null;
  const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const content = data.choices?.[0]?.message?.content;
  if (!content || typeof content !== 'string') return null;

  try {
    const parsed = JSON.parse(content) as unknown;
    if (parsed && typeof parsed === 'object' && 'fear_reduction' in parsed && 'insight' in parsed) {
      const fear = (parsed as { fear_reduction: unknown }).fear_reduction;
      const insight = (parsed as { insight: unknown }).insight;
      if (typeof fear === 'string' && typeof insight === 'string') {
        return { fear_reduction: fear.trim(), insight: insight.trim() };
      }
    }
  } catch {
    // fallback to template
  }
  return null;
}
