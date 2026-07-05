import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";

export default function Login() {
  const { login, user } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/profile');
    }
  }, [user, navigate]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await login(form.email, form.password);
      navigate('/profile');
    } catch (e) {
      setErr(e.response?.data?.msg || "Login failed");
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "70vh" }}>
      <Card style={{ width: "100%", maxWidth: "400px", borderRadius: "8px", border: "1px solid #e0e0e0" }} className="p-4 shadow-sm">
        <Card.Body>
          <h3 className="text-center mb-4" style={{ color: "#002f34", fontWeight: 700 }}>Login</h3>
          {err && <Alert variant="danger">{err}</Alert>}
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control name="email" type="email" placeholder="Enter email" value={form.email} onChange={onChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} required />
            </Form.Group>

            <Button type="submit" className="w-100 border-0 py-2" style={{ backgroundColor: "#002f34", fontWeight: "bold" }}>
              Log in
            </Button>
          </Form>
          <div className="text-center mt-3">
            <small className="text-muted">Don't have an account? <span onClick={() => navigate('/signup')} style={{ color: "#002f34", cursor: "pointer", fontWeight: "bold" }}>Sign Up</span></small>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
