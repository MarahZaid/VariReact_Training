
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Snackbar, Alert
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import RatingStars from "../../ui/RatingStars";
import { setSelectedColorIndex } from "../../store/productDetailsSlice";
import { addToCart } from "../../cartActions";

export default function ProductInfo() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { product, selectedColorIndex } = useSelector(
    (state) => state.productDetails
  );
  const { user, status } = useSelector((state) => state.auth);
  const { items: cartItems } = useSelector((state) => state.cart);

  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  if (!product) return null;

  const colors = product.colors || [];

  const [showSuccess, setShowSuccess] = useState(false);

  const decreaseQty = () => setQuantity((q) => Math.max(1, q - 1));
  const increaseQty = () => setQuantity((q) => q + 1);

  const handleAddToCart = async () => {
    if (status === "unauthenticated") {
      navigate("/login");
      return;
    }

    const selectedColor = colors[selectedColorIndex]?.name;
    if (!selectedColor) return;

    setAdding(true);
    try {
      const existingEntry = Object.values(cartItems).find(
        (item) => item.productId === product.id && item.color === selectedColor
      );
      const currentQty = existingEntry ? existingEntry.quantity : 0;

      await addToCart(user.uid, product.id, selectedColor, currentQty, quantity);
      setShowSuccess(true); // ⬅️ جديد
    } catch (err) {
      console.error("Error adding to cart:", err);
    } finally {
      setAdding(false);
    }
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
          disabled={adding}
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
          {adding ? "ADDING..." : "ADD TO CART"}
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

      <Snackbar
        open={showSuccess}
        autoHideDuration={2500}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          variant="filled"
          sx={{ backgroundColor: "#003b57" }}
        >
          {product.name} added to cart
        </Alert>
      </Snackbar>

    </Box>
  );
}