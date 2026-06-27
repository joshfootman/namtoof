import React from "react";
import gsap from "gsap";
import { cn, usePrefersReducedMotion } from "../lib/utils";

const IMAGE_FRAMES = [
  {
    images: [
      { src: "/about/mabel1.jpeg", alt: "Mabel" },
      { src: "/about/mabel2.jpeg", alt: "Mabel" },
    ],
    text: "Mabel, my cavapoo and constant shadow",
  },
  {
    images: [
      { src: "/about/us.jpeg", alt: "Us" },
      { src: "/about/us2.png", alt: "Us" },
    ],
    text: "The love of my life",
  },
  {
    images: [
      { src: "/about/mabel3.jpeg", alt: "Mabel" },
      { src: "/about/mabel4.jpeg", alt: "Mabel" },
    ],
    text: "More Mabel, because two photos were not enough",
  },
  {
    images: [
      { src: "/about/tenby1.jpeg", alt: "Tenby" },
      { src: "/about/tenby2.jpeg", alt: "Tenby" },
    ],
    text: "Wales, a beautiful country",
  },
  {
    images: [
      { src: "/about/hachikō.jpeg", alt: "Hachiko" },
      { src: "/about/kyoto.jpeg", alt: "Kyoto" },
    ],
    text: "Japan, my favourite holiday so far",
  },
  {
    images: [
      { src: "/about/katowice.jpeg", alt: "Katowice" },
      { src: "/about/donut.png", alt: "Donut" },
    ],
    text: "Sidequests and hobbies",
  },
  {
    images: [
      { src: "/about/paella.jpeg", alt: "Paella" },
      { src: "/about/katsu.jpeg", alt: "Katsu" },
    ],
    text: "Paella first, katsu curry close behind",
  },
];

const INTERVAL_MS = 5600;
const TRANSITION_DURATION_MS = 660;
const PAIR_GAP = "4dvh";

