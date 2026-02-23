import React from 'react';
import { ArrowLeft, Play } from 'lucide-react';

interface ActionLibraryCategoryScreenProps {
  categoryId: string;
  onBack: () => void;
  onNavigate: (screen: string, actionId?: string) => void;
  onRunSequence: (categoryId: string) => void;
}

interface CategoryAction {
  id: string;
  name: string;
  duration: string;
  rationale: string; // Full rationale (2-3 lines)
  videoThumbnailUrl: string;
}

interface Category {
  id: string;
  name: string; // Display name
  description: string;
  actions: CategoryAction[];
}

// Mock category data
const CATEGORIES: Record<string, Category> = {
  'phuc-hoi': {
    id: 'phuc-hoi',
    name: 'Heavy Night Recovery',
    description: '3 hành động · Khi buổi sáng sau nhậu nặng cần phục hồi nhanh',
    actions: [
      {
        id: 'knee-hugs',
        name: 'Supine Knee Hugs',
        duration: '3:00',
        rationale: 'Ruột của bạn đang xử lý bữa nặng cả đêm. Kích thích nhẹ nhàng giúp tiêu hóa hoạt động trở lại.',
        videoThumbnailUrl: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=96&h=128&fit=crop',
      },
      {
        id: 'breathing-reset',
        name: 'Breathing Reset',
        duration: '3:00',
        rationale: 'Oxy hoá giúp gan làm việc nhanh hơn 40%. Thở sâu tăng lưu lượng máu đến gan.',
        videoThumbnailUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=96&h=128&fit=crop',
      },
      {
        id: 'light-walk',
        name: 'Light Walk',
        duration: '15:00',
        rationale: 'Tuần hoàn máu giúp đào thải mỡ nhanh hơn. Gan cần máu để xử lý độc tố từ rượu.',
        videoThumbnailUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=96&h=128&fit=crop',
      },
    ],
  },
  'sang': {
    id: 'sang',
    name: 'Morning Activation',
    description: '4 hành động · Khởi động cơ thể và trao đổi chất sau giấc ngủ',
    actions: [
      {
        id: 'wall-sit',
        name: 'Wall Sit',
        duration: '2:00',
        rationale: 'Cơ bắp là bể chứa đường trong máu. Kích hoạt cơ lớn giúp tăng nhạy cảm insulin suốt ngày.',
        videoThumbnailUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=96&h=128&fit=crop',
      },
      {
        id: 'water-break',
        name: 'Hydration Break',
        duration: '5:00',
        rationale: 'Gan cần nước để xử lý độc tố tích tụ qua đêm. Uống nước ấm kích hoạt tiêu hóa.',
        videoThumbnailUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=96&h=128&fit=crop',
      },
      {
        id: 'morning-sun',
        name: 'Morning Sunlight',
        duration: '10:00',
        rationale: 'Ánh sáng sáng điều chỉnh nhịp sinh học, cải thiện giấc ngủ tối và trao đổi chất ban ngày.',
        videoThumbnailUrl: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=96&h=128&fit=crop',
      },
      {
        id: 'deep-squat',
        name: 'Deep Squat Hold',
        duration: '2:00',
        rationale: 'Kích hoạt cơ lớn nhất (đùi, mông) tăng nhạy insulin và tiêu hao đường máu hiệu quả.',
        videoThumbnailUrl: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=96&h=128&fit=crop',
      },
    ],
  },
  'van-phong': {
    id: 'van-phong',
    name: 'Office Movement',
    description: '10 hành động · Ngắt quãng ngồi lâu và duy trì tuần hoàn máu',
    actions: [
      {
        id: 'calf-raises',
        name: 'Calf Raises',
        duration: '2:00',
        rationale: 'Ngăn máu ứ đọng ở chân khi ngồi lâu. Bơm máu trở về tim giúp tăng tập trung.',
        videoThumbnailUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=96&h=128&fit=crop',
      },
      {
        id: 'desk-pushup',
        name: 'Desk Push-Up',
        duration: '1:30',
        rationale: 'Kích hoạt cơ ngực và vai sau giờ ngồi gù. Cải thiện tư thế và tuần hoàn máu.',
        videoThumbnailUrl: 'https://images.unsplash.com/photo-1571019613576-2b22c76fd955?w=96&h=128&fit=crop',
      },
      {
        id: 'shoulder-rolls',
        name: 'Shoulder Rolls',
        duration: '1:00',
        rationale: 'Giải phóng căng thẳng vai gáy từ tư thế ngồi máy tính. Giảm đau đầu căng thẳng.',
        videoThumbnailUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=96&h=128&fit=crop',
      },
      // Add more office actions...
    ],
  },
  'sau-an': {
    id: 'sau-an',
    name: 'Post-Meal Protocol',
    description: '1 hành động · Kiểm soát đường huyết sau bữa ăn',
    actions: [
      {
        id: 'post-meal-walk',
        name: 'Post-Meal Walk',
        duration: '15:00',
        rationale: 'Đi bộ sau ăn giảm đường huyết 30%. Cơ bắp sử dụng đường từ máu mà không cần insulin.',
        videoThumbnailUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=96&h=128&fit=crop',
      },
    ],
  },
  'cang-thang': {
    id: 'cang-thang',
    name: 'Stress Reset',
    description: '2 hành động · Giảm cortisol và kích hoạt thần kinh phó giao cảm',
    actions: [
      {
        id: 'breathing-reset',
        name: 'Breathing Reset',
        duration: '3:00',
        rationale: 'Thở sâu kích hoạt thần kinh phó giao cảm, giảm cortisol và đường huyết do căng thẳng.',
        videoThumbnailUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=96&h=128&fit=crop',
      },
      {
        id: 'neck-release',
        name: 'Neck Release',
        duration: '2:00',
        rationale: 'Giải phóng căng thẳng cổ và đầu. Cải thiện lưu lượng máu đến não, giảm đau đầu.',
        videoThumbnailUrl: 'https://images.unsplash.com/photo-1520877880798-5ee002a3122e?w=96&h=128&fit=crop',
      },
    ],
  },
  'ngu': {
    id: 'ngu',
    name: 'Sleep Preparation',
    description: '2 hành động · Chuẩn bị cơ thể cho giấc ngủ sâu và phục hồi',
    actions: [
      {
        id: 'sleep-prep',
        name: 'Sleep Preparation',
        duration: '5:00',
        rationale: 'Chuẩn bị cơ thể cho giấc ngủ sâu. Giảm nhịp tim và nhiệt độ cơ thể để dễ ngủ.',
        videoThumbnailUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=96&h=128&fit=crop',
      },
      {
        id: 'pre-sleep-stretch',
        name: 'Pre-Sleep Stretch',
        duration: '5:00',
        rationale: 'Thư giãn cơ bắp trước khi ngủ. Giảm căng thẳng tích tụ trong ngày để ngủ ngon.',
        videoThumbnailUrl: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=96&h=128&fit=crop',
      },
    ],
  },
  'cong-tac': {
    id: 'cong-tac',
    name: 'Travel Routine',
    description: '2 hành động · Duy trì vận động khi công tác hoặc di chuyển',
    actions: [
      {
        id: 'travel-stretch',
        name: 'Travel Stretch',
        duration: '3:00',
        rationale: 'Giảm đau lưng sau chuyến bay dài. Kéo giãn cột sống và hông sau khi ngồi lâu.',
        videoThumbnailUrl: 'https://images.unsplash.com/photo-1575052814074-d9b7bc652034?w=96&h=128&fit=crop',
      },
      {
        id: 'hotel-room-routine',
        name: 'Hotel Room Routine',
        duration: '8:00',
        rationale: 'Duy trì vận động khi đi công tác. Không cần dụng cụ, có thể làm trong phòng khách sạn.',
        videoThumbnailUrl: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=96&h=128&fit=crop',
      },
    ],
  },
};

