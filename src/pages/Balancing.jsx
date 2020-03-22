import React from "react";

import Layout from "../components/Layout";
import useAuth from "../hooks/useAuth";

function App() {
  const [user, logout] = useAuth();

  if (!user) {
    console.log(user?.user_metadata?.full_name);
    return null;
  }

  return (
    <Layout>
      <h2>Balanceamento</h2>
      <button onClick={logout}>Sair</button>
    </Layout>
  );
}

export default App;
