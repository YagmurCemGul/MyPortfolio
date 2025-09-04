"use client";

import { useMemo } from "react";
import withPagination from "src/hoc/withPagination";
import { MEDIA_TYPE } from "src/types/Common";
import { CustomGenre, Genre } from "src/types/Genre";
import SlickSlider from "./slick-slider/SlickSlider";

interface SliderRowForGenreProps {
    genre: Genre | CustomGenre;
    mediaType: MEDIA_TYPE;

    // YENİ: Sadece metin alanlarını override et
    textOverrides?: Array<
        Partial<{
            title: string;
            name: string;
            overview: string;
            release_date: string;
            vote_average: number;
        }>
    >;

    // (Opsiyonel) Tam item override kullanmak istersen kalsın:
    itemsOverride?: any[];
}

export default function SliderRowForGenre({ genre, mediaType, textOverrides, itemsOverride }: SliderRowForGenreProps) {
    const Component = useMemo(
        () => withPagination(SlickSlider, mediaType, genre),
        [mediaType, genre]
    );

    return <Component textOverrides={textOverrides} itemsOverride={itemsOverride} />;
}
