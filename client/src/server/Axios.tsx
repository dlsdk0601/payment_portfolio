import axios, { AxiosResponse } from "axios";

const baseURL = "https://paymentportfolio.herokuapp.com/api";

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
  const { data, status } = response;

  return data;
});

export default Axios;
