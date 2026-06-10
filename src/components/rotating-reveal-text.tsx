import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import {
  createRevealTimeline,
  ROTATING_REVEAL_INTERVAL,
} from "../lib/reveal-animation";
import { cn } from "../lib/utils";

type RotatingRevealTextProps = {
  items: string[];
  className?: string;
};

export function RotatingRevealText({
  items,
  className,
}: RotatingRevealTextProps) {
  const labels = useMemo(() => items.filter(Boolean), [items]);
  const indexRef = useRef(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const wipeRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const content = contentRef.current;
    const wipe = wipeRef.current;
    const text = textRef.current;

    if (labels.length === 0 || !content || !wipe || !text) {
      return;
    }

    indexRef.current = 0;
    text.textContent = labels[0] ?? "";

    if (
      labels.length < 2 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      gsap.set(content, { autoAlpha: 1 });
      return;
    }

    let timeline: gsap.core.Timeline | undefined;

    const runCycle = (nextIndex?: number) => {
      timeline?.kill();
      timeline = createRevealTimeline({
        content,
        wipe,
        hideContentUntilCovered: nextIndex === undefined,
        onCovered: () => {
          if (nextIndex === undefined) {
            return;
          }

          indexRef.current = nextIndex;
          text.textContent = labels[nextIndex] ?? "";
        },
      });
      timeline.play();
    };

    runCycle();

    const intervalTimer = window.setInterval(() => {
      const nextIndex = (indexRef.current + 1) % labels.length;

      runCycle(nextIndex);
    }, ROTATING_REVEAL_INTERVAL);

    return () => {
      window.clearInterval(intervalTimer);
      timeline?.kill();
    };
  }, [labels]);

  if (labels.length === 0) {
    return null;
  }

  return (
    <div className="relative grid overflow-hidden">
      {labels.map((label) => (
        <p
          aria-hidden="true"
          key={label}
          className={cn(
            "invisible col-start-1 row-start-1 text-right whitespace-nowrap",
            className,
          )}
        >
          {label}
        </p>
      ))}
      <span
        ref={wipeRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 origin-top-right scale-0 bg-foreground motion-reduce:hidden"
      />
      <div
        ref={contentRef}
        className="col-start-1 row-start-1 opacity-0 motion-reduce:opacity-100"
      >
        <p
          ref={textRef}
          className={cn("text-right whitespace-nowrap", className)}
        >
          {labels[0]}
        </p>
      </div>
    </div>
  );
}
