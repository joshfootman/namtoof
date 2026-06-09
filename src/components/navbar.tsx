import { Dialog } from "@base-ui/react";
import { useRef } from "react";
import LogoSvg from "../assets/logo.svg?react";
import { HoverElement } from "./hover-element";

export function Navbar() {
  const navRef = useRef<HTMLElement>(null);

  return (
    <nav
      ref={navRef}
      className="sticky top-8 flex w-screen flex-row flex-nowrap justify-between px-8 text-foreground lg:justify-evenly lg:px-[10%] xl:px-[20%]"
    >
      <div className="relative flex flex-row items-center gap-1.5 md:gap-2">
        <span className="pointer-events-none absolute inset-0 z-0 bg-background" />
        <LogoSvg
          height={28}
          className="relative z-20 h-7 w-full mix-blend-difference [&_path]:fill-white"
        />
      </div>
      <div className="mx-6 ml-12 hidden h-6 flex-1 border-b border-foreground md:flex"></div>
      <div className="hidden flex-row items-start justify-center gap-2 md:flex">
        {["ABOUT", "EXPERIENCE", "PROJECTS", "LINKS"].map((link) => (
          <HoverElement asChild key={link} className="bg-background">
            <a href={`#${link}`} className="px-4 py-2 font-pixel-secondary text-xl">
              <span>{link}</span>
            </a>
          </HoverElement>
        ))}
      </div>
      <Dialog.Root modal={false}>
        <div className="absolute top-0 right-8 h-7 w-7 md:hidden">
          <span className="pointer-events-none absolute inset-0 z-0 bg-background" />
          <Dialog.Trigger
            render={
              <button className="absolute inset-0 z-20 flex h-7 w-7 cursor-pointer mix-blend-difference">
                <div className="absolute top-1/2 left-0 h-px w-full -translate-y-0.75 bg-white"></div>
                <div className="absolute top-1/2 left-0 h-px w-full translate-y-0.75 bg-white"></div>
              </button>
            }
          />
        </div>
        <Dialog.Portal container={navRef}>
          <Dialog.Popup className="fixed top-0 right-0 z-10 flex w-screen origin-top-right flex-col gap-2 bg-black p-4 text-background transition-transform duration-300 ease-(--cubic-hover) outline-none data-ending-style:scale-x-0 data-ending-style:scale-y-0 data-starting-style:scale-x-0 data-starting-style:scale-y-0 md:hidden">
            <div className="border-b border-background pt-18"></div>
            <Dialog.Title className="sr-only">Navigation</Dialog.Title>
            <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-between sm:gap-0 sm:pt-4 sm:pb-2">
              {["ABOUT", "EXPERIENCE", "PROJECTS", "LINKS"].map((link) => (
                <a key={link} href={`#${link}`} className="px-4 py-2 font-pixel-secondary text-xl">
                  {link}
                </a>
              ))}
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </nav>
  );
}
