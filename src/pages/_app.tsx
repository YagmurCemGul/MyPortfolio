import type { AppProps } from "next/app";
import ReduxProvider from "src/app/ReduxProvider";
import "src/app/globals.css";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ReduxProvider>
      <Component {...pageProps} />
    </ReduxProvider>
  );
}

