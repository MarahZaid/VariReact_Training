import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ref, get } from "firebase/database";
import { db } from "../../firebase/firebaseConfig";
import {
  Box,
  Typography,
  Popper,
  Paper,
  Fade,
  Divider,
  Button,
  Skeleton,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import CloseIcon from "@mui/icons-material/Close";

const BRAND = {
  navy: "#003349",
  teal: "#007fad",
  subtle: "#6b7c84",
  border: "rgba(0,51,73,0.08)",
  pageBg: "#f6f8f9",
};


export default function MiniCart({ anchorEl, open, onMouseEnter, onMouseLeave, onClose }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { items } = useSelector((state) => state.cart);

  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);

  const cartEntries = Object.entries(items || {});
  const uniqueProductIds = [...new Set(cartEntries.map(([, item]) => item.productId))];

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    async function fetchProducts() {
      setLoading(true);
      const results = await Promise.all(
        uniqueProductIds.map(async (id) => {
          const snapshot = await get(ref(db, `products/${id}`));
          return [id, snapshot.exists() ? snapshot.val() : null];
        })
      );
      if (!cancelled) {
        setProducts(Object.fromEntries(results));
        setLoading(false);
      }
    }

    if (uniqueProductIds.length > 0) {
      fetchProducts();
    } else {
      setProducts({});
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [open, JSON.stringify(uniqueProductIds)]);

  function getColorImage(product, colorName) {
    const colorEntry = product?.colors?.find((c) => c.name === colorName);
    return colorEntry?.images?.[0] || colorEntry?.colorImg || product?.colors?.[0]?.colorImg;
  }

  const subtotal = cartEntries.reduce((sum, [, item]) => {
    const product = products[item.productId];
    if (!product) return sum;
    return sum + product.price * item.quantity;
  }, 0);

  function handleViewCart() {
    if (onClose) onClose();
    navigate("/cart");
  }


  const body = cartEntries.length === 0 ? (
    <Box sx={{ p: 3, textAlign: "center" }}>
      <ShoppingCartOutlinedIcon sx={{ fontSize: 32, color: BRAND.teal, mb: 1 }} />
      <Typography sx={{ color: BRAND.subtle }}>Your cart is empty</Typography>
    </Box>
  ) : (
    <>
      <Box sx={{ maxHeight: { xs: "50vh", sm: 300 }, overflowY: "auto" }}>
        {loading
          ? [1, 2].map((i) => (
              <Box key={i} sx={{ display: "flex", gap: 1.5, p: 1.5 }}>
                <Skeleton variant="rounded" width={56} height={56} sx={{ borderRadius: "8px" }} />
                <Box sx={{ flex: 1 }}>
                  <Skeleton variant="text" width="70%" />
                  <Skeleton variant="text" width="40%" />
                </Box>
              </Box>
            ))
          : cartEntries.map(([itemId, item]) => {
              const product = products[item.productId];
              if (!product) return null;
              const image = getColorImage(product, item.color);

              return (
                <Box
                  key={itemId}
                  sx={{
                    display: "flex",
                    gap: 1.5,
                    p: 1.5,
                    "&:hover": { backgroundColor: BRAND.pageBg },
                  }}
                >
                  <Box
                    component="img"
                    src={image}
                    alt={product.name}
                    sx={{
                      width: 56,
                      height: 56,
                      objectFit: "contain",
                      borderRadius: "8px",
                      border: `1px solid ${BRAND.border}`,
                      backgroundColor: "#fff",
                      flexShrink: 0,
                    }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography noWrap sx={{ fontWeight: 700, color: BRAND.navy, fontSize: "0.9rem" }}>
                      {product.name}
                    </Typography>
                    <Typography sx={{ color: BRAND.subtle, fontSize: "0.78rem" }}>
                      {item.color} · Qty {item.quantity}
                    </Typography>
                    <Typography sx={{ fontWeight: 600, color: BRAND.navy, fontSize: "0.85rem" }}>
                      ${(product.price * item.quantity).toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
      </Box>

      <Divider />

      <Box sx={{ p: 1.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.2 }}>
          <Typography sx={{ fontWeight: 700, color: BRAND.navy }}>Subtotal</Typography>
          <Typography sx={{ fontWeight: 800, color: BRAND.navy }}>
            ${subtotal.toFixed(2)}
          </Typography>
        </Box>
        <Button
          fullWidth
          variant="contained"
          onClick={handleViewCart}
          sx={{
            backgroundColor: BRAND.navy,
            textTransform: "none",
            borderRadius: "8px",
            boxShadow: "none",
            fontWeight: 700,
            "&:hover": { backgroundColor: "#001f2e", boxShadow: "none" },
          }}
        >
          View Cart
        </Button>
      </Box>
    </>
  );


  if (isMobile) {
    return (
      <Drawer anchor="bottom" open={open} onClose={onClose} sx={{ zIndex: 1300 }}>
        <Box sx={{ borderTopLeftRadius: "16px", borderTopRightRadius: "16px", overflow: "hidden" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
              py: 1.5,
              borderBottom: `1px solid ${BRAND.border}`,
            }}
          >
            <Typography sx={{ fontWeight: 800, color: BRAND.navy }}>Your Cart</Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>
          {body}
        </Box>
      </Drawer>
    );
  }


  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="bottom-end"
      transition
      sx={{ zIndex: 1300 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      modifiers={[{ name: "offset", options: { offset: [0, 8] } }]}
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={150}>
          <Paper
            elevation={6}
            sx={{
              width: 340,
              maxHeight: 440,
              borderRadius: "14px",
              overflow: "hidden",
              border: `1px solid ${BRAND.border}`,
            }}
          >
            {body}
          </Paper>
        </Fade>
      )}
    </Popper>
  );
}