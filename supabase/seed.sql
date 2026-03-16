-- ============================================================================
-- FitWell — Seed Data
-- File: supabase/seed.sql
-- Run: supabase db reset (applies migrations + this seed)
-- Purpose: Realistic test data for local dev and build sessions.
--          All UUIDs are fixed so screen builds reference consistent records.
-- ============================================================================

-- ─────────────────────────────────────────────────────────────────────────────
-- 0. TRUNCATE (safe reset order — foreign key aware)
-- ─────────────────────────────────────────────────────────────────────────────
TRUNCATE TABLE
  notification_logs, push_subscriptions, notification_schedules,
  lifestyle_events, pattern_observations,
  checkins, sessions,
  phase_progress, protocols,
  conditions, user_profiles, subscriptions, payos_orders,
  password_reset_tokens, users,
  exercises, msk_conditions
RESTART IDENTITY CASCADE;

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. MSK CONDITIONS CATALOG (seed — read-only reference data)
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO msk_conditions (id, slug, name_vi, name_en, body_region, pain_track, phase_count, timing_critical, timing_slot, assessment_required, assessment_test_slug, safety_warning_vi, insight_hook_vi, is_active) VALUES

-- Tendon track
('cond-msk-01-0000-0000-000000000001', 'plantar_fasciitis',   'Viêm cân gan bàn chân',     'Plantar Fasciitis',       'foot',     'tendon', 2, TRUE,  '0655',    FALSE, NULL,              'Làm bài trước khi đặt chân xuống sàn sáng nay — 90 giây, trên giường.',
 'Bước đầu tiên buổi sáng đau nhất — không phải lỗi của bàn chân. Cân gan bàn chân co lại sau một đêm. Bài kéo giãn đúng chỗ trước khi đứng dậy thay đổi hoàn toàn bước đầu tiên đó.'),

('cond-msk-02-0000-0000-000000000002', 'achilles_tendinopathy','Viêm gân Achilles',          'Achilles Tendinopathy',   'ankle',    'tendon', 3, TRUE,  '0655',    FALSE, NULL,
 'Đau 3–4 khi làm bài là tín hiệu đúng với gân Achilles — không phải cảnh báo dừng lại. Gân cần kích thích để rebuild. Dừng khi đau 5+, không phải 3–4.',
 'Đau gân Achilles không khỏi nếu nghỉ hoàn toàn — gân cần load để tái tạo. Eccentric loading là tiêu chuẩn lâm sàng, không phải rest.'),

('cond-msk-03-0000-0000-000000000003', 'tennis_elbow',        'Viêm lồi cầu ngoài khuỷu tay','Tennis Elbow (Lateral Epicondylitis)', 'elbow', 'tendon', 2, FALSE, NULL, FALSE, NULL, NULL,
 'Đau khuỷu tay khi cầm cốc, vặn tay — không phải lỗi của khuỷu. Cơ cẳng tay đang overloaded. Bài eccentric mục tiêu đúng chỗ.'),

-- Joint track
('cond-msk-04-0000-0000-000000000004', 'lumbar_disc',         'Thoát vị đĩa đệm thắt lưng', 'Lumbar Disc Herniation',  'back',     'joint',  3, TRUE,  '0655',    TRUE,  'prone_press_up',  NULL,
 'Đau lưng dữ dội khi cúi — sai một bài tập có thể làm tệ hơn nhiều. Hãy làm bài direction test trước để FitWell giao đúng protocol.',
 'Không phải mọi đau lưng đều nên tập như nhau. Lumbar disc cần direction-specific exercise — sai hướng = phản tác dụng.'),

('cond-msk-05-0000-0000-000000000005', 'cervical_pain',       'Đau cổ vai gáy',             'Cervical Pain / Neck Pain','neck',     'joint',  2, FALSE, 'desk_45m', FALSE, NULL, NULL,
 'Sau 3 tiếng ngồi, cổ cứng không phải mỏi cơ bình thường — là tư thế đang tạo áp lực sai chỗ. 4 động tác, 5 phút, làm ngay tại bàn.'),

