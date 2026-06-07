import LogoSvg from "../assets/logo.svg?react";

export function Navbar() {
  return (
    <nav className="absolute flex w-full flex-row flex-nowrap justify-between p-4 text-foreground md:p-8">
      <div className="flex flex-row items-center gap-1.5 md:gap-2">
        <LogoSvg width={64} height={64} className="size-12 md:size-16" />
        <div className="flex flex-col">
          <h1 className="font-pixel-primary text-2xl md:text-4xl">JOSH FOOTMAN</h1>
          <p className="text-md pl-1 font-pixel-secomdary leading-4 md:text-xl">
            Frontend Engineer
          </p>
        </div>
      </div>
      <div className="hidden flex-row items-start justify-center gap-2 md:flex">
        {["ABOUT", "EXPERIENCE", "PROJECTS", "LINKS"].map((link) => (
          <a
            key={link}
            href={`#${link}`}
            className="px-4 py-2 font-pixel-secomdary text-xl outline-foreground hover:bg-foreground hover:text-background focus-visible:bg-foreground focus-visible:text-background focus-visible:outline-none"
          >
            {link}
          </a>
        ))}
      </div>
    </nav>
  );
}
