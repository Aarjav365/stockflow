"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

function stripTrailingPunctuation(word: string) {
  return word.replace(/[,;.:!?]+$/, "");
}

type BlurTextProps = {
  text: string;
  className?: string;
  /** Matched case-insensitively after stripping trailing punctuation on each token. */
  accentWord?: string;
  accentClassName?: string;
};

export function BlurText({
  text,
  className,
  accentWord,
  accentClassName,
}: BlurTextProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);
  const [active, setActive] = useState(false);
  const words = text.split(" ");
  const accentNorm = accentWord?.trim().toLowerCase();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -5% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <h1
      ref={containerRef}
      className={cn(
        "flex max-w-5xl flex-wrap justify-center gap-x-[0.2em] gap-y-1",
        className
      )}
    >
      {words.map((word, i) => {
        const isAccent =
          accentNorm !== undefined &&
          accentNorm.length > 0 &&
          stripTrailingPunctuation(word).toLowerCase() === accentNorm;

        return (
          <motion.span
            key={`${word}-${i}`}
            className={cn(
              "inline-block",
              isAccent &&
                (accentClassName ?? "text-gradient-aurora not-italic")
            )}
            initial={{
              filter: "blur(10px)",
              opacity: 0,
              y: 50,
            }}
            animate={
              active
                ? {
                    filter: ["blur(10px)", "blur(5px)", "blur(0px)"],
                    opacity: [0, 0.5, 1],
                    y: isAccent ? [50, -10, 0] : [50, -5, 0],
                  }
                : {}
            }
            transition={{
              duration: isAccent ? 0.88 : 0.7,
              times: [0, 0.5, 1],
              delay: i * 0.1,
              ease: "easeOut",
            }}
          >
            {word}
          </motion.span>
        );
      })}
    </h1>
  );
}
