import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface BloodTestScreenProps {
  onBack: () => void;
}

export function BloodTestScreen({ onBack }: BloodTestScreenProps) {
  const markers = [
    {
      category: 'Lipid Panel',
      items: [
        { name: 'Total Cholesterol', initial: '240', current: '218', target: '< 200', unit: 'mg/dL', status: 'improving' },
        { name: 'LDL Cholesterol', initial: '165', current: '148', target: '< 130', unit: 'mg/dL', status: 'improving' },
        { name: 'HDL Cholesterol', initial: '42', current: '46', target: '> 40', unit: 'mg/dL', status: 'normal' },
        { name: 'Triglycerides', initial: '185', current: '162', target: '< 150', unit: 'mg/dL', status: 'improving' }
      ]
    },
    {
      category: 'Glucose',
      items: [
        { name: 'Fasting Glucose', initial: '118', current: '106', target: '< 100', unit: 'mg/dL', status: 'improving' },
        { name: 'HbA1c', initial: '6.1', current: '5.8', target: '< 5.7', unit: '%', status: 'improving' }
      ]
    },
    {
      category: 'Liver Function',
      items: [
        { name: 'ALT', initial: '52', current: '48', target: '< 40', unit: 'U/L', status: 'stable' },
        { name: 'AST', initial: '45', current: '43', target: '< 40', unit: 'U/L', status: 'stable' }
      ]
    }
  ];

  return (
    <div className="h-full flex flex-col" style={{ backgroundColor: '#FFFFFF' }}>
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
            letterSpacing: '-0.019em',
            lineHeight: '1.3',
          }}
        >
          Kết quả xét nghiệm máu
        </h1>
      </div>

      {/* Test Info */}
      <div className="px-6 py-6" style={{ borderBottom: '1px solid #EBEBF0' }}>
        <div className="mb-1">
          <span 
            className="fitwell-label" 
            style={{ 
              color: '#9D9FA3',
              fontSize: '11px',
              fontWeight: '500',
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}
          >
            Latest Test
          </span>
        </div>
        <div 
          className="fitwell-body" 
          style={{ 
            color: '#041E3A',
            fontSize: '15px',
            fontWeight: '400'
          }}
        >
          18 February 2026
        </div>
        <div 
          className="fitwell-body-small mt-1" 
          style={{ 
            color: '#9D9FA3',
            fontSize: '13px',
            fontWeight: '400'
          }}
        >
          Cho Ray Hospital, District 5
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {markers.map((category, categoryIndex) => (
          <div key={categoryIndex}>
            <div className="px-6 py-4" style={{ backgroundColor: '#F5F5F5' }}>
              <span 
                className="fitwell-label" 
                style={{ 
                  color: '#9D9FA3',
                  fontSize: '11px',
                  fontWeight: '500',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase'
                }}
              >
                {category.category}
              </span>
            </div>
            
            <div className="px-6 py-4 space-y-6">
              {category.items.map((item, itemIndex) => (
                <div key={itemIndex}>
                  <div className="flex items-baseline justify-between mb-3">
                    <div 
                      className="fitwell-body" 
                      style={{ 
                        color: '#041E3A',
                        fontSize: '15px',
                        fontWeight: '400'
                      }}
                    >
                      {item.name}
                    </div>
                    <div 
                      className="fitwell-body-small"
                      style={{ 
                        color: item.status === 'improving' 
                          ? '#059669' 
                          : item.status === 'normal'
                          ? '#059669'
                          : '#9D9FA3',
                        fontSize: '13px',
                        fontWeight: '400'
                      }}
                    >
                      {item.status === 'improving' ? 'Improving' : item.status === 'normal' ? 'Normal' : 'Monitoring'}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div 
                        className="fitwell-body-small mb-1" 
                        style={{ 
                          color: '#9D9FA3',
                          fontSize: '13px',
                          fontWeight: '400'
                        }}
                      >
                        Initial
                      </div>
                      <div 
                        className="fitwell-body-small" 
                        style={{ 
                          color: '#9D9FA3',
                          fontSize: '13px',
                          fontWeight: '400'
                        }}
                      >
                        {item.initial} {item.unit}
                      </div>
                    </div>
                    <div>
                      <div 
                        className="fitwell-body-small mb-1" 
                        style={{ 
                          color: '#9D9FA3',
                          fontSize: '13px',
                          fontWeight: '400'
                        }}
                      >
                        Current
                      </div>
                      <div 
                        className="fitwell-body" 
                        style={{ 
                          color: '#041E3A',
                          fontSize: '15px',
                          fontWeight: '400'
                        }}
                      >
                        {item.current} {item.unit}
                      </div>
                    </div>
                    <div>
                      <div 
                        className="fitwell-body-small mb-1" 
                        style={{ 
                          color: '#9D9FA3',
                          fontSize: '13px',
                          fontWeight: '400'
                        }}
                      >
                        Target
                      </div>
                      <div 
                        className="fitwell-body-small" 
                        style={{ 
                          color: '#9D9FA3',
                          fontSize: '13px',
                          fontWeight: '400'
                        }}
                      >
                        {item.target} {item.unit}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Note */}
      <div className="px-6 py-6" style={{ borderTop: '1px solid #EBEBF0' }}>
        <div 
          className="fitwell-body-small" 
          style={{ 
            color: '#9D9FA3',
            fontSize: '13px',
            fontWeight: '400'
          }}
        >
          Next scheduled test: 18 March 2026
        </div>
      </div>
    </div>
  );
}
