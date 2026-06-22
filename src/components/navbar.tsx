import { Dialog } from "@base-ui/react";
import gsap from "gsap";
import React from "react";
import { FALLING_PAGE_NAVIGATE_EVENT } from "./falling-pages";

export function Navbar() {
  const [open, setOpen] = React.useState(false);

  const navRef = React.useRef<HTMLElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const wordmarkTextRef = React.useRef<HTMLSpanElement>(null);
  const menuTlRef = React.useRef<gsap.core.Timeline | null>(null);
  const hasMountedRef = React.useRef(false);

  const prefersReducedMotion = usePrefersReducedMotion();

  const navigateToHash = (
    event: React.MouseEvent<HTMLAnchorElement>,
    hash: string,
  ) => {
    event.preventDefault();

    const navigationEvent = new CustomEvent(FALLING_PAGE_NAVIGATE_EVENT, {
      cancelable: true,
      detail: { id: hash },
    });

    const handled = !window.dispatchEvent(navigationEvent);
    if (handled) return;

    document.getElementById(hash)?.scrollIntoView();
  };

  const animateWordmark = (active: boolean) => {
    if (!wordmarkTextRef.current || prefersReducedMotion) return;

    gsap.to(wordmarkTextRef.current, {
      yPercent: active ? -50 : 0,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  React.useEffect(() => {
    if (!triggerRef.current) return;

    const topLine = triggerRef.current.children[0] as HTMLDivElement;
    const botLine = triggerRef.current.children[1] as HTMLDivElement;

    if (prefersReducedMotion) {
      gsap.set(topLine, {
        y: open ? "0.025em" : "-0.2em",
        rotate: open ? 45 : 0,
        transformOrigin: "50% 50%",
      });
      gsap.set(botLine, {
        y: open ? "-0.025em" : "0.2em",
        rotate: open ? -45 : 0,
        transformOrigin: "50% 50%",
      });

      return;
    }

    if (!menuTlRef.current) {
      gsap.set(topLine, {
        y: "-0.2em",
        rotate: 0,
        transformOrigin: "50% 50%",
      });

      gsap.set(botLine, {
        y: "0.2em",
        rotate: 0,
        transformOrigin: "50% 50%",
      });

      menuTlRef.current = gsap.timeline({
        paused: true,
        defaults: {
          ease: "power2.out",
        },
      });

      menuTlRef.current
        .to(
          topLine,
          {
            y: "0.025em",
            rotate: 45,
            duration: 0.3,
          },
          0,
        )
        .to(
          botLine,
          {
            y: "-0.025em",
            rotate: -45,
            duration: 0.3,
          },
          0,
        );
    }

    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    if (open) {
      menuTlRef.current.play();
    } else {
      menuTlRef.current.reverse(0.3);
    }
  }, [open, prefersReducedMotion]);

  React.useEffect(() => {
    return () => {
      menuTlRef.current?.kill();
      menuTlRef.current = null;
    };
  }, []);

  return (
    <nav
      ref={navRef}
      aria-label="Primary"
      className="fixed top-0 z-20 flex w-screen flex-row flex-nowrap items-center justify-between p-8 text-white mix-blend-difference lg:justify-evenly lg:px-[11.25dvw]"
    >
      <div className="flex flex-row items-center gap-1.5 md:gap-2">
        <a
          href="/"
          aria-label="Josh Footman"
          onBlur={() => animateWordmark(false)}
          onFocus={() => animateWordmark(true)}
          onMouseEnter={() => animateWordmark(true)}
          onMouseLeave={() => animateWordmark(false)}
          className="inline-flex h-11 cursor-pointer items-center text-3xl leading-none outline-none before:mr-1 before:opacity-0 before:content-['[_'] after:ml-1 after:opacity-0 after:content-['_\]'] hover:before:opacity-100 hover:after:opacity-100 focus-visible:before:opacity-100 focus-visible:after:opacity-100"
        >
          <span className="inline-block h-[1em] overflow-hidden leading-none">
            <span ref={wordmarkTextRef} className="inline-flex flex-col">
              <span aria-hidden="true">JOSH FOOTMAN</span>
              <span aria-hidden="true">HSOJ NAMTOOF</span>
            </span>
          </span>
        </a>
      </div>
      <div className="relative mx-6 ml-12 hidden h-6 flex-1 md:flex"></div>
      <div className="hidden flex-row items-start justify-center sm:flex md:gap-2 lg:gap-5">
        {["ABOUT", "EXPERIENCE", "PROJECTS", "LINKS"].map((link) => (
          <a
            key={link}
            href={`#${link}`}
            onClick={(event) => navigateToHash(event, link)}
            className="group relative inline-flex items-baseline py-2 text-xl outline-none before:mr-1 before:font-bold before:opacity-0 before:content-['[_'] after:ml-1 after:font-bold after:opacity-0 after:content-['_\]'] hover:before:opacity-100 hover:after:opacity-100 focus-visible:before:opacity-100 focus-visible:after:opacity-100"
          >
            <span className="absolute inset-0"></span>
            <span className="inline-block overflow-hidden leading-none">
              <span className="inline-block transition-transform duration-300 ease-out text-shadow-[0_1em_0] text-shadow-white group-focus-within:-translate-y-5 group-hover:-translate-y-5 motion-reduce:transition-none motion-reduce:duration-0 motion-reduce:text-shadow-none motion-reduce:group-focus-within:translate-y-0 motion-reduce:group-focus-within:text-white motion-reduce:group-hover:translate-y-0 motion-reduce:group-hover:text-white">
                {link}
              </span>
            </span>
          </a>
        ))}
      </div>
      <Dialog.Root modal={false} open={open} onOpenChange={setOpen}>
        <div className="absolute top-10 right-8 h-7 w-7 sm:hidden">
          <span className="pointer-events-none absolute inset-0 z-0" />
          <Dialog.Trigger
            render={
              <button
                ref={triggerRef}
                type="button"
                aria-label={open ? "Close navigation" : "Open navigation"}
                aria-controls="mobile-navigation"
                aria-expanded={open}
                className="absolute inset-0 flex h-7 w-7 cursor-pointer outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                <div className="absolute top-1/2 left-0 h-px w-full -translate-y-0.75 bg-white"></div>
                <div className="absolute top-1/2 left-0 h-px w-full translate-y-0.75 bg-white"></div>
              </button>
            }
          />
        </div>
        <Dialog.Portal>
          <Dialog.Popup
            id="mobile-navigation"
            className="group/menu fixed top-0 right-0 z-10 flex w-screen origin-top-right flex-col bg-black text-white transition-transform duration-300 ease-in-out outline-none data-ending-style:scale-x-0 data-ending-style:scale-y-0 data-starting-style:scale-x-0 data-starting-style:scale-y-0 md:hidden"
          >
            <div className="border-b border-white/20 pt-24"></div>
            <Dialog.Title className="sr-only">Navigation</Dialog.Title>
            <div className="flex flex-col divide-y divide-white/20">
              {["ABOUT", "EXPERIENCE", "PROJECTS", "LINKS"].map((link) => (
                <a
                  key={link}
                  href={`#${link}`}
                  onClick={(event) => {
                    setOpen(false);
                    navigateToHash(event, link);
                  }}
                  className="group flex w-full items-center justify-start px-8 py-4 text-center text-xl outline-none"
                >
                  <span className="inline-block overflow-hidden leading-none">
                    <span className="ease inline-block transform-[translateY(0)] opacity-100 transition-[transform,opacity] delay-330 duration-300 text-shadow-[0_1em_0] text-shadow-white group-data-ending-style/menu:transform-[translateY(1em)] group-data-ending-style/menu:opacity-0 group-data-starting-style/menu:transform-[translateY(1em)] group-data-starting-style/menu:opacity-0 before:mr-1 before:font-bold before:opacity-0 before:content-['['] group-hover:before:opacity-100 group-focus-visible:before:opacity-100 after:ml-1 after:font-bold after:opacity-0 after:content-[']'] group-hover:after:opacity-100 group-focus-visible:after:opacity-100 motion-reduce:transform-[translateY(0)] motion-reduce:opacity-100 motion-reduce:transition-none">
                      {link}
                    </span>
                  </span>
                </a>
              ))}
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </nav>
  );
}

function usePrefersReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(mediaQuery.matches);

    update();
    mediaQuery.addEventListener?.("change", update);

    return () => {
      mediaQuery.removeEventListener?.("change", update);
    };
  }, []);

  return prefersReducedMotion;
}
