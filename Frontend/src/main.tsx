import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { GlobalContextProvider } from "./components/globalContext/golbalContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <GlobalContextProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </GlobalContextProvider>
);
