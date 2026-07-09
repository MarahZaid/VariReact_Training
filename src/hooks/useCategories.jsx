import { useState, useEffect } from "react";
import { ref, get } from "firebase/database";
import { db } from "../firebase/firebaseConfig";

export default function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getCategories() {
      try {
        const categoriesData = await get(ref(db, "categories"));

        if (categoriesData.exists()) {
          const data = categoriesData.val();
          const categoriesArray = Object.entries(data).map(([id, category]) => ({
            id, ...category,
          }));

          setCategories(categoriesArray);
        }
      } catch (err) {
        console.log(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    getCategories();
  }, []);

  return { categories, loading, error };
}