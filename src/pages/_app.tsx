import type { AppProps } from "next/app";
import ReduxProvider from "src/app/ReduxProvider";
import DetailModalProvider from "src/providers/DetailModalProvider";
import PortalProvider from "src/providers/PortalProvider";
import DetailModal from "src/components/DetailModal";
import VideoPortalContainer from "src/components/VideoPortalContainer";
import SoundProvider from "src/providers/SoundProvider";
import "src/app/globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ReduxProvider>
      <SoundProvider>
        <DetailModalProvider>
          <PortalProvider>
            {/* Global modal + hover portal for pages/ router */}
            <DetailModal />
            <VideoPortalContainer />
            <Component {...pageProps} />
          </PortalProvider>
        </DetailModalProvider>
      </SoundProvider>
    </ReduxProvider>
  );
}

