"use client";

import Link from "next/link";
import Image from "next/image";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import { Project } from "src/types/Project";

type Props = { project: Project };

export default function ProjectCard({ project }: Props) {
    const content = (
        <CardActionArea sx={{ borderRadius: 2, overflow: "hidden" }}>
            <Box sx={{ position: "relative", width: "100%", aspectRatio: "2/3" }}>
                {project.posterUrl && (
                    <Image
                        src={project.posterUrl}
                        alt={project.title}
                        fill
                        sizes="(max-width: 600px) 50vw, 20vw"
                        style={{ objectFit: "cover" }}
                        priority={false}
                    />
                )}
            </Box>

            <Stack spacing={0.5} sx={{ p: 1.5 }}>
                <Typography variant="subtitle1" noWrap title={project.title}>
                    {project.title}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }} noWrap>
                    {project.year} {project.overview ? "• " + project.overview : ""}
                </Typography>

                <Box sx={{ mt: 0.5, display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                    {(project.tech ?? []).slice(0, 3).map((t) => (
                        <Chip key={t} label={t} size="small" variant="outlined" />
                    ))}
                </Box>
            </Stack>
        </CardActionArea>
    );

    return (
        <Card
            elevation={0}
            sx={{
                bgcolor: "background.paper",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "divider",
            }}
        >
            {project.href ? (
                project.href.startsWith("http") ? (
                    <a href={project.href} target="_blank" rel="noopener noreferrer">{content}</a>
                ) : (
                    <Link href={project.href}>{content}</Link>
                )
            ) : (
                content
            )}
        </Card>
    );
}
