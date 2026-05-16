"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/providers/ReducedMotionProvider";

gsap.registerPlugin(ScrollTrigger);

export default function WorkWithUsMarquee({ dict }: { dict: any }) {
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

  const items = Array(8).fill(null);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden cursor-pointer"
      style={{
        paddingTop: "clamp(3rem, 6vw, 5rem)",
        paddingBottom: "clamp(3rem, 6vw, 5rem)",
        backgroundColor: "var(--color-gold)",
        color: "var(--color-black)",
      }}
      onClick={() => {
        const el = document.getElementById("contact");
        el?.scrollIntoView({ behavior: "smooth" });
      }}
    >
      <div className="overflow-hidden">
        <div className="marquee-track marquee-forward marquee-fast">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex items-center whitespace-nowrap">
              {items.map((_, i) => (
                <span key={`${copy}-${i}`} className="flex items-center">
                  <span
                    className="font-display px-3 md:px-6"
                    style={{
                      fontSize: "clamp(3rem, 9vw, 10rem)",
                      lineHeight: 1,
                      letterSpacing: "-0.04em",
                      fontWeight: 800,
                      color: "var(--color-black)",
                    }}
                  >
                    {dict.marquees.work_word1}
                  </span>
                  <span
                    className="serif-italic px-2 md:px-4"
                    style={{
                      fontSize: "clamp(2.5rem, 8vw, 9rem)",
                      lineHeight: 1,
                      color: "var(--color-black)",
                      opacity: 0.85,
                      fontWeight: 400,
                    }}
                  >
                    {dict.marquees.work_word2}
                  </span>
                  <span
                    className="inline-block mx-4 md:mx-8"
                    style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      background: "var(--color-black)",
                      opacity: 0.3,
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
