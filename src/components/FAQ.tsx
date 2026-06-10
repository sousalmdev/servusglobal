"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/providers/ReducedMotionProvider";
import { FiPlus } from "react-icons/fi";
import type { Dictionary } from "@/i18n/getDictionary";

gsap.registerPlugin(ScrollTrigger);

export default function FAQ({ dict }: { dict: Dictionary }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const reducedMotion = useReducedMotion();

  const toggleIndex = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        // Static positioning for reduced motion
        gsap.set(".faq-eyebrow", { opacity: 0.5, y: 0 });
        gsap.set(".faq-heading", { opacity: 1, y: 0, filter: "blur(0px)" });
        gsap.set(".faq-item", { opacity: 1, clipPath: "inset(0 0% 0 0)" });
        return;
      }

      // Initial state
      gsap.set(".faq-eyebrow", { opacity: 0, y: 15 });
      gsap.set(".faq-heading", { opacity: 0, y: 30, filter: "blur(6px)" });
      gsap.set(".faq-item", { opacity: 0, clipPath: "inset(0 100% 0 0)" });

      // Main entrance timeline
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 75%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

          tl.to(".faq-eyebrow", { opacity: 0.5, y: 0, duration: 1.0 }, 0);
          tl.to(".faq-heading", { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.4 }, 0.15);
          
          // Items "unfold" from left — clip-path wipe
          tl.to(
            ".faq-item",
            { opacity: 1, clipPath: "inset(0 0% 0 0)", duration: 1.0, stagger: 0.12 },
            0.4
          );
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  if (!dict.faq) return null;

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="relative px-6 md:px-12 lg:px-16 overflow-hidden"
      style={{
        paddingTop: "clamp(6rem, 12vw, 10rem)",
        paddingBottom: "clamp(6rem, 12vw, 10rem)",
        borderTop: "1px solid rgba(245, 242, 235, 0.08)",
      }}
    >
      <div className="max-w-4xl mx-auto">

        {/* Top Header - Title above the FAQ items */}
        <div className="mb-12 md:mb-16">
          <span
            className="faq-eyebrow font-body text-eyebrow eyebrow inline-block mb-4 tracking-[0.25em]"
            style={{ color: "var(--color-gold)" }}
          >
            {dict.faq.eyebrow}
          </span>

          <h2
            className="faq-heading font-display text-pretty"
            style={{
              fontSize: "clamp(2rem, 5vw, 4rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              fontWeight: 800,
              color: "var(--color-off-white)",
            }}
          >
            {dict.faq.word1} {dict.faq.word2}
            {dict.faq.word3 && (
              <>
                {" "}{dict.faq.word3}
              </>
            )}
          </h2>
        </div>

        {/* Accordion Items below title */}
        <div className="flex flex-col border-t border-[rgba(245,242,235,0.08)]">
          {dict.faq.questions.map((item: any, i: number) => {
            const isOpen = activeIndex === i;
            return (
              <div
                key={i}
                className="faq-item flex flex-col border-b border-[rgba(245,242,235,0.08)]"
              >
                {/* Trigger Button */}
                <button
                  onClick={() => toggleIndex(i)}
                  className="w-full text-left py-6 md:py-8 flex justify-between items-center gap-6 group cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${i}`}
                  id={`faq-trigger-${i}`}
                >
                  <span
                    className="font-display font-bold tracking-tight transition-colors duration-300 text-[1.125rem] md:text-[1.35rem] group-hover:text-[var(--color-gold)]"
                    style={{
                      color: isOpen ? "var(--color-gold)" : undefined,
                    }}
                  >
                    {item.q}
                  </span>

                  {/* Elegant Thin Circle Icon containing standard Plus rotated on open */}
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 group-hover:border-[var(--color-gold)] group-hover:bg-[rgba(245,242,235,0.03)]"
                    style={{
                      color: isOpen ? "var(--color-gold)" : "var(--color-off-white)",
                      borderColor: isOpen ? "var(--color-gold)" : "rgba(245,242,235,0.15)",
                    }}
                  >
                    <FiPlus
                      className="w-4 h-4 transition-transform duration-500"
                      style={{
                        transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      }}
                    />
                  </div>
                </button>

                {/* Answer Content using grid animation trick for smooth transition */}
                <div
                  id={`faq-answer-${i}`}
                  role="region"
                  aria-labelledby={`faq-trigger-${i}`}
                  className="grid transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                  style={{
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                    opacity: isOpen ? 1 : 0,
                    overflow: "hidden",
                  }}
                >
                  <div className="min-h-0">
                    <p
                      className="pb-6 md:pb-8 font-body text-pretty"
                      style={{
                        color: "var(--color-off-white)",
                        opacity: 0.65,
                        fontSize: "0.95rem",
                        lineHeight: 1.65,
                      }}
                    >
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
