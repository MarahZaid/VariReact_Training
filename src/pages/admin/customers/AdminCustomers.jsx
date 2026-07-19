import { useNavigate } from "react-router-dom";
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
  IconButton,
  Avatar,
  Chip,
  Tooltip,
  Stack,
  Skeleton,
} from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import EmailIcon from "@mui/icons-material/Email";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import useCustomers from "../../../hooks/useCustomers";

// Vari brand tokens — kept in sync with AddProduct, AdminProducts,
// AdminProductDetails, AdminCategories, AdminCategoryProducts & AdminOrders
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

function formatDate(timestamp) {
  if (!timestamp) return "-";
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function initials(name) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function AdminCustomers() {
  const { customers, loading } = useCustomers();
  const navigate = useNavigate();

  function handleViewOrders(customer) {
    navigate(`/admin/orders?customer=${encodeURIComponent(customer.email)}`);
  }

  function handleEmail(customer) {
    window.location.href = `mailto:${customer.email}`;
  }

  return (
    <Box sx={{ backgroundColor: BRAND.pageBg, minHeight: "100%", p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: BRAND.navy, letterSpacing: "-0.01em" }}>
          Customers
        </Typography>
        <Typography variant="body2" sx={{ color: BRAND.subtle, mt: 0.25 }}>
          {customers?.length || 0} customers total
        </Typography>
      </Box>

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
                {["Customer", "Phone", "Orders", "Total Spent", "Last Order", "Actions"].map(
                  (col, i) => (
                    <TableCell
                      key={col}
                      align={i === 2 ? "center" : i === 3 || i === 5 ? "right" : "left"}
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
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Skeleton variant="circular" width={40} height={40} />
                        <Box sx={{ flex: 1 }}>
                          <Skeleton variant="text" width="70%" height={22} />
                          <Skeleton variant="text" width="90%" height={16} />
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width="60%" height={20} />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton variant="rounded" width={32} height={24} sx={{ borderRadius: "8px", mx: "auto" }} />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton variant="text" width={60} height={22} sx={{ ml: "auto" }} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width="70%" height={20} />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" justifyContent="flex-end" spacing={1}>
                        <Skeleton variant="circular" width={32} height={32} />
                        <Skeleton variant="circular" width={32} height={32} />
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}

              {!loading && customers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6, border: "none" }}>
                    <Stack alignItems="center" spacing={1}>
                      <PeopleAltOutlinedIcon sx={{ fontSize: 32, color: BRAND.border }} />
                      <Typography variant="body2" sx={{ color: BRAND.subtle }}>
                        No customers yet.
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                customers.map((customer) => (
                  <TableRow
                    key={customer.email}
                    hover
                    sx={{
                      "&:last-child td": { borderBottom: "none" },
                      "& td": { borderBottom: `1px solid ${BRAND.border}` },
                    }}
                  >
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar
                          sx={{
                            backgroundColor: "rgba(0,127,173,0.1)",
                            color: BRAND.navy,
                            fontWeight: 700,
                          }}
                        >
                          {initials(customer.name)}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 600, color: BRAND.ink }}>
                            {customer.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: BRAND.subtle }}>
                            {customer.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ color: BRAND.subtle }}>
                        {customer.phone || "-"}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Chip
                        label={customer.ordersCount}
                        size="small"
                        sx={{
                          backgroundColor: "rgba(0,127,173,0.1)",
                          color: BRAND.navy,
                          fontWeight: 700,
                          borderRadius: "8px",
                        }}
                      />
                    </TableCell>

                    <TableCell align="right">
                      <Typography sx={{ fontWeight: 600, color: BRAND.ink }}>
                        ${customer.totalSpent.toFixed(2)}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ color: BRAND.subtle }}>
                        {formatDate(customer.lastOrderAt)}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      <Tooltip title="View Orders">
                        <IconButton
                          onClick={() => handleViewOrders(customer)}
                          sx={{ color: BRAND.navy, "&:hover": { backgroundColor: "rgba(0,51,73,0.06)" } }}
                        >
                          <ListAltIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Send Email">
                        <IconButton
                          onClick={() => handleEmail(customer)}
                          sx={{ color: BRAND.teal, "&:hover": { backgroundColor: "rgba(0,127,173,0.08)" } }}
                        >
                          <EmailIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}