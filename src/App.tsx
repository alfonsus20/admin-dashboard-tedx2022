import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserStore } from "./context/UserContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Preevent from "./pages/Preevent";
import StudentSpeaker from "./pages/StudentSpeaker";
import StudentSpeakerDetail from "./pages/StudentSpeakerDetail";
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
              <Route path="/dashboard/sorak-ria" element={<StudentSpeaker />} />
              <Route
                path="/dashboard/sorak-ria/:id"
                element={<StudentSpeakerDetail />}
              />
              <Route path="/dashboard/preevent/" element={<Preevent />} />
            </Route>
          </Routes>
        </Router>
      </UserStore>
    </ChakraProvider>
  );
}

export default App;
