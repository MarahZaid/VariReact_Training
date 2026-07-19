import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { sendPasswordResetEmail, signOut } from "firebase/auth";
import { auth, db } from "../../firebase/firebaseConfig";
import { ref, get, query, orderByChild, equalTo } from "firebase/database";
import { getCustomerByUid, updateCustomerProfile } from "../../customerActions";
import { useNavigate } from "react-router-dom";

import {
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Alert,
    Divider,
    Chip,
    Avatar,
    Stack,
    Paper,
} from "@mui/material";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";

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

const STATUS_STYLES = {
    pending: { color: "#b26a00", bg: "#fff4e5" },
    processing: { color: "#0057a3", bg: "#e6f0fa" },
    shipped: { color: "#5e35b1", bg: "#f0eafa" },
    delivered: { color: "#2e7d32", bg: "#eaf6ea" },
    cancelled: { color: "#c62828", bg: "#fdecea" },
};

const fieldSx = {
    mb: 2.5,
    "& .MuiOutlinedInput-root": { borderRadius: "10px", backgroundColor: "#fff" },
};

function initials(name) {
    if (!name) return "?";
    return name
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
}

function ProfileTab({ customer, customerId, onUpdated }) {
    const [name, setName] = useState(customer.name || "");
    const [phone, setPhone] = useState(customer.phone || "");
    const [address, setAddress] = useState(customer.address || "");
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    async function handleSave() {
        setSaving(true);
        setError("");
        setSaved(false);
        try {
            await updateCustomerProfile(customerId, {
                name: name.trim(),
                phone: phone.trim(),
                address: address.trim(),
            });
            setSaved(true);
            onUpdated({ ...customer, name, phone, address });
        } catch (err) {
            console.error(err);
            setError("Something went wrong while saving. Please try again.");
        } finally {
            setSaving(false);
        }
    }

    return (
        <Box sx={{ maxWidth: 480 }}>
            <Typography sx={{ fontWeight: 800, color: BRAND.navy, mb: 3, fontSize: "1.1rem" }}>
                Profile Information
            </Typography>

            {saved && (
                <Alert severity="success" sx={{ mb: 2.5, borderRadius: "10px" }}>
                    Your information was updated.
                </Alert>
            )}
            {error && (
                <Alert severity="error" sx={{ mb: 2.5, borderRadius: "10px" }}>
                    {error}
                </Alert>
            )}

            <Typography variant="caption" sx={{ display: "block", color: BRAND.subtle, mb: 0.5, fontWeight: 600 }}>
                Email
            </Typography>
            <TextField
                fullWidth
                value={customer.email || ""}
                disabled
                sx={fieldSx}
                helperText="Your email is linked to your login and can't be changed here."
            />

            <Typography variant="caption" sx={{ display: "block", color: BRAND.subtle, mb: 0.5, fontWeight: 600 }}>
                Full Name
            </Typography>
            <TextField
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={fieldSx}
            />

            <Typography variant="caption" sx={{ display: "block", color: BRAND.subtle, mb: 0.5, fontWeight: 600 }}>
                Phone
            </Typography>
            <TextField
                fullWidth
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                sx={fieldSx}
            />

            <Typography variant="caption" sx={{ display: "block", color: BRAND.subtle, mb: 0.5, fontWeight: 600 }}>
                Address
            </Typography>
            <TextField
                fullWidth
                multiline
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                sx={{ ...fieldSx, mb: 3 }}
            />

            <Button
                variant="contained"
                disabled={saving}
                onClick={handleSave}
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
                {saving ? <CircularProgress size={20} sx={{ color: "#fff" }} /> : "Save changes"}
            </Button>

            <Divider sx={{ my: 4, borderColor: BRAND.border }} />

            <Typography sx={{ fontWeight: 700, color: BRAND.navy, mb: 1 }}>
                Password
            </Typography>
            <ChangePasswordSection email={customer.email} />
        </Box>
    );
}

