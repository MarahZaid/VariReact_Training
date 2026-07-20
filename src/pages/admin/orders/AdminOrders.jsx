import { useMemo, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TextField,
  MenuItem,
  Grid,
  Stack,
  Button,
  Skeleton,
} from "@mui/material";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import useOrders from "../../../hooks/useOrders";


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

const inputSx = {
  "& .MuiOutlinedInput-root": { borderRadius: "8px", backgroundColor: "#fff" },
};

const STATUS_STYLES = {
  pending: { color: "#b26a00", bg: "#fff4e5" },
  processing: { color: "#0057a3", bg: "#e6f0fa" },
  shipped: { color: "#5e35b1", bg: "#f0eafa" },
  delivered: { color: "#2e7d32", bg: "#eaf6ea" },
  cancelled: { color: "#c62828", bg: "#fdecea" },
};

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled"];


const PAGE_SIZE = 10;

function StatusSelect({ status, onChange, disabled }) {
  const style = STATUS_STYLES[status] || { color: "#555", bg: "#eee" };
  return (
    <TextField
      select
      size="small"
      value={status || "pending"}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      sx={{
        minWidth: 130,
        "& .MuiOutlinedInput-root": {
          backgroundColor: style.bg,
          borderRadius: "20px",
        },
        "& .MuiOutlinedInput-notchedOutline": { border: "none" },
        "& .MuiSelect-select": {
          color: style.color,
          fontWeight: 700,
          py: 0.6,
        },
      }}
    >
      {STATUS_OPTIONS.map((option) => (
        <MenuItem key={option} value={option}>
          {option.charAt(0).toUpperCase() + option.slice(1)}
        </MenuItem>
      ))}
    </TextField>
  );
}

