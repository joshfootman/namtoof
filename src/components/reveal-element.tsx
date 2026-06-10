import { useEffect, useRef } from "react";
import gsap from "gsap";
import {
  createRevealTimeline,
  REVEAL_THRESHOLD,
} from "../lib/reveal-animation";
import { cn } from "../lib/utils";

type RevealElementProps = React.ComponentProps<"div">;

export function RevealElement({
  className,
  children,
  style,
  ...props
}: RevealElementProps) {
  const ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const wipeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const element = ref.current;
    const content = contentRef.current;
    const wipe = wipeRef.current;

    if (!element || !content || !wipe) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(content, { autoAlpha: 1 });
      return;
    }

    const timeline = createRevealTimeline({ content, wipe });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          timeline.play();
          observer.disconnect();
        }
      },
      { threshold: REVEAL_THRESHOLD },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      timeline.kill();
    };
  }, []);

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      style={style}
      {...props}
    >
      <span
        ref={wipeRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 origin-top-right scale-0 bg-foreground motion-reduce:hidden"
      />
      <div
        ref={contentRef}
        className={cn("opacity-0", "motion-reduce:opacity-100")}
      >
        {children}
      </div>
    </div>
  );
}
