import { useState } from "react";
import { useSelector } from "react-redux";
import { Box, Typography, Avatar, Pagination, Grid } from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import RatingStars from "../../ui/RatingStars";

const REVIEWS_PER_PAGE = 3;

function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function CustomerReviews() {
  const { reviews } = useSelector((state) => state.productDetails);
  const [page, setPage] = useState(1);

  if (!reviews.length) {
    return (
      <Typography color="text.secondary" sx={{ py: 4 }}>
        No reviews yet for this product.
      </Typography>
    );
  }

  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);
  const start = (page - 1) * REVIEWS_PER_PAGE;
  const pageReviews = reviews.slice(start, start + REVIEWS_PER_PAGE);

  const handlePageChange = (_, value) => {
    setPage(value);
    document
      .querySelector("#customersSay")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Box id="customersSay" sx={{ py: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
        Customers say
      </Typography>

      {pageReviews.map((review) => (
        <Grid
          container
          spacing={3}
          key={review.id}
          sx={{ borderTop: "1px solid #e0e0e0", py: 5 }}
        >
          <Grid item xs={12} md={2}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar sx={{ bgcolor: "#e0e0e0", color: "text.secondary", width: 55, height: 55 }}>
                {getInitials(review.userName)}
              </Avatar>

              <Box>
                <Typography sx={{ fontWeight: 600 }}>{review.userName}</Typography>

                {review.verified && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <VerifiedIcon sx={{ fontSize: 16, color: "#003b57" }} />
                    <Typography variant="caption">Verified Buyer</Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1.5 }}>
              <RatingStars rating={review.rating} />
              <Typography sx={{ fontWeight: 600 }}>{review.title}</Typography>
            </Box>

            <Typography sx={{ mb: 2 }}>{review.comment}</Typography>

            {review.image && (
              <Box
                component="img"
                src={review.image}
                alt={`Photo from ${review.userName}'s review`}
                sx={{ width: 130 }}
              />
            )}
          </Grid>

          <Grid item xs={12} md={2} sx={{ textAlign: { md: "right" }, color: "text.secondary" }}>
            {review.date}
          </Grid>
        </Grid>
      ))}

      {totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2, mb: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            shape="rounded"
            sx={{
              "& .MuiPaginationItem-root": {
                borderRadius: "6px",
                backgroundColor: "#f6f7f7",
                color: "#003b57",
                border: "none",
                mx: 0.5,
              },
              "& .MuiPaginationItem-root.Mui-selected": {
                backgroundColor: "#003b57",
                color: "#fff",
              },
              "& .MuiPaginationItem-root.Mui-disabled": {
                color: "#c7c7c7",
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}