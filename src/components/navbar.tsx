import { Dialog } from "@base-ui/react";
import LogoSvg from "../assets/logo.svg?react";
import { HoverElement } from "./hover-element";

export function Navbar() {
  return (
    <nav className="sticky top-8 flex w-screen flex-row flex-nowrap justify-between px-8 text-foreground lg:justify-evenly lg:px-[10%] xl:px-[20%]">
      <div className="flex flex-row items-center gap-1.5 md:gap-2">
        <LogoSvg height={28} className="h-7 w-full" />
      </div>
      <div className="mx-6 ml-12 hidden h-6 flex-1 border-b border-foreground md:flex"></div>
      <div className="hidden flex-row items-start justify-center gap-2 md:flex">
        {["ABOUT", "EXPERIENCE", "PROJECTS", "LINKS"].map((link) => (
          <HoverElement asChild key={link} className="bg-background">
            <a href={`#${link}`} className="px-4 py-2 font-pixel-secondary text-xl">
              <span aria-hidden="true" />
              <span>{link}</span>
            </a>
          </HoverElement>
        ))}
      </div>
      <Dialog.Root>
        <Dialog.Trigger
          render={
            <button className="relative flex h-7 w-7 cursor-pointer md:hidden">
              <div className="absolute top-1/2 left-0 h-px w-full -translate-y-0.75 bg-foreground"></div>
              <div className="absolute top-1/2 left-0 h-px w-full translate-y-0.75 bg-foreground"></div>
            </button>
          }
        />
        <Dialog.Portal>
          <Dialog.Popup className="fixed top-8 right-8 z-50 flex w-[calc(100vw-4rem)] max-w-80 origin-top-right flex-col gap-2 bg-black p-4 text-background outline-none data-[state=closed]:animate-[dialog-menu-out_300ms_var(--cubic-hover)] data-[state=open]:animate-[dialog-menu-in_300ms_var(--cubic-hover)] md:hidden">
            <Dialog.Title className="sr-only">Navigation</Dialog.Title>
            {["ABOUT", "EXPERIENCE", "PROJECTS", "LINKS"].map((link) => (
              <a href={`#${link}`} className="px-4 py-2 font-pixel-secondary text-xl">
                {link}
              </a>
            ))}
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </nav>
  );
}
