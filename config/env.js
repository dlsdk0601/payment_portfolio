import dotenv from "dotenv";
import path from "path";

const __dirname = path.resolve();

if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: path.join(__dirname, "./.env.development") });
} else {
  dotenv.config({ path: path.join(__dirname, "./.env.production") });
}

export default {
  hostname: process.env.NODE_HOST,
  apiPort: process.env.NODE_SERVERPORTNUMBER,
  port: process.env.NODE_PORT,
  baseurl: process.env.NODE_BASEURL,
};
