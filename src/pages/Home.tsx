import { Flex, Heading, Image } from '@chakra-ui/react';
import logo from '../assets/logo-tedx-hitam.svg';

const Home = () => (
  <Flex flexDir="column" alignItems="center" justifyContent="center" h="full">
    <Heading textAlign="center" mb={8} fontSize="5xl" color="red.500">Welcome To Tedx2022 Admin Dashboard</Heading>
    <Image src={logo} alt="logo" mx="auto" w={80} />
  </Flex>
);
export default Home;
