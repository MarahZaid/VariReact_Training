import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  IconButton,
  Avatar,
  Chip,
  Tooltip,
  Stack,
  Skeleton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import useCategories from "../../../hooks/useAdminCategories";
import CategoryFormDialog from "./CategoryFormDialog";


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

export default function AdminCategories() {
  const { categories, loading, addCategory, updateCategory, deleteCategory } =
    useCategories();
  const navigate = useNavigate();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  function handleAddClick() {
    setEditingCategory(null);
    setDialogOpen(true);
  }

  function handleEditClick(category) {
    setEditingCategory(category);
    setDialogOpen(true);
  }

  async function handleSubmit(formData) {
    if (editingCategory) {
      await updateCategory(editingCategory.id, formData);
    } else {
      await addCategory(formData);
    }
  }

  async function handleDelete(category) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"? This action cannot be undone.`
    );
    if (!confirmed) return;
    await deleteCategory(category.id);
  }

  function handleViewProducts(category) {
    navigate(`/admin/categories/${category.id}/products`);
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
            Categories
          </Typography>
          <Typography variant="body2" sx={{ color: BRAND.subtle, mt: 0.25 }}>
            {categories?.length || 0} categories in your catalog
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
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
          Add Category
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
                {["Image", "Name", "Products", "Discount", "Actions"].map((col, i) => (
                  <TableCell
                    key={col}
                    align={i === 2 || i === 3 ? "center" : i === 4 ? "right" : "left"}
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
                      <Skeleton variant="rounded" width={60} height={60} sx={{ borderRadius: "10px" }} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width="60%" height={24} />
                      <Skeleton variant="text" width="40%" height={18} />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton variant="rounded" width={32} height={24} sx={{ borderRadius: "8px", mx: "auto" }} />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton variant="rounded" width={48} height={24} sx={{ borderRadius: "8px", mx: "auto" }} />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" justifyContent="flex-end" spacing={1}>
                        <Skeleton variant="circular" width={32} height={32} />
                        <Skeleton variant="circular" width={32} height={32} />
                        <Skeleton variant="circular" width={32} height={32} />
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}

              {!loading && categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6, border: "none" }}>
                    <Stack alignItems="center" spacing={1}>
                      <CategoryOutlinedIcon sx={{ fontSize: 32, color: BRAND.border }} />
                      <Typography variant="body2" sx={{ color: BRAND.subtle }}>
                        No categories yet. Add one using the button above.
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              )}

              {!loading &&
                categories.map((category) => (
                  <TableRow
                    key={category.id}
                    hover
                    sx={{
                      "&:last-child td": { borderBottom: "none" },
                      "& td": { borderBottom: `1px solid ${BRAND.border}` },
                    }}
                  >
                    <TableCell>
                      <Avatar
                        src={category.mainImage}
                        variant="rounded"
                        alt={category.name}
                        sx={{
                          width: 60,
                          height: 60,
                          borderRadius: "10px",
                          border: `1px solid ${BRAND.border}`,
                          backgroundColor: BRAND.pageBg,
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Typography sx={{ fontWeight: 600, color: BRAND.ink }}>
                        {category.name}
                      </Typography>
                      {category.shortDescription && (
                        <Typography variant="caption" sx={{ color: BRAND.subtle }}>
                          {category.shortDescription}
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell align="center">
                      <Chip
                        label={category.productsCount}
                        size="small"
                        sx={{
                          backgroundColor: "rgba(0,127,173,0.1)",
                          color: BRAND.navy,
                          fontWeight: 700,
                          borderRadius: "8px",
                        }}
                      />
                    </TableCell>

                    <TableCell align="center">
                      {category.discountPercentage > 0 ? (
                        <Chip
                          label={`${category.discountPercentage}% OFF`}
                          size="small"
                          sx={{
                            backgroundColor: "#fdecea",
                            color: "#c62828",
                            fontWeight: 700,
                            borderRadius: "8px",
                          }}
                        />
                      ) : (
                        <Typography variant="body2" sx={{ color: BRAND.subtle }}>
                          —
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell align="right">
                      <Tooltip title="View products">
                        <IconButton
                          onClick={() => handleViewProducts(category)}
                          sx={{ color: BRAND.teal, "&:hover": { backgroundColor: "rgba(0,127,173,0.08)" } }}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => handleEditClick(category)}
                          sx={{ color: BRAND.navy, "&:hover": { backgroundColor: "rgba(0,51,73,0.06)" } }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => handleDelete(category)}
                          sx={{ color: "#c62828", "&:hover": { backgroundColor: "#fdecea" } }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <CategoryFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingCategory}
      />
    </Box>
  );
}