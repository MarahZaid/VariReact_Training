import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Box, Container, Grid, Typography, Skeleton, Fade } from "@mui/material";
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

function ProductDetailsSkeleton() {
  return (
    <Grid container spacing={5}>
      <Grid item size={{ xs: 12, md: 6 }}>
        <Skeleton variant="rectangular" height={480} />
      </Grid>

      <Grid item size={{ xs: 12, md: 6 }}>
        <Skeleton variant="text" width="80%" height={45} />
        <Skeleton variant="text" width="50%" sx={{ mb: 2 }} />
        <Skeleton variant="text" width="30%" height={35} sx={{ mb: 3 }} />
        <Skeleton variant="rectangular" height={48} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={48} />
      </Grid>
    </Grid>
  );
}

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

  if (error) {
    return (
      <Typography textAlign="center" color="error" py={10}>
        This product could not be loaded.
      </Typography>
    );
  }

  return (
    <>
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {!loading && product && <ProductBreadcrumb />}

      {loading || !product ? (
        <ProductDetailsSkeleton />
      ) : (
        <Fade in timeout={300}>
          <Box>
            <Grid container spacing={5}>
              <Grid item size={{ xs: 12, md: 6 }}>
                <ProductGallery />
              </Grid>

              <Grid item size={{ xs: 12, md: 6 }}>
                <ProductInfo />
              </Grid>
            </Grid>

            <ReviewSlider />

            <Container>
              <RatingBreakdown />
              <CustomerReviews />
            </Container>
          </Box>
        </Fade>
      )}

      
    </Container>
    <ContactEmail />
    </>
  );
}