function ChangePasswordSection({ email }) {
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    async function handleSendReset() {
        setSending(true);
        setError("");
        try {
            await sendPasswordResetEmail(auth, email);
            setSent(true);
        } catch (err) {
            console.error(err);
            setError("Couldn't send the reset email. Please try again.");
        } finally {
            setSending(false);
        }
    }

    if (sent) {
        return (
            <Alert severity="success" sx={{ borderRadius: "10px" }}>
                A password reset link was sent to {email}. Check your inbox to set a new password.
            </Alert>
        );
    }

    return (
        <Box>
            {error && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: "10px" }}>
                    {error}
                </Alert>
            )}
            <Typography sx={{ color: BRAND.subtle, mb: 1.5, fontSize: "0.9rem" }}>
                We'll send a secure link to your email to set a new password.
            </Typography>
            <Button
                variant="outlined"
                disabled={sending}
                onClick={handleSendReset}
                sx={{
                    textTransform: "none",
                    borderRadius: "10px",
                    borderColor: BRAND.border,
                    color: BRAND.navy,
                    fontWeight: 600,
                    "&:hover": { borderColor: BRAND.navy, backgroundColor: "rgba(0,51,73,0.04)" },
                }}
            >
                {sending ? <CircularProgress size={20} /> : "Send reset link"}
            </Button>
        </Box>
    );
}

function OrdersTab({ email }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchOrders() {
            setLoading(true);
            const ordersQuery = query(ref(db, "orders"), orderByChild("customerEmail"), equalTo(email));
            const snapshot = await get(ordersQuery);

            if (snapshot.exists()) {
                const data = snapshot.val();
                const list = Object.entries(data)
                    .map(([id, order]) => ({ id, ...order }))
                    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
                setOrders(list);
            } else {
                setOrders([]);
            }
            setLoading(false);
        }

        if (email) fetchOrders();
    }, [email]);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                <CircularProgress sx={{ color: BRAND.teal }} />
            </Box>
        );
    }

    if (orders.length === 0) {
        return (
            <Stack alignItems="center" spacing={1.5} sx={{ py: 6 }}>
                <InventoryOutlinedIcon sx={{ fontSize: 36, color: BRAND.border }} />
                <Typography sx={{ color: BRAND.subtle }}>
                    You haven't placed any orders yet.
                </Typography>
            </Stack>
        );
    }

    return (
        <Box>
            <Typography sx={{ fontWeight: 800, color: BRAND.navy, mb: 3, fontSize: "1.1rem" }}>
                Order History
            </Typography>

            {orders.map((order) => {
                const style = STATUS_STYLES[order.status] || { color: BRAND.subtle, bg: BRAND.pageBg };
                return (
                    <Box
                        key={order.id}
                        sx={{
                            border: `1px solid ${BRAND.border}`,
                            borderRadius: "14px",
                            p: 2.5,
                            mb: 2,
                            transition: "box-shadow 0.15s ease",
                            "&:hover": { boxShadow: BRAND.shadow },
                        }}
                    >
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                            <Typography sx={{ fontWeight: 700, color: BRAND.navy }}>
                                Order #{order.id}
                            </Typography>
                            <Chip
                                label={order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : "Pending"}
                                size="small"
                                sx={{
                                    backgroundColor: style.bg,
                                    color: style.color,
                                    fontWeight: 700,
                                    borderRadius: "8px",
                                }}
                            />
                        </Box>

                        <Typography sx={{ color: BRAND.subtle, fontSize: "0.85rem", mb: 1.5 }}>
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ""}
                        </Typography>

                        {(order.items || []).map((item, index) => (
                            <Box key={index} sx={{ display: "flex", justifyContent: "space-between", py: 0.5 }}>
                                <Typography sx={{ fontSize: "0.9rem", color: BRAND.ink }}>
                                    {item.productName} × {item.quantity}
                                </Typography>
                                <Typography sx={{ fontSize: "0.9rem", fontWeight: 600, color: BRAND.ink }}>
                                    ${(item.price * item.quantity).toFixed(2)}
                                </Typography>
                            </Box>
                        ))}

                        <Divider sx={{ my: 1.5, borderColor: BRAND.border }} />

                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                            <Typography sx={{ fontWeight: 700, color: BRAND.ink }}>Total</Typography>
                            <Typography sx={{ fontWeight: 800, color: BRAND.navy }}>
                                ${Number(order.totalAmount || 0).toFixed(2)}
                            </Typography>
                        </Box>
                    </Box>
                );
            })}
        </Box>
    );
}

const NAV_ITEMS = [
    { key: "profile", label: "Profile", icon: PersonOutlineOutlinedIcon },
    { key: "orders", label: "Orders", icon: ReceiptLongOutlinedIcon },
];

