"use client";
import NextLink from "next/link";
import Link, { LinkProps } from "@mui/material/Link";

export default function NetflixNavigationLink({
  sx,
  children,
  ...others
}: LinkProps & { href: string }) {
  return (
    <Link
      {...others}
      component={NextLink}
      sx={{ color: "text.primary", textDecoration: "none", ...sx }}
    >
      {children}
    </Link>
  );
}
