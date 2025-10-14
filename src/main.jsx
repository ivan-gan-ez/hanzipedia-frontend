import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import "./index.css";
import App from "./App.jsx";

const theme = createTheme({
  palette: {
    blue: {
      main: "#0d6fd7",
      light: "#7dbcffff",
      dark: "#084484ff",
      contrastText: "#ffffff",
    },
    white: {
      main: "#ffffff",
      light: "#ffffff",
      dark: "#d0d0d0ff",
      contrastText: "#000000",
    },
    red: {
      main: "#d70d0d",
      light: "#fe6565ff",
      dark: "#830f0fff",
      contrastText: "#ffffff",
    },
  },
});

createRoot(document.getElementById("root")).render(
  <ThemeProvider theme={theme}>
    <StrictMode>
      <App />
    </StrictMode>
  </ThemeProvider>
);
