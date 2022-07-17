interface ISelectData {
  mid: string;
  authToken: string;
  timestamp: number;
  signature: string;
  charset: string;
  format: string;
  result: boolean;
  oid: string;
}

export interface ISelectResult {
  result: boolean;
  msg: string | null;
  data: ISelectData | null;
  code: number;
}
