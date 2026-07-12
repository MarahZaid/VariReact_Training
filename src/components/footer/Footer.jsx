import { Box, Container, Typography, Link, Stack, IconButton, Grid } from "@mui/material";

import HelpOutlineIcon from "@mui/icons-material/HelpOutlineOutlined";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import PinterestIcon from "@mui/icons-material/Pinterest";
import RedditIcon from "@mui/icons-material/Reddit";
import YouTubeIcon from "@mui/icons-material/YouTube";

import logo from "../../assets/imgs/logo.svg";
import bbb from "../../assets/imgs/bbb.png";

import { Link as RouterLink } from "react-router-dom";

const footerLinks = {
  PRODUCTS: [
    "Sit-Stand Solutions",
    "VariDesk Converters",
    "Desks and Tables",
    "Seating",
    "Storage",
    "Partitions and Privacy",
    "Accessories",
    "Shop by Space",
    "Deals",
    "View All Products",
  ],

  ABOUT: [
    "Our Company",
    "The Vari Difference",
    "Corporate Programs",
    "Industries",
    "Showroom Tours",
    "Careers",
  ],

  SUPPORT: [
    "Shipping Policy",
    "Warranty",
    "Returns",
    "Recall Notices",
    "My Account",
    "FAQs",
    "Contact Us",
  ],

  RESOURCES: [
    "Resource Center",
    "Buyer's Guide",
    "Reviews",
    "Space Planning",
    "VariSpace",
    "Vari Business Login",
    "View My List",
    "Desk Designer",
  ],
};

const PRIMARY_COLOR = "#007fad";

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: "#fff", pt: { xs: 4, md: 7 }, pb: 6 }}>
      <Container maxWidth="xl">
        <Grid container spacing={{ xs: 3, sm: 4, lg: 3 }} sx={{ rowGap:5}}>
          {/* Mobile Logo */}
          <Grid size={{ xs: 12 }} sx={{ display: { lg: "none" } }}>
            <RouterLink to="/">
              <Box
                component="img"
                src={logo}
                alt="Vari Logo"
                sx={{ width: 120, cursor: "pointer" }}
              />
            </RouterLink>
          </Grid>

          {/* Desktop Logo */}
          <Grid size={{ lg: 1.5 }} sx={{ display: { xs: "none", lg: "block" } }}>
            <RouterLink to="/">
              <Box
                component="img"
                src={logo}
                alt="Vari Logo"
                sx={{ width: 90, cursor: "pointer" }}
              />
            </RouterLink>
          </Grid>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <Grid size={{ xs: 6, sm: 4, lg: 1.75 }}key={title}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, mb: 2, letterSpacing: 1, color: PRIMARY_COLOR }}
              >
                {title}
              </Typography>

              <Stack spacing={1.2}>
                {links.map((link) => (
                  <Link
                    key={link}
                    href="#"
                    underline="none"
                    sx={{
                      fontSize: "15px",
                      color: "#4d4d4d",
                      transition: "0.3s",
                      "&:hover": {
                        color: PRIMARY_COLOR,
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {link}
                  </Link>
                ))}
              </Stack>
            </Grid>
          ))}

          {/* Help Section */}
          <Grid size={{ xs: 12, sm: 8, lg: 3.5 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Stack direction="row" spacing={1} alignItems="center">
                <HelpOutlineIcon sx={{ color: PRIMARY_COLOR }} />

                <Typography variant="h6" sx={{ fontWeight: 700, color: PRIMARY_COLOR }}>
                  NEED HELP?
                </Typography>
              </Stack>

              <Typography>
                Call{" "}
                <Link
                  href="#"
                  underline="hover"
                  fontWeight={600}
                  sx={{
                    color: PRIMARY_COLOR,
                    "&:hover": { color: PRIMARY_COLOR, textDecoration: "underline" },
                  }}
                >
                  +1 (800) 207-2587
                </Link>{" "}
                or{" "}
                <Link
                  href="#"
                  underline="hover"
                  fontWeight={600}
                  sx={{
                    color: PRIMARY_COLOR,
                    "&:hover": { color: PRIMARY_COLOR, textDecoration: "underline" },
                  }}
                >
                  CONTACT US
                </Link>
              </Typography>

              {/* Social */}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1.5, color: PRIMARY_COLOR }}>
                  CONNECT WITH US
                </Typography>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }} className="social-section">
                  {[FacebookIcon, InstagramIcon, LinkedInIcon, PinterestIcon, RedditIcon, YouTubeIcon].map(
                    (Icon, index) => (
                      <IconButton
                        key={index}
                        sx={{
                          bgcolor: "#fff",
                          border: `1px solid ${PRIMARY_COLOR}`,
                          width: 45,
                          height: 45,
                          borderRadius: "50%",
                          color: PRIMARY_COLOR,
                          "&:hover": {
                            bgcolor: PRIMARY_COLOR,
                            color: "#fff",
                          },
                        }}
                      >
                        <Icon sx={{ color: "inherit" }} />
                      </IconButton>
                    )
                  )}
                </Box>
              </Box>

              <Box
                component="img"
                src={bbb}
                alt="BBB Logo"
                sx={{ width: 200, maxWidth: "100%", objectFit: "contain" }}
              />
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Footer */}
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <Typography variant="body2">
            ©2025-2020 Varidesk, LLC dba Vari®. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}