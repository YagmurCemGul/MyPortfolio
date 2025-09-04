// src/components/Logo.tsx
"use client";
import Link from "next/link";
import Box, { BoxProps } from "@mui/material/Box";
import { MAIN_PATH } from "src/constant";

type Props = BoxProps & { href?: string };

export default function Logo({ sx, href, ...rest }: Props) {
  const target = href ?? `/${MAIN_PATH.browse}`;
  return (
    <Link href={target} aria-label="Go to Browse">
      <Box
        component="img"
        alt="Netflix Logo"
        src="/assets/netflix-logo.png"
        width={87}
        height={25}
        sx={sx}
        {...rest}
      />
    </Link>
  );
}
