import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Layout from "./Layout/Layout";
import HomePage from "./Components/HomePage/HomePage";
import FavouriteItems from "./Pages/FavouriteItems/FavouriteItems";
import SimilarPage from "./Pages/SimilarPage/SimilarPage";
import About from "./Pages/About/About";
import CreatePage from "./Pages/CreatePage/CreatePage";
import SearchPage from "./Pages/SearchPage/SearchPage";
import FAQ from "./Pages/FAQ/FAQPage";
import Contact from "./Pages/Contact/ContactPage";


function RoutesConfig() {
  const location = useLocation();

  // Smooth scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage activeTab="images" />} />
        <Route path="images" element={<HomePage activeTab="images" />} />
        <Route path="videos" element={<HomePage activeTab="videos" />} />
        <Route path="search" element={<SearchPage />} /> {/* ⭐ New route */}
        <Route path="favourites" element={<FavouriteItems />} />
        <Route path="similar/:type/:id" element={<SimilarPage />} />
        <Route path="about" element={<About />} />
        <Route path="create" element={<CreatePage />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="contact" element={<Contact />} />
      </Route>
    </Routes>
  );
}

export default RoutesConfig;
