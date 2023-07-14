import React from "react";
import { createRoot } from "react-dom/client";
import "assets/css/App.css";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import AuthLayout from "layouts/auth";
import AdminLayout from "layouts/admin";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "theme/theme";
import { ThemeEditorProvider } from "@hypertheme-editor/chakra-ui";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";
import ReactLoading from "react-loading";
import { LoadingProvider } from "contexts/LoadingContext.js";
import LoadingOverlay from "components/loading/LoadingOverlay.js";

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
              <HashRouter>
                <Switch>
                  <Route path={`/auth`} component={AuthLayout} />
                  <Route path={`/admin`} component={AdminLayout} />
                  <Redirect from="/" to="/admin" />
                </Switch>
              </HashRouter>
            </ThemeEditorProvider>
          </PersistGate>
          <LoadingOverlay />
        </LoadingProvider>
      </Provider>
    </React.StrictMode>
  </ChakraProvider>
);
