"use client";

import { ReactLenis } from "lenis/react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";

const CustomCursor = dynamic(() => import("@/components/CustomCursor"), {
  ssr: false,
});

gsap.registerPlugin(ScrollTrigger);

// Ignore minor height changes (like mobile address bar sliding) to prevent layout-thrashing
ScrollTrigger.config({
  ignoreMobileResize: true,
});

export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    let scrollLinked = false;
    const update = (time: number) => {
      const lenisInstance = lenisRef.current?.lenis;
      if (lenisInstance) {
        if (!scrollLinked) {
          lenisInstance.on("scroll", ScrollTrigger.update);
          scrollLinked = true;
        }
        lenisInstance.raf(time * 1000);
      }
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    // Refresh ScrollTrigger when custom fonts are fully loaded and layout stabilizes
    if (typeof document !== "undefined" && document.fonts) {
      document.fonts.ready.then(() => {
        ScrollTrigger.refresh();
      });
    }

    // Refresh ScrollTrigger when document body size changes (lazy images, dynamic imports, etc.)
    let resizeObserver: ResizeObserver | undefined;
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    if (typeof ResizeObserver !== "undefined" && typeof document !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 250);
      });
      resizeObserver.observe(document.body);
    }

    return () => {
      gsap.ticker.remove(update);
      lenisRef.current?.lenis?.off("scroll", ScrollTrigger.update);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <ReactLenis
      ref={lenisRef}
      root
      options={{
        autoRaf: false,
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
      }}
    >
      {children}
      <CustomCursor />
    </ReactLenis>
  );
}
