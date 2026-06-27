import React from "react";
import { cn, usePrefersReducedMotion } from "../lib/utils";

type RoleTickerProps = Omit<React.ComponentProps<"p">, "children"> & {
  roles: string[];
  intervalMs?: number;
};

export function RoleTicker({
  className,
  roles,
  intervalMs = 2600,
  ...props
}: RoleTickerProps) {
  const [index, setIndex] = React.useState(0);
  const [nextIndex, setNextIndex] = React.useState(1);
  const [animating, setAnimating] = React.useState(false);
  const [width, setWidth] = React.useState<number | null>(null);
  const currentMeasureRef = React.useRef<HTMLSpanElement>(null);
  const nextMeasureRef = React.useRef<HTMLSpanElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  React.useEffect(() => {
    if (prefersReducedMotion || roles.length < 2) {
      setIndex(0);
      setNextIndex(1);
      setAnimating(false);
      return;
    }

    if (animating) return;

    const interval = window.setInterval(() => {
      setNextIndex((index + 1) % roles.length);
      setAnimating(true);
    }, intervalMs);

    return () => window.clearInterval(interval);
  }, [animating, index, intervalMs, prefersReducedMotion, roles.length]);

  const visibleRole = roles[index] ?? roles[0] ?? "";
  const nextRole = roles[nextIndex] ?? roles[0] ?? "";

  React.useLayoutEffect(() => {
    const measureElement = animating
      ? nextMeasureRef.current
      : currentMeasureRef.current;

    if (!measureElement) return;
    setWidth(measureElement.offsetWidth);
  }, [animating, nextRole, visibleRole]);

  const handleTransitionEnd = (
    event: React.TransitionEvent<HTMLSpanElement>,
  ) => {
    if (event.propertyName !== "transform") return;

    setIndex(nextIndex);
    setNextIndex((nextIndex + 1) % roles.length);
    setAnimating(false);
  };

  return (
    <p
      aria-label={visibleRole}
      data-animating={animating}
      className={cn("group inline-flex items-baseline leading-none", className)}
      {...props}
    >
      <span
        aria-hidden="true"
        className="inline-block h-[1em] translate-y-[-0.16em] overflow-hidden leading-none opacity-100 transition-opacity duration-240 group-data-[animating=true]:opacity-0"
      >
        [
      </span>
      <span
        className="relative inline-block h-[1em] overflow-hidden leading-none transition-[width] duration-480 ease-out motion-reduce:transition-none"
        style={{
          width: width == null ? undefined : `${width}px`,
        }}
      >
        <span
          ref={currentMeasureRef}
          aria-hidden="true"
          className="invisible absolute top-0 left-0 whitespace-nowrap"
        >
          {visibleRole}
        </span>
        <span
          ref={nextMeasureRef}
          aria-hidden="true"
          className="invisible absolute top-0 left-0 whitespace-nowrap"
        >
          {nextRole}
        </span>
        <span
          aria-hidden="true"
          className={cn(
            "absolute top-0 left-0 inline-flex flex-col motion-reduce:transition-none",
            animating
              ? "transition-transform duration-480 ease-out"
              : "transition-none",
          )}
          style={{
            transform:
              animating && !prefersReducedMotion
                ? "translateY(-1em)"
                : "translateY(0)",
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          <span className="block h-[1em] leading-none whitespace-nowrap">
            {visibleRole}
          </span>
          <span className="block h-[1em] leading-none whitespace-nowrap">
            {nextRole}
          </span>
        </span>
      </span>
      <span
        aria-hidden="true"
        className="inline-block h-[1em] translate-y-[-0.16em] overflow-hidden leading-none opacity-100 transition-opacity duration-240 group-data-[animating=true]:opacity-0"
      >
        ]
      </span>
    </p>
  );
}
