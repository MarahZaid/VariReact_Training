import { Box, Divider } from "@mui/material";
import FilterCheckboxGroup from "../../ui/FilterCheckboxGroup";

const finishOptions = ["Black", "Espresso Wood", "Light Wood", "Silver", "Walnut", "White"]
  .map((v) => ({ label: v, value: v }));

const warrantyOptions = ["1 Years", "3 Years", "5 Years", "Lifetime"]
  .map((v) => ({ label: v, value: v }));

const priceOptions = [
  { label: "$1 – $200", value: "1-200" },
  { label: "$201 – $400", value: "201-400" },
  { label: "$401 – $600", value: "401-600" },
];

const certificationOptions = ["ANSI/BIFMA", "Greenguard", "Greenguard Gold"]
  .map((v) => ({ label: v, value: v }));

const depthOptions = ["18", "23.5", "25.75", "28", "29.75"]
  .map((v) => ({ label: `${v}"`, value: v }));

export default function FiltersSidebar() {
  return (
    <Box sx={{ display: { xs: "none", lg: "block" }, pr: 3 }}>
      <Divider sx={{ mb: 3 }} />

      <FilterCheckboxGroup title="Finish" filterType="finish" options={finishOptions} />
      <Divider sx={{ mb: 3 }} />

      <FilterCheckboxGroup title="Warranty" filterType="warranty" options={warrantyOptions} />
      <Divider sx={{ mb: 3 }} />

      <FilterCheckboxGroup title="Price" filterType="price" options={priceOptions} />
      <Divider sx={{ mb: 3 }} />

      <FilterCheckboxGroup
        title="Certifications"
        filterType="certifications"
        options={certificationOptions}
      />
      <Divider sx={{ mb: 3 }} />

      <FilterCheckboxGroup
        title="Necessary Desk Depth"
        filterType="depth"
        options={depthOptions}
      />
    </Box>
  );
}