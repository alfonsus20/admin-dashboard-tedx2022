import { AxiosPromise } from 'axios';
import { APIResponse, APIResponsePaginated } from '../types/apiResponse';
import { Ticket } from '../types/entities/ticket';
import { Visitor } from '../types/entities/visitor';
import { PaginationParams } from '../types/pagination';
import api from '../utils/api';
import publicApi from '../utils/publicApi';

export const getVisitorList = ({
  page = 1,
  limit = 10,
}: PaginationParams): AxiosPromise<APIResponsePaginated<Visitor>> => api.get('/visitor/paginate', { params: { page, limit } });

export const getVisitorById = (id: string): AxiosPromise<APIResponse<Visitor>> => api.get(`/visitor/${id}`);

export const getAllVisitor = (): AxiosPromise<APIResponse<Array<Visitor>>> => api.get(`/visitor/`);

export const getAllTicket = (): AxiosPromise<APIResponse<Array<Ticket>>> => publicApi.get(`/ticket/`);

export const verifyVisitor = (id: string): AxiosPromise<APIResponse<null>> => api.put(`/visitor/${id}`, {});