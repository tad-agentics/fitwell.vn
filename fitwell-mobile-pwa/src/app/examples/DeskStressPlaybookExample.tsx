import React from 'react';
import { DeskStressPlaybookScreen } from '../components';

/**
 * Example usage of DeskStressPlaybookScreen
 * 
 * Shows two variants:
 * 1. Desk Marathon scenario (VĂN PHÒNG category)
 * 2. Stress Week scenario (CĂNG THẲNG category)
 */

// Example 1: Desk Marathon Scenario
export function DeskMarathonPlaybookExample() {
  const handleStart = () => {
    console.log('Desk marathon scenario started');
    // Would log to scenario_sessions table
  };

  return (
    <DeskStressPlaybookScreen
      category="VĂN PHÒNG"
      scenarioName="Ngày Làm Việc 10 Tiếng"
      riskLevel="3/5"
      riskConditions="Nguy cơ lưng + căng thẳng"
      preStartSteps={[
        'Đặt timer nhắc đứng dậy mỗi 90 phút',
        'Chuẩn bị nước 1.5L trên bàn',
        'Kiểm tra tư thế ngồi — lưng chạm lưng ghế, chân chạm sàn',
      ]}
      rules={[
        'Đứng dậy mỗi 90 phút, dù chỉ 30 giây',
        'Ăn trưa ngoài bàn — đi bộ 5 phút sau ăn',
        'Thở 4-7-8 sau cuộc họp căng thẳng',
      ]}
      deskBreaks={[
        {
          time: '10:30',
          action: 'Đứng dậy + nhón gót 2 phút',
        },
        {
          time: '12:00',
          action: 'Ăn trưa ngoài bàn + đi bộ 5 phút',
        },
        {
          time: '15:00',
          action: 'Duỗi lưng đứng 2 phút',
        },
        {
          time: '17:00',
          action: 'Xoay lưng ngực 3 phút',
        },
      ]}
      avoidItems={[
        'Ngồi liên tục hơn 2 tiếng mà không đứng dậy — đây là ngưỡng mà insulin sensitivity bắt đầu giảm.',
        'Ăn trưa tại bàn làm việc — não không nhận tín hiệu "nghỉ", cortisol vẫn cao.',
      ]}
      fallbackAction="Nếu đã qua 4 tiếng không nghỉ: bài Lumbar Floor Release 3 phút khi về nhà."
      onStart={handleStart}
    />
  );
}

// Example 2: Stress Week Scenario
export function StressWeekPlaybookExample() {
  const handleStart = () => {
    console.log('Stress week scenario started');
    // Would log to scenario_sessions table
  };

  return (
    <DeskStressPlaybookScreen
      category="CĂNG THẲNG"
      scenarioName="Tuần Deadline Liên Tục"
      riskLevel="4/5"
      riskConditions="Nguy cơ căng thẳng + ngủ kém"
      preStartSteps={[
        'Chặn lịch 15 phút thở sâu mỗi sáng trước họp',
        'Tắt thông báo Slack sau 19:00',
        'Chuẩn bị snack chống cortisol (hạnh nhân, chuối, sô-cô-la đen 70%)',
      ]}
      rules={[
        'Thở 4-7-8 trước mỗi cuộc họp quan trọng',
        'Không làm việc sau 21:00 — cortisol cao ban đêm phá giấc ngủ',
        'Viết 3 việc ưu tiên mỗi sáng — giảm quyết định vặt',
      ]}
      deskBreaks={[
        {
          time: '09:00',
          action: 'Thở 4-7-8 (3 phút) trước họp đầu tiên',
        },
        {
          time: '12:00',
          action: 'Ăn trưa chậm — 20 phút không màn hình',
        },
        {
          time: '15:00',
          action: 'Đi bộ 5 phút ngoài trời (ánh sáng tự nhiên)',
        },
        {
          time: '18:00',
          action: 'Viết 3 việc hoàn thành hôm nay — kết thúc tâm lý',
        },
      ]}
      avoidItems={[
        'Caffeine sau 15:00 — cortisol cao + caffeine = không ngủ được tối.',
        'Làm việc liên tục không nghỉ "để xong nhanh" — cortisol tăng, hiệu suất giảm, mất nhiều thời gian hơn.',
      ]}
      fallbackAction="Nếu đã căng thẳng suốt ngày: bài Box Breathing 5 phút trước ngủ + tắt điện thoại sớm 30 phút."
      onStart={handleStart}
    />
  );
}
