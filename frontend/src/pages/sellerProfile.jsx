import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Container, Row, Col, Card, Spinner, Badge,
} from "react-bootstrap";
import api from "../api";

export default function SellerProfile() {
  const { sellerId } = useParams();
  const [seller,   setSeller]   = useState(null);
  const [listings, setListings] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get(`/api/auth/user/${sellerId}`);
        setSeller(data.data);
        setListings(data.data.listings || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [sellerId]);

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <Spinner animation="border" style={{ color: "#002f34" }} />
      </Container>
    );
  }

  if (!seller) {
    return (
      <Container className="py-5 text-center">
        <h4>Seller not found</h4>
        <Link
          to="/"
          className="btn mt-3"
          style={{ backgroundColor: "#002f34", color: "#fff" }}
        >
          Go Home
        </Link>
      </Container>
    );
  }

  const memberSince = new Date(seller.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year:  "numeric",
  });

  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh", paddingBottom: 60 }}>
      {/* ── Hero banner ── */}
      <div style={{ backgroundColor: "#002f34", padding: "36px 0 28px" }}>
        <Container>
          <div className="d-flex align-items-center gap-4">
            <div
              className="rounded-circle d-flex align-items-center justify-content-center text-white"
              style={{
                width: 80, height: 80,
                backgroundColor: "rgba(255,255,255,0.15)",
                fontSize: "2rem",
                fontWeight: "bold",
                flexShrink: 0,
                border: "2px solid rgba(255,255,255,0.3)",
              }}
            >
              {seller.name.charAt(0).toUpperCase()}
            </div>
            <div style={{ color: "#fff" }}>
              <h2 style={{ fontWeight: 700, marginBottom: 4 }}>{seller.name}</h2>
              <p style={{ opacity: 0.75, marginBottom: 6 }}>Member since {memberSince}</p>
              <Badge
                style={{
                  backgroundColor: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  fontWeight: 500,
                  padding: "5px 10px",
                }}
              >
                {listings.length} Active Listing{listings.length !== 1 ? "s" : ""}
              </Badge>
            </div>
          </div>
        </Container>
      </div>

      {/* ── Listings ── */}
      <Container className="py-4">
        <h4 className="mb-3" style={{ color: "#002f34", fontWeight: 700 }}>
          Ads by {seller.name}
        </h4>

        {listings.length === 0 ? (
          <Card className="border-0 shadow-sm p-5 text-center">
            <p className="text-muted mb-0">This seller has no active listings.</p>
          </Card>
        ) : (
          <Row className="g-3">
            {listings.map((item) => (
              <Col key={item._id} xs={12} sm={6} md={3}>
                <Link
                  to={`/product/${item._id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Card
                    className="h-100 shadow-sm border-0"
                    style={{ borderRadius: 10, overflow: "hidden", transition: "transform 0.15s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                  >
                    <Card.Img
                      variant="top"
                      src={item.img}
                      alt={item.title}
                      style={{ height: 180, objectFit: "cover" }}
                    />
                    <Card.Body className="p-3">
                      <h5 className="mb-1" style={{ fontWeight: 700, color: "#002f34" }}>
                        {item.price}
                      </h5>
                      <p className="text-truncate mb-1 small">{item.title}</p>
                      <p className="text-muted small mb-0">{item.location}</p>
                      <p className="text-muted small">{item.timeAgo}</p>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
}
