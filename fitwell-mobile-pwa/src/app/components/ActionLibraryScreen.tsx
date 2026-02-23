import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { vibrate } from '../../utils/pwa';

interface ActionLibraryScreenProps {
  onNavigate: (screen: string, actionId?: string) => void;
  onSelectCategory?: (categoryId: string) => void;
}

interface MicroAction {
  id: string;
  name: string;
  category: string;
  duration: string; // "2:00" format
  rationale: string;
  videoThumbnailUrl: string;
  contextTags: string[]; // ['office', 'private', 'transit']
}

// Mock data - all 24 micro-actions
const ALL_ACTIONS: MicroAction[] = [
  {
    id: 'wall-sit',
    name: 'Wall Sit',
    category: 'SÁNG',
    duration: '2:00',
    rationale: 'Cơ bắp là bể chứa đường trong máu',
    videoThumbnailUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=173&h=230&fit=crop',
    contextTags: ['office', 'private'],
  },
  {
    id: 'knee-hugs',
    name: 'Supine Knee Hugs',
    category: 'PHỤC HỒI',
    duration: '3:00',
    rationale: 'Kích thích tiêu hóa trước khi ra khỏi giường',
    videoThumbnailUrl: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=173&h=230&fit=crop',
    contextTags: ['private'],
  },
  {
    id: 'calf-raises',
    name: 'Calf Raises',
    category: 'VĂN PHÒNG',
    duration: '2:00',
    rationale: 'Ngăn máu ứ đọng ở chân khi ngồi lâu',
    videoThumbnailUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=173&h=230&fit=crop',
    contextTags: ['office', 'private'],
  },
  {
    id: 'breathing-reset',
    name: 'Breathing Reset',
    category: 'CĂNG THẲNG',
    duration: '3:00',
    rationale: 'Oxy hoá giúp gan làm việc nhanh hơn 40%',
    videoThumbnailUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=173&h=230&fit=crop',
    contextTags: ['office', 'private', 'transit'],
  },
  {
    id: 'desk-pushup',
    name: 'Desk Push-Up',
    category: 'VĂN PHÒNG',
    duration: '1:30',
    rationale: 'Kích hoạt cơ ngực và vai sau giờ ngồi',
    videoThumbnailUrl: 'https://images.unsplash.com/photo-1571019613576-2b22c76fd955?w=173&h=230&fit=crop',
    contextTags: ['office'],
  },

  {
    id: 'shoulder-rolls',
    name: 'Shoulder Rolls',
    category: 'VĂN PHÒNG',
    duration: '1:00',
    rationale: 'Giải phóng căng thẳng vai gáy',
    videoThumbnailUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=173&h=230&fit=crop',
    contextTags: ['office', 'private', 'transit'],
  },
  {
    id: 'water-break',
    name: 'Hydration Break',
    category: 'SÁNG',
    duration: '5:00',
    rationale: 'Gan cần nước để xử lý độc tố sau rượu',
    videoThumbnailUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=173&h=230&fit=crop',
    contextTags: ['office', 'private'],
  },
  // Add more actions to reach 21 total
  {
    id: 'sleep-prep',
    name: 'Sleep Preparation',
    category: 'NGỦ',
    duration: '5:00',
    rationale: 'Chuẩn bị cơ thể cho giấc ngủ sâu',
    videoThumbnailUrl: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=173&h=230&fit=crop',
    contextTags: ['private'],
  },

  {
    id: 'standing-quad',
    name: 'Standing Quad Stretch',
    category: 'VĂN PHÒNG',
    duration: '2:00',
    rationale: 'Kéo giãn cơ đùi sau khi ngồi lâu',
    videoThumbnailUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=173&h=230&fit=crop',
    contextTags: ['office', 'private'],
  },
  {
    id: 'neck-release',
    name: 'Neck Release',
    category: 'CĂNG THẲNG',
    duration: '2:00',
    rationale: 'Giải phóng căng thẳng cổ và đầu',
    videoThumbnailUrl: 'https://images.unsplash.com/photo-1520877880798-5ee002a3122e?w=173&h=230&fit=crop',
    contextTags: ['office', 'private', 'transit'],
  },
  {
    id: 'ankle-circles',
    name: 'Ankle Circles',
    category: 'VĂN PHÒNG',
    duration: '1:30',
    rationale: 'Cải thiện tuần hoàn máu ở bàn chân',
    videoThumbnailUrl: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=173&h=230&fit=crop',
    contextTags: ['office', 'private', 'transit'],
  },
  {
    id: 'chair-twist',
    name: 'Seated Spinal Twist',
    category: 'VĂN PHÒNG',
    duration: '2:00',
    rationale: 'Xoay cột sống giúp tiêu hóa tốt hơn',
    videoThumbnailUrl: 'https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?w=173&h=230&fit=crop',
    contextTags: ['office', 'private'],
  },
  {
    id: 'morning-sun',
    name: 'Morning Sunlight',
    category: 'SÁNG',
    duration: '10:00',
    rationale: 'Ánh sáng sáng điều chỉnh nhịp sinh học',
    videoThumbnailUrl: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=173&h=230&fit=crop',
    contextTags: ['private', 'transit'],
  },
  {
    id: 'deep-squat',
    name: 'Deep Squat Hold',
    category: 'SÁNG',
    duration: '2:00',
    rationale: 'Kích hoạt cơ lớn, tăng nhạy insulin',
    videoThumbnailUrl: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?w=173&h=230&fit=crop',
    contextTags: ['private'],
  },
  {
    id: 'desk-plank',
    name: 'Desk Plank',
    category: 'VĂN PHÒNG',
    duration: '1:00',
    rationale: 'Tăng cường cơ core giữa ngày làm việc',
    videoThumbnailUrl: 'https://images.unsplash.com/photo-1611672585731-fa10603fb9e0?w=173&h=230&fit=crop',
    contextTags: ['office'],
  },
  {
    id: 'eye-rest',
    name: 'Eye Rest (20-20-20)',
    category: 'VĂN PHÒNG',
    duration: '1:00',
    rationale: 'Giảm mỏi mắt từ màn hình máy tính',
    videoThumbnailUrl: 'https://images.unsplash.com/photo-1617791160536-598cf32026fb?w=173&h=230&fit=crop',
    contextTags: ['office', 'private'],
  },
  {
    id: 'pre-sleep-stretch',
    name: 'Pre-Sleep Stretch',
    category: 'NGỦ',
    duration: '5:00',
    rationale: 'Thư giãn cơ bắp trước khi ngủ',
    videoThumbnailUrl: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?w=173&h=230&fit=crop',
    contextTags: ['private'],
  },

  {
    id: 'post-alcohol-recovery',
    name: 'Post-Alcohol Recovery',
    category: 'PHỤC HỒI',
    duration: '15:00',
    rationale: 'Hỗ trợ gan sau sự kiện nhậu nặng',
    videoThumbnailUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=173&h=230&fit=crop',
    contextTags: ['private'],
  },
  // NEW: 3 additional actions for 24 total
  {
    id: 'morning-hydration',
    name: 'Uống Nước Buổi Sáng',
    category: 'SÁNG',
    duration: '3:00',
    rationale: 'Bù nước sau 8 giờ ngủ, khởi động trao đổi chất',
    videoThumbnailUrl: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=173&h=230&fit=crop', // Kitchen environment
    contextTags: ['private'],
  },
  {
    id: 'ankle-toe-mobility',
    name: 'Cử Động Mắt Cá & Ngón Cái',
    category: 'VĂN PHÒNG',
    duration: '2:00',
    rationale: 'Cải thiện tuần hoàn và phòng ngừa chuột rút',
    videoThumbnailUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=173&h=230&fit=crop', // Outdoor/corridor
    contextTags: ['office', 'private', 'transit'],
  },
  {
    id: 'post-heavy-night-hydration',
    name: 'Bù Nước Sau Đêm Nặng',
    category: 'PHỤC HỒI',
    duration: '5:00',
    rationale: 'Bù nước và điện giải sau khi nhậu nặng',
    videoThumbnailUrl: 'https://images.unsplash.com/photo-1585828211110-5f6beaa14c02?w=173&h=230&fit=crop', // Kitchen environment
    contextTags: ['private'],
  },
  // Condition-specific actions
  {
    id: 'low-impact-walk',
    name: 'Đi Bộ Nhẹ Nhàng',
    category: 'AXIT URIC',
    duration: '15:00',
    rationale: 'Tăng tuần hoàn giúp thận đào thải axit uric',
    videoThumbnailUrl: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=173&h=230&fit=crop',
    contextTags: ['private', 'transit'],
  },
  {
    id: 'cherry-juice-hydration',
    name: 'Uống Nước Cherry',
    category: 'AXIT URIC',
    duration: '2:00',
    rationale: 'Cherry tự nhiên giảm axit uric trong máu',
    videoThumbnailUrl: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=173&h=230&fit=crop',
    contextTags: ['private'],
  },
  {
    id: 'gentle-cardio',
    name: 'Tim Mạch Nhẹ',
    category: 'MỠ MÁU',
    duration: '10:00',
    rationale: 'Cardio giảm triglyceride và cholesterol xấu',
    videoThumbnailUrl: 'https://images.unsplash.com/photo-1483721310020-03333e577078?w=173&h=230&fit=crop',
    contextTags: ['private'],
  },
  {
    id: 'interval-stairs',
    name: 'Bước Cầu Thang',
    category: 'MỠ MÁU',
    duration: '5:00',
    rationale: 'Interval ngắn cải thiện lipid profile nhanh',
    videoThumbnailUrl: 'https://images.unsplash.com/photo-1486218119243-13883505764c?w=173&h=230&fit=crop',
    contextTags: ['office', 'private'],
  },
  {
    id: 'lumbar-decompression',
    name: 'Nằm Thư Giãn Thắt Lưng',
    category: 'LƯNG',
    duration: '3:00',
    rationale: 'Giảm áp lực đĩa đệm L4-L5 sau ngồi lâu',
    videoThumbnailUrl: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?w=173&h=230&fit=crop',
    contextTags: ['private'],
  },
  {
    id: 'doorway-chest-opener',
    name: 'Mở Ngực Khung Cửa',
    category: 'LƯNG',
    duration: '2:00',
    rationale: 'Mở ngực giúp giảm cong lưng do ngồi nhiều',
    videoThumbnailUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=173&h=230&fit=crop',
    contextTags: ['office', 'private'],
  },
  {
    id: 'standing-thoracic-rotation',
    name: 'Xoay Lưng Ngực Đứng',
    category: 'LƯNG',
    duration: '3:00',
    rationale: 'Khôi phục khả năng xoay của cột sống ngực',
    videoThumbnailUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=173&h=230&fit=crop',
    contextTags: ['office', 'private'],
  },
];

