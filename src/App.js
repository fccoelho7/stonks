import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Balancing from "./pages/Balancing";

import "./App.css";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/balanceamento">
          <Balancing />
        </Route>
        <Route path="/">
          <Dashboard />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
