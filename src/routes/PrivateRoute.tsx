import { Box, Flex } from '@chakra-ui/react';
import HamburgerMenu from 'react-hamburger-menu';
import { Navigate, Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useSidebarContext } from '../context/SidebarContext';
import { useUserContext } from '../context/UserContext';

const PrivateRoute = () => {
  const { isLoggedIn } = useUserContext();
  const { isOpened, openSidebar, closeSidebar } = useSidebarContext();

  if (isLoggedIn) {
    return (
      <Flex minH="100vh" alignItems="stretch">
        <Sidebar />
        <Box
          flex="1 1 auto"
          pt={12}
          pb={8}
          px={6}
          overflowX="auto"
          pos="relative"
        >
          <Outlet />
          <Box
            pos="absolute"
            top={6}
            right={6}
            zIndex={30}
            display={{ base: 'block', md: 'none' }}
          >
            <HamburgerMenu
              isOpen={isOpened}
              menuClicked={isOpened ? closeSidebar : openSidebar}
              width={18}
              height={15}
              strokeWidth={2}
              rotate={0}
              color={isOpened ? 'white' : 'black'}
              borderRadius={2}
              animationDuration={0.5}
            />
          </Box>
        </Box>
      </Flex>
    );
  }

  return <Navigate to="/" />;
};

export default PrivateRoute;
