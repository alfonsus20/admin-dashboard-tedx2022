import {
  Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Heading, Icon, IconButton, Image, Input, Textarea, useToast, VStack
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { FaFileUpload, FaPlus, FaTrash } from 'react-icons/fa';
import useEffectOnce from '../hooks/useEffectOnce';
import useError from '../hooks/useError';
import { addBundle, editBundle, getBundleById } from '../models/bundle';
import { BundleDto } from '../types/entities/bundle';

const BundleForm = () => {
  const { id } = useParams<{ id : string }>();

  const isEditForm = !!id;

  const snackbar = useToast();
  const { handleError } = useError();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async (data : BundleDto) => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append('nama', data.nama);
      formData.append('harga', data.harga.toString());
      formData.append('deskripsi_bundle', data.deskripsi_bundle);
      formData.append('isi_bundle', data.isi_bundle.join(';'));

      if (data.foto_bundle) {
        formData.append('foto_bundle', data.foto_bundle);
      }

      if (isEditForm) {
        await editBundle(formData, +id!);
      } else {
        await addBundle(formData);
      }

      snackbar({
        title: 'SUCCESS',
        description: `Bundle was successfully ${isEditForm ? 'edited' : 'added'}`,
        status: 'success',
      });

      navigate('/dashboard/bundle');
    } catch (error) {
      handleError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const AddBundleSchema = useMemo(() => Yup.object({
    nama: Yup.string().required(),
    harga: Yup.number().positive().required(),
    deskripsi_bundle: Yup.string().required(),
    foto_bundle: isEditForm ? Yup.mixed().nullable() : Yup.mixed()
      .required()
      .test('fileSize', 'Maximum file size is 1 mb', (value) => {
        if (!value) {
          return true;
        }
        return value.size <= 5000000;
      }),
    link_foto_bundle: Yup.string().optional(),
    isi_bundle: Yup.array().of(Yup.string().required()).min(1)
  }), [isEditForm]);

  const formik = useFormik({
    initialValues: {
      nama: '',
      harga: '',
      deskripsi_bundle: '',
      foto_bundle: undefined,
      link_foto_bundle: '',
      isi_bundle: [''],
    },
    validationSchema: AddBundleSchema,
    onSubmit: handleSubmit,
    validateOnChange: false,
  });

  const handleFetch = async () => {
    try {
      const { data: { data } } = await getBundleById(+id!);
      formik.setValues({
        nama: data.nama,
        harga: data.harga.toString(),
        deskripsi_bundle: data.deskripsi_bundle,
        foto_bundle: undefined,
        link_foto_bundle: data.link_foto_bundle,
        isi_bundle: data.isi_bundle.split(';')
      });
    } catch (error) {
      handleError(error);
    }
  };

  const handleAddBundleContent = () => {
    formik.setValues({ ...formik.values, isi_bundle: [...formik.values.isi_bundle, ''] });
  };

  const handleChangeContent = (index : number, evt : React.ChangeEvent<HTMLInputElement>) => {
    const copiedContents = [...formik.values.isi_bundle];
    copiedContents[index] = evt.target.value;
    formik.setValues({ ...formik.values, isi_bundle: copiedContents });
  };

  const handleDeleteContent = (index : number) => {
    const copiedContents = [...formik.values.isi_bundle];
    copiedContents.splice(index, 1);
    formik.setValues({ ...formik.values, isi_bundle: copiedContents });
  };

  useEffectOnce(() => {
    if (isEditForm) {
      handleFetch();
    }
  });

  console.log(formik.errors.isi_bundle);

  return (
    <Box>
      <Heading fontSize="3xl" mb={12}>
        {isEditForm ? 'Edit ' : 'Add '}
        Bundle
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
          <FormControl isInvalid={!!formik.errors.deskripsi_bundle}>
            <FormLabel htmlFor="deskripsi_bundle">Deskripsi</FormLabel>
            <Textarea
              id="deskripsi_bundle"
              onChange={formik.handleChange}
              value={formik.values.deskripsi_bundle}
            />
            <FormErrorMessage>{formik.errors.deskripsi_bundle}</FormErrorMessage>
          </FormControl>
          {/* <FormControl isInvalid={!!formik.errors.deskripsi_bundle}> */}
          <FormControl w="full" isInvalid={typeof formik.errors.isi_bundle === 'string'}>
            <FormLabel htmlFor="deskripsi_bundle">Isi</FormLabel>
            <VStack spacing={4} mb={4} alignItems="stretch">
              {formik.values.isi_bundle.map((isi, index) => (
                <Flex key={index}>
                  <FormControl isInvalid={!!(Array.isArray(formik.errors.isi_bundle) && formik.errors.isi_bundle[index])} mr={4}>
                    <Input
                      id="harga"
                      onChange={(e) => handleChangeContent(index, e)}
                      value={isi}
                    />
                    <FormErrorMessage>{Array.isArray(formik.errors.isi_bundle) && formik.errors.isi_bundle[index]}</FormErrorMessage>
                  </FormControl>
                  {formik.values.isi_bundle.length > 1 && <IconButton icon={<Icon as={FaTrash} />} colorScheme="red" aria-label="remove" onClick={() => handleDeleteContent(index)} />}
                </Flex>
              ))}
            </VStack>
            <Button colorScheme="blue" leftIcon={<Icon as={FaPlus} />} size="sm" onClick={handleAddBundleContent}>Add Bundle Content</Button>
            {typeof formik.errors.isi_bundle === 'string' && <FormErrorMessage>{formik.errors.isi_bundle}</FormErrorMessage>}
          </FormControl>
          <FormControl isInvalid={!!formik.errors.foto_bundle}>
            <FormLabel htmlFor="deskripsi_bundle">Gambar</FormLabel>
            {formik.values.foto_bundle && <Image my={8} src={URL.createObjectURL(formik.values.foto_bundle)} alt="merch" w={80} />}
            {!formik.values.foto_bundle && formik.values.link_foto_bundle && <Image my={8} src={formik.values.link_foto_bundle} alt="merch" w={80} />}
            <Input
              type="file"
              id="foto"
              hidden
              accept="image/png, image/jpg, image/jpeg"
              onChange={(e) => {
                if (e.target.files !== null) {
                  formik.setFieldValue('foto_bundle', e.target.files[0]);
                }
              }}
              name="foto_bundle"
            />
            <Button as="label" colorScheme="teal" leftIcon={<Icon as={FaFileUpload} />} htmlFor="foto">Choose Image</Button>
            <FormErrorMessage>{formik.errors.foto_bundle}</FormErrorMessage>
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

export default BundleForm;
