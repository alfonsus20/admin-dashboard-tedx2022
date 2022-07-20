export type APIResponse<TData> = {
  message: string;
  data: TData;
  status: boolean;
};

export type APIResponsePaginated<TData> = APIResponse<{
  count: number;
  rows: TData[];
}>;
