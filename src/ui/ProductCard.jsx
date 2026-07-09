import { useState } from "react";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
    const {
        id,
        name,
        price,
        oldPrice,
        discountLabel,
        rating,
        reviewsCount,
        colors,
        hasVideo,
        video,
    } = product;

    const [selectedColor, setSelectedColor] = useState(colors[0]);
    const mainImage = selectedColor.mainImage || selectedColor.images?.[0];

    return (
        <Card
            elevation={0}
            sx={{
                borderRadius: 0,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "transparent",
            }}
        >

            <Box
                sx={{
                    position: "relative",
                    overflow: "hidden",
                    "&:hover .img-hover": { opacity: 1 },
                    "&:hover .img-default": { opacity: 0 },
                    "&:hover .product-video": { opacity: 0 },
                }}
            >
                {hasVideo && (
                    <Box
                        component="video"
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="product-video"
                        sx={{ width: "100%", display: "block", transition: "opacity .3s ease" }}
                    >
                        <source src={video} type="video/mp4" />
                    </Box>
                )}

                {!hasVideo && (
                    <Box
                        component="img"
                        src={mainImage}
                        alt={name}
                        className="img-default"
                        sx={{ width: "100%", display: "block", transition: "opacity .3s ease" }}
                    />
                )}

                <Box
                    component="img"
                    src={selectedColor.hoverImage}
                    alt={name}
                    className="img-hover"
                    sx={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        objectFit: "cover",
                        opacity: 0,
                        transition: "opacity .3s ease",
                        pointerEvents: "none",
                    }}
                />
            </Box>

            <CardContent sx={{ px: 0, display: "flex", flexDirection: "column", flexGrow: 1 }}>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
                    {colors.map((color) => (
                        <Box
                            key={color.name}
                            component="img"
                            src={color.colorImg}
                            alt={color.name}
                            title={color.name}
                            onClick={() => setSelectedColor(color)}
                            sx={{
                                width: 34,
                                height: 34,
                                objectFit: "cover",
                                cursor: "pointer",
                                borderRadius: "50%",
                                p: "2px",
                                backgroundColor: "white",
                                transition: ".2s",
                                border:
                                    selectedColor.name === color.name
                                        ? "1.7px solid #007fad"
                                        : "1.5px solid #000",
                                "&:hover": { borderColor: "#999" },
                            }}
                        />
                    ))}
                </Box>

                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
                    {name}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    {oldPrice && (
                        <Typography sx={{ color: "text.secondary", textDecoration: "line-through" }}>
                            ${oldPrice}
                        </Typography>
                    )}
                    <Typography sx={{ color: "success.main", fontWeight: 600, fontSize: "1rem" }}>
                        ${price}
                    </Typography>
                </Box>

                {discountLabel && (
                    <Typography sx={{ color: "success.main", fontWeight: 600, mb: 1 }}>
                        {discountLabel}
                    </Typography>
                )}

                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                    <Box sx={{ display: "flex", color: "#ffc107" }}>
                        {[1, 2, 3, 4, 5].map((i) =>
                            i <= Math.round(rating) ? (
                                <StarIcon key={i} fontSize="small" />
                            ) : (
                                <StarBorderIcon key={i} fontSize="small" />
                            )
                        )}
                    </Box>
                    <Typography variant="body2">({reviewsCount} Reviews)</Typography>
                </Box>

                <Button
                    component={Link}
                    to={`/product/${id}`}
                    fullWidth
                    variant="outlined"
                    sx={{
                        mt: "auto",
                        borderRadius: 0,
                        border: "2px solid #003349",
                        color: "#003349",
                        backgroundColor: "#fff",
                        py: 1,
                        textTransform: "uppercase",
                        transition: "0.3s",

                        "&:hover": {
                            color: "#007fad",
                            backgroundColor: "#fff",
                            borderColor: "#007fad",
                        },
                    }}
                >
                    SELECT OPTIONS
                </Button>
            </CardContent>
        </Card>
    );
}