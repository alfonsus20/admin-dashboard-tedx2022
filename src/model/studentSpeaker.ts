import { AxiosPromise } from "axios";
import { APIResponse } from "../types/apiResponse";
import { StudentSpeaker } from "../types/entities/studentSpeaker";
import { PaginationParams } from "../types/pagination";
import api from "../utils/api";

export const getStudentSpeakers = ({
  page = 1,
  limit = 10,
}: PaginationParams): AxiosPromise<APIResponse<Array<StudentSpeaker>>> => {
  return api.get("/student-speaker/data", { params: { page, limit } });
};
