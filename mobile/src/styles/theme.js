// src/styles/theme.js
export const themes = {
    dark: {
        bg: "#0B1020",
        text: "#EAF0FF",
        muted: "rgba(234,240,255,0.7)",
        cardBorder: "rgba(255,255,255,0.10)",
    },
    light: {
        bg: "#F5F7FF",
        text: "#0B1020",
        muted: "rgba(11,16,32,0.65)",
        cardBorder: "rgba(0,0,0,0.08)",
    },
};

// “tone” drives gradient-like colors (we’ll fake gradient with layered views)
export const cardTones = {
    sun: { a: "rgba(255, 200, 60, 0.22)", b: "rgba(255, 150, 40, 0.10)" },
    sky: { a: "rgba(90, 180, 255, 0.22)", b: "rgba(70, 120, 255, 0.10)" },
    cloud: { a: "rgba(160, 180, 210, 0.22)", b: "rgba(120, 140, 170, 0.10)" },
    rain: { a: "rgba(80, 140, 255, 0.22)", b: "rgba(60, 90, 180, 0.10)" },
    snow: { a: "rgba(220, 240, 255, 0.22)", b: "rgba(180, 220, 255, 0.10)" },
    storm: { a: "rgba(200, 120, 255, 0.22)", b: "rgba(120, 80, 255, 0.10)" },
    neutral: { a: "rgba(180, 180, 200, 0.18)", b: "rgba(120, 120, 150, 0.08)" },
};
