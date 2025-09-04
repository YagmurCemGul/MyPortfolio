"use client";
import { configureStore } from "@reduxjs/toolkit";
import { tmdbApi } from "./slices/apiSlice";
import discoverReducer from "./slices/discover";
import type { Middleware } from "redux";


const store = configureStore({
  reducer: {
    discover: discoverReducer,
    [tmdbApi.reducerPath]: tmdbApi.reducer,
  },
    middleware: (getDefaultMiddleware: any) =>
        getDefaultMiddleware().concat(tmdbApi.middleware),


});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
