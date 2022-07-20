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
  Button,
  Skeleton,
  TableCaption,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Pagination from "../components/Pagination";
import useError from "../hooks/useError";
import { getStudentSpeakers } from "../model/studentSpeaker";
import { StudentSpeaker } from "../types/entities/studentSpeaker";

const SorakRia = () => {
  const [searchParams] = useSearchParams();
  const [studentSpeakers, setStudentSpeakers] = useState<Array<StudentSpeaker>>(
    []
  );
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [totalData, setTotalData] = useState<number>(0);

  const page = searchParams.get("page");
  const { handleError } = useError();

  const handleFetch = async () => {
    try {
      setIsFetching(true);
      const { data } = await getStudentSpeakers({ page: page ? +page : 1 });
      setStudentSpeakers(data.data.rows);
      setTotalData(data.data.count);
    } catch (error) {
      handleError(error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    handleFetch();
  }, [page]);

  return (
    <Box>
      <Heading fontSize="3xl" mb={12}>
        Sorak Ria Registrants
      </Heading>
      <TableContainer mb={4}>
        <Table>
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
            {isFetching ? (
              Array(10)
                .fill(null)
                .map((_, idx) => (
                  <Tr key={idx}>
                    <Td>
                      <Skeleton height="20px" />
                    </Td>
                    <Td>
                      <Skeleton height="20px" />
                    </Td>
                    <Td>
                      <Skeleton height="20px" />
                    </Td>
                    <Td>
                      <Skeleton height="20px" />
                    </Td>
                    <Td>
                      <Skeleton height="20px" />
                    </Td>
                  </Tr>
                ))
            ) : studentSpeakers.length === 0 ? (
              <TableCaption>Data tidak ditemukan</TableCaption>
            ) : (
              studentSpeakers.map((studentSpeaker, idx) => (
                <Tr key={studentSpeaker.id}>
                  <Td>{((page ? +page : 1) - 1) * 10 + idx + 1}</Td>
                  <Td>{studentSpeaker.nama_lengkap}</Td>
                  <Td>{studentSpeaker.jurusan}</Td>
                  <Td>{studentSpeaker.fakultas}</Td>
                  <Td>
                    <Button
                      as={Link}
                      to={`/dashboard/sorak-ria/${studentSpeaker.id}`}
                      colorScheme="blue"
                      variant="outline"
                    >
                      Detail
                    </Button>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>
      <Pagination totalData={totalData} rowsPerPage={10} />
    </Box>
  );
};

export default SorakRia;
