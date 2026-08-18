"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/providers/ReducedMotionProvider";
import type { Dictionary } from "@/i18n/getDictionary";

gsap.registerPlugin(ScrollTrigger);

export default function Contact({ dict }: { dict: Dictionary }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.set(".contact-heading .hero-word", { yPercent: 110, filter: "blur(8px)" });
      gsap.set(".contact-intro", { y: 30, opacity: 0 });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        once: true,
        onEnter: () => {
          gsap.to(".contact-heading .hero-word", {
            yPercent: 0,
            filter: "blur(0px)",
            duration: 1.6,
            stagger: 0.12,
            ease: "expo.out",
          });

          gsap.to(".contact-intro", {
            y: 0, opacity: 1, duration: 1.2, ease: "expo.out", delay: 0.3,
          });

          gsap.fromTo(
            ".form-card",
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, stagger: 0.15, ease: "expo.out", delay: 0.5 }
          );
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    const data = new FormData(e.currentTarget);
    const pathname = typeof window !== "undefined" ? window.location.pathname : "";
    const lang = pathname.split("/")[1] || "en";
    const payload: Record<string, any> = { pathway: "artist", lang };

    for (const [key, value] of Array.from(data.entries())) {
      if (payload[key]) {
        if (!Array.isArray(payload[key])) payload[key] = [payload[key]];
        payload[key].push(value);
      } else {
        payload[key] = value;
      }
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setSubmitted(true);
        if (!reducedMotion) {
          gsap.fromTo(".success-container", { y: 20, opacity: 0, scale: 0.98 }, { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "expo.out" });
        }
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative w-full"
      style={{
        paddingTop: "clamp(10rem, 18vw, 16rem)",
        paddingBottom: "clamp(6rem, 12vw, 10rem)",
      }}
    >
      {/* Ambient glow */}
      <div className="absolute pointer-events-none" style={{
        top: "5%", left: "50%", transform: "translateX(-50%)",
        width: "min(1400px, 100vw)", height: "900px",
        background: "radial-gradient(ellipse, rgba(212,165,55,0.05) 0%, transparent 65%)",
      }} />

      {/* ─── Hero Heading ─── */}
      <div className="contact-heading text-center px-6 md:px-12 lg:px-16 mb-6 md:mb-10">
        <h1 className="font-display mx-auto" style={{
          fontSize: "clamp(3rem, 10vw, 10rem)", lineHeight: 0.9,
          letterSpacing: "-0.04em", fontWeight: 800,
        }}>
          <span className="block overflow-hidden">
            <span className="hero-word block" style={{ color: "var(--color-off-white)" }}>
              {dict.contact.word1}
            </span>
          </span>
          <span className="block overflow-hidden">
            <span className="hero-word block">
              <span style={{ color: "var(--color-off-white)" }}>{dict.contact.word2}</span>
              <span className=" tracking-tighter" style={{ color: "var(--color-gold)", fontWeight: 400 }}>
                {dict.contact.word3}
              </span>
            </span>
          </span>
        </h1>
      </div>

      {/* ─── Subtitle ─── */}
      <div className="contact-intro text-center px-6 md:px-12 mb-16 md:mb-24">
        <p className="font-body text-body-lg mx-auto" style={{
          color: "var(--color-off-white)", opacity: 0.45,
          maxWidth: "520px", lineHeight: 1.8,
        }}>
          {dict.contact.form.subtitleArtist}
        </p>
      </div>

      {/* ─── Content ─── */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 md:px-12 lg:px-16">
        {submitted ? (
          <div className="success-container flex flex-col items-center justify-center text-center py-24 gap-6"
            style={{ background: "rgba(20,20,20,0.6)", border: "1px solid rgba(245,242,235,0.06)", borderRadius: "2px" }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{
              background: "rgba(212,165,55,0.1)", border: "1px solid rgba(212,165,55,0.25)",
            }}>
              <span style={{ fontSize: "32px", color: "var(--color-gold)" }}>✓</span>
            </div>
            <h3 className="font-display text-3xl md:text-4xl" style={{
              color: "var(--color-off-white)", letterSpacing: "-0.02em", fontWeight: 700,
            }}>
              Application Received
            </h3>
            <p className="font-body text-body-lg max-w-md" style={{
              color: "var(--color-off-white)", opacity: 0.5, lineHeight: 1.7,
            }}>
              {dict.contact.successMsg}
            </p>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit} className="w-full flex flex-col gap-6 md:gap-8">
            {error && (
              <div className="flex items-center gap-3 py-4 px-6" style={{
                background: "rgba(239, 68, 68, 0.08)", border: "1px solid rgba(239, 68, 68, 0.25)",
              }}>
                <span className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: "#ef4444", boxShadow: "0 0 12px #ef4444" }} />
                <span className="font-body text-body" style={{ color: "#f87171" }}>
                  {dict.contact.errorMsg}
                </span>
              </div>
            )}

            {/* ─── Card 1: Basic Info ─── */}
            <div className="form-card" style={{
              background: "rgba(18,18,18,0.7)",
              border: "1px solid rgba(245,242,235,0.06)",
              backdropFilter: "blur(12px)",
            }}>
              <CardHeader number="01" label={dict.contact.form.step1} />
              <div className="p-6 md:p-8 lg:p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <BoxInput name="fullName" label={dict.contact.form.fullName} required />
                  <BoxInput name="artistName" label={dict.contact.form.artistName} required />
                  <BoxInput name="email" label={dict.contact.form.email} type="email" required />
                  <BoxInput name="phone" label={dict.contact.form.phone} type="tel" required />
                  <BoxInput name="instagram" label={dict.contact.form.instagram} required />
                  <BoxInput name="links" label={dict.contact.form.links} required />
                </div>
              </div>
            </div>

            {/* ─── Card 2: Contact Preferences ─── */}
            <div className="form-card" style={{
              background: "rgba(18,18,18,0.7)",
              border: "1px solid rgba(245,242,235,0.06)",
              backdropFilter: "blur(12px)",
            }}>
              <CardHeader number="02" label={dict.contact.form.step2} />
              <div className="p-6 md:p-8 lg:p-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-6">
                    <RadioGroup
                      name="contactMethod"
                      label={dict.contact.form.contactMethod}
                      options={["Email", "Phone", "Instagram DM"]}
                      required
                    />
                    <RadioGroup
                      name="bestTime"
                      label={dict.contact.form.bestTime}
                      options={["Morning (8am – 12pm)", "Afternoon (12pm – 5pm)", "Evening (5pm – 9pm)"]}
                      required
                    />
                  </div>
                  <BoxInput name="country" label={dict.contact.form.country} required />
                </div>
              </div>
            </div>

            {/* ─── Card 3: Scope & Details ─── */}
            <div className="form-card" style={{
              background: "rgba(18,18,18,0.7)",
              border: "1px solid rgba(245,242,235,0.06)",
              backdropFilter: "blur(12px)",
            }}>
              <CardHeader number="03" label={dict.contact.form.step3} />
              <div className="p-6 md:p-8 lg:p-10 flex flex-col gap-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <CheckboxGroup
                    name="services"
                    label={dict.contact.form.servicesReq}
                    options={[
                      "Streaming Campaigns", "Press & Exposure", "Consultations",
                      "Creative Services", "Visuals & Media", "Rollout Strategies",
                    ]}
                  />
                  <CheckboxGroup
                    name="platform"
                    label={dict.contact.form.platform}
                    options={["Spotify", "Apple Music", "YouTube", "SoundCloud", "Instagram", "Other"]}
                  />
                </div>

                <RadioGroup
                  name="budget"
                  label={dict.contact.form.budget}
                  options={["$200 – $500", "$500 – $1,000", "$1,000 – $2,500", "$2,500+"]}
                  required
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <BoxTextarea name="shortTermGoals" label={dict.contact.form.shortTerm} required />
                  <BoxTextarea name="longTermVision" label={dict.contact.form.longTerm} required />
                </div>
              </div>
            </div>

            {/* ─── Consent & Submit Card ─── */}
            <div className="form-card" style={{
              background: "rgba(18,18,18,0.7)",
              border: "1px solid rgba(245,242,235,0.06)",
              backdropFilter: "blur(12px)",
            }}>
              <div className="p-6 md:p-8 lg:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <label className="group flex items-start gap-4 cursor-pointer max-w-lg">
                  <div className="relative flex-shrink-0 w-6 h-6 border border-[rgba(245,242,235,0.2)] transition-colors group-hover:border-[var(--color-gold)] mt-0.5"
                    style={{ background: "rgba(245,242,235,0.03)" }}>
                    <input type="checkbox" name="consent" required className="peer sr-only" />
                    <div className="absolute inset-0 bg-[var(--color-gold)] scale-0 peer-checked:scale-100 transition-transform origin-center" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-body text-body-lg text-[var(--color-off-white)]">
                      {dict.contact.form.consentTitle}
                    </span>
                    <span className="font-body text-caption text-[var(--color-off-white)] opacity-40 mt-1">
                      {dict.contact.form.consentDesc}
                    </span>
                  </div>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="group relative font-body text-eyebrow eyebrow inline-flex items-center gap-3 px-10 py-5 cursor-pointer disabled:opacity-50 transition-all duration-500 hover:-translate-y-0.5 flex-shrink-0"
                  style={{ color: "var(--color-black)", background: "var(--color-gold)", fontWeight: 700 }}
                >
                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%)" }} />
                  <span className="relative z-10">
                    {loading ? dict.contact.form.submitting : dict.contact.form.submit}
                  </span>
                  <span className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" aria-hidden>→</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

/* ─── Sub-components ─── */

function CardHeader({ number, label }: { number: string; label: string }) {
  return (
    <div className="flex items-center gap-4 px-6 md:px-8 lg:px-10 py-5"
      style={{ borderBottom: "1px solid rgba(245,242,235,0.06)" }}>
      <span className="font-display text-xl" style={{ color: "var(--color-gold)", opacity: 0.5, fontWeight: 800 }}>
        {number}
      </span>
      <span className="font-body text-eyebrow eyebrow text-[var(--color-off-white)] opacity-40">
        {label}
      </span>
    </div>
  );
}

function BoxInput({ label, name, required, type = "text" }: { label: string; name: string; required?: boolean; type?: string }) {
  return (
    <div className="relative flex flex-col group">
      <label className="font-body text-caption text-[var(--color-off-white)] opacity-40 mb-2">{label}</label>
      <input
        name={name}
        type={type}
        required={required}
        placeholder=" "
        className="w-full font-body text-body-lg px-4 py-3 outline-none text-[var(--color-off-white)] transition-all duration-300
                   focus:border-[var(--color-gold)] focus:shadow-[0_0_0_1px_var(--color-gold)]"
        style={{
          background: "rgba(245,242,235,0.03)",
          border: "1px solid rgba(245,242,235,0.08)",
        }}
      />
    </div>
  );
}

function BoxTextarea({ label, name, required, rows = 5 }: { label: string; name: string; required?: boolean; rows?: number }) {
  return (
    <div className="relative flex flex-col group">
      <label className="font-body text-caption text-[var(--color-off-white)] opacity-40 mb-2">{label}</label>
      <textarea
        name={name}
        required={required}
        rows={rows}
        placeholder=" "
        className="w-full font-body text-body-lg px-4 py-3 outline-none text-[var(--color-off-white)] resize-none transition-all duration-300
                   focus:border-[var(--color-gold)] focus:shadow-[0_0_0_1px_var(--color-gold)]"
        style={{
          background: "rgba(245,242,235,0.03)",
          border: "1px solid rgba(245,242,235,0.08)",
        }}
      />
    </div>
  );
}

function RadioGroup({ name, label, options, required }: { name: string; label: string; options: string[]; required?: boolean }) {
  return (
    <div className="flex flex-col gap-3">
      <label className="font-body text-caption text-[var(--color-off-white)] opacity-40">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <label key={opt} className="cursor-pointer group select-none transition-transform duration-300 active:scale-95">
            <input type="radio" name={name} value={opt} required={required} className="peer sr-only" />
            <div className="font-body text-caption px-4 py-3 transition-all duration-300 text-[var(--color-off-white)]
                            group-hover:border-[rgba(245,242,235,0.25)]
                            peer-checked:!border-[var(--color-gold)] peer-checked:bg-[var(--color-gold)] peer-checked:text-[var(--color-black)]"
              style={{ background: "rgba(245,242,235,0.03)", border: "1px solid rgba(245,242,235,0.08)" }}>
              {opt}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

function CheckboxGroup({ name, label, options }: { name: string; label: string; options: string[] }) {
  return (
    <div className="flex flex-col gap-3">
      <label className="font-body text-caption text-[var(--color-off-white)] opacity-40">{label}</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {options.map((opt) => (
          <label key={opt} className="cursor-pointer group select-none h-full transition-transform duration-300 active:scale-95">
            <input type="checkbox" name={name} value={opt} className="peer sr-only" />
            <div className="flex items-center gap-3 font-body text-caption px-4 py-3 transition-all duration-300
                            text-[var(--color-off-white)]
                            group-hover:border-[rgba(245,242,235,0.25)]
                            peer-checked:!border-[var(--color-gold)] peer-checked:bg-[var(--color-gold)] peer-checked:text-[var(--color-black)]
                            peer-checked:[&_.checkmark]:opacity-100 peer-checked:[&_.checkmark]:scale-100 h-full"
              style={{ background: "rgba(245,242,235,0.03)", border: "1px solid rgba(245,242,235,0.08)" }}>
              <div className="checkmark flex-shrink-0 opacity-0 scale-50 transition-all duration-300">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span>{opt}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
