"use client";

import { unstable_ClassNameGenerator as ClassNameGenerator } from "@mui/material/className";

// Next.js (özellikle HMR) altında dosya birden fazla kez çalışabileceği için tek sefer ayarla
if (!(globalThis as any).__MUI_CLASSNAME_CONFIGURED__) {
    ClassNameGenerator.configure((componentName) => {
        let newComponentName = componentName;
        // Mui önekini değiştir
        newComponentName = newComponentName.replace("Mui", "Netflix");
        // Örnek: Button sınıf adını değiştir
        newComponentName = newComponentName.replace("Button", "Btn");
        return newComponentName;
    });
    (globalThis as any).__MUI_CLASSNAME_CONFIGURED__ = true;
}

export {};
