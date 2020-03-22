import React, { useState, useEffect } from "react";
import auth from "netlify-identity-widget";

export const AuthContext = React.createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  auth.init();

  auth.on("login", user => setUser(user));
  auth.on("logout", () => setUser(null));

  useEffect(() => {
    const user = auth.currentUser();

    if (user) {
      setUser(user);
    } else {
      auth.open();
    }
  }, [user]);

  const { logout } = auth;

  return <AuthContext.Provider value={[user, logout]}>{children}</AuthContext.Provider>;
};
