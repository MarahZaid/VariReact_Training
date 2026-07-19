import { Box, Grid, Typography, Card, Chip, Stack, Skeleton } from "@mui/material";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import CategoryIcon from "@mui/icons-material/Category";
import ListAltIcon from "@mui/icons-material/ListAlt";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import StatCard from "../../../ui/StatCard";
import useDashboardStats from "../../../hooks/useDashboardStats";

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

const CHART_HEIGHT = 240;

function getStockSeverity(stock) {
    if (stock <= 10) {
        return { label: "Critical", color: "#c62828", bg: "#fdecea" };
    }
    return { label: "Low", color: "#b26a00", bg: "#fff4e5" };
}

export default function AdminDashboard() {
    const {
        productsCount,
        categoriesCount,
        ordersCount,
        revenue,
        salesByDay,
        topProducts,
        lowStockProducts,
        loading,
    } = useDashboardStats();

    const revenueFormatted = `$${revenue.toLocaleString("en-US", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })}`;

    return (
        <Box sx={{ backgroundColor: BRAND.pageBg, minHeight: "100%", p: { xs: 2, md: 3 } }}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: BRAND.navy, letterSpacing: "-0.01em" }}>
                    Analytics
                </Typography>
                <Typography variant="body2" sx={{ color: BRAND.subtle, mt: 0.25 }}>
                    An overview of your store's performance
                </Typography>
            </Box>

            {/* Stat cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
                    {loading ? (
                        <Skeleton variant="rounded" height={110} sx={{ borderRadius: "16px" }} />
                    ) : (
                        <StatCard
                            label="Products"
                            value={productsCount}
                            icon={Inventory2Icon}
                            color={BRAND.teal}
                        />
                    )}
                </Grid>

                <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
                    {loading ? (
                        <Skeleton variant="rounded" height={110} sx={{ borderRadius: "16px" }} />
                    ) : (
                        <StatCard
                            label="Categories"
                            value={categoriesCount}
                            icon={CategoryIcon}
                            color="#22aaff"
                        />
                    )}
                </Grid>

                <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
                    {loading ? (
                        <Skeleton variant="rounded" height={110} sx={{ borderRadius: "16px" }} />
                    ) : (
                        <StatCard
                            label="Orders"
                            value={ordersCount}
                            icon={ListAltIcon}
                            color={BRAND.navy}
                        />
                    )}
                </Grid>

                <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
                    {loading ? (
                        <Skeleton variant="rounded" height={110} sx={{ borderRadius: "16px" }} />
                    ) : (
                        <StatCard
                            label="Revenue"
                            value={revenueFormatted}
                            icon={AttachMoneyIcon}
                            color="#2e7d32"
                        />
                    )}
                </Grid>
            </Grid>

            {/* Charts */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item size={{ xs: 12, md: 6 }}>
                    <Card
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: "18px",
                            border: `1px solid ${BRAND.border}`,
                            boxShadow: BRAND.shadow,
                            backgroundColor: BRAND.cardBg,
                            height: "100%",
                        }}
                    >
                        <Typography sx={{ fontWeight: 700, color: BRAND.navy, mb: 2 }}>
                            Sales This Week
                        </Typography>

                        {loading ? (
                            <Skeleton variant="rounded" height={CHART_HEIGHT} sx={{ borderRadius: "12px" }} />
                        ) : (
                            <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
                                <LineChart data={salesByDay}>
                                    <defs>
                                        <linearGradient id="salesLineGradient" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor="#003349" />
                                            <stop offset="100%" stopColor="#22aaff" />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid stroke="#f0f0f0" />
                                    <XAxis dataKey="day" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" />
                                    <Tooltip
                                        contentStyle={{ borderRadius: 12, border: `1px solid ${BRAND.border}` }}
                                        formatter={(value) => [`$${value}`, "Sales"]}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="sales"
                                        stroke="url(#salesLineGradient)"
                                        strokeWidth={3}
                                        dot={{ r: 4, fill: BRAND.teal, strokeWidth: 0 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </Card>
                </Grid>

                <Grid item size={{ xs: 12, md: 6 }}>
                    <Card
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: "18px",
                            border: `1px solid ${BRAND.border}`,
                            boxShadow: BRAND.shadow,
                            backgroundColor: BRAND.cardBg,
                            height: "100%",
                        }}
                    >
                        <Typography sx={{ fontWeight: 700, color: BRAND.navy, mb: 2 }}>
                            Top Selling Products
                        </Typography>

                        {loading ? (
                            <Skeleton variant="rounded" height={CHART_HEIGHT} sx={{ borderRadius: "12px" }} />
                        ) : (
                            <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
                                <BarChart data={topProducts} layout="vertical" margin={{ left: 24 }}>
                                    <defs>
                                        <linearGradient id="topProductsGradient" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor="#003349" />
                                            <stop offset="50%" stopColor="#007fad" />
                                            <stop offset="100%" stopColor="#22aaff" />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid stroke="#f0f0f0" horizontal={false} />
                                    <XAxis type="number" stroke="#94a3b8" allowDecimals={false} />
                                    <YAxis
                                        type="category"
                                        dataKey="productName"
                                        width={130}
                                        stroke="#94a3b8"
                                        tick={{ fontSize: 12 }}
                                    />
                                    <Tooltip
                                        contentStyle={{ borderRadius: 12, border: `1px solid ${BRAND.border}` }}
                                        formatter={(value) => [value, "Units sold"]}
                                    />
                                    <Bar
                                        dataKey="quantity"
                                        fill="url(#topProductsGradient)"
                                        radius={[0, 8, 8, 0]}
                                        barSize={18}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        )}
                    </Card>
                </Grid>
            </Grid>

            {/* Low Stock Alert */}
            <Card
                elevation={0}
                sx={{
                    p: 3,
                    borderRadius: "18px",
                    border: `1px solid ${BRAND.border}`,
                    boxShadow: BRAND.shadow,
                    backgroundColor: BRAND.cardBg,
                }}
            >
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <WarningAmberIcon sx={{ color: "#b26a00", fontSize: 22 }} />
                    <Typography sx={{ fontWeight: 700, color: BRAND.navy }}>Low Stock Alert</Typography>
                </Stack>

                {loading && (
                    <Grid container spacing={2}>
                        {[1, 2, 3].map((i) => (
                            <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                                <Skeleton variant="rounded" height={52} sx={{ borderRadius: "12px" }} />
                            </Grid>
                        ))}
                    </Grid>
                )}

                {!loading && lowStockProducts.length === 0 && (
                    <Typography variant="body2" sx={{ color: BRAND.subtle }}>
                        All products are well stocked right now. 🎉
                    </Typography>
                )}

                {!loading && (
                    <Grid container spacing={2}>
                        {lowStockProducts.map((product) => {
                            const severity = getStockSeverity(product.stock);
                            return (
                                <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={product.productId}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "space-between",
                                            gap: 2,
                                            p: 1.5,
                                            borderRadius: "12px",
                                            border: `1px solid ${BRAND.border}`,
                                        }}
                                    >
                                        <Typography variant="body2" sx={{ fontWeight: 600, color: BRAND.ink }}>
                                            {product.name}
                                        </Typography>
                                        <Chip
                                            label={`${product.stock} left`}
                                            size="small"
                                            sx={{
                                                backgroundColor: severity.bg,
                                                color: severity.color,
                                                fontWeight: 700,
                                                borderRadius: "8px",
                                            }}
                                        />
                                    </Box>
                                </Grid>
                            );
                        })}
                    </Grid>
                )}
            </Card>
        </Box>
    );
}