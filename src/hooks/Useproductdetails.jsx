import { useState, useEffect, useCallback } from "react";
import { ref, get, update } from "firebase/database";
import { db } from "../firebase/firebaseConfig";

export default function useProductDetails(productId) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProduct = useCallback(async () => {
    if (!productId) return;
    setLoading(true);
    try {
      const snapshot = await get(ref(db, `products/${productId}`));
      setProduct(
        snapshot.exists() ? { id: productId, ...snapshot.val() } : null
      );
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

  return { product, loading, updateProduct, refetch: loadProduct };
}