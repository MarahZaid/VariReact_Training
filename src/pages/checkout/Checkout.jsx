import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ref, get } from "firebase/database";
import { db } from "../../firebase/firebaseConfig";
import { resetCart } from "../../store/cartSlice";
import {
    Box,
    Typography,
    TextField,
    Button,
    Divider,
    Paper,
    Stack,
    Chip,
    Skeleton,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    Alert,
} from "@mui/material";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
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

export default function Checkout() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { items } = useSelector((state) => state.cart);

    const [products, setProducts] = useState({});
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [loadingCustomer, setLoadingCustomer] = useState(true);

    const cartEntries = Object.entries(items || {});
    const uniqueProductIds = [...new Set(cartEntries.map(([, item]) => item.productId))];

    // ---------- Form state ----------
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [paymentMethod] = useState("cash"); 

    const [errors, setErrors] = useState({});
    const [placingOrder, setPlacingOrder] = useState(false);
    const [submitError, setSubmitError] = useState("");

    // ---------- Fetch cart product details ----------
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

    // ---------- Fetch customer profile & prefill billing/shipping ----------
    useEffect(() => {
        async function fetchCustomer() {
            if (!user?.uid) {
                setLoadingCustomer(false);
                return;
            }
            setLoadingCustomer(true);
            try {
                const customerRecord = await getCustomerByUid(user.uid);
                if (customerRecord) {
                    setFullName(customerRecord.name || "");
                    setEmail(customerRecord.email || "");
                    setPhone(customerRecord.phone || "");
                    setAddress(customerRecord.address || ""); 
                }
            } catch (err) {
                console.error("Failed to load customer profile:", err);
            } finally {
                setLoadingCustomer(false);
            }
        }
        fetchCustomer();
    }, [user?.uid]);

    function getColorImage(product, colorName) {
        const colorEntry = product?.colors?.find((c) => c.name === colorName);
        return colorEntry?.images?.[0] || colorEntry?.colorImg || product?.colors?.[0]?.colorImg;
    }

    const subtotal = cartEntries.reduce((sum, [, item]) => {
        const product = products[item.productId];
        if (!product) return sum;
        return sum + product.price * item.quantity;
    }, 0);

    const shipping = subtotal > 0 && subtotal < 200 ? 15 : 0;
    const total = subtotal + shipping;

    function validate() {
        const next = {};
        if (!fullName.trim()) next.fullName = "Full name is required";
        if (!email.trim()) next.email = "Email is required";
        else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email";
        if (!phone.trim()) next.phone = "Phone number is required";
        if (!address.trim()) next.address = "Shipping address is required";
        setErrors(next);
        return Object.keys(next).length === 0;
    }

    async function handlePlaceOrder() {
        if (!user?.uid) {
            setSubmitError("You need to be logged in to place an order.");
            return;
        }
        if (cartEntries.length === 0) return;
        if (!validate()) return;

        setPlacingOrder(true);
        setSubmitError("");

        try {
            const orderId = await createOrderFromCart({
                uid: user.uid,
                customerName: fullName.trim(),
                customerEmail: email.trim(),
                phone: phone.trim(),
                shippingAddress: address.trim(),
                paymentMethod, 
                cartEntries,
                products,
            });

           
            dispatch(resetCart());

            navigate(`/order-details/${orderId}`);
        } catch (err) {
            console.error("Failed to place order:", err);
            setSubmitError("Something went wrong while placing your order. Please try again.");
        } finally {
            setPlacingOrder(false);
        }
    }

    const isLoading = loadingProducts || loadingCustomer;

    // ---------- Empty cart guard ----------
    if (!isLoading && cartEntries.length === 0) {
        return (
            <Box sx={{ backgroundColor: BRAND.pageBg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", px: 3 }}>
                <Box sx={{ textAlign: "center", py: 8, maxWidth: 380 }}>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: BRAND.navy, mb: 1 }}>
                        Your cart is empty
                    </Typography>
                    <Typography sx={{ color: BRAND.subtle, mb: 3.5 }}>
                        Add something to your cart before checking out.
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate("/products")}
                        sx={{ backgroundColor: BRAND.navy, textTransform: "none", borderRadius: "10px", px: 4, py: 1.2, fontWeight: 600, boxShadow: "none", "&:hover": { backgroundColor: "#001f2e" } }}
                    >
                        Browse products
                    </Button>
                </Box>
            </Box>
        );
    }

    return (
        <Box sx={{ backgroundColor: BRAND.pageBg, minHeight: "100vh", py: { xs: 4, md: 6 }, px: { xs: 2, sm: 3 } }}>
            <Box sx={{ maxWidth: 1080, mx: "auto" }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={0.75}
                    sx={{ mb: 2, color: BRAND.subtle, cursor: "pointer", width: "fit-content" }}
                    onClick={() => navigate("/cart")}
                >
                    <ArrowBackIcon sx={{ fontSize: 18 }} />
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Back to cart
                    </Typography>
                </Stack>

                <Typography variant="h4" sx={{ fontWeight: 800, color: BRAND.navy, letterSpacing: "-0.01em", mb: 4 }}>
                    Checkout
                </Typography>

                <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3, alignItems: "flex-start" }}>
                    {/* ---------- Left: Billing / Shipping / Payment form ---------- */}
                    <Paper
                        elevation={0}
                        sx={{ flex: 1, width: "100%", borderRadius: "18px", border: `1px solid ${BRAND.border}`, boxShadow: BRAND.shadow, p: { xs: 2.5, sm: 3.5 } }}
                    >
                        {isLoading ? (
                            <Stack spacing={2}>
                                <Skeleton variant="text" width={180} height={28} />
                                <Skeleton variant="rounded" height={48} />
                                <Skeleton variant="rounded" height={48} />
                                <Skeleton variant="rounded" height={48} />
                            </Stack>
                        ) : (
                            <>
                                {/* Billing information */}
                                <Typography sx={{ fontWeight: 800, color: BRAND.navy, mb: 2 }}>
                                    Billing Information
                                </Typography>
                                <Stack spacing={2} sx={{ mb: 3.5 }}>
                                    <TextField
                                        label="Full name"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        error={!!errors.fullName}
                                        helperText={errors.fullName}
                                        fullWidth
                                    />
                                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                        <TextField
                                            label="Email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            error={!!errors.email}
                                            helperText={errors.email}
                                            fullWidth
                                        />
                                        <TextField
                                            label="Phone number"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            error={!!errors.phone}
                                            helperText={errors.phone}
                                            fullWidth
                                        />
                                    </Stack>
                                </Stack>

                                <Divider sx={{ mb: 3.5, borderColor: BRAND.border }} />

                                {/* Shipping address */}
                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                    <LocalShippingOutlinedIcon sx={{ color: BRAND.teal, fontSize: 20 }} />
                                    <Typography sx={{ fontWeight: 800, color: BRAND.navy }}>
                                        Shipping Address
                                    </Typography>
                                </Stack>
                                <Stack spacing={2} sx={{ mb: 3.5 }}>
                                    <TextField
                                        label="Delivery address"
                                        placeholder="Street, building, city..."
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                        error={!!errors.address}
                                        helperText={errors.address || "This address is used for this order only — your saved profile address won't change"}
                                        multiline
                                        minRows={2}
                                        fullWidth
                                    />
                                </Stack>

                                <Divider sx={{ mb: 3.5, borderColor: BRAND.border }} />

                                {/* Payment method */}
                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                                    <PaymentsOutlinedIcon sx={{ color: BRAND.teal, fontSize: 20 }} />
                                    <Typography sx={{ fontWeight: 800, color: BRAND.navy }}>
                                        Payment Method
                                    </Typography>
                                </Stack>
                                <FormControl>
                                    <RadioGroup value={paymentMethod}>
                                        <FormControlLabel
                                            value="cash"
                                            control={<Radio sx={{ color: BRAND.teal, "&.Mui-checked": { color: BRAND.teal } }} />}
                                            label={
                                                <Box>
                                                    <Typography sx={{ fontWeight: 600, color: BRAND.ink }}>
                                                        Cash on Delivery
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ color: BRAND.subtle }}>
                                                        Pay with cash when your order arrives
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                    </RadioGroup>
                                </FormControl>

                                {submitError && (
                                    <Alert severity="error" sx={{ mt: 3 }}>
                                        {submitError}
                                    </Alert>
                                )}
                            </>
                        )}
                    </Paper>

                    {/* ---------- Right: Order summary ---------- */}
                    <Paper
                        elevation={0}
                        sx={{ width: { xs: "100%", md: 350 }, flexShrink: 0, borderRadius: "18px", border: `1px solid ${BRAND.border}`, boxShadow: BRAND.shadow, p: 3, position: { md: "sticky" }, top: { md: 24 } }}
                    >
                        <Typography sx={{ fontWeight: 800, color: BRAND.navy, mb: 2.5 }}>
                            Order Summary
                        </Typography>

                        <Stack spacing={1.5} sx={{ maxHeight: 260, overflowY: "auto", mb: 2.5 }}>
                            {cartEntries.map(([itemId, item]) => {
                                const product = products[item.productId];
                                if (!product) return null;
                                const image = getColorImage(product, item.color);
                                return (
                                    <Stack key={itemId} direction="row" spacing={1.5} alignItems="center">
                                        <Box component="img" src={image} alt={product.name} sx={{ width: 48, height: 48, objectFit: "contain", borderRadius: "8px", border: `1px solid ${BRAND.border}`, backgroundColor: "#fff", flexShrink: 0 }} />
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Typography noWrap sx={{ fontWeight: 600, color: BRAND.navy, fontSize: "0.85rem" }}>
                                                {product.name}
                                            </Typography>
                                            <Typography sx={{ color: BRAND.subtle, fontSize: "0.75rem" }}>
                                                {item.color} · Qty {item.quantity}
                                            </Typography>
                                        </Box>
                                        <Typography sx={{ fontWeight: 700, color: BRAND.navy, fontSize: "0.85rem" }}>
                                            ${(product.price * item.quantity).toFixed(2)}
                                        </Typography>
                                    </Stack>
                                );
                            })}
                        </Stack>

                        <Divider sx={{ mb: 2.5, borderColor: BRAND.border }} />

                        <Stack spacing={1.4} sx={{ mb: 2.5 }}>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography sx={{ color: BRAND.subtle, mr:1 }}>Subtotal:</Typography>
                                <Typography sx={{ fontWeight: 600, color: BRAND.ink }}>${subtotal.toFixed(2)}</Typography>
                            </Stack>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography sx={{ color: BRAND.subtle, mr:1 }}>Shipping:</Typography>
                                {shipping === 0 ? (
                                    <Chip label="Free" size="small" sx={{ backgroundColor: "#eaf6ea", color: "#2e7d32", fontWeight: 700, borderRadius: "6px" }} />
                                ) : (
                                    <Typography sx={{ fontWeight: 600, color: BRAND.ink }}>${shipping.toFixed(2)}</Typography>
                                )}
                            </Stack>
                        </Stack>

                        <Divider sx={{ mb: 2.5, borderColor: BRAND.border }} />

                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, color: BRAND.navy, mr:1 }}>Total: </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: BRAND.navy }}>${total.toFixed(2)}</Typography>
                        </Stack>

                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={placingOrder || isLoading}
                            onClick={handlePlaceOrder}
                            sx={{ backgroundColor: BRAND.navy, textTransform: "none", borderRadius: "10px", py: 1.4, fontWeight: 700, fontSize: "1rem", boxShadow: "none", "&:hover": { backgroundColor: "#001f2e", boxShadow: "none" } }}
                        >
                            {placingOrder ? "Placing order..." : "Place Order"}
                        </Button>
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
}