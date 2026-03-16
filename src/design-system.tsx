// design-system.tsx
// FitWell Design System — v1.0
// Generated: March 2026
// Token approach: Approach A — inline token refs (no Tailwind arbitrary values)
// React import not required — Astro + React 18 uses new JSX transform.
// Fonts: Be Vietnam Pro (body), Figtree (display), DM Mono (mono/labels)
// Load via: <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@300;400;500;600;700&family=Figtree:wght@400;600;700;800;900&family=DM+Mono:wght@300;400;500&display=swap" rel="stylesheet" />

import { useState, useEffect, useRef } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// 1. COLOR TOKENS
// ─────────────────────────────────────────────────────────────────────────────
// Dark theme — flat design, no shadows. Depth via bg steps only.
// RULE: Never use raw hex values in components. Always reference these tokens.

export const colors = {
  // Backgrounds — 5 elevation steps, color only (no shadows)
  bg0: '#0E0E0C',   // page base — underneath everything
  bg1: '#161614',   // primary card surface
  bg2: '#1E1E1A',   // inner block, input bg
  bg3: '#252521',   // hover, active row
  bg4: '#2E2E29',   // max depth — use sparingly
  bgInverse: '#F0EFE9', // CTA fill, inverse text bg

  // Text
  t0: '#F0EFE9',    // primary — high emphasis
  t1: '#B8B7B0',    // secondary — body text
  t2: '#6B6B64',    // muted — labels, metadata
  t3: '#3A3A35',    // disabled / placeholder

  // Semantic — pain / status
  teal: '#2EC4A0',          // on-track (pain 1–2), positive, primary accent
  tealBg: 'rgba(46,196,160,0.10)',
  tealDim: '#1A7A62',       // pressed state of teal
  amber: '#D4820A',         // caution (pain 3), warning
  amberBg: 'rgba(212,130,10,0.10)',
  risk: '#C0392B',          // critical (pain 4–5), destructive
  riskBg: 'rgba(192,57,43,0.10)',

  // Structural
  border: '#252521',        // all dividers and borders — 1px only
} as const

export type ColorToken = keyof typeof colors

// Pain score → color mapping (used by PainScoreSelector and PainChart)
export const painColor = (score: number): string => {
  if (score <= 2) return colors.teal
  if (score === 3) return colors.amber
  return colors.risk
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. TYPOGRAPHY TOKENS
// ─────────────────────────────────────────────────────────────────────────────

export const typography = {
  fontPrimary: "'Be Vietnam Pro', sans-serif",  // body, UI copy
  fontDisplay:  "'Figtree', sans-serif",         // headings, display numbers
  fontMono:     "'DM Mono', monospace",          // labels, metadata, data

  // Scale (px — mobile-first PWA)
  size07: '7px',    // micro labels in wireframe mode
  size09: '9px',    // mono labels, metadata
  size10: '10px',   // captions, sub-labels
  size11: '11px',   // secondary body
  size12: '12px',   // body small
  size13: '13px',   // body default
  size14: '14px',   // body large, button default
  size16: '16px',   // subheadings
  size17: '17px',   // card headings
  size18: '18px',   // screen headings
  size20: '20px',   // pain score numbers
  size22: '22px',   // card display
  size26: '26px',   // timer display

  // Weight
  w300: 300,
  w400: 400,
  w500: 500,
  w600: 600,
  w700: 700,
  w800: 800,

  // Line height
  lineSnug:    1.25,
  lineNormal:  1.5,
  lineRelaxed: 1.65,
  lineLoose:   1.8,
} as const

// ─────────────────────────────────────────────────────────────────────────────
// 3. SPACING TOKENS
// ─────────────────────────────────────────────────────────────────────────────

export const spacing = {
  2:  '2px',
  4:  '4px',
  6:  '6px',
  8:  '8px',
  10: '10px',
  12: '12px',
  14: '14px',
  16: '16px',
  18: '18px',
  20: '20px',
  22: '22px',
  24: '24px',
  32: '32px',
  40: '40px',
  48: '48px',
} as const

// ─────────────────────────────────────────────────────────────────────────────
// 4. RADIUS TOKENS
// ─────────────────────────────────────────────────────────────────────────────

export const radius = {
  r4:   '4px',
  r6:   '6px',
  r8:   '8px',
  r12:  '12px',
  r16:  '16px',
  r20:  '20px',
  full: '9999px',
} as const

// ─────────────────────────────────────────────────────────────────────────────
// 5. ANIMATION TOKENS
// ─────────────────────────────────────────────────────────────────────────────
// No spring physics. No bounce. No scale >2%.
// Rule: animation that draws attention to itself = distraction from action.

export const animation = {
  micro:    '120ms ease-out',   // button hover, pill select, micro-action done
  standard: '200ms ease-out',   // card fadeUp, modal open
  progress: '700ms cubic-bezier(0.2,0,0.1,1)', // progress bar fill (400ms delay after mount)
  typing:   '1.2s ease-in-out', // typing dots
  playPulse:'2s ease-in-out',   // play button idle pulse
} as const

// ─────────────────────────────────────────────────────────────────────────────
// 6. TOUCH TARGET
// ─────────────────────────────────────────────────────────────────────────────

export const touchTarget = {
  sm:  '32px',   // icon button small (back, dismiss)
  md:  '44px',   // icon button medium (play)
  lg:  '46px',   // button default
  xl:  '52px',   // button large (onboarding, paywall CTAs only)
} as const

// ─────────────────────────────────────────────────────────────────────────────
// 7. COMPONENT PROP INTERFACES
// ─────────────────────────────────────────────────────────────────────────────

export interface ButtonProps {
  label: string
  onClick?: () => void
  isLoading?: boolean
  disabled?: boolean
  fullWidth?: boolean
}

export interface PillButtonProps {
  label: string
  selected?: boolean
  onClick?: () => void
}

export interface IconButtonProps {
  icon: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  label: string // a11y aria-label
  size?: 'sm' | 'md'  // sm=32px, md=44px
}

export interface TextInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  error?: string
  disabled?: boolean
  maxLength?: number
}

