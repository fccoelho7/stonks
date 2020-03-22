import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { AuthProvider } from "./hooks/authProvider";
import Dashboard from "./pages/Dashboard";
import Balancing from "./pages/Balancing";

import "./App.css";

function App() {
  return (
    <AuthProvider>
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
    </AuthProvider>
  );
}

export default App;
