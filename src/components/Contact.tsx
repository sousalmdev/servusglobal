"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/providers/ReducedMotionProvider";
import type { Dictionary } from "@/i18n/getDictionary";

gsap.registerPlugin(ScrollTrigger);

type Pathway = "artist" | "consultation" | null;

export default function Contact({ dict }: { dict: Dictionary }) {
  const [pathway, setPathway] = useState<Pathway>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const reducedMotion = useReducedMotion();

  const pathways = [
    { key: "artist" as const, label: dict.contact.pathways.artist, desc: dict.contact.pathwaysDesc.artist },
    { key: "consultation" as const, label: dict.contact.pathways.consultation, desc: dict.contact.pathwaysDesc.consultation },
  ];

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      // Heading reveal with blur dissolve
      gsap.set(".contact-heading .hero-word", { yPercent: 110, filter: "blur(8px)" });
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

          gsap.fromTo(
            ".contact-content .pathway-card",
            { y: 60, opacity: 0, scale: 0.96 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 1.1,
              stagger: 0.12,
              ease: "expo.out",
              delay: 0.4,
            }
          );
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion || !formRef.current || !pathway) return;
    gsap.from(formRef.current.querySelectorAll(".field-anim"), {
      y: 14,
      opacity: 0,
      duration: 0.6,
      stagger: 0.05,
      ease: "expo.out",
    });
  }, [pathway, reducedMotion]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    const data = new FormData(e.currentTarget);
    const pathname = typeof window !== "undefined" ? window.location.pathname : "";
    const lang = pathname.split("/")[1] || "en";
    const payload: Record<string, any> = { pathway: pathway || "artist", lang };
    
    // Properly collect multiple checkboxes with the same name into an array
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
      className="relative px-6 md:px-12 lg:px-16"
      style={{
        paddingTop: "clamp(8rem, 16vw, 14rem)",
        paddingBottom: "clamp(8rem, 16vw, 14rem)",
      }}
    >
      {/* Heading — editorial style */}
      <div className="contact-heading mb-16 md:mb-24">
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
              {dict.contact.word1}
            </span>
          </span>
          <span className="block overflow-hidden">
            <span className="hero-word block">
              <span style={{ color: "var(--color-off-white)" }}>{dict.contact.word2}</span>
              <span
                className="serif-italic"
                style={{ color: "var(--color-gold)", fontWeight: 400 }}
              >
                {dict.contact.word3}
              </span>
            </span>
          </span>
        </h2>
      </div>

      <div className="contact-content">
        {submitted ? (
          <div
            className="max-w-2xl flex items-center gap-3 py-6 border-t"
            style={{ borderColor: "rgba(245,242,235,0.12)" }}
          >
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{
                background: "var(--color-gold)",
                boxShadow: "0 0 12px var(--color-gold)",
              }}
            />
            <span
              className="font-body text-body-lg"
              style={{ color: "var(--color-off-white)" }}
            >
              {dict.contact.successMsg}
            </span>
          </div>
        ) : !pathway ? (
          <div className="max-w-5xl">
            <span
              className="font-body text-eyebrow eyebrow mb-8 inline-block"
              style={{ color: "var(--color-off-white)", opacity: 0.4 }}
            >
              {dict.contact.pathwaysTitle}
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pathways.map((p, idx) => (
                <button
                  key={p.key}
                  onClick={() => setPathway(p.key)}
                  className="pathway-card group relative flex flex-col text-left p-8 md:p-10 transition-all duration-500 overflow-hidden cursor-pointer hover:border-[rgba(212,175,55,0.4)] hover:-translate-y-1.5"
                  style={{
                    background: "rgba(20,20,20,0.4)",
                    border: "1px solid rgba(245,242,235,0.08)",
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: "linear-gradient(135deg, rgba(212,165,65,0.12) 0%, transparent 100%)",
                    }}
                  />
                  <span className="font-body text-caption text-[var(--color-gold)] uppercase tracking-wider mb-2 inline-block opacity-80">
                    0{idx + 1} / {p.key === "artist" ? "Artist Pathway" : "Business & Executive"}
                  </span>
                  <h3
                    className="font-display mb-4 relative z-10 transition-colors duration-300 group-hover:!text-[var(--color-gold)]"
                    style={{
                      color: "var(--color-off-white)",
                      fontSize: "clamp(1.5rem, 2.5vw, 2.2rem)",
                      lineHeight: 1.1,
                      letterSpacing: "-0.02em",
                      fontWeight: 600,
                    }}
                  >
                    {p.label}
                  </h3>
                  <p
                    className="font-body text-caption relative z-10"
                    style={{ color: "var(--color-off-white)", opacity: 0.6 }}
                  >
                    {p.desc}
                  </p>
                  
                  <div className="mt-12 flex justify-end relative z-10 w-full">
                    <span
                      className="inline-flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 group-hover:bg-[var(--color-gold)] group-hover:text-black group-hover:border-[var(--color-gold)]"
                      style={{ border: "1px solid rgba(245,242,235,0.15)", color: "var(--color-off-white)" }}
                    >
                      →
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl">
            {error && (
              <div
                className="mb-8 flex items-center gap-3 py-4 px-6 border field-anim animate-fade-in"
                style={{
                  borderColor: "rgba(239, 68, 68, 0.4)",
                  background: "rgba(239, 68, 68, 0.05)",
                }}
              >
                <span
                  className="inline-block w-2.5 h-2.5 rounded-full"
                  style={{
                    background: "#ef4444",
                    boxShadow: "0 0 12px #ef4444",
                  }}
                />
                <span
                  className="font-body text-body"
                  style={{ color: "#f87171" }}
                >
                  {dict.contact.errorMsg}
                </span>
              </div>
            )}

            <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6" style={{ borderColor: "rgba(245,242,235,0.08)" }}>
              <span
                className="font-body text-eyebrow eyebrow inline-block"
                style={{ color: "var(--color-off-white)", opacity: 0.5 }}
              >
                {dict.contact.pathwaysTitle} / <span style={{ color: "var(--color-gold)", opacity: 1 }}>{pathways.find(p => p.key === pathway)?.label}</span>
              </span>
              <button
                type="button"
                onClick={() => setPathway(null)}
                className="font-body text-eyebrow eyebrow hover:text-[var(--color-gold)] transition-colors duration-300 cursor-pointer flex items-center gap-2"
                style={{ color: "var(--color-off-white)", opacity: 0.6 }}
              >
                {dict.contact.pathwaysDesc?.back || "← Change Pathway"}
              </button>
            </div>

            <ClientMultiStepForm
              pathway={pathway}
              formRef={formRef}
              loading={loading}
              onSubmit={handleSubmit}
              dict={dict}
            />
          </div>
        )}
      </div>
    </section>
  );
}

