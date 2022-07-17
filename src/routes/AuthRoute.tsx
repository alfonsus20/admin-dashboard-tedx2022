import { Navigate, Outlet } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

const AuthRoute = () => {
  const { isLoggedIn } = useUserContext();

  if (isLoggedIn) {
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
};

export default AuthRoute;
