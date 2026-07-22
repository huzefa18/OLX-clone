import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import {
  Container, Card, Button, Row, Col, Spinner, Badge, Alert,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import api from "../api";

export default function Profile() {
  const { user, fetchProfile, logout } = useAuth();

  const [listings,  setListings]  = useState([]);
  const [loadingL,  setLoadingL]  = useState(true);
  const [deleteMsg, setDeleteMsg] = useState("");

  // Ensure user is loaded
  useEffect(() => {
    if (!user) fetchProfile();
  }, [user, fetchProfile]);

  // Fetch own listings
  useEffect(() => {
    if (!user) return;
    setLoadingL(true);
    api
      .get("/products/my-listings")
      .then(({ data }) => setListings(data))
      .catch(() => {})
      .finally(() => setLoadingL(false));
  }, [user]);

  const handleDelete = async (productId) => {
    if (!window.confirm("Delete this listing?")) return;
    try {
      await api.delete(`/products/${productId}`);
      setListings((prev) => prev.filter((p) => p._id !== productId));
      setDeleteMsg("Listing deleted successfully.");
      setTimeout(() => setDeleteMsg(""), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = async () => {
    try { await logout(); } catch (err) { console.error(err); }
  };

  if (!user) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <Spinner animation="border" style={{ color: "#002f34" }} />
      </Container>
    );
  }

  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh", paddingBottom: 60 }}>
      {/* ── Profile banner ── */}
      <div style={{ backgroundColor: "#002f34", padding: "36px 0 28px" }}>
        <Container style={{ maxWidth: 900 }}>
          <div className="d-flex align-items-center gap-4 flex-wrap">
            {/* Avatar */}
            <div
              className="rounded-circle d-flex align-items-center justify-content-center text-white flex-shrink-0"
              style={{
                width: 80, height: 80,
                backgroundColor: "rgba(255,255,255,0.15)",
                fontSize: "2rem",
                fontWeight: "bold",
                border: "2px solid rgba(255,255,255,0.3)",
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
            {/* Info */}
            <div style={{ color: "#fff", flexGrow: 1 }}>
              <h2 style={{ fontWeight: 700, marginBottom: 4 }}>{user.name}</h2>
              <p style={{ opacity: 0.75, marginBottom: 8, fontSize: "0.9rem" }}>
                {user.email}
              </p>
              <Badge style={{ backgroundColor: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", fontWeight: 500, padding: "5px 10px" }}>
                {listings.length} Listing{listings.length !== 1 ? "s" : ""}
              </Badge>
            </div>
            {/* Actions */}
            <div className="d-flex gap-2">
              <Link
                to="/sell"
                className="btn"
                style={{
                  backgroundColor: "#23e5db",
                  color: "#002f34",
                  fontWeight: 700,
                  borderRadius: 8,
                  padding: "8px 20px",
                  textDecoration: "none",
                }}
              >
                + Post Ad
              </Link>
              <Button
                variant="outline-light"
                onClick={handleLogout}
                style={{ borderRadius: 8, fontWeight: 600, padding: "8px 20px" }}
              >
                Logout
              </Button>
            </div>
          </div>
        </Container>
      </div>

      {/* ── My Listings ── */}
      <Container style={{ maxWidth: 900 }} className="py-4">
        {deleteMsg && (
          <Alert variant="success" className="mb-3">
            {deleteMsg}
          </Alert>
        )}

        <h4 className="mb-3" style={{ color: "#002f34", fontWeight: 700 }}>
          My Listings
        </h4>

        {loadingL ? (
          <div className="text-center py-5">
            <Spinner animation="border" style={{ color: "#002f34" }} />
          </div>
        ) : listings.length === 0 ? (
          <Card className="border-0 shadow-sm p-5 text-center">
            <p className="text-muted mb-3">You haven&apos;t posted any ads yet.</p>
            <Link
              to="/sell"
              className="btn"
              style={{ backgroundColor: "#002f34", color: "#fff", fontWeight: 600 }}
            >
              Post Your First Ad
            </Link>
          </Card>
        ) : (
          <Row className="g-3">
            {listings.map((item) => (
              <Col key={item._id} xs={12} sm={6} md={4}>
                <Card className="border-0 shadow-sm h-100" style={{ borderRadius: 10, overflow: "hidden" }}>
                  <Link to={`/product/${item._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <Card.Img
                      variant="top"
                      src={item.img}
                      alt={item.title}
                      style={{ height: 160, objectFit: "cover" }}
                    />
                    <Card.Body className="p-3">
                      <h6 style={{ fontWeight: 700, color: "#002f34", marginBottom: 4 }}>
                        {item.price}
                      </h6>
                      <p className="text-truncate small mb-1">{item.title}</p>
                      <p className="text-muted small mb-0">📍 {item.location}</p>
                      <p className="text-muted small">{item.timeAgo}</p>
                    </Card.Body>
                  </Link>
                  {/* Delete button */}
                  <Card.Footer
                    className="bg-white border-top-0 pt-0 pb-3 px-3"
                    style={{ borderTop: "1px solid #f0f0f0" }}
                  >
                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="w-100"
                      style={{ borderRadius: 6, fontWeight: 600 }}
                      onClick={() => handleDelete(item._id)}
                    >
                      🗑 Delete Listing
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
}
