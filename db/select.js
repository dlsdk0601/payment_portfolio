import mariaDB from "./index.js";

const selectDBHandle = async (query) => {
  return new Promise((resolve, reject) => {
    mariaDB.query(query, (err, rows) => {
      if (err) {
        return resolve(false);
      }
      resolve(rows[0]);
    });
  });
};

export default selectDBHandle;
