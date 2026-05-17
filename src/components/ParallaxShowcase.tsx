"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/providers/ReducedMotionProvider";
import { artists } from "@/data/artists";

gsap.registerPlugin(ScrollTrigger);

const showcaseArtist =
  artists.find((a) => a.slug === "marcos-vidal") || artists[1];

export default function ParallaxShowcase({ dict }: { dict?: any }) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      // Deep parallax on image
      gsap.to(".showcase-img", {
        y: "-15%",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      if (reducedMotion) return;

      // Clip-path reveal for the whole section
      gsap.set(".showcase-clip", { clipPath: "inset(15% 5% 15% 5%)" });
      gsap.to(".showcase-clip", {
        clipPath: "inset(0% 0% 0% 0%)",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 90%",
          end: "top 30%",
          scrub: true,
        },
      });

      // Text reveal
      gsap.set(".showcase-text", { opacity: 0, y: 30 });
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 50%",
        once: true,
        onEnter: () => {
          gsap.to(".showcase-text", {
            opacity: 1,
            y: 0,
            duration: 1.2,
            stagger: 0.1,
            ease: "expo.out",
          });
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ height: "100vh", minHeight: "600px" }}
    >
      <div className="showcase-clip absolute inset-0 overflow-hidden">
        {/* Image */}
        <div
          className="showcase-img absolute inset-0 w-full bg-cover bg-center img-bw"
          style={{
            backgroundImage: `url(${showcaseArtist.portraitUrl})`,
            backgroundColor: "#0a0a0a",
            backgroundBlendMode: "screen",
            opacity: 0.25,
            height: "130%",
            top: "-15%",
          }}
        />

        {/* Glass shine flare overlay */}
        <div className="glass-shine opacity-30" />

        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,10,10,0.3) 0%, rgba(10,10,10,0.6) 100%)",
          }}
        />

        {/* Centered content */}
        <div className="relative mix-blend-screen z-10 flex flex-col items-center justify-center h-full text-center px-6">
    
          <h2
            className="showcase-text font-display max-w-4xl"
            style={{
              color: "var(--color-off-white)",
              fontSize: "clamp(2.5rem, 6vw, 6rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.035em",
              fontWeight: 800,
            }}
          >
            {dict?.showcase?.heading1 || "The sound is yours."}
            <br />
            <span className="serif-italic" style={{ color: "var(--color-gold)", fontWeight: 400 }}>
              {dict?.showcase?.heading2 || "We amplify."}
            </span>
          </h2>
          <p
            className="showcase-text font-body mt-8 max-w-lg text-pretty"
            style={{
              color: "var(--color-off-white)",
              opacity: 0.5,
              fontSize: "clamp(0.875rem, 1.1vw, 1.0625rem)",
              lineHeight: 1.7,
            }}
          >
            {dict?.showcase?.desc || "Build the team, the rollout and the business around the music you're already making."}
          </p>
        </div>
      </div>
    </section>
  );
}
