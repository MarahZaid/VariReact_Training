import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Box, IconButton } from "@mui/material";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ReactImageMagnify from "react-image-magnify";

export default function ProductGallery() {
  const { product, selectedColorIndex } = useSelector((state) => state.productDetails);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const thumbsRef = useRef(null);

  
  useEffect(() => {
    setActiveImageIndex(0);
  }, [selectedColorIndex]);

  if (!product) return null;

  const colors = product.colors || [];
  const currentColor = colors[selectedColorIndex] || colors[0];
  const images = currentColor?.images || [];

  const scrollThumbs = (direction) => {
    thumbsRef.current?.scrollBy({ top: direction * 129, behavior: "smooth" });
  };

  const goToPrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNextImage = () => {
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      
      <Box sx={{ display: {xs:'none', sm:'none', md:'flex'}, flexDirection: "column", alignItems: "center", gap: 1 }}>
        <IconButton size="small" onClick={() => scrollThumbs(-1)}>
          <KeyboardArrowUpIcon />
        </IconButton>

        <Box
          ref={thumbsRef}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            maxHeight: 540,
            overflowY: "hidden",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {images.map((imgUrl, index) => (
            <Box
              key={imgUrl + index}
              component="img"
              src={imgUrl}
              alt={`${product.name} ${index + 1}`}
              onClick={() => setActiveImageIndex(index)}
              sx={{
                width: 90,
                height: 90,
                objectFit: "cover",
                p: 0.5,
                cursor: "pointer",
                border:
                  index === activeImageIndex
                    ? "1px solid rgb(0, 145, 255)"
                    : "1px solid #ddd",
              }}
            />
          ))}
        </Box>

        <IconButton size="small" onClick={() => scrollThumbs(1)}>
          <KeyboardArrowDownIcon />
        </IconButton>
      </Box>


      <Box sx={{ flexGrow: 1, minWidth: 0, position: "relative" }}>
        {images[activeImageIndex] && (
          <>
            <ReactImageMagnify
              smallImage={{
                alt: product.name,
                isFluidWidth: true,
                src: images[activeImageIndex],
              }}
              largeImage={{
                src: images[activeImageIndex],
                width: 1400,
                height: 1400,
              }}
              enlargedImagePosition="over"
            />

            {images.length > 1 && (
              <>
                <IconButton
                  onClick={goToPrevImage}
                  sx={{
                    position: "absolute",
                    left: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    backgroundColor: "rgba(0,0,0,0.45)",
                    color: "white",
                    zIndex: 2,
                    "&:hover": { backgroundColor: "rgba(0,0,0,0.65)" },
                  }}
                >
                  <ChevronLeftIcon />
                </IconButton>

                <IconButton
                  onClick={goToNextImage}
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    backgroundColor: "rgba(0,0,0,0.45)",
                    color: "white",
                    zIndex: 2,
                    "&:hover": { backgroundColor: "rgba(0,0,0,0.65)" },
                  }}
                >
                  <ChevronRightIcon />
                </IconButton>
              </>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}