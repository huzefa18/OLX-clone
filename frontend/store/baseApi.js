let rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
if (rawApiUrl.endsWith('/')) {
    rawApiUrl = rawApiUrl.slice(0, -1);
}
export const API_BASE = rawApiUrl;
export async function GetJSON(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`error fetching data from ${url} err:${response.status}`)
    }
    return response.json();
}
