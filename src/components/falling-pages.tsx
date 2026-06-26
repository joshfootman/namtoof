import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import React from "react";
import { cn } from "../lib/utils";

gsap.registerPlugin(ScrollTrigger);

export const FALLING_PAGE_NAVIGATE_EVENT = "falling-pages:navigate";

type FallingPageProps = React.ComponentProps<"section"> & {
  zIndex?: number;
};

export function FallingPages({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const navigationFrameRef = React.useRef(0);
  const navigationTargetRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    const navigate = () => {
      navigationFrameRef.current = 0;

      const id = navigationTargetRef.current;
      navigationTargetRef.current = null;
      if (!id) return;

      const target = document.getElementById(id);
      if (!target) return;

      ScrollTrigger.refresh();

      const trigger = ScrollTrigger.getAll().find(
        (scrollTrigger) => scrollTrigger.trigger === target,
      );

      window.scrollTo({
        top: trigger?.start ?? target.offsetTop,
        behavior: "auto",
      });
      history.pushState(null, "", `#${id}`);

      ScrollTrigger.update();
    };

    const handleNavigate = (event: Event) => {
      const { id } = (event as CustomEvent<{ id?: string }>).detail ?? {};
      if (!id) return;

      const target = document.getElementById(id);
      if (!target) return;

      event.preventDefault();
      navigationTargetRef.current = id;

      if (navigationFrameRef.current) {
        cancelAnimationFrame(navigationFrameRef.current);
      }

      navigationFrameRef.current = requestAnimationFrame(navigate);
    };

    window.addEventListener(FALLING_PAGE_NAVIGATE_EVENT, handleNavigate);

    return () => {
      if (navigationFrameRef.current) {
        cancelAnimationFrame(navigationFrameRef.current);
      }

      window.removeEventListener(FALLING_PAGE_NAVIGATE_EVENT, handleNavigate);
    };
  }, []);

  const pages = React.Children.map(children, (child, index) => {
    if (!React.isValidElement<FallingPageProps>(child)) return child;
    return React.cloneElement(child, {
      zIndex: index,
    });
  });

  return (
    <div
      className={cn("relative overflow-hidden object-fill", className)}
      {...props}
    >
      {pages}
    </div>
  );
}

export function FallingPagesPage({
  className,
  children,
  zIndex,
  ...props
}: FallingPageProps) {
  const [entered, setEntered] = React.useState(false);
  const sectionRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let hasEntered = false;
    let animationFrame = 0;
    let listening = false;

    const sectionTop = () => {
      const rect = section.getBoundingClientRect();
      return rect.top + window.scrollY;
    };

    const stopListening = () => {
      if (!listening) return;
      listening = false;
      window.removeEventListener("scroll", scheduleCheck);
      window.removeEventListener("resize", scheduleCheck);
    };

    const enter = () => {
      if (hasEntered) return;
      hasEntered = true;
      setEntered(true);
      stopListening();
    };

    const checkPosition = () => {
      animationFrame = 0;

      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const start = Math.min(sectionTop(), maxScroll);

      if (window.scrollY >= start - 1) enter();
    };

    const scheduleCheck = () => {
      if (animationFrame) return;
      animationFrame = requestAnimationFrame(checkPosition);
    };

    scheduleCheck();
    listening = true;
    window.addEventListener("scroll", scheduleCheck, { passive: true });
    window.addEventListener("resize", scheduleCheck);

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      stopListening();
    };
  }, []);

  React.useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    const wrapper = section.querySelector<HTMLElement>(
      "[data-falling-page-wrap]",
    );
    const content = section.querySelector<HTMLElement>(
      "[data-falling-page-content]",
    );

    if (!wrapper || !content) return;

    const transformTween = gsap.to(content, {
      rotationZ: (Math.random() - 0.5) * 20,
      scale: 0.4,
      rotationX: 10,
      ease: "power1.in",
      scrollTrigger: {
        pin: wrapper,
        trigger: section,
        start: "top 0%",
        end: () => `+=${window.innerHeight}`,
        invalidateOnRefresh: true,
        scrub: true,
      },
    });

    const fadeTween = gsap.to(content, {
      autoAlpha: 0,
      ease: "power1.in",
      scrollTrigger: {
        trigger: content,
        start: "top -80%",
        end: () => `+=${0.5 * window.innerHeight}`,
        invalidateOnRefresh: true,
        scrub: true,
      },
    });

    return () => {
      transformTween.scrollTrigger?.kill();
      transformTween.kill();
      fadeTween.scrollTrigger?.kill();
      fadeTween.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-falling-page-entered={entered}
      className={cn("group/page relative h-screen", className)}
      style={{ zIndex }}
      {...props}
    >
      <div data-falling-page-wrap className="h-screen">
        <div
          data-falling-page-content
          className="flex h-full w-full transform-gpu flex-col bg-noise px-8 py-[11.25dvh] outline outline-neutral-200 lg:px-[11.25dvw]"
        >
          {children}
        </div>
      </div>
    </section>
  );
}
