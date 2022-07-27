import { Box, Button, Flex, Heading, Icon } from "@chakra-ui/react";
import { FaUserGraduate, FaHome, FaSignOutAlt } from "react-icons/fa";
import { BsFillCalendarEventFill } from "react-icons/bs";
import { Link, useLocation } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

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

  return (
    <Flex
      as="aside"
      w={80}
      bgColor="red.500"
      alignItems="strecth"
      flexDir="column"
      flexShrink={0}
      rowGap={4}
      maxH="100vh"
      pos="sticky"
      top={0}
    >
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
  );
};
export default Sidebar;
