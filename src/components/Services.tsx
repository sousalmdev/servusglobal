"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/providers/ReducedMotionProvider";

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    number: "01",
    title: "Release Strategy",
    description:
      "Release planning, timing and positioning. Every drop has a plan behind it.",
  },
  {
    number: "02",
    title: "Brand Development",
    description:
      "Visual identity, story, audience growth. Building the artist's world without flattening the music.",
  },
  {
    number: "03",
    title: "Tour Management",
    description:
      "Routing, logistics, contracts. From club circuits up to festival slots.",
  },
  {
    number: "04",
    title: "A&R",
    description:
      "Artist discovery, creative direction, repertoire. Built around what the artist actually wants to make.",
  },
  {
    number: "05",
    title: "Global Distribution",
    description:
      "DSPs, physical, sync-ready masters. All territories, all formats.",
  },
  {
    number: "06",
    title: "Sync & Licensing",
    description:
      "Film, TV, games, ads. Placements that pay and travel.",
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      // Heading reveal
      gsap.set(".services-heading .hero-word", { yPercent: 110 });
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 75%",
        once: true,
        onEnter: () => {
          gsap.to(".services-heading .hero-word", {
            yPercent: 0,
            duration: 1.4,
            stagger: 0.1,
            ease: "expo.out",
          });
        },
      });

      // Cards stagger
      gsap.from(".service-card", {
        y: 60,
        opacity: 0,
        duration: 1,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".services-grid",
          start: "top 80%",
          once: true,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative px-6 md:px-12 lg:px-16"
      style={{
        paddingTop: "clamp(8rem, 16vw, 14rem)",
        paddingBottom: "clamp(8rem, 16vw, 14rem)",
      }}
    >
      {/* Heading */}
      <div className="services-heading mb-16 md:mb-24">
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
            <span className="hero-word block" style={{ color: "var(--color-off-white)" }}>
              OUR
            </span>
          </span>
          <span className="block overflow-hidden">
            <span className="hero-word block serif-italic" style={{ color: "var(--color-gold)" }}>
              services
            </span>
          </span>
        </h2>
      </div>

      {/* Services Grid */}
      <div className="services-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service, i) => (
          <div
            key={service.number}
            className="service-card group p-8 md:p-10"
            style={{
              borderTop: "1px solid rgba(245, 242, 235, 0.08)",
            }}
          >
            {/* Number */}
            <span
              className="font-body text-eyebrow eyebrow inline-block mb-6"
              style={{ color: "var(--color-gold)", opacity: 0.6 }}
            >
              {service.number}
            </span>

            {/* Title */}
            <h3
              className="font-display mb-4 transition-colors duration-500 group-hover:!text-[var(--color-gold)]"
              style={{
                color: "var(--color-off-white)",
                fontSize: "clamp(1.5rem, 2.5vw, 2.25rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                fontWeight: 600,
              }}
            >
              {service.title}
            </h3>

            {/* Description */}
            <p
              className="font-body text-pretty"
              style={{
                color: "var(--color-off-white)",
                opacity: 0.45,
                fontSize: "0.9375rem",
                lineHeight: 1.65,
              }}
            >
              {service.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
