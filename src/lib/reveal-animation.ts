import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

gsap.registerPlugin(CustomEase);

export const REVEAL_DELAY = 0.1;
export const REVEAL_DURATION = 1.4;
export const REVEAL_THRESHOLD = 0.35;
export const ROTATING_REVEAL_INTERVAL = 6000;

export const REVEAL_EASE = CustomEase.create(
  "reveal-element",
  "M0,0 C0.65,0.05 0,1 1,1",
);

type CreateRevealTimelineOptions = {
  content: HTMLElement;
  wipe: HTMLElement;
  delay?: number;
  hideContentUntilCovered?: boolean;
  onCovered?: () => void;
  paused?: boolean;
};

export function createRevealTimeline({
  content,
  wipe,
  delay = REVEAL_DELAY,
  hideContentUntilCovered = true,
  onCovered,
  paused = true,
}: CreateRevealTimelineOptions) {
  if (hideContentUntilCovered) {
    gsap.set(content, { autoAlpha: 0 });
  }

  gsap.set(wipe, {
    scale: 0,
    transformOrigin: "top right",
  });

  const timeline = gsap.timeline({ delay, paused });

  timeline
    .to(wipe, {
      duration: REVEAL_DURATION * 0.45,
      ease: REVEAL_EASE,
      scale: 1,
    })
    .to(wipe, {
      duration: REVEAL_DURATION * 0.1,
      ease: "none",
      scale: 1,
    })
    .call(() => {
      onCovered?.();
    })
    .set(content, { autoAlpha: 1 })
    .to(wipe, {
      duration: REVEAL_DURATION * 0.45,
      ease: REVEAL_EASE,
      scale: 0,
    });

  return timeline;
}
