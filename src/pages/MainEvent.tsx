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
  Flex,
  Input,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import { QrReader } from 'react-qr-reader';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Pagination from '../components/Pagination';
import useEffectOnce from '../hooks/useEffectOnce';
import useError from '../hooks/useError';
import {
  getAudienceList,
  deleteAudience,
  getAllAudience,
} from '../models/preevent';
import { Audience } from '../types/entities/preevent';

const MainEvent = () => {
  const [searchParams] = useSearchParams();
  const [audienceList, setAudienceList] = useState<Array<Audience>>([]);
  const [allAudience, setAllAudience] = useState<Array<Audience>>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isFetchingAll, setIsFetchingAll] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [audienceToBeDeleted, setAudienceToBeDeleted] = useState<null | Audience>(null);
  const [totalData, setTotalData] = useState<number>(0);
  const [qrData, setQRData] = useState<string>('');

  const page = searchParams.get('page');
  const { handleError } = useError();
  const snackbar = useToast();

  const handleFetch = async () => {
    try {
      setIsFetching(true);
      const { data } = await getAudienceList({ page: page ? +page : 1 });
      setAudienceList(data.data.rows);
      setTotalData(data.data.count);
    } catch (error) {
      handleError(error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleFetchAll = async () => {
    try {
      setIsFetchingAll(true);
      const { data } = await getAllAudience();
      console.log(data.data);
      setAllAudience(data.data);
    } catch (error) {
      handleError(error);
    } finally {
      setIsFetchingAll(false);
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

  const postDataQR = () => {
    console.log('CALL API');
    snackbar({ status: 'success', title: 'SUCCESS' });
  };

  useEffect(() => {
    if (qrData) {
      postDataQR();
    }
  }, [qrData]);

  useEffect(() => {
    handleFetch();
  }, [page]);

  useEffectOnce(() => {
    handleFetchAll();
  });

  return (
    <Box>
      <Heading fontSize="3xl" mb={12}>
        Main Event Attendance
      </Heading>
      <Flex gap={8} mb={12} alignItems="center">
        <Box w="45%" pos="relative">
          <QrReader
            constraints={{ facingMode: 'user' }}
            containerStyle={{
              width: '100%',
              aspectRatio: '16/9',
            }}
            videoContainerStyle={{ height: '100%', padding: 0 }}
            videoStyle={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onResult={(result, error) => {
              if (result) {
                setQRData(result?.getText());
              }
              if (error) {
                console.info(error);
              }
            }}
          />
          <Flex gap={5} w="full" mt={6}>
            <Input placeholder="Input QR Manually" flex="1 1 auto" />
            <Button colorScheme="red">Submit</Button>
          </Flex>
        </Box>
        <Box w="55%">
          <TableContainer mb={4} whiteSpace="pre-wrap">
            <Table>
              <Thead>
                <Tr>
                  <Th w="30%">Data</Th>
                  <Th w="70%">Detail</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>Kode</Td>
                  <Td>QIEWQASD123mkasd</Td>
                </Tr>
                <Tr>
                  <Td>Nama</Td>
                  <Td>Alfonsus Avianto Chandrawan</Td>
                </Tr>
                <Tr>
                  <Td>Email</Td>
                  <Td>alfons@gmail.com</Td>
                </Tr>
                <Tr>
                  <Td>Asal Instansi</Td>
                  <Td>Filkom</Td>
                </Tr>
                <Tr>
                  <Td>No. Telepon</Td>
                  <Td>0812312312123</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Flex>
      <TableContainer mb={4}>
        <Table colorScheme="red" variant="striped">
          <Thead>
            <Tr>
              <Th>No</Th>
              <Th>Nama</Th>
              <Th>Asal Instansi</Th>
              <Th>No Telepon</Th>
              <Th>Email</Th>
              <Th>Asal Tahu Acara</Th>
              <Th>Tanggal Daftar</Th>
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

export default MainEvent;
