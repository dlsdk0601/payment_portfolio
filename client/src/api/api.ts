import { apiEndPoint } from "../config/config";
import Axios from "./Axios";
import { IPaymentData } from "./Interface";

export const api = {
  // 결제 등록
  paymentRegister: (body: IPaymentData) =>
    Axios.post(apiEndPoint.inicisReady, body),
};
