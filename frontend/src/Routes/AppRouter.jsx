import { Route ,Routes} from "react-router-dom";
import React from "react";
import Home from "../pages/home";
import Category from "../pages/category";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import BackToTop from "../components/backToTop/backToTop";
import ProtectedRoute from "../auth/ProtectedRoute";
import Login from "../pages/login";
import Profile from "../pages/profile";
import Signup from "../pages/signup";
import ProductDetail from "../pages/productDetail";
import Favorites from "../pages/favorites";

function AppRouter()
{
    return (
        <div>

            <Header/>
        
            <Routes>
            <Route path="/" element={<Home />} />
            <Route path='/login' element={<Login/>}/>
            <Route path='/signup' element={<Signup/>}/>
            <Route path="/profile" 
            element={

                <ProtectedRoute>
                    <Profile/>
                </ProtectedRoute>
            }
                />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/favorites" 
            element={
                <ProtectedRoute>
                    <Favorites/>
                </ProtectedRoute>
            }
                />
            <Route path="/category/:categoryKey" element={<Category />} />
            </Routes>
            <Footer/>
        </div>
    );
}
export default AppRouter;