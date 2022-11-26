import { apiEndPoint } from "../config/config";
import Axios from "./Axios";
import {
  IKakaoReadyResponse,
  ISelectOrder,
  IPaymentRegisterReq,
  IPaymentRegisterRes,
  IKakaoPaymentRequset
} from "./Interface";

export const api = {
  // 결제 등록
  paymentRegister: async (
    body: IPaymentRegisterReq
  ): Promise<IPaymentRegisterRes> =>
    await Axios.post(apiEndPoint.inicisReady, body),

  selectPayHistory: async (oid: string): Promise<ISelectOrder> =>
    await Axios.get(`${apiEndPoint.selectInicisData}${oid}`),
  kakaopayRegister: async (body: IKakaoPaymentRequset): Promise<IKakaoReadyResponse> => await Axios.post(apiEndPoint.kakoPayReady, body)
};
