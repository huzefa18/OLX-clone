import axios from 'axios'
let accessToken=null;
export function setAccessToken(token){
    accessToken=token;
}
const api=axios.create({
    baseURL:'http://localhost:8080',
    withCredentials:true 
});

api.interceptors.request.use((config)=>
{
    if(accessToken) config.headers.Authorization=`Bearer ${accessToken}`;
    return config;
})

let refreshPromise=null;
api.interceptors.response.use(
    (res)=>res,
    async (err)=>{
        const original=err.config;
        original._retry=true;
         if (err.response?.status === 401 && !original._retry)
        {try{
            refreshPromise=refreshPromise || api.post('/api/uth/refresh');
            const {data}=refreshPromise;
            refreshPromise=null;
            setAccessToken(data.accessToken);
            original.headers.Authorization=`Bearer ${data.accessToken}`
            return api(original);

        }
        catch(e){
            refreshPromise=null;
        }}

        throw err;
    }

)
export default api;