import { Route ,Routes} from "react-router-dom";
import React from "react";
import Home from "./pages/home";
import Category from "./pages/category";
import Footer from "./components/footer/footer";
import Header from "./components/header/header";
import AppRouter from "./Routes/AppRouter";
function App()
{
    return (
        <div>
            <AppRouter/>
        </div>
    );
}
export default App;