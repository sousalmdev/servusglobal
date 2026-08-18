"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/providers/ReducedMotionProvider";
import Image from 'next/image';
import { usePathname, useRouter } from "next/navigation";
import type { Dictionary } from "@/i18n/getDictionary";

// Vector Flag Icons (using 3x2 aspect ratio SVG)
import US from 'country-flag-icons/react/3x2/US';
import BR from 'country-flag-icons/react/3x2/BR';
import ES from 'country-flag-icons/react/3x2/ES';
import JP from 'country-flag-icons/react/3x2/JP';

gsap.registerPlugin(ScrollTrigger);

export default function Navbar({ dict }: { dict: Dictionary }) {
  const navRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const pathname = usePathname();
  const router = useRouter();

  const switchLanguage = (locale: string) => {
    if (!pathname) return;
    const pathParts = pathname.split('/');
    pathParts[1] = locale; // Assuming locale is always at index 1
    router.push(pathParts.join('/'));
  };

  const currentLocale = pathname?.split('/')[1] || 'en';

  const NAV_LINKS = [
    { label: dict.nav.roster, href: `/${currentLocale}#artists` },
    { label: dict.nav.services, href: `/${currentLocale}#services` },
    { label: dict.nav.story, href: `/${currentLocale}#story` },
    { label: dict.nav.faq || "FAQ", href: `/${currentLocale}#faq` },
    { label: dict.nav.contact, href: `/${currentLocale}/contact` },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on Escape key
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const sections = ["artists", "services", "story", "faq"];
    const observers = sections.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        {
          rootMargin: "-45% 0px -45% 0px", // Trigger when section occupies screen center
        }
      );
      observer.observe(el);
      return { observer, el };
    });

    return () => {
      observers.forEach((obs) => {
        if (obs) obs.observer.unobserve(obs.el);
      });
    };
  }, []);

  useEffect(() => {
    if (reducedMotion || !navRef.current) return;
    
    // Check if the loading sequence has already run or is skipped in this session
    const hasLoaded = typeof window !== "undefined" && !!sessionStorage.getItem("sg-loaded");
    const animDelay = hasLoaded ? 0.15 : 2.8;

    const ctx = gsap.context(() => {
      gsap.from(".nav-item", {
        y: -20,
        opacity: 0,
        duration: 1,
        stagger: 0.08,
        ease: "expo.out",
        delay: animDelay,
      });

      // Scroll progress bar indicator
      gsap.to(".scroll-progress-bar", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });
    }, navRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion || typeof window === "undefined") return;

    if (menuOpen) {
      gsap.fromTo(
        ".mobile-nav-link",
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.07,
          ease: "power3.out",
          overwrite: "auto",
        }
      );
      gsap.fromTo(
        ".mobile-lang-btn",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.05,
          ease: "power3.out",
          delay: 0.25,
          overwrite: "auto",
        }
      );
    }
  }, [menuOpen, reducedMotion]);

  return (
    <nav
      ref={navRef}
      aria-label="Main navigation"
      className="fixed top-0 left-0 w-full z-[100] transition-all duration-700"
      style={{
        background: scrolled
          ? "rgba(10, 10, 10, 0.98)"
          : "transparent",
        borderBottom: scrolled
          ? "1px solid rgba(245, 242, 235, 0.06)"
          : "1px solid transparent",
      }}
    >
      {/* Scroll Progress Bar */}
      <div
        className="scroll-progress-bar absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[var(--color-gold-dim)] to-[var(--color-gold)] origin-left scale-x-0 z-[110]"
        style={{ transformOrigin: "left center" }}
      />
      <div className="relative z-[100] flex items-center justify-between px-6 md:px-12 lg:px-16 py-5 md:py-6">
        {/* Logo */}
        <a
          href={`/${currentLocale}`}
          className="nav-item font-display text-lg md:text-xl tracking-tight"
          style={{
            color: "var(--color-off-white)",
            fontWeight: 700,
            letterSpacing: "-0.03em",
          }}
        >
          <Image 
            src='/servuslogo.webp' 
            width={130} 
            height={60} 
            alt='Servus Global Logo'
            priority
            className="md:w-36 w-24 h-auto"
          />
        </a>
 
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection && link.href.endsWith(`#${activeSection}`);
            return (
              <a
                key={link.label}
                href={link.href}
                className={`nav-item link-underline font-body text-eyebrow eyebrow transition-colors duration-300 ${
                  isActive ? "text-[var(--color-gold)] opacity-100" : "text-[var(--color-off-white)] opacity-60"
                }`}
              >
                {link.label}
              </a>
            );
          })}
          <a
            href={`/${currentLocale}/contact`}
            className="nav-item font-body text-eyebrow eyebrow px-5 py-2.5 transition-all duration-300 cta-pulse"
            style={{
              color: "var(--color-black)",
              background: "var(--color-gold)",
              fontWeight: 700,
            }}
          >
            {dict.nav.workWithUs}
          </a>
          
          {/* Desktop Language Selector */}
          <div className="relative group nav-item">
            <button
              className="font-body text-eyebrow eyebrow px-3 py-2 flex items-center gap-2 transition-all duration-300 cursor-pointer"
              aria-label="Change language"
              style={{
                color: "var(--color-off-white)",
                border: "1px solid rgba(245, 242, 235, 0.18)",
              }}
            >
              <span className="w-4 h-auto inline-flex items-center" aria-hidden="true">
                {currentLocale === 'en' && <US className="w-full h-auto" />}
                {currentLocale === 'pt' && <BR className="w-full h-auto" />}
                {currentLocale === 'es' && <ES className="w-full h-auto" />}
                {currentLocale === 'ja' && <JP className="w-full h-auto" />}
              </span>
              <span>{currentLocale.toUpperCase()}</span>
              <span className="text-[9px] opacity-60">▼</span>
            </button>
            <div className="absolute right-0 top-full mt-2 w-32 bg-[#111] border border-[rgba(245,242,235,0.1)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col shadow-xl overflow-hidden" style={{ zIndex: 1000 }}>
              <button 
                onClick={() => switchLanguage('en')} 
                aria-label="Switch to English"
                className="font-body text-eyebrow eyebrow px-4 py-2.5 text-left hover:bg-[var(--color-gold)] hover:text-black transition-colors flex items-center gap-2 cursor-pointer" 
                style={{ color: "var(--color-off-white)" }}
              >
                <US className="w-4 h-auto" /> <span>EN</span>
              </button>
              <button 
                onClick={() => switchLanguage('pt')} 
                aria-label="Switch to Portuguese"
                className="font-body text-eyebrow eyebrow px-4 py-2.5 text-left hover:bg-[var(--color-gold)] hover:text-black transition-colors flex items-center gap-2 cursor-pointer" 
                style={{ color: "var(--color-off-white)" }}
              >
                <BR className="w-4 h-auto" /> <span>PT</span>
              </button>
              <button 
                onClick={() => switchLanguage('es')} 
                aria-label="Switch to Spanish"
                className="font-body text-eyebrow eyebrow px-4 py-2.5 text-left hover:bg-[var(--color-gold)] hover:text-black transition-colors flex items-center gap-2 cursor-pointer" 
                style={{ color: "var(--color-off-white)" }}
              >
                <ES className="w-4 h-auto" /> <span>ES</span>
              </button>
              <button 
                onClick={() => switchLanguage('ja')} 
                aria-label="Switch to Japanese"
                className="font-body text-eyebrow eyebrow px-4 py-2.5 text-left hover:bg-[var(--color-gold)] hover:text-black transition-colors flex items-center gap-2 cursor-pointer" 
                style={{ color: "var(--color-off-white)" }}
              >
                <JP className="w-4 h-auto" /> <span>JA</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden nav-item flex flex-col gap-1.5 cursor-pointer"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span
            className="block w-6 h-[1.5px] transition-all duration-300"
            style={{
              background: "var(--color-off-white)",
              transform: menuOpen ? "rotate(45deg) translate(3px, 3px)" : "none",
            }}
          />
          <span
            className="block w-6 h-[1.5px] transition-all duration-300"
            style={{
              background: "var(--color-off-white)",
              opacity: menuOpen ? 0 : 1,
            }}
          />
          <span
            className="block w-6 h-[1.5px] transition-all duration-300"
            style={{
              background: "var(--color-off-white)",
              transform: menuOpen ? "rotate(-45deg) translate(3px, -3px)" : "none",
            }}
          />
        </button>
      </div>

      {/* Fullscreen Mobile Menu Overlay */}
      <div
        className="md:hidden fixed inset-0 w-full h-[100dvh] flex flex-col justify-center items-center bg-black/98 backdrop-blur-xl transition-all duration-500"
        style={{
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? "auto" : "none",
          visibility: menuOpen ? "visible" : "hidden",
          zIndex: 90,
        }}
      >
        <div className="flex flex-col items-center gap-8 px-6 py-12 w-full">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection && link.href.endsWith(`#${activeSection}`);
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`mobile-nav-link font-display text-3xl font-medium tracking-tight transition-colors duration-300 ${
                  isActive ? "text-[var(--color-gold)]" : "text-[var(--color-off-white)]"
                }`}
              >
                {link.label}
              </a>
            );
          })}
          <a
            href={`/${currentLocale}/contact`}
            onClick={() => setMenuOpen(false)}
            className="mobile-nav-link font-body text-eyebrow eyebrow px-6 py-3.5 mt-4 text-center transition-all duration-300 hover:scale-105"
            style={{
              color: "var(--color-black)",
              background: "var(--color-gold)",
              fontWeight: 700,
              opacity: reducedMotion ? 1 : 0,
              width: "200px",
            }}
          >
            {dict.nav.workWithUs}
          </a>

          {/* Mobile Language Selector */}
          <div 
            className="flex flex-wrap justify-center items-center gap-3 mt-8 pt-8 border-t border-[rgba(245,242,235,0.08)] w-full max-w-[280px]"
          >
            <button
              onClick={() => { switchLanguage('en'); setMenuOpen(false); }}
              aria-label="Switch to English"
              className={`mobile-lang-btn flex items-center gap-2 px-3 py-2 border text-xs font-body text-eyebrow eyebrow transition-colors duration-300 cursor-pointer ${
                currentLocale === 'en'
                  ? 'border-[var(--color-gold)] text-[var(--color-gold)]'
                  : 'border-[rgba(245,242,235,0.15)] text-[var(--color-off-white)]'
              }`}
            >
              <US className="w-4 h-auto" /> EN
            </button>
            <button
              onClick={() => { switchLanguage('pt'); setMenuOpen(false); }}
              aria-label="Switch to Portuguese"
              className={`mobile-lang-btn flex items-center gap-2 px-3 py-2 border text-xs font-body text-eyebrow eyebrow transition-colors duration-300 cursor-pointer ${
                currentLocale === 'pt'
                  ? 'border-[var(--color-gold)] text-[var(--color-gold)]'
                  : 'border-[rgba(245,242,235,0.15)] text-[var(--color-off-white)]'
              }`}
            >
              <BR className="w-4 h-auto" /> PT
            </button>
            <button
              onClick={() => { switchLanguage('es'); setMenuOpen(false); }}
              aria-label="Switch to Spanish"
              className={`mobile-lang-btn flex items-center gap-2 px-3 py-2 border text-xs font-body text-eyebrow eyebrow transition-colors duration-300 cursor-pointer ${
                currentLocale === 'es'
                  ? 'border-[var(--color-gold)] text-[var(--color-gold)]'
                  : 'border-[rgba(245,242,235,0.15)] text-[var(--color-off-white)]'
              }`}
            >
              <ES className="w-4 h-auto" /> ES
            </button>
            <button
              onClick={() => { switchLanguage('ja'); setMenuOpen(false); }}
              aria-label="Switch to Japanese"
              className={`mobile-lang-btn flex items-center gap-2 px-3 py-2 border text-xs font-body text-eyebrow eyebrow transition-colors duration-300 cursor-pointer ${
                currentLocale === 'ja'
                  ? 'border-[var(--color-gold)] text-[var(--color-gold)]'
                  : 'border-[rgba(245,242,235,0.15)] text-[var(--color-off-white)]'
              }`}
            >
              <JP className="w-4 h-auto" /> JA
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
