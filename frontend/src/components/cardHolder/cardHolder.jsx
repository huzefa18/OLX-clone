import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import love from "/home/dev/Desktop/olx-clone/frontend/src/assets/love.svg";
import { useLocationFilter } from "../context/context";
import categories from "../data";
// import { useProducts} from "../context/ContextProducts";
import { useSelector,useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchProducts,selectProducts } from "../../../store/products/ProductsSlice";


function CardHolder({ keyy, cut = 4, name,showAll = false }) {
  const { location: selected } = useLocationFilter();
  const dispatch = useDispatch();
  const listings=useSelector(selectProducts);

  
  useEffect(()=>
  {
   
      dispatch(fetchProducts())


  },[dispatch]);
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
          {items.map((obj) => (
            <Col key={obj.id} xs={12} sm={6} md={mdCols}>
              <Card className="h-100">
                <Card.Img
                  variant="top"
                  alt={obj.title}
                  src={obj.img}
                  style={{ objectFit: "cover", height: 200 }}
                />
                <Card.Body>
                  <Card.Title className="d-flex">
                    <div style={{ flexGrow: 1 }}>
                      <b>{obj.price}</b>
                    </div>
                    <img src={love} alt="like" style={{ height: 25 }} />
                  </Card.Title>
                  <Card.Text>{obj.title}</Card.Text>
                  <Card.Text className="text-muted small">{obj.location}</Card.Text>
                  <Card.Text className="text-muted small">{obj.timeAgo}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}

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
