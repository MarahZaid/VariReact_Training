import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, Container, Grid, Typography, Skeleton, Fade } from "@mui/material";
import { fetchCategoryProducts } from "../../store/categoryProductsSlice";
import HeroCategory from "../../components/heroCategory/HeroCategory";
import HeaderCategory from "../../components/headerCategory/HeaderCategory";
import FiltersSidebar from "../../components/filtersSidebar/FiltersSidebar";
import MobileFilters from "../../components/mobileFilters/MobileFilters";
import ProductsGrid from "../../components/productsGrid/ProductsGrid";
import ContactEmail from "../../components/contactEmail/ContactEmail";

function ProductsGridSkeleton() {
  return (
    <Grid container spacing={4} sx={{ rowGap: 5 }}>
      {Array.from({ length: 6 }).map((_, index) => (
        <Grid item key={index} size={{ xs: 12, sm: 6, lg: 4 }}>
          <Skeleton variant="rectangular" height={260} sx={{ mb: 1 }} />
          <Skeleton variant="text" width="70%" />
          <Skeleton variant="text" width="40%" />
        </Grid>
      ))}
    </Grid>
  );
}

export default function Products() {
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("category");
  const dispatch = useDispatch();

  const { loading, error, category } = useSelector((state) => state.categoryProducts);

  useEffect(() => {
    if (categoryId) {
      dispatch(fetchCategoryProducts(categoryId));
    }
  }, [categoryId, dispatch]);

  if (error) {
    return (
      <Typography textAlign="center" color="error" py={10}>
        error
      </Typography>
    );
  }

  return (
    <Box>
      {/* Hero/Header يضلوا موجودين حتى وقت التحميل، فقط الـ Grid هوي يلي بيتبدل */}
      {!loading && category && (
        <>
          <HeroCategory />
          <HeaderCategory />
        </>
      )}

      {loading && (
        <Box sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
          <Skeleton variant="text" width={220} height={45} />
          <Skeleton variant="text" width={320} />
        </Box>
      )}

      <Container maxWidth="xl" sx={{ pb: 6 }}>
        {!loading && <MobileFilters />}

        <Grid container spacing={3}>
          <Grid item size={{ lg: 3 }} sx={{ display: { xs: "none", lg: "block" } }}>
            {!loading && <FiltersSidebar />}
          </Grid>

          <Grid item size={{ xs: 12, lg: 9 }}>
            <Fade in={!loading} timeout={300}>
              <Box>{loading ? null : <ProductsGrid />}</Box>
            </Fade>
            {loading && <ProductsGridSkeleton />}
          </Grid>
        </Grid>
      </Container>

      <ContactEmail />
    </Box>
  );
}