import { useEffect, useRef, useMemo } from 'react';

export function Atmosphere() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    let mx = 0;
    let my = 0;
    let cx = 0;
    let cy = 0;
    let visible = false;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!visible && cursorRef.current) {
        cursorRef.current.style.opacity = '1';
        visible = true;
      }
    };

    const onLeave = () => {
      if (cursorRef.current) {
        cursorRef.current.style.opacity = '0';
        visible = false;
      }
    };

    const tick = () => {
      cx += (mx - cx) * 0.08;
      cy += (my - cy) * 0.08;
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const particles = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: 2 + Math.random() * 3,
        duration: 6 + Math.random() * 6,
        delay: Math.random() * 5,
        color: ['rgba(245,31,125,0.3)', 'rgba(184,23,168,0.28)', 'rgba(118,16,195,0.3)', 'rgba(72,189,217,0.25)'][i % 4],
      })),
    []
  );

  return (
    <div className="atmosphere" aria-hidden="true">
      <div className="atmosphere-blob atmosphere-blob-1" />
      <div className="atmosphere-blob atmosphere-blob-2" />
      <div className="atmosphere-blob atmosphere-blob-3" />
      <div className="atmosphere-blob atmosphere-blob-4" />
      <div className="atmosphere-blob atmosphere-blob-5" />
      <div ref={cursorRef} className="atmosphere-cursor" />

      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.left,
            top: p.top,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: p.color,
            animation: `floatParticle ${p.duration}s ease-in-out infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* Subtle grain overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}
