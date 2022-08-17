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
import { deleteSponsor, getAllSponsors } from '../models/sponsor';
import { Sponsor } from '../types/entities/sponsor';

const SponsorList = () => {
  const [searchParams] = useSearchParams();
  const [sponsors, setSponsors] = useState<Array<Sponsor>>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [sponsorToBeDeleted, setSponsorToBeDeleted] = useState<null | Sponsor>(null);

  const page = searchParams.get('page');
  const { handleError } = useError();
  const snackbar = useToast();

  const handleFetch = async () => {
    try {
      setIsFetching(true);
      const { data } = await getAllSponsors();
      setSponsors(data.data);
    } catch (error) {
      handleError(error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleResetSponsorToBeDeleted = () => {
    setSponsorToBeDeleted(null);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteSponsor(sponsorToBeDeleted!.id);
      snackbar({
        title: 'SUCCESS',
        description: 'Sponsor was successfully deleted',
        status: 'success',
      });
      handleResetSponsorToBeDeleted();
      await handleFetch();
    } catch (error) {
      handleError(error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShowDeleteModal = (sponsor: Sponsor) => {
    setSponsorToBeDeleted(sponsor);
  };

  useEffect(() => {
    handleFetch();
  }, [page]);

  return (
    <Box>
      <Heading fontSize="3xl" mb={12}>
        Sponsor
      </Heading>
      <Flex mb={6}>
        <Button
          ml="auto"
          colorScheme="green"
          as={Link}
          to="/dashboard/sponsor/add"
          leftIcon={<Icon as={FaPlus} />}
        >
          Add Sponsor
        </Button>
      </Flex>
      <TableContainer mb={4}>
        <Table>
          <Thead>
            <Tr>
              <Th>No</Th>
              <Th>Nama</Th>
              <Th>Kategori</Th>
              <Th>Foto</Th>
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
            ) : sponsors.length === 0 ? (
              <Tr>
                <Td colSpan={6} textAlign="center">
                  Data tidak tersedia
                </Td>
              </Tr>
            ) : (
              sponsors.map((sponsor, idx) => (
                <Tr key={sponsor.id}>
                  <Td>{((page ? +page : 1) - 1) * 10 + idx + 1}</Td>
                  <Td>{sponsor.nama}</Td>
                  <Td>{sponsor.kategori_sponsor}</Td>
                  <Td>
                    <Image
                      src={sponsor.link_foto_sponsor}
                      alt={sponsor.nama}
                      minW={60}
                      maxW={60}
                    />
                  </Td>
                  <Td>
                    <Button
                      onClick={() => handleShowDeleteModal(sponsor)}
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
        onClose={handleResetSponsorToBeDeleted}
        isOpen={!!sponsorToBeDeleted}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Confirmation</ModalHeader>
          <ModalCloseButton isDisabled={isDeleting} />
          <ModalBody>
            Are you sure want to delete
            {' '}
            <strong>{sponsorToBeDeleted?.nama}</strong>
            {' '}
            ?
          </ModalBody>
          <ModalFooter>
            <Button
              onClick={handleResetSponsorToBeDeleted}
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

export default SponsorList;
