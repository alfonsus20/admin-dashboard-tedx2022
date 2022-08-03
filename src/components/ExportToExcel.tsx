import { Button, Icon } from '@chakra-ui/react';
import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { FaFileDownload } from 'react-icons/fa';
import dayjs from 'dayjs';

type Props = {
  headers : { [key:string] : string },
  isLoading : boolean,
  fileName : string,
  csvData : any[],
};

const ExportToExcel = ({
  headers, isLoading, fileName, csvData
} : Props) => {
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

  const heading = [
    headers
  ];

  const headerArray = Object.keys(headers);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(heading, {
      header: headerArray,
      skipHeader: true,
    });
    const wscols = headerArray.map((header) => ({ wch: Math.max(...csvData.map((data) => data[header].length)) }));
    ws['!cols'] = wscols;
    XLSX.utils.sheet_add_json(ws, csvData, {
      header: headerArray,
      skipHeader: true,
      origin: -1
    });
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, `${fileName}_${dayjs().format('DD/MM/YYYY HH:mm')}.xlsx`);
  };

  return (
    <Button ml="auto" leftIcon={<Icon as={FaFileDownload} />} colorScheme="green" isLoading={isLoading} loadingText="Loading..." onClick={exportToExcel}>Download Excel</Button>
  );
};
export default ExportToExcel;
