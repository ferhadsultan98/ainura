import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header/Header";
import "./Layout.scss";
import BottomSubmenu from "./BottomSubmenu/BottomSubmenu";
import Spacer from "../Components/Spacer/Spacer";

function Layout() {
  const location = useLocation();

  // İcazə verilən path-lər
  const allowedPaths = ["/", "/images", "/videos", "/favourites"];
  const isSimilarPage = location.pathname.startsWith("/similar");

  const showBottomSubmenu =
    allowedPaths.includes(location.pathname) || isSimilarPage;

  return (
    <div className="layout">
      <Header />
      <main className="layoutMain">
        <Outlet />
      </main>
      {showBottomSubmenu && <BottomSubmenu />}
    </div>
  );
}

export default Layout;
