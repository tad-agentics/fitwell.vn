import React from 'react';

interface ContextSelectorScreenProps {
  onSelect: () => void;
  onBack: () => void;
}

export function ContextSelectorScreen({ onSelect, onBack }: ContextSelectorScreenProps) {
  const handleSelectContext = (context: 'office' | 'private' | 'transit') => {
    onSelect();
  };
  const contexts = [
    {
      id: 'office' as const,
      label: 'Văn phòng',
      description: 'Đang ở nơi làm việc, có người xung quanh'
    },
    {
      id: 'private' as const,
      label: 'Riêng tư',
      description: 'Ở nhà hoặc không gian riêng'
    },
    {
      id: 'transit' as const,
      label: 'Đang di chuyển',
      description: 'Trên xe, nơi công cộng'
    }
  ];

  return (
    <div 
      className="h-full flex flex-col justify-center"
      style={{ 
        backgroundColor: '#FFFFFF',
        padding: '0 20px'
      }}
    >
      {/* Question - centered */}
      <div className="mb-12 text-center">
        <h1 
          className="fitwell-heading-primary"
          style={{
            color: '#041E3A',
            fontSize: '28px',
            fontWeight: '600',
            lineHeight: '1.3',
            letterSpacing: '-0.019em'
          }}
        >
          Bạn đang ở đâu?
        </h1>
      </div>

      {/* Context Cards */}
      <div 
        className="space-y-3"
        style={{
          marginBottom: '48px'
        }}
      >
        {contexts.map((context) => (
          <button
            key={context.id}
            onClick={() => handleSelectContext(context.id)}
            className="w-full text-left"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #EBEBF0',
              borderRadius: '4px',
              padding: '24px',
              minHeight: '80px',
              cursor: 'pointer',
              transition: 'all 120ms ease-out'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F0F4F8';
              e.currentTarget.style.borderColor = '#041E3A';
              e.currentTarget.style.borderWidth = '2px';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.borderColor = '#EBEBF0';
              e.currentTarget.style.borderWidth = '1px';
            }}
          >
            <div 
              className="fitwell-heading-secondary mb-2"
              style={{
                color: '#041E3A',
                fontSize: '22px',
                fontWeight: '600',
                lineHeight: '1.3'
              }}
            >
              {context.label}
            </div>
            <div 
              className="fitwell-body"
              style={{
                color: '#9D9FA3',
                fontSize: '15px',
                fontWeight: '400',
                lineHeight: '1.5'
              }}
            >
              {context.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
