import { AxiosPromise } from "axios";
import { APIResponse, APIResponsePaginated } from "../types/apiResponse";
import { StudentSpeaker } from "../types/entities/studentSpeaker";
import { PaginationParams } from "../types/pagination";
import api from "../utils/api";

export const getStudentSpeakers = ({
  page = 1,
  limit = 10,
}: PaginationParams): AxiosPromise<APIResponsePaginated<StudentSpeaker>> => {
  return api.get("/student-speaker", { params: { page, limit } });
};

export const getStudentSpeakerById = (
  id: number
): AxiosPromise<APIResponse<StudentSpeaker>> => {
  return api.get(`/student-speaker/id/${id}`);
};
