export const apiEndPoint = {
  inicisReady: "/inicis/ready",
  selectInicisData: "/inicis/select?oid=",
};

export const url = {
  localServer: "http://localhost:5000",
  localClient: "http://localhost:3000",
};

export const env = {
  clientUrl: process.env.REACT_APP_BASEURL ?? url.localClient,
};
