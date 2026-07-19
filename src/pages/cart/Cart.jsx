import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ref, get } from "firebase/database";
import { db } from "../../firebase/firebaseConfig";
import {
    Box,
    Typography,
    IconButton,
    Button,
    Divider,
    Paper,
    Stack,
    Chip,
    Skeleton,
    Snackbar, Alert
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { setCartItemQuantity, removeFromCart } from "../../utils/cartActions";
import { getCustomerByUid } from "../../utils/customerActions";
import { createOrderFromCart } from "../../utils/orderActions";

const BRAND = {
    navy: "#003349",
    teal: "#007fad",
    ink: "#1a2b33",
    subtle: "#6b7c84",
    cardBg: "#ffffff",
    pageBg: "#f6f8f9",
    border: "rgba(0,51,73,0.08)",
    shadow: "0 1px 2px rgba(0,51,73,0.04), 0 8px 24px rgba(0,51,73,0.06)",
};

export default function Cart() {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const { items, status } = useSelector((state) => state.cart);

    const [products, setProducts] = useState({}); // { productId: productData }
    const [loadingProducts, setLoadingProducts] = useState(true);

    const cartEntries = Object.entries(items); // [ [itemId, {productId, color, quantity}], ... ]
    const uniqueProductIds = [...new Set(cartEntries.map(([, item]) => item.productId))];

    const [placingOrder, setPlacingOrder] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);
    const [orderError, setOrderError] = useState("");

    useEffect(() => {
        async function fetchProducts() {
            setLoadingProducts(true);
            const results = await Promise.all(
                uniqueProductIds.map(async (id) => {
                    const snapshot = await get(ref(db, `products/${id}`));
                    return [id, snapshot.exists() ? snapshot.val() : null];
                })
            );
            setProducts(Object.fromEntries(results));
            setLoadingProducts(false);
        }

        if (uniqueProductIds.length > 0) {
            fetchProducts();
        } else {
            setProducts({});
            setLoadingProducts(false);
        }

    }, [JSON.stringify(uniqueProductIds)]);

    function getColorImage(product, colorName) {
        const colorEntry = product?.colors?.find((c) => c.name === colorName);
        return colorEntry?.images?.[0] || colorEntry?.colorImg || product?.colors?.[0]?.colorImg;
    }

    const itemCount = cartEntries.reduce((sum, [, item]) => sum + item.quantity, 0);

    const subtotal = cartEntries.reduce((sum, [, item]) => {
        const product = products[item.productId];
        if (!product) return sum;
        return sum + product.price * item.quantity;
    }, 0);

    const shipping = subtotal > 0 && subtotal < 200 ? 15 : 0;
    const total = subtotal + shipping;

    async function handleCheckout() {
        setPlacingOrder(true);
        setOrderError("");
        try {
            const customer = await getCustomerByUid(user.uid);
            if (!customer) {
                throw new Error("Customer profile not found");
            }

            await createOrderFromCart({
                uid: user.uid,
                customerName: customer.name,
                customerEmail: customer.email,
                cartEntries,
                products,
            });

            setOrderSuccess(true);
        } catch (err) {
            console.error("Checkout error:", err);
            setOrderError("Something went wrong while placing your order. Please try again.");
        } finally {
            setPlacingOrder(false);
        }
    }

    // ---------- Loading skeleton ----------
    if (status === "loading" || loadingProducts) {
        return (
            <Box sx={{ backgroundColor: BRAND.pageBg, minHeight: "100vh", py: { xs: 4, md: 6 }, px: { xs: 2, sm: 3 } }}>
                <Box sx={{ maxWidth: 1080, mx: "auto" }}>
                    <Skeleton variant="text" width={160} height={20} sx={{ mb: 2 }} />
                    <Skeleton variant="text" width={220} height={48} sx={{ mb: 4 }} />

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column", md: "row" },
                            gap: 3,
                            alignItems: "flex-start",
                        }}
                    >
                        <Paper
                            elevation={0}
                            sx={{
                                flex: 1,
                                width: "100%",
                                borderRadius: "18px",
                                border: `1px solid ${BRAND.border}`,
                                boxShadow: BRAND.shadow,
                                overflow: "hidden",
                            }}
                        >
                            {[1, 2, 3].map((i, index) => (
                                <Box key={i}>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, p: 2.5 }}>
                                        <Skeleton variant="rounded" width={88} height={88} sx={{ borderRadius: "12px", flexShrink: 0 }} />
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Skeleton variant="text" width="55%" height={26} />
                                            <Skeleton variant="text" width="30%" height={20} />
                                            <Skeleton variant="text" width="20%" height={22} />
                                        </Box>
                                        <Skeleton variant="rounded" width={90} height={36} sx={{ borderRadius: "999px" }} />
                                        <Skeleton variant="text" width={60} height={26} />
                                        <Skeleton variant="circular" width={36} height={36} />
                                    </Box>
                                    {index < 2 && <Divider sx={{ borderColor: BRAND.border }} />}
                                </Box>
                            ))}
                        </Paper>

                        <Paper
                            elevation={0}
                            sx={{
                                width: { xs: "100%", md: 320 },
                                flexShrink: 0,
                                borderRadius: "18px",
                                border: `1px solid ${BRAND.border}`,
                                boxShadow: BRAND.shadow,
                                p: 3,
                            }}
                        >
                            <Skeleton variant="text" width={140} height={28} sx={{ mb: 2.5 }} />
                            <Stack spacing={1.6} sx={{ mb: 2.5 }}>
                                <Stack direction="row" justifyContent="space-between">
                                    <Skeleton variant="text" width={70} height={22} />
                                    <Skeleton variant="text" width={50} height={22} />
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Skeleton variant="text" width={70} height={22} />
                                    <Skeleton variant="text" width={50} height={22} />
                                </Stack>
                            </Stack>
                            <Divider sx={{ mb: 2.5, borderColor: BRAND.border }} />
                            <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
                                <Skeleton variant="text" width={60} height={32} />
                                <Skeleton variant="text" width={70} height={32} />
                            </Stack>
                            <Skeleton variant="rounded" height={48} sx={{ borderRadius: "10px" }} />
                        </Paper>
                    </Box>
                </Box>
            </Box>
        );
    }

    
    return (
        <Box sx={{ backgroundColor: BRAND.pageBg, minHeight: "100vh", py: { xs: 4, md: 6 }, px: { xs: 2, sm: 3 } }}>
            {cartEntries.length === 0 ? (
                // ---------- Empty cart ----------
                <Box
                    sx={{
                        minHeight: "50vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        px: 3,
                    }}
                >
                    <Box sx={{ textAlign: "center", py: 8, maxWidth: 380 }}>
                        <Box
                            sx={{
                                width: 88,
                                height: 88,
                                borderRadius: "50%",
                                backgroundColor: "rgba(0,127,173,0.08)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                mx: "auto",
                                mb: 3,
                            }}
                        >
                            <ShoppingCartOutlinedIcon sx={{ fontSize: 40, color: BRAND.teal }} />
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: BRAND.navy, mb: 1 }}>
                            Your cart is empty
                        </Typography>
                        <Typography sx={{ color: BRAND.subtle, mb: 3.5 }}>
                            Looks like you haven't added anything yet. Let's find something you'll love.
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => navigate("/products")}
                            sx={{
                                backgroundColor: BRAND.navy,
                                textTransform: "none",
                                borderRadius: "10px",
                                px: 4,
                                py: 1.2,
                                fontWeight: 600,
                                boxShadow: "none",
                                "&:hover": { backgroundColor: "#001f2e", boxShadow: "none" },
                            }}
                        >
                            Browse products
                        </Button>
                    </Box>
                </Box>
            ) : (
                // ---------- Cart with items ----------
                <Box sx={{ maxWidth: 1080, mx: "auto" }}>
                    {/* Header */}
                    <Stack
                        direction="row"
                        alignItems="center"
                        spacing={0.75}
                        sx={{ mb: 2, color: BRAND.subtle, cursor: "pointer", width: "fit-content" }}
                        onClick={() => navigate("/products")}
                    >
                        <ArrowBackIcon sx={{ fontSize: 18 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            Continue shopping
                        </Typography>
                    </Stack>

                    <Stack direction="row" alignItems="baseline" spacing={1.5} sx={{ mb: 4 }}>
                        <Typography variant="h4" sx={{ fontWeight: 800, color: BRAND.navy, letterSpacing: "-0.01em" }}>
                            Your Cart
                        </Typography>
                        <Typography sx={{ color: BRAND.subtle }}>
                            {itemCount} {itemCount === 1 ? "item" : "items"}
                        </Typography>
                    </Stack>

                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: { xs: "column", md: "row" },
                            gap: 3,
                            alignItems: "flex-start",
                        }}
                    >
                        {/* Cart items */}
                        <Paper
                            elevation={0}
                            sx={{
                                flex: 1,
                                width: "100%",
                                borderRadius: "18px",
                                border: `1px solid ${BRAND.border}`,
                                boxShadow: BRAND.shadow,
                                overflow: "hidden",
                            }}
                        >
                            {cartEntries.map(([itemId, item], index) => {
                                const product = products[item.productId];
                                if (!product) return null;
                                const { color, quantity, productId } = item;
                                const image = getColorImage(product, color);

                                return (
                                    <Box key={itemId}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: { xs: "column", sm: "row" },
                                                alignItems: { xs: "stretch", sm: "center" },
                                                gap: { xs: 1.5, sm: 2.5 },
                                                p: 2.5,
                                                transition: "background-color 0.15s ease",
                                                "&:hover": { backgroundColor: BRAND.pageBg },
                                            }}
                                        >
                                            {/* Product info row: image + name/color/unit price */}
                                            <Box sx={{ display: "flex", gap: 2.5, flex: 1, minWidth: 0 }}>
                                                <Box
                                                    component="img"
                                                    src={image}
                                                    alt={product.name}
                                                    sx={{
                                                        width: 88,
                                                        height: 88,
                                                        objectFit: "contain",
                                                        borderRadius: "12px",
                                                        border: `1px solid ${BRAND.border}`,
                                                        backgroundColor: "#fff",
                                                        flexShrink: 0,
                                                    }}
                                                />

                                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                                    <Typography sx={{ fontWeight: 700, color: BRAND.navy }}>
                                                        {product.name}
                                                    </Typography>
                                                    <Typography sx={{ color: BRAND.subtle, mt: 0.4, fontSize: "0.85rem" }}>
                                                        Color: {color}
                                                    </Typography>
                                                    <Typography sx={{ color: BRAND.ink, mt: 0.6, fontWeight: 600 }}>
                                                        ${product.price}
                                                    </Typography>

                                                    {/* Delete button on mobile - inline under product info */}
                                                    <IconButton
                                                        onClick={() => removeFromCart(user.uid, itemId)}
                                                        sx={{
                                                            display: { xs: "inline-flex", sm: "none" },
                                                            color: "#c62828",
                                                            ml: -1,
                                                            mt: 0.5,
                                                            "&:hover": { backgroundColor: "#fdecea" },
                                                        }}
                                                    >
                                                        <DeleteOutlinedIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>
                                            </Box>

                                            {/* Quantity + total price row */}
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: { xs: "space-between", sm: "flex-end" },
                                                    gap: { xs: 1.5, sm: 2.5 },
                                                    flexShrink: 0,
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 0.5,
                                                        border: `1px solid ${BRAND.border}`,
                                                        borderRadius: "999px",
                                                        px: 0.5,
                                                        backgroundColor: BRAND.pageBg,
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    <IconButton
                                                        size="small"
                                                        onClick={() =>
                                                            setCartItemQuantity(user.uid, itemId, productId, color, quantity - 1)
                                                        }
                                                        sx={{ color: BRAND.navy }}
                                                    >
                                                        <RemoveIcon fontSize="small" />
                                                    </IconButton>
                                                    <Typography sx={{ width: 22, textAlign: "center", fontWeight: 700, color: BRAND.ink }}>
                                                        {quantity}
                                                    </Typography>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() =>
                                                            setCartItemQuantity(user.uid, itemId, productId, color, quantity + 1)
                                                        }
                                                        sx={{ color: BRAND.navy }}
                                                    >
                                                        <AddIcon fontSize="small" />
                                                    </IconButton>
                                                </Box>

                                                <Typography sx={{ fontWeight: 700, color: BRAND.navy, minWidth: 76, textAlign: "right" }}>
                                                    ${(product.price * quantity).toFixed(2)}
                                                </Typography>

                                                {/* Delete button on desktop - end of row */}
                                                <IconButton
                                                    onClick={() => removeFromCart(user.uid, itemId)}
                                                    sx={{
                                                        display: { xs: "none", sm: "inline-flex" },
                                                        color: "#c62828",
                                                        "&:hover": { backgroundColor: "#fdecea" },
                                                    }}
                                                >
                                                    <DeleteOutlinedIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </Box>

                                        {index < cartEntries.length - 1 && <Divider sx={{ borderColor: BRAND.border }} />}
                                    </Box>
                                );
                            })}
                        </Paper>

                        {/* Order summary */}
                        <Paper
                            elevation={0}
                            sx={{
                                width: { xs: "100%", md: 320 },
                                flexShrink: 0,
                                borderRadius: "18px",
                                border: `1px solid ${BRAND.border}`,
                                boxShadow: BRAND.shadow,
                                p: 3,
                                position: { md: "sticky" },
                                top: { md: 24 },
                            }}
                        >
                            <Typography sx={{ fontWeight: 800, color: BRAND.navy, mb: 2.5 }}>
                                Order Summary
                            </Typography>

                            <Stack spacing={1.4}>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography sx={{ color: BRAND.subtle, mr: 1 }}>Subtotal: </Typography>
                                    <Typography sx={{ fontWeight: 600, color: BRAND.ink }}>
                                        ${subtotal.toFixed(2)}
                                    </Typography>
                                </Stack>

                                <Stack direction="row" justifyContent="space-between">
                                    <Typography sx={{ color: BRAND.subtle, mr: 1 }}>Shipping: </Typography>
                                    {shipping === 0 ? (
                                        <Chip
                                            label="Free"
                                            size="small"
                                            sx={{
                                                backgroundColor: "#eaf6ea",
                                                color: "#2e7d32",
                                                fontWeight: 700,
                                                borderRadius: "6px",
                                            }}
                                        />
                                    ) : (
                                        <Typography sx={{ fontWeight: 600, color: BRAND.ink }}>
                                            ${shipping.toFixed(2)}
                                        </Typography>
                                    )}
                                </Stack>

                                {shipping > 0 && (
                                    <Stack
                                        direction="row"
                                        spacing={1}
                                        alignItems="center"
                                        sx={{
                                            backgroundColor: BRAND.pageBg,
                                            borderRadius: "10px",
                                            px: 1.5,
                                            py: 1,
                                        }}
                                    >
                                        <LocalShippingOutlinedIcon sx={{ fontSize: 18, color: BRAND.teal }} />
                                        <Typography variant="caption" sx={{ color: BRAND.subtle }}>
                                            Add ${(200 - subtotal).toFixed(2)} more for free shipping
                                        </Typography>
                                    </Stack>
                                )}
                            </Stack>

                            <Divider sx={{ my: 2.5, borderColor: BRAND.border }} />

                            <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: BRAND.navy, mr: 1 }}>
                                    Total:
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 800, color: BRAND.navy }}>
                                    ${total.toFixed(2)}
                                </Typography>
                            </Stack>

                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                disabled={placingOrder}
                                onClick={handleCheckout}
                                sx={{
                                    backgroundColor: BRAND.navy,
                                    textTransform: "none",
                                    borderRadius: "10px",
                                    py: 1.4,
                                    fontWeight: 700,
                                    fontSize: "1rem",
                                    boxShadow: "none",
                                    "&:hover": { backgroundColor: "#001f2e", boxShadow: "none" },
                                }}
                            >
                                {placingOrder ? "Placing order..." : "Checkout"}
                            </Button>

                            {orderError && (
                                <Typography sx={{ color: "#c62828", fontSize: "0.85rem", mt: 1.5, textAlign: "center" }}>
                                    {orderError}
                                </Typography>
                            )}

                            <Typography
                                variant="caption"
                                sx={{ display: "block", textAlign: "center", color: BRAND.subtle, mt: 1.5 }}
                            >
                                Taxes calculated at checkout
                            </Typography>
                        </Paper>
                    </Box>
                </Box>
            )}

            {/* Snackbar lives outside the conditional so it survives the cart-emptying re-render */}
            <Snackbar
                open={orderSuccess}
                autoHideDuration={2000}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert severity="success" variant="filled" sx={{ backgroundColor: "#003b57" }}>
                    Order placed successfully!
                </Alert>
            </Snackbar>
        </Box>
    );
}