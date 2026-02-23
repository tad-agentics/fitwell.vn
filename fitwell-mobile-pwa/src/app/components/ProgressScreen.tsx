import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface ProgressScreenProps {
  onBack: () => void;
}

export function ProgressScreen({ onBack }: ProgressScreenProps) {
  const [selectedHabits, setSelectedHabits] = React.useState<Set<string>>(new Set());

  const habits = [
    {
      category: 'Nutrition',
      items: [
        'Reduced rice portions',
        'Added vegetables to meals',
        'Limited alcohol consumption',
        'Avoided sweet drinks'
      ]
    },
    {
      category: 'Movement',
      items: [
        'Evening walks completed',
        'Used stairs regularly',
        'Regular stretching breaks'
      ]
    },
    {
      category: 'Rest',
      items: [
        'Consistent sleep schedule',
        'No screens before bed',
        'Quality sleep environment'
      ]
    }
  ];

  const toggleHabit = (habit: string) => {
    const newSelected = new Set(selectedHabits);
    if (newSelected.has(habit)) {
      newSelected.delete(habit);
    } else {
      newSelected.add(habit);
    }
    setSelectedHabits(newSelected);
  };

  const totalHabits = habits.reduce((acc, cat) => acc + cat.items.length, 0);
  const completedCount = selectedHabits.size;

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#ffffff' }}>
      {/* Header */}
      <div className="pt-16 pb-6 px-6 flex items-center gap-4" style={{ borderBottom: '1px solid #EBEBF0' }}>
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <ArrowLeft size={24} style={{ color: '#041E3A' }} />
        </button>
        <h1 
          className="fitwell-heading-secondary" 
          style={{ 
            color: '#041E3A',
            fontSize: '28px',
            fontWeight: '400',
            letterSpacing: '-0.019em'
          }}
        >
          Weekly Check-in
        </h1>
      </div>

      {/* Week Info */}
      <div className="px-6 py-6" style={{ borderBottom: '1px solid #EBEBF0' }}>
        <div className="mb-1">
          <span 
            className="fitwell-label" 
            style={{ 
              color: '#9a9ba5',
              fontSize: '11px',
              fontWeight: '500',
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}
          >
            This Week
          </span>
        </div>
        <div 
          className="fitwell-body mb-4" 
          style={{ 
            color: '#041E3A',
            fontSize: '15px',
            fontWeight: '400'
          }}
        >
          21 – 27 February 2026
        </div>
        <div 
          className="fitwell-body-small" 
          style={{ 
            color: '#6b6d7a',
            fontSize: '13px',
            fontWeight: '400'
          }}
        >
          Track the habits you maintained this week. Consistency matters more than perfection.
        </div>
      </div>

      {/* Progress Summary */}
      <div className="px-6 py-6" style={{ backgroundColor: '#f8f8f9' }}>
        <div className="flex items-baseline gap-2 mb-1">
          <span 
            className="fitwell-heading-tertiary" 
            style={{ 
              color: '#041E3A',
              fontSize: '21px',
              fontWeight: '400'
            }}
          >
            {completedCount}
          </span>
          <span 
            className="fitwell-body" 
            style={{ 
              color: '#6b6d7a',
              fontSize: '15px',
              fontWeight: '400'
            }}
          >
            of {totalHabits} habits
          </span>
        </div>
      </div>

      {/* Habits List */}
      <div className="flex-1 overflow-y-auto">
        {habits.map((category, categoryIndex) => (
          <div key={categoryIndex}>
            <div className="px-6 py-4" style={{ borderBottom: '1px solid #EBEBF0' }}>
              <span 
                className="fitwell-label" 
                style={{ 
                  color: '#6b6d7a',
                  fontSize: '11px',
                  fontWeight: '500',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase'
                }}
              >
                {category.category}
              </span>
            </div>
            
            <div className="px-6 py-2">
              {category.items.map((habit, habitIndex) => {
                const isSelected = selectedHabits.has(habit);
                return (
                  <button
                    key={habitIndex}
                    onClick={() => toggleHabit(habit)}
                    className="w-full py-4 flex items-center gap-4 text-left"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      borderBottom: habitIndex < category.items.length - 1 ? '1px solid #EBEBF0' : 'none'
                    }}
                  >
                    <div
                      className="flex-shrink-0 flex items-center justify-center"
                      style={{
                        width: '24px',
                        height: '24px',
                        border: `1px solid ${isSelected ? '#041E3A' : '#EBEBF0'}`,
                        backgroundColor: isSelected ? '#041E3A' : 'transparent'
                      }}
                    >
                      {isSelected && (
                        <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                          <path
                            d="M1 5L5 9L13 1"
                            stroke="white"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <div 
                      className="flex-1 fitwell-body" 
                      style={{ 
                        color: '#1a1d29',
                        fontSize: '15px',
                        fontWeight: '400'
                      }}
                    >
                      {habit}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <div className="p-6" style={{ borderTop: '1px solid #EBEBF0' }}>
        <button
          className="w-full fitwell-button-primary"
          style={{
            backgroundColor: '#041E3A',
            color: '#ffffff',
            border: 'none',
            padding: '16px',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: '400'
          }}
        >
          Save Check-in
        </button>
      </div>
    </div>
  );
}
