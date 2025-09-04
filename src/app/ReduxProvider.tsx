"use client";
import { Provider } from "react-redux";
import store from "src/store";
import { useEffect } from "react";
import { extendedApi } from "src/store/slices/configuration";



export default function ReduxProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        void (store.dispatch as any)(
            extendedApi.endpoints.getConfiguration.initiate(undefined)
        );
    }, []);
    return <Provider store={store}>{children}</Provider>;
}

