import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

// import { AuthProvider } from "./hooks/authProvider";
import Dashboard from "./pages/Dashboard";
import Rebalancing from "./pages/Rebalancing";

import "./App.css";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/balanceamento">
          <Rebalancing />
        </Route>
        <Route path="/">
          <Dashboard />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
