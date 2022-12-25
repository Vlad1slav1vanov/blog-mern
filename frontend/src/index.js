import React from "react";
import { BrowserRouter } from 'react-router-dom';
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import App from "./App";
import CssBaseline from "@mui/material/CssBaseline";

import "./index.scss";
import { Paper, ThemeProvider } from "@mui/material";
import { theme } from "./theme";
import store from "./redux/store";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <>
    <CssBaseline />
      <ThemeProvider theme={theme}>
        <Paper elevation={1}>
          <BrowserRouter>
            <Provider store={store}>
              <App />
            </Provider>
          </BrowserRouter>
        </Paper>
      </ThemeProvider>
  </>
);
