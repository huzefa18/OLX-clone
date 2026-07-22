import Slider from "../components/slider/slider";
import SmallIcons from "../components/categorySmallIcons/smallicons";
import CardHolder from "../components/cardHolder/cardHolder";
import BackToTop from "../components/backToTop/backToTop";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { fetchCategories } from "../../store/categories/CategorySlice";
import { selectSearchResults } from "../../store/products/ProductsSlice";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import love from "../assets/love.svg";
import api from "../api";

const SEARCH_PAGE_SIZE = 8;

function Home() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const { user, likeProduct } = useAuth();
  const { list, status } = useSelector((s) => s.categories);
  const searchResults   = useSelector(selectSearchResults);

  // ── Pagination state for search results ─────────────────────────────────
  const [searchPage,   setSearchPage]   = useState(1);
  const [searchTotal,  setSearchTotal]  = useState(1);
  const [pagedResults, setPagedResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    if (status === "idle") dispatch(fetchCategories());
  }, [status, dispatch]);

  // When searchResults change (new search kicked off from navbar), reset page
  useEffect(() => {
    if (searchResults && searchResults.length > 0) {
      setPagedResults(searchResults.slice(0, SEARCH_PAGE_SIZE));
      setSearchPage(1);
    }
  }, [searchResults]);

  // Fetch a specific search page when user clicks pagination
  const fetchSearchPage = async (query, page) => {
    setSearchLoading(true);
    try {
      const { data } = await api.get(
        `/products?search=${encodeURIComponent(query)}&page=${page}&limit=${SEARCH_PAGE_SIZE}`
      );
      setPagedResults(data.flat || []);
      setSearchTotal(data.totalPages || 1);
      setSearchPage(page);
    } catch (err) {
      console.error(err);
    } finally {
      setSearchLoading(false);
    }
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

  // ── Product card used in search results ─────────────────────────────────
  const ProductCard = ({ obj }) => {
    const isLiked = user?.likedProducts?.includes(obj._id);
    return (
      <Col xs={12} sm={6} md={3}>
        <Card
          className="h-100 position-relative border-0 shadow-sm"
          style={{ borderRadius: 10, overflow: "hidden", transition: "transform 0.15s" }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        >
          <Link to={`/product/${obj._id}`} style={{ textDecoration: "none", color: "inherit" }}>
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
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={{ backgroundColor: "#fff" }}>
      <Slider />
      <BackToTop />
      <SmallIcons />

      {/* ── Search results mode ── */}
      {searchResults && searchResults.length > 0 ? (
        <div className="py-5" style={{ backgroundColor: "#f5f5f5" }}>
          <Container>
            <h2 className="mb-1" style={{ color: "#002f34", fontWeight: 700 }}>
              Search Results
            </h2>
            <p className="text-muted mb-4" style={{ fontSize: "0.9rem" }}>
              {searchResults.length} listing{searchResults.length !== 1 ? "s" : ""} found
            </p>

            {searchLoading ? (
              <div className="text-center py-5">
                <Spinner animation="border" style={{ color: "#002f34" }} />
              </div>
            ) : (
              <Row className="g-3">
                {pagedResults.map((obj) => (
                  <ProductCard key={obj._id} obj={obj} />
                ))}
              </Row>
            )}

            {/* Search pagination */}
            {searchTotal > 1 && (
              <div className="d-flex justify-content-center align-items-center gap-2 mt-5">
                <Button
                  disabled={searchPage <= 1}
                  onClick={() => fetchSearchPage(/* query */ "", searchPage - 1)}
                  style={{
                    backgroundColor: searchPage <= 1 ? "#e0e0e0" : "#002f34",
                    border: "none",
                    borderRadius: 8,
                    padding: "8px 20px",
                    fontWeight: 600,
                    color: searchPage <= 1 ? "#999" : "#fff",
                  }}
                >
                  ← Previous
                </Button>
                <span style={{ fontWeight: 600, color: "#002f34" }}>
                  Page {searchPage} of {searchTotal}
                </span>
                <Button
                  disabled={searchPage >= searchTotal}
                  onClick={() => fetchSearchPage("", searchPage + 1)}
                  style={{
                    backgroundColor: searchPage >= searchTotal ? "#e0e0e0" : "#002f34",
                    border: "none",
                    borderRadius: 8,
                    padding: "8px 20px",
                    fontWeight: 600,
                    color: searchPage >= searchTotal ? "#999" : "#fff",
                  }}
                >
                  Next →
                </Button>
              </div>
            )}
          </Container>
        </div>
      ) : (
        /* ── Normal home feed grouped by category ── */
        list.map((obj) => (
          <div key={obj._id}>
            <CardHolder keyy={obj._id} name={obj.name} />
          </div>
        ))
      )}
    </div>
  );
}

export default Home;