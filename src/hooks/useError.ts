import { useToast } from '@chakra-ui/react';
import { AxiosError } from 'axios';
import { useUserContext } from '../context/UserContext';

function useError() {
  const snackbar = useToast();
  const { logout } = useUserContext();

  const handleError = (err: unknown, message: string = 'Terjadi Kesalahan') => {
    const errorMessage = err instanceof AxiosError ? err.response?.data.message : message;

    snackbar({
      title: errorMessage,
      status: 'error',
    });

    if (errorMessage === 'Invalid token') {
      logout();
    }
  };

  return { handleError };
}

export default useError;
