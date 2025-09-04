// src/utils/image.ts
export function resolveImageSrc(
    path?: string | null,
    base?: string,
    size: string = "w780"
) {
    if (!path) return undefined;
    if (/^https?:\/\//i.test(path)) return path;       // tam URL ise direkt kullan
    return `${base ?? ""}${size}${path}`;              // TMDB yolu ise base + size
}
