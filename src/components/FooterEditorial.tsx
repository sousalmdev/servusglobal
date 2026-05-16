"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/providers/ReducedMotionProvider";

gsap.registerPlugin(ScrollTrigger);

export default function FooterEditorial({ dict }: { dict: any }) {
  const footerRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !footerRef.current) return;
    const ctx = gsap.context(() => {
      // Large brand name reveal
      gsap.set(".footer-brand .hero-word", { yPercent: 110 });
      ScrollTrigger.create({
        trigger: footerRef.current,
        start: "top 85%",
        once: true,
        onEnter: () => {
          gsap.to(".footer-brand .hero-word", {
            yPercent: 0,
            duration: 1.4,
            stagger: 0.08,
            ease: "expo.out",
          });
          gsap.from(".footer-link", {
            y: 20,
            opacity: 0,
            duration: 0.8,
            stagger: 0.05,
            ease: "expo.out",
            delay: 0.4,
          });
        },
      });
    }, footerRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <footer
      ref={footerRef}
      className="relative px-6 md:px-12 lg:px-16 overflow-hidden"
      style={{
        paddingTop: "clamp(6rem, 12vw, 10rem)",
        // Bottom padding leaves space for the absolute SERVUS wordmark below.
        paddingBottom: "clamp(22vw, 24vw, 24vw)",
        borderTop: "1px solid rgba(245, 242, 235, 0.06)",
      }}
    >
      {/* Large brand name */}
  
      {/* Footer content grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16 md:mb-24">
        {/* Info */}
        <div className="md:col-span-4">
          <span
            className="footer-link font-body text-eyebrow eyebrow mb-4 inline-block"
            style={{ color: "var(--color-off-white)", opacity: 0.3 }}
          >
            {dict.footer.about}
          </span>
          <p
            className="footer-link font-body text-pretty"
            style={{
              color: "var(--color-off-white)",
              opacity: 0.4,
              fontSize: "0.9375rem",
              lineHeight: 1.7,
              maxWidth: "320px",
            }}
          >
            {dict.footer.aboutText}
          </p>
        </div>

        {/* Navigation */}
        <div className="md:col-span-3">
          <span
            className="footer-link font-body text-eyebrow eyebrow mb-4 inline-block"
            style={{ color: "var(--color-off-white)", opacity: 0.3 }}
          >
            {dict.footer.navigate}
          </span>
          <div className="flex flex-col gap-3">
            {[
              { label: dict.nav.roster, href: "#artists" },
              { label: dict.nav.services, href: "#services" },
              { label: dict.nav.story, href: "#story" },
              { label: dict.roles.word2, href: "#roles" },
              { label: dict.nav.contact, href: "#contact" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="footer-link link-underline font-body"
                style={{
                  color: "var(--color-off-white)",
                  opacity: 0.5,
                  fontSize: "0.9375rem",
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="md:col-span-3">
          <span
            className="footer-link font-body text-eyebrow eyebrow mb-4 inline-block"
            style={{ color: "var(--color-off-white)", opacity: 0.3 }}
          >
            {dict.footer.direct}
          </span>
          <div className="flex flex-col gap-3">
            {[
              { label: "A&R", email: "ar@servusglobal.com" },
              { label: "Partnerships", email: "partners@servusglobal.com" },
              { label: "Press", email: "press@servusglobal.com" },
            ].map((item) => (
              <a
                key={item.email}
                href={`mailto:${item.email}`}
                className="footer-link link-underline font-body"
                style={{
                  color: "var(--color-off-white)",
                  opacity: 0.5,
                  fontSize: "0.9375rem",
                }}
              >
                {item.email}
              </a>
            ))}
          </div>
        </div>

        {/* Social */}
        <div className="md:col-span-2">
          <span
            className="footer-link font-body text-eyebrow eyebrow mb-4 inline-block"
            style={{ color: "var(--color-off-white)", opacity: 0.3 }}
          >
            {dict.footer.social}
          </span>
          <div className="flex flex-col gap-3">
            {[
              { label: "Instagram", url: "https://instagram.com" },
              { label: "Spotify", url: "https://open.spotify.com" },
              { label: "YouTube", url: "https://youtube.com" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link link-underline font-body"
                style={{
                  color: "var(--color-off-white)",
                  opacity: 0.5,
                  fontSize: "0.9375rem",
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-8"
        style={{ borderTop: "1px solid rgba(245, 242, 235, 0.06)" }}
      >
        <span
          className="footer-link font-body text-eyebrow eyebrow"
          style={{ color: "var(--color-off-white)", opacity: 0.25 }}
        >
          © {new Date().getFullYear()} Servus Global · Perth · USA · Worldwide
        </span>
        <span
          className="footer-link font-body text-eyebrow eyebrow"
          style={{ color: "var(--color-off-white)", opacity: 0.2 }}
        >
          {dict.footer.rights}
        </span>
      </div>
      {/* Giant SERVUS wordmark — absolute, full viewport width */}
      <div
        aria-hidden
        className="footer-brand absolute bottom-0 left-0 w-screen pointer-events-none overflow-hidden flex items-end justify-center"
        style={{ background: "var(--color-gold)" }}
      >
        <h2
          className="font-display block"
          style={{
            fontSize: "15vw",
            lineHeight: 0.85,
            letterSpacing: "-.1em",
            fontWeight: 800,
            color: "var(--color-black)",
            textAlign: "center",
            width: "100%",
          }}
        >
          <span className="hero-word inline-block">{dict.footer.brand}</span>
        </h2>
      </div>
    </footer>
  );
}
