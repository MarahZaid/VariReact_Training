import { useSelector, useDispatch } from "react-redux";
import { Box, Typography, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { toggleFilter } from "../store/categoryProductsSlice";

// options: [{ label: "Black", value: "Black" }, ...]
export default function FilterCheckboxGroup({ title, filterType, options, hideTitle = false }) {
  const dispatch = useDispatch();
  const selectedValues = useSelector((state) => state.categoryProducts.filters[filterType]);

  return (
    <Box sx={{ mb: hideTitle ? 0 : 4 }}>
      {!hideTitle && (
        <Typography sx={{ color: "#007fad", fontWeight: 600, mb: 1.5 }}>
          {title}
        </Typography>
      )}

      <FormGroup>
        {options.map((option) => (
          <FormControlLabel
            key={option.value}
            label={option.label}
            control={
              <Checkbox
                checked={selectedValues.includes(option.value)}
                onChange={() =>
                  dispatch(toggleFilter({ type: filterType, value: option.value }))
                }
                sx={{
                  borderRadius: 0,
                  "&.Mui-checked": { color: "#003349" },
                }}
              />
            }
          />
        ))}
      </FormGroup>
    </Box>
  );
}