import { useState, useEffect, useCallback } from "react";
import { ref, get, update } from "firebase/database";
import { db } from "../firebase/firebaseConfig";

export default function useProductDetails(productId) {
  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProduct = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    try {
      const snapshot = await get(ref(db, `products/${productId}`));

      if (!snapshot.exists()) {
        setProduct(null);
        setCategory(null);
        return;
      }

      const productData = { id: productId, ...snapshot.val() };
      setProduct(productData);

      if (productData.categoryId) {
        const categorySnapshot = await get(
          ref(db, `categories/${productData.categoryId}`)
        );
        setCategory(
          categorySnapshot.exists()
            ? { id: productData.categoryId, ...categorySnapshot.val() }
            : null
        );
      } else {
        setCategory(null);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  async function updateProduct(data) {
    await update(ref(db, `products/${productId}`), data);
    await loadProduct();
  }

  const discountPercentage = Number(category?.discountPercentage) || 0;
  const basePrice = Number(product?.price) || 0;
  const finalPrice =
    discountPercentage > 0
      ? Math.round((basePrice - (basePrice * discountPercentage) / 100) * 100) / 100
      : basePrice;

  return {
    product,
    category,
    loading,
    updateProduct,
    refetch: loadProduct,
    discountPercentage,
    finalPrice,
  };
}