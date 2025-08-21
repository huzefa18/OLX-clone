import { Container, Row, Col, Card } from 'react-bootstrap';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { fetchCategories } from '../../../store/categories/CategorySlice';
import { useDispatch,useSelector } from 'react-redux';
import { useEffect } from 'react';
function SmallIcons()
{
  const dispatch=useDispatch();
  const {list,error,status}=  useSelector((s)=>s.categories);
  // console.log(`${list}`)category/689cb7803b6cff1305cf49ad
  useEffect(()=>
  {
    if(status==='idle')
    {
      dispatch(fetchCategories());
    }
  },[dispatch,status])
  const category=list
  const navigate=useNavigate();
  function handleOnClick(keyy)
  {
    const categoryKey=keyy
    {console.log(`category key is :${categoryKey}`)}
    navigate(`/category/${categoryKey}`)
  }
  
    return (
        <Container className='py-5 '>
            <Row>
                 {category.map((c) => (
          <Col key={c.name} xs={4} sm={4} md={2} lg={2} xxl={2} className='py-1'>
              <Card className="border-0 text-center category-card h-100 "  onClick={()=>handleOnClick(c._id)} >
                {/* {console.log(`c,_id is :${c._id}`)} */}
                <div className="p-2">
                  <div className=" rounded-3 d-flex align-items-center justify-content-center mb-2" style={{backgroundColor:'ebf1ff'}}>
                    <img
                      src={c.img}
                      alt={c.name}
                      style={{ maxWidth: 'auto', maxHeight: 64, objectFit: "contain" }}
                    />
                  </div>
                  <Card.Text className="fw-semibold small">{c.name}</Card.Text>
                </div>
              </Card>
          </Col>
        ))}
            </Row>
        </Container>

    );
}
export default SmallIcons