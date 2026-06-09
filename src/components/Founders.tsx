"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/providers/ReducedMotionProvider";
import type { Dictionary } from "@/i18n/getDictionary";

gsap.registerPlugin(ScrollTrigger);

interface Founder {
  name: string;
  title: string;
  bio: string;
  imageUrl: string;
  align: "left" | "right";
}

const founders: Founder[] = [
  {
    name: "Seppe",
    title: "Founder | Music Executive | A&R | Artist Management",
    bio: "Raised within the world of music and entertainment, Seppe combines creative intuition with strategic industry insight. A drummer since the age of five, with foundations in rock, jazz, and hip hop, he has built his career around supporting artists in their growth, differentiation, and long-term success. Today, Seppe serves as an Artist Manager, A&R, and Music Executive dedicated to discovering talent, developing careers, and creating opportunities beyond conventional music industry pathways.",
    imageUrl: "/images/team/seppe.jpg",
    align: "left",
  },
  {
    name: "Nitrose",
    title: "Founder | Billboard Producer | Music Executive | Creative Development",
    bio: "Born in Florida and raised in Miami, Nitrose developed an early passion for music through piano and guitar before establishing himself as both an artist and Billboard producer. Since beginning his production career in 2012, he has earned recognition for his versatile sound and sophisticated approach to creative development. At Servus Global, Nitrose integrates production expertise with creative vision to shape records, elevate artists, and foster impactful careers through sound, strategy, and innovation.",
    imageUrl: "/images/team/nitrose.png",
    align: "right",
  },
];

