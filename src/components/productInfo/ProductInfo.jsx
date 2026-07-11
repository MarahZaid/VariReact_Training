import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import RatingStars from "../../ui/RatingStars";
import { setSelectedColorIndex } from "../../store/productDetailsSlice";

export default function ProductInfo() {
  const dispatch = useDispatch();
  const { product, selectedColorIndex } = useSelector(
    (state) => state.productDetails
  );

  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const colors = product.colors || [];

  const decreaseQty = () => setQuantity((q) => Math.max(1, q - 1));
  const increaseQty = () => setQuantity((q) => q + 1);

  const handleAddToCart = () => {
    console.log("Add to cart:", { productId: product.id, quantity, selectedColorIndex });
  };

  const details = product.details || {};
  const specs = product.specs || {};

  const warrantyTitle = specs.warranty
    ? `${specs.warranty.toUpperCase()} WARRANTY`
    : "WARRANTY";

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        {product.name}
      </Typography>

      <Typography sx={{ color: "text.secondary", mb: 2 }}>
        {product.shortDescription}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <RatingStars rating={product.rating} size="medium" />
        <Typography variant="body2">({product.reviewsCount || 0} Reviews)</Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: "#003b57" }}>
          ${Number(product.price || 0).toFixed(2)}
        </Typography>

        {product.oldPrice && (
          <Typography sx={{ color: "text.secondary", textDecoration: "line-through" }}>
            ${Number(product.oldPrice).toFixed(2)}
          </Typography>
        )}
      </Box>

      {product.discountLabel && (
        <Typography sx={{ color: "success.main", fontWeight: 600, mb: 2 }}>
          {product.discountLabel}
        </Typography>
      )}


      {colors.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ fontWeight: 600, mb: 1.5 }}>
            Color: {colors[selectedColorIndex]?.name}
          </Typography>

          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap" }}>
            {colors.map((color, index) => (
              <Box
                key={color.name}
                onClick={() => dispatch(setSelectedColorIndex(index))}
                title={color.name}
                sx={{
                  width: 42,
                  height: 42,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  border: "1px solid",
                  borderColor: index === selectedColorIndex ? "#009FE3" : "#000",
                  borderRadius: "50%",
                  cursor: "pointer",
                  transition: ".2s",
                }}
              >
                <Box
                  component="img"
                  src={color.colorImg || color.images?.[0]}
                  alt={color.name}
                  sx={{ width: 32, height: 32, objectFit: "cover", borderRadius: "50%" }}
                />
              </Box>
            ))}
          </Box>
        </Box>
      )}

      
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 4, flexWrap: "wrap" }}>
        <Box sx={{ display: "flex", border: "1px solid #ccc" }}>
          <IconButton onClick={decreaseQty} sx={{ borderRadius: 0 }}>
            <RemoveIcon fontSize="small" />
          </IconButton>

          <Box
            sx={{
              width: 48,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderLeft: "1px solid #ccc",
              borderRight: "1px solid #ccc",
            }}
          >
            <Typography>{quantity}</Typography>
          </Box>

          <IconButton onClick={increaseQty} sx={{ borderRadius: 0 }}>
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>

        <Button
          onClick={handleAddToCart}
          variant="contained"
          sx={{
            flexGrow: 1,
            minWidth: 200,
            borderRadius: 0,
            backgroundColor: "#003b57",
            py: 1,
            fontWeight: 600,
            "&:hover": { backgroundColor: "#007fad" },
          }}
        >
          ADD TO CART
        </Button>

        <Button
          startIcon={<FavoriteBorderIcon />}
          sx={{ textTransform: "none", color: "#003b57", fontWeight: 600 }}
        >
          ADD TO LIST
        </Button>
      </Box>

   
      <Box sx={{ mt: 3 }}>
        <Accordion disableGutters elevation={0} sx={{ borderTop: "1px solid #e0e0e0" }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ fontWeight: 600 }}>Product Details</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {details.quote && (
              <Typography sx={{ fontStyle: "italic", mb: 1 }}>
                "{details.quote}" <strong>- {details.quoteSource || ""}</strong>
              </Typography>
            )}
            <Box component="ul" sx={{ pl: 3, m: 0 }}>
              {(details.bullets || []).map((bullet, index) => (
                <li key={index}>
                  <Typography variant="body2">{bullet}</Typography>
                </li>
              ))}
            </Box>
          </AccordionDetails>
        </Accordion>

        <Accordion disableGutters elevation={0}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ fontWeight: 600 }}>Extras In The Box</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2">
              {details.extrasInBox || "No extras are included with this product."}
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion disableGutters elevation={0}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ fontWeight: 600 }}>Shipping</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2">
              {details.shipping || "Standard shipping rates apply."}
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion disableGutters elevation={0}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ fontWeight: 600 }}>Quality Certifications</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2">
              {details.certificationsText || (specs.certifications || []).join(", ")}
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion disableGutters elevation={0}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography sx={{ fontWeight: 600 }}>{warrantyTitle}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2">{details.warrantyText || ""}</Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Box>
  );
}