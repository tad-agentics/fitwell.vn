import React from 'react';

interface IconProps {
  size?: number;
  strokeWidth?: number;
  color?: string;
}

/**
 * Body state icons for check-in cards
 * 
 * Design principles (Ralph Lauren inspired):
 * - Stroke-only, no fill
 * - 1.5px stroke weight (matches nav icons)
 * - 32×32px default size
 * - Abstract, not illustrative
 * - Minimal, single-line where possible
 * - #041E3A on light backgrounds, #FFFFFF on dark
 * 
 * Recognition > Reading (eliminates 500ms cognitive load at 7 AM)
 */

const defaultProps = {
  size: 32,
  strokeWidth: 1.5,
  color: '#041E3A',
};

// SLEEP QUALITY ICONS

/** Good sleep - peaceful sleeping figure */
export function SleepGoodIcon({ size = 32, strokeWidth = 1.5, color = '#041E3A' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Sleeping figure - smooth horizontal line */}
      <path
        d="M6 18 C8 16, 12 16, 16 16 C20 16, 24 16, 26 18"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Head - circle */}
      <circle
        cx="10"
        cy="14"
        r="3"
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* Three Z symbols floating above */}
      <text
        x="19"
        y="11"
        fontFamily="var(--font-ui)"
        fontSize="6"
        fill={color}
        opacity="0.6"
      >
        z
      </text>
      <text
        x="22"
        y="9"
        fontFamily="var(--font-ui)"
        fontSize="7"
        fill={color}
        opacity="0.4"
      >
        z
      </text>
      <text
        x="25"
        y="7"
        fontFamily="var(--font-ui)"
        fontSize="8"
        fill={color}
        opacity="0.3"
      >
        z
      </text>
    </svg>
  );
}

/** Restless sleep - broken line figure */
export function SleepRestlessIcon({ size = 32, strokeWidth = 1.5, color = '#041E3A' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Restless figure - broken, jagged line */}
      <path
        d="M6 18 L9 16 L12 18 L15 15 L18 17 L21 16 L24 19 L26 17"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Head - slightly elevated */}
      <circle
        cx="11"
        cy="12"
        r="3"
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* Alert marks - two small lines */}
      <path
        d="M20 10 L22 8"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M24 11 L26 9"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity="0.6"
      />
    </svg>
  );
}

/** Poor sleep - slumped, low figure */
export function SleepPoorIcon({ size = 32, strokeWidth = 1.5, color = '#041E3A' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Slumped figure - sagging line */}
      <path
        d="M6 16 C8 17, 10 18, 13 19 C16 20, 19 20, 22 19 C24 18, 25 17, 26 16"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Head - low position */}
      <circle
        cx="11"
        cy="15"
        r="3"
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* Droop marks - downward lines */}
      <path
        d="M19 14 L19 17"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M23 13 L23 16"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

// ENERGY LEVEL ICONS

/** High energy - upright, active figure */
export function EnergyHighIcon({ size = 32, strokeWidth = 1.5, color = '#041E3A' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Upright standing figure */}
      <path
        d="M16 26 L16 14"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Head */}
      <circle
        cx="16"
        cy="10"
        r="3"
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* Arms extended upward */}
      <path
        d="M16 16 L12 12"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M16 16 L20 12"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Energy rays */}
      <path
        d="M10 8 L8 6"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M22 8 L24 6"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

/** Medium energy - neutral standing figure */
export function EnergyMediumIcon({ size = 32, strokeWidth = 1.5, color = '#041E3A' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Standing figure */}
      <path
        d="M16 25 L16 14"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Head */}
      <circle
        cx="16"
        cy="10"
        r="3"
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* Arms at sides */}
      <path
        d="M16 16 L12 19"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M16 16 L20 19"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Low energy - slumped, drooping figure */
export function EnergyLowIcon({ size = 32, strokeWidth = 1.5, color = '#041E3A' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Slumped figure - curved spine */}
      <path
        d="M16 25 C16 22, 15 18, 14 15"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Head - tilted down */}
      <circle
        cx="14"
        cy="12"
        r="3"
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* Arms drooping */}
      <path
        d="M14 15 L10 20"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M14 15 L18 20"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Droop indicator */}
      <path
        d="M20 12 L20 16"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  );
}

// DIGESTION ICONS

