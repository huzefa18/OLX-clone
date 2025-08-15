import { useState, useEffect } from "react";
import { CategoryContext } from "./contextCategories";

export function CategoryProvider({ children }) {
  const [categories, setCategories] = useState([]);


  useEffect(() => {
 

    async function fetchCategories() {
      try {
        const res = await fetch("http://localhost:8080/categories");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
            setCategories(data);
      } catch (err) {
          console.log(`error occured wgilre loadingcategories ${err}`)
      } 
    }

    fetchCategories();
  }, []);

  const value = { categories};

  return (
    <CategoryContext.Provider value={value}>
      {children}
    </CategoryContext.Provider>
  );
}
