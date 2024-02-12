import { fetchUserData } from "/api/auth";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import AuthLayout from "/layouts/auth";
import AdminLayout from "/layouts/admin";

export default function App() {
  const auth = useSelector((state) => state.auth);
  useEffect(() => {
    if (auth.isAuthenticated) fetchUserData(auth.user);
    //check fetchUserData every half hour
    setInterval(() => {
      if (auth.isAuthenticated) fetchUserData(auth.user);
    }, 1800000);
  }, [auth.isAuthenticated]);
  return (
    <HashRouter>
      <Switch>
        <Route path={`/auth`} component={AuthLayout} />
        <Route path={`/admin`} component={AdminLayout} />
        <Redirect from="/" to="/admin" />
      </Switch>
    </HashRouter>
  );
}
