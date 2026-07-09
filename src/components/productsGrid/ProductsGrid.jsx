import { useSelector } from "react-redux";
import { Grid, Typography, Box } from "@mui/material";
import ProductCard from "../../ui/ProductCard";
import { selectFilteredSortedProducts } from "../../store/categoryProductsSlice";

export default function ProductsGrid() {
  const products = useSelector(selectFilteredSortedProducts);

  if (!products.length) {
    return (
      <Box sx={{ py: 6, textAlign: "center" }}>
        <Typography color="text.secondary">
          No Produts
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={4} sx={{ rowGap: 5 }}>
      {products.map((product) => (
        <Grid item key={product.id} size={{ xs: 12, sm:6, lg: 4 }}>
          <ProductCard product={product} />
        </Grid>
      ))}
    </Grid>
  );
}