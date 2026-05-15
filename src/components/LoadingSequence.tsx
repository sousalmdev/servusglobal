"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useReducedMotion } from "@/providers/ReducedMotionProvider";

export default function LoadingSequence() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(true);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem("sg-loaded")) {
      setShow(false);
      return;
    }

    document.body.style.overflow = "hidden";
    const overlay = overlayRef.current;
    const container = containerRef.current;
    if (!overlay || !container) return;

    // Fetch and inject the SVG so we can animate its paths
    fetch("/servuslogo.svg")
      .then((r) => r.text())
      .then((svgText) => {
        container.innerHTML = svgText;
        const svg = container.querySelector("svg");
        if (!svg) return;

        svg.style.width = "min(70vw, 560px)";
        svg.style.height = "auto";

        const paths = svg.querySelectorAll("path");

        if (reducedMotion) {
          paths.forEach((p) => {
            p.setAttribute("fill", "#f5f2eb");
            p.style.opacity = "1";
          });
          setTimeout(() => {
            sessionStorage.setItem("sg-loaded", "1");
            document.body.style.overflow = "";
            setShow(false);
          }, 400);
          return;
        }

        // Prepare each path for stroke-draw
        paths.forEach((path) => {
          const length = path.getTotalLength();
          path.setAttribute("fill", "none");
          path.setAttribute("stroke", "#f5f2eb");
          path.setAttribute("stroke-width", "1.5");
          path.style.strokeDasharray = `${length}`;
          path.style.strokeDashoffset = `${length}`;
        });

        const tl = gsap.timeline({
          onComplete: () => {
            sessionStorage.setItem("sg-loaded", "1");
            document.body.style.overflow = "";
          },
        });

        // Stroke draw — staggered across all paths
        tl.to(paths, {
          strokeDashoffset: 0,
          duration: 1.4,
          ease: "power2.inOut",
          stagger: 0.06,
        });

        // Fill reveal
        tl.to(
          paths,
          {
            fill: "#f5f2eb",
            duration: 0.5,
            ease: "power1.in",
            stagger: 0.03,
          },
          "-=0.4"
        );

        // Remove stroke after fill
        tl.set(paths, { stroke: "none" });

        // Hold
        tl.to({}, { duration: 0.4 });

        // Clip-path wipe exit
        tl.to(overlay, {
          clipPath: "inset(0 0 100% 0)",
          duration: 0.8,
          ease: "power3.inOut",
          onComplete: () => setShow(false),
        });
      });

    return () => {
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
      <div ref={containerRef} />
    </div>
  );
}