('cond-msk-06-0000-0000-000000000006', 'knee_oa',             'Thoái hóa khớp gối',         'Knee Osteoarthritis',     'knee',     'joint',  2, FALSE, NULL,      FALSE, NULL, NULL,
 'Đau đầu gối lên xuống cầu thang — thường không phải lỗi của đầu gối. Bài đầu tiên là bài hông. Khi hông mạnh hơn, đầu gối tự chịu tải đúng cách.'),

('cond-msk-07-0000-0000-000000000007', 'rotator_cuff',        'Viêm chóp xoay vai',         'Rotator Cuff Syndrome',   'shoulder', 'joint',  3, FALSE, NULL,      TRUE,  'scapular_rhythm', 'Bài strengthening vai chỉ an toàn khi scapula đã ổn định. Làm ngược lại có thể gây impingement.',
 'Đau vai khi giơ tay — scapula rhythm chưa đúng là nguyên nhân chính. Phải ổn định nền trước khi strengthen.'),

('cond-msk-08-0000-0000-000000000008', 'sciatica',            'Đau thần kinh tọa',           'Sciatica',                'back',     'joint',  2, FALSE, NULL,      TRUE,  'slump_test',     NULL,
 'Đau lan từ lưng xuống đùi/chân — thần kinh đang bị chèn. Bài tập sai có thể tăng áp lực. Direction test xác định đúng protocol.'),

('cond-msk-09-0000-0000-000000000009', 'frozen_shoulder',     'Viêm quanh khớp vai (Đông cứng vai)', 'Frozen Shoulder',  'shoulder', 'joint',  3, FALSE, NULL,      FALSE, NULL,
 'Kéo giãn vai khi đang frozen shoulder làm nặng hơn — phản ứng viêm cấp tính. Phase 1 chỉ pendulum. Stretch chờ Phase 2.',
 'Frozen shoulder không khỏi bằng stretch — Phase 1 cần gentile movement, không passive stretch. Stretch đúng thời điểm mới hiệu quả.'),

('cond-msk-10-0000-0000-000000000010', 'wrist_tendinopathy',  'Đau gân cổ tay',              'Wrist Tendinopathy',      'wrist',    'tendon', 2, FALSE, NULL,      FALSE, NULL, NULL,
 'Tê tay khi ngủ, đau cổ tay khi gõ phím — tùy vị trí tê và đau mà nguyên nhân khác nhau. Cần xác định đúng trước khi làm bài.');

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. EXERCISE LIBRARY (10 exercises covering main conditions)
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO exercises (id, slug, name_vi, body_region, trigger_patterns, duration_sec, location, clinical_tags, steps, is_published) VALUES

('ex-000001-0000-0000-0000-000000000001', 'hip_activation_bed', 'Kích hoạt cơ hông trên giường', 'back', ARRAY['morning','after_sitting'], 300, 'bed',
 ARRAY['isometric','low_load','strengthening'],
 '[{"order":1,"instruction_vi":"Nằm ngửa, gối gập 90 độ. Ép hông xuống sàn — giữ 3 giây, thả ra. Lặp lại 10 lần.","duration_sec":60},{"order":2,"instruction_vi":"Giữ nguyên tư thế, nhấc hông lên khỏi giường 5cm — giữ 5 giây. 8 lần.","duration_sec":90},{"order":3,"instruction_vi":"Cầu hông toàn phần: nhấc hông cao nhất có thể — giữ 3 giây. 10 lần.","duration_sec":90},{"order":4,"instruction_vi":"Nằm nghỉ, thở đều 3 nhịp.","duration_sec":60}]',
 TRUE),

