import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";

function SEO() {
  const siteName = "Vari Site";
  const { title, description, url, type } = useSelector((state) => state.seo);

  const fullTitle = title ? `${title} | ${siteName}` : siteName;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
    </Helmet>
  );
}

export default SEO;