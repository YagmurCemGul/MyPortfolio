"use client";

import Chip from "@mui/material/Chip";
import type { ChipProps } from "@mui/material/Chip";

export default function QualityChip({ sx, ...others }: ChipProps) {
    return (
        <Chip
            variant="outlined"
            {...others}
            sx={{
                borderRadius: "4px",
                p: 0.5,
                fontSize: 12,
                height: "100%",
                "& .MuiChip-label": { p: 0 },
                ...sx,
            }}
        />
    );
}
