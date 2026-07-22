import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Container, Row, Col, Card, Button, Spinner, Badge,
} from "react-bootstrap";
import api from "../api";
import { useAuth } from "../auth/AuthContext";
import ChatBox from "../components/chat/ChatBox";
import love from "../assets/love.svg";

export default function ProductDetail() {
  const { productId } = useParams();
  const navigate       = useNavigate();
  const { user, likeProduct } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  // ── Load product ─────────────────────────────────────────────────────────
  useEffect(() => {
    async function loadProduct() {
      try {
        const { data } = await api.get(`/products/detail/${productId}`);
        setProduct(data);
      } catch (err) {
        console.error("Error loading product:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [productId]);

  // ── Sync like state ───────────────────────────────────────────────────────
  useEffect(() => {
    if (user?.likedProducts) {
      setIsLiked(user.likedProducts.includes(productId));
    }
  }, [user, productId]);

  const handleLike = async () => {
    if (!user) { navigate("/login"); return; }
    try {
      const liked = await likeProduct(productId);
      setIsLiked(liked);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChat = () => {
    if (!user) { navigate("/login"); return; }
    setChatOpen(true);
  };

  // ── Loading / error states ────────────────────────────────────────────────
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

  if (!product) {
    return (
      <Container className="py-5 text-center">
        <h4>Product not found</h4>
        <Link
          to="/"
          className="btn mt-3"
          style={{ backgroundColor: "#002f34", color: "#fff" }}
        >
          Go Back Home
        </Link>
      </Container>
    );
  }

  const seller      = product.seller;
  const memberSince = seller?.createdAt
    ? new Date(seller.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "OLX";

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <Container className="py-5">
        <Row className="g-4">
          {/* ── Left: Product image + info ── */}
          <Col md={8}>
            <Card className="border-0 shadow-sm mb-4" style={{ borderRadius: 12 }}>
              <Card.Img
                src={product.img}
                alt={product.title}
                style={{
                  height: 450,
                  objectFit: "contain",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "12px 12px 0 0",
                }}
              />
              <Card.Body className="p-4">
                {/* Title + Like */}
                <div className="d-flex align-items-start mb-3 gap-2">
                  <h1
                    className="flex-grow-1 mb-0"
                    style={{ fontSize: "1.7rem", fontWeight: "bold", color: "#002f34" }}
                  >
                    {product.title}
                  </h1>
                  <Button
                    variant="link"
                    className="p-0 border-0"
                    onClick={handleLike}
                    title={isLiked ? "Remove from favorites" : "Add to favorites"}
                  >
                    <img
                      src={love}
                      alt="like"
                      style={{
                        height: 30,
                        filter: isLiked
                          ? "invert(21%) sepia(100%) saturate(7414%) hue-rotate(359deg) brightness(94%) contrast(117%)"
                          : "grayscale(100%) opacity(0.4)",
                        transition: "filter 0.2s",
                      }}
                    />
                  </Button>
                </div>

                {/* Price */}
                <h2 style={{ color: "#002f34", fontWeight: 700 }} className="mb-3">
                  {product.price}
                </h2>

                {/* Badges */}
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {product.category?.name && (
                    <Badge
                      style={{ backgroundColor: "#e8f5f6", color: "#002f34", fontWeight: 500, padding: "6px 12px" }}
                    >
                      {product.category.name}
                    </Badge>
                  )}
                  <Badge
                    style={{ backgroundColor: "#f5f5f5", color: "#555", fontWeight: 500, padding: "6px 12px" }}
                  >
                    📍 {product.location}
                  </Badge>
                  <Badge
                    style={{ backgroundColor: "#f5f5f5", color: "#555", fontWeight: 500, padding: "6px 12px" }}
                  >
                    🕐 {product.timeAgo}
                  </Badge>
                </div>

                <hr />

                {/* Description */}
                <h5 className="mb-2" style={{ fontWeight: 700 }}>Description</h5>
                <p className="text-muted" style={{ lineHeight: 1.7 }}>
                  {product.description && product.description.trim()
                    ? product.description
                    : `This is a ${product.title} listed in ${product.location}. 
                       Contact the seller for more details.`}
                </p>
              </Card.Body>
            </Card>
          </Col>

          {/* ── Right: Seller card + actions ── */}
          <Col md={4}>
            {/* Seller info */}
            <Card className="border-0 shadow-sm p-4 mb-3" style={{ borderRadius: 12 }}>
              <Card.Body className="p-0">
                <h5 style={{ color: "#002f34", fontWeight: 700 }} className="mb-3">
                  Seller Details
                </h5>

                <div className="d-flex align-items-center mb-4 gap-3">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center text-white flex-shrink-0"
                    style={{
                      width: 52, height: 52,
                      backgroundColor: "#002f34",
                      fontWeight: "bold",
                      fontSize: "1.3rem",
                    }}
                  >
                    {seller?.name?.charAt(0).toUpperCase() ?? "?"}
                  </div>
                  <div>
                    {seller ? (
                      <Link
                        to={`/seller/${seller._id}`}
                        style={{
                          fontWeight: 700,
                          color: "#002f34",
                          textDecoration: "none",
                          display: "block",
                          marginBottom: 2,
                        }}
                      >
                        {seller.name} ↗
                      </Link>
                    ) : (
                      <span style={{ fontWeight: 700, color: "#002f34" }}>OLX User</span>
                    )}
                    <small className="text-muted">Member since {memberSince}</small>
                  </div>
                </div>

                <Button
                  className="w-100 py-2 mb-2"
                  style={{
                    backgroundColor: "#002f34",
                    border: "none",
                    fontWeight: 600,
                    borderRadius: 8,
                  }}
                  onClick={handleChat}
                  disabled={seller && user && seller._id?.toString() === user?.id?.toString()}
                >
                  💬 Chat with Seller
                </Button>

                <Button
                  variant="outline-secondary"
                  className="w-100 py-2"
                  style={{ fontWeight: 600, borderRadius: 8, borderColor: "#002f34", color: "#002f34" }}
                  onClick={() => alert("Phone number: +92 300 0000000")}
                >
                  📞 Show Phone Number
                </Button>
              </Card.Body>
            </Card>

            {/* Posted in */}
            <Card className="border-0 shadow-sm p-4 text-center" style={{ borderRadius: 12 }}>
              <Card.Body className="p-0">
                <h6 className="mb-2" style={{ fontWeight: 700, color: "#002f34" }}>
                  Posted In
                </h6>
                <p className="text-muted mb-1">{product.location}</p>
                <small className="text-muted">{product.timeAgo}</small>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* ── Chat modal ── */}
      {seller && (
        <ChatBox
          show={chatOpen}
          onHide={() => setChatOpen(false)}
          product={product}
          seller={seller}
        />
      )}
    </>
  );
}