export interface TextAreaProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  rows?: number
}

export interface BadgeProps {
  label: string
  variant?: 'teal' | 'amber' | 'risk' | 'neutral'
}

export interface ProgressBarProps {
  pct: number          // 0–100
  height?: 3 | 6 | 12 // thin=timer, standard=condition, thick=summary hero
  color?: string
  delay?: number       // ms — default 400
  animated?: boolean
}

export interface PainScoreSelectorProps {
  value: number | null
  onChange: (score: number) => void
  conditionName?: string  // for prompt copy
}

export interface RadioRowProps {
  label: string
  subLabel?: string
  selected?: boolean
  onClick?: () => void
}

export interface CheckRowProps {
  label: string
  checked?: boolean
  onChange?: (checked: boolean) => void
}

export interface TabToggleProps {
  tabs: string[]
  activeIndex: number
  onChange: (index: number) => void
}

export interface BottomNavItem {
  label: string
  icon: React.ReactNode
}

export interface BottomNavProps {
  items: BottomNavItem[]
  activeIndex: number
  onChange: (index: number) => void
}

export interface ProtocolBlockProps {
  variant: 'fear' | 'insight' | 'protocol' | 'dry' | 'honest' | 'warmth' | 'zero-guilt' | 'peer-nod' | 'pattern'
  children: React.ReactNode
}

export interface ExerciseCardProps {
  name: string
  duration: string    // e.g. "5 phút"
  location: string    // e.g. "Nằm trên giường"
  thumbnailUrl?: string | null
  onPlay?: () => void
  isLoading?: boolean
}

export interface ConditionRowProps {
  name: string         // msk_conditions.name_vi
  region: string       // body_region + name_en
  checked?: boolean
  onChange?: (checked: boolean) => void
}

export interface ConsistencyDotGridProps {
  totalDays?: number   // default 30
  completedDays: number
}

export interface PainChartProps {
  data: Array<{ day: string; score: number }>
  isLoading?: boolean
}

export interface SparklineProps {
  scores: number[]     // last 5 pain scores, oldest first
}

export interface BottomSheetProps {
  isOpen: boolean
  onClose?: () => void  // undefined = no close via backdrop (mandatory modal)
  title?: string
  children: React.ReactNode
}

export interface SkeletonBlockProps {
  height?: number | string
  width?: number | string
  rounded?: boolean
}

export interface EmptyStateProps {
  title: string
  message: string
  action?: { label: string; onClick: () => void }
}

export interface ErrorBannerProps {
  message: string
  onRetry?: () => void
}

export interface CheckinHeaderProps {
  conditionName: string
  time: string          // e.g. "7:04 SA"
  dayNumber: number
}

export interface FeedbackChipsProps {
  onChange: (feedback: 'better' | 'same' | 'worse') => void
  value?: 'better' | 'same' | 'worse' | null
  conditionName?: string  // to personalise prompt
}

export interface StepProgressBarProps {
  total: number
  current: number       // 1-indexed
}

export interface StatTileProps {
  value: string
  label: string
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. ICON DEFINITIONS
// ─────────────────────────────────────────────────────────────────────────────
// All SVG, no external icon library. stroke-based, 1.5px weight.

const IC = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }

