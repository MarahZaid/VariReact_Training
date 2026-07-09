import { Card, CardMedia, CardContent, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function CategoryCard({ id, name, shortDescription, mainImage }) {
    return (
        <Card elevation={0} sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            backgroundColor: "transparent",
            borderRadius: 0,
            height: "100%",
        }}
        >
            <CardMedia component="img" image={mainImage} alt={name} sx={{ width: "100%", objectFit: "contain" }}/>

            <CardContent
                sx={{display: "flex", flexDirection: "column", alignItems: "center", gap: 2,height: "100%", width: "100%",}}>

                <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#032f49" }}>
                    {name}
                </Typography>

                <Typography variant="body2" sx={{ color: "#4f4f4f", width: "75%" }}>
                    {shortDescription}
                </Typography>

                <Button
                    component={Link}
                    to={`/products?category=${id}`}
                    sx={{
                        mt: "auto",
                        borderRadius: 0,
                        color: "#113849",
                        border: "2px solid #003349",
                        fontWeight: "bold",
                        fontSize: "0.9rem",
                        backgroundColor: "#fff",
                        px: 5,
                        py: 1,
                        transition: "all 1s ease",
                        "&:hover": {
                            color: "#04a3dc",
                            border: "2px solid #04a3dc",
                            backgroundColor: "#fff",
                        },
                    }}
                >
                    SHOP NOW
                </Button>
            </CardContent>
        </Card>
    );
}