// Sub-component for Unified Multi-Step Form

function ClientMultiStepForm({
  pathway,
  formRef,
  loading,
  onSubmit,
  dict,
}: {
  pathway: "artist" | "consultation";
  formRef: React.RefObject<HTMLFormElement | null>;
  loading: boolean;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  dict: Dictionary;
}) {
  const [step, setStep] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const prevStepRef = useRef(1);

  const isArtist = pathway === "artist";

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    const form = formRef.current;
    if (form) {
      const currentStepContainer = form.querySelector(`#step-${step}`);
      if (currentStepContainer) {
        const inputs = currentStepContainer.querySelectorAll("input, textarea, select");
        let isStepValid = true;
        let firstInvalid: any = null;

        inputs.forEach((input: any) => {
          if (!input.checkValidity()) {
            isStepValid = false;
            if (!firstInvalid) firstInvalid = input;
          }
        });

        if (!isStepValid && firstInvalid) {
          firstInvalid.reportValidity();
          return;
        }
      }
    }
    
    if (containerRef.current) {
      gsap.to(containerRef.current.querySelector(`#step-${step}`), {
        opacity: 0,
        y: -10,
        duration: 0.3,
        onComplete: () => {
          setStep((s) => s + 1);
        }
      });
    } else {
      setStep((s) => s + 1);
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    if (containerRef.current) {
      gsap.to(containerRef.current.querySelector(`#step-${step}`), {
        opacity: 0,
        y: 10,
        duration: 0.3,
        onComplete: () => {
          setStep((s) => s - 1);
        }
      });
    } else {
      setStep((s) => s - 1);
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      const isForward = step > prevStepRef.current;
      prevStepRef.current = step;

      gsap.fromTo(containerRef.current.querySelector(`#step-${step}`), 
        { opacity: 0, y: isForward ? 10 : -10 },
        { opacity: 1, y: 0, duration: 0.5, ease: "expo.out" }
      );
    }
  }, [step]);

  return (
    <form ref={formRef} onSubmit={onSubmit} className="flex flex-col gap-10 bg-[rgba(245,242,235,0.02)] p-6 md:p-10 border border-[rgba(245,242,235,0.08)]">
      <div className="flex flex-col gap-3 mb-4 field-anim">
        <h3 className="font-display text-2xl md:text-3xl" style={{ color: "var(--color-gold)" }}>
          {isArtist ? dict.contact.form.titleArtist : dict.contact.form.titleConsultation}
        </h3>
        <p className="font-body text-body" style={{ color: "var(--color-off-white)", opacity: 0.6 }}>
          {isArtist ? dict.contact.form.subtitleArtist : dict.contact.form.subtitleConsultation}
        </p>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mt-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 h-1 bg-[rgba(245,242,235,0.15)] rounded-full overflow-hidden relative">
               <div className="absolute top-0 left-0 bottom-0 bg-[var(--color-gold)] transition-all duration-500" style={{ width: step >= s ? "100%" : "0%" }} />
            </div>
          ))}
        </div>
        <div className="font-body text-caption text-[var(--color-off-white)] opacity-50 mt-2">
          {step === 1 ? dict.contact.form.step1 : step === 2 ? dict.contact.form.step2 : dict.contact.form.step3}
        </div>
      </div>

      <div ref={containerRef}>
        {/* STEP 1 */}
        <div id="step-1" style={{ display: step === 1 ? "block" : "none" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InputField name="fullName" label={dict.contact.form.fullName} placeholder="" required />
            
            {isArtist ? (
              <InputField name="artistName" label={dict.contact.form.artistName} placeholder="" required />
            ) : (
              <InputField name="companyName" label={dict.contact.form.companyName} placeholder="" required />
            )}

            <InputField name="email" label={dict.contact.form.email} type="email" placeholder="" required />
            <InputField name="phone" label={dict.contact.form.phone} type="tel" placeholder="" required />
            
            {isArtist ? (
              <InputField name="instagram" label={dict.contact.form.instagram} placeholder="" required />
            ) : (
              <InputField name="role" label={dict.contact.form.role} placeholder="" required />
            )}

            <InputField name="links" label={dict.contact.form.links} placeholder="" required />
          </div>
        </div>

        {/* STEP 2 */}
        <div id="step-2" style={{ display: step === 2 ? "block" : "none" }}>
          <div className="flex flex-col gap-8">
            <RadioGroup
              name="contactMethod"
              label={dict.contact.form.contactMethod}
              options={isArtist ? ["Email", "Phone", "Instagram DM"] : ["Email", "Phone", "Virtual Meeting (Zoom / Meet)"]}
              required
            />

            <RadioGroup
              name="bestTime"
              label={dict.contact.form.bestTime}
              options={["Morning (8am – 12pm)", "Afternoon (12pm – 5pm)", "Evening (5pm – 9pm)"]}
              required
            />

            <div>
              <InputField name="country" label={dict.contact.form.country} placeholder="" required />
            </div>
          </div>
        </div>

        {/* STEP 3 */}
        <div id="step-3" style={{ display: step === 3 ? "block" : "none" }}>
          <div className="flex flex-col gap-8">
            {isArtist ? (
              <>
                <CheckboxGroup
                  name="services"
                  label={dict.contact.form.servicesReq}
                  options={[
                    "Streaming Campaigns",
                    "Press & Exposure",
                    "Consultations",
                    "Creative Services",
                    "Visuals & Media",
                    "Rollout Strategies",
                  ]}
                />

                <CheckboxGroup
                  name="platform"
                  label={dict.contact.form.platform}
                  options={["Spotify", "Apple Music", "YouTube", "SoundCloud", "Instagram", "Other"]}
                />

                <RadioGroup
                  name="budget"
                  label={dict.contact.form.budget}
                  options={["$200 – $500", "$500 – $1,000", "$1,000 – $2,500", "$2,500+"]}
                  required
                />

                <div className="flex flex-col gap-8">
                  <TextareaField name="shortTermGoals" label={dict.contact.form.shortTerm} placeholder="" required />
                  <TextareaField name="longTermVision" label={dict.contact.form.longTerm} placeholder="" required />
                </div>
              </>
            ) : (
              <>
                <CheckboxGroup
                  name="services"
                  label={dict.contact.form.servicesConsultation}
                  options={[
                    "Executive A&R Consulting",
                    "Distribution Infrastructure",
                    "Label Services & Partnerships",
                    "Brand Strategy & Sync",
                    "Tour & Event Operations",
                    "General Business Consultation",
                  ]}
                />

                <RadioGroup
                  name="timeline"
                  label={dict.contact.form.timeline}
                  options={["Immediate / This Month", "Next Quarter (1–3 mos)", "6+ Months", "Exploratory / Flexible"]}
                  required
                />

                <RadioGroup
                  name="budget"
                  label={dict.contact.form.budgetConsultation}
                  options={["Under $1,000", "$1,000 – $5,000", "$5,000 – $20,000", "$20,000+"]}
                  required
                />

                <div className="flex flex-col gap-8">
                  <TextareaField name="shortTermGoals" label={dict.contact.form.shortTermConsultation} placeholder="" required />
                  <TextareaField name="longTermVision" label={dict.contact.form.longTermConsultation} placeholder="" required />
                </div>
              </>
            )}

            <label className="group flex items-start gap-4 cursor-pointer mt-4 max-w-xl">
              <div className="relative flex-shrink-0 w-6 h-6 border border-[rgba(245,242,235,0.3)] transition-colors group-hover:border-[var(--color-gold)] mt-0.5">
                <input type="checkbox" name="consent" required className="peer sr-only" />
                <div className="absolute inset-0 bg-[var(--color-gold)] scale-0 peer-checked:scale-100 transition-transform origin-center" />
              </div>
              <div className="flex flex-col">
                <span className="font-body text-body-lg text-[var(--color-off-white)]">{dict.contact.form.consentTitle}</span>
                <span className="font-body text-caption text-[var(--color-off-white)] opacity-50 mt-1">
                  {dict.contact.form.consentDesc}
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4 mt-6">
        {step > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="font-body text-eyebrow eyebrow px-6 py-4 cursor-pointer transition-all duration-300 hover:opacity-80"
            style={{
              color: "var(--color-off-white)",
              border: "1px solid rgba(245,242,235,0.15)",
            }}
          >
            {dict.contact.form.back}
          </button>
        )}
        
        {step < 3 ? (
          <button
            type="button"
            onClick={handleNext}
            className="font-body text-eyebrow eyebrow inline-flex items-center gap-3 px-8 py-4 cursor-pointer transition-all duration-300 hover:opacity-80"
            style={{
              color: "var(--color-black)",
              background: "var(--color-gold)",
              fontWeight: 700,
            }}
          >
            {dict.contact.form.next}
            <span aria-hidden>→</span>
          </button>
        ) : (
          <button
            type="submit"
            disabled={loading}
            className="font-body text-eyebrow eyebrow inline-flex items-center gap-3 px-8 py-4 cursor-pointer disabled:opacity-50 transition-all duration-300 hover:opacity-80"
            style={{
              color: "var(--color-black)",
              background: "var(--color-gold)",
              fontWeight: 700,
            }}
          >
            {loading ? dict.contact.form.submitting : dict.contact.form.submit}
            <span aria-hidden>→</span>
          </button>
        )}
      </div>
    </form>
  );
}

