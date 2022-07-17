import { Box, Button, Flex, Heading, Icon } from "@chakra-ui/react";
import { FaUserGraduate, FaHome, FaSignOutAlt } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

const LINKS = [
  { pathname: "/dashboard", icon: FaHome, label: "Home" },
  {
    pathname: "/dashboard/sorak-ria",
    icon: FaUserGraduate,
    label: "Sorak Ria",
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
      rowGap={4}
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
