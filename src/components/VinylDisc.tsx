/**
 * Reusable vinyl-disc graphic with concentric grooves, plastic sheen,
 * gold center label and spindle hole. Extracted from the 3× duplicated
 * markup in Releases.tsx.
 */
export default function VinylDisc({ className = "" }: { className?: string }) {
  return (
    <div className={`vinyl-disc absolute inset-0 rounded-full ${className}`}>
      {/* Concentric grooves */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "repeating-radial-gradient(circle at 50% 50%, #181818 0px, #1a1a1a 1px, #0c0c0c 2px, #161616 3px)",
        }}
      />
      {/* Plastic sheen */}
      <div
        className="absolute inset-0 rounded-full opacity-25"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 35%, transparent 65%, rgba(255,255,255,0.06) 100%)",
        }}
      />
      {/* Center label */}
      <div
        className="absolute rounded-full"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: "32%",
          aspectRatio: "1/1",
          background: "var(--color-gold)",
          zIndex: 5,
        }}
      />
      {/* Spindle hole */}
      <div
        className="absolute rounded-full"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
          width: "2.5%",
          aspectRatio: "1/1",
          background: "var(--color-black)",
          zIndex: 6,
        }}
      />
    </div>
  );
}
