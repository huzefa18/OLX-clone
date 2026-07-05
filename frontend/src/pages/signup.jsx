import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";

export default function Signup() {
  const { signup, user } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
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
      await signup(form.name, form.email, form.password);
      navigate('/profile');
    } catch (e) {
      setErr(e.response?.data?.msg || "Signup failed");
    }
  };

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "75vh" }}>
      <Card style={{ width: "100%", maxWidth: "400px", borderRadius: "8px", border: "1px solid #e0e0e0" }} className="p-4 shadow-sm">
        <Card.Body>
          <h3 className="text-center mb-4" style={{ color: "#002f34", fontWeight: 700 }}>Create Account</h3>
          {err && <Alert variant="danger">{err}</Alert>}
          <Form onSubmit={onSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control name="name" type="text" placeholder="Enter name" value={form.name} onChange={onChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control name="email" type="email" placeholder="Enter email" value={form.email} onChange={onChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control name="password" type="password" placeholder="Password" value={form.password} onChange={onChange} required />
            </Form.Group>

            <Button type="submit" className="w-100 border-0 py-2" style={{ backgroundColor: "#002f34", fontWeight: "bold" }}>
              Sign Up
            </Button>
          </Form>
          <div className="text-center mt-3">
            <small className="text-muted">Already have an account? <span onClick={() => navigate('/login')} style={{ color: "#002f34", cursor: "pointer", fontWeight: "bold" }}>Log In</span></small>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
