import { useState, useEffect } from "react";
import { ref, get } from "firebase/database";
import { db } from "../firebase/firebaseConfig";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function useDashboardStats() {
  const [stats, setStats] = useState({
    productsCount: 0,
    categoriesCount: 0,
    ordersCount: 0,
    revenue: 0,
    salesByDay: [],
    topProducts: [],
    ordersByStatus: [],
    salesByCategory: [],
    lowStockProducts: [],
    loading: true,
  });

  useEffect(() => {
    async function loadStats() {
      try {
        const [productsSnapshot, categoriesSnapshot, ordersSnapshot] =
          await Promise.all([
            get(ref(db, "products")),
            get(ref(db, "categories")),
            get(ref(db, "orders")),
          ]);

        const productsData = productsSnapshot.exists()
          ? productsSnapshot.val()
          : {};
        const categoriesData = categoriesSnapshot.exists()
          ? categoriesSnapshot.val()
          : {};

        const productsCount = Object.keys(productsData).length;
        const categoriesCount = Object.keys(categoriesData).length;

       
        const LOW_STOCK_THRESHOLD = 20;
        const lowStockProducts = Object.entries(productsData)
          .filter(([, product]) => (product.stock ?? Infinity) <= LOW_STOCK_THRESHOLD)
          .map(([productId, product]) => ({
            productId,
            name: product.name,
            stock: product.stock,
          }))
          .sort((a, b) => a.stock - b.stock);

       
        const productToCategory = {};
        Object.entries(productsData).forEach(([productId, product]) => {
          productToCategory[productId] = product.categoryId;
        });

        const categoryNames = {};
        Object.entries(categoriesData).forEach(([categoryId, category]) => {
          categoryNames[categoryId] = category.name;
        });

        let ordersCount = 0;
        let revenue = 0;

        
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date(today);
          d.setDate(today.getDate() - i);
          last7Days.push({
            key: d.toDateString(),
            day: DAY_LABELS[d.getDay()],
            sales: 0,
          });
        }

        const productSales = {}; // productId -> { productName, quantity }
        const statusCounts = {}; // status -> count
        const categorySales = {}; // categoryId -> revenue

        if (ordersSnapshot.exists()) {
          const orders = Object.values(ordersSnapshot.val());
          ordersCount = orders.length;

         
          revenue = orders.reduce((sum, order) => {
            if (order.status !== "delivered") return sum;
            return sum + (order.totalAmount || 0);
          }, 0);

          orders.forEach((order) => {
           
            const status = order.status || "unknown";
            statusCounts[status] = (statusCounts[status] || 0) + 1;

            if (order.status === "cancelled") return;

            if (order.createdAt) {
              const orderDate = new Date(order.createdAt);
              orderDate.setHours(0, 0, 0, 0);
              const dayEntry = last7Days.find(
                (d) => d.key === orderDate.toDateString()
              );
              if (dayEntry) {
                dayEntry.sales += order.totalAmount || 0;
              }
            }

            (order.items || []).forEach((item) => {
           
              const productKey = item.productId || item.productName;
              if (!productSales[productKey]) {
                productSales[productKey] = {
                  productName: item.productName,
                  quantity: 0,
                };
              }
              productSales[productKey].quantity += item.quantity || 0;

              
              const categoryId = productToCategory[item.productId];
              const itemTotal = (item.price || 0) * (item.quantity || 0);
              if (categoryId) {
                categorySales[categoryId] =
                  (categorySales[categoryId] || 0) + itemTotal;
              }
            });
          });
        }

        const salesByDay = last7Days.map(({ day, sales }) => ({ day, sales }));

        const topProducts = Object.values(productSales)
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 5);

        const ordersByStatus = Object.entries(statusCounts).map(
          ([status, count]) => ({
            status: status.charAt(0).toUpperCase() + status.slice(1),
            count,
          })
        );

        const salesByCategory = Object.entries(categorySales)
          .map(([categoryId, total]) => ({
            category: categoryNames[categoryId] || categoryId,
            total: Math.round(total * 100) / 100,
          }))
          .sort((a, b) => b.total - a.total);

        setStats({
          productsCount,
          categoriesCount,
          ordersCount,
          revenue,
          salesByDay,
          topProducts,
          ordersByStatus,
          salesByCategory,
          lowStockProducts,
          loading: false,
        });
      } catch (err) {
        console.log(err);
        setStats((prev) => ({ ...prev, loading: false }));
      }
    }

    loadStats();
  }, []);

  return stats;
}