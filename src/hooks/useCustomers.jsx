import { useState, useEffect, useCallback } from "react";
import { ref, get, update } from "firebase/database";
import { db } from "../firebase/firebaseConfig";

export default function useCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const [customersSnapshot, ordersSnapshot] = await Promise.all([
        get(ref(db, "customers")),
        get(ref(db, "orders")),
      ]);

      const customersData = customersSnapshot.exists()
        ? customersSnapshot.val()
        : {};
      const ordersData = ordersSnapshot.exists() ? ordersSnapshot.val() : {};
      const orders = Object.values(ordersData);

      // Start from the stored "customers" node
      const byEmail = {};
      Object.entries(customersData).forEach(([id, customer]) => {
        byEmail[customer.email] = {
          id,
          ...customer,
          ordersCount: 0,
          totalSpent: 0,
          lastOrderAt: null,
        };
      });

      // Fold in live stats from orders. If a customer placed an order but
      // doesn't have a "customers" record yet, include them anyway so
      // nothing gets silently hidden.
      orders.forEach((order) => {
        if (!order.customerEmail) return;

        if (!byEmail[order.customerEmail]) {
          byEmail[order.customerEmail] = {
            id: null,
            name: order.customerName,
            email: order.customerEmail,
            phone: "",
            address: "",
            createdAt: order.createdAt,
            ordersCount: 0,
            totalSpent: 0,
            lastOrderAt: null,
          };
        }

        const entry = byEmail[order.customerEmail];
        entry.ordersCount += 1;
        entry.totalSpent += order.totalAmount || 0;
        if (!entry.lastOrderAt || order.createdAt > entry.lastOrderAt) {
          entry.lastOrderAt = order.createdAt;
        }
      });

      const list = Object.values(byEmail).sort((a, b) =>
        (a.name || "").localeCompare(b.name || "")
      );

      setCustomers(list);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  async function updateCustomer(customerId, data) {
    await update(ref(db, `customers/${customerId}`), data);
    await loadCustomers();
  }

  return { customers, loading, updateCustomer, refetch: loadCustomers };
}