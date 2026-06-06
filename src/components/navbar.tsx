import LogoSvg from "../assets/logo.svg?react";

export function Navbar() {
  return (
    <nav className="flex flex-row flex-nowrap justify-between p-4 text-foreground md:p-8">
      <div className="flex flex-row items-center gap-1.5 md:gap-3">
        <LogoSvg width={64} height={64} className="size-12 md:size-16" />
        <div className="flex flex-col">
          <h1 className="font-pixel-primary text-2xl md:text-4xl">JOSH FOOTMAN</h1>
          <p className="text-md pl-1 font-pixel-secomdary leading-4 md:text-xl">
            Frontend Engineer
          </p>
        </div>
      </div>
      <div className="hidden flex-row items-start justify-center gap-8 xl:flex">
        {["About", "Experience", "Education", "Projects", "Links"].map((link) => (
          <a
            key={link}
            href="#"
            className="w-30 border border-foreground p-2 text-center font-pixel-secomdary text-xl"
          >
            {link}
          </a>
        ))}
      </div>
    </nav>
  );
}
