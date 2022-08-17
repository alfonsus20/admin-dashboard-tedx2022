import { AxiosPromise } from 'axios';
import { APIResponse } from '../types/apiResponse';
import { Bundle } from '../types/entities/bundle';
import api from '../utils/api';
import publicApi from '../utils/publicApi';

export const getAllBundles = (): AxiosPromise<
APIResponse<Array<Bundle>>
> => publicApi.get('/bundle/data/all');

export const getBundleById = (id: number): AxiosPromise<APIResponse<Bundle>> => publicApi.get(`/bundle/data/${id}`);

export const deleteBundle = (id: number): AxiosPromise<APIResponse<null>> => api.delete(`/bundle/${id}`);

export const addBundle = (body: FormData): AxiosPromise<APIResponse<null>> => api.post('/bundle', body);

export const editBundle = (
  body: FormData,
  id: number
): AxiosPromise<APIResponse<null>> => api.put(`/bundle/${id}`, body);
