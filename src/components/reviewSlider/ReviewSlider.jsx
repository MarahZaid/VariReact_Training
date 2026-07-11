import { useRef } from "react";
import { useSelector } from "react-redux";
import { Box, IconButton, Card, Typography } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import RatingStars from "../../ui/RatingStars";

export default function ReviewSlider() {
  const { reviews } = useSelector((state) => state.productDetails);
  const sliderRef = useRef(null);

  const imageReviews = reviews.filter((r) => r.image);

  if (!imageReviews.length) return null;

  const scroll = (direction) => {
    sliderRef.current?.scrollBy({ left: direction * 300, behavior: "smooth" });
  };

  return (
    <Box sx={{ py: 6, borderTop: "1px solid #e0e0e0"  }}>
      <Typography variant="h4" sx={{ fontWeight: 700, textAlign: "center", mb: 4 }}>
        Customer Reviews
      </Typography>

      <Box sx={{ position: "relative" }}>
      <IconButton
        onClick={() => scroll(-1)}
        sx={{
          position: "absolute",
          left: -8,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 2,
          backgroundColor: "white",
          boxShadow: 1,
          "&:hover": { backgroundColor: "#f0f0f0" },
        }}
      >
        <ChevronLeftIcon />
      </IconButton>

      <Box
        ref={sliderRef}
        sx={{
          display: "flex",
          gap: 1,
          overflowX: "auto",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
          px: 5,
        }}
      >
        {imageReviews.map((review) => (
          <Card
            key={review.id}
            elevation={0}
            sx={{
              width: 200,
              height: 200,
              flexShrink: 0,
              position: "relative",
              borderRadius: 1,
              overflow: "hidden",
              "&:hover .stars-overlay": { opacity: 1 },
            }}
          >
            <Box
              component="img"
              src={review.image}
              sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            />

            <Box
              className="stars-overlay"
              sx={{
                position: "absolute",
                inset: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(255,255,255,0.75)",
                opacity: 0,
                transition: ".3s",
              }}
            >
              <RatingStars rating={review.rating} size="large" />
            </Box>
          </Card>
        ))}
      </Box>

      <IconButton
        onClick={() => scroll(1)}
        sx={{
          position: "absolute",
          right: -8,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 2,
          backgroundColor: "white",
          boxShadow: 1,
          "&:hover": { backgroundColor: "#f0f0f0" },
        }}
      >
        <ChevronRightIcon />
      </IconButton>
      </Box>
    </Box>
  );
}