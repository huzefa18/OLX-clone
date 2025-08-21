import Slider from "../components/slider/slider";
import SmallIcons from "../components/categorySmallIcons/smallicons";
import CardHolder from "../components/cardHolder/cardHolder";
// import listings from "../listing";
import BackToTop from "../components/backToTop/backToTop";
// import { useProducts } from "../components/context/ContextProducts";
import { useSelector,useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchCategories } from "../../store/categories/CategorySlice";
function Home()
{
    const dipatch=useDispatch();
    const {list,status}=useSelector((s)=>s.categories)
    useEffect(()=>
    {
        if(status==='idle')
        {
            dipatch(fetchCategories());
        }
    },[status,dipatch])
    
    return(
        <div style={{backgroundColor:"#fff"}}>
            <Slider/>
            <BackToTop/>
            <SmallIcons/>
            {
                list.map((obj)=>
                
                      (<div>
                        <CardHolder keyy={obj._id}/>
                        </div>)
                        )

                
            }
            
        </div>
    );
}
export default Home;