//src/theme/MUIRegistry.tsx
"use client";
import * as React from "react";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { useServerInsertedHTML } from "next/navigation";
import { ThemeProvider, createTheme, responsiveFontSizes } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import palette from "./palette"; // (dosya bu klasördeyse)

function createEmotionCache() {
    const cache = createCache({ key: "css", prepend: true });
    cache.compat = true;
    return cache;
}
let theme = createTheme({
    palette,
    typography: {
        // Başlıklar ve gövde yazısı mobilde de güzel görünsün
        h4: { fontWeight: 700, letterSpacing: 0.2 },
        h5: { fontWeight: 700, letterSpacing: 0.2 },
        body1: { lineHeight: 1.5 },
    },
    components: {
        // Container’ların default padding’i (mobilde biraz daha sıkı)
        MuiContainer: {
            styleOverrides: {
                root: {
                    paddingLeft: 12,
                    paddingRight: 12,
                    "@media (min-width:600px)": {
                        paddingLeft: 16,
                        paddingRight: 16,
                    },
                },
            },
        },
    },
});
theme = responsiveFontSizes(theme);

export default function MUIRegistry({ children }: { children: React.ReactNode }) {
    const [cache] = React.useState(() => {
        const c = createEmotionCache();
        const prevInsert = c.insert;
        let inserted: string[] = [];
        c.insert = (...args) => {
            const serialized = args[1];
            if (!c.inserted[serialized.name]) inserted.push(serialized.name);
            // @ts-ignore
            return prevInsert(...args);
        };
        // @ts-ignore
        c.flush = () => {
            const prev = inserted;
            inserted = [];
            return prev;
        };
        return c as typeof c & { flush?: () => string[] };
    });

    useServerInsertedHTML(() => {
        // @ts-ignore
        const names = cache.flush?.() ?? [];
        if (names.length === 0) return null;
        let styles = "";
        for (const name of names) {
            styles += cache.inserted[name];
        }
        return (
            <style
                data-emotion={`${cache.key} ${names.join(" ")}`}
                dangerouslySetInnerHTML={{ __html: styles }}
            />
        );
    });

    return (
        <CacheProvider value={cache}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </CacheProvider>
    );

}
