import {
  Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Icon, Image, Input, Textarea, useToast, VStack
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { FaFileUpload } from 'react-icons/fa';
import useEffectOnce from '../hooks/useEffectOnce';
import { MerchandiseDto } from '../types/entities/merchandise';
import useError from '../hooks/useError';
import { addMerchandise, editMerchandise, getMerchandiseById } from '../models/merchandise';

const MerchandiseForm = () => {
  const { id } = useParams<{ id : string }>();

  const isEditForm = !!id;

  const snackbar = useToast();
  const { handleError } = useError();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (data : MerchandiseDto) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append('nama', data.nama);
      formData.append('harga', data.harga.toString());
      formData.append('deskripsi_merchandise', data.deskripsi_merchandise);

      if (data.foto_merch) {
        formData.append('foto_merch', data.foto_merch);
      }

      if (isEditForm) {
        await editMerchandise(formData, +id!);
      } else {
        await addMerchandise(formData);
      }

      snackbar({
        title: 'SUCCESS',
        description: `Merchandise was successfully ${isEditForm ? 'edited' : 'added'}`,
        status: 'success',
      });

      navigate('/dashboard/merchandise');
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const AddMerchandiseSchema = useMemo(() => Yup.object({
    nama: Yup.string().required(),
    harga: Yup.number().positive().required(),
    deskripsi_merchandise: Yup.string().required(),
    foto_merch: isEditForm ? Yup.mixed().nullable() : Yup.mixed()
      .required()
      .test('fileSize', 'Maximum file size is 1 mb', (value) => {
        if (!value) {
          return true;
        }
        return value.size <= 5000000;
      }),
    link_foto_merchandise: Yup.string().optional(),
  }), [isEditForm]);

  const formik = useFormik({
    initialValues: {
      nama: '',
      harga: '',
      deskripsi_merchandise: '',
      foto_merch: undefined,
      link_foto_merchandise: ''
    },
    validationSchema: AddMerchandiseSchema,
    onSubmit: handleSubmit,
    validateOnChange: false,
  });

  const handleFetch = async () => {
    try {
      const { data: { data } } = await getMerchandiseById(+id!);
      formik.setValues({
        nama: data.nama,
        harga: data.harga.toString(),
        deskripsi_merchandise: data.deskripsi_merchandise,
        foto_merch: undefined,
        link_foto_merchandise: data.link_foto_merchandise
      });
    } catch (error) {
      handleError(error);
    }
  };

  useEffectOnce(() => {
    if (isEditForm) {
      handleFetch();
    }
  });

  return (
    <Box>
      <Heading fontSize="3xl" mb={12}>
        {isEditForm ? 'Edit ' : 'Add '}
        Merchandise
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
          <FormControl isInvalid={!!formik.errors.harga}>
            <FormLabel htmlFor="harga">Harga</FormLabel>
            <Input
              id="harga"
              type="number"
              onChange={formik.handleChange}
              value={formik.values.harga}
            />
            <FormErrorMessage>{formik.errors.harga}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!formik.errors.deskripsi_merchandise}>
            <FormLabel htmlFor="deskripsi_merchandise">Deskripsi</FormLabel>
            <Textarea
              id="deskripsi_merchandise"
              onChange={formik.handleChange}
              value={formik.values.deskripsi_merchandise}
            />
            <FormErrorMessage>{formik.errors.deskripsi_merchandise}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!formik.errors.foto_merch}>
            <FormLabel htmlFor="deskripsi_merchandise">Gambar</FormLabel>
            {formik.values.foto_merch && <Image my={8} src={URL.createObjectURL(formik.values.foto_merch)} alt="merch" w={80} />}
            {!formik.values.foto_merch && formik.values.link_foto_merchandise && <Image my={8} src={formik.values.link_foto_merchandise} alt="merch" w={80} />}
            <Input
              type="file"
              id="foto"
              hidden
              accept="image/png, image/jpg, image/jpeg"
              onChange={(e) => {
                if (e.target.files !== null) {
                  formik.setFieldValue('foto_merch', e.target.files[0]);
                }
              }}
              name="foto_merch"
            />
            <Button as="label" colorScheme="teal" leftIcon={<Icon as={FaFileUpload} />} htmlFor="foto">Choose Image</Button>
            <FormErrorMessage>{formik.errors.foto_merch}</FormErrorMessage>
          </FormControl>
          <Flex
            w="full"
          >
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

export default MerchandiseForm;
