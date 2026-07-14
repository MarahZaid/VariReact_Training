import { useState, useEffect, useCallback } from "react";
import { ref, get, remove, set } from "firebase/database";
import { db } from "../firebase/firebaseConfig";

export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const [productsSnapshot, categoriesSnapshot] = await Promise.all([
        get(ref(db, "products")),
        get(ref(db, "categories")),
      ]);

      const productsData = productsSnapshot.exists()
        ? productsSnapshot.val()
        : {};
      const categoriesData = categoriesSnapshot.exists()
        ? categoriesSnapshot.val()
        : {};

      const categoryNames = {};
      Object.entries(categoriesData).forEach(([id, category]) => {
        categoryNames[id] = category.name;
      });

      const categoryList = Object.entries(categoriesData).map(
        ([id, category]) => ({
          id,
          ...category,
        })
      );
      categoryList.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

      const list = Object.entries(productsData).map(([id, product]) => ({
        id,
        ...product,
        categoryName:
          categoryNames[product.categoryId] || product.categoryId || "-",
      }));

      list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

      setProducts(list);
      setCategories(categoryList);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  async function deleteProduct(productId) {
    await remove(ref(db, `products/${productId}`));
    await loadProducts();
  }

  async function generateNextProductId() {
    const snapshot = await get(ref(db, "products"));
    const data = snapshot.exists() ? snapshot.val() : {};

    const existingNumbers = Object.keys(data)
      .map((id) => {
        const match = id.match(/^p(\d+)$/);
        return match ? parseInt(match[1], 10) : null;
      })
      .filter((num) => num !== null);

    const maxNumber = existingNumbers.length ? Math.max(...existingNumbers) : 100;
    return `p${maxNumber + 1}`;
  }

  async function addProduct(productData) {
    const newId = await generateNextProductId();
    await set(ref(db, `products/${newId}`), productData);
    await loadProducts();
    return newId;
  }

  return {
    products,
    categories,
    loading,
    deleteProduct,
    addProduct,
    refetch: loadProducts,
  };
}