export function AboutImageTicker({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [entered, setEntered] = React.useState(false);
  const [revealed, setRevealed] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const [nextIndex, setNextIndex] = React.useState(1);
  const [animating, setAnimating] = React.useState(false);
  const tickerRef = React.useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  React.useEffect(() => {
    const ticker = tickerRef.current;
    if (!ticker) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setEntered(true);
        observer.disconnect();
      },
      {
        rootMargin: "0px 0px -33.3% 0px",
        threshold: 0.4,
      },
    );

    observer.observe(ticker);

    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (!prefersReducedMotion) return;
    setEntered(true);
    setRevealed(true);
  }, [prefersReducedMotion]);

  React.useEffect(() => {
    if (!revealed) return;

    if (prefersReducedMotion || IMAGE_FRAMES.length < 2) {
      setIndex(0);
      setNextIndex(1);
      setAnimating(false);
      return;
    }

    if (animating) return;

    const interval = window.setInterval(() => {
      setNextIndex((index + 1) % IMAGE_FRAMES.length);
      setAnimating(true);
    }, INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [animating, index, prefersReducedMotion, revealed]);

  const handleTransitionEnd = (
    event: React.TransitionEvent<HTMLDivElement>,
  ) => {
    if (event.propertyName !== "transform") return;

    if (!revealed) {
      setRevealed(true);
      return;
    }

    setIndex(nextIndex);
    setNextIndex((nextIndex + 1) % IMAGE_FRAMES.length);
    setAnimating(false);
  };

  return (
    <div
      ref={tickerRef}
      data-entered={entered}
      className={cn("ml-auto w-fit", className)}
      {...props}
    >
      <div className="h-[30dvh] overflow-hidden md:h-[45dvh]">
        <div
          className={cn(
            "flex flex-col motion-reduce:transition-none",
            animating || !revealed
              ? "transition-transform ease-out"
              : "transition-none",
          )}
          style={{
            gap: PAIR_GAP,
            transitionDuration: `${TRANSITION_DURATION_MS}ms`,
            transform:
              !entered && !prefersReducedMotion
                ? "translateY(100%)"
                : animating && !prefersReducedMotion
                  ? `translateY(calc(-50% - ${PAIR_GAP} / 2))`
                  : "translateY(0)",
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          <ImagePair images={(IMAGE_FRAMES[index] ?? IMAGE_FRAMES[0]).images} />
          <ImagePair
            images={(IMAGE_FRAMES[nextIndex] ?? IMAGE_FRAMES[0]).images}
          />
        </div>
      </div>
      <CaptionTicker
        currentText={(IMAGE_FRAMES[index] ?? IMAGE_FRAMES[0]).text}
        nextText={(IMAGE_FRAMES[nextIndex] ?? IMAGE_FRAMES[0]).text}
        entered={entered}
        revealed={revealed}
        animating={animating}
        prefersReducedMotion={prefersReducedMotion}
      />
    </div>
  );
}

function ImagePair({
  images,
}: {
  images: (typeof IMAGE_FRAMES)[number]["images"];
}) {
  return (
    <div className="flex h-[30dvh] justify-end gap-2 md:h-[45dvh] md:gap-3">
      {images.map((image) => (
        <img
          key={image.src}
          src={image.src}
          alt={image.alt}
          loading="lazy"
          className="aspect-3/4 h-full w-auto object-cover"
        />
      ))}
    </div>
  );
}

function CaptionTicker({
  currentText,
  nextText,
  entered,
  revealed,
  animating,
  prefersReducedMotion,
}: {
  currentText: string;
  nextText: string;
  entered: boolean;
  revealed: boolean;
  animating: boolean;
  prefersReducedMotion: boolean;
}) {
  const currentRef = React.useRef<HTMLParagraphElement>(null);
  const nextRef = React.useRef<HTMLParagraphElement>(null);

  React.useLayoutEffect(() => {
    const current = currentRef.current;
    const next = nextRef.current;

    if (!current || !next) return;

    if (prefersReducedMotion) {
      gsap.set(current, { xPercent: -50, yPercent: 0, autoAlpha: 1 });
      gsap.set(next, { xPercent: -50, yPercent: 100, autoAlpha: 0 });
      return;
    }

    if (!entered) {
      gsap.set(current, { xPercent: -50, yPercent: 100, autoAlpha: 1 });
      gsap.set(next, { xPercent: -50, yPercent: 100, autoAlpha: 0 });
      return;
    }

    if (!revealed) {
      gsap.to(current, {
        xPercent: -50,
        yPercent: 0,
        autoAlpha: 1,
        duration: TRANSITION_DURATION_MS / 1000,
        ease: "power2.out",
      });
      gsap.set(next, { xPercent: -50, yPercent: 100, autoAlpha: 0 });
      return;
    }

    if (!animating) {
      gsap.set(current, { xPercent: -50, yPercent: 0, autoAlpha: 1 });
      gsap.set(next, { xPercent: -50, yPercent: 100, autoAlpha: 0 });
      return;
    }

    const timeline = gsap.timeline();

    timeline
      .to(current, {
        xPercent: -50,
        yPercent: -100,
        autoAlpha: 0,
        duration: 0.48,
        ease: "power2.out",
      })
      .fromTo(
        next,
        { xPercent: -50, yPercent: 100, autoAlpha: 0 },
        {
          xPercent: -50,
          yPercent: 0,
          autoAlpha: 1,
          duration: 0.48,
          ease: "power2.out",
        },
        0,
      );

    return () => {
      timeline.kill();
    };
  }, [
    animating,
    currentText,
    entered,
    nextText,
    prefersReducedMotion,
    revealed,
  ]);

  return (
    <div className="mt-3 flex w-full justify-center overflow-visible text-center text-sm uppercase md:mt-4 md:text-lg">
      <div className="relative grid h-[1em] overflow-hidden leading-none">
        {IMAGE_FRAMES.map((frame) => (
          <CaptionLine
            key={frame.text}
            aria-hidden="true"
            className="invisible col-start-1 row-start-1"
          >
            {frame.text}
          </CaptionLine>
        ))}
        <CaptionLine
          ref={currentRef}
          className="pointer-events-none absolute top-0 left-1/2"
        >
          {currentText}
        </CaptionLine>
        <CaptionLine
          ref={nextRef}
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-1/2"
        >
          {nextText}
        </CaptionLine>
      </div>
    </div>
  );
}

const CaptionLine = React.forwardRef<
  HTMLParagraphElement,
  React.ComponentProps<"p">
>(({ children, className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "inline-flex w-max items-baseline justify-center leading-none whitespace-nowrap [text-box:trim-both_cap_alphabetic]",
      className,
    )}
    {...props}
  >
    <span aria-hidden="true" className="mr-[0.25ch]">
      [
    </span>
    <span>{children}</span>
    <span aria-hidden="true" className="ml-[0.25ch]">
      ]
    </span>
  </p>
));

CaptionLine.displayName = "CaptionLine";
