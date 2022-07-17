export type APIResponse<TData> = {
  message: string;
  data: TData;
  status: boolean;
};
