import { Route, Switch } from "react-router-dom";
import React from "react";
import Admin from "./pages/Admin";
import Login from "./pages/Login";

export default function App() {
  return (
    <Switch>  {/* 只匹配一个路由 */}
      <Route path="/login" component={Login} />
      <Route path="/" component={Admin} />
    </Switch>
  );
}
