"use client";

import { useMemo } from "react";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import AddIcon from "@mui/icons-material/Add";
import { Movie } from "src/types/Movie";
import NetflixIconButton from "./NetflixIconButton";
import MaxLineTypography from "./MaxLineTypography";
import AgeLimitChip from "./AgeLimitChip";
import { useGetConfigurationQuery } from "src/store/slices/configuration";

// SSR ↔ CSR uyumsuzluğunu önlemek için videoya bağlı deterministik “random”
function seededInt(id: number, salt: number, min: number, max: number) {
    const x = Math.imul((id ^ salt) >>> 0, 2654435761) >>> 0;
    return min + (x % (max - min + 1));
}
function formatMinuteToReadable(mins: number) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

interface SimilarVideoCardProps {
    video: Movie;
}

export default function SimilarVideoCard({ video }: SimilarVideoCardProps) {
    const { data: configuration } = useGetConfigurationQuery(undefined);

    // Değerleri video.id’ye göre sabitle (SSR ve client aynı olur)
    const ui = useMemo(
        () => ({
            match: seededInt(video.id, 1, 50, 99), // 50–99 arası “% Match”
            age: seededInt(video.id, 2, 7, 18),    // 7–18 arası yaş etiketi
            mins: seededInt(video.id, 3, 60, 180), // 60–180 dk
        }),
        [video.id]
    );

    const year =
        (video as any)?.release_date?.substring?.(0, 4) ??
        (video as any)?.first_air_date?.substring?.(0, 4) ??
        "";

    return (
        <Card>
            <div
                style={{
                    width: "100%",
                    position: "relative",
                    paddingTop: "calc(9 / 16 * 100%)",
                }}
            >
                <img
                    src={`${configuration?.images.base_url}w780${video.backdrop_path}`}
                    alt={video.title || "Backdrop"}
                    loading="lazy"
                    style={{
                        left: 0,
                        top: 0,
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        objectFit: "cover",
                    }}
                />
                <div
                    style={{
                        top: 10,
                        right: 15,
                        position: "absolute",
                    }}
                >
                    <Typography variant="subtitle2">{formatMinuteToReadable(ui.mins)}</Typography>
                </div>
                <div
                    style={{
                        left: 0,
                        right: 0,
                        bottom: 0,
                        paddingLeft: "16px",
                        paddingRight: "16px",
                        paddingBottom: "4px",
                        position: "absolute",
                    }}
                >
                    <MaxLineTypography
                        maxLine={1}
                        sx={{ width: "80%", fontWeight: 700 }}
                        variant="subtitle1"
                    >
                        {video.title}
                    </MaxLineTypography>
                </div>
            </div>

            <CardContent>
                <Stack spacing={1}>
                    <Stack direction="row" alignItems="center">
                        <div>
                            <Typography variant="subtitle2" sx={{ color: "success.main" }}>
                                {ui.match}% Match
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <AgeLimitChip label={`${ui.age}+`} />
                                {!!year && <Typography variant="body2">{year}</Typography>}
                            </Stack>
                        </div>
                        <div style={{ flexGrow: 1 }} />
                        <NetflixIconButton>
                            <AddIcon />
                        </NetflixIconButton>
                    </Stack>

                    <MaxLineTypography maxLine={4} variant="subtitle2">
                        {video.overview}
                    </MaxLineTypography>
                </Stack>
            </CardContent>
        </Card>
    );
}
