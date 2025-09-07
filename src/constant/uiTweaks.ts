// src/constant/uiTweaks.ts
// Central place to fine‑tune UI spacing/behaviors for /projects

export const UI_TWEAKS = {
  projectsHeader: {
    mobile: {
      // Space between search icon and account (Avatar) — in MUI spacing units (1 = 8px)
      searchAccountGap: 0.5,
      // Extra right margin for the account button to the screen edge
      accountRightMargin: 0.5,
    },
    desktop: {
      // Space between search icon and account on desktop
      searchAccountGap: 1.25,
      // Extra right margin for the account button to the screen edge
      accountRightMargin: 0,
    },
  },
  readMore: {
    desktop: {
      // Show "Read more / Read less" in desktop modals
      show: true,
      // Underline link style
      underline: true,
      // Expand animation (used by inline cards if shown on desktop)
      openTransition: 'max-height 600ms cubic-bezier(0.22,0.61,0.36,1)',
      // Collapse animation
      closeTransition: 'max-height 540ms cubic-bezier(0.22,0.61,0.36,1)',
    },
    mobile: {
      // Show "Read more / Read less" in mobile stacked modals
      show: true,
      // Underline link style
      underline: true,
      // Expand animation
      openTransition: 'max-height 360ms ease-in-out',
      // Collapse animation
      closeTransition: 'max-height 360ms ease-in-out',
    },
  },
} as const;

export type UITweaks = typeof UI_TWEAKS;
