import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  Grid,
  Chip,
  Stack,
  Button,
  TextField,
  MenuItem,
  Divider,
  LinearProgress,
  IconButton,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import FormatQuoteRoundedIcon from "@mui/icons-material/FormatQuoteRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";
import useProductDetails from "../../../hooks/useProductDetails";
import useCategories from "../../../hooks/useCategories";


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

const EDITABLE_FIELDS = [
  "name",
  "categoryId",
  "price",
  "oldPrice",
  "stock",
  "discountLabel",
  "shortDescription",
];

const DETAILS_TEXT_FIELDS = [
  { key: "certificationsText", label: "Certifications", icon: VerifiedOutlinedIcon },
  { key: "warrantyText", label: "Warranty", icon: Inventory2OutlinedIcon },
  { key: "shipping", label: "Shipping", icon: LocalShippingOutlinedIcon },
  { key: "extrasInBox", label: "In the Box", icon: null },
  { key: "quote", label: "Quote", icon: null },
  { key: "quoteSource", label: "Quote Source", icon: null },
];

// Shared card shell so every section reads as one visual family
function SectionCard({ children, sx, ...props }) {
  return (
    <Card
      elevation={0}
      sx={{
        p: 3,
        borderRadius: "18px",
        border: `1px solid ${BRAND.border}`,
        backgroundColor: BRAND.cardBg,
        boxShadow: BRAND.shadow,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Card>
  );
}

function SectionTitle({ children }) {
  return (
    <Typography
      sx={{
        fontWeight: 700,
        fontSize: "0.95rem",
        letterSpacing: "0.01em",
        color: BRAND.navy,
        mb: 2.5,
        pb: 1.5,
        borderBottom: `1px solid ${BRAND.border}`,
      }}
    >
      {children}
    </Typography>
  );
}

function Field({ label, children }) {
  return (
    <Box>
      <Typography
        variant="overline"
        sx={{
          lineHeight: 1.6,
          display: "block",
          color: BRAND.subtle,
          fontWeight: 600,
          letterSpacing: "0.06em",
          fontSize: "0.7rem",
        }}
      >
        {label}
      </Typography>
      {children}
    </Box>
  );
}

function specsObjectToRows(specs) {
  if (!specs) return [];
  return Object.entries(specs).map(([key, value]) => ({
    key,
    value: Array.isArray(value) ? value.join(", ") : String(value ?? ""),
  }));
}

function specsRowsToObject(rows) {
  const obj = {};
  rows.forEach(({ key, value }) => {
    if (!key.trim()) return;
    if (value.includes(",")) {
      obj[key.trim()] = value
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
    } else if (value.trim() !== "" && !isNaN(value)) {
      obj[key.trim()] = Number(value);
    } else {
      obj[key.trim()] = value.trim();
    }
  });
  return obj;
}

export default function AdminProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { product, loading, updateProduct } = useProductDetails(productId);
  const { categories } = useCategories();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({});
  const [colorsForm, setColorsForm] = useState([]);
  const [detailsForm, setDetailsForm] = useState({});
  const [specsRows, setSpecsRows] = useState([]);
  const [newImageUrls, setNewImageUrls] = useState({});

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (product) {
      const initial = {};
      EDITABLE_FIELDS.forEach((field) => {
        initial[field] = product[field] ?? "";
      });
      setForm(initial);
      setColorsForm(JSON.parse(JSON.stringify(product.colors || [])));
      setDetailsForm({ ...product.details, bullets: [...(product.details?.bullets || [])] });
      setSpecsRows(specsObjectToRows(product.specs));
      setSelectedColorIndex(0);
      setSelectedImageIndex(0);
    }
  }, [product]);

  const colors = editing ? colorsForm : product?.colors || [];
  const currentColor = colors[selectedColorIndex];
  const currentImages = currentColor?.images?.length
    ? currentColor.images
    : currentColor?.colorImg
    ? [currentColor.colorImg]
    : [];

  function selectColor(index) {
    setSelectedColorIndex(index);
    setSelectedImageIndex(0);
  }

  function handleChange(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function handleDetailsFieldChange(field) {
    return (e) =>
      setDetailsForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function handleBulletChange(index, value) {
    setDetailsForm((prev) => {
      const bullets = [...prev.bullets];
      bullets[index] = value;
      return { ...prev, bullets };
    });
  }

  function addBullet() {
    setDetailsForm((prev) => ({ ...prev, bullets: [...prev.bullets, ""] }));
  }

  function removeBullet(index) {
    setDetailsForm((prev) => ({
      ...prev,
      bullets: prev.bullets.filter((_, i) => i !== index),
    }));
  }

  function handleSpecChange(index, field, value) {
    setSpecsRows((prev) => {
      const rows = [...prev];
      rows[index] = { ...rows[index], [field]: value };
      return rows;
    });
  }

  function addSpecRow() {
    setSpecsRows((prev) => [...prev, { key: "", value: "" }]);
  }

  function removeSpecRow(index) {
    setSpecsRows((prev) => prev.filter((_, i) => i !== index));
  }

  function addImageToColor(colorIndex) {
    const url = (newImageUrls[colorIndex] || "").trim();
    if (!url) return;
    setColorsForm((prev) => {
      const next = [...prev];
      const images = next[colorIndex].images ? [...next[colorIndex].images] : [];
      images.push(url);
      next[colorIndex] = { ...next[colorIndex], images };
      return next;
    });
    setNewImageUrls((prev) => ({ ...prev, [colorIndex]: "" }));
  }

  function removeImageFromColor(colorIndex, imageIndex) {
    setColorsForm((prev) => {
      const next = [...prev];
      const images = next[colorIndex].images.filter((_, i) => i !== imageIndex);
      next[colorIndex] = { ...next[colorIndex], images };
      return next;
    });
    setSelectedImageIndex(0);
  }

  function handleCancel() {
    const initial = {};
    EDITABLE_FIELDS.forEach((field) => {
      initial[field] = product[field] ?? "";
    });
    setForm(initial);
    setColorsForm(JSON.parse(JSON.stringify(product.colors || [])));
    setDetailsForm({ ...product.details, bullets: [...(product.details?.bullets || [])] });
    setSpecsRows(specsObjectToRows(product.specs));
    setSelectedColorIndex(0);
    setSelectedImageIndex(0);
    setEditing(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      await updateProduct({
        ...form,
        price: Number(form.price) || 0,
        oldPrice: form.oldPrice === "" ? null : Number(form.oldPrice),
        stock: Number(form.stock) || 0,
        colors: colorsForm,
        details: {
          ...detailsForm,
          bullets: detailsForm.bullets.filter((b) => b.trim() !== ""),
        },
        specs: specsRowsToObject(specsRows),
      });
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <Box sx={{ p: 4 }}>
        <LinearProgress
          sx={{
            borderRadius: 4,
            height: 4,
            backgroundColor: BRAND.border,
            "& .MuiLinearProgress-bar": { backgroundColor: BRAND.teal },
          }}
        />
        <Typography sx={{ mt: 2, color: BRAND.subtle }}>Loading product…</Typography>
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: BRAND.navy }}>
          Product not found
        </Typography>
        <Button
          onClick={() => navigate("/admin/products")}
          sx={{ color: BRAND.navy, fontWeight: 600 }}
        >
          Back to Products
        </Button>
      </Box>
    );
  }

  const severity = getStockSeverity(product.stock ?? 0);
  const reviewBars = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: product[`review${star}stars`] || 0,
  }));
  const maxReviewCount = Math.max(...reviewBars.map((r) => r.count), 1);

  return (
    <Box sx={{ backgroundColor: BRAND.pageBg, minHeight: "100%", p: { xs: 2, md: 3 } }}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={0.75}
        sx={{ mb: 2, color: BRAND.subtle, cursor: "pointer", width: "fit-content" }}
        onClick={() => navigate("/admin/products")}
      >
        <ArrowBackIcon sx={{ fontSize: 18 }} />
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Products
        </Typography>
      </Stack>

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
          <Typography variant="h4" sx={{ fontWeight: 800, color: BRAND.navy, letterSpacing: "-0.01em" }}>
            {product.name}
          </Typography>
          <Typography variant="body2" sx={{ color: BRAND.subtle, mt: 0.5 }}>
            Product ID: {productId}
          </Typography>
        </Box>

        {!editing ? (
          <Button
            variant="contained"
            startIcon={<EditIcon sx={{ fontSize: 18 }} />}
            onClick={() => setEditing(true)}
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
            Edit product
          </Button>
        ) : (
          <Stack direction="row" spacing={1}>
            <Button
              onClick={handleCancel}
              disabled={saving}
              sx={{ textTransform: "none", fontWeight: 600, color: BRAND.subtle, borderRadius: "10px" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSave}
              disabled={saving}
              sx={{
                backgroundColor: BRAND.teal,
                borderRadius: "10px",
                textTransform: "none",
                fontWeight: 600,
                px: 2.5,
                boxShadow: "none",
                "&:hover": { backgroundColor: "#00658a", boxShadow: "none" },
              }}
            >
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </Stack>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Images */}
        <Grid item size={{ xs: 12, md: 5 }}>
          <SectionCard sx={{ position: { md: "sticky" }, top: { md: 24 } }}>
            <Box
              sx={{
                position: "relative",
                borderRadius: "14px",
                overflow: "hidden",
                backgroundColor: BRAND.pageBg,
                mb: 2,
              }}
            >
              <Box
                component="img"
                src={currentImages[selectedImageIndex] || currentColor?.colorImg}
                alt={currentColor?.name}
                sx={{
                  width: "100%",
                  height: 300,
                  objectFit: "contain",
                  display: "block",
                }}
              />
              {product.discountLabel && (
                <Chip
                  label={product.discountLabel}
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    backgroundColor: "#c62828",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "0.7rem",
                  }}
                />
              )}
            </Box>

            {/* Thumbnails */}
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
              {currentImages.map((img, index) => (
                <Box key={index} sx={{ position: "relative" }}>
                  <Box
                    component="img"
                    src={img}
                    onClick={() => setSelectedImageIndex(index)}
                    sx={{
                      width: 56,
                      height: 56,
                      objectFit: "cover",
                      borderRadius: "10px",
                      cursor: "pointer",
                      transition: "border-color 0.15s ease, transform 0.15s ease",
                      border:
                        index === selectedImageIndex
                          ? `2px solid ${BRAND.teal}`
                          : `1px solid ${BRAND.border}`,
                      "&:hover": { transform: "translateY(-2px)" },
                    }}
                  />
                  {editing && (
                    <IconButton
                      size="small"
                      onClick={() => removeImageFromColor(selectedColorIndex, index)}
                      sx={{
                        position: "absolute",
                        top: -8,
                        right: -8,
                        backgroundColor: "#c62828",
                        color: "#fff",
                        width: 20,
                        height: 20,
                        boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
                        "&:hover": { backgroundColor: "#b71c1c" },
                      }}
                    >
                      <CloseIcon sx={{ fontSize: 14 }} />
                    </IconButton>
                  )}
                </Box>
              ))}

              {currentImages.length === 0 && (
                <Typography variant="caption" sx={{ color: BRAND.subtle }}>
                  No images for this color yet.
                </Typography>
              )}
            </Stack>

            {editing && (
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <TextField
                  size="small"
                  placeholder="Image URL"
                  fullWidth
                  value={newImageUrls[selectedColorIndex] || ""}
                  onChange={(e) =>
                    setNewImageUrls((prev) => ({
                      ...prev,
                      [selectedColorIndex]: e.target.value,
                    }))
                  }
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
                />
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => addImageToColor(selectedColorIndex)}
                  sx={{
                    whiteSpace: "nowrap",
                    borderColor: BRAND.navy,
                    color: BRAND.navy,
                    borderRadius: "10px",
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  Add
                </Button>
              </Stack>
            )}

            <Divider sx={{ mb: 2, borderColor: BRAND.border }} />

            {/* Color switcher */}
            {colors.length > 0 && (
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {colors.map((color, index) => (
                  <Chip
                    key={color.name + index}
                    label={color.name}
                    onClick={() => selectColor(index)}
                    variant={index === selectedColorIndex ? "filled" : "outlined"}
                    sx={{
                      fontWeight: 600,
                      borderColor: BRAND.border,
                      backgroundColor:
                        index === selectedColorIndex ? BRAND.navy : "transparent",
                      color: index === selectedColorIndex ? "#fff" : BRAND.ink,
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  />
                ))}
              </Stack>
            )}

            {product.hasVideo && product.video && (
              <Typography variant="caption" sx={{ display: "block", mt: 2, color: BRAND.teal, fontWeight: 600 }}>
                <a
                  href={product.video}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  ▶ Watch product video
                </a>
              </Typography>
            )}
          </SectionCard>
        </Grid>

        {/* Main info */}
        <Grid item size={{ xs: 12, md: 7 }}>
          <SectionCard sx={{ mb: 3 }}>
            <SectionTitle>Basic Information</SectionTitle>

            <Grid container spacing={3}>
              <Grid item size={{ xs: 12, sm: 6 }}>
                <Field label="Name">
                  {editing ? (
                    <TextField
                      fullWidth
                      size="small"
                      value={form.name}
                      onChange={handleChange("name")}
                      sx={{ mt: 0.5, "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                    />
                  ) : (
                    <Typography sx={{ fontWeight: 600, color: BRAND.ink }}>{product.name}</Typography>
                  )}
                </Field>
              </Grid>

              <Grid item size={{ xs: 12, sm: 6 }}>
                <Field label="Category">
                  {editing ? (
                    <TextField
                      select
                      fullWidth
                      size="small"
                      value={form.categoryId}
                      onChange={handleChange("categoryId")}
                      sx={{ mt: 0.5, "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                    >
                      {categories.map((category) => (
                        <MenuItem key={category.id} value={category.id}>
                          {category.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  ) : (
                    <Typography sx={{ fontWeight: 600, color: BRAND.ink }}>
                      {categories.find((c) => c.id === product.categoryId)?.name ||
                        product.categoryId}
                    </Typography>
                  )}
                </Field>
              </Grid>

              <Grid item size={{ xs: 12, sm: 4 }}>
                <Field label="Price">
                  {editing ? (
                    <TextField
                      type="number"
                      fullWidth
                      size="small"
                      value={form.price}
                      onChange={handleChange("price")}
                      sx={{ mt: 0.5, "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                    />
                  ) : (
                    <Typography sx={{ fontWeight: 700, color: BRAND.navy, fontSize: "1.1rem" }}>
                      ${product.price}
                    </Typography>
                  )}
                </Field>
              </Grid>

              <Grid item size={{ xs: 12, sm: 4 }}>
                <Field label="Old Price">
                  {editing ? (
                    <TextField
                      type="number"
                      fullWidth
                      size="small"
                      value={form.oldPrice}
                      onChange={handleChange("oldPrice")}
                      sx={{ mt: 0.5, "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                    />
                  ) : (
                    <Typography sx={{ fontWeight: 500, color: BRAND.subtle, textDecoration: product.oldPrice ? "line-through" : "none" }}>
                      {product.oldPrice ? `$${product.oldPrice}` : "-"}
                    </Typography>
                  )}
                </Field>
              </Grid>

              <Grid item size={{ xs: 12, sm: 4 }}>
                <Field label="Stock">
                  {editing ? (
                    <TextField
                      type="number"
                      fullWidth
                      size="small"
                      value={form.stock}
                      onChange={handleChange("stock")}
                      sx={{ mt: 0.5, "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                    />
                  ) : (
                    <Chip
                      label={`${product.stock} · ${severity.label}`}
                      size="small"
                      sx={{
                        mt: 0.5,
                        backgroundColor: severity.bg,
                        color: severity.color,
                        fontWeight: 700,
                        fontSize: "0.75rem",
                      }}
                    />
                  )}
                </Field>
              </Grid>

              <Grid item size={{ xs: 12, sm: 6 }}>
                <Field label="Discount Label">
                  {editing ? (
                    <TextField
                      fullWidth
                      size="small"
                      value={form.discountLabel}
                      onChange={handleChange("discountLabel")}
                      sx={{ mt: 0.5, "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                    />
                  ) : product.discountLabel ? (
                    <Chip
                      label={product.discountLabel}
                      size="small"
                      sx={{ mt: 0.5, backgroundColor: "#fdecea", color: "#c62828", fontWeight: 700 }}
                    />
                  ) : (
                    <Typography sx={{ color: BRAND.subtle }}>—</Typography>
                  )}
                </Field>
              </Grid>

              <Grid item size={{ xs: 12 }}>
                <Field label="Short Description">
                  {editing ? (
                    <TextField
                      fullWidth
                      size="small"
                      value={form.shortDescription}
                      onChange={handleChange("shortDescription")}
                      sx={{ mt: 0.5, "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                    />
                  ) : (
                    <Typography sx={{ color: BRAND.ink }}>{product.shortDescription}</Typography>
                  )}
                </Field>
              </Grid>
            </Grid>
          </SectionCard>

          {/* Rating & reviews */}
          <SectionCard sx={{ mb: 3 }}>
            <SectionTitle>Rating & Reviews</SectionTitle>

            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.5,
                  backgroundColor: "#fff8e1",
                  borderRadius: "12px",
                  px: 2,
                  py: 1,
                }}
              >
                <StarRoundedIcon sx={{ color: "#f5a623", fontSize: 26 }} />
                <Typography variant="h5" sx={{ fontWeight: 800, color: BRAND.ink }}>
                  {product.rating || "-"}
                </Typography>
              </Box>
              <Typography sx={{ color: BRAND.subtle }}>
                {product.reviewsCount || 0} reviews total
              </Typography>
            </Stack>

            <Stack spacing={1.5}>
              {reviewBars.map(({ star, count }) => (
                <Stack key={star} direction="row" alignItems="center" spacing={1.5}>
                  <Stack direction="row" alignItems="center" spacing={0.25} sx={{ width: 44 }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: BRAND.ink }}>
                      {star}
                    </Typography>
                    <StarRoundedIcon sx={{ color: "#f5a623", fontSize: 15 }} />
                  </Stack>
                  <LinearProgress
                    variant="determinate"
                    value={(count / maxReviewCount) * 100}
                    sx={{
                      flex: 1,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: BRAND.pageBg,
                      "& .MuiLinearProgress-bar": { backgroundColor: BRAND.teal, borderRadius: 4 },
                    }}
                  />
                  <Typography variant="body2" sx={{ width: 36, textAlign: "right", color: BRAND.subtle }}>
                    {count}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </SectionCard>

          {/* Details */}
          <SectionCard sx={{ mb: 3 }}>
            <SectionTitle>Product Details</SectionTitle>

            <Typography
              variant="overline"
              sx={{ color: BRAND.subtle, fontWeight: 600, letterSpacing: "0.06em", fontSize: "0.7rem" }}
            >
              Bullets
            </Typography>

            {editing ? (
              <Stack spacing={1.25} sx={{ mt: 1, mb: 3 }}>
                {detailsForm.bullets?.map((bullet, index) => (
                  <Stack key={index} direction="row" spacing={1} alignItems="center">
                    <TextField
                      fullWidth
                      size="small"
                      value={bullet}
                      onChange={(e) => handleBulletChange(index, e.target.value)}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                    />
                    <IconButton size="small" onClick={() => removeBullet(index)}>
                      <DeleteIcon fontSize="small" sx={{ color: "#c62828" }} />
                    </IconButton>
                  </Stack>
                ))}
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={addBullet}
                  sx={{ alignSelf: "flex-start", color: BRAND.navy, textTransform: "none", fontWeight: 600 }}
                >
                  Add Bullet
                </Button>
              </Stack>
            ) : (
              <Stack spacing={1} sx={{ mt: 1.5, mb: 3 }}>
                {product.details?.bullets?.map((bullet, i) => (
                  <Stack key={i} direction="row" spacing={1.25} alignItems="flex-start">
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        backgroundColor: BRAND.teal,
                        mt: "7px",
                        flexShrink: 0,
                      }}
                    />
                    <Typography variant="body2" sx={{ color: BRAND.ink }}>
                      {bullet}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            )}

            <Divider sx={{ mb: 3, borderColor: BRAND.border }} />

            <Stack spacing={2.5}>
              {DETAILS_TEXT_FIELDS.map(({ key, label, icon: Icon }) => (
                <Field label={label} key={key}>
                  {editing ? (
                    <TextField
                      fullWidth
                      size="small"
                      multiline={key !== "quoteSource"}
                      value={detailsForm[key] || ""}
                      onChange={handleDetailsFieldChange(key)}
                      sx={{ mt: 0.5, "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                    />
                  ) : product.details?.[key] ? (
                    key === "quote" ? (
                      <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                        <FormatQuoteRoundedIcon sx={{ color: BRAND.teal, fontSize: 22, flexShrink: 0 }} />
                        <Typography variant="body2" sx={{ fontStyle: "italic", color: BRAND.subtle }}>
                          {product.details.quote}
                          {product.details.quoteSource ? ` — ${product.details.quoteSource}` : ""}
                        </Typography>
                      </Stack>
                    ) : (
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                        {Icon && <Icon sx={{ color: BRAND.teal, fontSize: 18 }} />}
                        <Typography variant="body2" sx={{ color: BRAND.ink }}>
                          {product.details[key]}
                        </Typography>
                      </Stack>
                    )
                  ) : (
                    <Typography variant="body2" sx={{ color: BRAND.subtle, mt: 0.5 }}>
                      —
                    </Typography>
                  )}
                </Field>
              ))}
            </Stack>
          </SectionCard>

          {/* Specs */}
          <SectionCard>
            <SectionTitle>Specifications</SectionTitle>

            {editing ? (
              <Stack spacing={1.25}>
                {specsRows.map((row, index) => (
                  <Stack key={index} direction="row" spacing={1} alignItems="center">
                    <TextField
                      size="small"
                      label="Key"
                      value={row.key}
                      onChange={(e) => handleSpecChange(index, "key", e.target.value)}
                      sx={{ width: "35%", "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                    />
                    <TextField
                      size="small"
                      label="Value"
                      fullWidth
                      value={row.value}
                      onChange={(e) => handleSpecChange(index, "value", e.target.value)}
                      helperText={index === 0 ? "Separate multiple values with commas" : ""}
                      sx={{ "& .MuiOutlinedInput-root": { borderRadius: "8px" } }}
                    />
                    <IconButton size="small" onClick={() => removeSpecRow(index)}>
                      <DeleteIcon fontSize="small" sx={{ color: "#c62828" }} />
                    </IconButton>
                  </Stack>
                ))}
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={addSpecRow}
                  sx={{ alignSelf: "flex-start", color: BRAND.navy, textTransform: "none", fontWeight: 600 }}
                >
                  Add Spec
                </Button>
              </Stack>
            ) : (
              <Table size="small">
                <TableBody>
                  {Object.entries(product.specs || {}).map(([key, value], i) => (
                    <TableRow
                      key={key}
                      sx={{
                        backgroundColor: i % 2 === 0 ? "transparent" : BRAND.pageBg,
                        "& td": { border: "none" },
                      }}
                    >
                      <TableCell
                        sx={{ color: BRAND.subtle, pl: 1.5, py: 1.25, width: "40%", fontWeight: 500, borderRadius: "8px 0 0 8px" }}
                      >
                        {key}
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: BRAND.ink, pr: 1.5, py: 1.25, borderRadius: "0 8px 8px 0" }}>
                        {Array.isArray(value) ? value.join(", ") : String(value)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </SectionCard>
        </Grid>
      </Grid>
    </Box>
  );
}