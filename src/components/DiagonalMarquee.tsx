"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/providers/ReducedMotionProvider";
import FleurIcon from "@/components/FleurIcon";

gsap.registerPlugin(ScrollTrigger);

const ROTATE_DEG = -4;

export default function DiagonalMarquee() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".diag-band", {
        opacity: 0,
        y: 40,
        duration: 1.1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 95%",
          once: true,
        },
      });
    }, containerRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  const items = Array(10).fill(null);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="diag-host relative pointer-events-none"
    >
      <div
        className="diag-band absolute left-1/2 top-1/2"
        style={{
          width: "130vw",
          transform: `translate(-50%, -50%) rotate(${ROTATE_DEG}deg)`,
          transformOrigin: "center center",
          background: "var(--color-off-white)",
          color: "var(--color-black)",
          paddingTop: "clamp(1.1rem, 2.2vw, 1.7rem)",
          paddingBottom: "clamp(1.1rem, 2.2vw, 2rem)",
          boxShadow:
            "0 40px 90px -25px rgba(0,0,0,0.7), 0 -40px 90px -25px rgba(0,0,0,0.5)",
          borderTop: "1px solid rgba(10,10,10,0.12)",
          borderBottom: "1px solid rgba(10,10,10,0.12)",
        }}
      >
        <div className="overflow-hidden">
          <div className="marquee-track marquee-forward">
            {[0, 1].map((copy) => (
              <div
                key={copy}
                className="flex items-center whitespace-nowrap"
              >
                {items.map((_, i) => (
                  <span
                    key={`${copy}-${i}`}
                    className="flex items-center"
                  >
                    <span
                      className="font-display px-4 md:px-7"
                      style={{
                        fontSize: "clamp(3rem, 8vw, 8rem)",
                        lineHeight: 1,
                        letterSpacing: "-0.04em",
                        fontWeight: 800,
                        color: "var(--color-black)",
                      }}
                    >
                      SERVUS
                    </span>
                    <span
                      className="serif-italic px-2 md:px-5"
                      style={{
                        fontSize: "clamp(2.4rem, 6.5vw, 7rem)",
                        lineHeight: 1,
                        color: "var(--color-gold-dim)",
                        fontWeight: 400,
                      }}
                    >
                      global
                    </span>
                    <FleurIcon
                      className="mx-4 md:mx-8"
                      style={{
                        width: "clamp(2rem, 3.6vw, 3rem)",
                        height: "clamp(2rem, 3.6vw, 3rem)",
                        color: "var(--color-gold)",
                        flexShrink: 0,
                      }}
                    />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
