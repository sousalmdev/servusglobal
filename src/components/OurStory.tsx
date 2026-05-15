"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/providers/ReducedMotionProvider";
import { milestones } from "@/data/settings";
import { artists } from "@/data/artists";

gsap.registerPlugin(ScrollTrigger);

const storyImages = artists.slice(0, 5).map((a) => a.portraitUrl);

type BlockLayout = {
  side: "left" | "right"; // which side the photo lives on
  photoTilt: number;
  yearTilt: number;
  yearStroke: boolean;
  yearScale: number; // 1 = base; controls how loud each year shouts
  photoAspect: string;
  photoWidthMd: string;
};

// Five compositions, each different but rhyming. Years and photos alternate
// sides; year scales rise and fall so the eye paces through.
const LAYOUTS: BlockLayout[] = [
  { side: "right", photoTilt:  1.4, yearTilt: -2.6, yearStroke: false, yearScale: 1.00, photoAspect: "3/4",   photoWidthMd: "38%" },
  { side: "left",  photoTilt: -2.0, yearTilt:  1.6, yearStroke: true,  yearScale: 1.25, photoAspect: "1/1",   photoWidthMd: "46%" },
  { side: "right", photoTilt:  2.4, yearTilt: -1.0, yearStroke: false, yearScale: 0.85, photoAspect: "4/5",   photoWidthMd: "34%" },
  { side: "left",  photoTilt: -1.2, yearTilt:  2.4, yearStroke: true,  yearScale: 1.40, photoAspect: "16/9",  photoWidthMd: "54%" },
  { side: "right", photoTilt:  0.8, yearTilt: -1.6, yearStroke: false, yearScale: 1.05, photoAspect: "3/4",   photoWidthMd: "40%" },
];

export default function OurStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      // Section heading
      gsap.set(".story-heading .hero-word", { yPercent: 110 });
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        once: true,
        onEnter: () => {
          gsap.to(".story-heading .hero-word", {
            yPercent: 0,
            duration: 1.4,
            stagger: 0.1,
            ease: "expo.out",
          });
        },
      });

      // Per-block choreography: year wipes up, photo clip-reveals, text fades
      gsap.utils.toArray<HTMLElement>(".story-block").forEach((block) => {
        const year = block.querySelector(".story-year");
        const photoMask = block.querySelector(".story-photo-mask");
        const photoInner = block.querySelector<HTMLElement>(".story-photo-inner");
        const title = block.querySelector(".story-title");
        const desc = block.querySelector(".story-desc");

        if (year) gsap.set(year, { yPercent: 110 });
        if (photoMask) gsap.set(photoMask, { clipPath: "inset(100% 0 0 0)" });
        gsap.set([title, desc].filter(Boolean), { opacity: 0, y: 24 });

        ScrollTrigger.create({
          trigger: block,
          start: "top 78%",
          once: true,
          onEnter: () => {
            const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
            if (year) tl.to(year, { yPercent: 0, duration: 1.4 });
            if (photoMask)
              tl.to(
                photoMask,
                { clipPath: "inset(0% 0 0 0)", duration: 1.3 },
                "-=1.05"
              );
            if (title) tl.to(title, { opacity: 1, y: 0, duration: 1.0 }, "-=0.85");
            if (desc) tl.to(desc, { opacity: 0.6, y: 0, duration: 1.0 }, "-=0.75");
          },
        });

        // Subtle parallax on the photo's inner layer
        if (photoInner) {
          gsap.to(photoInner, {
            y: -50,
            ease: "none",
            scrollTrigger: {
              trigger: block,
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

  return (
    <section
      ref={sectionRef}
      id="story"
      className="relative px-6 md:px-12 lg:px-16 overflow-hidden"
      style={{
        paddingTop: "clamp(8rem, 16vw, 14rem)",
        paddingBottom: "clamp(8rem, 16vw, 14rem)",
      }}
    >
      {/* Heading */}
      <div className="story-heading mb-20 md:mb-32">
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
              OUR
            </span>
          </span>
          <span className="block overflow-hidden">
            <span
              className="hero-word block serif-italic"
              style={{ color: "var(--color-gold)" }}
            >
              story
            </span>
          </span>
        </h2>
      </div>

      {/* Vertical thread tying the milestones together */}
      <div
        aria-hidden
        className="hidden md:block absolute left-1/2 top-[28rem] bottom-32 w-px pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(212,165,65,0.18) 12%, rgba(212,165,65,0.18) 88%, transparent 100%)",
        }}
      />

      {/* Milestone blocks */}
      <div className="flex flex-col gap-28 md:gap-44 relative">
        {milestones.map((m, i) => {
          const layout = LAYOUTS[i % LAYOUTS.length];
          const photoUrl = storyImages[i % storyImages.length];
          const photoOnRight = layout.side === "right";

          return (
            <div
              key={m.year}
              className={`story-block relative flex flex-col items-center gap-10 md:gap-16 ${
                photoOnRight ? "md:flex-row" : "md:flex-row-reverse"
              } md:items-center`}
            >
              {/* Year + title + description */}
              <div
                className="flex-1 relative w-full"
                style={{ textAlign: photoOnRight ? "left" : "right" }}
              >
                {/* Year wipe-wrap */}
                <div className="story-year-wrap relative overflow-hidden">
                  <h3
                    className="story-year font-display block"
                    style={{
                      color: layout.yearStroke ? "transparent" : "var(--color-gold)",
                      WebkitTextStroke: layout.yearStroke
                        ? "2px var(--color-gold)"
                        : undefined,
                      WebkitTextFillColor: layout.yearStroke
                        ? "transparent"
                        : undefined,
                      fontSize: `clamp(${4 * layout.yearScale}rem, ${
                        12 * layout.yearScale
                      }vw, ${12 * layout.yearScale}rem)`,
                      lineHeight: 0.85,
                      letterSpacing: "-0.045em",
                      fontWeight: 800,
                      transform: `rotate(${layout.yearTilt}deg)`,
                      transformOrigin: photoOnRight ? "left bottom" : "right bottom",
                      display: "inline-block",
                    }}
                  >
                    {m.year}
                  </h3>
                </div>

                <h4
                  className="story-title font-display serif-italic mt-4 md:mt-6"
                  style={{
                    color: "var(--color-off-white)",
                    fontSize: "clamp(1.5rem, 3vw, 2.75rem)",
                    lineHeight: 1.05,
                    fontWeight: 400,
                  }}
                >
                  {m.title}
                </h4>

                <p
                  className="story-desc font-body text-pretty mt-6 max-w-sm"
                  style={{
                    color: "var(--color-off-white)",
                    fontSize: "1rem",
                    lineHeight: 1.65,
                    marginLeft: photoOnRight ? 0 : "auto",
                  }}
                >
                  {m.description}
                </p>
              </div>

              {/* Photo */}
              {photoUrl && (
                <div
                  className="story-photo-mask relative overflow-hidden flex-shrink-0 w-full md:w-auto"
                  style={{
                    aspectRatio: layout.photoAspect,
                    transform: `rotate(${layout.photoTilt}deg)`,
                    transformOrigin: "center",
                    flexBasis: layout.photoWidthMd,
                    maxWidth: layout.photoWidthMd,
                  }}
                >
                  <div
                    className="story-photo-inner absolute inset-0 bg-cover bg-center img-editorial"
                    style={{
                      backgroundImage: `url(${photoUrl})`,
                      backgroundColor: "#141414",
                      transform: "scale(1.12)",
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
