import { useState, useEffect, useCallback } from "react";
import { Container, Row, Col, Card, Button, Spinner, Badge } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useAuth } from "../auth/AuthContext";
import { fetchCategories } from "../../store/categories/CategorySlice";
import BackToTop from "../components/backToTop/backToTop";
import Slider from "../components/slider/slider";
import api from "../api";
import love from "../assets/love.svg";
import rightArrow from "../assets/rightArrow.svg";

const PAGE_SIZE = 8;

function Category() {
  const dispatch   = useDispatch();
  const navigate   = useNavigate();
  const { list, status } = useSelector((s) => s.categories);
  const { categoryKey }  = useParams();
  const { user, likeProduct } = useAuth();

  const [products,     setProducts]     = useState([]);
  const [totalPages,   setTotalPages]   = useState(1);
  const [currentPage,  setCurrentPage]  = useState(1);
  const [loadingProds, setLoadingProds] = useState(false);

  // Load categories into Redux if needed
  useEffect(() => {
    if (status === "idle") dispatch(fetchCategories());
  }, [dispatch, status]);

  // Fetch paginated products when category or page changes
  const loadProducts = useCallback(
    async (page) => {
      setLoadingProds(true);
      try {
        const { data } = await api.get(
          `/products/${categoryKey}?page=${page}&limit=${PAGE_SIZE}`
        );
        setProducts(data.products || []);
        setTotalPages(data.totalPages || 1);
        setCurrentPage(data.currentPage || page);
      } catch (err) {
        console.error("Error loading products:", err);
      } finally {
        setLoadingProds(false);
      }
    },
    [categoryKey]
  );

  useEffect(() => {
    setCurrentPage(1);
    loadProducts(1);
  }, [categoryKey]);

  const handlePageChange = (page) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    loadProducts(page);
  };

  const handleLikeClick = async (productId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { navigate("/login"); return; }
    try {
      await likeProduct(productId);
    } catch (err) {
      console.error(err);
    }
  };

  // Find category name from redux store
  const categoryInfo = list.find((obj) => obj._id === categoryKey);

  if (status === "loading" || (status !== "loading" && !categoryInfo && list.length === 0)) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
        <Spinner animation="border" style={{ color: "#002f34" }} />
      </Container>
    );
  }

  const categoryName = categoryInfo?.name ?? "Category";

  return (
    <div style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <Slider />
      <BackToTop />

      <Container className="py-4">
        {/* ── Breadcrumb ── */}
        <div className="d-flex align-items-center gap-2 mb-3" style={{ fontSize: "0.9rem" }}>
          <Link to="/" style={{ textDecoration: "none", color: "rgba(0,47,52,.6)" }}>
            Home
          </Link>
          <img src={rightArrow} alt="" style={{ height: 16 }} />
          <span style={{ color: "rgba(0,47,52,.85)", fontWeight: 600 }}>
            {categoryName}
          </span>
        </div>

        {/* ── Header ── */}
        <div className="mb-4">
          <h2 style={{ fontWeight: 700, color: "#002f34" }}>
            {categoryName} in Pakistan
          </h2>
          <Badge bg="secondary" style={{ fontSize: "0.8rem" }}>
            Page {currentPage} of {totalPages}
          </Badge>
        </div>

        {/* ── Products grid ── */}
        {loadingProds ? (
          <div className="text-center py-5">
            <Spinner animation="border" style={{ color: "#002f34" }} />
          </div>
        ) : products.length === 0 ? (
          <Card className="border-0 shadow-sm p-5 text-center">
            <p className="text-muted mb-0">No listings found in this category.</p>
          </Card>
        ) : (
          <Row className="g-3">
            {products.map((obj) => {
              const isLiked =
                user?.likedProducts?.includes(obj._id);
              return (
                <Col key={obj._id} xs={12} sm={6} md={3}>
                  <Card
                    className="h-100 border-0 shadow-sm position-relative"
                    style={{ borderRadius: 10, overflow: "hidden", transition: "transform 0.15s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
                  >
                    <Link
                      to={`/product/${obj._id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <Card.Img
                        variant="top"
                        src={obj.img}
                        alt={obj.title}
                        style={{ height: 190, objectFit: "cover" }}
                      />
                      <Card.Body className="p-3">
                        <h6 style={{ fontWeight: 700, color: "#002f34", marginBottom: 4 }}>
                          {obj.price}
                        </h6>
                        <p className="text-truncate small mb-1">{obj.title}</p>
                        <p className="text-muted small mb-0">📍 {obj.location}</p>
                        <p className="text-muted small">{obj.timeAgo}</p>
                      </Card.Body>
                    </Link>

                    {/* Like button */}
                    <Button
                      variant="link"
                      className="position-absolute p-0 border-0"
                      style={{ top: 10, right: 10, zIndex: 10 }}
                      onClick={(e) => handleLikeClick(obj._id, e)}
                    >
                      <img
                        src={love}
                        alt="like"
                        style={{
                          height: 24,
                          filter: isLiked
                            ? "invert(21%) sepia(100%) saturate(7414%) hue-rotate(359deg) brightness(94%) contrast(117%)"
                            : "grayscale(100%) opacity(0.4)",
                          transition: "filter 0.2s",
                        }}
                      />
                    </Button>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}

        {/* ── Pagination controls ── */}
        {!loadingProds && totalPages > 1 && (
          <div className="d-flex justify-content-center align-items-center gap-2 mt-5">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1}
              style={{
                backgroundColor: currentPage <= 1 ? "#e0e0e0" : "#002f34",
                border: "none",
                borderRadius: 8,
                padding: "8px 20px",
                fontWeight: 600,
                color: currentPage <= 1 ? "#999" : "#fff",
              }}
            >
              ← Previous
            </Button>

            {/* Page numbers */}
            <div className="d-flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (p) =>
                    p === 1 ||
                    p === totalPages ||
                    Math.abs(p - currentPage) <= 1
                )
                .reduce((acc, p, idx, arr) => {
                  if (idx > 0 && p - arr[idx - 1] > 1) {
                    acc.push("...");
                  }
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === "..." ? (
                    <span
                      key={`ellipsis-${i}`}
                      style={{ padding: "8px 6px", color: "#999", fontWeight: 500 }}
                    >
                      …
                    </span>
                  ) : (
                    <Button
                      key={p}
                      onClick={() => handlePageChange(p)}
                      style={{
                        backgroundColor: p === currentPage ? "#002f34" : "#fff",
                        color: p === currentPage ? "#fff" : "#002f34",
                        border: "1px solid #002f34",
                        borderRadius: 8,
                        width: 40,
                        padding: "8px 0",
                        fontWeight: 600,
                        fontSize: "0.875rem",
                      }}
                    >
                      {p}
                    </Button>
                  )
                )}
            </div>

            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              style={{
                backgroundColor: currentPage >= totalPages ? "#e0e0e0" : "#002f34",
                border: "none",
                borderRadius: 8,
                padding: "8px 20px",
                fontWeight: 600,
                color: currentPage >= totalPages ? "#999" : "#fff",
              }}
            >
              Next →
            </Button>
          </div>
        )}
      </Container>
    </div>
  );
}

export default Category;