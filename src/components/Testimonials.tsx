"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/providers/ReducedMotionProvider";
import type { Dictionary } from "@/i18n/getDictionary";

// Register GSAP ScrollTrigger
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STORY_DURATION = 5000; // 5 seconds per story

interface Story {
  username: string;
  displayName: string;
  avatar: string;
  time: string;
  background?: string;
  isTwitter?: boolean;
  isSerif?: boolean;
  isItalicText?: boolean;
  music?: {
    title: string;
    artist: string;
    cover: string;
  };
}

const STORIES: Story[] = [
  {
    username: "curtvonmartin",
    displayName: "Curt Von Martin",
    avatar: "/images/testimonials/curt_avatar.png",
    time: "2h",
    background: "/fleursunset.webp",
    music: {
      title: "Only If You Like It",
      artist: "Curt Von Martin",
      cover: "/images/testimonials/curt_avatar.png",
    },
  },
  {
    username: "8Ball_305",
    displayName: "Fat Jesu$",
    avatar: "/images/testimonials/fatjesus_avatar.png",
    time: "4h",
    isTwitter: true,
  },
  {
    username: "yaloopyguyzer",
    displayName: "yaloopyguyzer",
    avatar: "/images/testimonials/yaloopy_avatar.png",
    time: "6h",
    isSerif: true,
  },
  {
    username: "lifeofmorris",
    displayName: "lifeofmorris",
    avatar: "/images/testimonials/morris_avatar.png",
    time: "12h",
    isItalicText: true,
  },
  {
    username: "prodq6oi",
    displayName: "prodq6oi",
    avatar: "/images/testimonials/prodq6oi_avatar.png",
    time: "15h",
    background: "/fleursunset.webp",
  },
];

