import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  Grid,
  Stack,
  TextField,
  Button,
  MenuItem,
  IconButton,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControlLabel,
  Switch,
  Select,
  InputLabel,
  FormControl,
  Alert,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
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

const inputSx = { "& .MuiOutlinedInput-root": { borderRadius: "8px" } };

function SectionCard({ children, sx, ...props }) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: "18px",
        border: `1px solid ${BRAND.border}`,
        backgroundColor: BRAND.cardBg,
        boxShadow: BRAND.shadow,
        p: 3,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Card>
  );
}

function SectionTitle({ children, subtitle }) {
  return (
    <Box sx={{ mb: 2.5 }}>
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: "0.95rem",
          letterSpacing: "0.01em",
          color: BRAND.navy,
        }}
      >
        {children}
      </Typography>
      {subtitle && (
        <Typography variant="caption" sx={{ color: BRAND.subtle, display: "block", mt: 0.25 }}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
}

const accordionSx = {
  borderRadius: "18px !important",
  border: `1px solid ${BRAND.border}`,
  boxShadow: BRAND.shadow,
  mb: 2.5,
  overflow: "hidden",
  "&:before": { display: "none" },
  "&.Mui-expanded": { margin: 0, mb: 2.5 },
};

const accordionSummarySx = {
  px: 3,
  py: 0.5,
  minHeight: 64,
  "& .MuiAccordionSummary-content": { my: 1.5 },
};

const accordionDetailsSx = { px: 3, pb: 3, pt: 0 };

const removeBtnSx = {
  color: BRAND.subtle,
  "&:hover": { color: "#c62828", backgroundColor: "#fdecea" },
};

const addBtnSx = {
  color: BRAND.teal,
  textTransform: "none",
  fontWeight: 600,
  "&:hover": { backgroundColor: "rgba(0,127,173,0.08)" },
};

const emptyDetails = {
  bullets: [""],
  certificationsText: "",
  extrasInBox: "",
  quote: "",
  quoteSource: "",
  shipping: "",
  warrantyText: "",
};

const emptySpec = { key: "", value: "", type: "text" };
const emptyColor = { name: "", colorImg: "", hoverImage: "", images: [""] };

const emptyForm = {
  name: "",
  slug: "",
  categoryId: "",
  price: "",
  shortDescription: "",
  stock: "",
  rating: "",
  hasVideo: false,
  video: "",
  reviewsCount: "",
  review1stars: "",
  review2stars: "",
  review3stars: "",
  review4stars: "",
  review5stars: "",
  details: emptyDetails,
  specs: [emptySpec],
  colors: [emptyColor],
};

function slugify(text) {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AddProduct() {
  const { categories, addProduct } = useProducts();
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateDetails(field, value) {
    setForm((prev) => ({
      ...prev,
      details: { ...prev.details, [field]: value },
    }));
  }

  // ---- Bullets ----
  function updateBullet(index, value) {
    setForm((prev) => {
      const bullets = [...prev.details.bullets];
      bullets[index] = value;
      return { ...prev, details: { ...prev.details, bullets } };
    });
  }

  function addBullet() {
    setForm((prev) => ({
      ...prev,
      details: { ...prev.details, bullets: [...prev.details.bullets, ""] },
    }));
  }

  function removeBullet(index) {
    setForm((prev) => {
      const bullets = prev.details.bullets.filter((_, i) => i !== index);
      return { ...prev, details: { ...prev.details, bullets } };
    });
  }

  // ---- Specs ----
  function updateSpec(index, field, value) {
    setForm((prev) => {
      const specs = [...prev.specs];
      specs[index] = { ...specs[index], [field]: value };
      return { ...prev, specs };
    });
  }

  function addSpec() {
    setForm((prev) => ({ ...prev, specs: [...prev.specs, { ...emptySpec }] }));
  }

  function removeSpec(index) {
    setForm((prev) => ({
      ...prev,
      specs: prev.specs.filter((_, i) => i !== index),
    }));
  }

  // ---- Colors ----
  function updateColor(index, field, value) {
    setForm((prev) => {
      const colors = [...prev.colors];
      colors[index] = { ...colors[index], [field]: value };
      return { ...prev, colors };
    });
  }

  function addColor() {
    setForm((prev) => ({
      ...prev,
      colors: [...prev.colors, { ...emptyColor, images: [""] }],
    }));
  }

  function removeColor(index) {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.filter((_, i) => i !== index),
    }));
  }

  function updateColorImage(colorIndex, imageIndex, value) {
    setForm((prev) => {
      const colors = [...prev.colors];
      const images = [...colors[colorIndex].images];
      images[imageIndex] = value;
      colors[colorIndex] = { ...colors[colorIndex], images };
      return { ...prev, colors };
    });
  }

  function addColorImage(colorIndex) {
    setForm((prev) => {
      const colors = [...prev.colors];
      colors[colorIndex] = {
        ...colors[colorIndex],
        images: [...colors[colorIndex].images, ""],
      };
      return { ...prev, colors };
    });
  }

  function removeColorImage(colorIndex, imageIndex) {
    setForm((prev) => {
      const colors = [...prev.colors];
      colors[colorIndex] = {
        ...colors[colorIndex],
        images: colors[colorIndex].images.filter((_, i) => i !== imageIndex),
      };
      return { ...prev, colors };
    });
  }

  function buildSpecsObject() {
    const specsObject = {};
    form.specs.forEach(({ key, value, type }) => {
      const trimmedKey = key.trim();
      if (!trimmedKey || value === "") return;

      if (type === "list") {
        specsObject[trimmedKey] = value
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean);
      } else if (type === "number") {
        specsObject[trimmedKey] = Number(value) || 0;
      } else {
        specsObject[trimmedKey] = value;
      }
    });
    return specsObject;
  }

  function validate() {
    if (!form.name.trim()) return "Please enter a product name.";
    if (!form.categoryId) return "Please select a category.";
    if (form.price === "" || isNaN(Number(form.price)))
      return "Please enter a valid price.";
    const hasValidColor = form.colors.some((c) => c.name.trim());
    if (!hasValidColor) return "Please add at least one color with a name.";
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setSaving(true);

    try {
      const finalProduct = {
        name: form.name.trim(),
        slug: form.slug.trim() || slugify(form.name),
        categoryId: form.categoryId,
        price: Number(form.price) || 0,
        shortDescription: form.shortDescription.trim(),
        stock: form.stock === "" ? 0 : Number(form.stock),
        rating: form.rating === "" ? 0 : Number(form.rating),
        hasVideo: form.hasVideo,
        video: form.hasVideo ? form.video.trim() : "",
        reviewsCount: form.reviewsCount === "" ? 0 : Number(form.reviewsCount),
        review1stars: Number(form.review1stars) || 0,
        review2stars: Number(form.review2stars) || 0,
        review3stars: Number(form.review3stars) || 0,
        review4stars: Number(form.review4stars) || 0,
        review5stars: Number(form.review5stars) || 0,
        createdAt: Date.now(),
        details: {
          bullets: form.details.bullets.map((b) => b.trim()).filter(Boolean),
          certificationsText: form.details.certificationsText.trim(),
          extrasInBox: form.details.extrasInBox.trim(),
          quote: form.details.quote.trim(),
          quoteSource: form.details.quoteSource.trim(),
          shipping: form.details.shipping.trim(),
          warrantyText: form.details.warrantyText.trim(),
        },
        specs: buildSpecsObject(),
        colors: form.colors
          .filter((c) => c.name.trim())
          .map((c) => ({
            name: c.name.trim(),
            colorImg: c.colorImg.trim(),
            hoverImage: c.hoverImage.trim(),
            images: c.images.map((img) => img.trim()).filter(Boolean),
          })),
      };

      const newId = await addProduct(finalProduct);
      navigate(`/admin/products/${newId}`);
    } catch (err) {
      console.log(err);
      setError("Something went wrong while saving the product. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ backgroundColor: BRAND.pageBg, minHeight: "100%", p: { xs: 2, md: 3 } }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
        <Tooltip title="Back to products">
          <IconButton
            onClick={() => navigate("/admin/products")}
            sx={{
              backgroundColor: "#fff",
              border: `1px solid ${BRAND.border}`,
              "&:hover": { backgroundColor: BRAND.pageBg },
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 20, color: BRAND.navy }} />
          </IconButton>
        </Tooltip>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 800, color: BRAND.navy, letterSpacing: "-0.01em" }}>
            Add Product
          </Typography>
          <Typography variant="body2" sx={{ color: BRAND.subtle, mt: 0.25 }}>
            Fill in the details below to create a new product listing
          </Typography>
        </Box>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3, borderRadius: "12px", border: "1px solid #f5c6c2" }}
        >
          {error}
        </Alert>
      )}

      {/* Basic info */}
      <SectionCard sx={{ mb: 2.5 }}>
        <SectionTitle>Basic Info</SectionTitle>
        <Grid container spacing={2.5}>
          <Grid item size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Name"
              fullWidth
              required
              size="small"
              value={form.name}
              onChange={(e) => {
                const value = e.target.value;
                updateField("name", value);
                updateField("slug", slugify(value));
              }}
              sx={inputSx}
            />
          </Grid>

          <Grid item size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Slug"
              fullWidth
              size="small"
              value={form.slug}
              InputProps={{ readOnly: true }}
              helperText="Auto-generated from the name"
              sx={inputSx}
            />
          </Grid>

          <Grid item size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth required size="small">
              <InputLabel>Category</InputLabel>
              <Select
                label="Category"
                value={form.categoryId}
                onChange={(e) => updateField("categoryId", e.target.value)}
                sx={{ borderRadius: "8px" }}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item size={{ xs: 12, sm: 4}}>
            <TextField
              label="Price"
              type="number"
              fullWidth
              required
              size="small"
              value={form.price}
              onChange={(e) => updateField("price", e.target.value)}
              helperText="Base price before discounts."
              sx={inputSx}
            />
          </Grid>

          <Grid item size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Stock"
              type="number"
              fullWidth
              size="small"
              value={form.stock}
              onChange={(e) => updateField("stock", e.target.value)}
              sx={inputSx}
            />
          </Grid>


          <Grid item size={{ xs: 12 }}>
            <TextField
              label="Short Description"
              fullWidth
              multiline
              minRows={2}
              size="small"
              value={form.shortDescription}
              onChange={(e) => updateField("shortDescription", e.target.value)}
              sx={inputSx}
            />
          </Grid>

          <Grid item size={{ xs: 12, sm: 4 }} sx={{ display: "flex", alignItems: "center" }}>
            <FormControlLabel
              control={
                <Switch
                  checked={form.hasVideo}
                  onChange={(e) => updateField("hasVideo", e.target.checked)}
                  sx={{
                    "& .MuiSwitch-switchBase.Mui-checked": { color: BRAND.teal },
                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                      backgroundColor: BRAND.teal,
                    },
                  }}
                />
              }
              label={<Typography variant="body2" sx={{ fontWeight: 500 }}>Has Video</Typography>}
            />
          </Grid>

          {form.hasVideo && (
            <Grid item size={{ xs: 12, sm: 8 }}>
              <TextField
                label="Video URL"
                fullWidth
                size="small"
                value={form.video}
                onChange={(e) => updateField("video", e.target.value)}
                sx={inputSx}
              />
            </Grid>
          )}
        </Grid>
      </SectionCard>

      {/* Details */}
      <Accordion elevation={0} sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: BRAND.navy }} />} sx={accordionSummarySx}>
          <Typography sx={{ fontWeight: 700, color: BRAND.navy, fontSize: "0.95rem" }}>Details</Typography>
        </AccordionSummary>
        <AccordionDetails sx={accordionDetailsSx}>
          <Grid container spacing={2.5}>
            <Grid item size={{ xs: 12 }}>
              <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: BRAND.ink }}>
                Bullet Points
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {form.details.bullets.map((bullet, index) => (
                  <Box key={index} sx={{ display: "flex", gap: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder={`Bullet ${index + 1}`}
                      value={bullet}
                      onChange={(e) => updateBullet(index, e.target.value)}
                      sx={inputSx}
                    />
                    <IconButton
                      onClick={() => removeBullet(index)}
                      disabled={form.details.bullets.length === 1}
                      sx={removeBtnSx}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
              <Button size="small" startIcon={<AddIcon />} onClick={addBullet} sx={{ ...addBtnSx, mt: 1 }}>
                Add Bullet
              </Button>
            </Grid>

            <Grid item size={{ xs: 12 }}>
              <Divider sx={{ borderColor: BRAND.border }} />
            </Grid>

            <Grid item size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Certifications Text"
                fullWidth
                size="small"
                value={form.details.certificationsText}
                onChange={(e) => updateDetails("certificationsText", e.target.value)}
                sx={inputSx}
              />
            </Grid>

            <Grid item size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Warranty Text"
                fullWidth
                size="small"
                value={form.details.warrantyText}
                onChange={(e) => updateDetails("warrantyText", e.target.value)}
                sx={inputSx}
              />
            </Grid>

            <Grid item size={{ xs: 12 }}>
              <TextField
                label="Extras In Box"
                fullWidth
                multiline
                minRows={2}
                size="small"
                value={form.details.extrasInBox}
                onChange={(e) => updateDetails("extrasInBox", e.target.value)}
                sx={inputSx}
              />
            </Grid>

            <Grid item size={{ xs: 12 }}>
              <TextField
                label="Shipping"
                fullWidth
                multiline
                minRows={2}
                size="small"
                value={form.details.shipping}
                onChange={(e) => updateDetails("shipping", e.target.value)}
                sx={inputSx}
              />
            </Grid>

            <Grid item size={{ xs: 12, sm: 8 }}>
              <TextField
                label="Quote"
                fullWidth
                multiline
                minRows={2}
                size="small"
                value={form.details.quote}
                onChange={(e) => updateDetails("quote", e.target.value)}
                sx={inputSx}
              />
            </Grid>

            <Grid item size={{ xs: 12, sm: 4 }}>
              <TextField
                label="Quote Source"
                fullWidth
                size="small"
                value={form.details.quoteSource}
                onChange={(e) => updateDetails("quoteSource", e.target.value)}
                sx={inputSx}
              />
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>

      {/* Specs */}
      <Accordion elevation={0} sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: BRAND.navy }} />} sx={accordionSummarySx}>
          <Typography sx={{ fontWeight: 700, color: BRAND.navy, fontSize: "0.95rem" }}>Specs</Typography>
        </AccordionSummary>
        <AccordionDetails sx={accordionDetailsSx}>
          <Typography variant="caption" sx={{ color: BRAND.subtle, mb: 2, display: "block" }}>
            e.g. desktopWidth, warranty, finish… add whatever this product needs. For type "List", separate
            values with commas.
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
            {form.specs.map((spec, index) => (
              <Grid container spacing={1} key={index} alignItems="center">
                <Grid item size={{ xs: 4, sm: 3 }}>
                  <TextField
                    size="small"
                    label="Key"
                    fullWidth
                    placeholder="e.g. desktopWidth"
                    value={spec.key}
                    onChange={(e) => updateSpec(index, "key", e.target.value)}
                    sx={inputSx}
                  />
                </Grid>
                <Grid item size={{ xs: 5, sm: 5 }}>
                  <TextField
                    size="small"
                    label="Value"
                    fullWidth
                    placeholder={spec.type === "list" ? "Black, White, Walnut" : "e.g. 36"}
                    value={spec.value}
                    onChange={(e) => updateSpec(index, "value", e.target.value)}
                    sx={inputSx}
                  />
                </Grid>
                <Grid item size={{ xs: 2, sm: 3 }}>
                  <FormControl size="small" fullWidth>
                    <Select
                      value={spec.type}
                      onChange={(e) => updateSpec(index, "type", e.target.value)}
                      sx={{ borderRadius: "8px" }}
                    >
                      <MenuItem value="text">Text</MenuItem>
                      <MenuItem value="number">Number</MenuItem>
                      <MenuItem value="list">List</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item size={{ xs: 1 }}>
                  <IconButton
                    onClick={() => removeSpec(index)}
                    disabled={form.specs.length === 1}
                    sx={removeBtnSx}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
          </Box>

          <Button size="small" startIcon={<AddIcon />} onClick={addSpec} sx={{ ...addBtnSx, mt: 1.5 }}>
            Add Spec
          </Button>
        </AccordionDetails>
      </Accordion>

      {/* Colors */}
      <Accordion elevation={0} defaultExpanded sx={accordionSx}>
        <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: BRAND.navy }} />} sx={accordionSummarySx}>
          <Typography sx={{ fontWeight: 700, color: BRAND.navy, fontSize: "0.95rem" }}>
            Colors & Images
          </Typography>
        </AccordionSummary>
        <AccordionDetails sx={accordionDetailsSx}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {form.colors.map((color, colorIndex) => (
              <Box
                key={colorIndex}
                sx={{
                  border: `1px solid ${BRAND.border}`,
                  backgroundColor: BRAND.pageBg,
                  borderRadius: "14px",
                  p: 2.5,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="body2" sx={{ fontWeight: 700, color: BRAND.navy }}>
                    Color {colorIndex + 1}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => removeColor(colorIndex)}
                    disabled={form.colors.length === 1}
                    sx={removeBtnSx}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Grid container spacing={2}>
                  <Grid item size={{ xs: 12, sm: 4 }}>
                    <TextField
                      size="small"
                      label="Color Name"
                      fullWidth
                      value={color.name}
                      onChange={(e) => updateColor(colorIndex, "name", e.target.value)}
                      sx={{ ...inputSx, backgroundColor: "#fff", borderRadius: "8px" }}
                    />
                  </Grid>
                  <Grid item size={{ xs: 12, sm: 4 }}>
                    <TextField
                      size="small"
                      label="Color Swatch Image (colorImg)"
                      fullWidth
                      value={color.colorImg}
                      onChange={(e) => updateColor(colorIndex, "colorImg", e.target.value)}
                      sx={{ ...inputSx, backgroundColor: "#fff", borderRadius: "8px" }}
                    />
                  </Grid>
                  <Grid item size={{ xs: 12, sm: 4 }}>
                    <TextField
                      size="small"
                      label="Hover Image"
                      fullWidth
                      value={color.hoverImage}
                      onChange={(e) => updateColor(colorIndex, "hoverImage", e.target.value)}
                      sx={{ ...inputSx, backgroundColor: "#fff", borderRadius: "8px" }}
                    />
                  </Grid>

                  <Grid item size={{ xs: 12 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: BRAND.subtle }}>
                      Product Images
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
                      {color.images.map((img, imageIndex) => (
                        <Box key={imageIndex} sx={{ display: "flex", gap: 1 }}>
                          <TextField
                            size="small"
                            fullWidth
                            placeholder={`Image URL ${imageIndex + 1}`}
                            value={img}
                            onChange={(e) => updateColorImage(colorIndex, imageIndex, e.target.value)}
                            sx={{ ...inputSx, backgroundColor: "#fff", borderRadius: "8px" }}
                          />
                          <IconButton
                            onClick={() => removeColorImage(colorIndex, imageIndex)}
                            disabled={color.images.length === 1}
                            sx={removeBtnSx}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      ))}
                    </Box>
                    <Button
                      size="small"
                      startIcon={<AddIcon />}
                      sx={{ ...addBtnSx, mt: 1 }}
                      onClick={() => addColorImage(colorIndex)}
                    >
                      Add Image
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Box>

          <Button size="small" startIcon={<AddIcon />} onClick={addColor} sx={{ ...addBtnSx, mt: 2 }}>
            Add Color
          </Button>
        </AccordionDetails>
      </Accordion>

      

      <Box sx={{ display: "flex", gap: 1.5, justifyContent: "flex-end" }}>
        <Button
          variant="outlined"
          onClick={() => navigate("/admin/products")}
          disabled={saving}
          sx={{
            borderColor: BRAND.border,
            color: BRAND.subtle,
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 600,
            px: 3,
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={saving}
          startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
          sx={{
            backgroundColor: BRAND.navy,
            borderRadius: "10px",
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            boxShadow: "none",
            "&:hover": { backgroundColor: "#00263a", boxShadow: "none" },
          }}
        >
          {saving ? "Saving…" : "Save Product"}
        </Button>
      </Box>
    </Box>
  );
}