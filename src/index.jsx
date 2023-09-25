import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./assets/css/App.css";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "/theme/theme";
import { ThemeEditorProvider } from "@hypertheme-editor/chakra-ui";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";
import ReactLoading from "react-loading";
import { LoadingProvider } from "/contexts/LoadingContext";
import LoadingOverlay from "/components/loading/LoadingOverlay";
import App from "./App.jsx";
const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(
  <ChakraProvider theme={theme}>
    <React.StrictMode>
      <Provider store={store}>
        <LoadingProvider>
          <PersistGate
            loading={
              <ReactLoading
                type={"spin"}
                color={"#DB005B"}
                height={667}
                width={375}
              />
            }
            persistor={persistor}
          >
            <ThemeEditorProvider>
              <App />
            </ThemeEditorProvider>
          </PersistGate>
          <LoadingOverlay />
        </LoadingProvider>
      </Provider>
    </React.StrictMode>
  </ChakraProvider>
);
