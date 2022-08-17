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
import { deleteBundle, getAllBundles } from '../models/bundle';
import { Bundle } from '../types/entities/bundle';

const BundleList = () => {
  const [searchParams] = useSearchParams();
  const [bundles, setBundles] = useState<Array<Bundle>>(
    []
  );
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [bundleToBeDeleted, setBundleToBeDeleted] = useState<null | Bundle>(null);

  const page = searchParams.get('page');
  const { handleError } = useError();
  const snackbar = useToast();

  const handleFetch = async () => {
    try {
      setIsFetching(true);
      const { data } = await getAllBundles();
      setBundles(data.data);
    } catch (error) {
      handleError(error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleResetBundleToBeDeleted = () => {
    setBundleToBeDeleted(null);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteBundle(bundleToBeDeleted!.id);
      snackbar({
        title: 'SUCCESS',
        description: 'Bundle was successfully deleted',
        status: 'success',
      });
      handleResetBundleToBeDeleted();
      await handleFetch();
    } catch (error) {
      handleError(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShowDeleteModal = (bundle: Bundle) => {
    setBundleToBeDeleted(bundle);
  };

  useEffect(() => {
    handleFetch();
  }, [page]);

  return (
    <Box>
      <Heading fontSize="3xl" mb={12}>
        Bundle
      </Heading>
      <Flex mb={6}>
        <Button ml="auto" colorScheme="green" as={Link} to="/dashboard/bundle/add" leftIcon={<Icon as={FaPlus} />}>Add Bundle</Button>
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
              <Th>Isi</Th>
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
                    <Td>
                      <Skeleton height="20px" />
                    </Td>
                  </Tr>
                ))
            ) : bundles.length === 0 ? (
              <Tr>
                <Td colSpan={7} textAlign="center">
                  Data tidak tersedia
                </Td>
              </Tr>
            ) : (
              bundles.map((bundle, idx) => (
                <Tr key={bundle.id}>
                  <Td>{((page ? +page : 1) - 1) * 10 + idx + 1}</Td>
                  <Td>{bundle.nama}</Td>
                  <Td>{bundle.harga}</Td>
                  <Td>
                    <Image src={bundle.link_foto_bundle} alt={bundle.nama} minW={60} maxW={60} />
                  </Td>
                  <Td>
                    {bundle.deskripsi_bundle}
                  </Td>
                  <Td>
                    <ul>
                      {bundle.isi_bundle.split(';').map((isi, idxChild) => <li key={idxChild}>{isi}</li>)}
                    </ul>
                  </Td>
                  <Td>
                    <Button
                      as={Link}
                      to={`/dashboard/bundle/${bundle.id}/edit`}
                      colorScheme="yellow"
                      color="white"
                      mr={3}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => handleShowDeleteModal(bundle)}
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
        onClose={handleResetBundleToBeDeleted}
        isOpen={!!bundleToBeDeleted}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Confirmation</ModalHeader>
          <ModalCloseButton isDisabled={isDeleting} />
          <ModalBody>
            Are you sure want to delete
            {' '}
            <strong>{bundleToBeDeleted?.nama}</strong>
            {' '}
            ?
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={handleResetBundleToBeDeleted}
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

export default BundleList;
