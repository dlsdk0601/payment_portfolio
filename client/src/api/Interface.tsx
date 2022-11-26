export interface IDefaultResponse {
  result: boolean;
  msg: string | null;
}

export interface ISelectData {
  mid: string;
  authToken: string;
  timestamp: number;
  signature: string;
  charset: string;
  format: string;
  result: boolean;
  oid: string;
}

export interface ISelectResult extends IDefaultResponse {
  data: ISelectData | null;
  code: number;
}

export interface IKakaoPaymentRequset {
  buyerName: string;
  item_name: string;
  quantity: number;
  total_amount: number;
  tax_free_amount: number;
  cid: string;
  partner_order_id: string;
  partner_user_id: string;
  approval_url: string;
  cancel_url: string;
  fail_url: string;
}

export interface IKakaoReadyResponse extends IDefaultResponse {
  tid: string;
  next_redirect_mobile_url: string;
  next_redirect_pc_url: string;
}

export interface ISelectKakaoPayResponse extends IDefaultResponse {
  kakaoPayApproveUrl: string;
}

export interface IKakaoOrderSelectResponse extends IDefaultResponse {
  orderData: any | null;
}

interface Idata {
  tid: string;
  buyerName: string;
  goodName: string;
  totalPrice: string;
  paymethod: string;
  vactBankName: string | null;
  VACT_Date: string | null;
  VACT_Num: string | null;
}

export interface ISelectOrder {
  result: boolean;
  msg: string | null;
  data: Idata;
}

export interface IPaymentRegisterReq {
  buyername: string;
  buyertel: string;
  buyeremail: string;
  goodCount: number;
  gopaymethod: string;
  timeStamp: number;
  oid: string;
  goodName: string;
  totalPrice: number;
}

export interface IPaymentRegisterRes {
  result: boolean;
  msg: string;
}