export const Icons = {
  // Navigation
  Home:    () => <svg viewBox="0 0 24 24" width={20} height={20} {...IC}><path d="M3 10.5 L12 3 L21 10.5"/><path d="M5 9 L5 21 L9 21 L9 16 Q9 14 12 14 Q15 14 15 16 L15 21 L19 21 L19 9"/></svg>,
  History: () => <svg viewBox="0 0 24 24" width={20} height={20} {...IC}><circle cx="12" cy="12" r="9"/><path d="M12 7 L12 12 L8 15"/></svg>,
  Chart:   () => <svg viewBox="0 0 24 24" width={20} height={20} {...IC}><rect x="3" y="14" width="4" height="7" rx="1"/><rect x="10" y="9" width="4" height="12" rx="1"/><rect x="17" y="4" width="4" height="17" rx="1"/></svg>,
  Profile: () => <svg viewBox="0 0 24 24" width={20} height={20} {...IC}><circle cx="12" cy="8" r="4"/><path d="M4 21 Q4 15 12 15 Q20 15 20 21"/></svg>,
  Bell:    () => <svg viewBox="0 0 24 24" width={20} height={20} {...IC}><path d="M6 10 Q6 5 12 5 Q18 5 18 10 L18 16 L6 16 Z"/><path d="M10 16 Q10 18 12 18 Q14 18 14 16"/><path d="M12 3 L12 5"/></svg>,
  // Actions
  Play:    () => <svg viewBox="0 0 24 24" width={20} height={20} {...IC}><path d="M8 5 L19 12 L8 19 Z"/></svg>,
  Check:   () => <svg viewBox="0 0 24 24" width={20} height={20} {...IC}><path d="M5 13 L9 17 L19 7"/></svg>,
  Close:   () => <svg viewBox="0 0 24 24" width={20} height={20} {...IC}><path d="M6 6 L18 18"/><path d="M18 6 L6 18"/></svg>,
  ArrowLeft: () => <svg viewBox="0 0 24 24" width={20} height={20} {...IC}><path d="M19 12 L5 12"/><path d="M11 6 L5 12 L11 18"/></svg>,
  ArrowRight: () => <svg viewBox="0 0 24 24" width={20} height={20} {...IC}><path d="M5 12 L19 12"/><path d="M13 6 L19 12 L13 18"/></svg>,
  Plus:    () => <svg viewBox="0 0 24 24" width={20} height={20} {...IC}><path d="M12 5 L12 19"/><path d="M5 12 L19 12"/></svg>,
  // Status
  Warning: () => <svg viewBox="0 0 24 24" width={20} height={20} {...IC}><path d="M12 3 L22 21 L2 21 Z"/><line x1="12" y1="10" x2="12" y2="15"/><circle cx="12" cy="18" r="0.5" fill="currentColor"/></svg>,
  Lock:    () => <svg viewBox="0 0 24 24" width={20} height={20} {...IC}><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11 L8 7 Q8 3 12 3 Q16 3 16 7 L16 11"/></svg>,
  // Body regions
  Spine:   () => <svg viewBox="0 0 24 24" width={20} height={20} {...IC}><line x1="12" y1="2" x2="12" y2="22"/><rect x="9" y="4" width="6" height="3" rx="1"/><rect x="9" y="9" width="6" height="3" rx="1"/><rect x="9" y="14" width="6" height="3" rx="1"/><rect x="9" y="19" width="6" height="3" rx="1"/></svg>,
  Knee:    () => <svg viewBox="0 0 24 24" width={20} height={20} {...IC}><path d="M9 2 L9 9 Q9 13 12 14 Q15 13 15 9 L15 2"/><path d="M9 22 L9 16 Q9 14 12 14 Q15 14 15 16 L15 22"/><path d="M7 9 Q12 11 17 9"/><path d="M7 16 Q12 14 17 16"/></svg>,
  Foot:    () => <svg viewBox="0 0 24 24" width={20} height={20} {...IC}><path d="M8 3 L8 14 Q8 17 10 18 L16 18 Q19 18 19 16 Q19 14 16 14 L12 14"/><path d="M10 18 L9 21"/><path d="M13 18 L13 21"/><path d="M16 18 L17 21"/></svg>,
} as const

// ─────────────────────────────────────────────────────────────────────────────
// 9. PRIMITIVE COMPONENTS (internal building blocks)
// ─────────────────────────────────────────────────────────────────────────────

const MonoLabel = ({ children, color = colors.t2, size = typography.size09 }: { children: React.ReactNode; color?: string; size?: string }) => (
  <span style={{ fontFamily: typography.fontMono, fontSize: size, color, letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
    {children}
  </span>
)

const TypingDots = () => (
  <div style={{ display: 'flex', gap: '5px', padding: '10px 2px' }}>
    {[0, 1, 2].map(i => (
      <div key={i} style={{
        width: 6, height: 6, borderRadius: '50%', background: colors.t1,
        animation: `typingDot 1.2s ease-in-out ${i * 0.2}s infinite`,
      }} />
    ))}
  </div>
)

// ─────────────────────────────────────────────────────────────────────────────
// 10. EXPORTED COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

// ── Buttons ──────────────────────────────────────────────────────────────────

export const PrimaryButton = ({ label, onClick, isLoading = false, disabled = false, fullWidth = true }: ButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled || isLoading}
    style={{
      height: touchTarget.lg,
      width: fullWidth ? '100%' : 'auto',
      padding: '0 20px',
      borderRadius: radius.r8,
      background: disabled ? colors.bg3 : colors.bgInverse,
      border: 'none',
      cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
      fontFamily: typography.fontPrimary,
      fontSize: typography.size14,
      fontWeight: typography.w600,
      color: disabled ? colors.t3 : colors.bg0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      transition: animation.micro,
      opacity: disabled ? 0.5 : 1,
    }}
  >
    {isLoading
      ? <><div style={{ width: 14, height: 14, borderRadius: '50%', border: `2px solid ${colors.bg0}40`, borderTopColor: colors.bg0, animation: 'spin 600ms linear infinite' }} /><span>Đang xử lý...</span></>
      : label
    }
  </button>
)

export const PrimaryButtonLG = ({ label, onClick, isLoading = false, disabled = false, fullWidth = true }: ButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled || isLoading}
    style={{
      height: touchTarget.xl,
      width: fullWidth ? '100%' : 'auto',
      padding: '0 20px',
      borderRadius: radius.r8,
      background: disabled ? colors.bg3 : colors.bgInverse,
      border: 'none',
      cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
      fontFamily: typography.fontPrimary,
      fontSize: typography.size14,
      fontWeight: typography.w700,
      color: disabled ? colors.t3 : colors.bg0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      transition: animation.micro,
      opacity: disabled ? 0.5 : 1,
    }}
  >
    {isLoading
      ? <><div style={{ width: 14, height: 14, borderRadius: '50%', border: `2px solid ${colors.bg0}40`, borderTopColor: colors.bg0, animation: 'spin 600ms linear infinite' }} /><span>Đang xử lý...</span></>
      : label
    }
  </button>
)

