import { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../auth/AuthContext";
import love from "../assets/love.svg";

export default function Favorites() {
  const { user, likeProduct } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    async function fetchFavorites() {
      try {
        const { data } = await api.get("/products/favorites/list");
        setFavorites(data);
        setLoading(false);
      } catch (err) {
        console.error("Error loading favorites:", err);
        setLoading(false);
      }
    }

    fetchFavorites();
  }, [user, navigate]);

  const handleUnlike = async (productId, e) => {
    e.stopPropagation();
    e.preventDefault();
    try {
      await likeProduct(productId);
      setFavorites(prev => prev.filter(item => item._id !== productId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <Spinner animation="border" style={{ color: "#002f34" }} />
      </Container>
    );
  }

  return (
    <Container className="py-5" style={{ minHeight: "70vh" }}>
      <h2 className="mb-4" style={{ color: "#002f34", fontWeight: 700 }}>My Favorites</h2>
      
      {favorites.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">You haven't added any favorites yet.</p>
          <Link to="/" className="btn font-weight-bold" style={{ backgroundColor: "#002f34", color: "#fff" }}>
            Explore Ads
          </Link>
        </div>
      ) : (
        <Row className="g-3">
          {favorites.map((obj) => (
            <Col key={obj._id} xs={12} sm={6} md={3}>
              <Link to={`/product/${obj._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                <Card className="h-100 shadow-sm border-0 position-relative" style={{ borderRadius: "8px", overflow: "hidden" }}>
                  <Card.Img
                    variant="top"
                    alt={obj.title}
                    src={obj.img}
                    style={{ objectFit: "cover", height: 200 }}
                  />
                  <Card.Body className="p-3">
                    <Card.Title className="d-flex align-items-center justify-content-between mb-2">
                      <b style={{ color: "#002f34" }}>{obj.price}</b>
                      <Button variant="link" className="p-0 border-0" onClick={(e) => handleUnlike(obj._id, e)}>
                        <img src={love} alt="unlike" style={{ height: 22, filter: "invert(21%) sepia(100%) saturate(7414%) hue-rotate(359deg) brightness(94%) contrast(117%)" }} />
                      </Button>
                    </Card.Title>
                    <Card.Text className="text-truncate mb-1">{obj.title}</Card.Text>
                    <Card.Text className="text-muted small mb-0">{obj.location}</Card.Text>
                    <Card.Text className="text-muted small">{obj.timeAgo}</Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
