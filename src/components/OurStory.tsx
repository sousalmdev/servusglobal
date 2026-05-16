"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/providers/ReducedMotionProvider";

gsap.registerPlugin(ScrollTrigger);

export default function OurStory({ dict }: { dict: any }) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.set(".story-eyebrow", { opacity: 0, y: 12 });
      gsap.set(".story-copy", { opacity: 0, y: 24 });
      gsap.set(".story-image-mask", { clipPath: "inset(100% 0 0 0)" });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 75%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
          tl.to(".story-eyebrow", { opacity: 0.5, y: 0, duration: 0.8 }, 0);
          tl.to(".story-image-mask", { clipPath: "inset(0% 0 0 0)", duration: 1.3 }, 0.1);
          tl.to(".story-copy", { opacity: 0.78, y: 0, duration: 1.0 }, 0.35);
        },
      });

      if (reducedMotion) return;

      gsap.to(".story-image-inner", {
        y: -50,
        ease: "none",
        scrollTrigger: {
          trigger: ".story-image-mask",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="story"
      className="relative px-6 md:px-12 lg:px-16 overflow-hidden"
      style={{
        paddingTop: "clamp(8rem, 14vw, 12rem)",
        paddingBottom: "clamp(8rem, 14vw, 12rem)",
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 lg:gap-24 items-center">
        {/* Text column */}
        <div className="md:col-span-6 lg:col-span-6 max-w-xl">
          <span
            className="story-eyebrow font-body text-eyebrow eyebrow inline-block mb-8"
            style={{ color: "var(--color-off-white)" }}
          >
            {dict.story.eyebrow}
          </span>

          <p
            className="story-copy font-body text-pretty"
            style={{
              color: "var(--color-off-white)",
              fontSize: "clamp(1.125rem, 1.55vw, 1.5rem)",
              lineHeight: 1.55,
              letterSpacing: "-0.005em",
            }}
          >
            {dict.story.copy}
          </p>
        </div>

        {/* Image column */}
        <div className="md:col-span-6 lg:col-span-6">
          <div
            className="story-image-mask relative w-full overflow-hidden"
            style={{
              aspectRatio: "4/5",
              backgroundColor: "#101010",
            }}
          >
            <div
              className="story-image-inner absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: "url(/fleursunset.png)",
                transform: "scale(1.05)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
