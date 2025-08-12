import Navbar1 from "./navbar1";
import Nav from 'react-bootstrap/Nav';
import { Container, Navbar ,Button,Form,Row,Col,InputGroup,Dropdown,DropdownButton} from 'react-bootstrap';
import logo from '../../assets/logo.png';
import car from '../../assets/car.png';
import home from '../../assets/home.png';
import search from '../../assets/search.svg';
import location from '../../assets/location.svg';
import './nav1.css'
import { useNavigate } from "react-router-dom";

import { useLocationFilter } from "../context/context";
function Nav1()
{
  const goProperty = () => navigate("/category/houses");
  const goMotors=()=> navigate('/category/cars')
   const navigate = useNavigate();
  const {location: selected,setLocation}=useLocationFilter();
  const handleSelect=(loc)=>
    {
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
    <Navbar className="navbarr" style={{height:70}}>
      <Container className="px-3">
        <div className="d-flex align-items-center w-100 justify-content-between flex-nowrap">


          <div className="d-flex align-items-center flex-nowrap">
            <Navbar.Brand href="/" className="me-3 act">
              <img src={logo} alt="OLX" className="logo-img" 
              style={{ height: '25px', width:'auto',color:"black"}} />
            </Navbar.Brand>

            <Nav  varient='tabs' className="nav-compact flex-nowrap">
              <Nav.Item>
                <Nav.Link onClick={goMotors} className="d-inline-flex align-items-center justify-centent-center text-nowrap act">
                <img src={car} alt="" className="me-2 nav-icon" style={{height:'25px'}}/>
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
            <button className="login-link-btn">Login</button>
            <div className="sell-button-wrapper">
              <button className="sell-button-inner">
                <span className="me-1">+</span> SELL
              </button>
            </div>
          </div>

        </div>
      </Container>
    </Navbar>
      <div style={{backgroundColor:"transparent",color:"white",borderBottom:'1px solid black'}} className="py-2">
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
              <InputGroup className=" px-3 searchbar">
  <Form.Control
    type="text"
    placeholder="Find Cars, Mobile Phones and more..."
    aria-label="Search"
    className="rounded-start"
  />
  <Button
    variant="success" 
    type="submit"
    className="rounded-end"
    style={{backgroundColor:'#002f34'}}
  >
    <img src={search}  style={{width:'auto',height:'30px',objectFit:'cover'}}/>
   Search
  </Button>
</InputGroup>
          </Col>

    </Navbar>
        </Container>
      </div>
   </>
  );


}
export default Nav1