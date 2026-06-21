import React from "react";
import { cn } from "../lib/utils";

type TitleProps = Omit<React.ComponentProps<"h1">, "children"> & {
  text: string;
};

export function Title({ className, text, ...props }: TitleProps) {
  return (
    <h1
      className={cn(
        "group relative inline-flex items-baseline text-3xl leading-none outline-none before:mr-1 before:opacity-0 before:content-['['] group-data-[falling-page-entered=true]/page:before:opacity-100 after:ml-1 after:opacity-0 after:content-[']'] group-data-[falling-page-entered=true]/page:after:opacity-100 lg:text-6xl",
        className,
      )}
      {...props}
    >
      <span className="inline-block overflow-hidden leading-none">
        <span className="inline-block transform-[translateY(1em)] opacity-0 transition-[transform,opacity] duration-300 ease-out group-data-[falling-page-entered=true]/page:transform-[translateY(0)] group-data-[falling-page-entered=true]/page:opacity-100 motion-reduce:transform-[translateY(0)] motion-reduce:opacity-100 motion-reduce:transition-none">
          {text}
        </span>
      </span>
    </h1>
  );
}
