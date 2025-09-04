"use client";
import { useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import palette from "src/theme/palette";

export default function MuiThemeProvider({ children }: { children: React.ReactNode }) {
    const theme = useMemo(() => createTheme({ palette }), []);
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
