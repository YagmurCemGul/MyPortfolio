"use client";

import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";

import DetailModal from "src/components/DetailModal";
import VideoPortalContainer from "src/components/VideoPortalContainer";
import DetailModalProvider from "src/providers/DetailModalProvider";
import PortalProvider from "src/providers/PortalProvider";
import { MAIN_PATH } from "src/constant";
import { Footer, MainHeader } from "src/components/layouts";
// import MainLoadingScreen from "src/components/MainLoadingScreen";

export default function MainLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <Box
            sx={{
                width: "100%",
                minHeight: "100vh",
                bgcolor: "background.default",
            }}
        >
            <MainHeader />
            {/* Next.js App Router'da loading için route'a özel `loading.tsx` veya Suspense kullanın */}
            {/* <MainLoadingScreen /> */}

            <DetailModalProvider>
                <DetailModal />
                <PortalProvider>
                    {children}
                    <VideoPortalContainer />
                </PortalProvider>
            </DetailModalProvider>

            {pathname !== `/${MAIN_PATH.watch}` && <Footer />}
        </Box>
    );
}
