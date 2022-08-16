import { AxiosPromise } from 'axios';
import { APIResponse } from '../types/apiResponse';
import { Merchandise } from '../types/entities/merchandise';
import api from '../utils/api';
import publicApi from '../utils/publicApi';

export const getAllMerchandises = (): AxiosPromise<
APIResponse<Array<Merchandise>>
> => publicApi.get('/merch/data/all');

export const getMerchandiseById = (
  id: number
): AxiosPromise<APIResponse<Merchandise>> => publicApi.get(`/merch/data/${id}`);

export const deleteMerchandise = (
  id: number
): AxiosPromise<APIResponse<null>> => api.delete(`/merch/${id}`);

export const addMerchandise = (
  body: FormData
): AxiosPromise<APIResponse<null>> => api.post('/merch', body);

export const editMerchandise = (
  body: FormData,
  id: number
): AxiosPromise<APIResponse<null>> => api.put(`/merch/${id}`, body);