function formatDate(timestamp) {
  if (!timestamp) return "-";
  return new Date(timestamp).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminOrders() {
  const { orders, customers, loading, updateOrderStatus } = useOrders();

  const [statusFilter, setStatusFilter] = useState("all");
  const [customerFilter, setCustomerFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  async function handleStatusChange(orderId, newStatus) {
    setUpdatingOrderId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
    } finally {
      setUpdatingOrderId(null);
    }
  }

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (statusFilter !== "all" && order.status !== statusFilter) return false;
      if (customerFilter !== "all" && order.customerEmail !== customerFilter)
        return false;

      if (dateFrom) {
        const fromTs = new Date(dateFrom).setHours(0, 0, 0, 0);
        if ((order.createdAt || 0) < fromTs) return false;
      }

      if (dateTo) {
        const toTs = new Date(dateTo).setHours(23, 59, 59, 999);
        if ((order.createdAt || 0) > toTs) return false;
      }

      return true;
    });
  }, [orders, statusFilter, customerFilter, dateFrom, dateTo]);

  
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [statusFilter, customerFilter, dateFrom, dateTo]);

  const displayedOrders = filteredOrders.slice(0, visibleCount);
  const hasMore = visibleCount < filteredOrders.length;

  function handleLoadMore() {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  }

  function clearFilters() {
    setStatusFilter("all");
    setCustomerFilter("all");
    setDateFrom("");
    setDateTo("");
  }

  return (
    <Box sx={{ backgroundColor: BRAND.pageBg, minHeight: "100%", p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: BRAND.navy, letterSpacing: "-0.01em" }}>
          Orders
        </Typography>
        <Typography variant="body2" sx={{ color: BRAND.subtle, mt: 0.25 }}>
          Showing {Math.min(displayedOrders.length, filteredOrders.length)} of{" "}
          {filteredOrders.length} orders ({orders?.length || 0} total)
        </Typography>
      </Box>

      {/* Filters */}
      <Card
        elevation={0}
        sx={{
          p: 3,
          mb: 2.5,
          borderRadius: "18px",
          border: `1px solid ${BRAND.border}`,
          backgroundColor: BRAND.cardBg,
          boxShadow: BRAND.shadow,
        }}
      >
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography
              variant="caption"
              sx={{ display: "block", color: BRAND.subtle, mb: 0.5, fontWeight: 600 }}
            >
              Status
            </Typography>
            <TextField
              select
              fullWidth
              size="small"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={inputSx}
            >
              <MenuItem value="all">All statuses</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="processing">Processing</MenuItem>
              <MenuItem value="shipped">Shipped</MenuItem>
              <MenuItem value="delivered">Delivered</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </TextField>
          </Grid>

          <Grid item size={{ xs: 12, sm: 6, md: 3 }}>
            <Typography
              variant="caption"
              sx={{ display: "block", color: BRAND.subtle, mb: 0.5, fontWeight: 600 }}
            >
              Customer
            </Typography>
            <TextField
              select
              fullWidth
              size="small"
              value={customerFilter}
              onChange={(e) => setCustomerFilter(e.target.value)}
              sx={inputSx}
            >
              <MenuItem value="all">All customers</MenuItem>
              {customers.map((customer) => (
                <MenuItem key={customer.email} value={customer.email}>
                  {customer.name} ({customer.email})
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography
              variant="caption"
              sx={{ display: "block", color: BRAND.subtle, mb: 0.5, fontWeight: 600 }}
            >
              From
            </Typography>
            <TextField
              type="date"
              fullWidth
              size="small"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              sx={inputSx}
            />
          </Grid>

          <Grid item size={{ xs: 6, sm: 3, md: 2 }}>
            <Typography
              variant="caption"
              sx={{ display: "block", color: BRAND.subtle, mb: 0.5, fontWeight: 600 }}
            >
              To
            </Typography>
            <TextField
              type="date"
              fullWidth
              size="small"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              sx={inputSx}
            />
          </Grid>

          <Grid item size={{ xs: 12, md: 2 }}>
            <Typography
              variant="caption"
              sx={{ display: "block", visibility: "hidden", mb: 0.5, fontWeight: 600 }}
            >
              &nbsp;
            </Typography>
            <Button
              fullWidth
              onClick={clearFilters}
              variant="outlined"
              sx={{
                color: BRAND.navy,
                borderColor: BRAND.border,
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 600,
                py: 1,
                "&:hover": { borderColor: BRAND.navy, backgroundColor: "rgba(0,51,73,0.04)" },
              }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Card>

      {/* Table */}
      <Card
        elevation={0}
        sx={{
          borderRadius: "18px",
          border: `1px solid ${BRAND.border}`,
          backgroundColor: BRAND.cardBg,
          boxShadow: BRAND.shadow,
          overflow: "hidden",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {["Order", "Customer", "Items", "Total", "Status", "Date"].map(
                  (col, i) => (
                    <TableCell
                      key={col}
                      align={i === 3 ? "right" : i === 4 ? "center" : "left"}
                      sx={{
                        fontWeight: 700,
                        fontSize: "0.8rem",
                        letterSpacing: "0.02em",
                        color: BRAND.subtle,
                        backgroundColor: BRAND.pageBg,
                        borderBottom: `1px solid ${BRAND.border}`,
                      }}
                    >
                      {col}
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading &&
                [1, 2, 3, 4].map((i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton variant="text" width={70} height={22} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width="60%" height={22} />
                      <Skeleton variant="text" width="80%" height={16} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width="70%" height={18} />
                      <Skeleton variant="text" width="50%" height={18} />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton variant="text" width={50} height={22} sx={{ ml: "auto" }} />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton variant="rounded" width={110} height={30} sx={{ borderRadius: "20px", mx: "auto" }} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width="70%" height={18} />
                    </TableCell>
                  </TableRow>
                ))}

              {!loading && displayedOrders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6, border: "none" }}>
                    <Stack alignItems="center" spacing={1}>
                      <ReceiptLongOutlinedIcon sx={{ fontSize: 32, color: BRAND.border }} />
                      <Typography variant="body2" sx={{ color: BRAND.subtle }}>
                        No orders match these filters.
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                displayedOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    hover
                    sx={{
                      "&:last-child td": { borderBottom: "none" },
                      "& td": { borderBottom: `1px solid ${BRAND.border}` },
                    }}
                  >
                    <TableCell>
                      <Typography sx={{ fontWeight: 600, color: BRAND.ink }}>
                        {order.id}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: BRAND.ink }}>
                        {order.customerName}
                      </Typography>
                      <Typography variant="caption" sx={{ color: BRAND.subtle }}>
                        {order.customerEmail}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Stack spacing={0.25}>
                        {(order.items || []).map((item, index) => (
                          <Typography variant="body2" key={index} sx={{ color: BRAND.ink }}>
                            {item.quantity}x {item.productName}
                          </Typography>
                        ))}
                      </Stack>
                    </TableCell>

                    <TableCell align="right">
                      <Typography sx={{ fontWeight: 600, color: BRAND.ink }}>
                        ${order.totalAmount}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <StatusSelect
                        status={order.status}
                        disabled={updatingOrderId === order.id}
                        onChange={(newStatus) =>
                          handleStatusChange(order.id, newStatus)
                        }
                      />
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ color: BRAND.subtle }}>
                        {formatDate(order.createdAt)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      
      {!loading && hasMore && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 2.5 }}>
          <Button
            variant="outlined"
            onClick={handleLoadMore}
            sx={{
              borderColor: BRAND.border,
              color: BRAND.navy,
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              px: 3,
              py: 1,
              "&:hover": {
                borderColor: BRAND.teal,
                backgroundColor: "rgba(0,127,173,0.06)",
              },
            }}
          >
            Load More ({filteredOrders.length - visibleCount} remaining)
          </Button>
        </Box>
      )}
    </Box>
  );
}