const CATEGORIES = ['TẤT CẢ', 'SÁNG', 'AXIT URIC', 'MỠ MÁU', 'LƯNG', 'CĂNG THẲNG', 'NGỦ', 'PHỤC HỒI', 'VĂN PHÒNG'];

// Map category labels to IDs for navigation
const CATEGORY_TO_ID: Record<string, string> = {
  'TẤT CẢ': 'tat-ca',
  'SÁNG': 'sang',
  'AXIT URIC': 'axit-uric',
  'MỠ MÁU': 'mo-mau',
  'LƯNG': 'lung',
  'CĂNG THẲNG': 'cang-thang',
  'NGỦ': 'ngu',
  'PHỤC HỒI': 'phuc-hoi',
  'VĂN PHÒNG': 'van-phong',
};

const CONTEXT_FILTERS = [
  { id: 'office', label: 'Văn phòng' },
  { id: 'private', label: 'Riêng tư' },
  { id: 'transit', label: 'Di chuyển' },
];

export function ActionLibraryScreen({ onNavigate, onSelectCategory }: ActionLibraryScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState('TẤT CẢ');
  const [selectedContexts, setSelectedContexts] = useState<string[]>([]);

  // Filter actions based on selected category and contexts
  const filteredActions = ALL_ACTIONS.filter((action) => {
    const categoryMatch = selectedCategory === 'TẤT CẢ' || action.category === selectedCategory;
    const contextMatch = selectedContexts.length === 0 || 
      selectedContexts.some(ctx => action.contextTags.includes(ctx));
    return categoryMatch && contextMatch;
  });

  const toggleContext = (contextId: string) => {
    setSelectedContexts(prev => 
      prev.includes(contextId) 
        ? prev.filter(c => c !== contextId)
        : [...prev, contextId]
    );
  };

  return (
    <div className="fw-screen fw-bg-surface" style={{ overflow: 'auto', paddingBottom: '72px' }}>
      <div className="fw-container" style={{ padding: '40px 20px 24px' }}>
        {/* Screen title */}
        <h1 className="fw-heading-1" style={{ margin: '0 0 16px 0' }}>
          Hành động
        </h1>

        {/* Category filter strip - horizontal scroll */}
        <div
          style={{
            marginBottom: '8px',
            overflowX: 'auto',
            overflowY: 'hidden',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '8px',
              paddingBottom: '4px',
            }}
          >
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category;
              const handleCategoryClick = () => {
                // If category has dedicated view and onSelectCategory provided, navigate to it
                if (category !== 'TẤT CẢ' && onSelectCategory) {
                  onSelectCategory(CATEGORY_TO_ID[category]);
                } else {
                  // Otherwise just filter the grid
                  setSelectedCategory(category);
                }
              };
              
              return (
                <button
                  key={category}
                  onClick={handleCategoryClick}
                  className={isSelected ? 'fw-badge fw-badge-navy' : 'fw-badge fw-badge-outline'}
                  style={{
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    transition: 'all 120ms ease-out',
                  }}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Context filter */}
        <div style={{ marginBottom: '16px' }}>
          <div className="fw-body-s fw-text-grey" style={{ marginBottom: '8px' }}>
            Bạn đang ở đâu?
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {CONTEXT_FILTERS.map((context) => {
              const isSelected = selectedContexts.includes(context.id);
              return (
                <button
                  key={context.id}
                  onClick={() => toggleContext(context.id)}
                  className={isSelected ? 'fw-badge fw-badge-navy' : 'fw-badge fw-badge-outline'}
                  style={{
                    fontSize: '9px',
                    padding: '5px 8px',
                    cursor: 'pointer',
                    transition: 'all 120ms ease-out',
                  }}
                >
                  {context.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Video grid - 2 columns */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px',
            marginBottom: '24px',
          }}
        >
          {filteredActions.map((action) => (
            <button
              key={action.id}
              onClick={() => {
                vibrate(50); // Light tap feedback
                onNavigate('microAction', action.id);
              }}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #EBEBF0',
                borderRadius: '4px',
                overflow: 'hidden',
                cursor: 'pointer',
                padding: '0',
                textAlign: 'left',
                transition: 'transform 120ms ease-out',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {/* Video thumbnail */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  paddingBottom: '133%', // 3:4 aspect ratio (approx 230/173)
                  overflow: 'hidden',
                }}
              >
                <img
                  src={action.videoThumbnailUrl}
                  alt={action.name}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
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
                    backgroundColor: 'rgba(4, 30, 58, 0.25)',
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

              {/* Text content */}
              <div style={{ padding: '12px' }}>
                {/* Category eyebrow */}
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '9px',
                    fontWeight: 400,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: '#9D9FA3',
                    marginBottom: '4px',
                    lineHeight: '1.0',
                  }}
                >
                  {action.category}
                </div>

                {/* Action name */}
                <div
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#041E3A',
                    lineHeight: 1.3,
                    marginBottom: '4px',
                  }}
                >
                  {action.name}
                </div>

                {/* Rationale - 1 line truncated */}
                <div
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '12px',
                    fontWeight: 400,
                    color: '#9D9FA3',
                    lineHeight: 1.5,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  {action.rationale}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Total count */}
        <div
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '13px',
            fontWeight: 400,
            color: '#9D9FA3',
            textAlign: 'center',
            padding: '24px 0',
            lineHeight: 1.5,
          }}
        >
          {selectedCategory === 'TẤT CẢ' ? ALL_ACTIONS.length : filteredActions.length} hành động · 8 danh mục
        </div>
      </div>
    </div>
  );
}
