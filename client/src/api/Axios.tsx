import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { env } from "../config/config";

const baseURL = `${env.clientUrl}/api`;

const Axios = axios.create({
  baseURL,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
    "Access-Control-Allow-Credentials": true,
  },
  timeout: 1000,
  withCredentials: true,
});

Axios.interceptors.response.use(function (response: AxiosResponse) {
  const { data } = response;
  return data;
});

Axios.interceptors.request.use(function (config: AxiosRequestConfig) {
  return config;
});

export default Axios;
