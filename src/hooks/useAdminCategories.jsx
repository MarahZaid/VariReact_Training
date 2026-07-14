import { useState, useEffect, useCallback } from "react";
import { ref, get, set, update, remove } from "firebase/database";
import { db } from "../firebase/firebaseConfig";

export default function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const [categoriesSnapshot, productsSnapshot] = await Promise.all([
        get(ref(db, "categories")),
        get(ref(db, "products")),
      ]);

      const categoriesData = categoriesSnapshot.exists()
        ? categoriesSnapshot.val()
        : {};
      const productsData = productsSnapshot.exists()
        ? productsSnapshot.val()
        : {};

      // Real product count per category (instead of relying on stored numberOfProducts)
      const countByCategory = {};
      Object.values(productsData).forEach((product) => {
        const categoryId = product?.categoryId;
        if (categoryId) {
          countByCategory[categoryId] = (countByCategory[categoryId] || 0) + 1;
        }
      });

      const list = Object.entries(categoriesData).map(([id, category]) => ({
        id,
        ...category,
        productsCount: countByCategory[id] || 0,
      }));

      list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));

      setCategories(list);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Generates the next sequential id: cat1, cat2, cat3... based on existing ids
  async function getNextCategoryId() {
    const snapshot = await get(ref(db, "categories"));
    const existingIds = snapshot.exists() ? Object.keys(snapshot.val()) : [];

    const usedNumbers = existingIds
      .map((id) => {
        const match = id.match(/^cat(\d+)$/);
        return match ? parseInt(match[1], 10) : null;
      })
      .filter((n) => n !== null);

    const nextNumber = usedNumbers.length > 0 ? Math.max(...usedNumbers) + 1 : 1;
    return `cat${nextNumber}`;
  }

  async function addCategory(categoryData) {
    const newId = await getNextCategoryId();
    await set(ref(db, `categories/${newId}`), categoryData);
    await loadCategories();
    return newId;
  }

  async function updateCategory(categoryId, categoryData) {
    await update(ref(db, `categories/${categoryId}`), categoryData);
    await loadCategories();
  }

  async function deleteCategory(categoryId) {
    await remove(ref(db, `categories/${categoryId}`));
    await loadCategories();
  }

  return {
    categories,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
    refetch: loadCategories,
  };
}