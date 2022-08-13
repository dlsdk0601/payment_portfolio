import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const baseURL = `${
  process.env.REACT_APP_BASEURL || "http://192.168.200.161:5000"
}/api`;

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