export default function Testimonials({ dict }: { dict: Dictionary }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [likedStories, setLikedStories] = useState<Record<number, boolean>>({});
  const [viewedStories, setViewedStories] = useState<Record<number, boolean>>({});
  const [dmText, setDmText] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const sectionRef = useRef<HTMLElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const reducedMotion = useReducedMotion();

  const swipeOccurredRef = useRef(false);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const mouseDownRef = useRef<{ x: number; y: number; time: number } | null>(null);

  // Scroll Entrance Animations
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const heading = sectionRef.current!.querySelector(".testimonials-heading");
      const eyebrow = sectionRef.current!.querySelector(".testimonials-eyebrow");
      const line = sectionRef.current!.querySelector(".testimonials-accent-line");
      const subtext = sectionRef.current!.querySelector(".testimonials-subtext");
      const rings = sectionRef.current!.querySelectorAll(".story-ring-item");

      if (reducedMotion) {
        gsap.set([eyebrow, heading, line, subtext], { opacity: 1, y: 0 });
        gsap.set(rings, { opacity: 1, scale: 1, y: 0 });
        if (line) gsap.set(line, { scaleX: 1 });
        return;
      }

      gsap.set(eyebrow, { opacity: 0, y: 12 });
      gsap.set(heading, { opacity: 0, y: 25 });
      gsap.set(line, { scaleX: 0 });
      gsap.set(subtext, { opacity: 0, y: 15 });
      gsap.set(rings, { opacity: 0, scale: 0.9, y: 30 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 80%",
        once: true,
        onEnter: () => {
          const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
          tl.to(eyebrow, { opacity: 0.5, y: 0, duration: 1.0 }, 0);
          tl.to(heading, { opacity: 1, y: 0, duration: 1.4 }, 0.1);
          tl.to(line, { scaleX: 1, duration: 1.6, ease: "power4.inOut" }, 0.3);
          tl.to(subtext, { opacity: 0.5, y: 0, duration: 1.2 }, 0.5);
          tl.to(
            rings,
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 1.2,
              stagger: 0.15,
              ease: "elastic.out(1, 0.8)",
            },
            0.6
          );
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  // Story Timer Loop
  useEffect(() => {
    if (isOpen && !isPaused) {
      let lastTime = performance.now();
      const updateProgress = () => {
        const now = performance.now();
        const elapsed = now - lastTime;
        lastTime = now;

        setProgress((prev) => {
          const next = prev + (elapsed / STORY_DURATION) * 100;
          if (next >= 100) {
            handleNext();
            return 0;
          }
          return next;
        });

        animationFrameRef.current = requestAnimationFrame(updateProgress);
      };
      animationFrameRef.current = requestAnimationFrame(updateProgress);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isOpen, isPaused, activeIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") handleClose();
      else if (e.key === "ArrowRight") handleNext();
      else if (e.key === "ArrowLeft") handlePrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, activeIndex]);

  // Disable page scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleOpen = (index: number) => {
    setActiveIndex(index);
    setProgress(0);
    setIsPaused(false);
    setIsOpen(true);
    setViewedStories((prev) => ({ ...prev, [index]: true }));
  };

  const handleClose = () => {
    setIsOpen(false);
    setProgress(0);
    setIsPaused(false);
  };

  const handleNext = () => {
    setProgress(0);
    setActiveIndex((prev) => {
      if (prev < STORIES.length - 1) {
        const nextIdx = prev + 1;
        setViewedStories((old) => ({ ...old, [nextIdx]: true }));
        return nextIdx;
      } else {
        handleClose();
        return prev;
      }
    });
  };

  const handlePrev = () => {
    setProgress(0);
    setActiveIndex((prev) => {
      if (prev > 0) {
        return prev - 1;
      } else {
        // Restart current story
        return 0;
      }
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
    setIsPaused(true);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setIsPaused(false);
    if (!touchStartRef.current) return;
    
    const touch = e.changedTouches[0];
    const diffX = touch.clientX - touchStartRef.current.x;
    const diffY = touch.clientY - touchStartRef.current.y;
    const duration = Date.now() - touchStartRef.current.time;
    
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40 && duration < 300) {
      if (diffX > 0) {
        handlePrev();
      } else {
        handleNext();
      }
      swipeOccurredRef.current = true;
      setTimeout(() => {
        swipeOccurredRef.current = false;
      }, 50);
    }
    touchStartRef.current = null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    mouseDownRef.current = {
      x: e.clientX,
      y: e.clientY,
      time: Date.now()
    };
    setIsPaused(true);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    setIsPaused(false);
    if (!mouseDownRef.current) return;
    
    const diffX = e.clientX - mouseDownRef.current.x;
    const diffY = e.clientY - mouseDownRef.current.y;
    const duration = Date.now() - mouseDownRef.current.time;
    
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40 && duration < 300) {
      if (diffX > 0) {
        handlePrev();
      } else {
        handleNext();
      }
      swipeOccurredRef.current = true;
      setTimeout(() => {
        swipeOccurredRef.current = false;
      }, 50);
    }
    mouseDownRef.current = null;
  };

  const toggleLike = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    setLikedStories((prev) => {
      const newLiked = { ...prev, [index]: !prev[index] };
      if (newLiked[index]) {
        // Trigger a tiny toast
        triggerToast("Story Liked ❤️");
      }
      return newLiked;
    });
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const handleSendDm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dmText.trim()) return;

    triggerToast(dict.contact?.successMsg || "Message sent!");
    setDmText("");
    // Resume story after typing
    setIsPaused(false);
  };

  const getStoryText = (username: string) => {
    const t = dict.testimonials;
    if (!t) return "";
    switch (username) {
      case "curtvonmartin":
        return t.curtText;
      case "8Ball_305":
        return t.fatjesusText;
      case "yaloopyguyzer":
        return t.yaloopyText;
      case "lifeofmorris":
        return t.morrisText;
      case "prodq6oi":
        return t.prodq6oiText;
      default:
        return "";
    }
  };

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="relative px-6 md:px-12 lg:px-16 overflow-hidden"
      style={{
        paddingTop: "clamp(4rem, 12vw, 10rem)",
        paddingBottom: "clamp(4rem, 12vw, 10rem)",
        borderTop: "1px solid rgba(245, 242, 235, 0.08)",
      }}
    >
      {/* Background radial highlight */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] opacity-[0.03] pointer-events-none rounded-full"
        style={{
          background: "radial-gradient(circle, var(--color-gold) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto flex flex-col items-start md:items-center md:text-center">
        {/* Eyebrow */}
        <span
          className="testimonials-eyebrow font-body text-eyebrow eyebrow inline-block mb-4 md:mb-6 tracking-[0.25em]"
          style={{
            color: "var(--color-gold)",
            fontSize: "clamp(0.6rem, 1.5vw, 0.6875rem)",
          }}
        >
          {dict.testimonials?.eyebrow || "WHAT THEY SAY"}
        </span>

        {/* Heading */}
        <h2
          className="testimonials-heading font-display mb-4 md:mb-6 text-pretty"
          style={{
            fontSize: "clamp(1.75rem, 5.5vw, 4.5rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            fontWeight: 800,
            color: "var(--color-off-white)",
          }}
        >
          {dict.testimonials?.title || "WHAT PEOPLE SAY"}
        </h2>

        {/* Gold accent line */}
        <div
          className="testimonials-accent-line mb-5 md:mb-8"
          style={{
            width: "clamp(40px, 8vw, 100px)",
            height: "1px",
            background: "linear-gradient(90deg, var(--color-gold), transparent)",
            transformOrigin: "left",
          }}
        />

        {/* Subtext */}
        <p
          className="testimonials-subtext font-body mb-12 md:mb-20 text-pretty"
          style={{
            color: "var(--color-off-white)",
            opacity: 0.5,
            fontSize: "clamp(0.8125rem, 1.2vw, 1rem)",
            lineHeight: 1.6,
            maxWidth: "560px",
          }}
        >
          {dict.testimonials?.subtitle ||
            "Reviews and success stories shared by our partners, artists, and collaborators."}
        </p>

        {/* Story Triggers (Circular Rings) */}
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 mt-4 w-full">
          {STORIES.map((story, index) => {
            const viewed = viewedStories[index];
            return (
              <div
                key={story.username}
                className="story-ring-item flex flex-col items-center cursor-pointer group"
                onClick={() => handleOpen(index)}
              >
                {/* Instagram Story Gradient Border Ring */}
                <div
                  className={`w-20 h-20 md:w-24 md:h-24 rounded-full p-[3px] transition-all duration-500 ease-out group-hover:scale-105 ${
                    viewed
                      ? "bg-transparent border border-white/20 p-0"
                      : "bg-gradient-to-tr from-[#d4a541] via-[#ffffff] to-[#7a5e20] shadow-[0_0_15px_rgba(212,165,65,0.2)] group-hover:shadow-[0_0_25px_rgba(212,165,65,0.4)]"
                  }`}
                >
                  <div className="rounded-full w-full h-full p-[2px] bg-black">
                    <div className="relative w-full h-full rounded-full overflow-hidden">
                      <Image
                        src={story.avatar}
                        alt={story.displayName}
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                        sizes="96px"
                      />
                    </div>
                  </div>
                </div>

                {/* Handle Label */}
                <span className="mt-3.5 font-body text-xs md:text-sm tracking-wider text-off-white/80 group-hover:text-gold transition-colors duration-300">
                  @{story.username}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lightbox / Immersive Story Viewer Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-xl transition-opacity duration-300"
          onClick={handleClose}
        >
          {/* Blur background matching the active story */}
          <div className="absolute inset-0 opacity-20 pointer-events-none overflow-hidden filter blur-3xl">
            {STORIES[activeIndex].background ? (
              <Image
                src={STORIES[activeIndex].background!}
                alt=""
                fill
                className="object-cover scale-150"
              />
            ) : STORIES[activeIndex].isTwitter ? (
              <div className="w-full h-full bg-gradient-to-tr from-[#15181c] via-indigo-950 to-slate-900" />
            ) : STORIES[activeIndex].isSerif ? (
              <div className="w-full h-full bg-gradient-to-b from-[#e3e6f0] to-[#f4f5fa]" />
            ) : (
              <div className="w-full h-full bg-[#0d0d0d]" />
            )}
          </div>

          {/* Desktop Global Close Button */}
          <button
            className="absolute top-6 right-8 text-white/50 hover:text-white transition-colors hidden md:flex items-center gap-2 cursor-pointer z-50 text-sm tracking-widest font-body uppercase"
            onClick={handleClose}
          >
            <span>Close</span>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navigation - Prev Chevron (Desktop Only) */}
          <button
            className="absolute left-[calc(50vw-270px)] text-white/40 hover:text-white transition-colors hidden md:block p-3 cursor-pointer z-50 rounded-full bg-white/5 hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Navigation - Next Chevron (Desktop Only) */}
          <button
            className="absolute right-[calc(50vw-270px)] text-white/40 hover:text-white transition-colors hidden md:block p-3 cursor-pointer z-50 rounded-full bg-white/5 hover:bg-white/10"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Story Container (Phone Card) */}
          <div
            className="relative w-[92vw] max-w-[395px] h-[82vh] max-h-[710px] rounded-2xl overflow-hidden border border-white/15 bg-black shadow-[0_24px_50px_-12px_rgba(0,0,0,0.9)] flex flex-col justify-between"
            onClick={(e) => {
              if (swipeOccurredRef.current) return;
              // Clicking inside the phone card
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              if (clickX < rect.width * 0.35) {
                handlePrev();
              } else {
                handleNext();
              }
            }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Viewport wrapper for horizontal slider */}
            <div className="relative w-full h-full overflow-hidden flex-grow flex flex-col justify-between">
              
              <div
                className="flex h-full transition-transform duration-500 ease-out"
                style={{
                  transform: `translate3d(-${activeIndex * 100}%, 0, 0)`,
                }}
              >
                {STORIES.map((story, index) => {
                  return (
                    <div
                      key={story.username}
                      className="w-full h-full flex-shrink-0 relative overflow-hidden flex flex-col justify-between"
                    >
                      {/* Top Interactive Panel (Timer, Header) - Self Contained in Card */}
                      <div 
                        className="pt-3 px-3.5 z-30 bg-gradient-to-b from-black/60 to-transparent w-full"
                        onClick={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                        onMouseUp={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                        onTouchEnd={(e) => e.stopPropagation()}
                      >
                        {/* Segmented Progress Bars */}
                        <div className="flex gap-1.5 w-full">
                          {STORIES.map((_, pIndex) => {
                            let width = "0%";
                            if (pIndex < index) width = "100%";
                            else if (pIndex === index) width = index === activeIndex ? `${progress}%` : "0%";
                            else if (pIndex > index) width = "0%";

                            return (
                              <div
                                key={pIndex}
                                className="h-[3px] flex-grow bg-white/20 rounded-full overflow-hidden"
                              >
                                <div className="h-full bg-white" style={{ width }} />
                              </div>
                            );
                          })}
                        </div>

                        {/* Story Header */}
                        <div className="flex justify-between items-center mt-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20">
                              <Image
                                src={story.avatar}
                                alt={story.displayName}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex flex-col items-start leading-tight">
                              <span className="text-[13.5px] font-bold text-white tracking-wide">
                                {story.username}
                              </span>
                              {story.music && (
                                <span className="text-[10px] text-white/70 max-w-[170px] truncate flex items-center gap-1">
                                  <svg className="w-2.5 h-2.5 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2v10.871c-.837-.52-1.826-.871-2.916-.871-3.084 0-5.084 2.001-5.084 5 0 2.999 2 5 5.084 5 3.084 0 4.916-2.001 4.916-5v-10h4v-4h-6z" />
                                  </svg>
                                  {story.music.title} · {story.music.artist}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-white/50 ml-1.5">
                              {story.time}
                            </span>
                          </div>

                          {/* Close Button */}
                          <button
                            className="p-2 -mr-2 text-white/60 hover:text-white cursor-pointer pointer-events-auto"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClose();
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                            onMouseUp={(e) => e.stopPropagation()}
                            onTouchStart={(e) => e.stopPropagation()}
                            onTouchEnd={(e) => e.stopPropagation()}
                          >
                            <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Main Middle Content Area */}
                      <div className="relative w-full flex-grow flex items-center justify-center h-0 min-h-0">
                        {/* Curt Von Martin Story */}
                        {index === 0 && (
                          <div className="absolute inset-0 w-full h-full">
                            <Image
                              src={story.background!}
                              alt="Curt collaborating in the studio"
                              fill
                              priority
                              className="object-cover img-editorial opacity-50"
                            />
                            {/* Subtle top/bottom shadow gradients for overlay reading */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/50" />

                            {/* Translucent Story Text Box (upper right) */}
                            <div
                              className="absolute right-5 top-[18%] max-w-[260px] p-3.5 rounded-2xl text-[14.5px] font-medium leading-[1.5] text-white text-right shadow-2xl backdrop-blur-lg border border-white/10"
                              style={{
                                background: "rgba(30, 30, 30, 0.45)",
                              }}
                            >
                              {getStoryText("curtvonmartin")}
                            </div>

                            {/* Music Sticker */}
                            <div
                              className="absolute left-6 top-[33%] p-2 rounded-xl flex items-center gap-2.5 max-w-[220px] shadow-2xl border border-white/20 select-none cursor-pointer"
                              style={{
                                background: "rgba(255, 255, 255, 0.94)",
                                transform: "rotate(-5deg)",
                              }}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="relative w-9.5 h-9.5 rounded-md overflow-hidden flex-shrink-0">
                                <Image
                                  src={story.music!.cover}
                                  alt="Album Cover"
                                  fill
                                  className="object-cover opacity-50"
                                />
                              </div>
                              <div className="flex flex-col min-w-0 pr-1">
                                <span className="text-[11.5px] font-extrabold text-[#111] leading-tight truncate">
                                  {story.music!.title}
                                </span>
                                <span className="text-[9.5px] text-[#555] font-semibold truncate">
                                  {story.music!.artist}
                                </span>
                              </div>
                              {/* Tiny animated visualizer bars */}
                              <div className="flex items-end gap-[2px] h-3 px-1">
                                <div className="w-[2px] bg-gold-dim rounded-t animate-audio-bar-1" />
                                <div className="w-[2px] bg-gold-dim rounded-t animate-audio-bar-2" />
                                <div className="w-[2px] bg-gold-dim rounded-t animate-audio-bar-3" />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Fat Jesu$ Twitter Card Story */}
                        {index === 1 && (
                          <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-[#15181c] via-[#211530] to-[#12081f] flex items-center justify-center px-4">
                            {/* Twitter Shared Card Backdrop */}
                            <div
                              className="w-full max-w-[345px] p-4.5 rounded-2xl shadow-2xl border border-white/10 select-none pointer-events-auto bg-[#15181c]"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {/* Header */}
                              <div className="flex justify-between items-start">
                                <div className="flex gap-3">
                                  <div className="relative w-10.5 h-10.5 rounded-full overflow-hidden border border-white/5">
                                    <Image
                                      src={story.avatar}
                                      alt=""
                                      fill
                                      className="object-cover opacity-50"
                                    />
                                  </div>
                                  <div className="flex flex-col leading-tight">
                                    <div className="flex items-center gap-1">
                                      <span className="font-bold text-[14.5px] text-white">
                                        {story.displayName}
                                      </span>
                                      {/* Blue Verified Checkmark */}
                                      <svg className="w-[15px] h-[15px] text-[#1d9bf0]" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                      </svg>
                                    </div>
                                    <span className="text-[12.5px] text-[#858c92]">
                                      @{story.username}
                                    </span>
                                  </div>
                                </div>

                                {/* X (Twitter) Logo */}
                                <svg className="w-[18px] h-[18px] text-white/50" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                              </div>

                              {/* Content */}
                              <div className="mt-3.5 text-[15px] text-white leading-relaxed font-body">
                                {getStoryText("8Ball_305").split(" ").map((word, idx) => {
                                  if (word.startsWith("@servusglobal")) {
                                    return (
                                      <span key={idx} className="text-[#1d9bf0] font-semibold hover:underline cursor-pointer">
                                        {word}{" "}
                                      </span>
                                    );
                                  }
                                  return word + " ";
                                })}
                              </div>

                              {/* Stats Mock */}
                              <div className="mt-4 pt-3.5 border-t border-white/5 flex gap-5 text-[11px] text-[#858c92] font-semibold">
                                <span>1.2K Repostagens</span>
                                <span>8.4K Curtidas</span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* yaloopyguyzer Story */}
                        {index === 2 && (
                          <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-[#e3e6f0] via-[#eceef5] to-[#f4f5fa] flex items-center justify-center px-8">
                            {/* Central bold uppercase serif typography (IG story style) */}
                            <div
                              className="w-full text-center text-[#111111] text-[18px] leading-[1.65] font-extrabold font-serif select-none pointer-events-auto tracking-normal"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {getStoryText("yaloopyguyzer").split(" ").map((word, idx) => {
                                if (word.startsWith("@servusglobal")) {
                                  return (
                                    <span key={idx} className="underline decoration-[2px] decoration-amber-600 font-black">
                                      {word}{" "}
                                    </span>
                                  );
                                }
                                return word + " ";
                              })}
                            </div>
                          </div>
                        )}

                        {/* lifeofmorris Story */}
                        {index === 3 && (
                          <div className="absolute inset-0 w-full h-full bg-black flex flex-col justify-start px-8 pt-24 text-left select-none">
                            {/* Slanted left-aligned white italic text block */}
                            <div className="space-y-6 font-body text-white/95 text-[14.5px] leading-[1.6] italic font-semibold max-w-[320px]">
                              {getStoryText("lifeofmorris").split("\n\n").map((para, idx) => (
                                <p key={idx}>
                                  {para.split(" ").map((word, wIdx) => {
                                    if (word.includes("@servusglobal")) {
                                      return (
                                        <span key={wIdx} className="text-gold font-bold underline">
                                          {word}{" "}
                                        </span>
                                      );
                                    }
                                    return word + " ";
                                  })}
                                </p>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* prodq6oi Story */}
                        {index === 4 && (
                          <div className="absolute inset-0 w-full h-full">
                            <Image
                              src={story.background!}
                              alt="Fleur sunset background"
                              fill
                              priority
                              className="object-cover img-editorial opacity-50"
                            />
                            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/60" />

                            <div
                              className="absolute inset-x-6 top-[22%] text-center text-white pointer-events-auto select-none font-body"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {(() => {
                                const text = getStoryText("prodq6oi");
                                const parts = text.split(/!!|！！|¡¡/);
                                const mainText = parts[0] || "";
                                const subText = parts[1] || "";
                                
                                return (
                                  <div className="text-[19px] md:text-[21px] font-extrabold leading-[1.45] tracking-tight">
                                    <p>
                                      {mainText.split(" ").map((word, idx) => {
                                        if (word.includes("@servusglobal")) {
                                          return (
                                            <span key={idx} className="underline decoration-[2px] font-black">
                                              {word}{" "}
                                            </span>
                                          );
                                        }
                                        return word + " ";
                                      })}
                                      <span className="text-red-500 font-black">!!</span>
                                    </p>
                                    {subText && (
                                      <span className="italic text-[18px] md:text-[20px] font-bold block mt-4 opacity-95 text-white/90">
                                        {subText.trim()}
                                      </span>
                                    )}
                                  </div>
                                );
                              })()}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Bottom Panel (DM Input, Heart Icon) - Self Contained in Card */}
                      <div
                        className="px-4 py-4.5 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center gap-3 z-30 w-full"
                        onClick={(e) => e.stopPropagation()}
                        onMouseDown={(e) => e.stopPropagation()}
                        onMouseUp={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                        onTouchEnd={(e) => e.stopPropagation()}
                      >
                        {/* Send message text input form */}
                        <form onSubmit={handleSendDm} className="flex-grow flex">
                          <input
                            type="text"
                            placeholder={
                              dict.footer?.brand === "SERVUS" && dict.footer?.rights?.includes("reservados")
                                ? "Enviar mensagem..."
                                : "Send message..."
                            }
                            value={dmText}
                            onChange={(e) => setDmText(e.target.value)}
                            onFocus={() => setIsPaused(true)}
                            onBlur={() => setIsPaused(false)}
                            className="w-full bg-transparent text-white placeholder-white/50 text-[13.5px] px-4 py-2.5 rounded-full border border-white/35 focus:border-white focus:outline-none transition-colors"
                          />
                        </form>

                        {/* Heart Outline/Filled Icon (Like Button) */}
                        <button
                          className={`p-1.5 rounded-full transition-transform active:scale-130 cursor-pointer ${
                            likedStories[index] ? "text-red-500 scale-110" : "text-white/80 hover:text-white"
                          }`}
                          onClick={(e) => toggleLike(e, index)}
                        >
                          {likedStories[index] ? (
                            <svg className="w-6.5 h-6.5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                          ) : (
                            <svg className="w-6.5 h-6.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1.8"
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white/95 text-black font-body text-xs font-bold px-4 py-2 rounded-full shadow-lg z-[99999] pointer-events-none transition-opacity duration-300">
          {toastMessage}
        </div>
      )}
    </section>
  );
}
