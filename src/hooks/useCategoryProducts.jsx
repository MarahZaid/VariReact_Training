import { useState, useEffect, useCallback } from "react";
import { ref, get } from "firebase/database";
import { db } from "../firebase/firebaseConfig";


function applyCategoryDiscount(product, category) {
  const basePrice = Number(product.price) || 0;
  const discountPercentage = Number(category?.discountPercentage) || 0;

  if (discountPercentage > 0) {
    const finalPrice =
      Math.round((basePrice - (basePrice * discountPercentage) / 100) * 100) / 100;
    return { ...product, price: finalPrice, oldPrice: basePrice, discountPercentage };
  }

  return { ...product, price: basePrice, oldPrice: null, discountPercentage: 0 };
}

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

      const categoryData = categorySnapshot.exists()
        ? { id: categoryId, ...categorySnapshot.val() }
        : null;
      setCategory(categoryData);

      const productsData = productsSnapshot.exists()
        ? productsSnapshot.val()
        : {};

      const list = Object.entries(productsData)
        .filter(([, product]) => product.categoryId === categoryId)
        .map(([id, product]) => ({
          id,
          ...applyCategoryDiscount(product, categoryData),
        }));

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