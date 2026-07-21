import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, Link as RouterLink } from "react-router-dom";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Box,
  CircularProgress,
  List,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import { fetchSearchResults } from "../../store/searchSlice";

const NAVY = "#003349";
const BLUE = "#007fad";

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const dispatch = useDispatch();

  const { products, categories, pages, loading } = useSelector((state) => state.search);

  useEffect(() => {
    if (query) dispatch(fetchSearchResults(query));
  }, [query, dispatch]);

  if (loading) {
    return (
      <Container sx={{ py: 8, textAlign: "center" }}>
        <CircularProgress sx={{ color: BLUE }} />
      </Container>
    );
  }

  const noResults = !products.length && !categories.length && !pages.length;
  const hasSidebar = categories.length > 0 || pages.length > 0;

  const SidebarSection = ({ title, count, items, getKey, getTo, getLabel, isLast }) => (
    <Box sx={{ mb: isLast ? 0 : 2.5 }}>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 1, color: NAVY }}>
        {title} ({count})
      </Typography>
      <List disablePadding>
        {items.map((item, idx) => (
          <ListItemButton
            key={getKey(item)}
            component={RouterLink}
            to={getTo(item)}
            disableGutters
            sx={{
              px: 1,
              py: 1,
              borderRadius: 1.5,
              borderBottom: idx === items.length - 1 ? "none" : "1px solid",
              borderColor: "divider",
              "&:hover": {
                bgcolor: "rgba(0, 127, 173, 0.06)",
              },
            }}
          >
            <ListItemText
              primary={getLabel(item)}
              primaryTypographyProps={{ fontSize: 14.5, fontWeight: 500, color: NAVY }}
            />
            <ChevronRightRoundedIcon sx={{ fontSize: 18, color: "text.disabled" }} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 1 }}>
        Search Results
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        for: "{query}"
      </Typography>

      {noResults && (
        <Typography color="text.secondary" sx={{ py: 4 }}>
          No matching results found. Try a different search term.
        </Typography>
      )}

      {!noResults && (
        <Grid container spacing={4} alignItems="flex-start">
          {/* Products column */}
          {products.length > 0 && (
            <Grid item size={{ xs: 12, md: hasSidebar ? 8 : 12 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: NAVY }}>
                Products ({products.length})
              </Typography>
              <Grid container spacing={2.5}>
                {products.map((product) => {
                  const image =
                    product.colors?.[0]?.mainImage || product.colors?.[0]?.images?.[0];

                  return (
                    <Grid
                      item
                      size={{ xs: 6, sm: hasSidebar ? 6 : 4, md: hasSidebar ? 4 : 3 }}
                      key={product.id}
                    >
                      <Card
                        elevation={0}
                        sx={{
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          border: 1,
                          borderColor: "divider",
                          borderRadius: 2,
                          overflow: "hidden",
                          bgcolor: "#fff",
                          transition: "transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease",
                          "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: "0 12px 24px rgba(0, 51, 73, 0.12)",
                            borderColor: BLUE,
                          },
                        }}
                      >
                        <CardActionArea
                          component={RouterLink}
                          to={`/product/${product.id}`}
                          sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "stretch",
                          }}
                        >
                          <Box
                            sx={{
                              position: "relative",
                              width: "100%",
                              pt: "100%",
                              bgcolor: "#f7f7f7",
                              borderBottom: 1,
                              borderColor: "divider",
                            }}
                          >
                            <CardMedia
                              component="img"
                              image={image}
                              alt={product.name}
                              sx={{
                                position: "absolute",
                                inset: 0,
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                              }}
                            />
                          </Box>
                          <CardContent sx={{ width: "100%", flexGrow: 1, p: 1.75 }}>
                            <Typography
                              variant="body2"
                              fontWeight={600}
                              sx={{
                                color: NAVY,
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                minHeight: "2.6em",
                                lineHeight: 1.3,
                              }}
                            >
                              {product.name}
                            </Typography>
                            <Typography variant="body2" fontWeight={700} sx={{ color: BLUE, mt: 0.5 }}>
                              ${product.price}
                            </Typography>
                          </CardContent>
                        </CardActionArea>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Grid>
          )}

          {/* Sidebar column: categories + pages */}
          {hasSidebar && (
            <Grid item size={{ xs: 12, md: products.length > 0 ? 4 : 12 }}>
              <Box
                sx={{
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 2,
                  p: 2.5,
                  bgcolor: "#fff",
                  position: { md: "sticky" },
                  top: { md: 16 },
                }}
              >
                {categories.length > 0 && (
                  <SidebarSection
                    title="Categories"
                    count={categories.length}
                    items={categories}
                    getKey={(c) => c.id}
                    getTo={(c) => `/products?category=${c.id}`}
                    getLabel={(c) => c.name}
                    isLast={pages.length === 0}
                  />
                )}

                {categories.length > 0 && pages.length > 0 && <Divider sx={{ mb: 2.5 }} />}

                {pages.length > 0 && (
                  <SidebarSection
                    title="Pages"
                    count={pages.length}
                    items={pages}
                    getKey={(p) => p.path}
                    getTo={(p) => p.path}
                    getLabel={(p) => p.title}
                    isLast
                  />
                )}
              </Box>
            </Grid>
          )}
        </Grid>
      )}
    </Container>
  );
}

export default SearchResults;