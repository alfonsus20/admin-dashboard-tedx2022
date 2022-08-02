import { AxiosPromise } from 'axios';
import { APIResponse, APIResponsePaginated } from '../types/apiResponse';
import { Audience } from '../types/entities/preevent';
import { PaginationParams } from '../types/pagination';
import api from '../utils/api';

export const getAudienceList = ({
  page = 1,
  limit = 10,
}: PaginationParams): AxiosPromise<APIResponsePaginated<Audience>> => api.get('/audien/paginate', { params: { page, limit } });

export const getAllAudience = (): AxiosPromise<APIResponse<Audience[]>> => api.get('/audien/data/all');

export const getAudienceById = (
  id: number
): AxiosPromise<APIResponse<Audience>> => api.get(`/audien/data/${id}`);

export const deleteAudience = (id: number): AxiosPromise<APIResponse<null>> => api.delete(`/audien/${id}`);
