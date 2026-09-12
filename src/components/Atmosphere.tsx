import { useEffect, useRef } from 'react';

export function Atmosphere() {
  const sphereRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    let mouseX = window.innerWidth * 0.75;
    let mouseY = window.innerHeight * 0.18;
    let isHovering = false;

    // Follow offset tracking with smooth inertia
    let currentOffsetX = 0;
    let currentOffsetY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isHovering = true;
    };

    const onMouseLeave = () => {
      isHovering = false;
    };

    const onMouseEnter = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isHovering = true;
    };

    const onBlur = () => {
      isHovering = false;
    };

    const tick = (time: number) => {
      const t = time * 0.001;

      // 1. Organic, continuous idle wandering drift across a wide area (approx ±120px X, ±90px Y on desktop)
      const isMobile = window.innerWidth < 640;
      const isTablet = window.innerWidth < 1024;
      const wanderScale = isMobile ? 0.45 : isTablet ? 1.1 : 2.0;

      const idleX =
        (Math.sin(t * 0.28) * 55 +
          Math.cos(t * 0.43 + 1.2) * 40 +
          Math.sin(t * 0.17 + 2.5) * 25) *
        wanderScale;

      const idleY =
        (Math.cos(t * 0.23 + 0.8) * 42 +
          Math.sin(t * 0.37 + 1.9) * 30 +
          Math.cos(t * 0.14 + 3.1) * 18) *
        wanderScale;

      // 2. Responsive mouse attraction calculation relative to base anchor
      let targetOffsetX = 0;
      let targetOffsetY = 0;

      if (isHovering) {
        // Base anchor position of the sphere (top: 18%, right: 22%)
        const rightPercent = isMobile ? 0.08 : isTablet ? 0.12 : 0.22;
        const topPercent = isMobile ? 0.14 : isTablet ? 0.16 : 0.18;
        const radius = isMobile ? 36 : isTablet ? 48 : 60;

        const anchorX = window.innerWidth * (1 - rightPercent) - radius;
        const anchorY = window.innerHeight * topPercent + radius;

        // Distance vector from base anchor to mouse
        const dx = mouseX - anchorX;
        const dy = mouseY - anchorY;

        // Follow fraction (0.22 follow factor giving cursor clear influence across the screen)
        const followFactor = 0.8;
        const rawOffsetX = dx * followFactor;
        const rawOffsetY = dy * followFactor;

        // Generous travel displacement (up to 320px on desktop) allowing wide following across the page
        const maxDisplacement = isMobile ? 150 : isTablet ? 600 : 1100;
        const dist = Math.hypot(rawOffsetX, rawOffsetY);

        if (dist > maxDisplacement) {
          targetOffsetX = (rawOffsetX / dist) * maxDisplacement;
          targetOffsetY = (rawOffsetY / dist) * maxDisplacement;
        } else {
          targetOffsetX = rawOffsetX;
          targetOffsetY = rawOffsetY;
        }
      }

      // 3. Fast, responsive interpolation with physical inertia (0.26 factor for immediate yet physical response)
      currentOffsetX += (targetOffsetX - currentOffsetX) * 0.1;
      currentOffsetY += (targetOffsetY - currentOffsetY) * 0.1;

      // 4. Combined final transform (idle floating + mouse tracking)
      const clampedIdleX = Math.max(-50, Math.min(100, idleX));

      const finalX = currentOffsetX + clampedIdleX;
      const finalY = currentOffsetY + idleY;

      if (sphereRef.current) {
        sphereRef.current.style.transform = `translate3d(${finalX.toFixed(2)}px, ${finalY.toFixed(2)}px, 0)`;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);
    window.addEventListener('blur', onBlur);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      window.removeEventListener('blur', onBlur);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="atmosphere" aria-hidden="true">
      <div className="atmosphere-container">
        {/* Unified continuous atmospheric field (Calm Sunset Landscape) */}
        <div className="atmosphere-field">
          {/* 1. Translucent upper ivory fog veil keeping the top light and clean */}
          <div className="atmosphere-sun-veil" />

          {/* 2. Left High Mountain Crest (peaks high on left at ~55% height) */}
          <div className="atmosphere-peak-left" />

          {/* 3. Center-Right Rising Dome (second warm dome at ~50% height) */}
          <div className="atmosphere-dome-center" />

          {/* 4. Right Sweeping Diagonal Cool Muted Blue Stream (stretches up to right) */}
          <div className="atmosphere-stream-right" />

          {/* 5. Undulating Warm Valley Underflow connecting the formations */}
          <div className="atmosphere-underflow" />

          {/* 6. Luminous Horizon Bed glowing along the bottom */}
          <div className="atmosphere-horizon-bed" />
        </div>

        {/* ONE Small Floating Atmospheric Sphere (Planet Cycle: Earth -> Mars -> Jupiter) */}
        <div ref={sphereRef} className="atmospheric-sphere-wrapper">
          <div className="atmospheric-sphere">
            {/* 1. Earth Planet Skin */}
            <div className="planet-skin planet-earth">
              <div className="sphere-backdrop" />
              <div className="sphere-internal-flow">
                <div className="sphere-peach-dome" />
                <div className="sphere-blue-band" />
                <div className="sphere-coral-base" />
              </div>
              <div className="sphere-rim-light" />
            </div>

            {/* 2. Mars Planet Skin */}
            <div className="planet-skin planet-mars">
              <div className="sphere-backdrop" />
              <div className="sphere-internal-flow">
                <div className="sphere-peach-dome" />
                <div className="sphere-blue-band" />
                <div className="sphere-coral-base" />
              </div>
              <div className="sphere-rim-light" />
            </div>

            {/* 3. Jupiter Planet Skin */}
            <div className="planet-skin planet-jupiter">
              <div className="sphere-backdrop" />
              <div className="sphere-internal-flow">
                <div className="sphere-peach-dome" />
                <div className="sphere-blue-band" />
                <div className="sphere-coral-base" />
              </div>
              <div className="sphere-rim-light" />
            </div>
          </div>
        </div>

        {/* Subtle SVG turbulence noise overlay for 3D depth and banding elimination */}
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
      </div>
    </div>
  );
}
