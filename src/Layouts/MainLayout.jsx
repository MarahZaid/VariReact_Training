import { Outlet, ScrollRestoration } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import SEO from "../ui/SEO";

export default function MainLayout() {
  return (
    <>
      <SEO />
      <ScrollRestoration />
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}