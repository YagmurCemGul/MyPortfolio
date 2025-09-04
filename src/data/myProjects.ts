// src/data/myProjects.ts
export type ProjectTextOverride = Partial<{
    title: string;
    name: string;            // safety alias for title
    overview: string;        // short English description + links
    release_date: string;    // "YYYY-MM-DD"
    vote_average: number;    // 0..10 (used as rating)
    backdrop_path: string;   // we’ll inject your GIFs here
    href: string;              // 👈 YENİ
    skills: string[];              // ["Unity","C#","2D/3D"]
    availableIn: string | string[]; // "English" ya da ["English","Turkish"]

    matchPercent: number | string; // 80 veya "80"
    year: number | string;         // 2025
    ageLimit: number | string;     // 19 veya "19+"
    minutes: number;               // 89  (otomatik "1h 29m" formatına çevrilir)
    durationText: string;          // İstersen direkt "1h 29m" yaz
    quality: string;               // "HD", "4K"...
}>;

export type ProjectSection = {
    key: string;                 // React key
    name: string;                // section (slider) title
    textOverrides: ProjectTextOverride[];
};

/**
 * SECTIONS & CARDS
 * Order here == order on the page
 * 1) My Works (all projects on top)
 * 2) Certificates
 * 3) About Me
 */
