import Navbar1 from "./navbar1";
import Nav from 'react-bootstrap/Nav';
import { Container, Navbar, Button, Form, Row, Col, InputGroup, Dropdown, DropdownButton } from 'react-bootstrap';
import logo from '../../assets/logo.png';
import car from '../../assets/car.png';
import home from '../../assets/home.png';
import search from '../../assets/search.svg';
import location from '../../assets/location.svg';
import './nav1.css'
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { fetchCategories } from "../../../store/categories/CategorySlice";
import { fetchProducts } from "../../../store/products/ProductsSlice";

import { useLocationFilter } from "../context/context";
function Nav1() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { list: categoriesList, status } = useSelector((s) => s.categories);
  const [searchVal, setSearchVal] = useState("");

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCategories());
    }
  }, [status, dispatch]);

  const goProperty = () => {
    const cat = categoriesList.find(c => c.name.toLowerCase().includes('house') || c.name.toLowerCase().includes('property'));
    if (cat) navigate(`/category/${cat._id}`);
  };
  const goMotors = () => {
    const cat = categoriesList.find(c => c.name.toLowerCase().includes('car') || c.name.toLowerCase().includes('motor'));
    if (cat) navigate(`/category/${cat._id}`);
  };
  const handleSearch = (e) => {
    if (e) e.preventDefault();
    dispatch(fetchProducts(searchVal));
    navigate('/');
  };
  const goLogin = () => navigate('/login')
  const goSignup = () => navigate('/signup')
  const { location: selected, setLocation } = useLocationFilter();
  const handleSelect = (loc) => {
    setLocation(loc);
  }
  const locations = [
    "DHA, Karachi",
    "Gulshan-e-Iqbal, Karachi",
    "Model Town, Lahore",
    "Johar Town, Lahore",
    "G-11, Islamabad",
  ];
  return (
    <>
      <Navbar className="navbarr" style={{ height: 70 }}>
        <Container className="px-3">
          <div className="d-flex align-items-center w-100 justify-content-between flex-nowrap">


            <div className="d-flex align-items-center flex-nowrap">
              <Navbar.Brand href="/" className="me-3 act">
                <img src={logo} alt="OLX" className="logo-img"
                  style={{ height: '25px', width: 'auto', color: "black" }} />
              </Navbar.Brand>

              <Nav varient='tabs' className="nav-compact flex-nowrap">
                <Nav.Item>
                  <Nav.Link onClick={goMotors} className="d-inline-flex align-items-center justify-centent-center text-nowrap act">
                    <img src={car} alt="" className="me-2 nav-icon" style={{ height: '25px' }} />
                    Motors
                  </Nav.Link>
                </Nav.Item>
                <Nav.Link onClick={goProperty} className="d-inline-flex align-items-center text-nowrap act">
                  <img src={home} alt="" className="me-2 nav-icon" />
                  Property
                </Nav.Link>
              </Nav>
            </div>

            <div className="d-none d-md-flex align-items-center gap-3">
              {user ? (
                <>
                  <span className="me-2" style={{ fontWeight: "bold", color: "#002f34", cursor: "pointer" }} onClick={() => navigate('/profile')}>
                    Welcome, {user.name}
                  </span>
                  <span className="me-2 text-decoration-underline" style={{ fontWeight: "bold", color: "#002f34", cursor: "pointer" }} onClick={() => navigate('/favorites')}>
                    Favorites
                  </span>
                  <button className="login-link-btn" onClick={logout}>Logout</button>
                </>
              ) : (
                <>
                  <button className="login-link-btn" onClick={goLogin}>Login</button>
                  <button className="login-link-btn" onClick={goSignup}>Signup</button>
                </>
              )}
              <div className="sell-button-wrapper">
                <button className="sell-button-inner">
                  <span className="me-1">+</span> SELL
                </button>
              </div>
            </div>

          </div>
        </Container>
      </Navbar>
      <div style={{ backgroundColor: "transparent", color: "white", borderBottom: '1px solid black' }} className="py-2">
        <Container>
          <Navbar className="bg-body-tertiary justify-content-between">



            <Col xs={12} md={3}>
              <Form inline className="location">
                <InputGroup style={{ border: "1px solid #bfc5c9", borderRadius: "6px" }} className="w-100" >
                  <InputGroup.Text
                    id="location-icon"
                    className="w-90"
                    style={{
                      border: 0,
                      background: "transparent",
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    <img src={location} alt="Location" style={{ height: 16 }} />
                  </InputGroup.Text>

                  <DropdownButton
                    variant="light"
                    title={selected}
                    className="flex-grow-1 text-start w-100"
                    id="location-dropdown"
                    onSelect={handleSelect}
                    style={{
                      border: 0,
                      background: "transparent",
                      fontWeight: 500,


                    }}
                  >
                    <Dropdown.Item eventKey={'Pakistan'} key={'Pakistan'} active={'Pakistan' === selected}>
                      {'Pakistan'}
                    </Dropdown.Item>
                    {locations.map((loc) => (
                      <Dropdown.Item eventKey={loc} key={loc} active={loc === selected}>
                        {loc}
                      </Dropdown.Item>))}
                  </DropdownButton>
                </InputGroup>
              </Form>
            </Col>


            <Col>
              <Form onSubmit={handleSearch}>
                <InputGroup className=" px-3 searchbar">
                  <Form.Control
                    type="text"
                    placeholder="Find Cars, Mobile Phones and more..."
                    aria-label="Search"
                    className="rounded-start"
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                  />
                  <Button
                    variant="success"
                    type="submit"
                    className="rounded-end"
                    style={{ backgroundColor: '#002f34' }}
                  >
                    <img src={search} style={{ width: 'auto', height: '30px', objectFit: 'cover' }} />
                    Search
                  </Button>
                </InputGroup>
              </Form>
            </Col>

          </Navbar>
        </Container>
      </div>
    </>
  );


}
export default Nav1