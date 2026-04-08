import { useEffect, useState } from "react";

interface GlitchTextProps {
  text: string;
  className?: string;
}

const GlitchText = ({ text, className = "" }: GlitchTextProps) => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className={`relative inline-block ${className}`}>
      <span className="relative z-10">{text}</span>
      {isGlitching && (
        <>
          <span
            className="absolute inset-0 z-20"
            style={{
              color: "hsl(195 100% 50%)",
              animation: "glitch-1 0.2s linear",
              clipPath: "inset(0 0 88% 0)",
            }}
          >
            {text}
          </span>
          <span
            className="absolute inset-0 z-20"
            style={{
              color: "hsl(0 85% 55%)",
              animation: "glitch-2 0.2s linear",
              clipPath: "inset(50% 0 30% 0)",
            }}
          >
            {text}
          </span>
        </>
      )}
    </span>
  );
};

export default GlitchText;