('ex-000002-0000-0000-0000-000000000002', 'neck_desk_stretch', 'Kéo giãn cổ tại bàn làm việc', 'neck', ARRAY['after_sitting'], 300, 'desk',
 ARRAY['stretch','low_load','active_rom'],
 '[{"order":1,"instruction_vi":"Ngồi thẳng. Nhìn sang phải, giữ 5 giây. Nhìn sang trái, giữ 5 giây. 5 lần mỗi bên.","duration_sec":90},{"order":2,"instruction_vi":"Cúi tai phải về vai phải, tay phải đặt nhẹ lên đầu — không kéo mạnh. Giữ 10 giây. Đổi bên.","duration_sec":90},{"order":3,"instruction_vi":"Cúi cằm vào ngực, giữ 5 giây. 8 lần.","duration_sec":60},{"order":4,"instruction_vi":"Xoay vai ra sau 10 vòng chậm.","duration_sec":60}]',
 TRUE),

('ex-000003-0000-0000-0000-000000000003', 'plantar_fascia_morning', 'Kéo giãn cân gan bàn chân buổi sáng', 'foot', ARRAY['morning'], 90, 'bed',
 ARRAY['stretch','low_load','passive_rom'],
 '[{"order":1,"instruction_vi":"Ngồi trên giường, gập ngón chân về phía ống chân — giữ 10 giây, thả ra. 10 lần.","duration_sec":60},{"order":2,"instruction_vi":"Lăn bàn chân trên chai nước (hoặc cuộn giấy) 30 giây mỗi chân.","duration_sec":30}]',
 TRUE),

('ex-000004-0000-0000-0000-000000000004', 'alfredson_eccentric', 'Eccentric heel drop (Alfredson)', 'ankle', ARRAY['morning','movement'], 420, 'floor',
 ARRAY['eccentric','moderate_load','strengthening'],
 '[{"order":1,"instruction_vi":"Đứng trên bậc thang, gót chân ra ngoài mép. Nhấc bằng 2 chân, hạ xuống chậm bằng 1 chân trong 3 giây. 15 reps × 3 sets.","duration_sec":300},{"order":2,"instruction_vi":"Nghỉ 1 phút giữa các sets.","duration_sec":120}]',
 TRUE),

('ex-000005-0000-0000-0000-000000000005', 'glute_bridge_standard', 'Cầu hông cơ bản', 'back', ARRAY['morning','after_sitting'], 240, 'floor',
 ARRAY['strengthening','moderate_load','active_rom'],
 '[{"order":1,"instruction_vi":"Nằm ngửa, gối gập, bàn chân đặt sàn. Siết mông, nhấc hông tạo đường thẳng vai-hông-gối. Giữ 2 giây. 12 lần × 3 sets.","duration_sec":180},{"order":2,"instruction_vi":"Nghỉ 30 giây.","duration_sec":60}]',
 TRUE),

('ex-000006-0000-0000-0000-000000000006', 'knee_vmо_chair', 'Tập VMO trên ghế', 'knee', ARRAY['after_sitting','movement'], 300, 'chair',
 ARRAY['strengthening','low_load','isometric'],
 '[{"order":1,"instruction_vi":"Ngồi ghế. Duỗi thẳng chân trái, siết cơ đùi trước 5 giây. 15 lần × 2 sets mỗi chân.","duration_sec":180},{"order":2,"instruction_vi":"Đặt khăn cuộn dưới gối, ép xuống 5 giây × 10 lần. Đổi chân.","duration_sec":120}]',
 TRUE),

('ex-000007-0000-0000-0000-000000000007', 'scapular_wall_slide', 'Trượt vai trên tường', 'shoulder', ARRAY['after_sitting','end_of_day'], 300, 'desk',
 ARRAY['active_rom','low_load','strengthening'],
 '[{"order":1,"instruction_vi":"Đứng sát tường, lưng và khuỷu tay ép tường. Trượt tay lên trên chậm đến hết tầm. Hạ xuống. 12 lần × 3 sets.","duration_sec":240},{"order":2,"instruction_vi":"Giữ ép tường suốt — scapula phải tiếp xúc tường liên tục.","duration_sec":60}]',
 TRUE),

