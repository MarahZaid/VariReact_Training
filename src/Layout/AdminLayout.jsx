import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/adminSidebar/AdminSidebar";

export default function AdminLayout() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* المنيو الجانبي */}
      <AdminSidebar />

      {/* محتوى الصفحة الحالية (Dashboard, Products, Orders...) */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, backgroundColor: "#f5f6f7" }}>
        <Outlet />
      </Box>
    </Box>
  );
}