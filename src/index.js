import React from "react";
import ReactDOM from "react-dom";
import "assets/css/App.css";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import AuthLayout from "layouts/auth";
import AdminLayout from "layouts/admin";
import RTLLayout from "layouts/rtl";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "theme/theme";
import { ThemeEditorProvider } from "@hypertheme-editor/chakra-ui";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";
import ReactLoading from 'react-loading';


//changeReactDom.render to createRoot
ReactDOM.createRoot(document.getElementById("root")).render(
  <ChakraProvider theme={theme}>
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate loading={<ReactLoading type={"spin"} color={"#DB005B"} height={667} width={375} />} persistor={persistor}>
          <ThemeEditorProvider>
            <HashRouter>
              <Switch>
                <Route path={`/auth`} component={AuthLayout} />
                <Route path={`/admin`} component={AdminLayout} />
                <Route path={`/rtl`} component={RTLLayout} />
                <Redirect from='/' to='/admin' />
              </Switch>
            </HashRouter>
          </ThemeEditorProvider>
        </PersistGate>
      </Provider>
    </React.StrictMode>
  </ChakraProvider>

);

