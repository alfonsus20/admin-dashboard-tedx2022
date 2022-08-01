import { AxiosPromise } from 'axios';
import { APIResponse, APIResponsePaginated } from '../types/apiResponse';
import { StudentSpeaker } from '../types/entities/studentSpeaker';
import { PaginationParams } from '../types/pagination';
import api from '../utils/api';

export const getStudentSpeakers = ({
  page = 1,
  limit = 10,
}: PaginationParams): AxiosPromise<APIResponsePaginated<StudentSpeaker>> => api.get('/student-speaker', { params: { page, limit } });

export const getStudentSpeakerById = (
  id: number
): AxiosPromise<APIResponse<StudentSpeaker>> => api.get(`/student-speaker/id/${id}`);

export const deleteStudentSpeaker = (
  id: number
): AxiosPromise<APIResponse<null>> => api.delete(`/student-speaker/${id}`);