('ex-000008-0000-0000-0000-000000000008', 'dead_bug_isometric', 'Dead bug isometric', 'back', ARRAY['after_sitting','end_of_day'], 300, 'floor',
 ARRAY['isometric','low_load','strengthening'],
 '[{"order":1,"instruction_vi":"Nằm ngửa, tay chỉ thẳng trần, gối gập 90 độ. Ép lưng xuống sàn — giữ trong khi duỗi 1 tay + 1 chân đối diện ra xa. Giữ 5 giây. 8 lần mỗi bên.","duration_sec":240},{"order":2,"instruction_vi":"Không để lưng cong khỏi sàn — đây là điểm mấu chốt.","duration_sec":60}]',
 TRUE),

('ex-000009-0000-0000-0000-000000000009', 'shoulder_pendulum', 'Pendulum vai', 'shoulder', ARRAY['morning','constant'], 180, 'floor',
 ARRAY['pendulum','low_load','active_rom'],
 '[{"order":1,"instruction_vi":"Cúi người 45 độ, tay bị đau thả lõng, lắc nhẹ theo vòng tròn nhỏ dùng trọng lực (không co cơ vai). 30 giây theo chiều kim đồng hồ, 30 giây ngược.","duration_sec":120},{"order":2,"instruction_vi":"Lắc nhẹ trước-sau thêm 30 giây. Đứng thẳng từ từ.","duration_sec":60}]',
 TRUE),

('ex-000010-0000-0000-0000-000000000010', 'wrist_eccentric_flex', 'Eccentric gập cổ tay', 'wrist', ARRAY['after_sitting','end_of_day'], 240, 'desk',
 ARRAY['eccentric','low_load','strengthening'],
 '[{"order":1,"instruction_vi":"Khuỷu tay đặt bàn, tay thòng ra ngoài mép. Tay kia đỡ nâng mu bàn tay lên, sau đó hạ chậm bằng cơ bàn tay trong 3 giây. 15 reps × 3 sets.","duration_sec":180},{"order":2,"instruction_vi":"Nghỉ 30 giây giữa sets.","duration_sec":60}]',
 TRUE);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. TEST USERS
-- ─────────────────────────────────────────────────────────────────────────────
-- User A: Anonymous — mới onboard, đang trong 7-day trial (Day 5)
-- User B: Identified — đã trả tiền, đang dùng (Day 18)
-- User C: Anonymous — re-engagement (skip 3 ngày)

INSERT INTO users (id, anonymous_id, is_anonymous, email, claimed_at, created_at) VALUES
('user-a000-0000-0000-0000-000000000001', 'anon-a000-0000-0000-0000-00000001', TRUE,  NULL, NULL, NOW() - INTERVAL '5 days'),
('user-b000-0000-0000-0000-000000000002', NULL, FALSE, 'minh.nguyen@example.com', NOW() - INTERVAL '18 days', NOW() - INTERVAL '18 days'),
('user-c000-0000-0000-0000-000000000003', 'anon-c000-0000-0000-0000-00000003', TRUE,  NULL, NULL, NOW() - INTERVAL '10 days');

INSERT INTO user_profiles (id, user_id, age_range, occupation, onboarding_completed_at) VALUES
('prof-a000-0000-0000-0000-000000000001', 'user-a000-0000-0000-0000-000000000001', '40-49', 'office', NOW() - INTERVAL '5 days'),
('prof-b000-0000-0000-0000-000000000002', 'user-b000-0000-0000-0000-000000000002', '40-49', 'office', NOW() - INTERVAL '18 days'),
('prof-c000-0000-0000-0000-000000000003', 'user-c000-0000-0000-0000-000000000003', '35-39', 'office', NOW() - INTERVAL '10 days');

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. CONDITIONS (per user)
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO conditions (id, user_id, msk_condition_id, body_regions, trigger_pattern, current_treatments, primary_region, pain_track, display_name_vi, phase_current, assessment_completed, is_active) VALUES

