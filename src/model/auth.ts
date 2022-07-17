import { AxiosPromise } from "axios";
import { APIResponse } from "../types/apiResponse";
import { LoginDto, LoginResponse } from "../types/entities/auth";
import api from "../utils/api";

export const loginAdmin = (
  data: LoginDto
): AxiosPromise<APIResponse<LoginResponse>> => {
  return api.post("/admin/login", data);
};
