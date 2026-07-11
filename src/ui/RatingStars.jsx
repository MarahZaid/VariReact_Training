import { Box } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

export default function RatingStars({ rating = 0, size = "small", color = "#ffc107" }) {
  const fullStars = Math.round(rating);

  return (
    <Box sx={{ display: "flex", color }}>
      {[1, 2, 3, 4, 5].map((i) =>
        i <= fullStars ? (
          <StarIcon key={i} fontSize={size} />
        ) : (
          <StarBorderIcon key={i} fontSize={size} />
        )
      )}
    </Box>
  );
}