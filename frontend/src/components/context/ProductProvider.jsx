import { useState, useEffect } from "react";
import { ProductContext } from "./ContextProducts"; 

export function ProductProvider({ children }) {
  const [products, setProducts] = useState({});   


  useEffect(() => {
    // let cancelled = false;

    async function fetchProducts() {
      try {
        const res = await fetch("http://localhost:8080/products");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setProducts(data);
        console.log("products", data); 
      } catch (err) {
        console.log(`err:${err}`)
      } 
    }
    fetchProducts();
    // return () => { cancelled = true; };
  }, []);
  useEffect(() => {
  console.log("products updated:", products);
}, [products]);


  const value = { products};
  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}
