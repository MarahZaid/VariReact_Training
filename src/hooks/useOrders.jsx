import { useState, useEffect, useCallback } from "react";
import { ref, get, update } from "firebase/database";
import { db } from "../firebase/firebaseConfig";

export default function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const snapshot = await get(ref(db, "orders"));
      const ordersData = snapshot.exists() ? snapshot.val() : {};

      const list = Object.entries(ordersData).map(([id, order]) => ({
        id,
        ...order,
      }));

      list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));

      setOrders(list);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  async function updateOrderStatus(orderId, status) {
    await update(ref(db, `orders/${orderId}`), { status });
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status } : order))
    );
  }

  // Unique customers derived from orders (email as the unique key)
  const customers = Object.values(
    orders.reduce((acc, order) => {
      if (!order.customerEmail) return acc;
      if (!acc[order.customerEmail]) {
        acc[order.customerEmail] = {
          email: order.customerEmail,
          name: order.customerName,
        };
      }
      return acc;
    }, {})
  ).sort((a, b) => (a.name || "").localeCompare(b.name || ""));

  return { orders, customers, loading, updateOrderStatus, refetch: loadOrders };
}