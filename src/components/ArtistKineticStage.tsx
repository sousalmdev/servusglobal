"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useReducedMotion } from "@/providers/ReducedMotionProvider";
import type { Artist, Release } from "@/types";

gsap.registerPlugin(ScrollTrigger);

const getLogoPath = (platform: string) => {
  const p = platform.toLowerCase();
  if (p.includes("spotify")) return "/images/logos/spotify.svg";
  if (p.includes("apple")) return "/images/logos/applemusic.svg";
  if (p.includes("youtube")) return "/images/logos/youtube.svg";
  if (p.includes("tidal")) return "/images/logos/tidal.svg";
  if (p.includes("soundcloud")) return "/images/logos/soundcloud.png";
  if (p.includes("instagram")) return "/instagram-1.svg";
  return null;
};

interface Props {
  artist: Artist;
  releases: Release[];
  lang: string;
  dict: any;
  rosterIndex: number;
  rosterTotal: number;
}

export default function ArtistKineticStage({
  artist,
  releases,
  lang,
  dict,
  rosterIndex,
  rosterTotal,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!rootRef.current) return;
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // Kinetic stage — desktop only. Mobile gets a clean static stage.
      mm.add("(min-width: 768px)", () => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: ".stage",
              start: "top top",
              end: "bottom bottom",
              scrub: 0.8,
            },
          })
          .fromTo(
            ".stage-portrait",
            { scale: 1.0, opacity: 1 },
            { scale: 1.18, opacity: 0.32, ease: "none" },
            0,
          )
          .fromTo(
            ".stage-name",
            { scale: 1, y: 0, letterSpacing: "-0.05em" },
            { scale: 0.42, y: "-32vh", letterSpacing: "-0.025em", ease: "none" },
            0,
          )
          .to(".stage-meta-top", { opacity: 0, y: -12, ease: "none" }, 0)
          .to(".stage-meta-bottom", { opacity: 0, y: 20, ease: "none" }, 0)
          .to(".stage-cue", { opacity: 0, ease: "none" }, 0);
      });

      // Name watermark drifts horizontally as bio section scrolls past.
      gsap.to(".bio-watermark", {
        xPercent: -6,
        ease: "none",
        scrollTrigger: {
          trigger: ".bio-section",
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, rootRef);

    // Force-refresh ScrollTrigger shortly after mounting to correct coordinate caches
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      ctx.revert();
      clearTimeout(timer);
    };
  }, [reducedMotion]);

  return (
    <div ref={rootRef} className="relative" style={{ background: "var(--color-black)" }}>
      {/* ============================================================
          STAGE — name is the architecture
          Tall outer section + sticky inner viewport-sized "frame"
         ============================================================ */}
      <section className="stage relative w-full h-[100dvh] md:h-[150vh]">
        <div
          className="sticky top-0 w-full overflow-hidden"
          style={{ height: "100dvh", minHeight: "640px" }}
        >
          {/* Portrait — full bleed */}
          <img
            src={artist.portraitUrl}
            alt={artist.name}
            className="stage-portrait absolute inset-0 w-full h-full object-cover img-editorial"
            style={{
              willChange: "transform, opacity",
              transformOrigin: "center center",
            }}
            onLoad={() => {
              ScrollTrigger.refresh();
            }}
          />

          {/* Vignette + top/bottom fades */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(10,10,10,0) 40%, rgba(10,10,10,0.65) 100%), linear-gradient(180deg, rgba(10,10,10,0.55) 0%, rgba(10,10,10,0.15) 35%, rgba(10,10,10,0.85) 100%)",
            }}
          />

          {/* Top meta — back link + roster index */}
          <div className="stage-meta-top absolute top-8 md:top-10 left-6 right-6 md:left-12 md:right-12 lg:left-16 lg:right-16 flex items-start justify-between z-20">
            <Link
              href={`/${lang}#artists`}
              data-cursor="hover"
              className="font-body text-eyebrow eyebrow link-underline"
              style={{ color: "var(--color-gold)" }}
            >
              {dict.artistPage.back}
            </Link>
            <span
              className="font-body text-eyebrow eyebrow"
              style={{ color: "var(--color-off-white)", opacity: 0.5 }}
            >
              {String(rosterIndex).padStart(2, "0")} / {String(rosterTotal).padStart(2, "0")}
            </span>
          </div>

          {/* The name — enormous, dead center, the entire page hangs off this */}
          <div className="absolute inset-0 flex items-center justify-center z-10 px-4 mix-blend-difference pointer-events-none">
            <h1
              className="stage-name font-display text-balance text-center"
              style={{
                color: "var(--color-off-white)",
                fontSize: "clamp(4rem, 18vw, 17rem)",
                lineHeight: 0.85,
                letterSpacing: "-0.05em",
                fontWeight: 800,
                willChange: "transform, letter-spacing",
                transformOrigin: "center center",
              }}
            >
              {artist.name}
            </h1>
          </div>

          {/* Bottom meta — eyebrow tag + genres + scroll cue */}
          <div className="stage-meta-bottom absolute bottom-8 md:bottom-10 left-6 right-6 md:left-12 md:right-12 lg:left-16 lg:right-16 flex items-end justify-between gap-4 z-20">
            <div className="flex flex-col gap-3">
              <span
                className="font-body text-eyebrow eyebrow"
                style={{ color: "var(--color-off-white)", opacity: 0.45 }}
              >
                {dict.artistPage.tag}
              </span>
              <div className="flex flex-wrap gap-2">
                {artist.genres.map((g) => (
                  <span
                    key={g}
                    className="font-body text-eyebrow eyebrow inline-flex items-center px-3 py-1.5"
                    style={{
                      color: "var(--color-gold)",
                      border: "1px solid rgba(212, 165, 65, 0.4)",
                      fontSize: "0.625rem",
                      backdropFilter: "blur(6px)",
                      background: "rgba(10,10,10,0.25)",
                    }}
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
            <span
              className="stage-cue font-body text-eyebrow eyebrow hidden md:inline-block pb-1"
              style={{ color: "var(--color-off-white)", opacity: 0.55 }}
            >
              ↓ Scroll
            </span>
          </div>
        </div>
      </section>

      {/* ============================================================
          BIO & STREAMING — premium two-column layout
         ============================================================ */}
      <section
        className="bio-section relative py-10 mt-20 overflow-hidden px-6 md:px-12 lg:px-16"
        style={{
          paddingTop: "clamp(3rem, 6vw, 4rem)",
          paddingBottom: "clamp(3rem, 6vw, 4rem)",
          borderTop: "1px solid rgba(245, 242, 235, 0.08)",
        }}
      >
        {/* Watermark backdrop */}
        <div
          aria-hidden
          className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
        >
          <h2
            className="bio-watermark text-stroke font-display select-none"
            style={{
              fontSize: "clamp(10rem, 30vw, 32rem)",
              lineHeight: 0.85,
              letterSpacing: "-0.05em",
              fontWeight: 800,
              opacity: 0.08,
              whiteSpace: "nowrap",
              willChange: "transform",
              mixBlendMode: "difference",
            }}
          >
            {artist.name}
          </h2>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start w-full">
          {/* Div 1: Heading */}
          <div className="lg:col-span-5 flex flex-col justify-start">
            <span
              className="font-body text-eyebrow eyebrow mb-4 tracking-[0.25em]"
              style={{ color: "var(--color-gold)" }}
            >
              {dict.artistPage.tag}
            </span>
            <h2
              className="font-display font-extrabold tracking-tight text-pretty"
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4rem)",
                lineHeight: 1.05,
                color: "var(--color-off-white)",
              }}
            >
              About the <br />
              <span className="serif-italic text-[var(--color-gold)]" style={{ fontWeight: 400 }}>Artist</span>
            </h2>
          </div>

          {/* Div 2: Bio & Streaming */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <p
              className="font-body leading-relaxed text-pretty text-lg md:text-xl"
              style={{
                color: "var(--color-off-white)",
                opacity: 0.85,
              }}
            >
              {artist.bio}
            </p>

            {artist.socialLinks.length > 0 && (
              <div className="flex flex-col gap-4 mt-2 pt-6 border-t border-[var(--color-off-white)]/10">
                <span
                  className="font-body font-semibold tracking-widest text-[var(--color-gold)] uppercase"
                  style={{ fontSize: "0.6875rem" }}
                >
                  Stream Now
                </span>
                <div className="flex flex-wrap items-center gap-8 md:gap-10">
                  {artist.socialLinks.map((s) => {
                    const logo = getLogoPath(s.platform);
                    const isInverted = ["apple", "tidal", "instagram"].some((p) =>
                      s.platform.toLowerCase().includes(p),
                    );
                    return (
                      <a
                        key={s.platform}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="hover"
                        className="group inline-flex items-center justify-center transition-transform duration-300 hover:scale-110"
                        aria-label={s.platform}
                      >
                        {logo ? (
                          <img
                            src={logo}
                            alt={s.platform}
                            className={`h-7 w-auto object-contain opacity-75 group-hover:opacity-100 transition-opacity duration-300 ${isInverted ? "brightness-0 invert" : ""}`}
                          />
                        ) : (
                          <span
                            className="font-body text-eyebrow eyebrow"
                            style={{ color: "var(--color-off-white)", fontSize: "0.75rem" }}
                          >
                            {s.platform}
                          </span>
                        )}
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ============================================================
          DISCOGRAPHY — archival list, numbered, no grid
         ============================================================ */}
      {releases.length > 0 && (
        <section
          className="px-6 md:px-12 lg:px-16"
          style={{
            paddingTop: "clamp(5rem, 10vw, 10rem)",
            paddingBottom: "clamp(8rem, 16vw, 14rem)",
            borderTop: "1px solid rgba(245, 242, 235, 0.08)",
          }}
        >
          <div className="flex items-end justify-between mb-12 md:mb-16">
            <h3
              className="font-display"
              style={{
                color: "var(--color-off-white)",
                fontSize: "clamp(2rem, 4.5vw, 4rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.03em",
                fontWeight: 800,
              }}
            >
              {dict.releases.title1}{" "}
              <span
                className="serif-italic"
                style={{ color: "var(--color-gold)", fontWeight: 400 }}
              >
                {dict.releases.title2}
              </span>
            </h3>
            <span
              className="font-body text-eyebrow eyebrow hidden md:inline-block mb-2"
              style={{ color: "var(--color-off-white)", opacity: 0.3 }}
            >
              {String(releases.length).padStart(2, "0")} /{" "}
              {dict.releases.titlesCount}
            </span>
          </div>

          <div className="flex flex-col">
            {releases.map((r, idx) => {
              const primaryLink = r.streamingLinks[0]?.url;
              return (
                <a
                  key={r.slug}
                  href={primaryLink ?? "#"}
                  target={primaryLink ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  data-cursor="hover"
                  className="release-row group grid grid-cols-12 gap-4 md:gap-6 items-center py-6 md:py-8"
                  style={{
                    borderTop: "1px solid rgba(245, 242, 235, 0.08)",
                    borderBottom:
                      idx === releases.length - 1
                        ? "1px solid rgba(245, 242, 235, 0.08)"
                        : undefined,
                  }}
                >
                  <span
                    className="col-span-1 font-body text-eyebrow eyebrow"
                    style={{
                      color: "var(--color-off-white)",
                      opacity: 0.35,
                      fontSize: "0.625rem",
                    }}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <div className="col-span-2 md:col-span-1 overflow-hidden">
                    {r.coverArtUrl ? (
                      <img
                        src={r.coverArtUrl}
                        alt={r.title}
                        className="w-full h-full aspect-square object-cover transition-transform duration-700 group-hover:scale-110"
                        onLoad={() => {
                          ScrollTrigger.refresh();
                        }}
                      />
                    ) : (
                      <div className="w-full h-full aspect-square bg-[var(--color-dark-surface-2)]" />
                    )}
                  </div>
                  <h4
                    className="col-span-7 md:col-span-8 font-display transition-colors duration-300 group-hover:text-[var(--color-gold)]"
                    style={{
                      color: "var(--color-off-white)",
                      fontSize: "clamp(1.25rem, 3vw, 2.5rem)",
                      lineHeight: 1.05,
                      letterSpacing: "-0.02em",
                      fontWeight: 700,
                    }}
                  >
                    {r.title}
                  </h4>
                  <span
                    className="col-span-2 text-right font-body text-eyebrow eyebrow"
                    style={{
                      color: "var(--color-gold)",
                      opacity: 0.85,
                      fontSize: "0.625rem",
                    }}
                  >
                    {r.year}
                  </span>
                </a>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
