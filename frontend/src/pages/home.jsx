import Slider from "../components/slider/slider";
import SmallIcons from "../components/categorySmallIcons/smallicons";
import CardHolder from "../components/cardHolder/cardHolder";
import BackToTop from "../components/backToTop/backToTop";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchCategories } from "../../store/categories/CategorySlice";
import { selectSearchResults } from "../../store/products/ProductsSlice";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import love from "../assets/love.svg";
import { Button } from "react-bootstrap";

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, likeProduct } = useAuth();
  const { list, status } = useSelector((s) => s.categories);
  const searchResults = useSelector(selectSearchResults);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCategories());
    }
  }, [status, dispatch]);

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

  return (
    <div style={{ backgroundColor: "#fff" }}>
      <Slider />
      <BackToTop />
      <SmallIcons />
      {searchResults && searchResults.length > 0 ? (
        <div className="py-5">
          <div className="container">
            <h2 className="mb-4" style={{ color: "#002f34", fontWeight: 700 }}>Search Results</h2>
            <div className="row g-3">
              {searchResults.map((obj) => {
                const isLiked = user && user.likedProducts && user.likedProducts.includes(obj._id);
                return (
                  <div key={obj._id} className="col-12 col-sm-6 col-md-3">
                    <div className="card h-100 position-relative shadow-sm" style={{ borderRadius: "8px", overflow: "hidden" }}>
                      <Link to={`/product/${obj._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                        <img src={obj.img} alt={obj.title} className="card-img-top" style={{ objectFit: "cover", height: 200 }} />
                        <div className="card-body">
                          <h5 className="card-title mb-2"><b>{obj.price}</b></h5>
                          <p className="card-text text-truncate mb-1">{obj.title}</p>
                          <p className="card-text text-muted small mb-0">{obj.location}</p>
                          <p className="card-text text-muted small">{obj.timeAgo}</p>
                        </div>
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
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
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