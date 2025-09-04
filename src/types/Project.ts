export type Project = {
    id: string;                  // benzersiz
    title: string;               // kart başlığı
    overview: string;            // kısa açıklama
    poster_path: string;         // /public altındaki görsel veya tam URL
    backdrop_path?: string;      // modal/hero için geniş görsel (opsiyonel)
    release_date?: string;       // "2024-12-01" (opsiyonel)
    vote_average?: number;       // 0..10 (opsiyonel, istersen gösteririz)
    genres?: string[];           // etiketler (opsiyonel)
    youtubeKey?: string;         // modal Play için istersen YouTube key
    link?: string;               // “Detay” tıklandığında gidecek URL
};
