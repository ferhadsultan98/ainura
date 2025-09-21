import React from "react";
import { BrowserRouter } from "react-router-dom";
import ScrollToButton from "./Components/QuickButtons/ScrollToButton/ScrollToButton"; // Importing ScrollToButton
import './App.css';
import RoutesConfig from "./Routes";
import WelcomeButton from "./Components/QuickButtons/WelcomeButton/WelcomeButton";

function App() {
  return (
    <BrowserRouter>
      <RoutesConfig />
      <ScrollToButton /> {/* Adding ScrollToButton at the app level */}
      <WelcomeButton/>
    </BrowserRouter>
  );
}

export default App;