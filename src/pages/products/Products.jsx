import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, Container, Grid, CircularProgress, Typography } from "@mui/material";
import { fetchCategoryProducts } from "../../store/categoryProductsSlice";
import HeroCategory from "../../components/heroCategory/HeroCategory";
import HeaderCategory from "../../components/headerCategory/HeaderCategory";
import FiltersSidebar from "../../components/filtersSidebar/FiltersSidebar";
import MobileFilters from "../../components/mobileFilters/MobileFilters";
import ProductsGrid from "../../components/productsGrid/ProductsGrid";
import ContactEmail from "../../components/contactEmail/ContactEmail";

export default function Products() {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category");
  const dispatch = useDispatch();

  const { loading, error } = useSelector((state) => state.categoryProducts);

  useEffect(() => {
    if (categoryId) {
      dispatch(fetchCategoryProducts(categoryId));
    }
  }, [categoryId, dispatch]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={10}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography textAlign="center" color="error" py={10}>
       error
      </Typography>
    );
  }

  return (
    <Box>
      <HeroCategory />
      <HeaderCategory />

      <Container maxWidth="xl" sx={{ pb: 6 }}>
        <MobileFilters />

        <Grid container spacing={3}>
          <Grid item size={{lg:3}} sx={{ display: { xs: "none", lg: "block" } }}>
            <FiltersSidebar />
          </Grid>

          <Grid item size={{ xs: 12, lg: 9 }} >
            <ProductsGrid />
          </Grid>
        </Grid>
      </Container>

      <ContactEmail />
    </Box>
  );
}