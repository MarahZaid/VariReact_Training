import { useState, useEffect, useCallback } from "react";
import { ref, get } from "firebase/database";
import { db } from "../firebase/firebaseConfig";

export default function useCategoryProducts(categoryId) {
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!categoryId) return;

    setLoading(true);
    try {
      const [categorySnapshot, productsSnapshot] = await Promise.all([
        get(ref(db, `categories/${categoryId}`)),
        get(ref(db, "products")),
      ]);

      setCategory(
        categorySnapshot.exists()
          ? { id: categoryId, ...categorySnapshot.val() }
          : null
      );

      const productsData = productsSnapshot.exists()
        ? productsSnapshot.val()
        : {};

      const list = Object.entries(productsData)
        .filter(([, product]) => product.categoryId === categoryId)
        .map(([id, product]) => ({ id, ...product }));

      setProducts(list);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { category, products, loading, refetch: loadData };
}