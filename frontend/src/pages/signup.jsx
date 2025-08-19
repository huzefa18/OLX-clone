import { useState,useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
export default function Signup() {
  const { signup ,user} = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [err, setErr] = useState("");
  const navigate=useNavigate();
 useEffect(()=>
     {
         if(user)
         {
             navigate('/profile')
         }
     })
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await signup(form.name, form.email, form.password);
       navigate('/profile')
    } catch (e) {
      setErr(e.response?.data?.msg || "Signup failed");
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 360, margin: "40px auto" }}>
      <h2>Sign up</h2>
      {err && <p style={{ color: "crimson" }}>{err}</p>}
      <input name="name" placeholder="Name" value={form.name} onChange={onChange} required />
      <input name="email" placeholder="Email" type="email" value={form.email} onChange={onChange} required />
      <input name="password" placeholder="Password" type="password" value={form.password} onChange={onChange} required />
      <button type="submit">Create account</button>
    </form>
  );
}
