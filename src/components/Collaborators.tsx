"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useReducedMotion } from "@/providers/ReducedMotionProvider";
import type { Dictionary } from "@/i18n/getDictionary";

gsap.registerPlugin(ScrollTrigger);

const COLLABORATORS = [
  {
    name: "Sony Music",
    src: "/images/logos/collaborators/sonymusic.png",
    invertOnDark: false,
    scale: 1,
  },
  {
    name: "Roc Nation",
    src: "/images/logos/collaborators/rocnation.png",
    invertOnDark: false,
    scale: 1,
  },
  {
    name: "Empire",
    src: "/images/logos/collaborators/empire.png",
    invertOnDark: false,
    scale: 1,
  },
  {
    name: "XO",
    src: "/images/logos/collaborators/xo.png",
    invertOnDark: false,
    scale: 1,
  },
  {
    name: "808 Mafia",
    src: "/images/logos/collaborators/808mafia.png",
    invertOnDark: true,
    scale: 1,
  },
  {
    name: "Freebandz",
    src: "/images/logos/collaborators/freebandz.png",
    invertOnDark: true,
    scale: 1,
  },
  {
    name: "BKS",
    src: "/images/logos/collaborators/bks.png",
    invertOnDark: false,
    customFilter: "brightness(0) invert(1)",
    scale: 1,
  },
  {
    name: "NFU",
    src: "/images/logos/collaborators/nfu.png",
    invertOnDark: false,
    scale: 1.4,
  },
];

export default function Collaborators({ dict }: { dict: Dictionary }) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const heading = sectionRef.current!.querySelector(".collab-heading");
      const eyebrow = sectionRef.current!.querySelector(".collab-eyebrow");
      const line = sectionRef.current!.querySelector(".collab-accent-line");
      const subtext = sectionRef.current!.querySelector(".collab-subtext");
      const isMobile = window.matchMedia("(max-width: 767px)").matches;

      if (reducedMotion) {
        gsap.set([eyebrow, heading, line, subtext], { opacity: 1, y: 0 });
        gsap.set(".collab-logo-item", { opacity: 1, y: 0, scale: 1 });
        if (line) gsap.set(line, { scaleX: 1 });
        return;
      }

      // Initial state for header elements
      gsap.set(eyebrow, { opacity: 0, y: 12 });
      gsap.set(heading, { opacity: 0, y: 25 });
      gsap.set(line, { scaleX: 0 });
      gsap.set(subtext, { opacity: 0, y: 15 });

      // Header entrance animation
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 78%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
          tl.to(eyebrow, { opacity: 0.5, y: 0, duration: 1.0 }, 0);
          tl.to(heading, { opacity: 1, y: 0, duration: 1.4 }, 0.1);
          tl.to(
            line,
            { scaleX: 1, duration: 1.6, ease: "power4.inOut" },
            0.3
          );
          tl.to(subtext, { opacity: 0.5, y: 0, duration: 1.2 }, 0.5);

          // Desktop: stagger all logos at once
          if (!isMobile) {
            const items = gsap.utils.toArray<HTMLElement>(".collab-logo-item");
            gsap.set(items, { opacity: 0, y: 40, scale: 0.92 });
            tl.to(
              items,
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1.4,
                stagger: { each: 0.1, from: "random" },
                ease: "elastic.out(1, 0.8)",
              },
              0.6
            );
          }
        },
      });

      // Mobile: each logo animates individually on scroll
      if (isMobile) {
        const mobileItems =
          gsap.utils.toArray<HTMLElement>(".collab-logo-item");
        mobileItems.forEach((item) => {
          gsap.set(item, { opacity: 0, y: 50, scale: 0.9 });
          ScrollTrigger.create({
            trigger: item,
            start: "top 85%",
            once: true,
            onEnter: () => {
              gsap.to(item, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1.2,
                ease: "expo.out",
              });
            },
          });
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
        paddingTop: "clamp(4rem, 12vw, 10rem)",
        paddingBottom: "clamp(4rem, 12vw, 10rem)",
        borderTop: "1px solid rgba(245, 242, 235, 0.08)",
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col items-start md:items-center md:text-center">
        {/* Eyebrow */}
        <span
          className="collab-eyebrow font-body text-eyebrow eyebrow inline-block mb-4 md:mb-6 tracking-[0.25em]"
          style={{
            color: "var(--color-gold)",
            fontSize: "clamp(0.6rem, 1.5vw, 0.6875rem)",
          }}
        >
          {(dict as any).collaborators.eyebrow}
        </span>

        {/* Heading */}
        <h2
          className="collab-heading font-display mb-4 md:mb-6 text-pretty"
          style={{
            fontSize: "clamp(1.75rem, 5.5vw, 4.5rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            fontWeight: 800,
            color: "var(--color-off-white)",
          }}
        >
          {(dict as any).collaborators.title}
        </h2>

        {/* Gold accent line */}
        <div
          className="collab-accent-line mb-5 md:mb-8"
          style={{
            width: "clamp(40px, 8vw, 100px)",
            height: "1px",
            background:
              "linear-gradient(90deg, var(--color-gold), transparent)",
            transformOrigin: "left",
          }}
        />

        {/* Subtext */}
        <p
          className="collab-subtext font-body mb-10 md:mb-20 text-pretty"
          style={{
            color: "var(--color-off-white)",
            opacity: 0.5,
            fontSize: "clamp(0.8125rem, 1.2vw, 1rem)",
            lineHeight: 1.6,
            maxWidth: "560px",
          }}
        >
          {(dict as any).collaborators.subtitle}
        </p>

        {/* Logo Grid — 4 cols desktop, 1 col mobile */}
        <div className="collab-grid w-full grid gap-0 grid-cols-2 md:grid-cols-4">
          {COLLABORATORS.map((collab) => (
            <div
              key={collab.name}
              className="collab-logo-item group relative flex items-center justify-center"
              style={{
                padding: "clamp(1.5rem, 4vw, 4.5rem) clamp(1rem, 3vw, 3.5rem)",
                borderBottom: "1px solid rgba(245, 242, 235, 0.06)",
              }}
            >
              {/* Hover glow background */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(212, 165, 65, 0.06) 0%, transparent 70%)",
                }}
              />

              {/* Logo container — scale only on desktop */}
              <div
                className="relative transition-transform duration-500 ease-out group-hover:scale-110 collab-logo-inner"
                style={{
                  width: "100%",
                  maxWidth: "180px",
                  aspectRatio: "3 / 2",
                  filter: collab.customFilter
                    ? collab.customFilter
                    : collab.invertOnDark ? "invert(1)" : "none",
                  "--logo-scale": collab.scale,
                } as React.CSSProperties}
              >
                <Image
                  src={collab.src}
                  alt={collab.name}
                  fill
                  sizes="(max-width: 768px) 60vw, 25vw"
                  className="object-contain grayscale brightness-110"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

