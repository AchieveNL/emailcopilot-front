"use client";

// ryan awex - 02/06/2026

import React, { useEffect, useMemo, useRef, ReactNode, RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollFloatProps {
  children: ReactNode;
  scrollContainerRef?: RefObject<HTMLElement>;
  containerClassName?: string;
  textClassName?: string;
  animationDuration?: number;
  ease?: string;
  scrollStart?: string;
  scrollEnd?: string;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";
  highlightWords?: string[];
  style?: React.CSSProperties;
}

const ScrollFloat: React.FC<ScrollFloatProps> = ({
  children,
  scrollContainerRef,
  containerClassName = "",
  textClassName = "",
  animationDuration = 1,
  ease = "back.inOut(2)",
  scrollStart = "center bottom+=50%",
  scrollEnd = "bottom bottom-=40%",
  stagger = 0.03,
  as = "h2",
  highlightWords = [],
  style,
}) => {
  const containerRef = useRef<HTMLElement>(null);

  const splitText = useMemo(() => {
    const text = typeof children === "string" ? children : "";
    // Split by space, preserving whitespace
    const words = text.split(/(\s+)/);
    let charIndex = 0;
    const elements: React.ReactNode[] = [];

    words.forEach((word, wordIdx) => {
      if (/^\s+$/.test(word)) {
        word.split("").forEach((spaceChar) => {
          const idx = charIndex++;
          elements.push(
            <span className="inline-block word" key={`char-${idx}`}>
              {"\u00A0"}
            </span>,
          );
        });
        return;
      }

      // Check if this word matches any word in highlightWords (ignoring case & punctuation)
      const cleanWord = word
        .toLowerCase()
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
      const shouldHighlight = highlightWords.some(
        (h) =>
          cleanWord ===
          h.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ""),
      );

      word.split("").forEach((char) => {
        const idx = charIndex++;
        elements.push(
          <span
            className={`inline-block word ${
              shouldHighlight ? "text-transparent bg-clip-text" : ""
            }`}
            style={
              shouldHighlight
                ? {
                    WebkitBackgroundClip: "text",
                    backgroundImage:
                      "linear-gradient(to right, #4f46e5, #2563eb, #06b6d4, #4f46e5)",
                    backgroundSize: "300% 100%",
                    animation: "scrollFloatShimmer 6s linear infinite",
                  }
                : {}
            }
            key={`char-${idx}`}
          >
            {char}
          </span>,
        );
      });
    });

    return elements;
  }, [children, highlightWords]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller =
      scrollContainerRef && scrollContainerRef.current
        ? scrollContainerRef.current
        : window;

    const charElements = el.querySelectorAll(".word");

    const anim = gsap.fromTo(
      charElements,
      {
        willChange: "opacity, transform",
        opacity: 0,
        yPercent: 120,
        scaleY: 2.3,
        scaleX: 0.7,
        transformOrigin: "50% 0%",
      },
      {
        duration: animationDuration,
        ease: ease,
        opacity: 1,
        yPercent: 0,
        scaleY: 1,
        scaleX: 1,
        stagger: stagger,
        scrollTrigger: {
          trigger: el,
          scroller,
          start: scrollStart,
          end: scrollEnd,
          scrub: true,
        },
      },
    );

    return () => {
      anim.kill();
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === el) {
          t.kill();
        }
      });
    };
  }, [
    scrollContainerRef,
    animationDuration,
    ease,
    scrollStart,
    scrollEnd,
    stagger,
    children,
    highlightWords,
  ]);

  const Tag = as;

  const hasTextSize = textClassName
    .split(" ")
    .some((cls) => cls.startsWith("text-"));
  const defaultSizeClass = hasTextSize ? "" : "text-[clamp(1.6rem,4vw,3rem)]";

  return (
    <>
      <style>{`
        @keyframes scrollFloatShimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
      `}</style>
      <Tag
        ref={containerRef as any}
        className={`my-5 overflow-hidden ${containerClassName}`}
        style={style}
      >
        <span
          className={`inline-block leading-[1.5] ${defaultSizeClass} ${textClassName}`}
        >
          {splitText}
        </span>
      </Tag>
    </>
  );
};

export default ScrollFloat;
