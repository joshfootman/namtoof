import { Slot } from "@radix-ui/react-slot";
import { cn } from "../lib/utils";

type HoverElementProps = React.ComponentProps<"button"> & {
  asChild?: boolean;
};

export function HoverElement({
  asChild = false,
  className,
  children,
  ...props
}: HoverElementProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(
        "group relative overflow-hidden",
        "bg-transparent text-white",
        "before:pointer-events-none before:absolute before:inset-0 before:z-0 before:bg-black before:content-['']",
        "before:origin-top-right before:scale-x-0 before:scale-y-0 before:transition-transform before:duration-300",
        "before:ease-(--cubic-hover)",
        "hover:before:scale-x-100 hover:before:scale-y-100 focus-visible:outline-none focus-visible:before:scale-x-100 focus-visible:before:scale-y-100",
        "[&>span]:relative [&>span]:z-10 [&>span]:mix-blend-difference",
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
