import { createContext, useContext } from "react";

export const CategoryContext = createContext(null);

export function useCategories() {
  const ctx = useContext(CategoryContext);
  if (!ctx) {
    // This makes the problem obvious if a child is outside Provider.
    throw new Error("useCategories must be used within a <CategoryProvider>");
  }
  return ctx; // { categories, setCategories, loading, error }
}
