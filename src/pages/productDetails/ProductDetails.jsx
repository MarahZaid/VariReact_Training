import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, Container, Grid, CircularProgress, Typography } from "@mui/material";
import {
  fetchProductDetails,
  resetProductDetails,
} from "../../store/productDetailsSlice";
import ProductGallery from "../../components/productGallery/ProductGallery";
import ProductInfo from "../../components/productInfo/ProductInfo";
import ProductBreadcrumb from "../../components/productBreadcrumb/ProductBreadcrumb";
import RatingBreakdown from "../../components/ratingBreakdown/RatingBreakdown";
import ReviewSlider from "../../components/reviewSlider/ReviewSlider";
import CustomerReviews from "../../components/customerReviews/CustomerReviews";
import ContactEmail from "../../components/contactEmail/ContactEmail";

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { product, loading, error } = useSelector((state) => state.productDetails);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }

    return () => {
      dispatch(resetProductDetails());
    };
  }, [id, dispatch]);

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
        This product could not be loaded.
      </Typography>
    );
  }

  if (!product) return null;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <ProductBreadcrumb />
      <Grid container spacing={5}>
        <Grid item size={{ xs: 12, md: 6, }}>
          <ProductGallery />
        </Grid>

        <Grid item size={{ xs: 12, md: 6, }}>
          <ProductInfo />
        </Grid>
      </Grid>

      <ReviewSlider />

      <Container>
        <RatingBreakdown />
        <CustomerReviews />
      </Container>

      <ContactEmail />
    </Container>
  );
}
