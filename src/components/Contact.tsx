"use client";

import { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/providers/ReducedMotionProvider";

gsap.registerPlugin(ScrollTrigger);

type Pathway = "artist" | "investor" | "other" | null;

const pathways = [
  { key: "artist" as const, label: "Become a Client" },
  { key: "investor" as const, label: "Partnership" },
  { key: "other" as const, label: "General" },
];

export default function Contact() {
  const [pathway, setPathway] = useState<Pathway>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [news, setNews] = useState("");
  const [newsDone, setNewsDone] = useState(false);
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

  const handleNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!news) return;
    try {
      await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: news }),
      });
    } catch {}
    setNewsDone(true);
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
              START
            </span>
          </span>
          <span className="block overflow-hidden">
            <span className="hero-word block">
              <span style={{ color: "var(--color-off-white)" }}>the right </span>
              <span
                className="serif-italic"
                style={{ color: "var(--color-gold)", fontWeight: 400 }}
              >
                conversation.
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
              Application received. Our team will review and get back to you soon.
            </span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left — direct lines */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              <span
                className="font-body text-eyebrow eyebrow mb-2"
                style={{ color: "var(--color-off-white)", opacity: 0.4 }}
              >
                Direct
              </span>
              {[
                ["A&R", "ar@servusglobal.com"],
                ["Partnerships", "partners@servusglobal.com"],
                ["Press", "press@servusglobal.com"],
              ].map(([label, addr]) => (
                <a
                  key={addr}
                  href={`mailto:${addr}`}
                  className="group flex items-baseline justify-between py-3 border-t transition-colors duration-300"
                  style={{ borderColor: "rgba(245,242,235,0.08)" }}
                >
                  <span
                    className="font-body text-caption"
                    style={{ color: "var(--color-off-white)", opacity: 0.4 }}
                  >
                    {label}
                  </span>
                  <span
                    className="font-body text-body link-underline transition-colors duration-300 group-hover:!text-[var(--color-gold)]"
                    style={{ color: "var(--color-off-white)" }}
                  >
                    {addr}
                  </span>
                </a>
              ))}
            </div>

            {/* Right — form */}
            <div className="lg:col-span-8">
              <span
                className="font-body text-eyebrow eyebrow mb-4 inline-block"
                style={{ color: "var(--color-off-white)", opacity: 0.4 }}
              >
                Select a pathway
              </span>
              <div className="flex flex-wrap gap-2 mb-10">
                {pathways.map((p) => {
                  const active = pathway === p.key;
                  return (
                    <button
                      key={p.key}
                      onClick={() => setPathway(p.key)}
                      className="font-body text-caption px-5 py-3 transition-all duration-300 cursor-pointer"
                      style={{
                        background: active ? "var(--color-gold)" : "transparent",
                        color: active
                          ? "var(--color-black)"
                          : "var(--color-off-white)",
                        border: active
                          ? "1px solid var(--color-gold)"
                          : "1px solid rgba(245,242,235,0.15)",
                      }}
                    >
                      {p.label}
                    </button>
                  );
                })}
              </div>

              {pathway === "artist" && (
                <ClientOnboardingForm
                  formRef={formRef}
                  loading={loading}
                  onSubmit={handleSubmit}
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
                    placeholder="Your name"
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
                    placeholder="Email"
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
                        ? "Tell us about your vision…"
                        : "What's on your mind?"
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
                    {loading ? "Sending…" : "Send message"}
                    <span aria-hidden>→</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Newsletter */}
        <div
          className="mt-24 md:mt-32 pt-10 border-t flex flex-col md:flex-row md:items-end md:justify-between gap-6"
          style={{ borderColor: "rgba(245,242,235,0.08)" }}
        >
          <div className="max-w-md">
            <span
              className="font-body text-eyebrow eyebrow mb-3 inline-block"
              style={{ color: "var(--color-off-white)", opacity: 0.4 }}
            >
              Newsletter
            </span>
            <p
              className="font-body text-body text-pretty"
              style={{ color: "var(--color-off-white)", opacity: 0.45 }}
            >
              Releases, signings and tour dates. A few emails a year.
            </p>
          </div>
          {newsDone ? (
            <span
              className="font-body text-body"
              style={{ color: "var(--color-gold)" }}
            >
              Subscribed.
            </span>
          ) : (
            <form
              onSubmit={handleNews}
              className="flex items-end gap-4 w-full md:w-auto md:min-w-[400px]"
            >
              <input
                type="email"
                required
                value={news}
                onChange={(e) => setNews(e.target.value)}
                placeholder="you@somewhere.com"
                className="flex-1 bg-transparent font-body text-body py-2 outline-none placeholder:opacity-30 transition-colors"
                style={{
                  color: "var(--color-off-white)",
                  borderBottom: "1px solid rgba(245,242,235,0.15)",
                }}
                onFocus={(e) =>
                  (e.target.style.borderBottomColor = "var(--color-gold)")
                }
                onBlur={(e) =>
                  (e.target.style.borderBottomColor = "rgba(245,242,235,0.15)")
                }
              />
              <button
                type="submit"
                className="font-body text-eyebrow eyebrow inline-flex items-center gap-2 py-2 cursor-pointer transition-opacity duration-300 hover:opacity-80"
                style={{ color: "var(--color-gold)" }}
              >
                Subscribe →
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

// Sub-components for Onboarding Form

function ClientOnboardingForm({ formRef, loading, onSubmit }: any) {
  return (
    <form ref={formRef} onSubmit={onSubmit} className="flex flex-col gap-10 bg-[rgba(245,242,235,0.02)] p-6 md:p-10 border border-[rgba(245,242,235,0.08)]">
      <div className="flex flex-col gap-3 mb-4 field-anim">
        <h3 className="font-display text-2xl md:text-3xl" style={{ color: "var(--color-gold)" }}>Client Onboarding & Service Request Form</h3>
        <p className="font-body text-body" style={{ color: "var(--color-off-white)", opacity: 0.6 }}>
          Welcome to Servus Global. Please complete the form below. Our team will review your needs and connect you with the right services. All information is confidential.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 field-anim">
        <InputField name="fullName" label="Full Name *" placeholder="Please enter your full legal name" required />
        <InputField name="artistName" label="Artist / Producer / Brand Name *" placeholder="If applicable" required />
        <InputField name="email" label="Email Address *" type="email" placeholder="Enter a valid email address" required />
        <InputField name="phone" label="Phone Number *" type="tel" placeholder="Include country code" required />
        <InputField name="instagram" label="Instagram Handle *" placeholder="@yourname" required />
        <InputField name="links" label="Other Links *" placeholder="Spotify, YouTube, Website, etc. (comma separated)" required />
      </div>

      <RadioGroup
        className="field-anim"
        name="contactMethod"
        label="Preferred Contact Method *"
        options={["Email", "Phone", "Instagram DM"]}
        required
      />

      <RadioGroup
        className="field-anim"
        name="bestTime"
        label="Best time to contact you *"
        options={["Morning (8am – 12pm)", "Afternoon (12pm – 5pm)", "Evening (5pm – 9pm)", "Outro"]}
        required
      />

      <div className="field-anim">
        <InputField name="country" label="Country of Residence *" placeholder="Which country are you currently based in?" required />
      </div>

      <CheckboxGroup
        className="field-anim"
        name="services"
        label="Services Required *"
        options={[
          "Streaming Campaigns (Spotify, Apple, YouTube, SoundCloud)",
          "Press & Exposure (Blogs, Genius, PR Packages)",
          "Consultations (Business, Branding, Strategy)",
          "Creative Services (Songwriting, Executive Production, A&R)",
          "Visuals & Media (Graphic Design, Video, Photography)",
          "Rollout Strategies (NDA Required – Premium Clients Only)",
        ]}
      />

      <RadioGroup
        className="field-anim"
        name="platform"
        label="Which platform do you consider most important for your growth? *"
        options={["Spotify", "Apple Music", "YouTube", "SoundCloud", "Instagram", "Other"]}
        required
      />

      <RadioGroup
        className="field-anim"
        name="budget"
        label="Budget Range *"
        options={["$200 – $500", "$500 – $1,000", "$1,000 – $2,500", "$2,500+"]}
        required
      />

      <div className="flex flex-col gap-8 field-anim">
        <TextareaField name="shortTermGoals" label="What are your short-term goals? *" placeholder="Describe the immediate results or milestones you hope to achieve." required />
        <TextareaField name="longTermVision" label="What is your long-term vision as an artist/brand? *" placeholder="Share your aspirations, brand goals, and where you see yourself in 2–5 years." required />
      </div>

      <label className="field-anim group flex items-start gap-4 cursor-pointer mt-4 max-w-xl">
        <div className="relative flex-shrink-0 w-6 h-6 border border-[rgba(245,242,235,0.3)] transition-colors group-hover:border-[var(--color-gold)] mt-0.5">
          <input type="checkbox" name="consent" required className="peer sr-only" />
          <div className="absolute inset-0 bg-[var(--color-gold)] scale-0 peer-checked:scale-100 transition-transform origin-center" />
        </div>
        <div className="flex flex-col">
          <span className="font-body text-body-lg text-[var(--color-off-white)]">Consent to Contact *</span>
          <span className="font-body text-caption text-[var(--color-off-white)] opacity-50 mt-1">
            I agree that Servus Global may review my submission and contact me regarding services.
          </span>
        </div>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="field-anim self-start font-body text-eyebrow eyebrow inline-flex items-center gap-3 px-8 py-4 mt-6 cursor-pointer disabled:opacity-50 transition-all duration-300 hover:opacity-80"
        style={{
          color: "var(--color-black)",
          background: "var(--color-gold)",
          fontWeight: 700,
        }}
      >
        {loading ? "Submitting Application…" : "Submit Application"}
        <span aria-hidden>→</span>
      </button>
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