export const SecondaryButton = ({ label, onClick, disabled = false, fullWidth = true }: ButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      height: touchTarget.lg,
      width: fullWidth ? '100%' : 'auto',
      padding: '0 20px',
      borderRadius: radius.r8,
      background: 'none',
      border: `1px solid ${colors.bg4}`,
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: typography.fontPrimary,
      fontSize: typography.size14,
      fontWeight: typography.w600,
      color: disabled ? colors.t3 : colors.t0,
      transition: animation.micro,
      opacity: disabled ? 0.5 : 1,
    }}
  >
    {label}
  </button>
)

export const GhostButton = ({ label, onClick, disabled = false, fullWidth = false }: ButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      height: touchTarget.lg,
      width: fullWidth ? '100%' : 'auto',
      padding: '0 16px',
      borderRadius: radius.r8,
      background: 'none',
      border: `1px solid ${colors.border}`,
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontFamily: typography.fontPrimary,
      fontSize: typography.size13,
      fontWeight: typography.w400,
      color: colors.t2,
      transition: animation.micro,
    }}
  >
    {label}
  </button>
)

export const PillButton = ({ label, selected = false, onClick }: PillButtonProps) => (
  <button
    onClick={onClick}
    style={{
      height: '34px',
      padding: '0 14px',
      borderRadius: radius.full,
      border: `1px solid ${selected ? colors.t0 : colors.border}`,
      background: selected ? colors.t0 : 'none',
      cursor: 'pointer',
      fontFamily: typography.fontPrimary,
      fontSize: typography.size12,
      fontWeight: selected ? typography.w600 : typography.w400,
      color: selected ? colors.bg0 : colors.t2,
      transition: animation.micro,
      whiteSpace: 'nowrap' as const,
    }}
  >
    {label}
  </button>
)

export const IconButton = ({ icon, onClick, disabled = false, label, size = 'sm' }: IconButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    style={{
      width: size === 'sm' ? touchTarget.sm : touchTarget.md,
      height: size === 'sm' ? touchTarget.sm : touchTarget.md,
      borderRadius: radius.r8,
      background: 'none',
      border: `1px solid ${colors.border}`,
      cursor: disabled ? 'not-allowed' : 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: colors.t2,
      transition: animation.micro,
      opacity: disabled ? 0.5 : 1,
      flexShrink: 0,
    }}
  >
    {icon}
  </button>
)

// ── Inputs ────────────────────────────────────────────────────────────────────

export const TextInput = ({ value, onChange, placeholder, error, disabled = false, maxLength }: TextInputProps) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      maxLength={maxLength}
      style={{
        height: '44px',
        width: '100%',
        padding: '0 12px',
        borderRadius: radius.r8,
        border: `1px solid ${error ? colors.risk : colors.border}`,
        background: colors.bg2,
        fontFamily: typography.fontPrimary,
        fontSize: typography.size13,
        color: disabled ? colors.t3 : colors.t0,
        outline: 'none',
        boxSizing: 'border-box' as const,
      }}
    />
    {error && <span style={{ fontFamily: typography.fontPrimary, fontSize: typography.size11, color: colors.risk }}>{error}</span>}
  </div>
)

export const TextArea = ({ value, onChange, placeholder, disabled = false, rows = 3 }: TextAreaProps) => (
  <textarea
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    disabled={disabled}
    rows={rows}
    style={{
      width: '100%',
      padding: '10px 12px',
      borderRadius: radius.r8,
      border: `1px solid ${colors.border}`,
      background: colors.bg2,
      fontFamily: typography.fontPrimary,
      fontSize: typography.size13,
      color: disabled ? colors.t3 : colors.t0,
      outline: 'none',
      resize: 'none' as const,
      lineHeight: String(typography.lineRelaxed),
      boxSizing: 'border-box' as const,
    }}
  />
)

// ── Selection Controls ────────────────────────────────────────────────────────

export const RadioRow = ({ label, subLabel, selected = false, onClick }: RadioRowProps) => (
  <div
    onClick={onClick}
    style={{
      minHeight: '44px',
      border: `1.5px solid ${selected ? colors.t2 : colors.border}`,
      background: selected ? colors.bg3 : colors.bg1,
      borderRadius: radius.r8,
      display: 'flex',
      alignItems: 'center',
      padding: '8px 12px',
      gap: '10px',
      cursor: 'pointer',
      transition: animation.micro,
    }}
  >
    <div style={{
      width: 16, height: 16, borderRadius: '50%',
      border: `2px solid ${selected ? colors.t0 : colors.t3}`,
      background: selected ? colors.t0 : 'none',
      flexShrink: 0,
      transition: animation.micro,
    }} />
    <div style={{ flex: 1 }}>
      <div style={{ fontFamily: typography.fontPrimary, fontSize: typography.size13, fontWeight: selected ? typography.w600 : typography.w400, color: selected ? colors.t0 : colors.t2 }}>
        {label}
      </div>
      {subLabel && <div style={{ fontFamily: typography.fontPrimary, fontSize: typography.size10, color: colors.t3, marginTop: '2px' }}>{subLabel}</div>}
    </div>
  </div>
)

