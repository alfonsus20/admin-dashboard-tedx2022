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
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Pagination from "../components/Pagination";
import useError from "../hooks/useError";
import {
  deleteStudentSpeaker,
  getStudentSpeakers,
} from "../models/studentSpeaker";
import { StudentSpeaker } from "../types/entities/studentSpeaker";

const StudentSpeakerPage = () => {
  const [searchParams] = useSearchParams();
  const [studentSpeakers, setStudentSpeakers] = useState<Array<StudentSpeaker>>(
    []
  );
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [studentSpeakerToBeDeleted, setStudentSpeakerToBeDeleted] =
    useState<null | StudentSpeaker>(null);
  const [totalData, setTotalData] = useState<number>(0);

  const page = searchParams.get("page");
  const { handleError } = useError();
  const snackbar = useToast();

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

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteStudentSpeaker(studentSpeakerToBeDeleted!.id);
      snackbar({
        title: "SUCCESS",
        description: "Registrant was successfully deleted",
        status: "success",
      });
      handleResetStudentSpeakerToBeDeleted();
      await handleFetch();
    } catch (error) {
      handleError(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShowDeleteModal = (student: StudentSpeaker) => {
    setStudentSpeakerToBeDeleted(student);
  };

  const handleResetStudentSpeakerToBeDeleted = () => {
    setStudentSpeakerToBeDeleted(null);
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
              <Tr>
                <Td colSpan={5} textAlign="center">
                  Data tidak tersedia
                </Td>
              </Tr>
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
                      mr={3}
                    >
                      Detail
                    </Button>
                    <Button
                      onClick={() => handleShowDeleteModal(studentSpeaker)}
                      colorScheme="red"
                    >
                      Delete
                    </Button>
                  </Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </TableContainer>
      <Pagination totalData={totalData} rowsPerPage={10} />

      <Modal
        onClose={handleResetStudentSpeakerToBeDeleted}
        isOpen={!!studentSpeakerToBeDeleted}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Confirmation</ModalHeader>
          <ModalCloseButton isDisabled={isDeleting} />
          <ModalBody>
            Are you sure want to delete{" "}
            <strong>{studentSpeakerToBeDeleted?.nama_lengkap}</strong> ?
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={handleResetStudentSpeakerToBeDeleted}
              mr={3}
              isDisabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={handleDelete}
              isLoading={isDeleting}
              loadingText="Loading..."
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default StudentSpeakerPage;
