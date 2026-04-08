import { useEffect, useState } from "react";

interface TypingTextProps {
  text: string;
  speed?: number;
  className?: string;
  prefix?: string;
}

const TypingText = ({ text, speed = 80, className = "", prefix = "> " }: TypingTextProps) => {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    setDisplayed("");
    setDone(false);
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        setDone(true);
        clearInterval(interval);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span className={`font-mono-terminal ${className}`}>
      <span className="text-neon-green">{prefix}</span>
      {displayed}
      <span className={`inline-block w-2 h-5 bg-primary ml-1 align-middle ${done ? "animate-blink" : ""}`} />
    </span>
  );
};

export default TypingText;
