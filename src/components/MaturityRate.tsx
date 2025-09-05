"use client";
import Box from "@mui/material/Box";
import { ReactNode } from "react";
import { SxProps, Theme } from "@mui/material/styles";

export default function MaturityRate({ children, size = "default", sx }: { children: ReactNode; size?: "default" | "small"; sx?: SxProps<Theme> }) {
  const base = {
    py: 1,
    pl: 1.5,
    pr: 3,
    fontSize: 22,
  } as const;
  const small = {
    py: 0.5,
    pl: 1,
    pr: 1.5,
    fontSize: 14,
  } as const;
  return (
    <Box
      sx={{
        ...(size === "small" ? small : base),
        display: "flex",
        alignItem: "center",
        color: "text.primary",
        border: "3px #dcdcdc",
        borderLeftStyle: "solid",
        bgcolor: "#33333399",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
