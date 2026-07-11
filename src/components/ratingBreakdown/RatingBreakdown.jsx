import { useSelector } from "react-redux";
import { Box, Typography, LinearProgress, Button } from "@mui/material";
import RatingStars from "../../ui/RatingStars";

export default function RatingBreakdown() {
  const { product } = useSelector((state) => state.productDetails);

  if (!product) return null;

  const total = product.reviewsCount || 0;

  const breakdown = [
    { star: 5, count: product.review5stars || 0 },
    { star: 4, count: product.review4stars || 0 },
    { star: 3, count: product.review3stars || 0 },
    { star: 2, count: product.review2stars || 0 },
    { star: 1, count: product.review1stars || 0 },
  ];

  return (
    <Box sx={{ py: 7, px:{xs:2, sm:2, md:8} }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 5,
          alignItems: { md: "center" },
          justifyContent: "space-between",
        }}
      >
     
        <Box sx={{ textAlign: "center", minWidth: 160 }}>
          <Typography variant="h2" sx={{ fontWeight: 700, color: "#003b57" }}>
            {Number(product.rating || 0).toFixed(1)}
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", my: 1 }}>
            <RatingStars rating={product.rating} size="medium" />
          </Box>

          <Typography variant="body2" color="text.secondary">
            Based on {total} reviews
          </Typography>
        </Box>

       
        <Box sx={{ flexGrow: 1, width: "100%", maxWidth: 500 }}>
          {breakdown.map(({ star, count }) => {
            const pct = total ? (count / total) * 100 : 0;

            return (
              <Box key={star} sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1.5 }}>
                <Typography sx={{ width: 55 }}>{star} star</Typography>

                <LinearProgress
                  variant="determinate"
                  value={pct}
                  sx={{
                    flexGrow: 1,
                    height: 8,
                    borderRadius: 20,
                    backgroundColor: "#ececec",
                    "& .MuiLinearProgress-bar": { backgroundColor: "#003b57" },
                  }}
                />

                <Typography sx={{ width: 30, textAlign: "right" }}>{count}</Typography>
              </Box>
            );
          })}
        </Box>

      
        <Button
          variant="contained"
          sx={{
            borderRadius: 5,
            px: 4,
            py: 1.2,
            backgroundColor: "#003b57",
            fontWeight: 600,
            whiteSpace: "nowrap",
            "&:hover": { backgroundColor: "#002c43" },
          }}
        >
          Write A Review
        </Button>
      </Box>
    </Box>
  );
}