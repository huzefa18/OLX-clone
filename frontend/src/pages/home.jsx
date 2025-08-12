import Slider from "../components/slider/slider";
import SmallIcons from "../components/categorySmallIcons/smallicons";
import CardHolder from "../components/cardHolder/cardHolder";
import listings from "../listing";
import BackToTop from "../components/backToTop/backToTop";
function Home()
{
    return(
        <div style={{backgroundColor:"#fff"}}>
            <Slider/>
            <BackToTop/>
            <SmallIcons/>
            {
                Object.keys(listings).map((keyy)=>
                (
                        <div>

                        <CardHolder keyy={keyy}/>
                        </div>
                        

                ))
            }
            
        </div>
    );
}
export default Home;