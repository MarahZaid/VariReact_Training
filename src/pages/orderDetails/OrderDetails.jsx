import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ref, get } from "firebase/database";
import { db } from "../../firebase/firebaseConfig";
import {
    Box,
    Typography,
    Paper,
    Stack,
    Divider,
    Chip,
    Button,
    Skeleton,
} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";

const BRAND = {
    navy: "#003349",
    teal: "#007fad",
    ink: "#1a2b33",
    subtle: "#6b7c84",
    pageBg: "#f6f8f9",
    border: "rgba(0,51,73,0.08)",
    shadow: "0 1px 2px rgba(0,51,73,0.04), 0 8px 24px rgba(0,51,73,0.06)",
};

const STATUS_COLORS = {
    pending: { bg: "#fff4e5", color: "#b26a00" },
    processing: { bg: "#e8f0fe", color: "#1a56db" },
    shipped: { bg: "#eef2ff", color: "#4338ca" },
    delivered: { bg: "#eaf6ea", color: "#2e7d32" },
};

export default function OrderDetails() {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        async function fetchOrder() {
            setLoading(true);
            setNotFound(false);
            try {
                const snapshot = await get(ref(db, `orders/${orderId}`));
                if (snapshot.exists()) {
                    setOrder(snapshot.val());
                } else {
                    setNotFound(true);
                }
            } catch (err) {
                console.error("Failed to load order:", err);
                setNotFound(true);
            } finally {
                setLoading(false);
            }
        }
        if (orderId) fetchOrder();
    }, [orderId]);

    // ---------- Loading ----------
    if (loading) {
        return (
            <Box sx={{ backgroundColor: BRAND.pageBg, minHeight: "100vh", py: { xs: 4, md: 6 }, px: { xs: 2, sm: 3 } }}>
                <Box sx={{ maxWidth: 720, mx: "auto" }}>
                    <Skeleton variant="text" width={240} height={40} sx={{ mb: 3 }} />
                    <Skeleton variant="rounded" height={220} sx={{ borderRadius: "18px" }} />
                </Box>
            </Box>
        );
    }

    // ---------- Not found ----------
    if (notFound || !order) {
        return (
            <Box sx={{ backgroundColor: BRAND.pageBg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", px: 3 }}>
                <Box sx={{ textAlign: "center", py: 8, maxWidth: 380 }}>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: BRAND.navy, mb: 1 }}>
                        Order not found
                    </Typography>
                    <Typography sx={{ color: BRAND.subtle, mb: 3.5 }}>
                        We couldn't find this order. It may have been removed.
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

    const statusStyle = STATUS_COLORS[order.status] || STATUS_COLORS.pending;
    const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" }) : "";

    return (
        <Box sx={{ backgroundColor: BRAND.pageBg, minHeight: "100vh", py: { xs: 4, md: 5 }, px: { xs: 2, sm: 3 } }}>
            <Box sx={{ maxWidth: 720, mx: "auto" }}>
                {/* Success banner */}
                <Box sx={{ textAlign: "center", mb: 4 }}>
                    <CheckCircleIcon sx={{ fontSize: 56, color: "#2e7d32", mb: 1 }} />
                    <Typography variant="h5" sx={{ fontWeight: 800, color: BRAND.navy, mb: 0.5 }}>
                        Order placed successfully!
                    </Typography>
                    <Typography sx={{ color: BRAND.subtle }}>
                        Thanks{order.customerName ? `, ${order.customerName}` : ""} — we're getting your order ready.
                    </Typography>
                </Box>

                <Paper elevation={0} sx={{ borderRadius: "18px", border: `1px solid ${BRAND.border}`, boxShadow: BRAND.shadow, overflow: "hidden" }}>
                    {/* Header */}
                    <Box sx={{ p: 3, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 1.5 }}>
                        <Box>
                            <Typography sx={{ color: BRAND.subtle, fontSize: "0.8rem" }}>Order ID</Typography>
                            <Typography sx={{ fontWeight: 700, color: BRAND.navy, fontFamily: "monospace" }}>
                                {orderId}
                            </Typography>
                        </Box>
                        <Box sx={{ textAlign: "right" }}>
                            <Typography sx={{ color: BRAND.subtle, fontSize: "0.8rem" }}>{orderDate}</Typography>
                            <Chip
                                label={(order.status || "pending").toUpperCase()}
                                size="small"
                                sx={{ mt: 0.5, backgroundColor: statusStyle.bg, color: statusStyle.color, fontWeight: 700, borderRadius: "6px" }}
                            />
                        </Box>
                    </Box>

                    <Divider sx={{ borderColor: BRAND.border }} />

                    {/* Items */}
                    <Box sx={{ p: 3 }}>
                        <Typography sx={{ fontWeight: 700, color: BRAND.navy, mb: 2 }}>Items</Typography>
                        <Stack spacing={1.5}>
                            {(order.items || []).map((item, idx) => (
                                <Stack key={idx} direction="row" justifyContent="space-between" alignItems="center">
                                    <Box sx={{ minWidth: 0 }}>
                                        <Typography sx={{ fontWeight: 600, color: BRAND.ink, fontSize: "0.9rem" }} noWrap>
                                            {item.productName}
                                        </Typography>
                                        <Typography sx={{ color: BRAND.subtle, fontSize: "0.78rem" }}>
                                            {item.color ? `${item.color} · ` : ""}Qty {item.quantity}
                                        </Typography>
                                    </Box>
                                    <Typography sx={{ fontWeight: 700, color: BRAND.navy, fontSize: "0.9rem", flexShrink: 0, ml: 2 }}>
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </Typography>
                                </Stack>
                            ))}
                        </Stack>
                    </Box>

                    <Divider sx={{ borderColor: BRAND.border }} />

                    {/* Shipping + payment */}
                    <Box sx={{ p: 3, display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 3 }}>
                        <Box sx={{ flex: 1 }}>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                <LocalShippingOutlinedIcon sx={{ color: BRAND.teal, fontSize: 18 }} />
                                <Typography sx={{ fontWeight: 700, color: BRAND.navy, fontSize: "0.9rem" }}>
                                    Shipping Address
                                </Typography>
                            </Stack>
                            <Typography sx={{ color: BRAND.subtle, fontSize: "0.85rem" }}>
                                {order.shippingAddress || "—"}
                            </Typography>
                            {order.phone && (
                                <Typography sx={{ color: BRAND.subtle, fontSize: "0.85rem", mt: 0.5 }}>
                                    {order.phone}
                                </Typography>
                            )}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                <PaymentsOutlinedIcon sx={{ color: BRAND.teal, fontSize: 18 }} />
                                <Typography sx={{ fontWeight: 700, color: BRAND.navy, fontSize: "0.9rem" }}>
                                    Payment Method
                                </Typography>
                            </Stack>
                            <Typography sx={{ color: BRAND.subtle, fontSize: "0.85rem" }}>
                                {order.paymentMethod === "cash" ? "Cash on Delivery" : order.paymentMethod || "—"}
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ borderColor: BRAND.border }} />

                    {/* Totals */}
                    <Box sx={{ p: 3 }}>
                        <Stack spacing={1} sx={{ mb: 2 }}>
                            <Stack direction="row" justifyContent="space-between">
                                <Typography sx={{ color: BRAND.subtle, mr:1 }}>Subtotal:</Typography>
                                <Typography sx={{ fontWeight: 600, color: BRAND.ink }}>
                                    ${(order.subtotal ?? order.totalAmount ?? 0).toFixed(2)}
                                </Typography>
                            </Stack>
                            {typeof order.shippingFee === "number" && (
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography sx={{ color: BRAND.subtle, mr:1 }}>Shipping:</Typography>
                                    <Typography sx={{ fontWeight: 600, color: BRAND.ink }}>
                                        {order.shippingFee === 0 ? "Free" : `$${order.shippingFee.toFixed(2)}`}
                                    </Typography>
                                </Stack>
                            )}
                        </Stack>
                        <Divider sx={{ mb: 2, borderColor: BRAND.border }} />
                        <Stack direction="row" justifyContent="space-between">
                            <Typography variant="h6" sx={{ fontWeight: 700, color: BRAND.navy, mr:1 }}>Total:</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 800, color: BRAND.navy }}>
                                ${(order.totalAmount ?? 0).toFixed(2)}
                            </Typography>
                        </Stack>
                    </Box>
                </Paper>

                <Box sx={{ textAlign: "center", mt: 4 }}>
                    <Button
                        variant="contained"
                        onClick={() => navigate("/products")}
                        sx={{ backgroundColor: BRAND.navy, textTransform: "none", borderRadius: "10px", px: 4, py: 1.2, fontWeight: 600, boxShadow: "none", "&:hover": { backgroundColor: "#001f2e" } }}
                    >
                        Continue Shopping
                    </Button>
                </Box>
            </Box>
        </Box>
    );
}