import { Container } from "react-bootstrap";
import Carousel from 'react-bootstrap/Carousel';
import slide from '../../assets/slider.webp'
function Slider()
{
    return(
        <Container className="py-5" style={{backgroundColor:'#fff'}}>
             <Carousel >
      <Carousel.Item>
        <img src={slide} alt="" />
      </Carousel.Item>
      <Carousel.Item>
        <img src={slide} alt="" />
      </Carousel.Item>
      <Carousel.Item>
        <img src={slide} alt="" />
      </Carousel.Item>
    </Carousel>
        </Container>
    );
}
export default Slider