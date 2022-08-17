import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Icon,
  Image,
  Input,
  Radio,
  RadioGroup,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { FaFileUpload } from 'react-icons/fa';
import useError from '../hooks/useError';
import { addSponsor } from '../models/sponsor';
import { SponsorDto } from '../types/entities/sponsor';

const AddSponsorSchema = Yup.object({
  nama: Yup.string().required(),
  kategori_sponsor: Yup.string()
    .oneOf(['Sponsor', 'Media Partner', 'Community Partner'])
    .required(),
  foto_sponsor: Yup.mixed()
    .required()
    .test('fileSize', 'Maximum file size is 1 mb', (value) => {
      if (!value) {
        return true;
      }
      return value.size <= 1000000;
    }),
  link_foto_sponsor: Yup.string().optional(),
});

const SponsorForm = () => {
  const snackbar = useToast();
  const { handleError } = useError();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (data: SponsorDto) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append('nama', data.nama);
      formData.append('kategori_sponsor', data.kategori_sponsor);

      if (data.foto_sponsor) {
        formData.append('foto_sponsor', data.foto_sponsor);
      }

      await addSponsor(formData);

      snackbar({
        title: 'SUCCESS',
        description: 'Sponsor was successfully added',
        status: 'success',
      });

      navigate('/dashboard/sponsor');
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      nama: '',
      kategori_sponsor: 'Sponsor',
      foto_sponsor: undefined,
      link_foto_sponsor: '',
    },
    validationSchema: AddSponsorSchema,
    onSubmit: handleSubmit,
    validateOnChange: false,
  });

  console.log(formik.errors);
  console.log(formik.values);

  return (
    <Box>
      <Heading fontSize="3xl" mb={12}>
        Add Sponsor
      </Heading>
      <form onSubmit={formik.handleSubmit}>
        <VStack spacing={4}>
          <FormControl isInvalid={!!formik.errors.nama}>
            <FormLabel htmlFor="nama">Nama</FormLabel>
            <Input
              id="nama"
              onChange={formik.handleChange}
              value={formik.values.nama}
            />
            <FormErrorMessage>{formik.errors.nama}</FormErrorMessage>
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="nama">Kategori</FormLabel>
            <RadioGroup
              name="kategori_sponsor"
              defaultValue="Sponsor"
              onChange={(val) => formik.setFieldValue('kategori_sponsor', val)}
            >
              <VStack alignItems="flex-start">
                <Radio value="Sponsor">Sponsor</Radio>
                <Radio value="Media Partner">Media Partner</Radio>
                <Radio value="Community Partner">Community Partner</Radio>
              </VStack>
            </RadioGroup>
          </FormControl>
          <FormControl isInvalid={!!formik.errors.foto_sponsor}>
            <FormLabel htmlFor="deskripsi_merchandise">Gambar</FormLabel>
            {formik.values.foto_sponsor && (
              <Image
                my={8}
                src={URL.createObjectURL(formik.values.foto_sponsor)}
                alt="sponsor"
                w={80}
              />
            )}
            {!formik.values.foto_sponsor && formik.values.link_foto_sponsor && (
              <Image
                my={8}
                src={formik.values.link_foto_sponsor}
                alt="sponsor"
                w={80}
              />
            )}
            <Input
              type="file"
              id="foto"
              hidden
              accept="image/png, image/jpg, image/jpeg"
              onChange={(e) => {
                if (e.target.files !== null) {
                  formik.setFieldValue('foto_sponsor', e.target.files[0]);
                }
              }}
              name="foto_merch"
            />
            <Button
              as="label"
              colorScheme="teal"
              leftIcon={<Icon as={FaFileUpload} />}
              htmlFor="foto"
            >
              Choose Image
            </Button>
            <FormErrorMessage>{formik.errors.foto_sponsor}</FormErrorMessage>
          </FormControl>
          <Flex w="full">
            <Button
              mt={12}
              colorScheme="blue"
              type="submit"
              ml="auto"
              loadingText="Loading..."
              isLoading={isSubmitting}
            >
              Submit
            </Button>
          </Flex>
        </VStack>
      </form>
    </Box>
  );
};

export default SponsorForm;
