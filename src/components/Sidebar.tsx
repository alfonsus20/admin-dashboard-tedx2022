import { Box, Button, Flex, Heading, Icon, IconButton } from "@chakra-ui/react";
import { GiHamburgerMenu } from "react-icons/gi";
import { ImCross } from "react-icons/im";
import { FaUserGraduate, FaHome, FaSignOutAlt } from "react-icons/fa";
import { BsFillCalendarEventFill } from "react-icons/bs";
import { Link, useLocation } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { useState } from "react";

const LINKS = [
  { pathname: "/dashboard", icon: FaHome, label: "Home" },
  {
    pathname: "/dashboard/sorak-ria",
    icon: FaUserGraduate,
    label: "Sorak Ria",
  },
  {
    pathname: "/dashboard/preevent",
    icon: BsFillCalendarEventFill,
    label: "Pre Event",
  },
];

const Sidebar = () => {
  const { pathname } = useLocation();
  const { logout } = useUserContext();
  const [isOpened, setIsOpened] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsOpened((prev) => !prev);
  };

  return (
    <>
      <IconButton
        icon={<Icon as={GiHamburgerMenu} fontSize={16} m={4} />}
        aria-label="hamburger"
        colorScheme="red"
        pos="absolute"
        onClick={toggleSidebar}
      />
      <Flex
        as="aside"
        w={{ base: "full", md: 80 }}
        bgColor="red.500"
        alignItems="strecth"
        flexDir="column"
        flexShrink={0}
        rowGap={4}
        minH="100vh"
        pos={{ base: "fixed", md: "sticky" }}
        top={0}
        zIndex={20}
        left={isOpened ? "0" : "-100%"}
        transition="0.5s ease"
      >
        <IconButton
          icon={<Icon as={ImCross} fontSize={16} m={4} color="white" />}
          aria-label="cross"
          bg="transparent"
          pos="absolute"
          onClick={toggleSidebar}
          display={{ base: "block", md: "none" }}
        />
        <Heading
          color="white"
          fontSize="2xl"
          fontWeight="semibold"
          textAlign="center"
          pt={12}
          pb={6}
        >
          Admin
          <br />
          Dashboard
        </Heading>
        {LINKS.map((link, id) => (
          <Flex
            key={id}
            rounded="md"
            color="white"
            py={2}
            alignItems="center"
            fontSize="lg"
            _hover={{ shadow: "md" }}
            cursor="pointer"
            as={Link}
            to={link.pathname}
            role="group"
            onClick={toggleSidebar}
          >
            <Box
              bgColor={link.pathname === pathname ? "white" : "transparent"}
              w={1}
              h="full"
              mr={4}
              _groupHover={{ bgColor: "white" }}
            />
            <Icon as={link.icon} mr={6} />
            <Box>{link.label}</Box>
          </Flex>
        ))}
        <Button
          mt="auto"
          mb={8}
          mx={4}
          onClick={logout}
          leftIcon={<Icon as={FaSignOutAlt} />}
        >
          Logout
        </Button>
      </Flex>
    </>
  );
};
export default Sidebar;
