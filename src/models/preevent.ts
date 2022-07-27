import { AxiosPromise } from "axios";
import { APIResponse, APIResponsePaginated } from "../types/apiResponse";
import { Audience } from "../types/entities/preevent";
import { PaginationParams } from "../types/pagination";
import api from "../utils/api";

export const getAudienceList = ({
  page = 1,
  limit = 10,
}: PaginationParams): AxiosPromise<APIResponsePaginated<Audience>> => {
  return api.get("/audien/paginate", { params: { page, limit } });
};

export const getAudienceById = (
  id: number
): AxiosPromise<APIResponse<Audience>> => {
  return api.get(`/audien/data/${id}`);
};

export const deleteAudience = (id: number): AxiosPromise<APIResponse<null>> => {
  return api.delete(`/audien/${id}`);
};