-- User A: đau lưng buổi sáng
('cnd-a001-0000-0000-0000-000000000001', 'user-a000-0000-0000-0000-000000000001',
 'cond-msk-04-0000-0000-000000000004',
 ARRAY['back'], 'morning', ARRAY['endure','massage'], 'back', 'joint', 'Đau lưng dưới', 1, FALSE, TRUE),

-- User B: đau lưng (primary) + cổ vai gáy (secondary)
('cnd-b001-0000-0000-0000-000000000001', 'user-b000-0000-0000-0000-000000000002',
 'cond-msk-04-0000-0000-000000000004',
 ARRAY['back'], 'morning', ARRAY['physio','medication'], 'back', 'joint', 'Đau lưng dưới', 2, TRUE, TRUE),

('cnd-b002-0000-0000-0000-000000000002', 'user-b000-0000-0000-0000-000000000002',
 'cond-msk-05-0000-0000-0000-000000000005',
 ARRAY['neck'], 'after_sitting', ARRAY['massage'], 'neck', 'joint', 'Đau cổ vai gáy', 1, FALSE, TRUE),

-- User C: viêm cân gan bàn chân
('cnd-c001-0000-0000-0000-000000000001', 'user-c000-0000-0000-0000-000000000003',
 'cond-msk-01-0000-0000-0000-000000000001',
 ARRAY['foot'], 'morning', ARRAY['endure'], 'foot', 'tendon', 'Viêm cân gan bàn chân', 1, FALSE, TRUE);

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. PHASE PROGRESS
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO phase_progress (id, user_id, condition_id, phase_number, status, unlock_criteria, phase_started_at) VALUES

-- User A: Phase 1 active
('php-a001-0000-0000-0000-000000000001', 'user-a000-0000-0000-0000-000000000001', 'cnd-a001-0000-0000-0000-000000000001',
 1, 'active', '{"pain_threshold":2,"sustained_days":5}', NOW() - INTERVAL '5 days'),

-- User B: Phase 2 active (graduated from Phase 1)
('php-b001-0000-0000-0000-000000000001', 'user-b000-0000-0000-0000-000000000002', 'cnd-b001-0000-0000-0000-000000000001',
 1, 'completed', '{"pain_threshold":2,"sustained_days":5}', NOW() - INTERVAL '18 days'),
('php-b002-0000-0000-0000-000000000002', 'user-b000-0000-0000-0000-000000000002', 'cnd-b001-0000-0000-0000-000000000001',
 2, 'active', '{"pain_threshold":2,"sustained_days":5}', NOW() - INTERVAL '8 days'),
('php-b003-0000-0000-0000-000000000003', 'user-b000-0000-0000-0000-000000000002', 'cnd-b002-0000-0000-0000-000000000002',
 1, 'active', '{"pain_threshold":2,"sustained_days":5}', NOW() - INTERVAL '18 days'),

-- User C: Phase 1 active
('php-c001-0000-0000-0000-000000000001', 'user-c000-0000-0000-0000-000000000003', 'cnd-c001-0000-0000-0000-000000000001',
 1, 'active', '{"pain_threshold":2,"sustained_days":7}', NOW() - INTERVAL '10 days');

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. PROTOCOLS
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO protocols (id, condition_id, user_id, exercises, ai_reasoning, generation_type, total_duration, difficulty, version, is_current, created_at) VALUES

-- User A: lưng dưới — Phase 1
('prot-a001-0000-0000-0000-000000000001', 'cnd-a001-0000-0000-0000-000000000001', 'user-a000-0000-0000-0000-000000000001',
 '[{"exercise_id":"ex-000001-0000-0000-0000-000000000001","order":1,"duration_sec":300,"notes":"Làm trên giường trước khi đứng dậy"},{"exercise_id":"ex-000005-0000-0000-0000-000000000005","order":2,"duration_sec":240,"notes":"Tăng dần range khi đỡ đau"}]',
 'Morning trigger + lumbar — hip activation first, glute bridge second. Phase 1 joint track.',
 'rule_based', 540, 'easy', 1, TRUE, NOW() - INTERVAL '5 days'),

