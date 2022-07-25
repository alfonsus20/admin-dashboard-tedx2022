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
  Icon,
} from "@chakra-ui/react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import useEffectOnce from "../hooks/useEffectOnce";
import useError from "../hooks/useError";
import { getStudentSpeakerById } from "../models/studentSpeaker";
import { StudentSpeaker } from "../types/entities/studentSpeaker";
import { titleCase } from "../utils/textHelper";
import { isURL } from "../utils/urlHelper";
import { FaFileDownload } from "react-icons/fa";

const StudentSpeakerDetail = () => {
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [studentData, setStudentData] = useState<StudentSpeaker | undefined>(
    undefined
  );
  const { id } = useParams<{ id: string }>();

  const { handleError } = useError();

  const handleFetch = async () => {
    try {
      setIsFetching(true);
      const { data } = await getStudentSpeakerById(+id!);
      setStudentData(data.data);
    } catch (error) {
      handleError(error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffectOnce(() => {
    handleFetch();
  });

  return (
    <Box>
      <Heading fontSize="3xl" mb={12}>
        Detail Registrant
      </Heading>
      <TableContainer mb={4} whiteSpace="pre-wrap">
        <Table>
          <Thead>
            <Tr>
              <Th w="20%">Data</Th>
              <Th w="80%">Detail</Th>
            </Tr>
          </Thead>
          <Tbody>
            {studentData &&
              Object.keys(studentData)
                .filter(
                  (key) =>
                    ![
                      "id",
                      "is_checked",
                      "createdAt",
                      "updatedAt",
                      "is_deleted",
                    ].includes(key)
                )
                .map((key) => {
                  const currentRowData =
                    studentData[key as keyof typeof studentData].toString();
                  return (
                    <Tr>
                      <Td w="20%">{titleCase(key)}</Td>
                      <Td w="80%" textAlign="justify">
                        {isURL(currentRowData) ? (
                          <Button
                            as="a"
                            href={currentRowData}
                            download
                            leftIcon={<Icon as={FaFileDownload} />}
                            colorScheme="blue"
                          >
                            Download
                          </Button>
                        ) : (
                          currentRowData
                        )}
                      </Td>
                    </Tr>
                  );
                })}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};
export default StudentSpeakerDetail;
