// src/hoc/withPagination.tsx
"use client";
import * as React from "react";
import { ElementType, useCallback, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "src/hooks/redux";
import {
    initiateItem,
    useLazyGetVideosByMediaTypeAndGenreIdQuery,
    useLazyGetVideosByMediaTypeAndCustomGenreQuery,
} from "src/store/slices/discover";
import { MEDIA_TYPE } from "src/types/Common";
import { CustomGenre, Genre } from "src/types/Genre";
import { type ProjectTextOverride } from "src/data/myProjects";

type WithPaginationProps = {
    /** (Opsiyonel) Tüm item'ları override edip fetch'i atlamak istersen */
    itemsOverride?: any[];

    /** Sadece metin alanlarını (title/overview/release_date/vote_average) TMDB item üstüne yaz */
    textOverrides?: ProjectTextOverride[];
} & Record<string, any>;

export default function withPagination(
    Component: ElementType,
    mediaType: MEDIA_TYPE,
    genre: Genre | CustomGenre
) {
    return function WithPagination(props: WithPaginationProps) {
        const { itemsOverride, textOverrides, ...rest } = props;
        // Eğer itemsOverride varsa ya da yalnızca textOverrides ile çalışmak istiyorsak fetch'i atla
        const bypass = (!!itemsOverride && itemsOverride.length > 0) || (!!textOverrides && textOverrides.length > 0);

        const dispatch = useAppDispatch();
        const itemKey = (genre as any).id ?? (genre as CustomGenre).apiString;
        const mediaState = useAppSelector((state) => state.discover[mediaType]);
        const pageState = mediaState ? (mediaState[itemKey] as any) : undefined;

        const [getByGenreId] = useLazyGetVideosByMediaTypeAndGenreIdQuery();
        const [getByCustom] = useLazyGetVideosByMediaTypeAndCustomGenreQuery();

        useEffect(() => {
            if (bypass) return;
            if (!mediaState || !pageState) {
                dispatch(initiateItem({ mediaType, itemKey }));
            }
        }, [bypass, mediaState, pageState, dispatch, mediaType, itemKey]);

        useEffect(() => {
            if (bypass) return;
            if (pageState && (pageState.page === 0 || (pageState.results?.length ?? 0) === 0)) {
                handleNext(1);
            }
        }, [bypass, pageState]);

        const handleNext = useCallback(
            (page: number) => {
                if (bypass) return;
                if ((genre as any).id) {
                    getByGenreId({ mediaType, genreId: (genre as any).id, page });
                } else {
                    getByCustom({
                        mediaType,
                        apiString: (genre as CustomGenre).apiString,
                        page,
                    });
                }
            },
            [bypass, genre, mediaType, getByGenreId, getByCustom]
        );

        const applyTextOverrides = (data: any) => {
            if (!textOverrides || textOverrides.length === 0) return data;

            const ovLen = textOverrides.length;
            // TMDB sonuçlarını sadece ilk N kayıtla sınırla (tekrar yok)
            const base = (data?.results ?? []).slice(0, ovLen);

            const results = base.map((item: any, idx: number) => {
                const ov: ProjectTextOverride = textOverrides[idx] ?? {};
                return {
                    ...item,
                    // Senin verdiğin GIF varsa kullan, yoksa TMDB görseli kalsın
                    backdrop_path: ov.backdrop_path ?? item.backdrop_path,
                    ...(ov.title ? { title: ov.title, name: ov.title } : {}),
                    ...(ov.overview ? { overview: ov.overview } : {}),
                    ...(ov.release_date ? { release_date: ov.release_date } : {}),
                    ...(typeof ov.vote_average === "number" ? { vote_average: ov.vote_average } : {}),
                    ...(ov.href ? { href: ov.href } : {}),            // 👈 Link
                    ...(ov.skills ? { skills: ov.skills } : {}),                 // 👈 Skills
                    ...(ov.availableIn ? { availableIn: ov.availableIn } : {}),  // 👈 availableIn
                    ...(ov.matchPercent !== undefined ? { matchPercent: ov.matchPercent } : {}),
                    ...(ov.year !== undefined ? { year: ov.year } : {}),
                    ...(ov.ageLimit !== undefined ? { ageLimit: ov.ageLimit } : {}),
                    ...(ov.minutes !== undefined ? { minutes: ov.minutes } : {}),
                    ...(ov.durationText ? { durationText: ov.durationText } : {}),
                    ...(ov.quality ? { quality: ov.quality } : {}),

                };
            });

            return {
                ...data,
                page: 1,
                total_pages: 1,
                total_results: results.length,
                results,
            };
        };

        const syntheticData = useMemo(() => {
            if (!bypass) return undefined;
            // itemsOverride öncelikli; yoksa textOverrides'tan minimal base sonuç üret
            if (itemsOverride && itemsOverride.length > 0) {
                return { page: 1, total_pages: 1, results: itemsOverride } as any;
            }
            const base = (textOverrides ?? []).map((ov) => ({
                backdrop_path: ov.backdrop_path ?? "",
                title: ov.title ?? "",
                name: ov.title ?? "",
                overview: ov.overview ?? "",
                release_date: ov.release_date,
                vote_average: ov.vote_average,
            }));
            return { page: 1, total_pages: 1, results: base } as any;
        }, [bypass, itemsOverride, textOverrides]);

        if (bypass && syntheticData) {
            const finalData = applyTextOverrides(syntheticData);
            return (
                <Component
                    data={finalData}
                    genre={genre}
                    handleNext={handleNext}
                    {...rest}
                />
            );
        }

        if (pageState) {
            const finalData = applyTextOverrides(pageState);
            return (
                <Component
                    data={finalData}
                    genre={genre}
                    handleNext={handleNext}
                    {...rest}
                />
            );
        }

        // İlk bucket oluşana kadar da component’i boş bırakmayalım:
        return (
            <Component
                data={{ page: 0, results: [], total_pages: 0, total_results: 0 }}
                genre={genre}
                handleNext={handleNext}
                {...rest}
            />
        );
    };
}
