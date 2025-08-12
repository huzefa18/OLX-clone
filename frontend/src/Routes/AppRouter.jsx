import { Route ,Routes} from "react-router-dom";
import React from "react";
import Home from "../pages/home";
import Category from "../pages/category";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import BackToTop from "../components/backToTop/backToTop";
// import Foter from "../components/footer/footer";
function AppRouter()
{
    return (
        <div>

            <Header/>
        
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:categoryKey" element={<Category />} />
            </Routes>
            <Footer/>
        </div>
    );
}
export default AppRouter;