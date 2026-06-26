import React from "react";
import { cn } from "../lib/utils";

type TitleProps = Omit<React.ComponentProps<"h1">, "children"> & {
  text: string;
};

export function Title({ className, text, ...props }: TitleProps) {
  const [entered, setEntered] = React.useState(false);
  const titleRef = React.useRef<HTMLHeadingElement>(null);

  React.useEffect(() => {
    const title = titleRef.current;
    if (!title) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setEntered(true);
        observer.disconnect();
      },
      {
        rootMargin: "0px 0px -33.3% 0px",
        threshold: 0.6,
      },
    );

    observer.observe(title);

    return () => observer.disconnect();
  }, []);

  return (
    <h1
      ref={titleRef}
      data-entered={entered}
      className={cn(
        "group relative inline-flex items-baseline text-3xl leading-none outline-none before:mr-1 before:opacity-0 before:content-['['] after:ml-1 after:opacity-0 after:content-[']'] data-[entered=true]:before:opacity-100 data-[entered=true]:after:opacity-100 lg:text-6xl",
        className,
      )}
      {...props}
    >
      <span className="inline-block overflow-hidden leading-none">
        <span className="inline-block transform-[translateY(1em)] opacity-0 transition-[transform,opacity] duration-480 ease-out group-data-[entered=true]:transform-[translateY(0)] group-data-[entered=true]:opacity-100 motion-reduce:transform-[translateY(0)] motion-reduce:opacity-100 motion-reduce:transition-none">
          {text}
        </span>
      </span>
    </h1>
  );
}
