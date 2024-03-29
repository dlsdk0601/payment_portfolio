import { apiEndPoint } from "../config/config";
import Axios from "./Axios";
import {
  IKakaoReadyResponse,
  ISelectOrder,
  IPaymentRegisterReq,
  IPaymentRegisterRes,
  IKakaoPaymentRequset,
  IKakaoPayApproveReq, IKakaoPayApproveRes
} from "./Interface";

export const api = {
  // 결제 등록
  paymentRegister: async (
    body: IPaymentRegisterReq
  ): Promise<IPaymentRegisterRes> =>
    await Axios.post(apiEndPoint.inicisReady, body),

  selectPayHistory: async (oid: string): Promise<ISelectOrder> =>
    await Axios.get(`${apiEndPoint.selectInicisData}${oid}`),
  kakaopayRegister: async (body: IKakaoPaymentRequset): Promise<IKakaoReadyResponse> => await Axios.post(apiEndPoint.kakoPayReady, body),
  kakaopayApprove: async (body: IKakaoPayApproveReq): Promise<IKakaoPayApproveRes> => await Axios.post(apiEndPoint.kakaoApprove, body),
  inicisSubscriptionReady: async (body: IPaymentRegisterReq): Promise<IPaymentRegisterRes> => await Axios.post(apiEndPoint.inicisSubscriptionRead , body)
};
