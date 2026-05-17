"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useReducedMotion } from "@/providers/ReducedMotionProvider";

const MIN_VISIBLE_MS = 2200;

export default function LoadingSequence() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const pngRef = useRef<HTMLImageElement>(null);
  const [show, setShow] = useState(true);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined") return;

    document.body.style.overflow = "hidden";
    const overlay = overlayRef.current;
    const svgContainer = svgContainerRef.current;
    const png = pngRef.current;
    if (!overlay || !svgContainer || !png) return;

    const mountedAt = performance.now();
    let cancelled = false;
    let cleanupTimer: number | undefined;

    const wait = (ms: number) =>
      new Promise<void>((resolve) => {
        cleanupTimer = window.setTimeout(resolve, ms);
      });

    const runReduced = () => {
      gsap.set(svgContainer, { opacity: 0 });
      gsap.set(png, { opacity: 1, scale: 1 });
      cleanupTimer = window.setTimeout(() => {
        if (cancelled) return;
        // Premium soft fade out overlay exit for reduced motion
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.8,
          ease: "power2.out",
          onComplete: () => {
            if (cancelled) return;
            sessionStorage.setItem("sg-loaded", "1");
            document.body.style.overflow = "";
            setShow(false);
          },
        });
      }, MIN_VISIBLE_MS);
    };

    const runFull = (paths: NodeListOf<SVGPathElement>) => {
      const elapsed = performance.now() - mountedAt;
      const delay = Math.max(0, MIN_VISIBLE_MS - elapsed) / 1000;

      const tl = gsap.timeline({
        delay,
        onComplete: () => {
          if (cancelled) return;
          sessionStorage.setItem("sg-loaded", "1");
          document.body.style.overflow = "";
        },
      });

      if (paths.length > 0) {
        tl.to(paths, {
          strokeDashoffset: 0,
          duration: 1.4,
          ease: "power2.inOut",
          stagger: 0.06,
        });
      }

      tl.to(
        svgContainer,
        { opacity: 0, duration: 0.7, ease: "power2.inOut" },
        paths.length > 0 ? "+=0.1" : 0,
      );
      tl.to(
        png,
        { opacity: 1, scale: 1, duration: 0.9, ease: "expo.out" },
        "<",
      );

      tl.to({}, { duration: 0.4 });

      tl.to(overlay, {
        clipPath: "inset(0 0 100% 0)",
        duration: 0.8,
        ease: "power3.inOut",
        onComplete: () => {
          if (cancelled) return;
          setShow(false);
        },
      });
    };

    // Preload PNG and fetch SVG in parallel; honour min visible time before exit
    const pngLoaded = new Promise<void>((resolve) => {
      if (png.complete) {
        resolve();
      } else {
        png.addEventListener("load", () => resolve(), { once: true });
        png.addEventListener("error", () => resolve(), { once: true });
      }
    });

    Promise.all([
      fetch("/servuslogo.svg")
        .then((r) => r.text())
        .catch(() => ""),
      pngLoaded,
    ]).then(([svgText]) => {
      if (cancelled) return;

      svgContainer.innerHTML = svgText;
      const svg = svgContainer.querySelector("svg");
      if (svg) {
        svg.style.width = "min(70vw, 560px)";
        svg.style.height = "auto";
        svg.style.display = "block";
        
        // Force browser layout recalculation/reflow to guarantee WebKit measures correctly
        svg.getBoundingClientRect();
      }

      const paths = svgContainer.querySelectorAll(
        "path",
      ) as NodeListOf<SVGPathElement>;

      paths.forEach((path) => {
        let length = path.getTotalLength();
        // Bulletproof measurement fallback to handle layout timing races on mobile viewports
        if (!length || length <= 0 || isNaN(length)) {
          length = 1000;
        }
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "#f5f2eb");
        path.setAttribute("stroke-width", "1.5");
        path.style.strokeDasharray = `${length}`;
        path.style.strokeDashoffset = `${length}`;
      });

      if (reducedMotion) {
        runReduced();
      } else {
        runFull(paths);
      }
    });

    return () => {
      cancelled = true;
      if (cleanupTimer) window.clearTimeout(cleanupTimer);
      document.body.style.overflow = "";
    };
  }, [reducedMotion]);

  if (!show) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        background: "var(--color-black)",
        clipPath: "inset(0 0 0 0)",
      }}
    >
      <div className="relative">
        <div ref={svgContainerRef} />
        <img
          ref={pngRef}
          src="/servuslogo.png"
          alt="Servus Global"
          style={{
            width: "min(70vw, 560px)",
            height: "auto",
            display: "block",
            position: "absolute",
            inset: 0,
            opacity: 0,
            transform: "scale(0.96)",
          }}
        />
      </div>
    </div>
  );
}
