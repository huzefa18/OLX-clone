import { ListGroup, Container } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from 'react-router-dom';
import './Category.css'; 
import data from '../data';

function CategoryList() {
  return (
    <Container  className="category-container" style={{border:'none'}}>
      <ListGroup horizontal as="ul" className="border-0 category-list">
        
        <ListGroup.Item className="category-item">
          <Dropdown>
            <Dropdown.Toggle
              variant="link"
              className="category-dropdown-toggle"
              style={{textDecoration:'none',color:'black'}}

            >
             <b>All Categories</b>
            </Dropdown.Toggle>
            <Dropdown.Menu >
              {data.map((c) => (
                <Dropdown.Item key={c.name} >{c.name}</Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </ListGroup.Item>

        {data.map((cat) => (
          <Link
            key={cat.name}
            to={cat.href}
            className="category-link"
          >
            <ListGroup.Item className="category-item">
              {cat.name}
            </ListGroup.Item>
          </Link>
        ))}
      </ListGroup>
    </Container>
  );
}

export default CategoryList;
