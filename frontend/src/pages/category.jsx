import Slider from "../components/slider/slider";
import CardHolder from "../components/cardHolder/cardHolder";
import BackToTop from "../components/backToTop/backToTop";
import { Container ,Row,Col,Badge} from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import rightArrow from '../assets/rightArrow.svg'
import { useNavigate } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchCategories } from "../../store/categories/CategorySlice";
// import categories from "../components/data";
function Category()
{
    const dispatch=useDispatch();
    const {list,status}=useSelector((s)=>s.categories)
    useEffect(()=>
    {
        if(status==='idle')
        {
            dispatch(fetchCategories());
        }
    },[dispatch,status])
    const navigate=useNavigate();
    const category=list;
    
    const {categoryKey}=useParams();
    let n=category.find(obj =>obj._id===categoryKey);
    function handleClick(categoryKey)
    {
        navigate(`/categories/${categoryKey}`)
        
    }


    return(
        <div style={{backgroundColor:"transparent"}}>
            <Slider/>
            <Container>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
                    <Link to="/" style={{ textDecoration: "none", color: "rgba(0,47,52,.64)" }}>Home</Link>
                    <img src={rightArrow} alt="" style={{ height: 20 }} />
                    <span onClick={handleClick} style={{ cursor: "pointer", color: "rgba(0,47,52,.64)" }}>
                        {n.name}
                    </span>
                    </div>
                    <div>
                        <h2><b>{n.name} in Pakistan</b></h2>
                         <h6>
                            <Badge bg="secondary" style={{backgroundColor:'#rgba(33, 171, 187, 0.64)"'}}>10,000+ Results</Badge>
                        </h6>
                    </div>
                    <Row>
                        <Col sm={1} xs={1} md={3}>

                        </Col>
                        <Col sm={11} xs={11} md={9}>
                        <Row>
                            <CardHolder keyy={categoryKey} name={n.name}   showAll={true} />
                        </Row>
                        
                        </Col>
                    </Row>

            </Container>
        </div>
    );
}
export default Category;