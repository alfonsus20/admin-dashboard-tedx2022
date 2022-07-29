import { Flex, Heading, Image } from "@chakra-ui/react";
import logo from "../assets/logo-tedx-hitam.svg";

const NotFound = () => {
  return (
    <Flex flexDir="column" alignItems="center" justifyContent="center" h="full">
      <Heading textAlign="center" mb={8} fontSize="5xl" color="red.500">
        Page Not Found
      </Heading>
    </Flex>
  );
};
export default NotFound;
