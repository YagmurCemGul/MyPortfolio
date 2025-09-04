
//src/providers/DetailModalProvider.tsx
"use client";
import { ReactNode, useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";

import { INITIAL_DETAIL_STATE } from "src/constant";
import { createContext, useContext } from "react";
import { MEDIA_TYPE } from "src/types/Common";
import { MovieDetail } from "src/types/Movie";

type OverridePayload = Partial<{
    title: string;
    overview: string;
    backdrop_path: string;
    href: string;
    skills: string[];
    availableIn: string | string[];

    // 👇 yeni alanlar (hepsi opsiyonel)
    matchPercent: number | string; // 80 veya "80"
    year: number | string;         // 2025
    ageLimit: number | string;     // 19 veya "19+"
    minutes: number;               // 89  → "1h 29m" hesaplanır
    durationText: string;          // doğrudan "1h 29m"
    quality: string;               // "HD", "4K" vb.
}>;


interface DetailType {
  id?: number;
  mediaType?: MEDIA_TYPE;
  override?: OverridePayload;           // 👈 yeni
}
export interface DetailModalConsumerProps {
  detail: { mediaDetail?: MovieDetail } & DetailType;
  setDetailType: (newDetailType: DetailType) => void;
}

const DetailModalContext = createContext<DetailModalConsumerProps | undefined>(undefined);
export function useDetailModal() {
    const ctx = useContext(DetailModalContext);
    if (!ctx) throw new Error("DetailModalProvider is missing in the tree.");
    return ctx;
}
const Provider = DetailModalContext.Provider;

export default function DetailModalProvider({
  children,
}: {
  children: ReactNode;
}) {
    const pathname = usePathname();
  const [detail, setDetail] = useState<
    { mediaDetail?: MovieDetail } & DetailType
  >(INITIAL_DETAIL_STATE);


    const handleChangeDetail = useCallback((newDetailType: DetailType) => {
        // 1) OVERRIDE VARSA: direkt uygula, fetch yok
        if (newDetailType.override) {
            setDetail({ mediaDetail: undefined, ...newDetailType });
            return;
        }
        // 2) Override yoksa modalı kapat (id/mediaType gelse bile TMDB kullanmıyoruz)
        setDetail(INITIAL_DETAIL_STATE);
    }, []);


  useEffect(() => {
    setDetail(INITIAL_DETAIL_STATE);
  }, [pathname, setDetail]);

    return (
        <Provider value={{ detail, setDetailType: handleChangeDetail }}>
            {children}
        </Provider>
    );
}
