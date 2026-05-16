"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/providers/ReducedMotionProvider";

gsap.registerPlugin(ScrollTrigger);

const pathwaysKeys = ["artist", "investor", "other"] as const;
type Pathway = typeof pathwaysKeys[number] | null;

export default function Contact({ dict }: { dict: any }) {
  const pathways = [
    { key: "artist" as const, label: dict.contact.pathways.artist },
    { key: "investor" as const, label: dict.contact.pathways.investor },
    { key: "other" as const, label: dict.contact.pathways.other },
  ];
  const [pathway, setPathway] = useState<Pathway>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      // Heading reveal
      gsap.set(".contact-heading .hero-word", { yPercent: 110 });
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        once: true,
        onEnter: () => {
          gsap.to(".contact-heading .hero-word", {
            yPercent: 0,
            duration: 1.4,
            stagger: 0.1,
            ease: "expo.out",
          });
          gsap.from(".contact-content", {
            y: 40,
            opacity: 0,
            duration: 1,
            ease: "expo.out",
            delay: 0.4,
          });
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
    const data = new FormData(e.currentTarget);
    const payload: Record<string, any> = { pathway };
    
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
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {}
    setSubmitted(true);
    setLoading(false);
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {pathways.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPathway(p.key)}
                  className="group relative flex flex-col text-left p-8 md:p-10 transition-all duration-500 overflow-hidden cursor-pointer"
                  style={{
                    background: "rgba(20,20,20,0.4)",
                    border: "1px solid rgba(245,242,235,0.08)",
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: "linear-gradient(135deg, rgba(212,165,65,0.1) 0%, transparent 100%)",
                    }}
                  />
                  <h3
                    className="font-display mb-4 relative z-10 transition-colors duration-300 group-hover:!text-[var(--color-gold)]"
                    style={{
                      color: "var(--color-off-white)",
                      fontSize: "clamp(1.5rem, 2vw, 2rem)",
                      lineHeight: 1.1,
                      letterSpacing: "-0.02em",
                      fontWeight: 600,
                    }}
                  >
                    {p.label}
                  </h3>
                  <p
                    className="font-body text-caption relative z-10"
                    style={{ color: "var(--color-off-white)", opacity: 0.5 }}
                  >
                    {dict.contact.pathwaysDesc?.[p.key]}
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
            <div className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <span
                className="font-body text-eyebrow eyebrow inline-block"
                style={{ color: "var(--color-off-white)", opacity: 0.4 }}
              >
                {dict.contact.pathwaysTitle} / <span style={{ color: "var(--color-gold)", opacity: 1 }}>{pathways.find(p => p.key === pathway)?.label}</span>
              </span>
              <button
                onClick={() => setPathway(null)}
                className="font-body text-eyebrow eyebrow hover:text-[var(--color-gold)] transition-colors duration-300 cursor-pointer flex items-center gap-2"
                style={{ color: "var(--color-off-white)", opacity: 0.6 }}
              >
                {dict.contact.pathwaysDesc?.back || "← Change Option"}
              </button>
            </div>

            {pathway === "artist" && (
              <ClientOnboardingForm
                formRef={formRef}
                loading={loading}
                onSubmit={handleSubmit}
                dict={dict}
              />
            )}

            {(pathway === "investor" || pathway === "other") && (
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="flex flex-col gap-8"
              >
                <input
                  name="name"
                  required
                  placeholder={dict.contact.form.name}
                  className="field-anim w-full bg-transparent font-body text-body-lg py-3 outline-none placeholder:opacity-30 transition-colors"
                  style={{
                    color: "var(--color-off-white)",
                    borderBottom: "1px solid rgba(245,242,235,0.15)",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderBottomColor = "var(--color-gold)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderBottomColor =
                      "rgba(245,242,235,0.15)")
                  }
                />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder={dict.contact.form.email}
                  className="field-anim w-full bg-transparent font-body text-body-lg py-3 outline-none placeholder:opacity-30 transition-colors"
                  style={{
                    color: "var(--color-off-white)",
                    borderBottom: "1px solid rgba(245,242,235,0.15)",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderBottomColor = "var(--color-gold)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderBottomColor =
                      "rgba(245,242,235,0.15)")
                  }
                />
                <textarea
                  name="message"
                  required
                  placeholder={
                    pathway === "investor"
                      ? dict.contact.form.messageInvestor
                      : dict.contact.form.messageOther
                  }
                  rows={4}
                  className="field-anim w-full bg-transparent font-body text-body-lg py-3 outline-none placeholder:opacity-30 resize-none transition-colors"
                  style={{
                    color: "var(--color-off-white)",
                    borderBottom: "1px solid rgba(245,242,235,0.15)",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderBottomColor = "var(--color-gold)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderBottomColor =
                      "rgba(245,242,235,0.15)")
                  }
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="field-anim self-start font-body text-eyebrow eyebrow inline-flex items-center gap-3 px-8 py-4 mt-2 cursor-pointer disabled:opacity-50 transition-all duration-300"
                  style={{
                    color: "var(--color-black)",
                    background: "var(--color-gold)",
                    fontWeight: 700,
                  }}
                >
                  {loading ? dict.contact.form.sending : dict.contact.form.send}
                  <span aria-hidden>→</span>
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

// Sub-components for Onboarding Form

function ClientOnboardingForm({ formRef, loading, onSubmit, dict }: any) {
  const [step, setStep] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    const form = formRef.current;
    if (form) {
      // Get all inputs within the current step
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
    
    // Fade out current step, then change step
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
    setStep((s) => s - 1);
  };

  useEffect(() => {
    // Animate in new step
    if (containerRef.current) {
      gsap.fromTo(containerRef.current.querySelector(`#step-${step}`), 
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.5, ease: "expo.out" }
      );
    }
  }, [step]);

  return (
    <form ref={formRef} onSubmit={onSubmit} className="flex flex-col gap-10 bg-[rgba(245,242,235,0.02)] p-6 md:p-10 border border-[rgba(245,242,235,0.08)]">
      <div className="flex flex-col gap-3 mb-4 field-anim">
        <h3 className="font-display text-2xl md:text-3xl" style={{ color: "var(--color-gold)" }}>{dict.contact.form.title}</h3>
        <p className="font-body text-body" style={{ color: "var(--color-off-white)", opacity: 0.6 }}>
          {dict.contact.form.subtitle}
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
        <div id="step-1" style={{ display: step === 1 ? "block" : "none" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <InputField name="fullName" label={dict.contact.form.fullName} placeholder="" required />
            <InputField name="artistName" label={dict.contact.form.artistName} placeholder="" required />
            <InputField name="email" label={dict.contact.form.email} type="email" placeholder="" required />
            <InputField name="phone" label={dict.contact.form.phone} type="tel" placeholder="" required />
            <InputField name="instagram" label={dict.contact.form.instagram} placeholder="" required />
            <InputField name="links" label={dict.contact.form.links} placeholder="" required />
          </div>
        </div>

        <div id="step-2" style={{ display: step === 2 ? "block" : "none" }}>
          <div className="flex flex-col gap-8">
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

            <div className="">
              <InputField name="country" label={dict.contact.form.country} placeholder="" required />
            </div>
          </div>
        </div>

        <div id="step-3" style={{ display: step === 3 ? "block" : "none" }}>
          <div className="flex flex-col gap-8">
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

            <RadioGroup
              name="platform"
              label={dict.contact.form.platform}
              options={["Spotify", "Apple Music", "YouTube", "SoundCloud", "Instagram", "Other"]}
              required
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

function InputField({ label, ...props }: any) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-body text-caption text-[var(--color-off-white)] opacity-70">{label}</label>
      <input
        {...props}
        className="w-full bg-transparent font-body text-body-lg py-2 outline-none placeholder:opacity-30 transition-colors"
        style={{
          color: "var(--color-off-white)",
          borderBottom: "1px solid rgba(245,242,235,0.15)",
        }}
        onFocus={(e) => (e.target.style.borderBottomColor = "var(--color-gold)")}
        onBlur={(e) => (e.target.style.borderBottomColor = "rgba(245,242,235,0.15)")}
      />
    </div>
  );
}

function TextareaField({ label, ...props }: any) {
  return (
    <div className="flex flex-col gap-2">
      <label className="font-body text-caption text-[var(--color-off-white)] opacity-70">{label}</label>
      <textarea
        {...props}
        rows={4}
        className="w-full bg-transparent font-body text-body-lg py-2 outline-none placeholder:opacity-30 resize-none transition-colors"
        style={{
          color: "var(--color-off-white)",
          borderBottom: "1px solid rgba(245,242,235,0.15)",
        }}
        onFocus={(e) => (e.target.style.borderBottomColor = "var(--color-gold)")}
        onBlur={(e) => (e.target.style.borderBottomColor = "rgba(245,242,235,0.15)")}
      />
    </div>
  );
}

function RadioGroup({ name, label, options, required, className = "" }: any) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <label className="font-body text-caption text-[var(--color-off-white)] opacity-70">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((opt: string) => (
          <label key={opt} className="cursor-pointer group select-none">
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
          <label key={opt} className="cursor-pointer group select-none h-full">
            <input type="checkbox" name={name} value={opt} className="peer sr-only" />
            <div className="flex items-start gap-3 font-body text-caption px-4 py-3 transition-all duration-300 border border-[rgba(245,242,235,0.15)] text-[var(--color-off-white)] group-hover:border-[rgba(245,242,235,0.4)] peer-checked:!border-[var(--color-gold)] peer-checked:bg-[var(--color-gold)] peer-checked:text-[var(--color-black)] h-full">
              {/* Checkmark icon for extra visual clarity */}
              <div className="mt-0.5 flex-shrink-0 opacity-0 peer-checked:opacity-100 transition-opacity">
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
