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
  Image,
  Flex,
  Icon,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import useError from '../hooks/useError';
import { deleteMerchandise, getAllMerchandises } from '../models/merchandise';
import { Merchandise } from '../types/entities/merchandise';

const MerchandiseList = () => {
  const [searchParams] = useSearchParams();
  const [merchandises, setMerchandises] = useState<Array<Merchandise>>(
    []
  );
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [merchandiseToBeDeleted, setMerchandiseToBeDeleted] = useState<null | Merchandise>(null);

  const page = searchParams.get('page');
  const { handleError } = useError();
  const snackbar = useToast();

  const handleFetch = async () => {
    try {
      setIsFetching(true);
      const { data } = await getAllMerchandises();
      setMerchandises(data.data);
    } catch (error) {
      handleError(error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleResetMerchandiseToBeDeleted = () => {
    setMerchandiseToBeDeleted(null);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteMerchandise(merchandiseToBeDeleted!.id);
      snackbar({
        title: 'SUCCESS',
        description: 'Merchandise was successfully deleted',
        status: 'success',
      });
      handleResetMerchandiseToBeDeleted();
      await handleFetch();
    } catch (error) {
      handleError(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShowDeleteModal = (merchandise: Merchandise) => {
    setMerchandiseToBeDeleted(merchandise);
  };

  useEffect(() => {
    handleFetch();
  }, [page]);

  return (
    <Box>
      <Heading fontSize="3xl" mb={12}>
        Merchandise
      </Heading>
      <Flex mb={6}>
        <Button ml="auto" colorScheme="green" as={Link} to="/dashboard/merchandise/add" leftIcon={<Icon as={FaPlus} />}>Add Merchandise</Button>
      </Flex>
      <TableContainer mb={4}>
        <Table>
          <Thead>
            <Tr>
              <Th>No</Th>
              <Th>Nama</Th>
              <Th>Harga</Th>
              <Th>Foto</Th>
              <Th>Deskripsi</Th>
              <Th>Aksi</Th>
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
                  </Tr>
                ))
            ) : merchandises.length === 0 ? (
              <Tr>
                <Td colSpan={5} textAlign="center">
                  Data tidak tersedia
                </Td>
              </Tr>
            ) : (
              merchandises.map((merchandise, idx) => (
                <Tr key={merchandise.id}>
                  <Td>{((page ? +page : 1) - 1) * 10 + idx + 1}</Td>
                  <Td>{merchandise.nama}</Td>
                  <Td>{merchandise.harga}</Td>
                  <Td>
                    <Image src={merchandise.link_foto_merchandise} alt={merchandise.nama} w={36} />
                  </Td>
                  <Td>{merchandise.deskripsi_merchandise}</Td>
                  <Td>
                    <Button
                      as={Link}
                      to={`/dashboard/merchandise/${merchandise.id}/edit`}
                      colorScheme="yellow"
                      color="white"
                      mr={3}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleShowDeleteModal(merchandise)}
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

      <Modal
        onClose={handleResetMerchandiseToBeDeleted}
        isOpen={!!merchandiseToBeDeleted}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Confirmation</ModalHeader>
          <ModalCloseButton isDisabled={isDeleting} />
          <ModalBody>
            Are you sure want to delete
            {' '}
            <strong>{merchandiseToBeDeleted?.nama}</strong>
            {' '}
            ?
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={handleResetMerchandiseToBeDeleted}
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

export default MerchandiseList;