function InputField({ label, name, required, type = "text", ...props }: any) {
  return (
    <div className="relative flex flex-col pt-6 group">
      <input
        name={name}
        type={type}
        required={required}
        placeholder=" "
        {...props}
        className="peer w-full bg-transparent font-body text-body-lg py-2 outline-none border-b border-[rgba(245,242,235,0.15)] focus:border-[var(--color-gold)] text-[var(--color-off-white)] transition-colors duration-300"
      />
      <label
        className="absolute left-0 transition-all duration-300 pointer-events-none font-body
                   top-1 text-xs opacity-70 text-[var(--color-gold)]
                   peer-placeholder-shown:top-7 peer-placeholder-shown:text-body-lg peer-placeholder-shown:text-[var(--color-off-white)] peer-placeholder-shown:opacity-40
                   peer-focus:top-1 peer-focus:text-xs peer-focus:text-[var(--color-gold)] peer-focus:opacity-100"
      >
        {label}
      </label>
    </div>
  );
}

function TextareaField({ label, name, required, rows = 4, ...props }: any) {
  return (
    <div className="relative flex flex-col pt-6 group">
      <textarea
        name={name}
        required={required}
        rows={rows}
        placeholder=" "
        {...props}
        className="peer w-full bg-transparent font-body text-body-lg py-2 outline-none border-b border-[rgba(245,242,235,0.15)] focus:border-[var(--color-gold)] text-[var(--color-off-white)] resize-none transition-colors duration-300"
      />
      <label
        className="absolute left-0 transition-all duration-300 pointer-events-none font-body
                   top-1 text-xs opacity-70 text-[var(--color-gold)]
                   peer-placeholder-shown:top-7 peer-placeholder-shown:text-body-lg peer-placeholder-shown:text-[var(--color-off-white)] peer-placeholder-shown:opacity-40
                   peer-focus:top-1 peer-focus:text-xs peer-focus:text-[var(--color-gold)] peer-focus:opacity-100"
      >
        {label}
      </label>
    </div>
  );
}

