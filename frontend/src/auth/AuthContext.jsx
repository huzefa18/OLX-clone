import { useState,createContext,useContext } from "react";
import api,{setAccessToken} from "../api";
const AuthCntx=createContext(null);

export const useAuth=()=>useContext(AuthCntx)

export function AuthProvider ({children}){
    const [user,setUser]=useState(null);

    const signup=async(name,email ,password)=>{
        const {data}=await api.post('/api/auth/signup',{name,email,password});
        setAccessToken(data.accessToken);
        setUser(data.data);
        return data;
    }
    const login=async (email,password)=>
    {
        const {data}=await api.post('/api/auth/login',{email,password});
        setAccessToken(data.accessToken);
        setUser(data.data);
        return data;
    }
    const fetchProfile= async()=>
    {   
        const {data}=await api.et('/api/auth/profile');
        setUser(data.data);
        return data;

    }
    const logout = async () => {
    await api.post("/api/auth/logout");
    setAccessToken(null);
    setUser(null);
  };
  const value={login,logout,signup,fetchProfile,user};
  return <AuthCntx.Provider value={value}>{children}</AuthCntx.Provider>;
}



