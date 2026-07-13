import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Drawer, Box, Typography, IconButton, Avatar, Divider } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LogoutIcon from "@mui/icons-material/Logout";
import variIcon from "../../assets/imgs/logo.svg";
import adminNavItems from "./adminNavItems";


const OPEN_WIDTH = 260;
const CLOSED_WIDTH = 90;

const SIDEBAR_BG = "#04374f";
const ACCENT = "#22aaff";

export default function AdminSidebar() {
    const [open, setOpen] = useState(true);

    function toggleSidebar() {
        setOpen((prevOpen) => !prevOpen);
    }

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: open ? OPEN_WIDTH : CLOSED_WIDTH,
                transition: "width 0.3s ease",
                "& .MuiDrawer-paper": {
                    width: open ? OPEN_WIDTH : CLOSED_WIDTH,
                    overflowX: "hidden",
                    transition: "width 0.3s ease",
                    backgroundColor: SIDEBAR_BG,
                    color: "white",
                    display: "flex",
                    flexDirection: "column",
                    border: "none",
                },
            }}
        >
            {/* open/close button */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1.5, pb: 2 }}>
                <IconButton
                    onClick={toggleSidebar}
                    size="small"
                    sx={{
                        color: "rgba(255,255,255,0.6)", "&:hover": { color: "white", backgroundColor: "rgba(255,255,255,0.08)" },
                    }}
                >
                    {open ? <ChevronLeftIcon fontSize="small" /> : <ChevronRightIcon fontSize="small" />}
                </IconButton>
            </Box>

            {/* vari icon*/}
            <Box
                sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", px: 2, pb: 2, }}>
                <Box
                    component="img"
                    src={variIcon}
                    alt="Vari Logo"
                    sx={{
                        width: open ? 80 : 50,
                        filter: "brightness(0) invert(1)",
                    }}
                />
            </Box>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.13)", my: 2 }} />

            {/* Menu */}
            <Box sx={{ flexGrow: 1, overflowY: "auto", px: open ? 1.5 : 1 }}>
                {adminNavItems.map((item) => {
                    const ItemIcon = item.icon;

                    return (
                        <Box
                            key={item.path}
                            component={NavLink}
                            to={item.path}
                            end={item.path === "/admin"}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.5,
                                textDecoration: "none",
                                color: "rgba(255,255,255,0.75)",
                                borderRadius: "14px",
                                px: open ? 2 : 1,
                                py: open ? 1.5 : 1,
                                mb: 1,
                                justifyContent: open ? "flex-start" : "center",
                                transition: "background-color 0.2s ease",
                                "&:hover": { backgroundColor: "rgba(255,255,255,0.06)" },
                                "&.active": {
                                    backgroundColor: "rgba(34,170,255,0.16)",
                                    color: "white",
                                },
                            }}
                        >
                            <Box
                                sx={{
                                    width: 34,
                                    height: 34,
                                    minWidth: 34,
                                    borderRadius: "10px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: "rgba(255,255,255,0.08)",
                                }}
                            >
                                <ItemIcon sx={{ fontSize: 19 }} />
                            </Box>

                            {open && (
                                <Typography sx={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.8)", }}>
                                    {item.label}
                                </Typography>
                            )}
                        </Box>
                    );
                })}
            </Box>

          

            {/* Admin + Logout*/}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: open ? "space-between" : "center",
                    backgroundColor: "rgba(255,255,255,0.05)",
                    borderRadius: "14px",
                    p: 1.5,
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, }} >
                    <Avatar sx={{ width: 38, height: 38, bgcolor: ACCENT, color: "#04374f", fontWeight: 700, }}>A</Avatar>

                    {open && (
                        <Box sx={{ overflow: "hidden" }}>
                            <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#fff", }}>
                                Admin
                            </Typography>
                            <Typography sx={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.6)", }}>
                                Site Administrator
                            </Typography>
                        </Box>
                    )}
                </Box>

                {open && (
                    <IconButton
                        onClick={() => console.log("Logout")}
                        sx={{
                            color: "rgba(255,255,255,0.8)", width: 36, height: 36,
                            "&:hover": {
                                bgcolor: "rgba(255,255,255,0.08)",
                                color: "#fff",
                            },
                        }}
                    >
                        <LogoutIcon fontSize="small" />
                    </IconButton>
                )}
            </Box>
        </Drawer>
    );
}