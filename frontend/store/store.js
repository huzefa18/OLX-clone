import categoriesReducer from "./categories/CategorySlice"; // <-- correct import
import { configureStore } from "@reduxjs/toolkit";
import productsReducer from './products/ProductsSlice'
const store = configureStore({
  reducer: {
    categories: categoriesReducer, 
    products: productsReducer
  }
});

export default store;