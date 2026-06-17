import { Dialog } from "@base-ui/react";
import React from "react";
import gsap from "gsap";

export function Navbar() {
  const [open, setOpen] = React.useState(false);

  const navRef = React.useRef<HTMLElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const menuTlRef = React.useRef<gsap.core.Timeline | null>(null);
  const hasMountedRef = React.useRef(false);

  const prefersReducedMotion = usePrefersReducedMotion();

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
      className="sticky flex w-screen flex-row flex-nowrap justify-between bg-background p-8 text-foreground lg:justify-evenly lg:px-[10%] xl:px-[20%]"
    >
      <div className="flex flex-row items-center gap-1.5 md:gap-2">
        <div className="z-20 font-pixel-secondary text-3xl pointer-events-none mix-blend-difference text-background">
          JOSH FOOTMAN
        </div>
      </div>
      <div className="mx-6 ml-12 hidden h-6 flex-1 border-b border-foreground md:flex"></div>
      <div className="hidden flex-row items-start justify-center gap-2 md:flex">
        {["ABOUT", "EXPERIENCE", "PROJECTS", "LINKS"].map((link) => (
          <a
            key={link}
            href={`#${link}`}
            className="group relative inline-flex items-baseline before:mr-1 after:ml-1 py-2 font-pixel-secondary text-xl before:font-bold before:opacity-0 before:content-['[_'] after:font-bold after:opacity-0 after:content-['_\]'] hover:before:opacity-100 hover:after:opacity-100 focus-visible:before:opacity-100 focus-visible:after:opacity-100 outline-none"
          >
            <span className="absolute inset-0 z-1"></span>
            <span className="inline-block overflow-hidden leading-none">
              <span className="inline-block transition-transform duration-300 ease-out text-shadow-[0_1em_0] text-shadow-foreground group-focus-within:-translate-y-5 group-hover:-translate-y-5 motion-reduce:transition-none motion-reduce:duration-0 motion-reduce:text-shadow-none motion-reduce:group-focus-within:translate-y-0 motion-reduce:group-focus-within:text-white motion-reduce:group-hover:translate-y-0 motion-reduce:group-hover:text-white">
                {link}
              </span>
            </span>
          </a>
        ))}
      </div>
      <Dialog.Root modal={false} open={open} onOpenChange={setOpen}>
        <div className="absolute top-8 right-8 h-7 w-7 md:hidden">
          <span className="pointer-events-none absolute inset-0 z-0" />
          <Dialog.Trigger
            render={
              <button
                ref={triggerRef}
                className="absolute inset-0 z-20 flex h-7 w-7 cursor-pointer mix-blend-difference outline-none"
              >
                <div className="absolute top-1/2 left-0 h-px w-full -translate-y-0.75 bg-white"></div>
                <div className="absolute top-1/2 left-0 h-px w-full translate-y-0.75 bg-white"></div>
              </button>
            }
          />
        </div>
        <Dialog.Portal container={navRef}>
          <Dialog.Popup className="group/menu fixed top-0 right-0 z-10 flex w-screen origin-top-right flex-col gap-2 bg-black text-background transition-transform duration-300 ease-in-out outline-none data-ending-style:scale-x-0 data-ending-style:scale-y-0 data-starting-style:scale-x-0 data-starting-style:scale-y-0 md:hidden">
            <div className="border-b border-background/20 pt-24"></div>
            <Dialog.Title className="sr-only">Navigation</Dialog.Title>
            <div className="flex flex-col gap-2 pt-4 pb-8 sm:flex-row sm:justify-between sm:gap-0 sm:pt-4">
              {["ABOUT", "EXPERIENCE", "PROJECTS", "LINKS"].map((link) => (
                <a
                  key={link}
                  href={`#${link}`}
                  onClick={() => setOpen(false)}
                  className="px-10 py-2 font-pixel-secondary text-xl outline-none"
                >
                  <span className="inline-block overflow-hidden leading-none">
                    <span className="inline-block transform-[translateY(0)] opacity-100 transition-[transform,opacity] delay-330 duration-300 ease text-shadow-[0_1em_0] text-shadow-background group-data-ending-style/menu:transform-[translateY(1em)] group-data-ending-style/menu:opacity-0 group-data-starting-style/menu:transform-[translateY(1em)] group-data-starting-style/menu:opacity-0 motion-reduce:transform-[translateY(0)] motion-reduce:opacity-100 motion-reduce:transition-none">
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
    mediaQuery.addEventListener("change", update);

    return () => {
      mediaQuery.removeEventListener("change", update);
    };
  }, []);

  return prefersReducedMotion;
}