-- User B: lưng Phase 2
('prot-b001-0000-0000-0000-000000000001', 'cnd-b001-0000-0000-0000-000000000001', 'user-b000-0000-0000-0000-000000000002',
 '[{"exercise_id":"ex-000005-0000-0000-0000-000000000005","order":1,"duration_sec":240,"notes":"Phase 2 — tăng difficulty"},{"exercise_id":"ex-000008-0000-0000-0000-000000000008","order":2,"duration_sec":300,"notes":"Core stability progression"}]',
 'Phase 2 lumbar — glute bridge + dead bug for core stability.',
 'rule_based', 540, 'moderate', 1, TRUE, NOW() - INTERVAL '8 days'),

-- User B: cổ vai gáy
('prot-b002-0000-0000-0000-000000000002', 'cnd-b002-0000-0000-0000-000000000002', 'user-b000-0000-0000-0000-000000000002',
 '[{"exercise_id":"ex-000002-0000-0000-0000-000000000002","order":1,"duration_sec":300,"notes":"Tại bàn, sau mỗi 2 tiếng họp"}]',
 'After_sitting trigger + cervical — desk stretch.',
 'rule_based', 300, 'easy', 1, TRUE, NOW() - INTERVAL '18 days'),

-- User C: cân gan bàn chân
('prot-c001-0000-0000-0000-000000000001', 'cnd-c001-0000-0000-0000-000000000001', 'user-c000-0000-0000-0000-000000000003',
 '[{"exercise_id":"ex-000003-0000-0000-0000-000000000003","order":1,"duration_sec":90,"notes":"Làm trên giường trước khi đứng dậy — bắt buộc"}]',
 'Morning critical timing + tendon track — plantar fascia morning stretch.',
 'rule_based', 90, 'easy', 1, TRUE, NOW() - INTERVAL '10 days');

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. CHECK-INS — User A (5 ngày, pain trend 4→4→3→3→2)
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO checkins (id, user_id, condition_id, pain_score, protocol_id, show_exercise_card, response_type, ai_response, created_at) VALUES

('chk-a001-0000-0000-0000-000000000001', 'user-a000-0000-0000-0000-000000000001', 'cnd-a001-0000-0000-0000-000000000001',
 4, 'prot-a001-0000-0000-0000-000000000001', TRUE, 'standard',
 '{"fear_reduction":"Pattern này rất phổ biến với người ngồi 8 tiếng — không phải dấu hiệu bệnh nặng.","insight":"Lưng không phải lỗi của lưng. Cơ hông yếu đang khiến lưng bù tải suốt ngày.","protocol":"Kích hoạt cơ hông · 5 phút · Nằm trên giường","response_type":"standard","condition_track":"joint","phase_gate_blocked":false,"phase_gate_reason_vi":null}',
 NOW() - INTERVAL '5 days' + INTERVAL '7 hours'),

('chk-a002-0000-0000-0000-000000000002', 'user-a000-0000-0000-0000-000000000001', 'cnd-a001-0000-0000-0000-000000000001',
 4, 'prot-a001-0000-0000-0000-000000000001', TRUE, 'skeptical',
 '{"fear_reduction":"Pattern này rất phổ biến.","insight":"Cơ hông yếu vẫn là nguyên nhân chính.","protocol":"Kích hoạt cơ hông · 5 phút · Nằm trên giường","response_type":"skeptical","condition_track":"joint","phase_gate_blocked":false,"phase_gate_reason_vi":null}',
 NOW() - INTERVAL '4 days' + INTERVAL '7 hours'),

