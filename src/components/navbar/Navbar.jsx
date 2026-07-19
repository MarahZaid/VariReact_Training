import React, { useState } from "react";
import styles from "./navbar.module.css";

import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import PublicIcon from "@mui/icons-material/Public";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Badge } from "@mui/material";

import variIcon from "../../assets/imgs/logo.svg"

import { Link as RouterLink } from "react-router-dom";
import useCategories from "../../hooks/useCategories";

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
  const cartCount = useSelector((state) =>
  Object.values(state.cart.items).reduce((sum, item) => sum + item.quantity, 0)
);

  const { categories } = useCategories();


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
      navigate("/account"); // بروفايل المستخدم، لسا ما عملتها
    }
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

                <TextField
                  size="small"
                  placeholder="Search"
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
                          <SearchIcon sx={{ color: "#007fad" }} />
                        </InputAdornment>
                      ),
                    },
                  }}
                />
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
              <IconButton sx={{ display: { xs: "flex", lg: "none" } }}>
                <SearchIcon sx={{ color: "#007fad", fontSize: { xs: 26, sm: 35 } }} />
              </IconButton>
              <IconButton
                onClick={() => navigate("/cart")}
                sx={{ pl: { xs: 1.5, sm: 4 }, display: "flex", alignItems: "center" }}
              >
                <Badge badgeContent={cartCount} color="error">
                  <ShoppingCartOutlinedIcon sx={{ color: "#007fad", fontSize: { xs: 26, sm: 35 } }} />
                </Badge>
              </IconButton>
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

          <Box sx={{ px: 2, pb: 2 }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Search"
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
                      <SearchIcon sx={{ color: "#007fad" }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
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

export default Navbar;