/** Normal digestion - smooth stomach */
export function DigestionNormalIcon({ size = 32, strokeWidth = 1.5, color = '#041E3A' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Smooth stomach outline */}
      <ellipse
        cx="16"
        cy="16"
        rx="8"
        ry="10"
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* Check mark inside */}
      <path
        d="M12 16 L14 18 L20 12"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Bloated - expanded stomach with tension lines */
export function DigestionBloatedIcon({ size = 32, strokeWidth = 1.5, color = '#041E3A' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Expanded stomach */}
      <ellipse
        cx="16"
        cy="16"
        rx="10"
        ry="11"
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
      />
      {/* Pressure/tension lines radiating outward */}
      <path
        d="M16 6 L16 3"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M24 10 L26 8"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M27 16 L29 16"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M8 10 L6 8"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

/** Uncomfortable - irregular stomach with discomfort marks */
export function DigestionUncomfortableIcon({ size = 32, strokeWidth = 1.5, color = '#041E3A' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Irregular stomach outline */}
      <path
        d="M12 8 C8 10, 7 14, 8 18 C9 22, 12 25, 16 25 C20 25, 23 22, 24 18 C25 14, 24 10, 20 8 C18 7, 14 7, 12 8"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
      />
      {/* Discomfort marks - zigzag inside */}
      <path
        d="M13 14 L15 16 L13 18"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />
      <path
        d="M19 14 L17 16 L19 18"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />
    </svg>
  );
}

// GENERIC STATE ICONS (for other check-in types)

/** Good state - upward curve (smile-like) */
export function StateGoodIcon({ size = 32, strokeWidth = 1.5, color = '#041E3A' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="16"
        cy="16"
        r="10"
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
      />
      <path
        d="M11 18 C12 20, 14 21, 16 21 C18 21, 20 20, 21 18"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Neutral state - horizontal line */
export function StateNeutralIcon({ size = 32, strokeWidth = 1.5, color = '#041E3A' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="16"
        cy="16"
        r="10"
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
      />
      <path
        d="M11 18 L21 18"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Poor state - downward curve (frown-like) */
export function StatePoorIcon({ size = 32, strokeWidth = 1.5, color = '#041E3A' }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="16"
        cy="16"
        r="10"
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
      />
      <path
        d="M11 20 C12 18, 14 17, 16 17 C18 17, 20 18, 21 20"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Helper function to get the appropriate icon for a check-in option
 * Maps Vietnamese text to corresponding icon component
 */
export function getCheckInIcon(optionText: string): React.ReactNode | null {
  const text = optionText.toLowerCase().trim();
  
  // Sleep quality
  if (text === 'ngon') return <SleepGoodIcon />;
  if (text === 'chập chờn') return <SleepRestlessIcon />;
  if (text === 'kém') {
    // Context-dependent: could be sleep or energy
    // Default to sleep poor for now
    return <SleepPoorIcon />;
  }
  
  // Body feeling (morning baseline)
  if (text === 'ổn') return <DigestionNormalIcon color="#059669" />; // Green accent
  if (text === 'cứng') return <StateNeutralIcon />; // Neutral (no accent)
  if (text === 'đau / khó chịu') return <DigestionUncomfortableIcon color="#D97706" />; // Amber accent
  if (text === 'mệt' || text === 'yếu') return <EnergyLowIcon />; // Neutral (no accent)
  
  // Midday desk check-in
  if (text === 'tập trung') return <EnergyHighIcon color="#059669" />; // Green accent - focused/productive
  if (text === 'uể oải') return <EnergyLowIcon />; // Neutral - sluggish
  if (text === 'căng thẳng') return <StateNeutralIcon />; // Neutral - stressed (horizontal line = tension)
  if (text === 'lưng tức') return <DigestionUncomfortableIcon color="#D97706" />; // Amber accent - back tight
  
  // Energy levels
  if (text === 'tốt' || text === 'khỏe') return <EnergyHighIcon />;
  if (text === 'trung bình' || text === 'bình thường') return <EnergyMediumIcon />;
  
  // Digestion
  if (text === 'bình thường') return <DigestionNormalIcon />;
  if (text === 'đầy hơi' || text === 'no căng') return <DigestionBloatedIcon />;
  if (text === 'khó chịu' || text === 'đau') return <DigestionUncomfortableIcon />;
  
  // Generic fallbacks
  if (text.includes('tốt') || text.includes('ngon')) return <StateGoodIcon />;
  if (text.includes('bình thường')) return <StateNeutralIcon />;
  if (text.includes('kém') || text.includes('xấu')) return <StatePoorIcon />;
  
  return null;
}
