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
    </nav>
  );
}