export default function Founders({ dict }: { dict: Dictionary }) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set(".founders-heading .founders-word", { yPercent: 0 });
        gsap.set(".founder-row", { opacity: 1 });
        gsap.set(".founder-img-mask", { clipPath: "inset(0% 0 0 0)" });
        gsap.set(".founder-name-char", { yPercent: 0 });
        gsap.set(".founder-title-line", { opacity: 0.6, y: 0 });
        gsap.set(".founder-divider-line", { scaleX: 1 });
        gsap.set(".founder-bio-line", { opacity: 0.78, y: 0 });
        return;
      }

      // ── Initial hidden states ──
      gsap.set(".founders-heading .founders-word", { yPercent: 110 });
      gsap.set(".founder-row", { opacity: 0 });
      gsap.set(".founder-img-mask", { clipPath: "inset(100% 0 0 0)" });
      gsap.set(".founder-name-char", { yPercent: 120 });
      gsap.set(".founder-title-line", { opacity: 0, y: 14 });
      gsap.set(".founder-divider-line", { scaleX: 0 });
      gsap.set(".founder-bio-line", { opacity: 0, y: 20 });

      // ── Section heading reveal ──
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 75%",
        once: true,
        onEnter: () => {
          gsap.to(".founders-heading .founders-word", {
            yPercent: 0,
            duration: 1.4,
            stagger: 0.1,
            ease: "expo.out",
          });
        },
      });

      // ── Each founder row ──
      document.querySelectorAll(".founder-row").forEach((row) => {
        ScrollTrigger.create({
          trigger: row,
          start: "top 78%",
          once: true,
          onEnter: () => {
            const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

            // 1. Fade in the row
            tl.to(row, { opacity: 1, duration: 0.4 }, 0);

            // 2. Image clip-path reveal
            tl.to(
              row.querySelector(".founder-img-mask"),
              { clipPath: "inset(0% 0 0 0)", duration: 1.4 },
              0,
            );

            // 3. Name — character-by-character stagger
            tl.to(
              row.querySelectorAll(".founder-name-char"),
              { yPercent: 0, duration: 1.2, stagger: 0.04 },
              0.2,
            );

            // 4. Title
            tl.to(
              row.querySelector(".founder-title-line"),
              { opacity: 0.6, y: 0, duration: 0.9 },
              0.5,
            );

            // 5. Divider grows from left
            tl.to(
              row.querySelector(".founder-divider-line"),
              { scaleX: 1, duration: 1.0 },
              0.6,
            );

            // 6. Bio lines stagger
            tl.to(
              row.querySelectorAll(".founder-bio-line"),
              { opacity: 0.78, y: 0, duration: 0.9, stagger: 0.06 },
              0.7,
            );
          },
        });

        // Parallax drift on the image
        const imgInner = row.querySelector(".founder-img-inner");
        if (imgInner) {
          gsap.to(imgInner, {
            y: -50,
            ease: "none",
            scrollTrigger: {
              trigger: row.querySelector(".founder-img-mask"),
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  // Split bio into sentences for staggered reveal
  const splitBio = (bio: string) => {
    return bio.match(/[^.!?]+[.!?]+/g) || [bio];
  };

  return (
    <section
      ref={sectionRef}
      id="founders"
      className="relative overflow-hidden"
      style={{
        paddingTop: "clamp(8rem, 14vw, 12rem)",
        paddingBottom: "clamp(8rem, 14vw, 12rem)",
      }}
    >
      {/* ── Section Heading ── */}
      <div className="founders-heading mb-20 md:mb-32 px-6 md:px-12 lg:px-16">
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
              className="founders-word block"
              style={{ color: "var(--color-off-white)" }}
            >
              {dict.founders?.word1 ?? "THE"}
            </span>
          </span>
          <span className="block overflow-hidden">
            <span
              className="founders-word block serif-italic"
              style={{ color: "var(--color-gold)" }}
            >
              {dict.founders?.word2 ?? "founders"}
            </span>
          </span>
        </h2>
      </div>

      {/* ── Zigzag Rows ── */}
      <div className="flex flex-col gap-24 md:gap-40">
        {founders.map((founder) => {
          const isLeft = founder.align === "left";
          const nameChars = founder.name.split("");
          const bioSentences = splitBio(founder.bio);

          return (
            <div
              key={founder.name}
              className="founder-row px-6 md:px-12 lg:px-16"
            >
              <div
                className={`grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-20 items-center ${
                  isLeft ? "" : "md:[direction:rtl]"
                }`}
              >
                {/* ── Image Column ── */}
                <div
                  className={`md:col-span-5 ${isLeft ? "" : ""}`}
                  style={{ direction: "ltr" }}
                >
                  <div
                    className="founder-img-mask relative w-full overflow-hidden"
                    role="img"
                    aria-label={`Photo of ${founder.name}`}
                    style={{
                      aspectRatio: "3/4",
                      backgroundColor: "#101010",
                    }}
                  >
                    <div
                      className="founder-img-inner absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${founder.imageUrl})`,
                        transform: "scale(1.1)",
                        filter: "grayscale(1) contrast(1.1) brightness(0.85)",
                      }}
                    />

                    {/* Subtle vignette */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "radial-gradient(ellipse at center, rgba(10,10,10,0) 50%, rgba(10,10,10,0.5) 100%)",
                      }}
                    />
                  </div>
                </div>

                {/* ── Text Column ── */}
                <div
                  className="md:col-span-7 flex flex-col gap-5"
                  style={{ direction: "ltr" }}
                >
                  {/* Name — big, exclusion blend, character stagger */}
                  <h3
                    className="font-display overflow-hidden"
                    style={{
                      fontSize: "clamp(3rem, 7vw, 6rem)",
                      lineHeight: 0.9,
                      letterSpacing: "-0.04em",
                      fontWeight: 800,
                      color: "var(--color-off-white)",
                    }}
                  >
                    <span className="inline-flex overflow-hidden">
                      {nameChars.map((char, i) => (
                        <span
                          key={i}
                          className="founder-name-char inline-block"
                          style={{ willChange: "transform" }}
                        >
                          {char}
                        </span>
                      ))}
                    </span>
                  </h3>

                  {/* Title — gold eyebrow */}
                  <span
                    className="founder-title-line font-body text-eyebrow eyebrow block"
                    style={{
                      color: "var(--color-gold)",
                      fontSize: "0.625rem",
                      letterSpacing: "0.18em",
                      lineHeight: 1.6,
                    }}
                  >
                    {founder.title}
                  </span>

                  {/* Divider */}
                  <div
                    className="founder-divider-line"
                    style={{
                      height: "1px",
                      background: "rgba(245, 242, 235, 0.12)",
                      width: "100%",
                      transformOrigin: "left center",
                    }}
                  />

                  {/* Bio — sentence-by-sentence stagger */}
                  <div className="flex flex-col gap-0">
                    {bioSentences.map((sentence, i) => (
                      <p
                        key={i}
                        className="founder-bio-line font-body text-pretty"
                        style={{
                          color: "var(--color-off-white)",
                          fontSize: "clamp(0.9375rem, 1.2vw, 1.125rem)",
                          lineHeight: 1.7,
                          letterSpacing: "-0.005em",
                        }}
                      >
                        {sentence.trim()}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
