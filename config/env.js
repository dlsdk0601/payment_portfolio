import dotenv from "dotenv";
import path from "path";

const __dirname = path.resolve();
dotenv.config({ path: path.join(__dirname, "./.env") });
const envConfig = {};

if (process.env.NODE_ENV !== "development") {
  envConfig.host = process.env.NODE_HOST;
  envConfig.serverPort = process.env.NODE_SERVERPORTNUMBER;
  envConfig.port = process.env.NODE_PORT;
  envConfig.baseURL = process.env.NODE_BASEURL;
}

export default envConfig;
