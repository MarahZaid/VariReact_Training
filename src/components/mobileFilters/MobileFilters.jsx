import { useState } from "react";
import {
  Box,
  Button,
  Collapse,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterCheckboxGroup from "../../ui/FilterCheckboxGroup";

const filterGroups = [
  {
    title: "Finish",
    filterType: "finish",
    options: ["Black", "Espresso Wood", "Light Wood", "Silver", "Walnut", "White"].map(
      (v) => ({ label: v, value: v })
    ),
  },
  {
    title: "Warranty",
    filterType: "warranty",
    options: ["1 Years", "3 Years", "5 Years", "Lifetime"].map((v) => ({
      label: v,
      value: v,
    })),
  },
  {
    title: "Price",
    filterType: "price",
    options: [
      { label: "$1 – $200", value: "1-200" },
      { label: "$201 – $400", value: "201-400" },
      { label: "$401 – $600", value: "401-600" },
    ],
  },
  {
    title: "Certifications",
    filterType: "certifications",
    options: ["ANSI/BIFMA", "Greenguard", "Greenguard Gold"].map((v) => ({
      label: v,
      value: v,
    })),
  },
  {
    title: "Necessary Desk Depth",
    filterType: "depth",
    options: ["18", "23.5", "25.75", "28", "29.75"].map((v) => ({
      label: `${v}"`,
      value: v,
    })),
  },
];

export default function MobileFilters() {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ display: { xs: "block", lg: "none" }, mb: 3 }}>
      <Button
        fullWidth
        onClick={() => setOpen((prev) => !prev)}
        sx={{
          borderRadius: 0,
          py: 1.5,
          fontWeight: 700,
          backgroundColor: "#003349",
          color: "white",
          "&:hover": { backgroundColor: "#003349" },
        }}
      >
        FILTER
      </Button>

      <Collapse in={open}>
        <Box sx={{ backgroundColor: "#f8f9fa", mt: 1 }}>
          {filterGroups.map((group) => (
            <Accordion key={group.filterType} disableGutters elevation={0}
              sx={{ backgroundColor: "#f8f9fa", "&:before": { display: "none" } }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>{group.title}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FilterCheckboxGroup
                  filterType={group.filterType}
                  options={group.options}
                  hideTitle
                />
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
}