export default function Account() {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState("profile");

    async function handleLogout() {
        try {
            await signOut(auth);
            navigate("/login");
        } catch (err) {
            console.error("Logout error:", err);
        }
    }

    useEffect(() => {
        async function fetchCustomer() {
            setLoading(true);
            const result = await getCustomerByUid(user.uid);
            setCustomer(result);
            setLoading(false);
        }

        if (user) fetchCustomer();
    }, [user]);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 12, backgroundColor: BRAND.pageBg, minHeight: "60vh" }}>
                <CircularProgress sx={{ color: BRAND.teal }} />
            </Box>
        );
    }

    if (!customer) {
        return (
            <Box sx={{ textAlign: "center", py: 12, backgroundColor: BRAND.pageBg, minHeight: "60vh" }}>
                <Typography sx={{ color: BRAND.subtle }}>
                    We couldn't find your profile information.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ backgroundColor: BRAND.pageBg, minHeight: "100vh", py: { xs: 4, md: 6 }, px: { xs: 2, sm: 3 } }}>
            <Box sx={{ maxWidth: 960, mx: "auto" }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: BRAND.navy, mb: 4, letterSpacing: "-0.01em" }}>
                    My Account
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        gap: 3,
                        alignItems: "flex-start",
                    }}
                >
                    {/* Sidebar */}
                    <Paper
                        elevation={0}
                        sx={{
                            width: { xs: "100%", md: 260 },
                            flexShrink: 0,
                            borderRadius: "18px",
                            border: `1px solid ${BRAND.border}`,
                            boxShadow: BRAND.shadow,
                            p: 2.5,
                            position: { md: "sticky" },
                            top: { md: 24 },
                        }}
                    >
                        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
                            <Avatar
                                sx={{
                                    width: 48,
                                    height: 48,
                                    backgroundColor: "rgba(0,127,173,0.1)",
                                    color: BRAND.navy,
                                    fontWeight: 700,
                                }}
                            >
                                {initials(customer.name)}
                            </Avatar>
                            <Box sx={{ minWidth: 0 }}>
                                <Typography sx={{ fontWeight: 700, color: BRAND.ink, lineHeight: 1.2 }} noWrap>
                                    {customer.name || "My Account"}
                                </Typography>
                                <Typography variant="caption" sx={{ color: BRAND.subtle }} noWrap>
                                    {customer.email}
                                </Typography>
                            </Box>
                        </Stack>

                        <Stack spacing={0.5}>
                            {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
                                const active = tab === key;
                                return (
                                    <Box
                                        key={key}
                                        onClick={() => setTab(key)}
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 1.5,
                                            px: 1.5,
                                            py: 1.1,
                                            borderRadius: "10px",
                                            cursor: "pointer",
                                            color: active ? BRAND.navy : BRAND.subtle,
                                            backgroundColor: active ? "rgba(0,127,173,0.08)" : "transparent",
                                            fontWeight: active ? 700 : 500,
                                            transition: "background-color 0.15s ease",
                                            "&:hover": { backgroundColor: active ? "rgba(0,127,173,0.08)" : BRAND.pageBg },
                                        }}
                                    >
                                        <Icon fontSize="small" />
                                        <Typography sx={{ fontWeight: "inherit", fontSize: "0.92rem" }}>
                                            {label}
                                        </Typography>
                                    </Box>
                                );
                            })}
                        </Stack>

                        <Divider sx={{ my: 2, borderColor: BRAND.border }} />

                        <Box
                            onClick={handleLogout}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                                px: 1.5,
                                py: 1.1,
                                borderRadius: "10px",
                                cursor: "pointer",
                                color: "#c62828",
                                fontWeight: 600,
                                transition: "background-color 0.15s ease",
                                "&:hover": { backgroundColor: "#fdecea" },
                            }}
                        >
                            <LogoutIcon fontSize="small" />
                            <Typography sx={{ fontWeight: "inherit", fontSize: "0.92rem" }}>
                                Log out
                            </Typography>
                        </Box>
                    </Paper>

                    {/* Content */}
                    <Paper
                        elevation={0}
                        sx={{
                            flex: 1,
                            width: "100%",
                            borderRadius: "18px",
                            border: `1px solid ${BRAND.border}`,
                            boxShadow: BRAND.shadow,
                            p: { xs: 2.5, sm: 3.5 },
                        }}
                    >
                        {tab === "profile" && (
                            <ProfileTab
                                customer={customer}
                                customerId={customer.id}
                                onUpdated={setCustomer}
                            />
                        )}
                        {tab === "orders" && <OrdersTab email={customer.email} />}
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
}