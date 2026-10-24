import axios from "axios";

export const PER_PAGE = 12;

const baseURL = process.env.NEXT_PUBLIC_API_URL + "/api";

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});
