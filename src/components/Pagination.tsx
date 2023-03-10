import {
  Box, Flex, Icon, IconButton
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';
import qs from 'query-string';

type Props = {
  totalData: number;
  rowsPerPage: number;
};

const Pagination = ({ totalData, rowsPerPage }: Props) => {
  const totalPages = Math.ceil(totalData / rowsPerPage);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchParams, setSearchParams] = useSearchParams();

  const goPrev = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
      setSearchParams(qs.stringify({ page: currentPage - 1 }));
    }
  };

  const goNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
      setSearchParams(qs.stringify({ page: currentPage + 1 }));
    }
  };

  useEffect(() => {
    const page = searchParams.get('page');
    if (page) {
      setCurrentPage(Number(page));
    }
  }, []);

  return (
    <Flex columnGap={4} alignItems="center" justifyContent="center">
      <IconButton
        icon={<Icon as={FaChevronLeft} fontSize={16} />}
        aria-label="prev"
        onClick={goPrev}
        colorScheme="red"
        size="sm"
        disabled={currentPage === 1}
      />
      <Box>
        {currentPage}
        {' '}
        of
        {' '}
        {totalPages || 1}
      </Box>
      <IconButton
        icon={<Icon as={FaChevronRight} fontSize={16} />}
        aria-label="next"
        onClick={goNext}
        colorScheme="red"
        size="sm"
        disabled={currentPage === totalPages || totalPages === 0}
      />
    </Flex>
  );
};

export default Pagination;
