import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./Layout/MainLayout";
import AdminLayout from "./Layout/AdminLayout";
import Home from "./pages/home/Home.jsx";
import Products from "./pages/products/Products.jsx"
import ProductDetails from "./pages/productDetails/ProductDetails.jsx"

import AdminDashboard from "./pages/admin/dashboard/AdminDashboard.jsx";
import AdminProducts from "./pages/admin/products/AdminProducts.jsx";
import AdminCategories from "./pages/admin/categories/AdminCategories.jsx";
import AdminOrders from "./pages/admin/orders/AdminOrders.jsx";
import AdminAnalytics from "./pages/admin/analytics/AdminAnalytics.jsx";

const router = createBrowserRouter([
    {
        path: '/',
        element:
            <MainLayout />
        ,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: 'products',
                element: <Products />
            },
            {
                path: 'product/:id',
                element: <ProductDetails />
            },
        ]
    },

    {
        path: '/admin',
        element: <AdminLayout />,
        children: [
            {
                index: true,
                element: <AdminDashboard />
            },
           {
                path: 'products',
                element: <AdminProducts />
            },
            {
                path: 'categories',
                element: <AdminCategories />
            },
            {
                path: 'orders',
                element: <AdminOrders />
            },
            {
                path: 'analytics',
                element: <AdminAnalytics />
            },
        ]
    },

]);

export default router;