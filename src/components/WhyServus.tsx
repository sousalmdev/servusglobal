"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useReducedMotion } from "@/providers/ReducedMotionProvider";
import { FiShield, FiTrendingUp, FiGlobe } from "react-icons/fi";
import type { Dictionary } from "@/i18n/getDictionary";

gsap.registerPlugin(ScrollTrigger);

// Helper to map pillar index to corresponding icon
const getIconForIndex = (index: number) => {
  const classes = "w-8 h-8 md:w-9 md:h-9 transition-transform duration-500 group-hover:scale-110";
  switch (index) {
    case 0:
      return <FiShield className={classes} />;
    case 1:
      return <FiTrendingUp className={classes} />;
    case 2:
      return <FiGlobe className={classes} />;
    default:
      return <FiShield className={classes} />;
  }
};

export default function WhyServus({ dict }: { dict: Dictionary }) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageMaskRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        // Simple static styling for reduced motion
        gsap.set(".why-eyebrow", { opacity: 0.5, y: 0 });
        gsap.set(".why-heading", { opacity: 1, y: 0 });
        gsap.set(".why-pillar-item", { opacity: 1, x: 0 });
        gsap.set(".why-pillar-icon", { opacity: 1, scale: 1, rotation: 0 });
        gsap.set(imageMaskRef.current, { clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)" });
        gsap.set(".why-badge-card", { opacity: 1, scale: 1 });
        return;
      }

      // Initial state
      gsap.set(".why-eyebrow", { opacity: 0, y: 15 });
      gsap.set(".why-heading", { opacity: 0, y: 30 });
      gsap.set(".why-pillar-item", { opacity: 0, x: -60 });
      gsap.set(".why-pillar-icon", { opacity: 0, scale: 0, rotation: -180 });
      gsap.set(imageMaskRef.current, { clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)" });
      gsap.set(".why-badge-card", { opacity: 0, scale: 0.85, y: 20 });

      // Main entrance timeline
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 75%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
          
          tl.to(".why-eyebrow", { opacity: 0.5, y: 0, duration: 1.0 }, 0);
          tl.to(".why-heading", { opacity: 1, y: 0, duration: 1.4 }, 0.15);
          
          // Pillars slide in from left with stagger
          tl.to(
            ".why-pillar-item",
            { opacity: 1, x: 0, duration: 1.4, stagger: 0.15 },
            0.35
          );

          // Icons spin-in with elastic bounce
          tl.to(
            ".why-pillar-icon",
            { opacity: 1, scale: 1, rotation: 0, duration: 1.6, stagger: 0.15, ease: "elastic.out(1, 0.5)" },
            0.5
          );
          
          // Image — diagonal wipe reveal
          tl.to(
            imageMaskRef.current,
            { clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0% 100%)", duration: 1.8, ease: "power4.inOut" },
            0.25
          );

          tl.to(
            ".why-badge-card",
            { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "elastic.out(1, 0.75)" },
            1.1
          );

          // Counter animation on badge '15+'
          const badgeNum = { val: 0 };
          tl.to(
            badgeNum,
            {
              val: 3,
              duration: 2.0,
              ease: "power2.out",
              onUpdate: () => {
                const el = document.querySelector(".why-badge-number");
                if (el) {
                  el.textContent = Math.round(badgeNum.val) + "+";
                }
              },
            },
            1.2
          );
        },
      });

      // Subtle parallax scroll effect on the image
      if (imageRef.current) {
        gsap.to(imageRef.current, {
          yPercent: 12,
          scale: 1.12,
          ease: "none",
          scrollTrigger: {
            trigger: imageMaskRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="story"
      className="relative px-6 md:px-12 lg:px-16 overflow-hidden"
      style={{
        paddingTop: "clamp(6rem, 12vw, 10rem)",
        paddingBottom: "clamp(6rem, 12vw, 10rem)",
        borderTop: "1px solid rgba(245, 242, 235, 0.08)",
      }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Column - Content & Values */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          {/* Eyebrow */}
          <span
            className="why-eyebrow font-body text-eyebrow eyebrow inline-block mb-6 tracking-[0.25em]"
            style={{ color: "var(--color-gold)" }}
          >
            {dict.whyServus.eyebrow}
          </span>

          {/* Heading */}
          <h2
            className="why-heading font-display mb-12 text-pretty"
            style={{
              fontSize: "clamp(2.5rem, 5.5vw, 4.5rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              fontWeight: 800,
              color: "var(--color-off-white)",
            }}
          >
            {dict.whyServus.title}
          </h2>

          {/* Pillars List */}
          <div className="flex flex-col gap-8 md:gap-10">
            {dict.whyServus.pillars.map((pillar: any, i: number) => (
              <div
                key={pillar.title}
                className="why-pillar-item flex gap-6 items-start group"
              >
                {/* Icon wrapper with subtle border & gold color */}
                <div
                  className="why-pillar-icon flex-shrink-0 flex items-center justify-center p-3 rounded-sm"
                  style={{
                    color: "var(--color-gold)",
                    background: "rgba(245, 242, 235, 0.02)",
                    border: "1px solid rgba(245, 242, 235, 0.06)",
                  }}
                >
                  {getIconForIndex(i)}
                </div>

                {/* Text content */}
                <div>
                  <h3
                    className="font-display mb-2 transition-colors duration-500 group-hover:text-[var(--color-gold)]"
                    style={{
                      color: "var(--color-off-white)",
                      fontSize: "clamp(1.25rem, 1.8vw, 1.5rem)",
                      lineHeight: 1.2,
                      letterSpacing: "-0.015em",
                      fontWeight: 700,
                    }}
                  >
                    {pillar.title}
                  </h3>
                  <p
                    className="font-body text-pretty"
                    style={{
                      color: "var(--color-off-white)",
                      opacity: 0.55,
                      fontSize: "0.9375rem",
                      lineHeight: 1.6,
                    }}
                  >
                    {pillar.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Large Editorial Image & Overlapping Badge */}
        <div className="lg:col-span-6 relative flex justify-center items-center w-full">
          {/* Main Image Frame with inset reveal clip-path */}
          <div
            ref={imageMaskRef}
            className="relative w-full overflow-hidden"
            style={{
              aspectRatio: "16/19",
            }}
          >
             {/* The Image inside which GSAP scrolls */}
             <div
               ref={imageRef}
               className="absolute inset-0 w-full h-full img-editorial"
             >
               <Image
                 src="/servusabout.png"
                 alt="About Servus"
                 fill
                 sizes="(max-width: 768px) 100vw, 50vw"
                 className="object-cover object-bottom"
                 priority
               />
             </div>
          </div>

          {/* Overlapping Badge Card */}
          <div
            className="why-badge-card absolute bottom-8 left-8 md:bottom-12 md:left-12 z-20 p-6 md:p-8 flex flex-col justify-center backdrop-blur-md bg-black/60 border border-[rgba(245,242,235,0.1)] rounded-sm"
            style={{
              width: "clamp(160px, 25vw, 240px)",
              boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
            }}
          >
            <span
              className="why-badge-number font-display text-[var(--color-gold)] font-bold block"
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                lineHeight: 1,
              }}
            >
              0+
            </span>
            <span
              className="font-body text-eyebrow eyebrow text-[rgba(245,242,235,0.6)] uppercase tracking-widest block mt-2"
              style={{
                fontSize: "0.625rem",
                lineHeight: 1.4,
              }}
            >
              {dict.whyServus.badgeText}
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
