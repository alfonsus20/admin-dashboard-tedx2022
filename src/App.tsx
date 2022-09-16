import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SidebarStore } from './context/SidebarContext';
import { UserStore } from './context/UserContext';
import BundleForm from './pages/BundleForm';
import BundleList from './pages/BundleList';
import Home from './pages/Home';
import Login from './pages/Login';
import MainEvent from './pages/MainEvent';
import MerchandiseForm from './pages/MerchandiseForm';
import MerchandiseList from './pages/MerchandiseList';
import NotFound from './pages/NotFound';
import Preevent from './pages/Preevent';
import SponsorForm from './pages/SponsorForm';
import SponsorList from './pages/SponsorList';
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
    <SidebarStore>
      <UserStore>
        <Router>
          <Routes>
            <Route element={<AuthRoute />}>
              <Route path="/" element={<Login />} />
            </Route>
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<Home />} />
              <Route path="/dashboard/main-event" element={<MainEvent />} />
              <Route path="/dashboard/sorak-ria" element={<StudentSpeaker />} />
              <Route
                path="/dashboard/sorak-ria/:id"
                element={<StudentSpeakerDetail />}
              />
              <Route path="/dashboard/preevent" element={<Preevent />} />
              <Route
                path="/dashboard/merchandise"
                element={<MerchandiseList />}
              />
              <Route
                path="/dashboard/merchandise/:id/edit"
                element={<MerchandiseForm />}
              />
              <Route
                path="/dashboard/merchandise/add"
                element={<MerchandiseForm />}
              />
              <Route path="/dashboard/bundle" element={<BundleList />} />
              <Route
                path="/dashboard/bundle/:id/edit"
                element={<BundleForm />}
              />
              <Route path="/dashboard/bundle/add" element={<BundleForm />} />
              <Route path="/dashboard/sponsor" element={<SponsorList />} />
              <Route path="/dashboard/sponsor/add" element={<SponsorForm />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </UserStore>
    </SidebarStore>
  </ChakraProvider>
);

export default App;
