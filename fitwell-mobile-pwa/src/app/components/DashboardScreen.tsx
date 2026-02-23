import React from 'react';
import { ChevronRight } from 'lucide-react';

interface DashboardScreenProps {
  onNavigate: (screen: string) => void;
}

export function DashboardScreen({ onNavigate }: DashboardScreenProps) {
  return (
    <div className="fw-full fw-bg-surface" style={{ overflow: 'auto' }}>
      {/* Header */}
      <div className="fw-bg-white fw-safe-top" style={{ paddingBottom: '32px', paddingLeft: '24px', paddingRight: '24px' }}>
        <div style={{ marginBottom: '8px' }}>
          <span className="fw-label fw-text-grey">
            Good Morning
          </span>
        </div>
        <h1 className="fw-heading-1" style={{ fontSize: '34px', letterSpacing: '-0.022em', lineHeight: '1.2' }}>
          Minh Nguyen
        </h1>
      </div>

      {/* Current Status Card */}
      <div className="fw-container" style={{ paddingTop: '32px', paddingBottom: '32px' }}>
        <div className="fw-card">
          <div style={{ marginBottom: '24px' }}>
            <span className="fw-label fw-text-grey">
              Recovery Status
            </span>
          </div>
          
          <div style={{ marginBottom: '32px' }}>
            <div className="fw-heading-1" style={{ marginBottom: '8px' }}>
              Week 4 of 12
            </div>
            <div className="fw-body-m fw-text-grey">
              Steady progress on key markers
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="fw-border-bottom" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px' }}>
              <div>
                <div className="fw-body-s fw-text-grey" style={{ marginBottom: '4px' }}>
                  Cholesterol
                </div>
                <div className="fw-body-m fw-text-navy">
                  240 → 218 mg/dL
                </div>
              </div>
              <div className="fw-body-s" style={{ color: '#059669' }}>
                Improving
              </div>
            </div>

            <div className="fw-border-bottom" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px' }}>
              <div>
                <div className="fw-body-s fw-text-grey" style={{ marginBottom: '4px' }}>
                  Blood Glucose
                </div>
                <div className="fw-body-m fw-text-navy">
                  118 → 106 mg/dL
                </div>
              </div>
              <div className="fw-body-s" style={{ color: '#059669' }}>
                Improving
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div className="fw-body-s fw-text-grey" style={{ marginBottom: '4px' }}>
                  Liver Enzymes
                </div>
                <div className="fw-body-m fw-text-navy">
                  Monitoring
                </div>
              </div>
              <div className="fw-body-s fw-text-grey">
                Stable
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="fw-container" style={{ paddingBottom: '96px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button
          onClick={() => onNavigate('bloodTest')}
          className="fw-btn-reset fw-card-hover"
          style={{ width: '100%', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left' }}
        >
          <div>
            <div className="fw-body-m fw-text-navy" style={{ marginBottom: '4px' }}>
              Kết quả xét nghiệm
            </div>
            <div className="fw-body-s fw-text-grey">
              Báo cáo đầy đủ và xu hướng
            </div>
          </div>
          <ChevronRight size={20} style={{ color: '#9D9FA3' }} />
        </button>

        <button
          onClick={() => onNavigate('recovery')}
          className="fw-btn-reset fw-card-hover"
          style={{ width: '100%', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left' }}
        >
          <div>
            <div className="fw-body-m fw-text-navy" style={{ marginBottom: '4px' }}>
              Recovery Plan
            </div>
            <div className="fw-body-s fw-text-grey">
              This week's guidance
            </div>
          </div>
          <ChevronRight size={20} style={{ color: '#9D9FA3' }} />
        </button>

        <button
          onClick={() => onNavigate('progress')}
          className="fw-btn-reset fw-card-hover"
          style={{ width: '100%', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left' }}
        >
          <div>
            <div className="fw-body-m fw-text-navy" style={{ marginBottom: '4px' }}>
              Weekly Check-in
            </div>
            <div className="fw-body-s fw-text-grey">
              Track your habits
            </div>
          </div>
          <ChevronRight size={20} style={{ color: '#9D9FA3' }} />
        </button>

        <button
          onClick={() => onNavigate('profile')}
          className="fw-btn-reset fw-card-hover"
          style={{ width: '100%', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left' }}
        >
          <div>
            <div className="fw-body-m fw-text-navy" style={{ marginBottom: '4px' }}>
              Profile & Settings
            </div>
            <div className="fw-body-s fw-text-grey">
              Manage your account
            </div>
          </div>
          <ChevronRight size={20} style={{ color: '#9D9FA3' }} />
        </button>
      </div>
    </div>
  );
}
