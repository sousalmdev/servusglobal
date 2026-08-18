"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/providers/ReducedMotionProvider";
import { usePathname } from "next/navigation";
import type { Dictionary } from "@/i18n/getDictionary";

gsap.registerPlugin(ScrollTrigger);

export default function ContactCTA({ dict }: { dict: Dictionary }) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const pathname = usePathname();
  const currentLocale = pathname?.split("/")[1] || "en";

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.set(".cta-heading .hero-word", { yPercent: 110, filter: "blur(8px)" });
      gsap.set(".cta-sub", { y: 30, opacity: 0 });
      gsap.set(".cta-button", { y: 20, opacity: 0, scale: 0.95 });
      gsap.set(".cta-accent-line", { scaleX: 0 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 75%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline();

          tl.to(".cta-accent-line", {
            scaleX: 1,
            duration: 1.2,
            ease: "expo.out",
          });

          tl.to(
            ".cta-heading .hero-word",
            {
              yPercent: 0,
              filter: "blur(0px)",
              duration: 1.4,
              stagger: 0.1,
              ease: "expo.out",
            },
            "-=0.8"
          );

          tl.to(
            ".cta-sub",
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: "expo.out",
            },
            "-=0.9"
          );

          tl.to(
            ".cta-button",
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.8,
              ease: "back.out(1.4)",
            },
            "-=0.6"
          );
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative px-6 md:px-12 lg:px-16 overflow-hidden"
      style={{
        paddingTop: "clamp(8rem, 16vw, 14rem)",
        paddingBottom: "clamp(8rem, 16vw, 14rem)",
      }}
    >
      {/* Subtle radial glow behind the CTA */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(900px, 80vw)",
          height: "min(900px, 80vw)",
          background:
            "radial-gradient(circle, rgba(212,165,55,0.06) 0%, transparent 70%)",
          borderRadius: "50%",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Accent line */}
        <div
          className="cta-accent-line mb-10 origin-center"
          style={{
            width: "80px",
            height: "2px",
            background: "var(--color-gold)",
          }}
        />

        {/* Heading */}
        <div className="cta-heading mb-8">
          <h2
            className="font-display"
            style={{
              fontSize: "clamp(2.5rem, 7vw, 7rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
              fontWeight: 800,
            }}
          >
            <span className="block overflow-hidden">
              <span
                className="hero-word block"
                style={{ color: "var(--color-off-white)" }}
              >
                {dict.contact.word1}
              </span>
            </span>
            <span className="block overflow-hidden">
              <span className="hero-word block">
                <span style={{ color: "var(--color-off-white)" }}>
                  {dict.contact.word2}
                </span>
                <span
                  className="serif-italic"
                  style={{ color: "var(--color-gold)", fontWeight: 400 }}
                >
                  {dict.contact.word3}
                </span>
              </span>
            </span>
          </h2>
        </div>

        {/* Subtitle */}
        <p
          className="cta-sub font-body text-body-lg mb-12"
          style={{
            color: "var(--color-off-white)",
            opacity: 0.5,
            maxWidth: "520px",
            lineHeight: 1.7,
          }}
        >
          {dict.contact.form.subtitleArtist}
        </p>

        {/* CTA Button */}
        <a
          href={`/${currentLocale}/contact`}
          className="cta-button group relative inline-flex items-center gap-4 px-10 py-5 font-body text-eyebrow eyebrow transition-all duration-500 hover:-translate-y-1"
          style={{
            color: "var(--color-black)",
            background: "var(--color-gold)",
            fontWeight: 700,
          }}
        >
          {/* Hover shimmer */}
          <span
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background:
                "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)",
            }}
          />
          <span className="relative z-10">{dict.nav.workWithUs}</span>
          <span
            className="relative z-10 transition-transform duration-300 group-hover:translate-x-1"
            aria-hidden
          >
            →
          </span>
        </a>
      </div>
    </section>
  );
}
