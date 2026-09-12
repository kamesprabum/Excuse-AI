interface MascotProps {
  size?: number;
  className?: string;
  expression?: 'default' | 'thinking' | 'happy';
}

export function Mascot({ size = 40, className = '', expression: _expression = 'default' }: MascotProps) {
  return (
    <img
      src="/excuse-ai-logo.png"
      alt="Excuse AI mascot"
      width={size}
      height={size}
      className={`inline-block shrink-0 object-contain select-none ${className}`}
      style={{ width: `${size}px`, height: `${size}px` }}
      loading="eager"
      draggable={false}
    />
  );
}

export function MascotLogo({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Mascot size={size} />
      <span className="text-lg font-bold tracking-tight text-ink-900">
        Excuse<span className="text-accent-pink"> AI</span>
      </span>
    </div>
  );
}