('chk-a003-0000-0000-0000-000000000003', 'user-a000-0000-0000-0000-000000000001', 'cnd-a001-0000-0000-0000-000000000001',
 3, 'prot-a001-0000-0000-0000-000000000001', TRUE, 'standard',
 '{"fear_reduction":"Giảm xuống 3 — đang đúng hướng.","insight":"Cơ hông đang bắt đầu respond.","protocol":"Cầu hông cơ bản · 4 phút · Nằm trên giường","response_type":"standard","condition_track":"joint","phase_gate_blocked":false,"phase_gate_reason_vi":null}',
 NOW() - INTERVAL '3 days' + INTERVAL '7 hours'),

('chk-a004-0000-0000-0000-000000000004', 'user-a000-0000-0000-0000-000000000001', 'cnd-a001-0000-0000-0000-000000000001',
 3, 'prot-a001-0000-0000-0000-000000000001', TRUE, 'standard',
 '{"fear_reduction":"Mức 3 — ổn để làm bài.","insight":null,"protocol":"Kích hoạt cơ hông · 5 phút · Nằm trên giường","response_type":"standard","condition_track":"joint","phase_gate_blocked":false,"phase_gate_reason_vi":null}',
 NOW() - INTERVAL '2 days' + INTERVAL '7 hours'),

('chk-a005-0000-0000-0000-000000000005', 'user-a000-0000-0000-0000-000000000001', 'cnd-a001-0000-0000-0000-000000000001',
 2, 'prot-a001-0000-0000-0000-000000000001', TRUE, 'positive_trajectory',
 '{"fear_reduction":null,"insight":null,"protocol":"Kích hoạt cơ hông · 5 phút · Nằm trên giường","response_type":"positive_trajectory","condition_track":"joint","phase_gate_blocked":false,"phase_gate_reason_vi":null}',
 NOW() - INTERVAL '1 day' + INTERVAL '7 hours');

-- ─────────────────────────────────────────────────────────────────────────────
-- 8. SESSIONS — User A (4/5 ngày hoàn thành bài)
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO sessions (id, user_id, protocol_id, status, current_step, started_at, completed_at, completion_pct, feedback, source) VALUES

('sess-a001-0000-0000-0000-000000000001', 'user-a000-0000-0000-0000-000000000001', 'prot-a001-0000-0000-0000-000000000001',
 'completed', 4, NOW() - INTERVAL '5 days' + INTERVAL '7 hours 5 minutes', NOW() - INTERVAL '5 days' + INTERVAL '7 hours 14 minutes', 100, 'same', 'checkin'),

('sess-a002-0000-0000-0000-000000000002', 'user-a000-0000-0000-0000-000000000001', 'prot-a001-0000-0000-0000-000000000001',
 'exited', 2, NOW() - INTERVAL '4 days' + INTERVAL '7 hours 5 minutes', NULL, 50, NULL, 'checkin'),

('sess-a003-0000-0000-0000-000000000003', 'user-a000-0000-0000-0000-000000000001', 'prot-a001-0000-0000-0000-000000000001',
 'completed', 4, NOW() - INTERVAL '3 days' + INTERVAL '7 hours 5 minutes', NOW() - INTERVAL '3 days' + INTERVAL '7 hours 13 minutes', 100, 'better', 'checkin'),

('sess-a004-0000-0000-0000-000000000004', 'user-a000-0000-0000-0000-000000000001', 'prot-a001-0000-0000-0000-000000000001',
 'completed', 4, NOW() - INTERVAL '2 days' + INTERVAL '7 hours 5 minutes', NOW() - INTERVAL '2 days' + INTERVAL '7 hours 12 minutes', 100, 'better', 'checkin'),

('sess-a005-0000-0000-0000-000000000005', 'user-a000-0000-0000-0000-000000000001', 'prot-a001-0000-0000-0000-000000000001',
 'completed', 4, NOW() - INTERVAL '1 day' + INTERVAL '7 hours 5 minutes', NOW() - INTERVAL '1 day' + INTERVAL '7 hours 11 minutes', 100, 'better', 'checkin');

