import db from "mysql";
import dotenv from "dotenv";

dotenv.config();

// dbsetting
const mariaDB = db.createConnection({
  host: process.env.NODE_MARIA_HOST,
  port: process.env.NODE_MARIA_PORT,
  user: process.env.NODE_MARIA_USERNAME,
  password: process.env.NODE_MARIA_PASSWORD,
  database: process.env.NODE_MARIA_DBNAME,
});

export default mariaDB;
