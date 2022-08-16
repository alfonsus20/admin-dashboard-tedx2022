import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserStore } from './context/UserContext';
import Home from './pages/Home';
import Login from './pages/Login';
import MerchandiseForm from './pages/MerchandiseForm';
import MerchandiseList from './pages/MerchandiseList';
import NotFound from './pages/NotFound';
import Preevent from './pages/Preevent';
import StudentSpeaker from './pages/StudentSpeaker';
import StudentSpeakerDetail from './pages/StudentSpeakerDetail';
import AuthRoute from './routes/AuthRoute';
import PrivateRoute from './routes/PrivateRoute';

const theme = extendTheme({
  fonts: {
    heading: 'Poppins, sans-serif',
    body: 'Poppins, sans-serif',
  },
});

const App = () => (
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
            <Route path="/dashboard/preevent" element={<Preevent />} />
            <Route path="/dashboard/merchandise" element={<MerchandiseList />} />
            <Route path="/dashboard/merchandise/:id/edit" element={<MerchandiseForm />} />
            <Route path="/dashboard/merchandise/add" element={<MerchandiseForm />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </UserStore>
  </ChakraProvider>
);

export default App;