export const CheckRow = ({ label, checked = false, onChange }: CheckRowProps) => (
  <div
    onClick={() => onChange?.(!checked)}
    style={{
      minHeight: '40px',
      border: `1.5px solid ${checked ? colors.t2 : colors.border}`,
      background: checked ? colors.bg3 : colors.bg1,
      borderRadius: radius.r8,
      display: 'flex',
      alignItems: 'center',
      padding: '8px 12px',
      gap: '10px',
      cursor: 'pointer',
      justifyContent: 'space-between',
      transition: animation.micro,
    }}
  >
    <span style={{ fontFamily: typography.fontPrimary, fontSize: typography.size13, fontWeight: checked ? typography.w600 : typography.w400, color: checked ? colors.t0 : colors.t2 }}>
      {label}
    </span>
    <div style={{
      width: 14, height: 14,
      border: `2px solid ${checked ? colors.t0 : colors.t3}`,
      borderRadius: radius.r4,
      background: checked ? colors.t2 : 'none',
      flexShrink: 0,
      transition: animation.micro,
    }} />
  </div>
)

export const TabToggle = ({ tabs, activeIndex, onChange }: TabToggleProps) => (
  <div style={{
    display: 'flex',
    background: colors.bg2,
    border: `1px solid ${colors.border}`,
    borderRadius: radius.r8,
    overflow: 'hidden',
  }}>
    {tabs.map((tab, i) => (
      <button
        key={tab}
        onClick={() => onChange(i)}
        style={{
          flex: 1,
          padding: '8px 0',
          textAlign: 'center',
          background: i === activeIndex ? colors.bg4 : 'none',
          borderRight: i < tabs.length - 1 ? `1px solid ${colors.border}` : 'none',
          border: 'none',
          cursor: 'pointer',
          fontFamily: typography.fontMono,
          fontSize: typography.size09,
          letterSpacing: '0.06em',
          textTransform: 'uppercase' as const,
          color: i === activeIndex ? colors.t0 : colors.t2,
          transition: animation.micro,
        }}
      >
        {tab}
      </button>
    ))}
  </div>
)

// ── Badge ─────────────────────────────────────────────────────────────────────

export const Badge = ({ label, variant = 'teal' }: BadgeProps) => {
  const colorMap = { teal: colors.teal, amber: colors.amber, risk: colors.risk, neutral: colors.t2 }
  const c = colorMap[variant]
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      padding: '2px 8px',
      borderRadius: radius.full,
      border: `1px solid ${c}33`,
      background: `${c}14`,
      fontFamily: typography.fontMono,
      fontSize: typography.size09,
      color: c,
      letterSpacing: '0.06em',
      textTransform: 'uppercase' as const,
    }}>
      {label}
    </div>
  )
}

// ── Bottom Navigation ─────────────────────────────────────────────────────────

export const BottomNav = ({ items, activeIndex, onChange }: BottomNavProps) => (
  <nav style={{
    height: '52px',
    borderTop: `1px solid ${colors.border}`,
    display: 'flex',
    background: colors.bg0,
    flexShrink: 0,
  }}>
    {items.map((item, i) => (
      <button
        key={item.label}
        onClick={() => onChange(i)}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '3px',
          background: 'none',
          border: 'none',
          borderBottom: i === activeIndex ? `2px solid ${colors.t0}` : 'none',
          cursor: 'pointer',
          color: i === activeIndex ? colors.t0 : colors.t3,
          transition: animation.micro,
        }}
      >
        {item.icon}
        <MonoLabel color={i === activeIndex ? colors.t0 : colors.t3}>{item.label}</MonoLabel>
      </button>
    ))}
  </nav>
)

// ── Progress Indicators ───────────────────────────────────────────────────────

export const ProgressBar = ({ pct, height = 6, color = colors.teal, delay = 400, animated = true }: ProgressBarProps) => (
  <div style={{ height, background: colors.bg3, borderRadius: radius.full, overflow: 'hidden' }}>
    <div style={{
      height: '100%',
      width: `${pct}%`,
      background: color,
      borderRadius: radius.full,
      animation: animated ? `progIn 700ms cubic-bezier(0.2,0,0.1,1) ${delay}ms both` : 'none',
    }} />
  </div>
)

export const StepProgressBar = ({ total, current }: StepProgressBarProps) => (
  <div style={{ display: 'flex', gap: '4px' }}>
    {Array.from({ length: total }, (_, i) => (
      <div key={i} style={{
        flex: 1,
        height: 3,
        borderRadius: radius.full,
        background: i < current ? colors.t0 : colors.bg3,
        transition: animation.micro,
      }} />
    ))}
  </div>
)

export const ConsistencyDotGrid = ({ totalDays = 30, completedDays }: ConsistencyDotGridProps) => (
  <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap' as const }}>
    {Array.from({ length: totalDays }, (_, i) => (
      <div key={i} style={{
        width: 10,
        height: 10,
        borderRadius: 2,
        background: i < completedDays ? colors.teal : colors.bg3,
        transition: animation.micro,
      }} />
    ))}
  </div>
)

