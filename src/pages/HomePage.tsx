import Stack from "@mui/material/Stack";
import HeroSection from "src/components/HeroSection";
import { MEDIA_TYPE } from "src/types/Common";
import { PROJECT_ROWS } from "src/data/projects";
import ProjectSliderRow from "src/components/projects/ProjectSliderRow";

export default function Page() {
    return (
        <Stack spacing={2}>
            {/* İstersen hero’da ilk projenin backdrop’unu kullanacak bir versiyon yazarız;
         şimdilik mevcut HeroSection kalsın. */}
            <HeroSection mediaType={MEDIA_TYPE.Movie} />

            {PROJECT_ROWS.map((row) => (
                <ProjectSliderRow key={row.title} title={row.title} items={row.items} />
            ))}
        </Stack>
    );
}
