import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";

export default function Profile() {
  const { user, fetchProfile ,logout} = useAuth();

  useEffect(() => {
    if (!user) {
      fetchProfile()
    } 
  }, [user, fetchProfile]);
  const logoutt=async ()=>
  {
    try{
        logout();
    }
    catch(err)
    {
        console.log(`error:${err}`)
    }
  }

  if (!user) return <p>Not authenticated</p>;

  return (
    <div style={{ maxWidth: 480, margin: "40px auto" }}>
      <h2>Profile</h2>
      <p><b>Name:</b> {user.name}</p>
      <p><b>Email:</b> {user.email}</p>
      <button onClick={logoutt}>
            logout
      </button>
    </div>
  );
}
