
//src/app/projects/layout.tsx
"use client";

import Box from "@mui/material/Box";
import DetailModal from "src/components/DetailModal";
import VideoPortalContainer from "src/components/VideoPortalContainer";
import DetailModalProvider from "src/providers/DetailModalProvider";
import PortalProvider from "src/providers/PortalProvider";
import SoundProvider from "src/providers/SoundProvider";
import { MAIN_PATH } from "src/constant";
import { Footer, MainHeader } from "src/components/layouts";
import { usePathname } from "next/navigation";

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
                position: "relative",
            }}
        >
            {/* Header tüm sayfalarda görünsün */}
            <MainHeader />

            {/* SADECE BURADA provider hiyerarşisi olacak */}
            <SoundProvider>
                <DetailModalProvider>
                    <PortalProvider>
                        {/* Modal ve Portal Container provider'lar içinde */}
                        <DetailModal />
                        {children}
                        <VideoPortalContainer />
                    </PortalProvider>
                </DetailModalProvider>
            </SoundProvider>

            {/* Watch sayfası dışında footer */}
            {pathname !== `/${MAIN_PATH.watch}` && <Footer />}
        </Box>
    );
}
