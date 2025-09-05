// src/components/Logo.tsx
"use client";
import Link from "next/link";
import Box, { BoxProps } from "@mui/material/Box";
import { MAIN_PATH } from "src/constant";

type Props = BoxProps & { href?: string; onLogoClick?: () => void };

export default function Logo({ sx, href, onLogoClick, ...boxProps }: Props) {
  const target = href ?? `/${MAIN_PATH.browse}`;
  const img = (
    <Box
      component="img"
      alt="Netflix Logo"
      src="/assets/netflix-logo.png"
      width={87}
      height={25}
      sx={{ cursor: onLogoClick ? "pointer" : undefined, ...sx }}
      onClick={onLogoClick}
      {...boxProps}
    />
  );
  if (onLogoClick || !href) return img;
  return (
    <Link href={target} aria-label="Go to Browse">{img}</Link>
  );
}
