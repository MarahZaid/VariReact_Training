import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layouts/MainLayout.jsx";
import AdminLayout from "../Layouts/AdminLayout.jsx";
import Home from "../pages/home/Home.jsx";
import Products from "../pages/products/Products.jsx"
import ProductDetails from "../pages/productDetails/ProductDetails.jsx";
import Login from "../pages/login/Login.jsx";
import ProtectedAdminRoute from "./ProtectedAdminRoute.jsx";
import Account from "../pages/account/Account.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Cart from "../pages/cart/Cart.jsx";

import AdminDashboard from "../pages/admin/dashboard/AdminDashboard.jsx";
import AdminProducts from "../pages/admin/products/AdminProducts.jsx";
import AdminProductDetails from "../pages/admin/products/AdminProductDetails.jsx";
import AdminCategories from "../pages/admin/categories/AdminCategories.jsx";
import AdminOrders from "../pages/admin/orders/AdminOrders.jsx";
import AdminCustomers from "../pages/admin/customers/AdminCustomers.jsx";
import AdminCategoryProducts from "../pages/admin/categories/AdminCategoryProducts.jsx";
import AddProduct from "../pages/admin/products/AddProduct.jsx";

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
            {
                path: '/login',
                element: <Login />
            },
            {
                path: 'account',
                element: (
                    <ProtectedRoute>
                        <Account />
                    </ProtectedRoute>
                )
            },
            {
                path: 'cart',
                element: (
                    <ProtectedRoute>
                        <Cart />
                    </ProtectedRoute>
                )
            },
        ]
    },


    {
        path: '/admin',
        element: (
            <ProtectedAdminRoute>
                <AdminLayout />
            </ProtectedAdminRoute>
        ),
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
                path: 'products/:productId',
                element: <AdminProductDetails />
            },
            {
                path: 'products/new',
                element: <AddProduct />

            },
            {
                path: 'categories',
                element: <AdminCategories />
            },
            {
                path: 'categories/:categoryId/products',
                element: <AdminCategoryProducts />

            },
            {
                path: 'orders',
                element: <AdminOrders />
            },
            {
                path: 'customers',
                element: <AdminCustomers />
            },
        ]
    },

]);

export default router;