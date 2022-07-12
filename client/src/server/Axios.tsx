import axios, { AxiosResponse } from "axios";

const baseURL = `${process.env.REACT_APP_BASEURL}/api`;
console.log("baseURL===");
console.log(baseURL);
console.log(baseURL);

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

export default Axios;
