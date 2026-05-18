/**
 * Animated hero headline with staggered word reveal. The word "actually" is
 * set in italic Fraunces and tinted with the brand accent — the single
 * editorial flourish that anchors the rest of the site's voice. CSS-driven
 * so it doesn't depend on a JS animation library to paint.
 */
export function HeroHeadline() {
  const segments: { text: string; italic?: boolean }[] = [
    { text: "How" },
    { text: "your" },
    { text: "internet" },
    { text: "actually", italic: true },
    { text: "works" },
  ];
  return (
    <>
      <style>{`
        @keyframes hero-reveal {
          0% { opacity: 0; transform: translateY(0.4em); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .hero-word {
          display: inline-block;
          vertical-align: top;
          margin-right: 0.22em;
          opacity: 0;
          animation: hero-reveal 0.85s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .hero-word:last-child { margin-right: 0; }
        @media (prefers-reduced-motion: reduce) {
          .hero-word { animation: none; opacity: 1; }
        }
      `}</style>
      <h1 className="display text-balance text-[clamp(40px,7.8vw,88px)] font-medium leading-[1.02] text-[var(--fg)]">
        {segments.map((s, i) => (
          <span
            key={i}
            className="hero-word"
            style={{ animationDelay: `${0.1 + i * 0.08}s` }}
          >
            {s.italic ? (
              <em className="font-light italic text-[var(--accent)]">
                {s.text}
              </em>
            ) : (
              s.text
            )}
          </span>
        ))}
      </h1>
    </>
  );
}
