import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import love from "../../assets/love.svg";
import { useLocationFilter } from "../context/context";
import categories from "../data";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchProducts, selectProducts } from "../../../store/products/ProductsSlice";
import { useAuth } from "../../auth/AuthContext";

function CardHolder({ keyy, cut = 4, name, showAll = false }) {
  const { location: selected } = useLocationFilter();
  const dispatch = useDispatch();
  const listings = useSelector(selectProducts);
  const { user, likeProduct } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleLikeClick = async (productId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await likeProduct(productId);
    } catch (err) {
      console.error(err);
    }
  };

  let items = listings[keyy] || [];

  if (selected && selected !== "Pakistan") {
    items = items.filter((obj) => obj.location === selected);
  }

  if (!showAll) {
    items = items.slice(0, cut);
  }

  const categoryData =
    categories.find((cat) => cat._id === keyy) || { name: keyy, href: `/category/${keyy}` };

  const mdCols = showAll ? 4 : 3;

  return (
    <div className="py-5">
      <Container>
        <div className="d-flex align-items-center mb-3">
          <h2 className="mb-0" style={{ flexGrow: 1 }}>{name}</h2>
          <Link to={categoryData.href} style={{ textDecoration: "none", color: "inherit" }}>
            <h6 style={{ color: "blue" }}>View More</h6>
          </Link>
        </div>

        <Row className="g-3">
          {items.map((obj) => {
            const isLiked = user && user.likedProducts && user.likedProducts.includes(obj._id);
            return (
              <Col key={obj._id || obj.id} xs={12} sm={6} md={mdCols}>
                <Card className="h-100 position-relative shadow-sm" style={{ borderRadius: "8px", overflow: "hidden" }}>
                  <Link to={`/product/${obj._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                    <Card.Img
                      variant="top"
                      alt={obj.title}
                      src={obj.img}
                      style={{ objectFit: "cover", height: 200 }}
                    />
                    <Card.Body>
                      <Card.Title className="d-flex mb-2">
                        <div style={{ flexGrow: 1 }}>
                          <b>{obj.price}</b>
                        </div>
                      </Card.Title>
                      <Card.Text className="text-truncate mb-1">{obj.title}</Card.Text>
                      <Card.Text className="text-muted small mb-0">{obj.location}</Card.Text>
                      <Card.Text className="text-muted small">{obj.timeAgo}</Card.Text>
                    </Card.Body>
                  </Link>
                  <Button 
                    variant="link" 
                    className="position-absolute p-0 border-0" 
                    style={{ top: "10px", right: "10px", zIndex: 10 }}
                    onClick={(e) => handleLikeClick(obj._id, e)}
                  >
                    <img 
                      src={love} 
                      alt="like" 
                      style={{ 
                        height: 25, 
                        filter: isLiked ? "invert(21%) sepia(100%) saturate(7414%) hue-rotate(359deg) brightness(94%) contrast(117%)" : "none" 
                      }} 
                    />
                  </Button>
                </Card>
              </Col>
            );
          })}

          {items.length === 0 && (
            <Col xs={12} className="text-muted small">
              No items to show.
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
}

export default CardHolder;
