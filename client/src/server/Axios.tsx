import axios, { AxiosResponse } from "axios";

const baseURL =
  process.env.REACT_APP_BASEURL ||
  "https://paymentportfolio.herokuapp.com:8080";
  
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
