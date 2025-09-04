
//src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import "@/components/PillNav.css";
import ReduxProvider from "src/app/ReduxProvider";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import MUIRegistry from "src/theme/MUIRegistry";
import MuiThemeProvider from "./MuiThemeProvider";

export const viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
};


/* 👇 EKLE: Geist fontlarını next/font ile bağla */
import { Geist, Geist_Mono } from "next/font/google";
const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
    viewport: "width=device-width, initial-scale=1, maximum-scale=1",
    title: "Welcome | Yagmur Cem Gul",
    description: "Portfolio welcome page",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        /* 👇 EKLE: font değişken class’larını <html>’e bas */
        <html lang="tr" className={`${geistSans.variable} ${geistMono.variable}`}>
            <head>
                {/* Preload audio assets to reduce start latency */}
                <link rel="preload" as="audio" href="/assets/netflix-sound.mp3" />
                <link rel="preload" as="audio" href="/assets/among-us-eject-sound-effect.mp3" />
            </head>
            <body>
                <ReduxProvider>
                    <MUIRegistry>
                        <MuiThemeProvider>
                            {children}
                        </MuiThemeProvider>
                    </MUIRegistry>
                </ReduxProvider>
            </body>
        </html>

    );
}
