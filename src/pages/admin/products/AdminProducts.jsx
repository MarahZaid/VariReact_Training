import { useState, useMemo, useEffect } from "react";
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
  Button,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  Stack,
  Skeleton,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import useProducts from "../../../hooks/UseProducts";


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
  "& .MuiOutlinedInput-root": {
    borderRadius: "8px",
    backgroundColor: "#fff",
  },
};

function getStockSeverity(stock) {
  if (stock <= 10) return { label: "Critical", color: "#c62828", bg: "#fdecea" };
  if (stock <= 20) return { label: "Low", color: "#b26a00", bg: "#fff4e5" };
  return { label: "OK", color: "#2e7d32", bg: "#eaf6ea" };
}


const PAGE_SIZE = 10;

const SORT_OPTIONS = [
  { value: "name-asc", label: "Name (A → Z)" },
  { value: "name-desc", label: "Name (Z → A)" },
  { value: "price-asc", label: "Price (Low → High)" },
  { value: "price-desc", label: "Price (High → Low)" },
];

export default function AdminProducts() {
  const { products, loading, deleteProduct } = useProducts();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  function handleView(product) {
    navigate(`/admin/products/${product.id}`);
  }

  function handleAdd() {
    navigate("/admin/products/new");
  }

  async function handleDelete(product) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"? This action cannot be undone.`
    );
    if (!confirmed) return;
    await deleteProduct(product.id);
  }

  const visibleProducts = useMemo(() => {
    const term = search.trim().toLowerCase();

    let list = products;
    if (term) {
      list = list.filter((product) =>
        (product.name || "").toLowerCase().includes(term)
      );
    }

    const sorted = [...list];
    sorted.sort((a, b) => {
      switch (sortBy) {
        case "name-desc":
          return (b.name || "").localeCompare(a.name || "");
        case "price-asc":
          return (Number(a.price) || 0) - (Number(b.price) || 0);
        case "price-desc":
          return (Number(b.price) || 0) - (Number(a.price) || 0);
        case "name-asc":
        default:
          return (a.name || "").localeCompare(b.name || "");
      }
    });

    return sorted;
  }, [products, search, sortBy]);

 
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search, sortBy]);

  const displayedProducts = visibleProducts.slice(0, visibleCount);
  const hasMore = visibleCount < visibleProducts.length;

  function handleLoadMore() {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  }

  return (
    <Box sx={{ backgroundColor: BRAND.pageBg, minHeight: "100%", p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: BRAND.navy, letterSpacing: "-0.01em" }}>
            Products
          </Typography>
          <Typography variant="body2" sx={{ color: BRAND.subtle, mt: 0.25 }}>
            Showing {Math.min(displayedProducts.length, visibleProducts.length)} of{" "}
            {visibleProducts.length} products
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{
            backgroundColor: BRAND.navy,
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 600,
            px: 2.5,
            py: 1,
            boxShadow: "none",
            "&:hover": { backgroundColor: "#00263a", boxShadow: "none" },
          }}
        >
          Add Product
        </Button>
      </Box>

      {/* Filters */}
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2.5 }}>
        <TextField
          size="small"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ flex: 1, minWidth: 220, ...inputSx }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: BRAND.subtle }} />
              </InputAdornment>
            ),
          }}
        />

        <FormControl size="small" sx={{ minWidth: 200, ...inputSx }}>
          <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} displayEmpty>
            {SORT_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

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
                {["Image", "Name", "Category", "Price", "Stock", "Rating", "Actions"].map(
                  (col, i) => (
                    <TableCell
                      key={col}
                      align={i >= 3 ? (i === 4 || i === 5 ? "center" : "right") : "left"}
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
                      <Skeleton variant="rounded" width={48} height={48} sx={{ borderRadius: "10px" }} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width="60%" height={22} />
                      <Skeleton variant="text" width="35%" height={16} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width="50%" height={20} />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton variant="text" width={50} height={22} sx={{ ml: "auto" }} />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton variant="rounded" width={32} height={24} sx={{ borderRadius: "8px", mx: "auto" }} />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton variant="text" width={40} height={20} sx={{ mx: "auto" }} />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" justifyContent="flex-end" spacing={1}>
                        <Skeleton variant="circular" width={32} height={32} />
                        <Skeleton variant="circular" width={32} height={32} />
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}

              {!loading && displayedProducts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6, border: "none" }}>
                    <Stack alignItems="center" spacing={1}>
                      <Inventory2OutlinedIcon sx={{ fontSize: 32, color: BRAND.border }} />
                      <Typography variant="body2" sx={{ color: BRAND.subtle }}>
                        No products found.
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                displayedProducts.map((product) => {
                  const severity = getStockSeverity(product.stock ?? 0);
                  const image =
                    product.colors?.[0]?.images?.[0] ||
                    product.colors?.[0]?.colorImg ||
                    "";

                  return (
                    <TableRow
                      key={product.id}
                      hover
                      sx={{
                        "&:last-child td": { borderBottom: "none" },
                        "& td": { borderBottom: `1px solid ${BRAND.border}` },
                      }}
                    >
                      <TableCell>
                        <Avatar
                          src={image}
                          variant="rounded"
                          alt={product.name}
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: "10px",
                            border: `1px solid ${BRAND.border}`,
                            backgroundColor: BRAND.pageBg,
                          }}
                        />
                      </TableCell>

                      <TableCell>
                        <Typography sx={{ fontWeight: 600, color: BRAND.ink }}>
                          {product.name}
                        </Typography>
                        <Typography variant="caption" sx={{ color: BRAND.subtle }}>
                          {product.slug}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2" sx={{ color: BRAND.subtle }}>
                          {product.categoryName}
                        </Typography>
                      </TableCell>

                      <TableCell align="right">
                        <Typography sx={{ fontWeight: 600, color: BRAND.ink }}>
                          ${product.price}
                        </Typography>
                        {product.oldPrice && (
                          <Typography
                            variant="caption"
                            sx={{ color: BRAND.subtle, textDecoration: "line-through" }}
                          >
                            ${product.oldPrice}
                          </Typography>
                        )}
                      </TableCell>

                      <TableCell align="center">
                        <Chip
                          label={product.stock}
                          size="small"
                          sx={{
                            backgroundColor: severity.bg,
                            color: severity.color,
                            fontWeight: 700,
                            borderRadius: "8px",
                          }}
                        />
                      </TableCell>

                      <TableCell align="center">
                        <Typography variant="body2" sx={{ color: BRAND.ink }}>
                          {product.rating ? `${product.rating} ⭐` : "-"}
                        </Typography>
                      </TableCell>

                      <TableCell align="right">
                        <Tooltip title="View">
                          <IconButton
                            onClick={() => handleView(product)}
                            sx={{ color: BRAND.teal, "&:hover": { backgroundColor: "rgba(0,127,173,0.08)" } }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete">
                          <IconButton
                            onClick={() => handleDelete(product)}
                            sx={{ color: "#c62828", "&:hover": { backgroundColor: "#fdecea" } }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
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
            Load More ({visibleProducts.length - visibleCount} remaining)
          </Button>
        </Box>
      )}
    </Box>
  );
}