import { apiEndPoint } from "../config/config";
import Axios from "./Axios";
import { paymentRegisterReq, paymentRegisterRes } from "./Interface";

export const api = {
  // 결제 등록
  paymentRegister: async (
    body: paymentRegisterReq
  ): Promise<paymentRegisterRes> =>
    await Axios.post(apiEndPoint.inicisReady, body),
};
