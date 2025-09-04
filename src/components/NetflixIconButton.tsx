// src/components/NetflixIconButton.tsx
"use client";
import { forwardRef } from "react";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";

type Props = IconButtonProps & { circleSize?: number }; // istediğin çapı verebilirsin

const NetflixIconButton = forwardRef<HTMLButtonElement, Props>(
    ({ children, sx, circleSize = 44, ...others }, ref) => (
        <IconButton
            ref={ref}
            {...others}
            sx={{
                width: circleSize,
                height: circleSize,
                aspectRatio: "1 / 1",
                p: 0,
                borderRadius: "50%",
                boxSizing: "border-box",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "common.white",
                borderWidth: 2,
                borderStyle: "solid",
                borderColor: "grey.700",

                // 👇 Netflix benzeri mikro-animasyonlar
                transition: "transform 120ms ease, background-color 120ms ease, border-color 120ms ease",
                "&:hover, &:focus": {
                    transform: "scale(1.06)",
                    borderColor: "grey.200",
                    backgroundColor: "rgba(255,255,255,0.08)",
                },
                "&:active": {
                    transform: "scale(0.94)",
                },

                ...sx,
            }}

        >
            {children}
        </IconButton>
    )
);

export default NetflixIconButton;
