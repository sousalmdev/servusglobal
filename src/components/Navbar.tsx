"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/providers/ReducedMotionProvider";
import Image from 'next/image';
import { usePathname, useRouter } from "next/navigation";

// Vector Flag Icons (using 3x2 aspect ratio SVG)
import US from 'country-flag-icons/react/3x2/US';
import BR from 'country-flag-icons/react/3x2/BR';
import ES from 'country-flag-icons/react/3x2/ES';
import JP from 'country-flag-icons/react/3x2/JP';

gsap.registerPlugin(ScrollTrigger);

export default function Navbar({ dict }: { dict: any }) {
  const navRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
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
    { label: dict.nav.contact, href: `/${currentLocale}#contact` },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (reducedMotion || !navRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".nav-item", {
        y: -20,
        opacity: 0,
        duration: 1,
        stagger: 0.08,
        ease: "expo.out",
        delay: 2.8,
      });
    }, navRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 w-full z-[100] transition-all duration-700"
      style={{
        background: scrolled
          ? "rgba(10, 10, 10, 0.85)"
          : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(245, 242, 235, 0.06)"
          : "1px solid transparent",
      }}
    >
      <div className="flex items-center justify-between px-6 md:px-12 lg:px-16 py-5 md:py-6">
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
            src='/servuslogo.png' 
            width={130} 
            height={60} 
            alt='Servus Logo'
            style={{ height: 'auto' }}
          />
        </a>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="nav-item link-underline font-body text-eyebrow eyebrow"
              style={{ color: "var(--color-off-white)", opacity: 0.6 }}
            >
              {link.label}
            </a>
          ))}
          <a
            href={`/${currentLocale}#contact`}
            className="nav-item font-body text-eyebrow eyebrow px-5 py-2.5 transition-all duration-300"
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
            <div className="absolute right-0 top-full mt-2 w-32 bg-[#111] border border-[rgba(245,242,235,0.1)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 flex flex-col backdrop-blur-md shadow-xl overflow-hidden" style={{ zIndex: 1000 }}>
              <button 
                onClick={() => switchLanguage('en')} 
                className="font-body text-eyebrow eyebrow px-4 py-2.5 text-left hover:bg-[var(--color-gold)] hover:text-black transition-colors flex items-center gap-2 cursor-pointer" 
                style={{ color: "var(--color-off-white)" }}
              >
                <US className="w-4 h-auto" /> <span>EN</span>
              </button>
              <button 
                onClick={() => switchLanguage('pt')} 
                className="font-body text-eyebrow eyebrow px-4 py-2.5 text-left hover:bg-[var(--color-gold)] hover:text-black transition-colors flex items-center gap-2 cursor-pointer" 
                style={{ color: "var(--color-off-white)" }}
              >
                <BR className="w-4 h-auto" /> <span>PT</span>
              </button>
              <button 
                onClick={() => switchLanguage('es')} 
                className="font-body text-eyebrow eyebrow px-4 py-2.5 text-left hover:bg-[var(--color-gold)] hover:text-black transition-colors flex items-center gap-2 cursor-pointer" 
                style={{ color: "var(--color-off-white)" }}
              >
                <ES className="w-4 h-auto" /> <span>ES</span>
              </button>
              <button 
                onClick={() => switchLanguage('ja')} 
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

      {/* Mobile Menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-500"
        style={{
          maxHeight: menuOpen ? "450px" : "0",
          background: "rgba(10, 10, 10, 0.95)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="flex flex-col gap-6 px-6 py-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-display text-2xl"
              style={{ color: "var(--color-off-white)", fontWeight: 500 }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="font-body text-eyebrow eyebrow inline-block self-start px-5 py-3 mt-2"
            style={{
              color: "var(--color-black)",
              background: "var(--color-gold)",
              fontWeight: 700,
            }}
          >
            {dict.nav.workWithUs}
          </a>

          {/* Mobile Language Selector */}
          <div className="flex flex-wrap items-center gap-3 mt-4 pt-6 border-t border-[rgba(245,242,235,0.08)]">
            <button
              onClick={() => { switchLanguage('en'); setMenuOpen(false); }}
              className={`flex items-center gap-2 px-3 py-2 border text-xs font-body text-eyebrow eyebrow transition-all duration-300 cursor-pointer ${
                currentLocale === 'en'
                  ? 'border-[var(--color-gold)] text-[var(--color-gold)]'
                  : 'border-[rgba(245,242,235,0.15)] text-[var(--color-off-white)]'
              }`}
            >
              <US className="w-4 h-auto" /> EN
            </button>
            <button
              onClick={() => { switchLanguage('pt'); setMenuOpen(false); }}
              className={`flex items-center gap-2 px-3 py-2 border text-xs font-body text-eyebrow eyebrow transition-all duration-300 cursor-pointer ${
                currentLocale === 'pt'
                  ? 'border-[var(--color-gold)] text-[var(--color-gold)]'
                  : 'border-[rgba(245,242,235,0.15)] text-[var(--color-off-white)]'
              }`}
            >
              <BR className="w-4 h-auto" /> PT
            </button>
            <button
              onClick={() => { switchLanguage('es'); setMenuOpen(false); }}
              className={`flex items-center gap-2 px-3 py-2 border text-xs font-body text-eyebrow eyebrow transition-all duration-300 cursor-pointer ${
                currentLocale === 'es'
                  ? 'border-[var(--color-gold)] text-[var(--color-gold)]'
                  : 'border-[rgba(245,242,235,0.15)] text-[var(--color-off-white)]'
              }`}
            >
              <ES className="w-4 h-auto" /> ES
            </button>
            <button
              onClick={() => { switchLanguage('ja'); setMenuOpen(false); }}
              className={`flex items-center gap-2 px-3 py-2 border text-xs font-body text-eyebrow eyebrow transition-all duration-300 cursor-pointer ${
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
