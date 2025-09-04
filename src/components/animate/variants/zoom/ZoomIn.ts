import type { Variants, Transition } from "framer-motion";
const DISTANCE = 0;
const IN = { scale: 1, opacity: 1 };
const OUT = { scale: 0, opacity: 0 };

const TRANSITION_ENTER: Transition = {
    duration: 1,
    ease: [0.43, 0.13, 0.23, 0.96] as const,
};

const TRANSITION_EXIT: Transition = {
    duration: 1,
    ease: [0.43, 0.13, 0.23, 0.96] as const,
};

export const varZoomIn: Variants = {
  initial: OUT,
  animate: { ...IN, transition: TRANSITION_ENTER },
  exit: { ...OUT, transition: TRANSITION_EXIT },
};

export const varZoomInLeft: Variants = {
  initial: { ...OUT, translateX: -DISTANCE },
  animate: { ...IN, translateX: 0, transition: TRANSITION_ENTER },
  exit: { ...OUT, translateX: -DISTANCE, transition: TRANSITION_EXIT },
};

export const varZoomInRight: Variants = {
  initial: { ...OUT, translateX: DISTANCE },
  animate: { ...IN, translateX: 0, transition: TRANSITION_ENTER },
  exit: { ...OUT, translateX: DISTANCE, transition: TRANSITION_EXIT },
};