// ── Pain Score Selector ───────────────────────────────────────────────────────

export const PainScoreSelector = ({ value, onChange, conditionName }: PainScoreSelectorProps) => (
  <div>
    {conditionName && (
      <div style={{ fontFamily: typography.fontPrimary, fontSize: typography.size14, fontWeight: typography.w600, color: colors.t0, marginBottom: '12px' }}>
        {conditionName} hôm nay thế nào?
      </div>
    )}
    <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
      {[1, 2, 3, 4, 5].map(n => (
        <button
          key={n}
          onClick={() => onChange(n)}
          style={{
            flex: 1,
            height: '44px',
            borderRadius: radius.r8,
            border: `1.5px solid ${value === n ? painColor(n) : colors.border}`,
            background: value === n ? `${painColor(n)}14` : colors.bg2,
            cursor: 'pointer',
            fontFamily: typography.fontDisplay,
            fontSize: typography.size20,
            fontWeight: typography.w800,
            color: value === n ? painColor(n) : colors.t3,
            transition: animation.micro,
          }}
        >
          {n}
        </button>
      ))}
    </div>
    <div style={{ display: 'flex', gap: '3px', marginBottom: '6px' }}>
      {[colors.teal, colors.teal, colors.amber, colors.risk, colors.risk].map((c, i) => (
        <div key={i} style={{ flex: 1, height: 3, borderRadius: radius.full, background: value !== null && value > i ? c : colors.bg3, transition: animation.micro }} />
      ))}
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <MonoLabel color={colors.teal}>Ổn</MonoLabel>
      <MonoLabel color={colors.amber}>Vừa</MonoLabel>
      <MonoLabel color={colors.risk}>Nặng</MonoLabel>
    </div>
  </div>
)

// ── Protocol Block (CP) ───────────────────────────────────────────────────────

const protocolBorderMap: Record<ProtocolBlockProps['variant'], string> = {
  fear:       colors.t2,
  insight:    colors.t1,
  protocol:   colors.t0,
  dry:        colors.border,
  honest:     colors.t2,
  warmth:     colors.amber,
  'zero-guilt': colors.border,
  'peer-nod': colors.teal,
  pattern:    colors.t2,
}

const protocolBgMap: Record<ProtocolBlockProps['variant'], string> = {
  fear:       colors.bg2,
  insight:    colors.bg2,
  protocol:   colors.bg3,
  dry:        colors.bg2,
  honest:     colors.bg2,
  warmth:     `${colors.amber}0A`,
  'zero-guilt': colors.bg2,
  'peer-nod': `${colors.teal}0A`,
  pattern:    colors.bg2,
}

export const ProtocolBlock = ({ variant, children }: ProtocolBlockProps) => (
  <div style={{
    position: 'relative',
    background: protocolBgMap[variant],
    border: `1px solid ${colors.border}`,
    borderLeft: `3px solid ${protocolBorderMap[variant]}`,
    borderRadius: radius.r8,
    padding: '10px 12px',
  }}>
    <div style={{
      fontFamily: typography.fontPrimary,
      fontSize: typography.size13,
      color: colors.t1,
      lineHeight: String(typography.lineRelaxed),
    }}>
      {children}
    </div>
  </div>
)

// ── Exercise Card ─────────────────────────────────────────────────────────────

export const ExerciseCard = ({ name, duration, location, thumbnailUrl, onPlay, isLoading = false }: ExerciseCardProps) => {
  if (isLoading) return <SkeletonBlock height={58} rounded />
  return (
    <div style={{
      background: colors.bg2,
      border: `1px solid ${colors.border}`,
      borderRadius: radius.r12,
      padding: '10px',
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
      cursor: onPlay ? 'pointer' : 'default',
    }} onClick={onPlay}>
      <div style={{
        width: 42, height: 42,
        background: colors.bg3,
        borderRadius: radius.r8,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {thumbnailUrl
          ? <img src={thumbnailUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' as const }} />
          : <div style={{ color: colors.t2 }}><Icons.Play /></div>
        }
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: typography.fontPrimary, fontSize: typography.size13, fontWeight: typography.w600, color: colors.t0 }}>{name}</div>
        <div style={{ fontFamily: typography.fontPrimary, fontSize: typography.size11, color: colors.t2, marginTop: '2px' }}>{duration} · {location}</div>
      </div>
    </div>
  )
}

// ── Condition Row ─────────────────────────────────────────────────────────────

export const ConditionRow = ({ name, region, checked = false, onChange }: ConditionRowProps) => (
  <div
    onClick={() => onChange?.(!checked)}
    style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: checked ? colors.bg3 : colors.bg2,
      border: `1.5px solid ${checked ? colors.t2 : colors.border}`,
      borderRadius: radius.r8,
      padding: '8px 10px',
      cursor: 'pointer',
      transition: animation.micro,
    }}
  >
    <div>
      <div style={{ fontFamily: typography.fontPrimary, fontSize: typography.size13, fontWeight: typography.w600, color: colors.t0 }}>{name}</div>
      <MonoLabel color={colors.t3}>{region}</MonoLabel>
    </div>
    <div style={{
      width: 14, height: 14,
      border: `2px solid ${checked ? colors.t0 : colors.t3}`,
      borderRadius: radius.r4,
      background: checked ? colors.t2 : 'none',
      flexShrink: 0,
      transition: animation.micro,
    }} />
  </div>
)

