import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import MentalHealthPredictor from "./webpage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MentalHealthPredictor />
  </StrictMode>
);