function RadioGroup({ name, label, options, required, className = "" }: any) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <label className="font-body text-caption text-[var(--color-off-white)] opacity-70">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt: string) => (
          <label key={opt} className="cursor-pointer group select-none transition-transform duration-300 active:scale-95">
            <input type="radio" name={name} value={opt} required={required} className="peer sr-only" />
            <div className="font-body text-caption px-4 py-3 transition-all duration-300 border border-[rgba(245,242,235,0.15)] text-[var(--color-off-white)] group-hover:border-[rgba(245,242,235,0.4)] peer-checked:!border-[var(--color-gold)] peer-checked:bg-[var(--color-gold)] peer-checked:text-[var(--color-black)]">
              {opt}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

function CheckboxGroup({ name, label, options, className = "" }: any) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <label className="font-body text-caption text-[var(--color-off-white)] opacity-70">{label}</label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {options.map((opt: string) => (
          <label key={opt} className="cursor-pointer group select-none h-full transition-transform duration-300 active:scale-95">
            <input type="checkbox" name={name} value={opt} className="peer sr-only" />
            <div className="flex items-start gap-3 font-body text-caption px-4 py-3 transition-all duration-300 border border-[rgba(245,242,235,0.15)] text-[var(--color-off-white)] group-hover:border-[rgba(245,242,235,0.4)] peer-checked:!border-[var(--color-gold)] peer-checked:bg-[var(--color-gold)] peer-checked:text-[var(--color-black)] peer-checked:[&_.checkmark]:opacity-100 peer-checked:[&_.checkmark]:scale-100 h-full">
              {/* Checkmark icon with scale and opacity animations */}
              <div className="checkmark mt-0.5 flex-shrink-0 opacity-0 scale-50 transition-all duration-300">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
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
