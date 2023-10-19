import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./reset.css";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter
    basename={
      import.meta.env.BASE_URL /* use the base url set in vite.config.ts */
    }
  >
    <App />
  </BrowserRouter>
);
