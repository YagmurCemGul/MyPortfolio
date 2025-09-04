const BASE = "ux:counters:v1";

function k(title: string) {
    return `${BASE}:${title}`;
}

export type CardCounters = {
    liked: boolean;
    added: boolean;
    likedCount: number;
    addedCount: number;
};

export function loadCounters(title: string): CardCounters {
    try {
        const raw = localStorage.getItem(k(title));
        if (raw) return JSON.parse(raw) as CardCounters;

        // İlk kez gören bir ziyaretçi için "makul" bir başlangıç üret
        const likedCount = 200 + Math.floor(Math.random() * 400);  // 200..599
        const addedCount = 40 + Math.floor(Math.random() * 120);   // 40..159

        const data: CardCounters = {
            liked: false,
            added: false,
            likedCount,
            addedCount,
        };
        localStorage.setItem(k(title), JSON.stringify(data));
        return data;
    } catch {
        // localStorage kapalıysa vs.
        return { liked: false, added: false, likedCount: 300, addedCount: 80 };
    }
}

export function saveCounters(title: string, data: CardCounters) {
    try {
        localStorage.setItem(k(title), JSON.stringify(data));
    } catch {}
}
