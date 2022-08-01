import { Flex, Heading } from '@chakra-ui/react';

const NotFound = () => (
  <Flex flexDir="column" alignItems="center" justifyContent="center" h="full">
    <Heading textAlign="center" mb={8} fontSize="5xl" color="red.500">
      Page Not Found
    </Heading>
  </Flex>
);
export default NotFound;
