"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/providers/ReducedMotionProvider";
import type { Dictionary } from "@/i18n/getDictionary";

gsap.registerPlugin(ScrollTrigger);

export default function Services({ dict }: { dict: Dictionary }) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      // Heading reveal
      gsap.set(".services-heading .hero-word", { yPercent: 110 });
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 75%",
        once: true,
        onEnter: () => {
          gsap.to(".services-heading .hero-word", {
            yPercent: 0,
            duration: 1.4,
            stagger: 0.1,
            ease: "expo.out",
          });
        },
      });

      // Cards — alternating horizontal slide entrance
      gsap.utils.toArray<HTMLElement>(".service-card").forEach((card, i) => {
        const fromLeft = i % 2 === 0;
        const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
        const shiftX = isMobile ? (fromLeft ? -30 : 30) : (fromLeft ? -80 : 80);
        const rotateVal = isMobile ? (fromLeft ? 1.5 : -1.5) : (fromLeft ? 4 : -4);

        gsap.set(card, {
          x: shiftX,
          opacity: 0,
          rotateY: rotateVal,
        });
        ScrollTrigger.create({
          trigger: card,
          start: "top 88%",
          once: true,
          onEnter: () => {
            gsap.to(card, {
              x: 0,
              opacity: 1,
              rotateY: 0,
              duration: 1.2,
              ease: "expo.out",
              delay: (i % 3) * 0.08,
            });
          },
        });
      });

      // Counter animation on service numbers
      gsap.utils.toArray<HTMLElement>(".service-number").forEach((el) => {
        const target = parseInt(el.getAttribute("data-number") || "0", 10);
        const obj = { val: 0 };
        ScrollTrigger.create({
          trigger: el,
          start: "top 90%",
          once: true,
          onEnter: () => {
            gsap.to(obj, {
              val: target,
              duration: 1.6,
              ease: "power2.out",
              onUpdate: () => {
                el.textContent = String(Math.round(obj.val)).padStart(2, "0");
              },
            });
          },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative px-6 md:px-12 lg:px-16"
      style={{
        paddingTop: "clamp(8rem, 16vw, 14rem)",
        paddingBottom: "clamp(8rem, 16vw, 14rem)",
      }}
    >
      {/* Heading */}
      <div className="services-heading mb-16 md:mb-24">
        <h2
          className="font-display"
          style={{
            fontSize: "clamp(3rem, 9vw, 10rem)",
            lineHeight: 0.9,
            letterSpacing: "-0.04em",
            fontWeight: 800,
          }}
        >
          <span className="block overflow-hidden">
            <span className="hero-word block" style={{ color: "var(--color-off-white)" }}>
              {dict.services.word1}
            </span>
          </span>
          <span className="block overflow-hidden">
            <span className="hero-word block serif-italic" style={{ color: "var(--color-gold)" }}>
              {dict.services.word2}
            </span>
          </span>
        </h2>
      </div>

      {/* Services Grid */}
      <div className="services-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {dict.services.list.map((service: any, i: number) => (
          <div
            key={service.number}
            className="service-card group p-8 md:p-10"
            style={{
              borderTop: "1px solid rgba(245, 242, 235, 0.08)",
              perspective: "800px",
            }}
          >
            {/* Number with counter animation */}
            <span
              className="service-number font-body text-eyebrow eyebrow inline-block mb-6"
              style={{ color: "var(--color-gold)", opacity: 0.6 }}
              data-number={service.number}
            >
              00
            </span>

            {/* Title */}
            <h3
              className="font-display mb-4 transition-colors duration-500 group-hover:!text-[var(--color-gold)]"
              style={{
                color: "var(--color-off-white)",
                fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                fontWeight: 600,
              }}
            >
              {service.title}
            </h3>

            {/* Description */}
            <p
              className="font-body text-pretty"
              style={{
                color: "var(--color-off-white)",
                opacity: 0.45,
                fontSize: "0.9375rem",
                lineHeight: 1.65,
              }}
            >
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