// ── Check-in Header ───────────────────────────────────────────────────────────

export const CheckinHeader = ({ conditionName, time, dayNumber }: CheckinHeaderProps) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
    <div>
      <MonoLabel>Check-in · {time} · Ngày {dayNumber}</MonoLabel>
    </div>
    <Badge label={conditionName} variant="neutral" />
  </div>
)

// ── Feedback Chips ────────────────────────────────────────────────────────────

export const FeedbackChips = ({ onChange, value, conditionName }: FeedbackChipsProps) => (
  <div>
    <div style={{
      fontFamily: typography.fontPrimary,
      fontSize: typography.size13,
      color: colors.t1,
      marginBottom: '10px',
    }}>
      Sau khi làm xong, {conditionName ? conditionName.toLowerCase() : 'cơ thể'} thấy thế nào?
    </div>
    <div style={{ display: 'flex', gap: '6px' }}>
      {(['better', 'same', 'worse'] as const).map((opt, i) => {
        const labels = ['Nhẹ hơn', 'Như cũ', 'Nặng hơn']
        const selected = value === opt
        return (
          <button key={opt} onClick={() => onChange(opt)} style={{
            flex: 1, height: '34px',
            border: `1.5px solid ${selected ? colors.t0 : colors.border}`,
            background: selected ? colors.bg3 : colors.bg2,
            borderRadius: radius.r8,
            cursor: 'pointer',
            fontFamily: typography.fontPrimary,
            fontSize: typography.size12,
            fontWeight: selected ? typography.w600 : typography.w400,
            color: selected ? colors.t0 : colors.t2,
            transition: animation.micro,
          }}>
            {labels[i]}
          </button>
        )
      })}
    </div>
  </div>
)

// ── Sparkline ─────────────────────────────────────────────────────────────────

export const Sparkline = ({ scores }: SparklineProps) => {
  const delta = scores.length >= 2 ? scores[scores.length - 1] - scores[0] : 0
  return (
    <div>
      <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '32px', marginBottom: '6px' }}>
        {scores.map((v, i) => (
          <div key={i} style={{
            flex: 1,
            background: `rgba(0,0,0,${0.05 + v * 0.1})`,
            border: `1px solid ${colors.border}`,
            borderRadius: '2px 2px 0 0',
            height: `${(v / 5) * 100}%`,
            minHeight: '4px',
          }} />
        ))}
      </div>
      <MonoLabel color={delta < 0 ? colors.teal : delta > 0 ? colors.risk : colors.t2}>
        {scores.join(' → ')} · {delta < 0 ? '↓ đang cải thiện' : delta > 0 ? '↑ tăng' : 'không đổi'}
      </MonoLabel>
    </div>
  )
}

// ── Pain Chart (14-day bar) ───────────────────────────────────────────────────

export const PainChart = ({ data, isLoading = false }: PainChartProps) => {
  if (isLoading) return <SkeletonBlock height={80} rounded />
  return (
    <div>
      <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '52px', marginBottom: '8px' }}>
        {data.map((d, i) => (
          <div key={i} style={{
            flex: 1,
            background: painColor(d.score),
            borderRadius: '2px 2px 0 0',
            height: `${(d.score / 5) * 100}%`,
            minHeight: '4px',
            opacity: 0.7 + (i / data.length) * 0.3,
          }} />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <MonoLabel>Tuần 1</MonoLabel>
        <MonoLabel>Tuần 2</MonoLabel>
      </div>
    </div>
  )
}

// ── Stat Tile ─────────────────────────────────────────────────────────────────

export const StatTile = ({ value, label }: StatTileProps) => (
  <div style={{
    background: colors.bg2,
    border: `1px solid ${colors.border}`,
    borderRadius: radius.r8,
    padding: '10px',
  }}>
    <div style={{ fontFamily: typography.fontDisplay, fontSize: typography.size17, fontWeight: typography.w700, color: colors.t0, marginBottom: '2px' }}>{value}</div>
    <MonoLabel>{label}</MonoLabel>
  </div>
)

// ── Bottom Sheet ──────────────────────────────────────────────────────────────

export const BottomSheet = ({ isOpen, onClose, title, children }: BottomSheetProps) => {
  if (!isOpen) return null
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200 }}>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)' }}
      />
      {/* Sheet */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: colors.bg1,
        borderRadius: `${radius.r16} ${radius.r16} 0 0`,
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        animation: `fadeUp 200ms ease-out`,
      }}>
        {/* Handle */}
        <div style={{ width: 32, height: 3, background: colors.bg4, borderRadius: radius.full, alignSelf: 'center' }} />
        {title && (
          <div style={{ fontFamily: typography.fontPrimary, fontSize: typography.size14, fontWeight: typography.w700, color: colors.t0 }}>{title}</div>
        )}
        {children}
      </div>
    </div>
  )
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

export const SkeletonBlock = ({ height = 48, width = '100%', rounded = false }: SkeletonBlockProps) => (
  <div style={{
    height,
    width,
    background: colors.bg2,
    borderRadius: rounded ? radius.r8 : radius.r4,
    animation: 'pulse 1.5s ease-in-out infinite',
  }} />
)

