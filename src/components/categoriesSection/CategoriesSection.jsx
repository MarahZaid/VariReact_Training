import { Box, Grid, Typography, CircularProgress } from "@mui/material";
import useCategories from "../../hooks/useCategories";
import CategoryCard from "../../ui/CategoryCard";

export default function CategorySection() {
  const { categories, loading, error } = useCategories();

  return (
    <Box component="section" sx={{backgroundColor: "#f0f0f0", py: 8,}}>
      <Typography variant="h3" sx={{fontWeight: "bold", textAlign: "center", color: "#032f49", fontSize: { xs: 25, sm: 30, md: 35, lg:44}, fontFamily: `"Libre Franklin", sans-serif`, mb: 6,}}>
        Height-Adjustable Standing Desks & Office Furniture
      </Typography>

      {loading && (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography textAlign="center" color="error">
         error ...
        </Typography>
      )}

      {!loading && !error && (
        <Grid container spacing={3} justifyContent="center" px={{ xs: 2, md: 5 }}>
          {categories.map((category) => (
            <Grid item key={category.id} size={{ xs: 12, sm: 6, md: 4, lg: 2, xl:2 }}>
              <CategoryCard {...category} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}