export const PROJECT_SECTIONS: ProjectSection[] = [
    // 1) === My Works ===========================================================
    {
        key: "my-works",
        name: "My Works",
        textOverrides: [
            {
                title: "Game Development",
                overview:
                    [
                        "Unity Proficiency: Developed multiple 2D/3D macOS games with strong technical skills",
                        "Cross-Platform Deployment: Published versatile projects across platforms",
                        "Creative Problem-Solving: Blended coding expertise with creative vision for engaging gameplay",
                    ].join("\n"),
                release_date: "2024-08-01",
                vote_average: 9.9,
                backdrop_path:
                    "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMzNmdzZwODVmN3NqaTk5bTdoeXlpZmhma3QyM2k1cjRidXo3dWlqZiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/kYDFO3rkOHrkQ/giphy.gif",
                href: "https://drive.google.com/drive/folders/1uH2GI3ldJMgHm0KZ-a1n9FHpLPNbJKhK?usp=sharing",
                skills: ["Unity","C#","2D/3D Game Dev"],
                availableIn: "English, Turkish",
                matchPercent: 92,
                year: 2025,
                ageLimit: "18+",
                durationText: "15h", // oyun geliştirme (birkaç 2D/3D oyun) yaklaşık
                quality: "4K",

            },
            {
                title: "Video Production Excellence",
                overview:
                    [
                        "After Effects Mastery: Produced vertical launch video for Streamly app with advanced motion graphics",
                        "Social Media Optimization: Designed platform-specific vertical content and custom thumbnails",
                        "End-to-End Production: Managed concept, editing, and delivery of marketing video assets",
                    ].join("\n"),
                release_date: "2024-07-01",
                vote_average: 9.5,
                backdrop_path:
                    "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExMWlna2RvYnNkZm9rdng1dGVlYXFxZDExam1pcDl5NmJuNXczY2xsYiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/f5BwvEFBcgzU4/giphy.gif",
                href: "https://www.youtube.com/playlist?list=PLKNpAzZtPSx7dwGiXH2Qaq_H8sFUyxBMW",
                skills: ["Unity","C#","2D/3D Game Dev"],
                availableIn: "English, Turkish",
                matchPercent: 93,
                year: 2025,
                ageLimit: "18+",
                durationText: "8h", // video prodüksiyon + motion graphics süreci
                quality: "4K",

            },
            {
                title: "Social Media Strategy",
                overview:
                    [
                        "Social Media Strategist: Planned Shorts Drama & Lean AI campaigns with UGC and influencer focus",
                        "Content Strategy: Researched trends, hooks, and viral engagement tactics for drama-style videos",
                        "Execution: Built content calendar, audio integration, hashtags, and influencer collaborations",
                        "Community Building: Proposed UGC feeds, engagement formats, and viral participation methods",
                    ].join("\n"),
                release_date: "2024-06-15",
                vote_average: 9.3,
                backdrop_path:
                    "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExNG9nODg2M2lua3h5NDRoNHA2cnN1MnFyOWQwcGRkYjRnMGhxazZodiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/u5kHBDRVOXmywGJmgs/giphy.gif",
                href:"https://drive.google.com/drive/folders/1nAyFaovXtIXzdwThm59BRlFDvZoTIZhJ?usp=sharing",
                skills: ["Social Media Strategy","Trend Analysis","Influencer Marketing"],
                availableIn: "English, Turkish",
                matchPercent: 95,
                year: 2025,
                ageLimit: "18+",
                durationText: "20h", // trend analizi + planlama + içerik takvimi
                quality: "4K",

            },
            {
                title: "Game Marketing",
                overview:
                    [
                        "Community & Influencer Marketing Lead: Drove ContractVille engagement via Discord campaigns",
                        "Discord Strategy: Created Emoji Scavenger Hunt to increase interaction and exploration",
                        "Influencer Partnerships: Managed outreach, Steam key giveaways, and authentic promotions",
                    ].join("\n"),
                release_date: "2024-05-10",
                vote_average: 9.1,
                backdrop_path:
                    "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExYWRzcGJoa2hqZnFpdzU3a3F2MTJvdXNiMWFyY21xMjg0eXcyemR3dSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/11eCsAJh9HzeY8/giphy.gif",
                href:"https://drive.google.com/drive/folders/1KqKhYeJ6RFQd-tkmfCH7VvNd5jT7T0EN?usp=sharing",
                skills: ["Community Management","Discord Strategy","Influencer Outreach"],
                availableIn: "English, Turkish",
                matchPercent: 91,
                year: 2025,
                ageLimit: "18+",
                durationText: "12h", // Discord kampanyası + influencer outreach
                quality: "4K",

            },
            {
                title: "Sauce & Spoon",
                overview:
                    [
                        "Project Manager (Waterfall, 4 months): Led tablet rollout reducing table times by 30 min",
                        "Objectives: Boost guest count by 10%, cut food waste 25%, grow appetizers 20% regionally",
                        "Execution: Coordinated procurement, training, rollout, and stakeholder communication",
                        "Impact: +20% revenue, +14% satisfaction, waste cut in half, on-time launch success",
                    ].join("\n"),
                release_date: "2023-11-05",
                vote_average: 9.2,
                backdrop_path:
                    "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExcHVjYTl3NzJhMTRxZnNpdmFoeGQ0dXZsMjFhaWJkb29penk5OGwxMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/14fbNNlDpxjEnS/giphy.gif",
                href:"https://drive.google.com/drive/folders/1kbNXB2J4DeoKnW8ys3QRIqt6qmw4re9Z?usp=sharing",
                skills: ["Project Management","Change Management","Process Optimization"],
                availableIn: "English, Turkish",
                matchPercent: 96,
                year: 2023, // senin verdiğin bilgilerde 4 ay proje ve 23 Nisan launch var
                ageLimit: "18+",
                durationText: "4 months", // gerçek proje süresi
                quality: "4K",

            },
            {
                title: "Office Green",
                overview:
                    [
                        "Lead PM (Agile, Scrum, OKRs, $75K): Overhauled operations for Plant Pals in 6 months",
                        "Scope: Logistics optimization, supply chain software, packaging, and training program",
                        "Execution: Delivered under budget, applied Agile sprints, managed risks, improved delivery",
                        "Impact: +10% on-time deliveries, +42% satisfaction, $0.50 cost/unit cut, 75% training rate",
                    ].join("\n"),
                release_date: "2024-02-01",
                vote_average: 9.4,
                backdrop_path:
                    "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExZnJyNmZibnJtcWZ3aDk2cW52YXZrMmt2aHNlYWszbDRvY3BkeGV2cCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/tgfSxa9uYx6E0/giphy.gif",
                href:"https://drive.google.com/drive/folders/1y6KZiqmyK6je6lhyGWbN48iBHOrGqb4B?usp=sharing",
                skills: ["Agile","Supply Chain Optimization","Risk Management"],
                availableIn: "English, Turkish",
                matchPercent: 97,
                year: 2025, // 6 ay proje süresi belirtilmiş ama yıl yok
                ageLimit: "18+",
                durationText: "6 months", // gerçek proje süresi
                quality: "4K",

            },
            {
                title: "Fire & Spark",
                overview:
                    [
                        "Digital Marketing Strategist: Managed AISEO promotions & Telehealth 20 product launch",
                        "Content: Created multi-channel copy, emails, social posts, banners, and visual assets",
                        "Execution: Coordinated cross-platform launch with CRM segmentation and automation",
                        "Impact: Enhanced engagement metrics via analytics, timing optimization, and insights",
                    ].join("\n"),
                release_date: "2024-03-01",
                vote_average: 9.0,
                backdrop_path:
                    "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExbzMxejV0cjExa2xxMGZ5Y3kyejNtNTVrbGR4bThzMnpqYTl2NXFoaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Lopx9eUi34rbq/giphy.gif",
                href:"",
                skills: ["Digital Marketing","Copywriting","Email Marketing"],
                availableIn: "English, Turkish",
                matchPercent: 94,
                year: 2025,
                ageLimit: "18+",
                durationText: "10h", // kampanya + içerik üretimi + analiz
                quality: "4K",

            },
        ],
    },

    // 2) === Certificates =======================================================
    {
        key: "certificates",
        name: "Certificates",
        textOverrides: [
            {
                title: "Google Project Management — Professional Certificate",
                overview: [
                    "Google Project Management Certificate (Issued May 2024).",
                    "Credential ID: 5PD2U8JGW9AN | Coursera Verified.",
                    "Covered foundations, initiation, planning, execution, agile, and capstone projects.",
                ].join("\n"),
                release_date: "2024-05-01",
                vote_average: 9.8,
                backdrop_path:
                    "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExZ2JocWU2aHdkNjl2ODNtamYzc2oydjFnaHZ4eXVvaDk4emJrN29oMCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/5NPhdqmyRxn8I/giphy.gif",
                href:"",
                skills: ["Project Management","Agile","Planning"],
                availableIn: "English, Turkish",
                matchPercent: 95,
                year: 2024,
                ageLimit: "18+",
                durationText: "120h", // yaklaşık 120 saatlik eğitim ≈ 720 dakika
                quality: "4K",
            },
            {
                title: "McKinsey — Forward Program",
                overview: [
                    "McKinsey Forward Program (Issued Apr 2024).",
                    "Focused on leadership, communication, and problem-solving for career growth.",
                    "Credential available on Credly.",
                ].join("\n"),
                release_date: "2024-04-01",
                vote_average: 9.5,
                backdrop_path:
                    "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHRrOHVkaHVyY21xeHF5aHZzN3YzaWJzZmZzdWd4a2QwNDhpMzY5OSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/K49nKCfjp5VoULjXrZ/giphy.gif",
                href:"",
                skills: ["Leadership","Communication","Problem-Solving"],
                availableIn: "English, Turkish",
                matchPercent: 92,
                year: 2024,
                ageLimit: "18+",
                durationText: "100h", // yaklaşık 100 saatlik program ≈ 600 dakika
                quality: "4K",
            },
            {
                title: "Game & App Academy — AI-enabled Game Jam",
                overview: [
                    "Game & App Academy AI-enabled Game Jam (Issued Jun 2024).",
                    "Credential ID: 20592417662546 | Verified via Sertifier.",
                    "Hands-on collaboration in AI and game development during timed challenge.",
                ].join("\n"),
                release_date: "2024-06-01",
                vote_average: 9.2,
                backdrop_path:
                    "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExd2hrMDFsbWdkdzFpdnJ6M2ZwaGUxYjd5NG16d3oyYm01azVteHY2dyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/5eFp76zhsq3uw/giphy.gif",
                href:"",
                skills: ["Game Development","AI Integration","Teamwork"],
                availableIn: "English, Turkish",
                matchPercent: 93,
                year: 2024,
                ageLimit: "18+",
                durationText: "48h", // tipik 2 gün (48 saat) süren game jam ≈ 2880 dakika
                quality: "4K",
            },
        ],
    },

    // 3) === About Me ===========================================================
    {
        key: "about-me",
        name: "About Me",
        textOverrides: [
            {
                title: "About Me",
                overview: [
                    "Project manager experienced in technology, e-commerce, and creative industries.",
                    "Expertise in Agile delivery, data-driven marketing, and creative production.",
                    "Certified in Google PM & McKinsey; proven KPI growth with cost/time efficiency.",
                    "Transforms challenges into scalable solutions via collaboration and impact focus.",
                ].join("\n"),
                release_date: "2025-01-01",
                vote_average: 9.4,
                backdrop_path:
                    "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExdHpvZmIyeGk3bWgxZnV1dzY5NW42dTd1eHRmZDduNjdoN3A4Nzh3dCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/jwFbMfYthIM6pttfjF/giphy.gif",
                href:"",
                skills: ["Project Management","Agile","Marketing Strategy"],
                availableIn: "English, Turkish",
                matchPercent: 90,
                year: 2025,
                ageLimit: "18+",
                durationText: "5m", // okunabilir profil süresi ≈ 5 dakika
                quality: "4K",
            },
        ],
    },
];