-- ─────────────────────────────────────────────────────────────────────────────
-- 9. SUBSCRIPTION — User B (paid, 1-year plan)
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO subscriptions (id, user_id, plan_type, status, amount_vnd, started_at, expires_at, payos_order_id) VALUES
('sub-b001-0000-0000-0000-000000000001', 'user-b000-0000-0000-0000-000000000002',
 '1year', 'active', 990000, NOW() - INTERVAL '18 days', NOW() + INTERVAL '347 days', 'FW20260301001');

-- ─────────────────────────────────────────────────────────────────────────────
-- 10. NOTIFICATION SCHEDULES
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO notification_schedules (id, user_id, type, scheduled_time, is_active, channel) VALUES
('notif-a01-0000-0000-0000-000000000001', 'user-a000-0000-0000-0000-000000000001', 'morning_checkin', '07:00:00', TRUE, 'in_app_banner'),
('notif-a02-0000-0000-0000-000000000002', 'user-a000-0000-0000-0000-000000000001', 'post_work',       '17:00:00', TRUE, 'in_app_banner'),
('notif-b01-0000-0000-0000-000000000001', 'user-b000-0000-0000-0000-000000000002', 'morning_checkin', '06:55:00', TRUE, 'web_push'),
('notif-b02-0000-0000-0000-000000000002', 'user-b000-0000-0000-0000-000000000002', 'morning_critical_655', '06:55:00', TRUE, 'web_push');

-- ─────────────────────────────────────────────────────────────────────────────
-- 11. PATTERN OBSERVATIONS — User B (day 18, 2 patterns)
-- ─────────────────────────────────────────────────────────────────────────────

INSERT INTO pattern_observations (id, user_id, condition_id, pattern_type, description_vi, trigger_label, confidence, first_observed, last_confirmed, is_dismissed) VALUES
('pat-b001-0000-0000-0000-000000000001', 'user-b000-0000-0000-0000-000000000002', 'cnd-b001-0000-0000-0000-000000000001',
 'deadline_pattern',
 'Nhận ra: lưng hay nặng hơn sau deadline cuối quý. Lần này sẽ nhắc trước 1 tuần — bạn quyết định làm gì với thông tin đó.',
 'quarter_deadline', 78, NOW() - INTERVAL '4 days', NOW() - INTERVAL '1 day', FALSE),

('pat-b002-0000-0000-0000-000000000002', 'user-b000-0000-0000-0000-000000000002', 'cnd-b002-0000-0000-0000-000000000002',
 'sitting_duration',
 'Nhận ra: cổ cứng hơn sau ngày có 3+ tiếng họp liên tiếp. Bạn quyết định làm gì với thông tin đó.',
 'long_meeting_day', 72, NOW() - INTERVAL '7 days', NOW() - INTERVAL '2 days', FALSE);

-- ─────────────────────────────────────────────────────────────────────────────
-- VERIFY
-- ─────────────────────────────────────────────────────────────────────────────

DO $$
BEGIN
  ASSERT (SELECT COUNT(*) FROM msk_conditions) = 10,  'msk_conditions: expected 10';
  ASSERT (SELECT COUNT(*) FROM exercises)       = 10,  'exercises: expected 10';
  ASSERT (SELECT COUNT(*) FROM users)           = 3,   'users: expected 3';
  ASSERT (SELECT COUNT(*) FROM conditions)      = 4,   'conditions: expected 4';
  ASSERT (SELECT COUNT(*) FROM protocols)       = 4,   'protocols: expected 4';
  ASSERT (SELECT COUNT(*) FROM checkins)        = 5,   'checkins: expected 5';
  ASSERT (SELECT COUNT(*) FROM sessions)        = 5,   'sessions: expected 5';
  RAISE NOTICE 'Seed verified OK';
END $$;
