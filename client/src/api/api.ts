import { apiEndPoint } from "../config/config";
import Axios from "./Axios";
import {
  ISelectOrder,
  paymentRegisterReq,
  paymentRegisterRes,
} from "./Interface";

export const api = {
  // 결제 등록
  paymentRegister: async (
    body: paymentRegisterReq
  ): Promise<paymentRegisterRes> =>
    await Axios.post(apiEndPoint.inicisReady, body),

  selectPayHistory: async (oid: string): Promise<ISelectOrder> =>
    await Axios.get(`${apiEndPoint.selectInicisData}${oid}`),
};
