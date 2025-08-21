import { ListGroup, Container } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import { useNavigate } from 'react-router-dom';
// import { useCategories } from '../context/contextCategories';
import { useDispatch,useSelector } from 'react-redux';
import './Category.css';
import { fetchCategories } from '../../../store/categories/CategorySlice';
import { useEffect } from 'react';
// import categories from '../data';

function CategoryList() {
  const dispatch=useDispatch();
  const {list,status,error}=useSelector((s)=>s.categories);
  // console.log(status);
    useEffect(() => {
      // console.log('fetching data')
  dispatch(fetchCategories());   // one call on mount
}, [dispatch]);
// console.log(`list:${list}`)
    const data=list;
    // console.log(list)
  const navigate = useNavigate();

  const go = (cat) => {
    const categoryKey = cat._id;    
    navigate(`/category/${categoryKey}`);
  };

  return (
    <Container className="category-container" style={{ border: 'none' }}>
      <ListGroup horizontal as="ul" className="border-0 category-list">
        <ListGroup.Item className="category-item">
          <Dropdown>
            <Dropdown.Toggle
              variant="link"
              className="category-dropdown-toggle"
              style={{ textDecoration: 'none', color: 'black' }}
            >
              <b>All Categories</b>
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {data.map((c) => (
                <Dropdown.Item key={c._id || c.name} onClick={() => go(c)}>
                  {c.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </ListGroup.Item>

        {data.map((cat) => (
          <ListGroup.Item
            key={cat._id || cat.name}
            className="category-item category-link"
            role="button"
            tabIndex={0}
            onClick={() => go(cat)}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && go(cat)}
          >
            {cat.name}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
}

export default CategoryList;
