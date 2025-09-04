/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // Build'ı ESLint hatalarında durdurma
        ignoreDuringBuilds: true,
    },
    typescript: {
        // Tip hataları build'i kırmasın (isteğe bağlı)
        ignoreBuildErrors: true,
    },
    images: {
        remotePatterns: [
            { protocol: 'https', hostname: 'image.tmdb.org' },
            { protocol: 'https', hostname: 'i.ytimg.com' },
            // kendi CDN/domain'lerin varsa buraya ekle
        ],
    },
};
module.exports = nextConfig;
