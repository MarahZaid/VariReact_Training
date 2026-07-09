import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./Layout/MainLayout";
import Home from "./pages/home/Home.jsx";
import Products from "./pages/products/Products.jsx"
import ProductDetails from "./pages/productDetails/ProductDetails.jsx"

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


]);

export default router;