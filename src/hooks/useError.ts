import { useToast } from "@chakra-ui/react";
import { AxiosError } from "axios";

function useError() {
  const snackbar = useToast();
  const handleError = (err: unknown, message: string = "Terjadi Kesalahan") => {
    snackbar({
      title: err instanceof AxiosError ? err.response?.data.message : message,
      status: "error",
    });
  };

  return { handleError };
}

export default useError;
