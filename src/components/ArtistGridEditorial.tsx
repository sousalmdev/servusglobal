"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/providers/ReducedMotionProvider";
import { artists } from "@/data/artists";
import Link from "next/link";
import FleurIcon from "@/components/FleurIcon";

gsap.registerPlugin(ScrollTrigger);

export default function ArtistGridEditorial({ dict }: { dict?: any }) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const sorted = [...artists].sort((a, b) => a.order - b.order);

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      // Heading reveal
      gsap.set(".roster-heading .hero-word", { yPercent: 110 });
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        once: true,
        onEnter: () => {
          gsap.to(".roster-heading .hero-word", {
            yPercent: 0,
            duration: 1.4,
            stagger: 0.1,
            ease: "expo.out",
          });
        },
      });

      // Card clip-path reveals
      gsap.utils.toArray<HTMLElement>(".artist-card-editorial").forEach((el, i) => {
        gsap.set(el, { clipPath: "inset(100% 0 0 0)" });
        ScrollTrigger.create({
          trigger: el,
          start: "top 90%",
          once: true,
          onEnter: () => {
            gsap.to(el, {
              clipPath: "inset(0% 0 0 0)",
              duration: 1.2,
              ease: "expo.out",
              delay: (i % 3) * 0.12,
            });
          },
        });
      });

      // Name reveals
      gsap.from(".artist-name-reveal", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".artist-names-group",
          start: "top 85%",
          once: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="artists"
      className="relative px-6 md:px-12 lg:px-16"
      style={{
        paddingTop: "clamp(8rem, 16vw, 14rem)",
        paddingBottom: "clamp(8rem, 16vw, 14rem)",
      }}
    >
      {/* Heading */}
      <div className="roster-heading flex items-end justify-between mb-16 md:mb-24">
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
            <span
              className="hero-word block"
              style={{ color: "var(--color-off-white)" }}
            >
              {dict?.roster?.title1 || "THE"}
            </span>
          </span>
          <span className="block overflow-hidden">
            <span
              className="hero-word block serif-italic"
              style={{ color: "var(--color-gold)" }}
            >
              {dict?.roster?.title2 || "roster"}
            </span>
          </span>
        </h2>
        <span
          className="font-body text-eyebrow eyebrow hidden md:inline-block mb-2"
          style={{ color: "var(--color-off-white)", opacity: 0.3 }}
        >
          {String(sorted.length).padStart(2, "0")} / {dict?.roster?.artistsCount || "artists"}
        </span>
      </div>

      {/* Photo grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-5">
        {sorted.map((artist) => (
          <Link
            key={artist.slug}
            href={`/artists/${artist.slug}`}
            className="artist-card-editorial group block relative overflow-hidden"
            style={{ aspectRatio: "3/4" }}
          >
            {/* Grayscale base */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] img-bw group-hover:!filter-none"
              style={{
                backgroundImage: `url(${artist.portraitUrl})`,
                backgroundColor: "#141414",
              }}
            />

            {/* Overlay — always on for touch, hover-revealed on desktop */}
            <div
              className="absolute inset-0 transition-opacity duration-700 opacity-100 md:opacity-0 md:group-hover:opacity-100"
              style={{
                background:
                  "linear-gradient(180deg, transparent 40%, rgba(10,10,10,0.8) 100%)",
              }}
            />

            {/* Name */}
            <div className="artist-names-group absolute bottom-0 left-0 right-0 p-5 md:p-6 z-10 translate-y-0 opacity-100 md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]">
              <h3
                className="artist-name-reveal font-display"
                style={{
                  color: "var(--color-off-white)",
                  fontSize: "clamp(1.25rem, 2vw, 2rem)",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                  fontWeight: 600,
                }}
              >
                {artist.name}
              </h3>
              <span
                className="artist-name-reveal font-body text-eyebrow eyebrow mt-2 inline-flex items-center gap-2"
                style={{ color: "var(--color-gold)", fontSize: "0.625rem" }}
              >
                {artist.genres.join(" · ")}
              </span>
            </div>

            {/* Arrow indicator */}
            <div className="absolute top-4 right-4 z-10 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 translate-x-0 md:translate-x-2 md:group-hover:translate-x-0">
              <span
                className="font-body text-eyebrow eyebrow"
                style={{ color: "var(--color-gold)" }}
              >
                →
              </span>
            </div>

            {/* Fleur tag */}
            <div className="absolute bottom-5 right-5 z-10 w-6 h-6 md:w-8 md:h-8 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-700 translate-y-0 md:translate-y-4 md:group-hover:translate-y-0">
              <FleurIcon style={{ color: "var(--color-gold)" }} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
