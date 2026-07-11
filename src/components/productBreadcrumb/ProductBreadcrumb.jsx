import { useSelector } from "react-redux";
import { Breadcrumbs, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function ProductBreadcrumb() {
  const { product, category } = useSelector((state) => state.productDetails);

  if (!product) return null;

  return (
    <Breadcrumbs separator="/" sx={{ mb: 3 }}>
      <Link to="/" style={{ color: "#219fc5", textDecoration: "none" }}>
        Home
      </Link>

      <Link to="/products" style={{ color: "#219fc5", textDecoration: "none" }}>
        Products
      </Link>

      {category && (
        <Link
          to={`/products?category=${product.categoryId}`}
          style={{ color: "#219fc5", textDecoration: "none" }}
        >
          {category.name || category.PLPName}
        </Link>
      )}

      <Typography sx={{ color: "#032f49", fontWeight: 600 }}>
        {product.name}
      </Typography>
    </Breadcrumbs>
  );
}