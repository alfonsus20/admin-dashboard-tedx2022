import {
  Box, Button, Flex, Heading, Icon, VStack
} from '@chakra-ui/react';
import { MdOutlineShop, MdOutlineShopTwo } from 'react-icons/md';
import {
  FaUserGraduate,
  FaHome,
  FaSignOutAlt,
  FaRegHandshake,
} from 'react-icons/fa';
import { BsFillCalendarEventFill } from 'react-icons/bs';
import { Link, useLocation } from 'react-router-dom';
import { useUserContext } from '../context/UserContext';
import { useSidebarContext } from '../context/SidebarContext';

const LINKS = [
  { pathname: '/dashboard', icon: FaHome, label: 'Home' },
  {
    pathname: '/dashboard/merchandise',
    icon: MdOutlineShop,
    label: 'Merchandise',
  },
  {
    pathname: '/dashboard/bundle',
    icon: MdOutlineShopTwo,
    label: 'Bundle',
  },
  {
    pathname: '/dashboard/sponsor',
    icon: FaRegHandshake,
    label: 'Sponsor',
  },
  {
    pathname: '/dashboard/preevent',
    icon: BsFillCalendarEventFill,
    label: 'Pre Event',
  },
  {
    pathname: '/dashboard/sorak-ria',
    icon: FaUserGraduate,
    label: 'Sorak Ria',
  },
];

const Sidebar = () => {
  const { pathname } = useLocation();
  const { logout } = useUserContext();
  const { isOpened, closeSidebar } = useSidebarContext();

  return (
    <Flex
      as="aside"
      w={{ base: 'full', md: 80 }}
      bgColor="red.500"
      alignItems="strecth"
      flexDir="column"
      flexShrink={0}
      rowGap={4}
      className="h-screen"
      pos={{ base: 'fixed', md: 'sticky' }}
      top={0}
      zIndex={20}
      left={isOpened ? '0' : '-100%'}
      transition="0.5s ease"
    >
      <Heading
        color="white"
        fontSize="2xl"
        fontWeight="semibold"
        textAlign="center"
        pt={12}
      >
        Admin
        <br />
        Dashboard
      </Heading>
      <VStack my={6} alignItems="stretch">
        {LINKS.map((link, id) => (
          <Flex
            // eslint-disable-next-line react/no-array-index-key
            key={id}
            rounded="md"
            color="white"
            py={2}
            alignItems="center"
            fontSize="lg"
            _hover={{ shadow: 'md' }}
            cursor="pointer"
            as={Link}
            to={link.pathname}
            role="group"
            onClick={closeSidebar}
          >
            <Box
              bgColor={link.pathname === pathname ? 'white' : 'transparent'}
              w={1}
              h="full"
              mr={4}
              _groupHover={{ bgColor: 'white' }}
            />
            <Icon as={link.icon} mr={6} />
            <Box>{link.label}</Box>
          </Flex>
        ))}
      </VStack>
      <Button
        mt="auto"
        mb={8}
        mx={4}
        onClick={logout}
        minH={10}
        leftIcon={<Icon as={FaSignOutAlt} />}
      >
        Logout
      </Button>
    </Flex>
  );
};

export default Sidebar;
