import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Avatar,
  Chip,
  Stack,
  Skeleton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import useCategoryProducts from "../../../hooks/useCategoryProducts";


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

function getStockSeverity(stock) {
  if (stock <= 10) return { label: "Critical", color: "#c62828", bg: "#fdecea" };
  if (stock <= 20) return { label: "Low", color: "#b26a00", bg: "#fff4e5" };
  return { label: "OK", color: "#2e7d32", bg: "#eaf6ea" };
}

export default function AdminCategoryProducts() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { category, products, loading } = useCategoryProducts(categoryId);

  return (
    <Box sx={{ backgroundColor: BRAND.pageBg, minHeight: "100%", p: { xs: 2, md: 3 } }}>
      {/* Breadcrumb */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={0.75}
        sx={{ mb: 2, color: BRAND.subtle, cursor: "pointer", width: "fit-content" }}
        onClick={() => navigate("/admin/categories")}
      >
        <ArrowBackIcon sx={{ fontSize: 18 }} />
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Categories
        </Typography>
      </Stack>

      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          {loading ? (
            <>
              <Skeleton variant="text" width={220} height={44} />
              <Skeleton variant="text" width={160} height={20} sx={{ mt: 0.5 }} />
            </>
          ) : (
            <>
              <Typography variant="h4" sx={{ fontWeight: 800, color: BRAND.navy, letterSpacing: "-0.01em" }}>
                {category?.name || "Category not found"}
              </Typography>
              {category?.shortDescription ? (
                <Typography variant="body2" sx={{ color: BRAND.subtle, mt: 0.5 }}>
                  {category.shortDescription}
                </Typography>
              ) : (
                <Typography variant="body2" sx={{ color: BRAND.subtle, mt: 0.5 }}>
                  {products?.length || 0} products in this category
                </Typography>
              )}
            </>
          )}
        </Box>

        <Button
          variant="outlined"
          onClick={() => navigate("/admin/categories")}
          sx={{
            borderColor: BRAND.border,
            color: BRAND.navy,
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 600,
            px: 2.5,
            "&:hover": { borderColor: BRAND.navy, backgroundColor: "rgba(0,51,73,0.04)" },
          }}
        >
          Back to Categories
        </Button>
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
                {["Image", "Name", "Price", "Stock", "Rating"].map((col, i) => (
                  <TableCell
                    key={col}
                    align={i === 2 ? "right" : i === 3 || i === 4 ? "center" : "left"}
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
                ))}
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
                      <Skeleton variant="text" width="60%" height={24} />
                      <Skeleton variant="text" width="35%" height={18} />
                    </TableCell>
                    <TableCell align="right">
                      <Skeleton variant="text" width={50} height={24} sx={{ ml: "auto" }} />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton variant="rounded" width={32} height={24} sx={{ borderRadius: "8px", mx: "auto" }} />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton variant="text" width={40} height={20} sx={{ mx: "auto" }} />
                    </TableCell>
                  </TableRow>
                ))}

              {!loading && products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6, border: "none" }}>
                    <Stack alignItems="center" spacing={1}>
                      <Inventory2OutlinedIcon sx={{ fontSize: 32, color: BRAND.border }} />
                      <Typography variant="body2" sx={{ color: BRAND.subtle }}>
                        No products in this category.
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                products.map((product) => {
                  const severity = getStockSeverity(product.stock ?? 0);
                  const image =
                    product.colors?.[0]?.mainImage ||
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
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>
    </Box>
  );
}