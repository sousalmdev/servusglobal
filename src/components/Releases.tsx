"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useReducedMotion } from "@/providers/ReducedMotionProvider";
import { releases } from "@/data/releases";
import type { Release } from "@/types";
import type { Dictionary } from "@/i18n/getDictionary";
import { getLogoPath } from "@/utils/getLogoPath";
import VinylDisc from "@/components/VinylDisc";
import { FaFireFlameCurved } from "react-icons/fa6";

gsap.registerPlugin(ScrollTrigger);

type VinylSide = "right" | "left";

const SMALL_LAYOUTS: { area: string; tilt: number; vinylSide: VinylSide }[] = [
  { area: "1 / 1 / 6 / 5",    tilt: -2.4, vinylSide: "right" },
  { area: "1 / 6 / 5 / 9",    tilt:  1.8, vinylSide: "right" },
  { area: "1 / 10 / 5 / 13",  tilt: -1.5, vinylSide: "right" },
  { area: "6 / 2 / 11 / 7",   tilt:  2.6, vinylSide: "right" },
  { area: "6 / 8 / 11 / 13",  tilt: -1.2, vinylSide: "right" },
];

const releaseDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short" });



/**
 * Cover + vinyl-peek primitive. Used for both the featured release and the
 * smaller siblings — only the dimensions and vinyl offset change.
 */
