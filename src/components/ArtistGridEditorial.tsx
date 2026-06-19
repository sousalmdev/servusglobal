"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/providers/ReducedMotionProvider";
import { artists } from "@/data/artists";
import Link from "next/link";
import Image from "next/image";
import type { Dictionary } from "@/i18n/getDictionary";

gsap.registerPlugin(ScrollTrigger);

export default function ArtistGridEditorial({ dict, lang = "en" }: { dict?: Dictionary; lang?: string }) {
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

      // Parallax drift on card images — staggered depth per card
      gsap.utils.toArray<HTMLElement>(".artist-card-img-wrap").forEach((img, i) => {
        const yAmount = 20 + (i % 3) * 10; // Vary parallax depth per column
        gsap.to(img, {
          y: -yAmount,
          ease: "none",
          scrollTrigger: {
            trigger: img.closest(".artist-card-editorial"),
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
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
            href={`/${lang}/artists/${artist.slug}`}
            className="artist-card-editorial group block relative overflow-hidden"
            style={{ aspectRatio: "4/5" }}
          >
            {/* Parallax wrapper div (animated by GSAP) */}
            <div className="artist-card-img-wrap absolute inset-0 overflow-hidden">
              {/* Inner image container (handles hover zoom with CSS) */}
              <div
                className="w-full h-full relative"
              >
                <Image
                  src={artist.portraitUrl}
                  alt={artist.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-center"
                  loading="lazy"
                />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
