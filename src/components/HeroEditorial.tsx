"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/providers/ReducedMotionProvider";
import { artists } from "@/data/artists";

gsap.registerPlugin(ScrollTrigger);

const featured = artists.filter((a) => a.featured).slice(0, 3);

export default function HeroEditorial({ dict }: { dict: any }) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      // Parallax background
      gsap.to(".hero-bg", {
        y: "20%",
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      if (reducedMotion) return;

      const playEntrance = () => {
        // Title word reveal
        gsap.set(".hero-word", { yPercent: 110 });
        gsap.set(".hero-subtitle", { opacity: 0, y: 30 });
        gsap.set(".hero-eyebrow", { opacity: 0, y: 10 });

        const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

        tl.to(".hero-eyebrow", { opacity: 0.5, y: 0, duration: 0.8 }, 0.2);
        tl.to(".hero-word", {
          yPercent: 0,
          duration: 1.6,
          stagger: 0.1,
        }, 0.3);
        tl.to(
          ".hero-subtitle",
          { opacity: 0.5, y: 0, duration: 1.2 },
          "-=0.8"
        );
      };

      if (
        typeof window !== "undefined" &&
        sessionStorage.getItem("sg-loaded")
      ) {
        playEntrance();
      } else {
        const t = window.setTimeout(playEntrance, 2600);
        return () => window.clearTimeout(t);
      }
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Standard play attempt
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // If we land here, autoplay is blocked (likely iOS Low Power Mode).
        // We force "playback" by manually seeking the video forward.
        let lastTime = performance.now();
        let frameId: number;

        const forceLoop = (now: number) => {
          if (!video) return;
          // Only scrub if the video is actually stuck/paused
          if (video.paused) {
            const delta = (now - lastTime) / 1000;
            let nextTime = video.currentTime + delta;
            if (nextTime >= video.duration || isNaN(nextTime)) nextTime = 0;
            video.currentTime = nextTime;
          }
          lastTime = now;
          frameId = requestAnimationFrame(forceLoop);
        };

        frameId = requestAnimationFrame(forceLoop);
        return () => cancelAnimationFrame(frameId);
      });
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full overflow-hidden"
      style={{ height: "100dvh", minHeight: "700px" }}
    >
      {/* Background Image */}
      <div className="hero-bg absolute inset-0 w-full h-full">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster="/fleursunset.png"
          className="absolute scale-110 inset-0 opacity-40 w-full h-full object-cover"
        >
          <source src="/fleur.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Dark gradient overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,10,10,0.5) 0%, rgba(10,10,10,0.2) 35%, rgba(10,10,10,0.7) 100%)",
        }}
      />

      {/* Bottom fade — eases the hand-off into the diagonal marquee */}
      <div
        className="absolute inset-x-0 bottom-0 pointer-events-none"
        style={{
          height: "clamp(12rem, 28vh, 22rem)",
          background:
            "linear-gradient(180deg, rgba(10,10,10,0) 0%, rgba(10,10,10,0.65) 55%, var(--color-black) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative mix-blend-difference z-10 flex flex-col justify-center items-center h-full px-6 md:px-12 text-center">
        {/* Eyebrow */}
        <span
          className="hero-eyebrow font-body text-eyebrow eyebrow mb-8 md:mb-12"
          style={{ color: "var(--color-off-white)", opacity: 0.5 }}
        >
          {dict.hero.eyebrow}
        </span>

        {/* Massive headline */}
        <h1
          className="font-display"
          style={{
            fontSize: "clamp(3.5rem, 13vw, 15rem)",
            lineHeight: 0.85,
            letterSpacing: "-0.045em",
            fontWeight: 800,
          }}
        >
          <span className="block overflow-hidden">
            <span
              className="hero-word block"
              style={{ color: "var(--color-off-white)" }}
            >
              {dict.hero.word1}
            </span>
          </span>
          <span className="block overflow-hidden">
            <span
              className="hero-word block serif-italic"
              style={{
                color: "var(--color-gold)",
                fontWeight: 400,
                fontSize: "0.85em",
              }}
            >
              {dict.hero.word2}
            </span>
          </span>
          <span className="block overflow-hidden">
            <span
              className="hero-word block"
              style={{ color: "var(--color-off-white)" }}
            >
              {dict.hero.word3}
            </span>
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="hero-subtitle font-body mt-8 md:mt-12 max-w-xl text-pretty"
          style={{
            color: "var(--color-off-white)",
            opacity: 0.5,
            fontSize: "clamp(0.875rem, 1.2vw, 1.125rem)",
            lineHeight: 1.7,
            letterSpacing: "0.01em",
          }}
        >
          {dict.hero.subtitle}
        </p>
      </div>
    </section>
  );
}
