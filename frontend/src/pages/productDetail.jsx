import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import api from "../api";
import { useAuth } from "../auth/AuthContext";
import love from "../assets/love.svg";

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user, likeProduct } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      try {
        const { data } = await api.get(`/products/detail/${productId}`);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        console.error("Error loading product:", err);
        setLoading(false);
      }
    }
    loadProduct();
  }, [productId]);

  useEffect(() => {
    if (user && user.likedProducts) {
      setIsLiked(user.likedProducts.includes(productId));
    }
  }, [user, productId]);

  const handleLike = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      const liked = await likeProduct(productId);
      setIsLiked(liked);
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

  if (!product) {
    return (
      <Container className="py-5 text-center">
        <h4>Product not found</h4>
        <Link to="/" className="btn mt-3" style={{ backgroundColor: "#002f34", color: "#fff" }}>Go Back Home</Link>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="g-4">
        <Col md={8}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Img src={product.img} alt={product.title} style={{ height: "450px", objectFit: "contain", backgroundColor: "#f8f9fa", borderRadius: "8px 8px 0 0" }} />
            <Card.Body className="p-4">
              <div className="d-flex align-items-center mb-3">
                <h1 className="mb-0 flex-grow-1" style={{ fontSize: "2rem", fontWeight: "bold" }}>{product.title}</h1>
                <Button variant="link" className="p-0 border-0" onClick={handleLike}>
                  <img src={love} alt="like" style={{ height: 32, filter: isLiked ? "invert(21%) sepia(100%) saturate(7414%) hue-rotate(359deg) brightness(94%) contrast(117%)" : "none" }} />
                </Button>
              </div>
              <h2 style={{ color: "#002f34", fontWeight: 700 }} className="mb-4">{product.price}</h2>
              <hr />
              <h5 className="mb-3">Description</h5>
              <p className="text-muted" style={{ lineHeight: 1.6 }}>
                This is a high quality {product.title} located in {product.location}. 
                It is listed in the category {product.category?.name || "General"}. 
                Please contact the seller using the details provided on the right.
              </p>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="border-0 shadow-sm p-4 mb-4">
            <Card.Body>
              <h4 style={{ color: "#002f34", fontWeight: 700 }} className="mb-3">Seller Details</h4>
              <div className="d-flex align-items-center mb-4">
                <div className="rounded-circle d-flex align-items-center justify-content-center text-white" style={{ width: 50, height: 50, backgroundColor: "#002f34", fontWeight: "bold", fontSize: "1.2rem" }}>
                  OLX
                </div>
                <div className="ms-3">
                  <h6 className="mb-0 font-weight-bold">OLX User</h6>
                  <small className="text-muted">Member since July 2026</small>
                </div>
              </div>
              <Button style={{ backgroundColor: "#002f34", border: "none" }} className="w-100 py-2 font-weight-bold mb-3">
                Chat with Seller
              </Button>
              <Button variant="outline-dark" className="w-100 py-2 font-weight-bold">
                Show Phone Number
              </Button>
            </Card.Body>
          </Card>

          <Card className="border-0 shadow-sm p-4 text-center">
            <Card.Body>
              <h5 className="mb-2">Posted In</h5>
              <p className="text-muted mb-1">{product.location}</p>
              <small className="text-muted">{product.timeAgo}</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