export const SkeletonText = ({ lines = 2 }: { lines?: number }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
    {Array.from({ length: lines }, (_, i) => (
      <SkeletonBlock key={i} height={14} width={i === lines - 1 ? '70%' : '100%'} />
    ))}
  </div>
)

// ── Typing Indicator ──────────────────────────────────────────────────────────

export const TypingIndicator = () => <TypingDots />

// ── Empty State ───────────────────────────────────────────────────────────────

export const EmptyState = ({ title, message, action }: EmptyStateProps) => (
  <div style={{
    background: colors.bg1,
    border: `1px solid ${colors.border}`,
    borderRadius: radius.r16,
    padding: '32px 20px',
    textAlign: 'center',
  }}>
    <div style={{ width: 44, height: 44, background: colors.bg2, borderRadius: radius.r12, margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 18, height: 18, borderRadius: radius.r4, border: `2px solid ${colors.bg4}` }} />
    </div>
    <div style={{ fontFamily: typography.fontDisplay, fontSize: typography.size16, fontWeight: typography.w700, color: colors.t0, marginBottom: '6px' }}>{title}</div>
    <div style={{ fontFamily: typography.fontPrimary, fontSize: typography.size13, color: colors.t2, lineHeight: String(typography.lineRelaxed), maxWidth: '200px', margin: '0 auto 16px' }}>{message}</div>
    {action && <GhostButton label={action.label} onClick={action.onClick} />}
  </div>
)

// ── Error Banner ──────────────────────────────────────────────────────────────

export const ErrorBanner = ({ message, onRetry }: ErrorBannerProps) => (
  <div style={{
    background: colors.riskBg,
    border: `1px solid ${colors.risk}33`,
    borderRadius: radius.r8,
    padding: '12px 14px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
  }}>
    <span style={{ fontFamily: typography.fontPrimary, fontSize: typography.size13, color: colors.t1, flex: 1 }}>{message}</span>
    {onRetry && (
      <button onClick={onRetry} style={{ background: 'none', border: `1px solid ${colors.risk}`, borderRadius: radius.r8, padding: '5px 10px', cursor: 'pointer', fontFamily: typography.fontMono, fontSize: typography.size09, color: colors.risk }}>
        Thử lại
      </button>
    )}
  </div>
)

// ── Card Shells ───────────────────────────────────────────────────────────────
// Use these as base containers — do not apply inline styles to override bg/border in screen code.

export const CardShell = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ background: colors.bg1, borderRadius: radius.r16, border: `1px solid ${colors.border}`, padding: '20px', ...style }}>
    {children}
  </div>
)

export const InnerBlock = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ background: colors.bg2, borderRadius: radius.r8, padding: '12px 14px', ...style }}>
    {children}
  </div>
)

// ─────────────────────────────────────────────────────────────────────────────
// 11. GLOBAL ANIMATION KEYFRAMES (inject once in root layout)
// ─────────────────────────────────────────────────────────────────────────────
// Add this to your root Astro layout or global CSS file:
//
// @keyframes fadeUp    { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
// @keyframes spin      { to { transform: rotate(360deg); } }
// @keyframes typingDot { 0%,60%,100% { transform:translateY(0); opacity:.3; } 30% { transform:translateY(-5px); opacity:1; } }
// @keyframes progIn    { from { width:0; } to { width:var(--w); } }
// @keyframes playPulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.06); } }
// @keyframes pulse     { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
//
// No spring physics. No bounce. No scale >2%. Every animation that draws
// attention to itself is a distraction from action.

// ─────────────────────────────────────────────────────────────────────────────
// 12. COMPONENT → SCREEN REGISTRY
// ─────────────────────────────────────────────────────────────────────────────
// Maps every screen spec component reference to its export name.
// Update this when adding new components.
//
// Screen specs reference    → Export name
// ────────────────────────────────────────────────────────
// ButtonPrimary (46px)      → PrimaryButton
// ButtonPrimary LG (52px)   → PrimaryButtonLG
// ButtonSecondary           → SecondaryButton
// ButtonGhost / Ghost link  → GhostButton
// PillButton / Chip         → PillButton
// IconButton                → IconButton
// TextInput / InputField    → TextInput
// TextArea                  → TextArea
// RadioRow                  → RadioRow
// CheckRow                  → CheckRow
// TabToggle                 → TabToggle
// Badge                     → Badge
// BottomNav                 → BottomNav
// ProgressBar (linear)      → ProgressBar
// StepProgressBar / ProgressBar (step) → StepProgressBar
// ConsistencyGrid / DotGrid → ConsistencyDotGrid
// PainScoreSelector         → PainScoreSelector
// ProtocolBlock / CP block  → ProtocolBlock
// ExerciseCard              → ExerciseCard
// ConditionRow              → ConditionRow
// CheckinHeader             → CheckinHeader
// FeedbackChips             → FeedbackChips
// SparklineCard / Sparkline → Sparkline
// PainChart                 → PainChart
// StatTile                  → StatTile
// BottomSheet / Modal       → BottomSheet
// SkeletonBlock             → SkeletonBlock
// SkeletonText              → SkeletonText
// TypingIndicator           → TypingIndicator
// C6_Empty / EmptyState     → EmptyState
// ErrorBanner               → ErrorBanner
// CardShell                 → CardShell
// InnerBlock                → InnerBlock
// Icons.*                   → Icons.{name}
