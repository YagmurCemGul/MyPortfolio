"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Project } from "src/types/Project";
import ProjectCard from "./ProjectCard";

type Props = {
    title: string;
    items: Project[];
};

export default function ProjectSliderRow({ title, items }: Props) {
    return (
        <Stack spacing={1.5} sx={{ px: { xs: 2, sm: 3, md: 5 } }}>
            <Typography variant="h6">{title}</Typography>

            <Box
                sx={{
                    display: "grid",
                    gridAutoFlow: "column",
                    gridAutoColumns: {
                        xs: "60%",
                        sm: "40%",
                        md: "24%",
                        lg: "20%",
                    },
                    gap: 1.5,
                    overflowX: "auto",
                    scrollSnapType: "x mandatory",
                    pb: 1,
                    "& > *": { scrollSnapAlign: "start" },
                    // trackpad için daha pürüzsüz
                    WebkitOverflowScrolling: "touch",
                }}
            >
                {items.map((p) => (
                    <Box key={p.id}>
                        <ProjectCard project={p} />
                    </Box>
                ))}
            </Box>
        </Stack>
    );
}
