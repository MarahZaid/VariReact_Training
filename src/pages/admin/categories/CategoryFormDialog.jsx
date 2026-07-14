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
} from "@mui/material";

const EMPTY_FORM = {
    name: "",
    PLPName: "",
    slug: "",
    shortDescription: "",
    description: "",
    mainImage: "",
    heroImage: "",
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
    const [slugTouched, setSlugTouched] = useState(false);
    const [saving, setSaving] = useState(false);

    const isEdit = Boolean(initialData);

    useEffect(() => {
        if (open) {
            setForm(initialData ? { ...EMPTY_FORM, ...initialData } : EMPTY_FORM);
            setSlugTouched(Boolean(initialData?.slug));
        }
    }, [open, initialData]);

    function handleChange(field) {
        return (e) => {
            const value = e.target.value;
            setForm((prev) => {
                const next = { ...prev, [field]: value };
                if (field === "name" && !slugTouched) {
                    next.slug = slugify(value);
                }
                return next;
            });
            if (field === "slug") setSlugTouched(true);
        };
    }

    async function handleSubmit() {
        if (!form.name.trim()) return;
        setSaving(true);
        try {
            await onSubmit({
                ...form,
                slug: form.slug || slugify(form.name),
            });
            onClose();
        } finally {
            setSaving(false);
        }
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth slotProps={{
            paper: {
                sx: {
                    borderRadius: 3,
                },
            },
        }}
        >
            <DialogTitle sx={{ fontWeight: 700 }}>
                {isEdit ? "Edit Category" : "Add New Category"}
            </DialogTitle>

            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 0.5 }}>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <TextField
                            label="Name"
                            fullWidth
                            value={form.name}
                            onChange={handleChange("name")}
                            required
                        />
                    </Grid>

                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <TextField
                            label="PLP Name"
                            fullWidth
                            value={form.PLPName}
                            onChange={handleChange("PLPName")}
                        />
                    </Grid>

                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <TextField
                            label="Slug"
                            fullWidth
                            value={form.slug}
                            onChange={handleChange("slug")}
                            helperText="Auto-generated from the name, but you can edit it"
                        />
                    </Grid>

                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <TextField
                            label="Short Description"
                            fullWidth
                            value={form.shortDescription}
                            onChange={handleChange("shortDescription")}
                        />
                    </Grid>

                    <Grid item size={{ xs: 12 }}>
                        <TextField
                            label="Description"
                            fullWidth
                            multiline
                            minRows={3}
                            value={form.description}
                            onChange={handleChange("description")}
                        />
                    </Grid>

                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <TextField
                            label="Main Image URL"
                            fullWidth
                            value={form.mainImage}
                            onChange={handleChange("mainImage")}
                        />
                    </Grid>

                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <TextField
                            label="Hero Image URL"
                            fullWidth
                            value={form.heroImage}
                            onChange={handleChange("heroImage")}
                        />
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Stack direction="row" spacing={1}>
                    <Button onClick={onClose} disabled={saving}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={saving || !form.name.trim()}
                        sx={{ backgroundColor: "#003349" }}
                    >
                        {isEdit ? "Save Changes" : "Add"}
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    );
}