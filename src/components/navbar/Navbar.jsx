import React, { useRef, useState, useEffect, useMemo } from "react";
import styles from "./navbar.module.css";
import MiniCart from "./../miniCart/MiniCart";

import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import PublicIcon from "@mui/icons-material/Public";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Badge } from "@mui/material";

import variIcon from "../../assets/imgs/logo.svg"

import { Link as RouterLink } from "react-router-dom";
import useCategories from "../../hooks/useCategories";
import { fetchSearchIndex, filterProducts, filterCategories, filterPages } from "../../store/searchSlice";

import {
  AppBar,
  Toolbar,
  Box,
  Link,
  Typography,
  Container,
  IconButton,
  Stack,
  Button,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Divider,
  useMediaQuery,
  useTheme,
  Popper,
  Paper,
  Grow,
  ClickAwayListener,
  CircularProgress,
} from "@mui/material";

function Navbar() {

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };


  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartCount = useSelector((state) =>
    Object.values(state.cart.items).reduce((sum, item) => sum + item.quantity, 0)
  );
  const searchIndex = useSelector((state) => state.search.index);

  const { categories } = useCategories();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));


  const [miniCartAnchor, setMiniCartAnchor] = useState(null);
  const miniCartOpen = Boolean(miniCartAnchor);
  const miniCartCloseTimer = useRef(null);

  function handleCartMouseEnter(event) {
    if (isMobile) return;
    clearTimeout(miniCartCloseTimer.current);
    setMiniCartAnchor(event.currentTarget);
  }

  function handleCartMouseLeave() {
    if (isMobile) return;
    miniCartCloseTimer.current = setTimeout(() => setMiniCartAnchor(null), 150);
  }

  function handleCartClick(event) {
    if (isMobile) {
      setMiniCartAnchor((prev) => (prev ? null : event.currentTarget));
    } else {
      navigate("/cart");
    }
  }

  function closeMiniCart() {
    setMiniCartAnchor(null);
  }


  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsExpanded, setProductsExpanded] = useState(false);

  const openMobileMenu = () => setMobileMenuOpen(true);
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setProductsExpanded(false);
  };


  const { status, isAdmin } = useSelector((state) => state.auth);

  function handleAccountClick() {
    if (status === "unauthenticated") {
      navigate("/login");
    } else if (isAdmin) {
      navigate("/admin");
    } else {
      navigate("/account");
    }
  }

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const desktopSearchBoxRef = useRef(null);
  const mobileSearchBoxRef = useRef(null);

  // Debounce so we don't re-filter on every single keystroke.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedTerm(searchTerm.trim()), 250);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch (and cache) the products/categories index once, the first time
  // someone actually starts typing. After this, filtering is instant and
  // local — no extra Firebase reads per letter.
  useEffect(() => {
    if (debouncedTerm && searchIndex.status === "idle") {
      dispatch(fetchSearchIndex());
    }
  }, [debouncedTerm, searchIndex.status, dispatch]);

  const liveResults = useMemo(() => {
    const term = debouncedTerm.toLowerCase();
    if (!term) return { products: [], categories: [], pages: [] };
    return {
      products: filterProducts(searchIndex.products, term).slice(0, 5),
      categories: filterCategories(searchIndex.categories, term).slice(0, 4),
      pages: filterPages(term).slice(0, 4),
    };
  }, [debouncedTerm, searchIndex.products, searchIndex.categories]);

  const hasLiveResults =
    liveResults.products.length > 0 ||
    liveResults.categories.length > 0 ||
    liveResults.pages.length > 0;

  const isIndexLoading = searchIndex.status === "loading";
  const showDropdown = dropdownOpen && debouncedTerm.length > 0;

  function resetSearchInput() {
    setSearchTerm("");
    setDebouncedTerm("");
    setDropdownOpen(false);
  }

  function goToFullResults(term) {
    const trimmed = term.trim();
    if (!trimmed) return;
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    resetSearchInput();
    if (isMobile) closeMobileMenu();
  }

  function handleSearchSubmit(e) {
    if (e.key && e.key !== "Enter") return;
    goToFullResults(searchTerm);
  }

  function handleResultClick() {
    resetSearchInput();
    if (isMobile) closeMobileMenu();
  }

  return (
    <>

      <AppBar position="static" elevation={0} sx={{ bgcolor: "#003349" }}>
        <Toolbar
          sx={{
            py: { xs: 0.5, sm: 0 },
            px: 2,
            minHeight: { xs: "auto", sm: "36px" },
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "center",
            gap: { xs: 0.25, sm: 0 },
          }}
        >
          <Link
            href="#"
            underline="always"
            sx={{ fontSize: { xs: 11, sm: 14 }, color: "#fff", textDecorationColor: "#fff" }}
          >
            VARI DEAL DAYS
          </Link>

          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Link
              href="#"
              underline="always"
              sx={{ fontSize: { xs: 10, sm: 14 }, color: "#fff", textDecorationColor: "#fff" }}
            >
              FREE SHIPPING
            </Link>
            <Typography sx={{ color: "#fff", fontSize: { xs: 10, sm: 14 } }}>+</Typography>
            <Link
              href="#"
              underline="always"
              sx={{ fontSize: { xs: 10, sm: 14 }, color: "#fff", textDecorationColor: "#fff" }}
            >
              FREE RETURNS
            </Link>
          </Box>
        </Toolbar>
      </AppBar>

      <AppBar position="static" elevation={0} color="inherit" sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              px: { xs: 0, sm: 2 },
              minHeight: { xs: 64, md: 80 },
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 } }}>
              <IconButton
                onClick={openMobileMenu}
                sx={{ display: { xs: "flex", lg: "none" }, color: "#007fad" }}
              >
                <MenuIcon sx={{ fontSize: { xs: 28, sm: 35 } }} />
              </IconButton>

              <RouterLink to="/">
                <Box
                  component="img"
                  src={variIcon}
                  alt="Vari Logo"
                  sx={{ width: { xs: 65, sm: 100 } }}
                />
              </RouterLink>

            </Box>

            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", lg: "flex" },
                flexDirection: "column",
                ml: 5,
                gap: 1,
                pt: 1,
                pb: 2,
              }}
            >
              {/* Top Row */}
              <Box sx={{ width: "100%", display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                <Stack direction="row" spacing={3} alignItems="center">
                  <Button
                    color="inherit"
                    startIcon={<AccountCircleOutlinedIcon sx={{ color: "#007fad" }} />}
                    onClick={handleAccountClick}
                    sx={{ textTransform: "none", color: "black" }}
                  >
                    My Account
                  </Button>

                  <Button
                    color="inherit"
                    startIcon={<PublicIcon sx={{ color: "#007fad" }} />}
                    endIcon={<KeyboardArrowDownIcon />}
                    sx={{ textTransform: "none", color: "black" }}
                  >
                    United States
                  </Button>

                  <Typography fontWeight={600} sx={{ color: "black", display: "flex", alignItems: "center" }}>
                    +1 (800) 207-2587
                  </Typography>
                </Stack>
              </Box>

              {/* Bottom Row */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Stack direction="row" spacing={1}>
                  <Button
                    color="inherit"
                    endIcon={<KeyboardArrowDownIcon />}
                    onClick={handleOpenMenu}
                    sx={{ textTransform: "none" }}
                  >
                    Products
                  </Button>

                  <Button color="inherit" endIcon={<KeyboardArrowDownIcon />} sx={{ textTransform: "none" }}>
                    Collections
                  </Button>

                  <Button color="inherit" endIcon={<KeyboardArrowDownIcon />} sx={{ textTransform: "none" }}>
                    Workplace
                  </Button>

                  <Button color="inherit" endIcon={<KeyboardArrowDownIcon />} sx={{ textTransform: "none" }}>
                    Help
                  </Button>

                  <Button color="success" sx={{ textTransform: "none" }}>
                    Deals
                  </Button>
                </Stack>

                <Box ref={desktopSearchBoxRef} sx={{ position: "relative" }}>
                  <TextField
                    size="small"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleSearchSubmit}
                    onFocus={() => setDropdownOpen(true)}
                    autoComplete="off"
                    sx={{
                      width: 260,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 0,
                        "& fieldset": { borderColor: "#007fad", borderWidth: "2px" },
                        "&.Mui-focused fieldset": { borderColor: "#22aaff", borderWidth: "2.5px" },
                      },
                    }}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <SearchIcon
                              sx={{ color: "#007fad", cursor: "pointer" }}
                              onClick={() => handleSearchSubmit({})}
                            />
                          </InputAdornment>
                        ),
                      },
                    }}
                  />

                  <SearchDropdown
                    anchorEl={desktopSearchBoxRef.current}
                    open={showDropdown}
                    onClose={() => setDropdownOpen(false)}
                    term={debouncedTerm}
                    results={liveResults}
                    hasResults={hasLiveResults}
                    loading={isIndexLoading}
                    onResultClick={handleResultClick}
                    onSeeAll={() => goToFullResults(debouncedTerm)}
                  />
                </Box>
              </Box>
            </Box>


            <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
              {categories.map((category) => (
                <MenuItem
                  key={category.id}
                  component={RouterLink}
                  to={`/products?category=${category.id}`}
                  onClick={handleCloseMenu}
                >
                  {category.name}
                </MenuItem>
              ))}
            </Menu>

            <Box sx={{ display: "flex", alignItems: "center" }}>

              <IconButton
                onClick={handleCartClick}
                onMouseEnter={handleCartMouseEnter}
                onMouseLeave={handleCartMouseLeave}
                sx={{ pl: { xs: 1.5, sm: 4 }, display: "flex", alignItems: "center" }}
              >
                <Badge badgeContent={cartCount} color="error">
                  <ShoppingCartOutlinedIcon sx={{ color: "#007fad", fontSize: { xs: 26, sm: 35 } }} />
                </Badge>
              </IconButton>

              <MiniCart
                anchorEl={miniCartAnchor}
                open={miniCartOpen}
                onMouseEnter={handleCartMouseEnter}
                onMouseLeave={handleCartMouseLeave}
                onClose={closeMiniCart}
              />
            </Box>
          </Toolbar>
        </Container>
      </AppBar>


      <Drawer anchor="left" open={mobileMenuOpen} onClose={closeMobileMenu}>
        <Box sx={{ width: 280, pt: 1 }} role="presentation">
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", px: 2, py: 1 }}>
            <RouterLink to="/">
              <Box
                component="img"
                src={variIcon}
                alt="Vari Logo"
                sx={{ width: 80 }}
              />
            </RouterLink>
            <IconButton onClick={closeMobileMenu}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ px: 2, pb: 2 }} ref={mobileSearchBoxRef}>
            <TextField
              size="small"
              fullWidth
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearchSubmit}
              onFocus={() => setDropdownOpen(true)}
              autoComplete="off"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 0,
                  "& fieldset": { borderColor: "#007fad", borderWidth: "2px" },
                },
              }}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon
                        sx={{ color: "#007fad", cursor: "pointer" }}
                        onClick={() => handleSearchSubmit({})}
                      />
                    </InputAdornment>
                  ),
                },
              }}
            />

            {isMobile && showDropdown && (
              <Box sx={{ mt: 1 }}>
                <SearchResultsList
                  term={debouncedTerm}
                  results={liveResults}
                  hasResults={hasLiveResults}
                  loading={isIndexLoading}
                  onResultClick={handleResultClick}
                  onSeeAll={() => goToFullResults(debouncedTerm)}
                  compact
                />
              </Box>
            )}
          </Box>

          <Divider />

          <List>
            <ListItemButton onClick={() => setProductsExpanded((prev) => !prev)}>
              <ListItemText primary="Products" />
              {productsExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>

            <Collapse in={productsExpanded} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {categories.map((category) => (
                  <ListItemButton
                    key={category.id}
                    component={RouterLink}
                    to={`/products?category=${category.id}`}
                    onClick={closeMobileMenu}
                    sx={{ pl: 4 }}
                  >
                    <ListItemText primary={category.name} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>

            <ListItemButton>
              <ListItemText primary="Collections" />
            </ListItemButton>

            <ListItemButton>
              <ListItemText primary="Workplace" />
            </ListItemButton>

            <ListItemButton>
              <ListItemText primary="Help" />
            </ListItemButton>

            <ListItemButton>
              <ListItemText primary="Deals" sx={{ color: "success.main" }} />
            </ListItemButton>
          </List>

          <Divider />

          <List>
            <ListItemButton onClick={() => { handleAccountClick(); closeMobileMenu(); }}>
              <AccountCircleOutlinedIcon sx={{ color: "#007fad", mr: 1.5 }} />
              <ListItemText primary="My Account" />
            </ListItemButton>

            <ListItemButton>
              <PublicIcon sx={{ color: "#007fad", mr: 1.5 }} />
              <ListItemText primary="United States" />
            </ListItemButton>

            <Box sx={{ px: 2, py: 1 }}>
              <Typography fontWeight={600}>+1 (800) 207-2587</Typography>
            </Box>
          </List>
        </Box>
      </Drawer>
    </>
  );
}

// Shared content of the live-search results (used both inside the desktop
// popper and inline inside the mobile drawer).
function SearchResultsList({ term, results, hasResults, loading, onResultClick, onSeeAll, compact }) {
  if (loading) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, px: 2, py: 2 }}>
        <CircularProgress size={18} sx={{ color: "#007fad" }} />
        <Typography variant="body2" color="text.secondary">
          Searching...
        </Typography>
      </Box>
    );
  }

  if (!hasResults) {
    return (
      <Box sx={{ px: 2, py: 2 }}>
        <Typography variant="body2" color="text.secondary">
          No results for "{term}"
        </Typography>
      </Box>
    );
  }

  return (
    <>
      {results.products.length > 0 && (
        <List dense disablePadding subheader={<SectionLabel>Products</SectionLabel>}>
          {results.products.map((product) => {
            const image = product.colors?.[0]?.mainImage || product.colors?.[0]?.images?.[0];
            return (
              <ListItemButton
                key={product.id}
                component={RouterLink}
                to={`/product/${product.id}`}
                onClick={onResultClick}
                sx={{ gap: 1.5 }}
              >
                <Box
                  component="img"
                  src={image}
                  alt=""
                  sx={{
                    width: 36,
                    height: 36,
                    objectFit: "contain",
                    bgcolor: "#f7f7f7",
                    border: 1,
                    borderColor: "divider",
                    flexShrink: 0,
                  }}
                />
                <ListItemText
                  primary={product.name}
                  secondary={product.price != null ? `$${product.price}` : null}
                  primaryTypographyProps={{ noWrap: true, variant: "body2" }}
                  secondaryTypographyProps={{ sx: { color: "#007fad" } }}
                />
              </ListItemButton>
            );
          })}
        </List>
      )}

      {results.categories.length > 0 && (
        <List dense disablePadding subheader={<SectionLabel>Categories</SectionLabel>}>
          {results.categories.map((category) => (
            <ListItemButton
              key={category.id}
              component={RouterLink}
              to={`/products?category=${category.id}`}
              onClick={onResultClick}
              sx={{ gap: 1.5 }}
            >
              <CategoryOutlinedIcon sx={{ color: "#007fad", fontSize: 20 }} />
              <ListItemText primary={category.name} primaryTypographyProps={{ variant: "body2" }} />
            </ListItemButton>
          ))}
        </List>
      )}

      {results.pages.length > 0 && (
        <List dense disablePadding subheader={<SectionLabel>Pages</SectionLabel>}>
          {results.pages.map((page) => (
            <ListItemButton
              key={page.path}
              component={RouterLink}
              to={page.path}
              onClick={onResultClick}
              sx={{ gap: 1.5 }}
            >
              <ArticleOutlinedIcon sx={{ color: "#007fad", fontSize: 20 }} />
              <ListItemText primary={page.title} primaryTypographyProps={{ variant: "body2" }} />
            </ListItemButton>
          ))}
        </List>
      )}

      <Divider />
      <ListItemButton onClick={onSeeAll} sx={{ justifyContent: "center" }}>
        <Typography variant="body2" fontWeight={600} sx={{ color: "#007fad" }}>
          See all results for "{term}"
        </Typography>
      </ListItemButton>
    </>
  );
}

function SectionLabel({ children }) {
  return (
    <Typography
      variant="caption"
      sx={{ px: 2, pt: 1.5, pb: 0.5, display: "block", color: "text.secondary", fontWeight: 600 }}
    >
      {children}
    </Typography>
  );
}

// Desktop-only floating dropdown, anchored under the search field.
function SearchDropdown({ anchorEl, open, onClose, term, results, hasResults, loading, onResultClick, onSeeAll }) {
  if (!anchorEl) return null;

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="bottom-start"
      transition
      style={{ width: anchorEl.clientWidth, zIndex: 1300 }}
    >
      {({ TransitionProps }) => (
        <Grow {...TransitionProps} timeout={150}>
          <Paper elevation={4} sx={{ mt: 0.5, maxHeight: 420, overflowY: "auto" }}>
            <ClickAwayListener onClickAway={onClose}>
              <Box>
                <SearchResultsList
                  term={term}
                  results={results}
                  hasResults={hasResults}
                  loading={loading}
                  onResultClick={onResultClick}
                  onSeeAll={onSeeAll}
                />
              </Box>
            </ClickAwayListener>
          </Paper>
        </Grow>
      )}
    </Popper>
  );
}

export default Navbar;