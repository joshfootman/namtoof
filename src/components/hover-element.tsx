import { Slot, Slottable } from "@radix-ui/react-slot";
import { type RefCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import { REVEAL_EASE } from "../lib/reveal-animation";
import { cn } from "../lib/utils";

type HoverElementProps = React.ComponentPropsWithoutRef<"button"> & {
  asChild?: boolean;
};

export function HoverElement({
  asChild = false,
  className,
  children,
  ...props
}: HoverElementProps) {
  const Comp: React.ElementType = asChild ? Slot : "button";
  const ref = useRef<HTMLElement | null>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const setRef: RefCallback<HTMLElement> = (element) => {
    ref.current = element;
  };

  useEffect(() => {
    const element = ref.current;
    const fill = fillRef.current;

    if (!element || !fill) {
      return;
    }

    gsap.set(fill, {
      scale: 0,
      transformOrigin: "top right",
    });

    const show = () => {
      gsap.killTweensOf(fill);
      gsap.set(fill, { transformOrigin: "top right" });

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(fill, { scale: 1 });
        return;
      }

      gsap.to(fill, {
        duration: 0.3,
        ease: REVEAL_EASE,
        overwrite: "auto",
        scale: 1,
      });
    };

    const hide = () => {
      gsap.killTweensOf(fill);
      gsap.set(fill, { transformOrigin: "top right" });

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(fill, { scale: 0 });
        return;
      }

      gsap.to(fill, {
        duration: 0.3,
        ease: REVEAL_EASE,
        overwrite: "auto",
        scale: 0,
      });
    };

    element.addEventListener("pointerenter", show);
    element.addEventListener("pointerleave", hide);
    element.addEventListener("focus", show);
    element.addEventListener("blur", hide);

    return () => {
      element.removeEventListener("pointerenter", show);
      element.removeEventListener("pointerleave", hide);
      element.removeEventListener("focus", show);
      element.removeEventListener("blur", hide);
      gsap.killTweensOf(fill);
    };
  }, []);

  return (
    <Comp
      ref={setRef}
      className={cn(
        "group relative overflow-hidden",
        "bg-transparent text-background",
        "focus-visible:outline-none",
        "[&>span:not([data-hover-fill])]:relative [&>span:not([data-hover-fill])]:z-10 [&>span:not([data-hover-fill])]:mix-blend-difference",
        className,
      )}
      {...props}
    >
      <span
        ref={fillRef}
        aria-hidden="true"
        data-hover-fill
        className="pointer-events-none absolute inset-0 z-0 origin-top-right scale-0 bg-foreground"
      />
      <Slottable>{children}</Slottable>
    </Comp>
  );
}
