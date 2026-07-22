import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setSEO } from "../../store/seoSlice";
import HeroHome from "../../components/heroHome/HeroHome";
import ContactEmail from "../../components/contactEmail/ContactEmail";
import CategoriesSection from "../../components/categoriesSection/CategoriesSection";

function Home() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setSEO({
        title: "Home",
        description:
          "Vari Site is an online store offering a wide range of quality products at great prices, with a fast and secure shopping experience.",
        url: "https://varireact-training.onrender.com/",
        type: "website",
      })
    );
  }, [dispatch]);

  return (
    <>
      <HeroHome />
      <CategoriesSection />
      <ContactEmail />
    </>
  );
}

export default Home;