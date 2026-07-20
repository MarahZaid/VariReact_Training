import { useState, useEffect, useCallback } from "react";
import { ref, get, update } from "firebase/database";
import emailjs from "@emailjs/browser";
import { db } from "../firebase/firebaseConfig";

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

function sendCompletionEmail(order) {
  const itemsText = (order.items || [])
    .map((item) => `${item.quantity}x ${item.productName}`)
    .join(", ");

  return emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    {
      to_email: order.customerEmail,
      customer_name: order.customerName,
      order_id: order.id,
      items: itemsText,
      total: order.totalAmount,
    },
    { publicKey: EMAILJS_PUBLIC_KEY }
  );
}

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
    const current = orders.find((order) => order.id === orderId);

    // Completed orders are terminal and must never be changed. This is a
    // client-side fast fail for good UX; the source of truth for this rule
    // lives in database.rules.json so it can't be bypassed by direct writes.
    if (current?.status === "completed") {
      throw new Error(`Order ${orderId} is completed and cannot be changed.`);
    }

    await update(ref(db, `orders/${orderId}`), { status });
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status } : order))
    );

    // Fire the completion email only on the transition INTO "completed".
    // Since "completed" is a locked/terminal status, this can only ever
    // happen once per order.
    if (status === "completed" && current) {
      try {
        await sendCompletionEmail({ ...current, id: orderId, status });
      } catch (err) {
        // Don't let an email failure roll back or block the status change;
        // just log it so it can be noticed/retried.
        console.error(`Failed to send completion email for order ${orderId}:`, err);
      }
    }
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