function ReleaseCard({
  release,
  vinylSide = "right",
  isFeatured = false,
}: {
  release: Release;
  vinylSide?: VinylSide;
  isFeatured?: boolean;
}) {
  const link = release.streamingLinks[0]?.url ?? "#";

  // The vinyl pokes further out on the featured card; smaller siblings get a
  // subtler peek so they don't clobber neighbors.
  const peekOffset = isFeatured ? "-25%" : "-22%";
  const vinylSize = isFeatured ? "70%" : "62%";
  const vinylTopOffset = isFeatured ? "6%" : "10%";

  return (
    <div className="release-card-inner relative">
      {/* Vinyl peek (sits behind cover) */}
      <div
        className="vinyl-peek absolute pointer-events-none"
        style={{
          top: vinylTopOffset,
          ...(vinylSide === "right"
            ? { right: peekOffset }
            : { left: peekOffset }),
          width: vinylSize,
          aspectRatio: "1/1",
          zIndex: 1,
        }}
        aria-hidden
      >
        <VinylDisc />
      </div>

      {/* Cover */}
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        data-cursor="hover"
        className="release-cover-mask block relative aspect-square overflow-hidden z-10"
      >
        <div
          className="absolute inset-0 transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.03]"
        >
          <Image
            src={release.coverArtUrl}
            alt={release.title}
            fill
            sizes={isFeatured ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
            className="object-cover object-center"
            style={{
              filter: "saturate(0.95) contrast(1.04)",
            }}
            loading={isFeatured ? "eager" : "lazy"}
          />
        </div>
        {/* Plastic wrap overlay */}
        <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-45 z-20">
          <Image
            src="/plasticwrap.png"
            alt=""
            fill
            sizes="25vw"
            className="object-cover object-center"
            loading="lazy"
          />
        </div>
       
      </a>
    </div>
  );
}

export default function Releases({ dict }: { dict?: Dictionary }) {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  const sorted = [...releases].sort(
    (a, b) =>
      new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
  );
  const featured = sorted.find((r) => r.featured) ?? sorted[0];
  const rest = sorted.filter((r) => r.slug !== featured.slug).slice(0, 5);

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isMutedByUser = useRef(false);

  const fadeAudio = (targetVolume: number, duration: number, pauseOnComplete = false) => {
    const audio = audioRef.current;
    if (!audio) return;

    gsap.killTweensOf(audio, { volume: true });

    if (targetVolume > 0) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
        }).catch((err) => {
          console.log("Autoplay prevented:", err);
          setIsPlaying(false);
        });
      }
    }

    gsap.to(audio, {
      volume: targetVolume,
      duration: duration,
      ease: "power1.out",
      onComplete: () => {
        if (pauseOnComplete) {
          audio.pause();
          setIsPlaying(false);
        }
      },
    });
  };

  const toggleMute = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused || audio.volume === 0 || !isPlaying) {
      isMutedByUser.current = false;
      fadeAudio(0.5, 1);
    } else {
      isMutedByUser.current = true;
      fadeAudio(0, 1, true);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined" || !sectionRef.current) return;

    const audio = new Audio("/audio/mood.mp3");
    audio.loop = true;
    audio.volume = 0;

    const handleLoadedMetadata = () => {
      audio.currentTime = 33;
    };

    if (audio.readyState >= 1) {
      audio.currentTime = 33;
    } else {
      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    }

    audioRef.current = audio;

    const trg = ScrollTrigger.create({
      trigger: ".feature-block",
      start: "top 70%",
      end: "bottom 30%",
      onEnter: () => {
        if (isMutedByUser.current) return;
        fadeAudio(0.5, 2);
      },
      onLeave: () => {
        fadeAudio(0, 1.5, true);
      },
      onEnterBack: () => {
        if (isMutedByUser.current) return;
        fadeAudio(0.5, 2);
      },
      onLeaveBack: () => {
        fadeAudio(0, 1.5, true);
      },
    });

    const unlockAudio = () => {
      if (!audioRef.current) return;

      audioRef.current.play()
        .then(() => {
          const featureBlock = document.querySelector(".feature-block");
          if (featureBlock) {
            const rect = featureBlock.getBoundingClientRect();
            const inView = rect.top < window.innerHeight && rect.bottom > 0;
            if (inView && !isMutedByUser.current) {
              fadeAudio(0.5, 2);
            } else {
              audioRef.current?.pause();
              setIsPlaying(false);
            }
          } else {
            audioRef.current?.pause();
            setIsPlaying(false);
          }
        })
        .catch((err) => {
          console.log("Failed to unlock audio:", err);
        });

      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };

    window.addEventListener("click", unlockAudio);
    window.addEventListener("touchstart", unlockAudio);
    window.addEventListener("keydown", unlockAudio);

    return () => {
      trg.kill();
      audio.pause();
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audioRef.current = null;
      window.removeEventListener("click", unlockAudio);
      window.removeEventListener("touchstart", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      // Heading
      gsap.set(".releases-heading .hero-word", { yPercent: 110 });
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        once: true,
        onEnter: () => {
          gsap.to(".releases-heading .hero-word", {
            yPercent: 0,
            duration: 1.4,
            stagger: 0.1,
            ease: "expo.out",
          });
        },
      });

      // Featured spread (break the seal entrance)
      gsap.set(".feature-cover-mask", { x: 80, opacity: 0 });
      gsap.set(".feature-vinyl-inner", { x: -40, rotation: -90, opacity: 0 });
      gsap.set(".feature-info > *", { opacity: 0, y: 22 });

      ScrollTrigger.create({
        trigger: ".feature-block",
        start: "top 78%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
          // 1. Cover slides in from right & fades in
          tl.to(".feature-cover-mask", {
            x: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
          });
          // 2. Cover slides left to make space
          tl.to(".feature-cover-mask", {
            x: -25,
            duration: 0.9,
            ease: "back.out(1.1)",
          }, "-=0.25");
          // 3. Vinyl slides out to the right (break the seal)
          tl.to(
            ".feature-vinyl-inner",
            {
              x: 45,
              rotation: 12,
              opacity: 1,
              duration: 1.4,
              ease: "back.out(1.3)",
            },
            "-=0.7"
          );
          tl.to(
            ".feature-info > *",
            { opacity: 1, y: 0, duration: 0.85, stagger: 0.07 },
            "-=1.0"
          );
        },
      });

      // Small cards entrance
      gsap.utils.toArray<HTMLElement>(".small-cover-mask").forEach((el, i) => {
        gsap.set(el, { clipPath: "inset(100% 0 0 0)" });
        ScrollTrigger.create({
          trigger: el,
          start: "top 92%",
          once: true,
          onEnter: () => {
            gsap.to(el, {
              clipPath: "inset(0% 0 0 0)",
              duration: 1.3,
              ease: "expo.out",
              delay: (i % 3) * 0.1,
            });
          },
        });
      });
      gsap.utils.toArray<HTMLElement>(".small-vinyl").forEach((el, i) => {
        gsap.set(el, { opacity: 0, x: 0 });
        ScrollTrigger.create({
          trigger: el,
          start: "top 92%",
          once: true,
          onEnter: () => {
            gsap.to(el, {
              opacity: 1,
              duration: 1.0,
              ease: "expo.out",
              delay: (i % 3) * 0.1 + 0.25,
            });
          },
        });
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="releases"
      className="relative px-6 md:px-12 lg:px-16 overflow-hidden"
      style={{
        paddingTop: "clamp(8rem, 16vw, 14rem)",
        paddingBottom: "clamp(8rem, 16vw, 14rem)",
      }}
    >
      {/* Heading */}
      <div className="releases-heading flex items-end justify-between mb-16 md:mb-24">
        <h2
          className="font-display"
          style={{
            fontSize: "clamp(2.5rem, 9vw, 10rem)",
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
              {dict?.releases?.title1 || "ON"}
            </span>
          </span>
          <span className="block overflow-hidden">
            <span
              className="hero-word block serif-italic"
              style={{ color: "var(--color-gold)" }}
            >
              {dict?.releases?.title2 || "rotation"}
            </span>
          </span>
        </h2>
        <span
          className="font-body text-eyebrow eyebrow hidden md:inline-block mb-2"
          style={{ color: "var(--color-off-white)", opacity: 0.3 }}
        >
          {String(sorted.length).padStart(2, "0")} / {dict?.releases?.titlesCount || "releases"}
        </span>
      </div>

      {/* Featured Highlight Section with dynamic y-border marquees and distinct background */}
      <div 
        className="feature-section-container -mx-6 md:-mx-12 lg:-mx-16 mb-32 md:mb-44 relative bg-black overflow-hidden select-none"
      >
        {/* Top Marquee Border (Beige background with Gold characters) */}
        <div 
          className="w-full bg-[var(--color-off-white)] overflow-hidden py-2.5 border-b border-[rgba(10,10,10,0.1)] flex items-center"
          style={{ zIndex: 10 }}
        >
          <div className="marquee-track marquee-forward marquee-fast flex items-center whitespace-nowrap">
            {Array(10).fill(null).map((_, idx) => (
              <span key={`top-${idx}`} className="font-body text-eyebrow eyebrow text-[9px] md:text-[10px] tracking-[0.25em] font-extrabold text-[var(--color-gold)] flex items-center select-none">
                <span>DO NOT TOUCH - CONTAGIOUS</span>
                <span className="mx-6 text-black">✦</span>
              </span>
            ))}
            {/* Repeat for seamless infinite scrolling */}
            {Array(10).fill(null).map((_, idx) => (
              <span key={`top-dup-${idx}`} className="font-body text-eyebrow eyebrow text-[9px] md:text-[10px] tracking-[0.25em] font-extrabold text-[var(--color-gold)] flex items-center select-none">
                <span>DO NOT TOUCH - CONTAGIOUS</span>
                <span className="mx-6 text-black">✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* Featured block content */}
        <div className="px-6 md:px-12 lg:px-16 py-20 md:py-24">
          <div className="feature-block grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
            <div className="lg:col-span-7 relative flex justify-center lg:justify-start">
              <div
                className="release-card relative w-full max-w-[380px] sm:max-w-[420px] md:max-w-[450px]"
                style={{ ["--rest-rotate" as string]: "-1.4deg" }}
              >
                {/* Adapted ReleaseCard for the featured tier — needs the
                    feature-* classnames so the GSAP timeline can target it. */}
                <div className="release-card-inner relative">
                  <div
                    className="feature-vinyl vinyl-peek absolute pointer-events-none"
                    style={{
                      top: "6%",
                      right: "-25%",
                      width: "70%",
                      aspectRatio: "1/1",
                      zIndex: 1,
                    }}
                    aria-hidden
                  >
                    <div className="feature-vinyl-inner w-full h-full relative">
                      <VinylDisc />
                    </div>
                  </div>

                  <a
                    href={featured.streamingLinks[0]?.url ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="hover"
                    className="feature-cover-mask block relative aspect-square overflow-hidden z-10"
                  >
                    <div className="absolute inset-0 transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.03]">
                      <Image
                        src={featured.coverArtUrl}
                        alt={featured.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover object-center"
                        style={{
                          filter: "saturate(0.95) contrast(1.04)",
                        }}
                        priority
                      />
                    </div>
                    {/* Plastic wrap overlay */}
                    <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-45 z-20">
                      <Image
                        src="/plasticwrap.png"
                        alt=""
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover object-center"
                        loading="lazy"
                      />
                    </div>
                  
                  </a>
                </div>
              </div>
            </div>

            <div className="feature-info lg:col-span-5">
              <div className="flex items-center gap-3 mb-6">
                <span
                  className="font-body text-eyebrow eyebrow inline-block"
                  style={{ color: "var(--color-gold)", opacity: 0.7 }}
                >
                  Now spinning
                </span>
                
                <button
                  onClick={(e) => toggleMute(e)}
                  className="flex items-center gap-2 px-3 py-1 rounded-full border border-[rgba(245,242,235,0.15)] bg-[rgba(10,10,10,0.4)] hover:bg-[rgba(245,242,235,0.05)] hover:border-[rgba(245,242,235,0.3)] transition-all duration-300 group cursor-pointer"
                  title={isPlaying ? "Mute audio" : "Play audio"}
                >
                  {isPlaying ? (
                    <div className="flex items-center gap-2">
                      <div className="flex items-end gap-[2px] h-2.5 w-3.5 mb-[1px]">
                        <div className="w-[2px] bg-[var(--color-gold)] animate-audio-bar-1" style={{ height: "3px" }} />
                        <div className="w-[2px] bg-[var(--color-gold)] animate-audio-bar-2" style={{ height: "5px" }} />
                        <div className="w-[2px] bg-[var(--color-gold)] animate-audio-bar-3" style={{ height: "2px" }} />
                        <div className="w-[2px] bg-[var(--color-gold)] animate-audio-bar-4" style={{ height: "4px" }} />
                      </div>
                      <span className="font-body text-[8px] tracking-[0.15em] font-semibold text-[var(--color-gold)] opacity-90 group-hover:opacity-100 transition-opacity">
                        LIVE
                      </span>
                    </div>
                  ) : (
                    <span className="font-body text-[8px] tracking-[0.15em] font-semibold text-[rgba(245,242,235,0.4)] group-hover:text-[rgba(245,242,235,0.7)] transition-colors">
                      PAUSED
                    </span>
                  )}
                </button>
              </div>
              <h3
                className="font-display"
                style={{
                  color: "var(--color-off-white)",
                  fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
                  lineHeight: 0.95,
                  letterSpacing: "-0.035em",
                  fontWeight: 600,
                }}
              >
                {featured.title}
              </h3>
              <div className="mt-4 flex flex-wrap items-baseline gap-2 md:gap-3">
                <span
                  className="font-body text-body-lg"
                  style={{ color: "var(--color-off-white)", opacity: 0.85 }}
                >
                  {featured.artistName}
                </span>
                <span
                  className="font-body text-caption"
                  style={{ color: "var(--color-off-white)", opacity: 0.4 }}
                >
                  · {releaseDate(featured.releaseDate)}
                </span>
              </div>
              {featured.productionCredits && (
                <p
                  className="font-body text-body mt-6 max-w-md text-pretty"
                  style={{ color: "var(--color-off-white)", opacity: 0.55 }}
                >
                  {featured.productionCredits}
                </p>
              )}
              <div className="mt-10 flex flex-wrap gap-6">
                {featured.streamingLinks.map((link) => {
                  const logo = getLogoPath(link.platform);
                  return (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor="hover"
                      className={`group font-body text-eyebrow eyebrow inline-flex items-center justify-center transition-all duration-300 ${logo ? 'hover:scale-110' : 'release-platform-pill px-4 py-2.5 gap-2'}`}
                      style={{
                        color: "var(--color-off-white)",
                        ...(logo ? {} : { border: "1px solid rgba(245,242,235,0.18)" }),
                        fontSize: "0.625rem",
                      }}
                      aria-label={link.platform}
                    >
                      {logo ? (
                        <Image
                          src={logo}
                          alt={link.platform}
                          width={112}
                          height={112}
                          loading="lazy"
                          className={`w-14 h-14 md:w-28 md:h-28 object-contain opacity-60 group-hover:opacity-100 transition-all duration-300 ${['apple', 'tidal'].some(p => link.platform.toLowerCase().includes(p)) ? 'brightness-0 invert' : ''}`}
                        />
                      ) : (
                        link.platform
                      )}
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Marquee Border (Beige background with Gold characters - Scrolling Reverse) */}
        <div 
          className="w-full bg-[var(--color-off-white)] overflow-hidden py-2.5 border-t border-[rgba(10,10,10,0.1)] flex items-center"
          style={{ zIndex: 10 }}
        >
          <div className="marquee-track marquee-reverse marquee-fast flex items-center whitespace-nowrap">
            {Array(10).fill(null).map((_, idx) => (
              <span key={`bottom-${idx}`} className="font-body text-eyebrow eyebrow text-[9px] md:text-[10px] tracking-[0.25em] font-extrabold text-[var(--color-gold)] flex items-center select-none">
                <span>DO NOT TOUCH - CONTAGIOUS</span>
                <span className="mx-6 text-black">✦</span>
              </span>
            ))}
            {/* Repeat for seamless infinite scrolling */}
            {Array(10).fill(null).map((_, idx) => (
              <span key={`bottom-dup-${idx}`} className="font-body text-eyebrow eyebrow text-[9px] md:text-[10px] tracking-[0.25em] font-extrabold text-[var(--color-gold)] flex items-center select-none">
                <span>DO NOT TOUCH - CONTAGIOUS</span>
                <span className="mx-6 text-black">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Smaller siblings — same composition, different scale */}
      <div
        className="releases-grid grid grid-cols-1 md:grid-cols-12 gap-y-12 md:gap-x-8 md:gap-y-20"
        style={{ gridAutoRows: "minmax(60px, auto)" }}
      >
        {rest.map((release, i) => {
          const layout = SMALL_LAYOUTS[i % SMALL_LAYOUTS.length];
          return (
            <div
              key={release.slug}
              className="release-card-grid-item relative"
              style={{
                ["--grid-area" as string]: layout.area,
                ["--rest-rotate" as string]: `${layout.tilt}deg`,
              }}
            >
              <SmallReleaseCard
                release={release}
                vinylSide={layout.vinylSide}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

/**
 * Small release: cover + smaller vinyl peek, with title/artist/year always
 * visible underneath. Same primitive as the featured card, scaled down and
 * with text below instead of in a side column.
 */
function SmallReleaseCard({
  release,
  vinylSide,
}: {
  release: Release;
  vinylSide: VinylSide;
}) {
  const link = release.streamingLinks[0]?.url ?? "#";

  return (
    <>
      <div className="release-card-inner relative">
        <div
          className="small-vinyl vinyl-peek absolute pointer-events-none"
          style={{
            top: "10%",
            ...(vinylSide === "right"
              ? { right: "-22%" }
              : { left: "-22%" }),
            width: "62%",
            aspectRatio: "1/1",
            zIndex: 1,
          }}
          aria-hidden
        >
          <VinylDisc />
        </div>

        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="hover"
          className="small-cover-mask block relative aspect-square overflow-hidden z-10"
        >
          <div className="absolute inset-0 transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.04]">
            <Image
              src={release.coverArtUrl}
              alt={release.title}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover object-center"
              style={{
                filter: "saturate(0.9) contrast(1.04)",
              }}
              loading="lazy"
            />
          </div>
          {/* Plastic wrap overlay */}
          <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-45 z-20">
            <Image
              src="/plasticwrap.png"
              alt=""
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover object-center"
              loading="lazy"
            />
          </div>
        </a>
      </div>

      {/* Caption */}
      <div className="mt-5 px-1">
        <h4
          className="font-display"
          style={{
            color: "var(--color-off-white)",
            fontSize: "clamp(1rem, 1.4vw, 1.4rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.015em",
            fontWeight: 600,
          }}
        >
          {release.title}
        </h4>
        <span
          className="font-body text-eyebrow eyebrow mt-2 inline-block"
          style={{
            color: "var(--color-gold)",
            opacity: 0.85,
            fontSize: "0.6rem",
          }}
        >
          {release.artistName} · {release.year}
        </span>
      </div>
    </>
  );
}
