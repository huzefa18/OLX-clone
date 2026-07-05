export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080';
export async function GetJSON(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`error fetching data from ${url} err:${response.status}`)
    }
    return response.json();
}
