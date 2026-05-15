"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/providers/ReducedMotionProvider";

gsap.registerPlugin(ScrollTrigger);

const LOCATIONS = [
  { prefix: "rooted in", place: "PERTH" },
  { prefix: "operating from", place: "USA" },
  { prefix: "accessible", place: "WORLDWIDE" },
];

export default function LocationMarquee() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current, {
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 90%",
          once: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  // Build the repeated content string for the muted background row
  const marqueeText = LOCATIONS.map((l) => `${l.prefix} ${l.place}`).join(" · ");
  const repeatedText = Array(6).fill(marqueeText).join(" · ");

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        paddingTop: "clamp(2.5rem, 5vw, 4.5rem)",
        paddingBottom: "clamp(2.5rem, 5vw, 4.5rem)",
        backgroundColor: "var(--color-gold)",
        color: "var(--color-black)",
      }}
    >
      {/* Row 1 — forward */}
      <div className="overflow-hidden mb-4">
        <div className="marquee-track marquee-forward marquee-slow">
          <span
            className="font-display whitespace-nowrap px-4"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 6rem)",
              lineHeight: 1,
              letterSpacing: "-0.03em",
              fontWeight: 800,
              color: "var(--color-black)",
              opacity: 0.1,
            }}
          >
            {repeatedText} ·&nbsp;
          </span>
          <span
            className="font-display whitespace-nowrap px-4"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 6rem)",
              lineHeight: 1,
              letterSpacing: "-0.03em",
              fontWeight: 800,
              color: "var(--color-black)",
              opacity: 0.1,
            }}
          >
            {repeatedText} ·&nbsp;
          </span>
        </div>
      </div>

      {/* Row 2 — main visible, reverse direction */}
      <div className="overflow-hidden">
        <div className="marquee-track marquee-reverse">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center whitespace-nowrap">
              {LOCATIONS.map((loc, i) => (
                <span key={`${copy}-${i}`} className="flex items-center">
                  <span
                    className="font-display px-4 md:px-6"
                    style={{
                      fontSize: "clamp(2.5rem, 7vw, 7rem)",
                      lineHeight: 1,
                      letterSpacing: "-0.03em",
                      fontWeight: 800,
                      color: "var(--color-black)",
                    }}
                  >
                    <span style={{ opacity: 0.5 }}>{loc.prefix} </span>
                    <span>{loc.place}</span>
                  </span>
                  <span
                    className="inline-block mx-4 md:mx-8"
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "var(--color-black)",
                      opacity: 0.5,
                      flexShrink: 0,
                    }}
                  />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

   
    </section>
  );
}