export function ActionLibraryCategoryScreen({
  categoryId,
  onBack,
  onNavigate,
  onRunSequence,
}: ActionLibraryCategoryScreenProps) {
  const category = CATEGORIES[categoryId];

  if (!category) {
    return (
      <div style={{ padding: '20px' }}>
        <button onClick={onBack}>← Back</button>
        <p>Category not found</p>
      </div>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#F5F5F5',
        overflow: 'auto',
        paddingBottom: '72px', // Bottom nav clearance
      }}
    >
      {/* Back arrow - top-left */}
      <div style={{ padding: '16px 20px 0' }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Back"
        >
          <ArrowLeft size={24} color="#041E3A" strokeWidth={1.5} />
        </button>
      </div>

      {/* Category header card - Navy background */}
      <div
        style={{
          backgroundColor: '#041E3A',
          padding: '32px',
          borderRadius: '0',
          marginBottom: '16px',
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            fontWeight: 400,
            letterSpacing: '0.5px',
            color: '#9D9FA3',
            textTransform: 'uppercase',
            marginBottom: '4px',
            lineHeight: '1.0',
          }}
        >
          DANH MỤC
        </div>

        {/* Category name */}
        <h1
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '22px',
            fontWeight: 600,
            color: '#FFFFFF',
            lineHeight: 1.3,
            margin: '0 0 8px 0',
          }}
        >
          {category.name}
        </h1>

        {/* Description */}
        <p
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '15px',
            fontWeight: 400,
            color: 'rgba(255, 255, 255, 0.70)',
            lineHeight: 1.5,
            margin: '0 0 16px 0',
          }}
        >
          {category.description}
        </p>

        {/* Run all CTA - only if 2+ actions */}
        {category.actions.length > 1 && (
          <button
            onClick={() => onRunSequence(categoryId)}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: '1px solid #FFFFFF',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.5px',
              color: '#FFFFFF',
              textTransform: 'uppercase',
              cursor: 'pointer',
              padding: '0 0 2px 0',
              lineHeight: '1.0',
            }}
          >
            CHẠY CẢ {category.actions.length}
          </button>
        )}
      </div>

      {/* Action list - Vertical stack */}
      <div style={{ padding: '0 20px' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {category.actions.map((action) => (
            <div
              key={action.id}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #EBEBF0',
                borderRadius: '4px',
                padding: '16px',
                display: 'flex',
                gap: '16px',
              }}
            >
              {/* Video thumbnail - Left side (96×128px) */}
              <div
                style={{
                  position: 'relative',
                  width: '96px',
                  height: '128px',
                  flexShrink: 0,
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}
              >
                {/* Thumbnail image */}
                <img
                  src={action.videoThumbnailUrl}
                  alt={action.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />

                {/* Light navy overlay */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(4, 30, 58, 0.30)',
                  }}
                />

                {/* Play icon + duration - bottom-left */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '8px',
                    left: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Play
                    size={10}
                    style={{
                      color: '#FFFFFF',
                      fill: '#FFFFFF',
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      fontWeight: 400,
                      color: '#FFFFFF',
                      lineHeight: '1.0',
                    }}
                  >
                    {action.duration}
                  </span>
                </div>
              </div>

              {/* Text content - Right side */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Action name */}
                <div
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '17px',
                    fontWeight: 600,
                    color: '#041E3A',
                    lineHeight: 1.3,
                    marginBottom: '4px',
                  }}
                >
                  {action.name}
                </div>

                {/* Duration */}
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fontWeight: 400,
                    color: '#9D9FA3',
                    marginBottom: '8px',
                    lineHeight: '1.0',
                  }}
                >
                  {action.duration}
                </div>

                {/* Full rationale - 2-3 lines */}
                <div
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '13px',
                    fontWeight: 400,
                    color: '#9D9FA3',
                    lineHeight: 1.5,
                    marginBottom: '12px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {action.rationale}
                </div>

                {/* CTA button */}
                <button
                  onClick={() => onNavigate('microAction', action.id)}
                  style={{
                    width: '100%',
                    height: '40px',
                    backgroundColor: '#041E3A',
                    border: 'none',
                    borderRadius: '4px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    fontWeight: 500,
                    color: '#FFFFFF',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    cursor: 'pointer',
                    transition: 'background-color 150ms ease-out',
                    lineHeight: '1.0',
                    marginTop: 'auto',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#0A3055';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#041E3A';
                  }}
                >
                  BẮT ĐẦU
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
