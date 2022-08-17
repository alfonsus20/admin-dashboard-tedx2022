import { AxiosPromise } from 'axios';
import { APIResponse } from '../types/apiResponse';
import { Sponsor } from '../types/entities/sponsor';
import api from '../utils/api';
import publicApi from '../utils/publicApi';

export const getAllSponsors = (): AxiosPromise<APIResponse<Array<Sponsor>>> => publicApi.get('/sponsor/all');

export const deleteSponsor = (id: number): AxiosPromise<APIResponse<null>> => api.delete(`/sponsor/${id}`);

export const addSponsor = (body: FormData): AxiosPromise<APIResponse<null>> => api.post('/sponsor', body);
