"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/providers/ReducedMotionProvider";
import { FiShield, FiTrendingUp, FiGlobe } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

// Helper to map pillar index to corresponding icon
const getIconForIndex = (index: number) => {
  switch (index) {
    case 0:
      return <FiShield className="w-8 h-8 md:w-9 md:h-9" />;
    case 1:
      return <FiTrendingUp className="w-8 h-8 md:w-9 md:h-9" />;
    case 2:
      return <FiGlobe className="w-8 h-8 md:w-9 md:h-9" />;
    default:
      return <FiShield className="w-8 h-8 md:w-9 md:h-9" />;
  }
};

export default function WhyServus({ dict }: { dict: any }) {
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
        gsap.set(".why-pillar-item", { opacity: 1, y: 0 });
        gsap.set(imageMaskRef.current, { clipPath: "inset(0% 0 0 0)" });
        gsap.set(".why-badge-card", { opacity: 1, scale: 1 });
        return;
      }

      // Initial state
      gsap.set(".why-eyebrow", { opacity: 0, y: 15 });
      gsap.set(".why-heading", { opacity: 0, y: 30 });
      gsap.set(".why-pillar-item", { opacity: 0, y: 40 });
      gsap.set(imageMaskRef.current, { clipPath: "inset(100% 0 0 0)" });
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
          
          tl.to(
            ".why-pillar-item",
            { opacity: 1, y: 0, duration: 1.2, stagger: 0.12 },
            0.35
          );
          
          tl.to(
            imageMaskRef.current,
            { clipPath: "inset(0% 0 0 0)", duration: 1.6, ease: "power4.inOut" },
            0.25
          );

          tl.to(
            ".why-badge-card",
            { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "elastic.out(1, 0.75)" },
            1.1
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
      id="why-servus"
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
                  className="flex-shrink-0 flex items-center justify-center p-3 rounded-sm transition-transform duration-500 group-hover:scale-110"
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
        <div className="lg:col-span-6 relative flex justify-center items-center">
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
              className="absolute inset-0 w-full h-full bg-cover bg-center img-editorial"
              style={{
                backgroundImage: "url(/servusabout.png)",
                objectPosition: "bottom",
              }}
            />
          </div>
        </div>

      </div>
    </section>
  );
}
