"use client";

import NextLink from "next/link";
import Button, { ButtonProps } from "@mui/material/Button";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

type PlayButtonProps = ButtonProps & {
    appearance?: "hero" | "modal";
    /** Butonda görünecek yazı (ör: "Play", "Resume") */
    label?: string;
    /** Tıklanınca gidilecek adres. İç rota ya da dış URL olabilir. */
    href?: string;
    /** Dış linkleri yeni sekmede açmak istersen */
    newTab?: boolean;
};

export default function PlayButton({
                                       sx,
                                       appearance = "hero",
                                       label = appearance === "modal" ? "Resume" : "Play",
                                       href,
                                       newTab = false,
                                       ...others
                                   }: PlayButtonProps) {
    const heroStyles = {
        bgcolor: "#fff",
        color: "#000",
        "&:hover": { bgcolor: "#e6e6e6" },
    };

    const modalStyles = {
        bgcolor: "transparent",
        color: "#fff",
        border: "1px solid rgba(255,255,255,0.85)",
        "&:hover": { bgcolor: "rgba(255,255,255,0.15)" },
    };

// Boş string gelirse undefined yap
    const cleanedHref = typeof href === "string" && href.trim() !== "" ? href : undefined;

    const isExternal = !!cleanedHref && /^(https?:)?\/\//i.test(cleanedHref);
    const componentProp: any = cleanedHref ? (isExternal ? "a" : NextLink) : "button";


    return (
        <Button
            component={componentProp}
            href={href}
            target={isExternal && newTab ? "_blank" : undefined}
            rel={isExternal && newTab ? "noopener noreferrer" : undefined}
            variant="contained"
            startIcon={
                <PlayArrowIcon
                    sx={{
                        color: "currentColor",
                        fontSize: {
                            xs: "24px !important",
                            sm: "32px !important",
                            md: "40px !important",
                        },
                    }}
                />
            }
            {...others}
            sx={{
                px: { xs: 1, sm: 2 },
                py: { xs: 0.5, sm: 1 },
                fontSize: { xs: 18, sm: 24, md: 28 },
                lineHeight: 1.5,
                fontWeight: "bold",
                whiteSpace: "nowrap",
                textTransform: "capitalize",
                ...(appearance === "modal" ? modalStyles : heroStyles),
                ...sx,
            }}
        >
            {label}
        </Button>
    );
}
