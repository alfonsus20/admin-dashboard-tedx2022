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
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Pagination from '../components/Pagination';
import useError from '../hooks/useError';
import { getAudienceList, deleteAudience } from '../models/preevent';
import { Audience } from '../types/entities/preevent';

const Preevent = () => {
  const [searchParams] = useSearchParams();
  const [audienceList, setAudiences] = useState<Array<Audience>>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [audienceToBeDeleted, setAudienceToBeDeleted] = useState<null | Audience>(null);
  const [totalData, setTotalData] = useState<number>(0);

  const page = searchParams.get('page');
  const { handleError } = useError();
  const snackbar = useToast();

  const handleFetch = async () => {
    try {
      setIsFetching(true);
      const { data } = await getAudienceList({ page: page ? +page : 1 });
      setAudiences(data.data.rows);
      setTotalData(data.data.count);
    } catch (error) {
      handleError(error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleResetAudienceToBeDeleted = () => {
    setAudienceToBeDeleted(null);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteAudience(audienceToBeDeleted!.id);
      snackbar({
        title: 'SUCCESS',
        description: 'Audience was successfully deleted',
        status: 'success',
      });
      handleResetAudienceToBeDeleted();
      await handleFetch();
    } catch (error) {
      handleError(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShowDeleteModal = (student: Audience) => {
    setAudienceToBeDeleted(student);
  };

  useEffect(() => {
    handleFetch();
  }, [page]);

  return (
    <Box>
      <Heading fontSize="3xl" mb={12}>
        Preevent Registrants
      </Heading>
      <TableContainer mb={4}>
        <Table>
          <Thead>
            <Tr>
              <Th>No</Th>
              <Th>Nama</Th>
              <Th>Asal Instansi</Th>
              <Th>No Telepon</Th>
              <Th>Email</Th>
              <Th>Asal Tahu Acara</Th>
              <Th>Tanggal Daftar</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {/* eslint-disable-next-line no-nested-ternary */}
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
            ) : audienceList.length === 0 ? (
              <Tr>
                <Td colSpan={8} textAlign="center">
                  Data tidak tersedia
                </Td>
              </Tr>
            ) : (
              audienceList.map((audience, idx) => (
                <Tr key={audience.id}>
                  <Td>{((page ? +page : 1) - 1) * 10 + idx + 1}</Td>
                  <Td>{audience.nama}</Td>
                  <Td>{audience.asal_instansi}</Td>
                  <Td>{audience.no_telepon}</Td>
                  <Td>{audience.email}</Td>
                  <Td>
                    <ul>
                      {audience.asal_tahu_acara
                        .split(',')
                        .filter((item) => item)
                        .map((item, idxInner) => (
                          <li key={idxInner}>{item}</li>
                        ))}
                    </ul>
                  </Td>
                  <Td>
                    {dayjs(audience.createdAt).format('DD/MM/YYYY HH:mm')}
                  </Td>
                  <Td>
                    <Button
                      onClick={() => handleShowDeleteModal(audience)}
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
        onClose={handleResetAudienceToBeDeleted}
        isOpen={!!audienceToBeDeleted}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Confirmation</ModalHeader>
          <ModalCloseButton isDisabled={isDeleting} />
          <ModalBody>
            Are you sure want to delete
            {' '}
            <strong>{audienceToBeDeleted?.nama}</strong>
            {' '}
            ?
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={handleResetAudienceToBeDeleted}
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

export default Preevent;
