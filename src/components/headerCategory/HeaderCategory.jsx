import {
  Box,
  Breadcrumbs,
  Typography,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  setSortValue,
  selectFilteredSortedProducts,
} from "../../store/categoryProductsSlice";

export default function HeaderCategory() {
  const dispatch = useDispatch();
  const { category, sortValue } = useSelector((state) => state.categoryProducts);
  const products = useSelector(selectFilteredSortedProducts);

  if (!category) return null;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "flex-start", sm: "center" },
        justifyContent: "space-between",
        gap: 2,
        px: { xs: 2, md: 4 },
        py: 3,
      }}
    >
      <Breadcrumbs separator="/" sx={{display: {xs: 'none',sm:'none', md:'block', lg:'block'}}}>
        <Link to="/" style={{ color: "#219fc5", textDecoration: "none" }}>
          Home
        </Link>
        <Link
          to="/products"
          style={{ color: "#219fc5", textDecoration: "none" }}
        >
          Products
        </Link>
        <Typography sx={{ fontWeight: "bold", color: "#032f49" }}>
          {category.name}
        </Typography>
      </Breadcrumbs>

      <Box
  sx={{
    display: "flex",
    alignItems: "center",
    gap: 2,
    flexDirection: { xs: "column", md: "row" },
    width: { xs: "100%", md: "auto" },
  }}
>
  <Typography
    sx={{
      fontWeight: "bold",
      color: "#032f49",
      textAlign: "center",
      width: { xs: "100%", md: "auto" },
    }}
  >
    {products.length} Products
  </Typography>

  <FormControl
    size="small"
    sx={{
      width: { xs: "100%", md: 250 },
    }}
  >
    <Select
      value={sortValue}
      onChange={(e) => dispatch(setSortValue(e.target.value))}
      displayEmpty
      sx={{
        width: "100%",
        borderRadius: 0,
        height: 56,
        "& .MuiSelect-select": {
          py: 2,
        },
      }}
    >
      <MenuItem value="default">FEATURED</MenuItem>
      <MenuItem value="lowToHigh">PRICE: LOW TO HIGH</MenuItem>
      <MenuItem value="highToLow">PRICE: HIGH TO LOW</MenuItem>
      <MenuItem value="aToz">A - Z</MenuItem>
      <MenuItem value="zToa">Z - A</MenuItem>
    </Select>
  </FormControl>
</Box>
    </Box>
  );
}