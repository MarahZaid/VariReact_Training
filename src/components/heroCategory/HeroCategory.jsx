import { useSelector } from "react-redux";
import { Box, Container, Typography } from "@mui/material";

export default function HeroCategory() {
    const { category } = useSelector((state) => state.categoryProducts);

    if (!category) return null;

    return (
        <Box component="section" sx={{
            backgroundColor: "#f0f0f0",
            fontFamily: `"Libre Franklin", sans-serif`,
            display: "flex",
            flexDirection: { xs: "column-reverse", md: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: 4,
        }}
        >
                <Box sx={{ px: 2 }}>
                <Typography
                    variant="h1"
                    sx={{
                        fontFamily: `"Libre Franklin", sans-serif`,
                        fontSize: { xs: 25, sm: 30, md: 35, lg: 44 },
                        fontWeight: "bold",
                        color: "#032f49",
                        mb: 2,
                    }}
                >
                    {category.PLPName}
                </Typography>

                <Typography variant="body1" sx={{ color: "#4f4f4f", mb: 4, }}>
                    {category.description}
                </Typography>
            </Box>

                <Box
                    component="img"
                    src={category.heroImage}
                    alt={category.PLPName}
                    sx={{
                        width: { xs: "100%", md: "50%" },
                        objectFit: "cover",
                    }}
                />
        
        </Box>
    );
}