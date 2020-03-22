import { useContext } from "react";

import { AuthContext } from "./authProvider";

const useAuth = () => {
  const [user, logout] = useContext(AuthContext);
  return [user, logout];
};

export default useAuth;
