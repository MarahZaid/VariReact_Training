import React from 'react'
import SEO from '../../ui/SEO';
import HeroHome from '../../components/heroHome/HeroHome';
import ContactEmail from '../../components/contactEmail/ContactEmail';
import CategoriesSection from '../../components/categoriesSection/CategoriesSection';

function Home() {
  return (
    <>
      <SEO
        title="Home"
        description="Vari Site is an online store offering a wide range of quality products at great prices, with a fast and secure shopping experience."
        url="https://varireact-training.onrender.com/"
      />
      <HeroHome />
      <CategoriesSection />
      <ContactEmail/>
    </>
  )
}

export default Home;