import { useMemo } from 'react';

interface MascotProps {
  size?: number;
  className?: string;
  expression?: 'default' | 'thinking' | 'happy';
}

export function Mascot({ size = 40, className = '', expression = 'default' }: MascotProps) {
  const id = useMemo(() => `mascot-${Math.random().toString(36).slice(2, 9)}`, []);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      role="img"
      aria-label="Excuse AI mascot"
    >
      <defs>
        <linearGradient id={`${id}-bg`} x1="0" y1="0" x2="64" y2="64">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id={`${id}-face`} x1="0" y1="0" x2="0" y2="64">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f0f0fa" />
        </linearGradient>
        <filter id={`${id}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* Rounded squircle body */}
      <rect
        x="6"
        y="6"
        width="52"
        height="52"
        rx="18"
        fill={`url(#${id}-bg)`}
        filter={`url(#${id}-shadow)`}
      />

      {/* Face area */}
      <circle cx="32" cy="30" r="18" fill={`url(#${id}-face)`} opacity="0.95" />

      {/* Left eye — always open */}
      <circle cx="25" cy="28" r="3.2" fill="#1b1f52" className="origin-center" style={{ animation: 'mascotBlink 4s ease-in-out infinite' }} />

      {/* Right eye — wink */}
      {expression === 'happy' ? (
        <path
          d="M35 28 Q39 25 43 28"
          stroke="#1b1f52"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      ) : (
        <path
          d="M35 28 Q39 26 43 28"
          stroke="#1b1f52"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          style={{ animation: 'mascotWink 2.5s ease-in-out infinite' }}
        />
      )}

      {/* Sly smile */}
      <path
        d="M24 36 Q32 42 40 35"
        stroke="#1b1f52"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Cheek blush */}
      <circle cx="20" cy="35" r="2.5" fill="#ec4899" opacity="0.3" />
      <circle cx="44" cy="35" r="2.5" fill="#ec4899" opacity="0.3" />

      {/* Thinking dots */}
      {expression === 'thinking' && (
        <>
          <circle cx="50" cy="14" r="2" fill="#fff" opacity="0.8">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="54" cy="10" r="1.5" fill="#fff" opacity="0.6">
            <animate attributeName="opacity" values="0.2;0.8;0.2" dur="1.5s" begin="0.3s" repeatCount="indefinite" />
          </circle>
          <circle cx="57" cy="7" r="1" fill="#fff" opacity="0.4">
            <animate attributeName="opacity" values="0.1;0.6;0.1" dur="1.5s" begin="0.6s" repeatCount="indefinite" />
          </circle>
        </>
      )}
    </svg>
  );
}

export function MascotLogo({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Mascot size={size} />
      <span className="text-lg font-bold tracking-tight text-ink-900">
        Excuse<span className="text-accent-violet"> AI</span>
      </span>
    </div>
  );
}
