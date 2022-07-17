import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserStore } from "./context/UserContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SorakRia from "./pages/SorakRia";
import AuthRoute from "./routes/AuthRoute";
import PrivateRoute from "./routes/PrivateRoute";

const theme = extendTheme({
  fonts: {
    heading: `"Poppins", sans-serif`,
    body: `"Poppins", sans-serif`,
  },
});

function App() {
  return (
    <ChakraProvider theme={theme}>
      <UserStore>
        <Router>
          <Routes>
            <Route element={<AuthRoute />}>
              <Route path="/" element={<Login />} />
            </Route>
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Home />} />
              <Route path="/dashboard/sorak-ria" element={<SorakRia />} />
            </Route>
          </Routes>
        </Router>
      </UserStore>
    </ChakraProvider>
  );
}

export default App;
