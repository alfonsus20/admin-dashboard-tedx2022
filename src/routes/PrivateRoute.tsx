import { Box, Flex } from "@chakra-ui/react";
import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useUserContext } from "../context/UserContext";

const PrivateRoute = () => {
  const { isLoggedIn } = useUserContext();

  if (isLoggedIn) {
    return (
      <Flex minH="100vh" alignItems="stretch">
        <Sidebar />
        <Box flex="1 1 auto" pt={12} pb={8} px={6}>
          <Outlet />
        </Box>
      </Flex>
    );
  }

  return <Navigate to="/" />;
};

export default PrivateRoute;
