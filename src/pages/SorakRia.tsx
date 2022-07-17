import {
  Box,
  Heading,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  ButtonProps,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import Pagination from "../components/Pagination";

const SorakRia = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = searchParams.get("page");

  useEffect(() => {});

  const baseStyles: ButtonProps = {
    w: 7,
    fontSize: "sm",
  };

  const normalStyles: ButtonProps = {
    ...baseStyles,
    _hover: {
      bg: "green.300",
    },
    bg: "red.300",
  };

  const activeStyles: ButtonProps = {
    ...baseStyles,
    _hover: {
      bg: "blue.300",
    },
    bg: "green.300",
  };

  const separatorStyles: ButtonProps = {
    w: 7,
    bg: "green.200",
  };

  const outerLimit = 2;
  const innerLimit = 2;

  return (
    <Box>
      <Heading fontSize="3xl" mb={12}>
        Sorak Ria
      </Heading>
      <TableContainer>
        <Table variant="striped" colorScheme="red">
          <TableCaption>Imperial to metric conversion factors</TableCaption>
          <Thead>
            <Tr>
              <Th>No</Th>
              <Th>Nama Lengkap</Th>
              <Th>Prodi</Th>
              <Th>Fakultas</Th>
              <Th>Aksi</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>inches</Td>
              <Td>millimetres (mm)</Td>
              <Td>millimetres (mm)</Td>
              <Td>millimetres (mm)</Td>
              <Td>25.4</Td>
            </Tr>
            <Tr>
              <Td>feet</Td>
              <Td>centimetres (cm)</Td>
              <Td>centimetres (cm)</Td>
              <Td>centimetres (cm)</Td>
              <Td>30.48</Td>
            </Tr>
            <Tr>
              <Td>yards</Td>
              <Td>metres (m)</Td>
              <Td>metres (m)</Td>
              <Td>metres (m)</Td>
              <Td>0.91444</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
      <Pagination totalData={100} rowsPerPage={10} />
    </Box>
  );
};
export default SorakRia;
