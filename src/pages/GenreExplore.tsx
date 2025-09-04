"use client";
import { COMMON_TITLES } from "src/constant";
import GridPage from "src/components/GridPage";
import { MEDIA_TYPE } from "src/types/Common";
import { CustomGenre, Genre } from "src/types/Genre";
import store from "src/store";
import { useGetGenresQuery } from "src/store/slices/genre";
import { useParams } from "next/navigation";



export default function Page() {
    const params = useParams<{ genreId: string }>();
    const genreId = params?.genreId;

    const { data: genres } = useGetGenresQuery(MEDIA_TYPE.Movie);

    let genre: CustomGenre | Genre | undefined;
    if (genreId) {
        if (Number.isNaN(Number(genreId))) {
            // string türündeki özel başlıklar (Popular / Top Rated vs.)
            genre = COMMON_TITLES.find((t: CustomGenre) => t.apiString === genreId);
        } else {
            // sayısal TMDB genre id
            genre = genres?.find((t: Genre) => String(t.id) === String(genreId));
        }
    }

    return genre ? <GridPage mediaType={MEDIA_TYPE.Movie} genre={genre} /> : null;
}

