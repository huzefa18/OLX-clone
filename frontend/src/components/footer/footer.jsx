import { Container, Row, Col, Stack,Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import footerphone from "../../assets/footerphone.png";
import apple from "../../assets/applelogo.svg";
import insta from "../../assets/insta.svg";
import facebook from "../../assets/facebook.svg";
import twitter from "../../assets/twitter.svg";
import youtube from "../../assets/youtube.svg";
import "./footer.css";

export default function Footer() {
  const iconStyle = {
    height: 40,
    width: 40,
    borderRadius: "50%",
    border: "1px solid #002f34",
    padding: 8,
    background: "#fff",
  };


  return (
    <footer>
       
              

      <div className="cta-band">
        <Container>
          <Row className="align-items-center gy-4">
            <Col md={4} xs={12}>
              <h2 className="cta-title">Find amazing deals on the go.</h2>
              <h2 className="cta-link">Download OLX app now!</h2>
            </Col>

            <Col md={3} xs={12} className="text-md-end">
              <img src={footerphone} alt="OLX App" className="cta-phone img-fluid" />
            </Col>

            <Col md={5} xs={12} className="d-flex gap-3 flex-wrap   justify-content-end" >
              <a href="https://apps.apple.com/pk/app/olx-pakistan-online-shopping/id1551315538"><img src={apple} alt="App Store" className="store-badge" style={{height:140}}/></a>
              <a href="https://apps.apple.com/pk/app/olx-pakistan-online-shopping/id1551315538"><img src={apple} alt="Google Play" className="store-badge" style={{height:140}}/></a>
              <a href="https://apps.apple.com/pk/app/olx-pakistan-online-shopping/id1551315538"><img src={apple} alt="AppGallery" className="store-badge" style={{height:140}}/></a>
            </Col>
          </Row>
        </Container>
      </div>

      <div className="links-band">
        <Container>
          <Row className="align-items-start gy-4">
            <Col md={2} xs={6}>
              <h6 className="f-h">Popular Categories</h6>
              <ul className="f-list">
                <li><Link className="f-link" to="#">Cars</Link></li>
                <li><Link className="f-link" to="#">Flats for rent</Link></li>
                <li><Link className="f-link" to="#">Mobile Phones</Link></li>
                <li><Link className="f-link" to="#">Jobs</Link></li>
              </ul>
            </Col>

            <Col md={2} xs={6}>
              <h6 className="f-h">Trending Searches</h6>
              <ul className="f-list">
                <li><Link className="f-link" to="#">Bikes</Link></li>
                <li><Link className="f-link" to="#">Watches</Link></li>
                <li><Link className="f-link" to="#">Books</Link></li>
                <li><Link className="f-link" to="#">Dogs</Link></li>
              </ul>
            </Col>

            <Col md={2} xs={6}>
              <h6 className="f-h">About Us</h6>
              <ul className="f-list">
                <li><Link className="f-link" to="#">About Dubizzle Group</Link></li>
                <li><Link className="f-link" to="#">OLX Blog</Link></li>
                <li><Link className="f-link" to="#">Contact Us</Link></li>
                <li><Link className="f-link" to="#">OLX for Businesses</Link></li>
              </ul>
            </Col>

            <Col md={2} xs={6}>
              <h6 className="f-h">OLX</h6>
              <ul className="f-list">
                <li><Link className="f-link" to="#">Help</Link></li>
                <li><Link className="f-link" to="#">Sitemap</Link></li>
                <li><Link className="f-link" to="#">Terms of use</Link></li>
                <li><Link className="f-link" to="#">Privacy Policy</Link></li>
              </ul>
            </Col>

            <Col md={2} xs={12}>
              <h6 className="f-h">Follow Us</h6>
              <div className="d-flex gap-2 flex-wrap">
                <a href="https://twitter.com" target="_blank" rel="noreferrer">
                  <img src={twitter} alt="Twitter" style={iconStyle} />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noreferrer">
                  <img src={facebook} alt="Facebook" style={iconStyle} />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noreferrer">
                  <img src={youtube} alt="YouTube" style={iconStyle} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer">
                  <img src={insta} alt="Instagram" style={iconStyle} />
                </a>
              </div>
            </Col>
            
          </Row>
        </Container>
      </div>

      <div className="bottom-bar">
        <Container className="d-flex justify-content-end">
          <p className="mb-0 text-white">
            <b>Classifieds in Pakistan.</b> © 2006–2025 OLX
          </p>
        </Container>
      </div>
    </footer>
  );
}
