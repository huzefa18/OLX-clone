import axios from 'axios'
let accessToken = null;
export function setAccessToken(token) {
    accessToken = token;
}
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
    withCredentials: true
});

api.interceptors.request.use((config) => {
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
})

let refreshPromise = null;
api.interceptors.response.use(
    (res) => res,
    async (err) => {
        const original = err.config;
        if (err.response?.status === 401 && !original._retry) {
            original._retry = true;
            try {
                refreshPromise = refreshPromise || api.post('/api/auth/refresh');
                const { data } = await refreshPromise;
                refreshPromise = null;
                setAccessToken(data.accessToken);
                original.headers.Authorization = `Bearer ${data.accessToken}`
                return api(original);

            }
            catch (e) {
                refreshPromise = null;
            }
        }

        throw err;
    }

)
export default api;