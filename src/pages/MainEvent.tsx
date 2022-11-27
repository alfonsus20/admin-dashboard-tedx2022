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
  Text,
  Spacer,
} from '@chakra-ui/react';
import { QrReader } from 'react-qr-reader';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import useError from '../hooks/useError';
import {
  getAllTicket,
  getAllVisitor,
  getVisitorById,
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
  const [qrData, setQRData] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [cameraEnvironment, setCameraEnvironment] = useState<string>('environment');
  const [camera, setCamera] = useState<boolean>(true);

  const page = searchParams.get('page');
  const { handleError } = useError();
  const snackbar = useToast();

  const handleFetch = async () => {
    try {
      setIsFetching(true);
      const { data } = await getAllVisitor();
      const tempVisitorList = data.data.filter((item) => item.qr_code);
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
      setTicketList(data.data);
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
      await handleFetch();
    } catch (error) {
      handleError(error);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleChange = (e: { target: { value: string } }) => {
    setSearch(e.target.value);
  };

  const handleChangeCamera = () => {
    setCamera(!camera);
    if (camera) {
      setCameraEnvironment('environment');
    } else if (!camera) {
      setCameraEnvironment('user');
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
      <Heading fontSize="3xl" mb={{ base: 6, lg: 12 }}>
        Main Event Attendance
      </Heading>
      <Flex justifyContent="start" alignItems="center" mb={3}>
        <Heading as="h4" size="md">
          Ticket Sold:
        </Heading>
      </Flex>
      <Grid templateColumns="repeat(3, 1fr)" textAlign="center" gap={4} mb={6}>
        <Flex
          flexDir="column"
          justifyContent="space-evenly"
          alignItems="center"
          borderColor="green.500"
          borderTopWidth={3.5}
          p={1}
          boxShadow="lg"
          borderRadius="lg"
        >
          <Heading fontSize={{ base: 'md', lg: 'xl' }} color="green.500">
            Early Bird
          </Heading>
          <Text fontSize={{ base: 'xl', lg: '4xl' }} fontWeight="medium">
            {ticketList[0]?.ticket_sold}
          </Text>
        </Flex>
        <Flex
          flexDir="column"
          justifyContent="space-evenly"
          alignItems="center"
          borderColor="orange.400"
          borderTopWidth={3.5}
          p={1}
          boxShadow="lg"
          borderRadius="lg"
          gridAutoColumns="max-content"
        >
          <Heading fontSize={{ base: 'md', lg: 'xl' }} color="orange.400">
            Presale 1
          </Heading>
          <Text fontSize={{ base: 'xl', lg: '4xl' }} fontWeight="medium">
            {ticketList[1]?.ticket_sold}
          </Text>
        </Flex>
        <Flex
          flexDir="column"
          justifyContent="space-evenly"
          alignItems="center"
          borderColor="blue.400"
          borderTopWidth={3.5}
          p={1}
          boxShadow="lg"
          borderRadius="lg"
        >
          <Heading fontSize={{ base: 'md', lg: 'xl' }} color="blue.400">
            Special Ticket
          </Heading>
          <Text fontSize={{ base: 'xl', lg: '4xl' }} fontWeight="medium">
            {ticketList[2]?.ticket_sold || 0}
          </Text>
        </Flex>
      </Grid>
      <Flex
        flexDir={{ base: 'column', lg: 'row' }}
        gap={8}
        mb={6}
        alignItems="center"
      >
        <Flex
          flexDir="column"
          h={{ base: '300px', lg: 'auto' }}
          w={{ base: '100%', lg: '45%' }}
          pos="relative"
          alignSelf="stretch"
          gap={3}
        >
          <QrReader
            constraints={{ facingMode: `${cameraEnvironment}` }}
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
          <Button onClick={handleChangeCamera}>Switch Camera</Button>
        </Flex>
        <Box w={{ base: '100%', lg: '55%' }}>
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
                  <Td>Jenis Tiket</Td>
                  <Td>
                    {isLoadingVisitorInfo ? (
                      <Skeleton height={5} />
                    ) : (
                      visitorToBeVerified?.transaction?.jenis_tiket
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
      <Flex flexDir={{ base: 'column', lg: 'row' }} gap={2} mb={2}>
        <Flex flexDir="column" justifyContent="center" alignItems="start">
          <Heading as="h4" size="md">
            Total Audiens:
            {' '}
            {audienceList.length}
          </Heading>
          <Heading as="h4" size="md">
            Audiens yang Telah di Scan:
            {' '}
            {
              audienceList.filter((audience) => audience.is_scanned === true)
                .length
            }
          </Heading>
        </Flex>
        <Spacer />
        <Flex gap={2}>
          <Input
            placeholder="Search Name or ID"
            value={search}
            onChange={handleChange}
          />
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
              <Th>Jenis Tiket</Th>
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
              audienceList
                ?.sort((a, b) => Number(b.is_scanned) - Number(a.is_scanned))
                .map((audience, idx) => {
                  if (
                    search === ''
                    || audience.nama
                      .toLowerCase()
                      .includes(search.toLowerCase())
                    || audience.asalInstansi
                      .toLowerCase()
                      .includes(search.toLowerCase())
                    || audience.namaInstansi
                      .toLowerCase()
                      .includes(search.toLowerCase())
                    || audience.transaction.jenis_tiket
                      .toLowerCase()
                      .includes(search.toLowerCase())
                  ) {
                    return (
                      <Tr key={audience.id}>
                        <Td>{((page ? +page : 1) - 1) * 10 + idx + 1}</Td>
                        <Td>{audience.nama}</Td>
                        <Td>{`${audience.asalInstansi} - ${audience.namaInstansi}`}</Td>
                        <Td>{audience.nomorTelp}</Td>
                        <Td>{audience.email}</Td>
                        <Td>{audience.transaction.jenis_tiket}</Td>
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
                    );
                  }
                  return null;
                })
            )}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default MainEvent;
