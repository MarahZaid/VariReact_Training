import { Box, Grid, Typography, Card, Chip, Stack } from "@mui/material";
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
        <Box sx={{p: { xs: 2, md: 3 } }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#003349", letterSpacing: "-0.01em" }}>
                Analytics
            </Typography>
            

            {/* */}
            <Grid container spacing={3} sx={{ mb: 2 }}>
                <Grid item size={{ xs: 2, sm: 6, md: 3 }}>
                    <StatCard
                        label="Products"
                        value={loading ? "…" : productsCount}
                        icon={Inventory2Icon}
                        color="#007fad"
                    />
                </Grid>

                <Grid item size={{ xs: 2, sm: 6, md: 3 }}>
                    <StatCard
                        label="Categories"
                        value={loading ? "…" : categoriesCount}
                        icon={CategoryIcon}
                        color="#22aaff"
                    />
                </Grid>

                <Grid item size={{ xs: 2, sm: 6, md: 3 }}>
                    <StatCard
                        label="Orders"
                        value={loading ? "…" : ordersCount}
                        icon={ListAltIcon}
                        color="#003349"
                    />
                </Grid>

                <Grid item size={{ xs: 2, sm: 6, md: 3 }}>
                    <StatCard
                        label="Revenue"
                        value={loading ? "…" : revenueFormatted}
                        icon={AttachMoneyIcon}
                        color="#2e7d32"
                    />
                </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ mb: 2 }}>

                <Grid item size={{ xs: 12, md: 6 }}>
                    <Card
                        elevation={0}
                        sx={{ p: 3, borderRadius: "16px", border: "1px solid #eee", height: "100%" }}
                    >
                        <Typography sx={{ fontWeight: 600, mb: 2 }}>Sales This Week</Typography>

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
                                    contentStyle={{ borderRadius: 12, border: "1px solid #eee" }}
                                    formatter={(value) => [`$${value}`, "Sales"]}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="url(#salesLineGradient)"
                                    strokeWidth={3}
                                    dot={{ r: 4, fill: "#007fad", strokeWidth: 0 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </Grid>

                <Grid item size={{ xs: 12, md: 6 }}>
                    <Card
                        elevation={0}
                        sx={{ p: 3, borderRadius: "16px", border: "1px solid #eee", height: "100%" }}
                    >
                        <Typography sx={{ fontWeight: 600, mb: 2 }}>Top Selling Products</Typography>

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
                                    contentStyle={{ borderRadius: 12, border: "1px solid #eee" }}
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
                    </Card>
                </Grid>
            </Grid>

            {/* Low Stock Alert */}
            <Card elevation={0} sx={{ p: 3, borderRadius: "16px", border: "1px solid #eee" }}>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <WarningAmberIcon sx={{ color: "#b26a00", fontSize: 22 }} />
                    <Typography sx={{ fontWeight: 600 }}>Low Stock Alert</Typography>
                </Stack>

                {!loading && lowStockProducts.length === 0 && (
                    <Typography variant="body2" color="text.secondary">
                        All products are well stocked right now. 🎉
                    </Typography>
                )}

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
                                        border: "1px solid #eee",
                                    }}
                                >
                                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                        {product.name}
                                    </Typography>
                                    <Chip
                                        label={`${product.stock} left`}
                                        size="small"
                                        sx={{
                                            backgroundColor: severity.bg,
                                            color: severity.color,
                                            fontWeight: 600,
                                        }}
                                    />
                                </Box>
                            </Grid>
                        );
                    })}
                </Grid>
            </Card>
        </Box>
    );
}