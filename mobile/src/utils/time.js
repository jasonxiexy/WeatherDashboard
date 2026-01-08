// src/utils/time.js
export function formatTorontoTime(isoString) {
    if (!isoString) return "—";
    const d = new Date(isoString);
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: "America/Toronto",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(d);
}
