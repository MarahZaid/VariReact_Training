import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Stack,
  Typography,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";


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
  "& .MuiOutlinedInput-root": { borderRadius: "8px" },
};

const EMPTY_FORM = {
  name: "",
  PLPName: "",
  slug: "",
  shortDescription: "",
  description: "",
  mainImage: "",
  heroImage: "",
  discountPercentage: 0,
};

function slugify(text) {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-");
}

export default function CategoryFormDialog({ open, onClose, onSubmit, initialData }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const isEdit = Boolean(initialData);

  useEffect(() => {
    if (open) {
      setForm(initialData ? { ...EMPTY_FORM, ...initialData } : EMPTY_FORM);
    }
  }, [open, initialData]);

  function handleChange(field) {
    return (e) => {
      const value = e.target.value;
      setForm((prev) => {
        const next = { ...prev, [field]: value };
        if (field === "name") {
          next.slug = slugify(value);
        }
        return next;
      });
    };
  }

  async function handleSubmit() {
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      await onSubmit({
        ...form,
        slug: form.slug || slugify(form.name),
        discountPercentage: Number(form.discountPercentage) || 0,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "18px",
          border: `1px solid ${BRAND.border}`,
          boxShadow: BRAND.shadow,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontWeight: 800,
          color: BRAND.navy,
          letterSpacing: "-0.01em",
          pb: 1.5,
          borderBottom: `1px solid ${BRAND.border}`,
        }}
      >
        {isEdit ? "Edit Category" : "Add New Category"}
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ color: BRAND.subtle, "&:hover": { backgroundColor: BRAND.pageBg } }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ backgroundColor: BRAND.pageBg, pt: 3 }}>
        <Grid container spacing={2}>
          <Grid item size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Name"
              fullWidth
              size="small"
              value={form.name}
              onChange={handleChange("name")}
              required
              sx={{ ...inputSx, backgroundColor: "#fff" }}
            />
          </Grid>

          <Grid item size={{ xs: 12, sm: 6 }}>
            <TextField
              label="PLP Name"
              fullWidth
              size="small"
              value={form.PLPName}
              onChange={handleChange("PLPName")}
              sx={{ ...inputSx, backgroundColor: "#fff" }}
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
              sx={{ ...inputSx, backgroundColor: "#fff" }}
              FormHelperTextProps={{ sx: { color: BRAND.subtle, mx: 0 } }}
            />
          </Grid>

          <Grid item size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Short Description"
              fullWidth
              size="small"
              value={form.shortDescription}
              onChange={handleChange("shortDescription")}
              sx={{ ...inputSx, backgroundColor: "#fff" }}
            />
          </Grid>

          <Grid item size={{ xs: 12, sm: 12 }}>
            <TextField
              label="Discount %"
              type="number"
              fullWidth
              size="small"
              value={form.discountPercentage}
              onChange={handleChange("discountPercentage")}
              inputProps={{ min: 0, max: 100 }}
              helperText="Automatically applies to all products in this category — set it to 0 if there's no discount."
              sx={{ ...inputSx, backgroundColor: "#fff" }}
              FormHelperTextProps={{ sx: { color: BRAND.subtle, mx: 0 } }}
            />
          </Grid>

          <Grid item size={{ xs: 12 }}>
            <TextField
              label="Description"
              fullWidth
              multiline
              minRows={3}
              size="small"
              value={form.description}
              onChange={handleChange("description")}
              sx={{ ...inputSx, backgroundColor: "#fff" }}
            />
          </Grid>

          <Grid item size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Main Image URL"
              fullWidth
              size="small"
              value={form.mainImage}
              onChange={handleChange("mainImage")}
              sx={{ ...inputSx, backgroundColor: "#fff" }}
            />
          </Grid>

          <Grid item size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Hero Image URL"
              fullWidth
              size="small"
              value={form.heroImage}
              onChange={handleChange("heroImage")}
              sx={{ ...inputSx, backgroundColor: "#fff" }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          backgroundColor: BRAND.pageBg,
          borderTop: `1px solid ${BRAND.border}`,
        }}
      >
        <Stack direction="row" spacing={1}>
          <Button
            onClick={onClose}
            disabled={saving}
            sx={{
              color: BRAND.subtle,
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "10px",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={saving || !form.name.trim()}
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
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Add"}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}