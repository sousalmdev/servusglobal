"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/providers/ReducedMotionProvider";

gsap.registerPlugin(ScrollTrigger);

const roles = [
  {
    title: "Artists",
    description:
      "You make the music. We handle release strategy, distribution and brand, built around how you actually work.",
    cta: "Submit your work",
  },
  {
    title: "Partners",
    description:
      "Labels, venues, brands, festivals. We work on partnerships that come back the year after.",
    cta: "Start a conversation",
  },
  {
    title: "Investors",
    description:
      "We're building infrastructure for artist careers that run on long timelines. Open to talking numbers.",
    cta: "Learn more",
  },
  {
    title: "Creatives",
    description:
      "Photographers, directors, designers, producers. If you shape how music looks and feels, get in touch.",
    cta: "Get in touch",
  },
];

const OPEN_HEIGHT = 260;
const DRAG_THRESHOLD = 6;

type Role = (typeof roles)[number];

function RoleRow({
  role,
  index,
  last,
  reducedMotion,
}: {
  role: Role;
  index: number;
  last: boolean;
  reducedMotion: boolean;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLSpanElement>(null);
  const accentRef = useRef<HTMLSpanElement>(null);

  const stateRef = useRef({
    height: 0,
    pointerDownY: 0,
    pointerDownHeight: 0,
    dragging: false,
    dragged: false,
    open: false,
  });

  const applyHeight = (h: number) => {
    const clamped = Math.max(0, Math.min(OPEN_HEIGHT * 1.05, h));
    stateRef.current.height = clamped;
    if (contentRef.current) {
      contentRef.current.style.height = `${clamped}px`;
    }
    if (accentRef.current) {
      const progress = Math.min(clamped / OPEN_HEIGHT, 1);
      accentRef.current.style.transform = `scaleX(${progress})`;
    }
  };

  const snapTo = (open: boolean) => {
    const target = open ? OPEN_HEIGHT : 0;
    const state = stateRef.current;
    state.open = open;
    gsap.killTweensOf(state);
    gsap.to(state, {
      height: target,
      duration: reducedMotion ? 0.2 : open ? 0.85 : 0.45,
      ease: reducedMotion
        ? "power1.out"
        : open
          ? "elastic.out(1, 0.55)"
          : "power3.out",
      onUpdate() {
        applyHeight(state.height);
      },
    });
    if (arrowRef.current) {
      gsap.to(arrowRef.current, {
        rotation: open ? 180 : 0,
        duration: 0.4,
        ease: "power3.out",
      });
    }
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const state = stateRef.current;
    state.pointerDownY = e.clientY;
    state.pointerDownHeight = state.height;
    state.dragging = true;
    state.dragged = false;
    gsap.killTweensOf(state);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const state = stateRef.current;
    if (!state.dragging) return;
    const delta = e.clientY - state.pointerDownY;
    if (Math.abs(delta) > DRAG_THRESHOLD) state.dragged = true;
    applyHeight(state.pointerDownHeight + delta);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const state = stateRef.current;
    if (!state.dragging) return;
    state.dragging = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
    if (!state.dragged) {
      snapTo(!state.open);
      return;
    }
    snapTo(state.height > OPEN_HEIGHT / 2);
  };

  useEffect(() => {
    if (reducedMotion || !rowRef.current) return;
    const el = rowRef.current;
    const ctx = gsap.context(() => {
      gsap.from(el, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          once: true,
        },
      });
    }, rowRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <div
      ref={rowRef}
      data-lenis-prevent
      className="relative"
      style={{
        borderTop: "1px solid rgba(245, 242, 235, 0.08)",
        ...(last
          ? { borderBottom: "1px solid rgba(245, 242, 235, 0.08)" }
          : {}),
      }}
    >
      {/* Animated gold accent on top edge — fills as you drag */}
      <span
        ref={accentRef}
        aria-hidden
        className="absolute left-0 right-0 top-0 h-[2px] origin-left"
        style={{
          background: "var(--color-gold)",
          transform: "scaleX(0)",
          transition: "none",
        }}
      />

      {/* Header — drag surface */}
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="flex items-center justify-between py-8 md:py-12 select-none"
        style={{ touchAction: "none" }}
        data-cursor="hover"
      >
        <div className="flex items-baseline gap-4 md:gap-8 pointer-events-none">
          <span
            className="font-body text-eyebrow eyebrow"
            style={{ color: "var(--color-gold)", opacity: 0.55 }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3
            className="font-display"
            style={{
              color: "var(--color-off-white)",
              fontSize: "clamp(2rem, 4vw, 4rem)",
              lineHeight: 1,
              letterSpacing: "-0.03em",
              fontWeight: 600,
            }}
          >
            {role.title}
          </h3>
        </div>
        <span
          className="font-body text-eyebrow eyebrow inline-flex items-center gap-3 pointer-events-none"
          style={{
            color: "var(--color-gold)",
            opacity: 0.55,
            fontSize: "0.625rem",
          }}
        >
          PULL
          <span
            ref={arrowRef}
            className="inline-block"
            style={{ transformOrigin: "50% 50%" }}
          >
            ↓
          </span>
        </span>
      </div>

      {/* Drag-revealed content */}
      <div
        ref={contentRef}
        className="overflow-hidden"
        style={{ height: 0, willChange: "height" }}
      >
        <div className="pl-10 md:pl-24 pb-10 pr-4 max-w-2xl">
          <p
            className="font-body text-pretty mb-6"
            style={{
              color: "var(--color-off-white)",
              opacity: 0.6,
              fontSize: "1rem",
              lineHeight: 1.7,
            }}
          >
            {role.description}
          </p>
          <a
            href="#contact"
            className="font-body text-eyebrow eyebrow inline-flex items-center gap-2"
            style={{ color: "var(--color-gold)" }}
            data-cursor="hover"
          >
            {role.cta} <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Roles() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.set(".roles-heading .hero-word", { yPercent: 110 });
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        once: true,
        onEnter: () => {
          gsap.to(".roles-heading .hero-word", {
            yPercent: 0,
            duration: 1.4,
            stagger: 0.1,
            ease: "expo.out",
          });
          gsap.from(".roles-hint", {
            opacity: 0,
            y: 10,
            duration: 0.8,
            delay: 0.5,
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
      id="roles"
      className="relative px-6 md:px-12 lg:px-16"
      style={{
        paddingTop: "clamp(8rem, 16vw, 14rem)",
        paddingBottom: "clamp(8rem, 16vw, 14rem)",
      }}
    >
      <div className="roles-heading mb-12 md:mb-20">
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
              THE
            </span>
          </span>
          <span className="block overflow-hidden">
            <span
              className="hero-word block serif-italic"
              style={{ color: "var(--color-gold)" }}
            >
              roles
            </span>
          </span>
        </h2>
        <p
          className="roles-hint mt-6 font-body text-eyebrow eyebrow"
          style={{ color: "var(--color-off-white)", opacity: 0.35 }}
        >
          Grab a row and pull it down
        </p>
      </div>

      <div>
        {roles.map((role, i) => (
          <RoleRow
            key={role.title}
            role={role}
            index={i}
            last={i === roles.length - 1}
            reducedMotion={reducedMotion}
          />
        ))}
      </div>
    </section>
  );
}
