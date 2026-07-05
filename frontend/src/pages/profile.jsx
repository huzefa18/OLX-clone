import { useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { Container, Card, Button } from "react-bootstrap";

export default function Profile() {
  const { user, fetchProfile, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  const logoutt = async () => {
    try {
      await logout();
    } catch (err) {
      console.log(`error:${err}`);
    }
  };

  if (!user) return <p className="text-center mt-5">Not authenticated</p>;

  return (
    <Container className="d-flex align-items-center justify-content-center" style={{ minHeight: "60vh" }}>
      <Card style={{ width: "100%", maxWidth: "450px", borderRadius: "8px", border: "1px solid #e0e0e0" }} className="p-4 text-center shadow-sm">
        <Card.Body>
          <div className="mb-3 d-flex align-items-center justify-content-center rounded-circle mx-auto" style={{ width: "80px", height: "80px", backgroundColor: "#f2f4f5" }}>
            <span style={{ fontSize: "2rem", color: "#002f34", fontWeight: "bold" }}>{user.name.charAt(0).toUpperCase()}</span>
          </div>
          <h3 className="mb-2" style={{ color: "#002f34", fontWeight: 700 }}>{user.name}</h3>
          <p className="text-muted mb-4">{user.email}</p>
          
          <Button variant="outline-danger" className="w-100 py-2" style={{ fontWeight: "bold" }} onClick={logoutt}>
            Logout
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}
