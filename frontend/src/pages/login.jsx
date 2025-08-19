import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import  {useAuth}  from "../auth/AuthContext";

export default function Login() {
  const { login,user } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
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
      await login(form.email, form.password);
      navigate('/profile')
    } catch (e) {
      setErr(e.response?.data?.msg || "Login failed");
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 360, margin: "40px auto" }}>
      <h2>Log in</h2>
      {err && <p style={{ color: "crimson" }}>{err}</p>}
      <input name="email" placeholder="Email" type="email" value={form.email} onChange={onChange} required />
      <input name="password" placeholder="Password" type="password" value={form.password} onChange={onChange} required />
      <button type="submit">Log in</button>
    </form>
  );
}
