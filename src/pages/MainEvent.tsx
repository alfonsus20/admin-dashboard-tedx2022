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
  Flex,
  Input,
  Badge,
  IconButton,
  Icon,
  Grid,
  GridItem,
  Text,
  Spacer,
} from '@chakra-ui/react';
import { QrReader } from 'react-qr-reader';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import Pagination from '../components/Pagination';
import useError from '../hooks/useError';
import {
  getAllTicket,
  getAllVisitor,
  getVisitorById,
  getVisitorList,
  verifyVisitor,
} from '../models/mainEvent';
import { Visitor } from '../types/entities/visitor';
import { Ticket } from '../types/entities/ticket';

const MainEvent = () => {
  const [searchParams] = useSearchParams();
  const [audienceList, setVisitorList] = useState<Array<Visitor>>([]);
  const [ticketList, setTicketList] = useState<Array<Ticket>>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [isLoadingVisitorInfo, setIsLoadingVisitorInfo] = useState<boolean>(false);
  const [visitorToBeVerified, setVisitorToBeVerified] = useState<null | Visitor>(null);
  const [totalData, setTotalData] = useState<number>(0);
  const [qrData, setQRData] = useState<string>('');

  const page = searchParams.get('page');
  const { handleError } = useError();
  const snackbar = useToast();

  const handleFetch = async () => {
    try {
      let tempVisitorList = [];
      setIsFetching(true);
      const { data } = await getAllVisitor();
      for (let item of data.data) {
        if (item.qr_code){
          tempVisitorList.push(item);
        }
      }
      setVisitorList(tempVisitorList);
    } catch (error) {
      handleError(error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleFetchTicket = async () => {
    try {
      setIsFetching(true);
      const { data } = await getAllTicket();
      console.log(data)
      setTicketList(data.data);
      // setTotalData(data.data.count);
    } catch (error) {
      handleError(error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleFetchVisitorInfo = async () => {
    try {
      setIsLoadingVisitorInfo(true);
      const { data } = await getVisitorById(qrData);
      setVisitorToBeVerified(data.data);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoadingVisitorInfo(false);
    }
  };

  const handleVerify = async (id: string) => {
    try {
      setIsVerifying(true);
      await verifyVisitor(id);
      snackbar({
        title: 'SUCCESS',
        description: 'Visitor was successfully checked in',
        status: 'success',
      });
      await handleFetchVisitorInfo();
      await handleFetch();
    } catch (error) {
      handleError(error);
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    if (qrData) {
      handleFetchVisitorInfo();
    }
  }, [qrData]);

  useEffect(() => {
    handleFetch();
    handleFetchTicket();
  }, [page]);

  return (
    <Box>
      <Heading fontSize="3xl" mb={12}>
        Main Event Attendance
      </Heading>
      <Flex justifyContent='start' alignItems='center' mb={3}>
          <Heading as='h4' size='md'>Remaining Ticket:</Heading>
        </Flex>
      <Grid templateColumns="repeat(3, 1fr)" textAlign="center" gap={4} mb={6}>
        <GridItem
          borderColor="green.500"
          borderTopWidth={3.5}
          p={3}
          boxShadow="lg"
          borderRadius="lg"
        >
          <Heading fontSize="xl" color="green.500">
            Early Bird
          </Heading>
          <Text fontSize="4xl" fontWeight="medium">
            {ticketList[0]?.remaining_ticket}
          </Text>
        </GridItem>
        <GridItem
          borderColor="orange.400"
          borderTopWidth={3.5}
          p={3}
          boxShadow="lg"
          borderRadius="lg"
        >
          <Heading fontSize="xl" color="orange.400">
            Presale 1
          </Heading>
          <Text fontSize="4xl" fontWeight="medium">
            {ticketList[1]?.remaining_ticket}
          </Text>
        </GridItem>
        <GridItem
          borderColor="blue.400"
          borderTopWidth={3.5}
          p={3}
          boxShadow="lg"
          borderRadius="lg"
        >
          <Heading fontSize="xl" color="blue.400">
            Special Ticket
          </Heading>
          <Text fontSize="4xl" fontWeight="medium">
            {ticketList[2]?.remaining_ticket}
          </Text>
        </GridItem>
      </Grid>
      <Flex gap={8} mb={12} alignItems="center">
        <Flex flexDir="column" w="45%" pos="relative" alignSelf="stretch">
          <QrReader
            constraints={{ facingMode: 'user' }}
            containerStyle={{
              width: '100%',
              flexGrow: 1,
            }}
            videoContainerStyle={{ height: '100%', padding: 0 }}
            videoStyle={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onResult={(result, error) => {
              if (result) {
                setQRData(result.getText());
              }
              if (error) {
                console.info(error);
              }
            }}
          />
        </Flex>
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
                  <Td>
                    {isLoadingVisitorInfo ? (
                      <Skeleton height={5} />
                    ) : (
                      visitorToBeVerified?.id
                    )}
                  </Td>
                </Tr>
                <Tr>
                  <Td>Nama</Td>
                  <Td>
                    {isLoadingVisitorInfo ? (
                      <Skeleton height={5} />
                    ) : (
                      visitorToBeVerified?.nama
                    )}
                  </Td>
                </Tr>
                <Tr>
                  <Td>Email</Td>
                  <Td>
                    {isLoadingVisitorInfo ? (
                      <Skeleton height={5} />
                    ) : (
                      visitorToBeVerified?.email
                    )}
                  </Td>
                </Tr>
                <Tr>
                  <Td>Asal Instansi</Td>
                  <Td>
                    {/* eslint-disable-next-line no-nested-ternary */}
                    {isLoadingVisitorInfo ? (
                      <Skeleton height={5} />
                    ) : visitorToBeVerified ? (
                      `${visitorToBeVerified?.asalInstansi} - ${visitorToBeVerified?.namaInstansi}`
                    ) : (
                      ''
                    )}
                  </Td>
                </Tr>
                <Tr>
                  <Td>No. Telepon</Td>
                  <Td>
                    {isLoadingVisitorInfo ? (
                      <Skeleton height={5} />
                    ) : (
                      visitorToBeVerified?.nomorTelp
                    )}
                  </Td>
                </Tr>
                <Tr>
                  <Td>Status</Td>
                  <Td>
                    {isLoadingVisitorInfo ? (
                      <Skeleton height={5} />
                    ) : (
                      visitorToBeVerified
                      && (visitorToBeVerified.is_scanned ? (
                        <Badge colorScheme="green" variant="solid">
                          Checked in
                        </Badge>
                      ) : (
                        <Badge colorScheme="red" variant="solid">
                          Not Checked in
                        </Badge>
                      ))
                    )}
                  </Td>
                </Tr>
                <Tr>
                  <Td colSpan={2}>
                    {visitorToBeVerified && !visitorToBeVerified.is_scanned && (
                      <Button
                        colorScheme="green"
                        w="full"
                        onClick={() => handleVerify(qrData)}
                        isLoading={isVerifying}
                      >
                        Check In
                      </Button>
                    )}
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Flex>
      <Flex>
        <Flex justifyContent='center' alignItems='center'>
          <Heading as='h4' size='md'>Total Buyer: {audienceList.length}</Heading>
        </Flex>
        <Spacer />
        <Flex ml="auto" gap={2}>
          <Input placeholder="Search Name or ID" />
          <IconButton
            colorScheme="red"
            aria-label="search"
            icon={<Icon as={FaSearch} />}
          />
        </Flex>
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
              <Th>Status</Th>
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
                  </Tr>
                ))
            ) : audienceList?.length === 0 ? (
              <Tr>
                <Td colSpan={8} textAlign="center">
                  Data tidak tersedia
                </Td>
              </Tr>
            ) : (
              audienceList?.map((audience, idx) => (
                <Tr key={audience.id}>
                  <Td>{((page ? +page : 1) - 1) * 10 + idx + 1}</Td>
                  <Td>{audience.nama}</Td>
                  <Td>{`${audience.asalInstansi} - ${audience.namaInstansi}`}</Td>
                  <Td>{audience.nomorTelp}</Td>
                  <Td>{audience.email}</Td>
                  <Td>
                    {audience.is_scanned ? (
                      <Badge colorScheme="green" variant="solid">
                        Checked in
                      </Badge>
                    ) : (
                      <Badge colorScheme="red" variant="solid">
                        Not Checked in
                      </Badge>
                    )}
                  </Td>
                  <Td>
                    {!audience.is_scanned && (
                      <Button
                        colorScheme="green"
                        isLoading={isVerifying}
                        onClick={() => handleVerify(audience.id)}
                      >
                        Check In
                      </Button>
                    )}
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

export default MainEvent;
