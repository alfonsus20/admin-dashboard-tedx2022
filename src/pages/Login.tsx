import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Image,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useUserContext } from "../context/UserContext";

import logo from "../assets/logo-tedx-hitam.svg";
import bgLogin from "../assets/mic.webp";

const LoginSchema = Yup.object({
  email: Yup.string().email().required(),
  password: Yup.string().required(),
});

const Login = () => {
  const { login, isLoggingIn } = useUserContext();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: login,
    validateOnChange: false,
  });

  return (
    <Flex minH="100vh" justifyContent="center" m={0}>
      <Box
        flex={{ base: "1 1 auto", lg: "0 0 500px" }}
        px={8}
        py={10}
        mb={24}
        alignSelf="center"
      >
        <Container>
          <Box mb={8}>
            <Image src={logo} alt="logo" mx="auto" w={40} mb={6} />
            <Heading mb={4}>Login</Heading>
            <Text>Contact the website team for the login credential</Text>
          </Box>
          <form onSubmit={formik.handleSubmit}>
            <VStack spacing={4}>
              <FormControl isInvalid={!!formik.errors.email}>
                <FormLabel htmlFor="email">Email</FormLabel>
                <Input
                  id="email"
                  type="email"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                />
                <FormErrorMessage>{formik.errors.email}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!formik.errors.password}>
                <FormLabel htmlFor="password">Password</FormLabel>
                <Input
                  id="password"
                  type="password"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                />
                <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
              </FormControl>
              <Button
                mt={4}
                colorScheme="red"
                color="white"
                type="submit"
                w="full"
                loadingText="Loading..."
                isDisabled={isLoggingIn}
              >
                Login
              </Button>
            </VStack>
          </form>
        </Container>
      </Box>
      <Box
        display={{ base: "none", lg: "block" }}
        flex="1 1 auto"
        bgImage={`url(${bgLogin})`}
        bgSize="cover"
        bgPos="center"
      />
    </Flex>
  );
};
export default Login;
