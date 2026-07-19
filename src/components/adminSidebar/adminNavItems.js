import DashboardIcon from "@mui/icons-material/Dashboard";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import CategoryIcon from "@mui/icons-material/Category";
import ListAltIcon from "@mui/icons-material/ListAlt";
import BarChartIcon from "@mui/icons-material/BarChart";

const adminNavItems = [
  { label: "Analytics", icon: DashboardIcon, path: "/admin" },
  { label: "Products", icon: Inventory2Icon, path: "/admin/products" },
  { label: "Categories", icon: CategoryIcon, path: "/admin/categories" },
  { label: "Orders", icon: ListAltIcon, path: "/admin/orders" },
  { label: "Customers", icon: BarChartIcon, path: "/admin/customers" },
];

export default adminNavItems;