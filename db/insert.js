import mariaDB from "./index.js";

const insertDBHandle = async (query, params) => {
  return new Promise((resolve, reject) => {
    mariaDB.query(query, params, (err, result) => {
      if (err) {
        return resolve(false);
      }
      resolve(true);
    });
  });
};

export default insertDBHandle;
