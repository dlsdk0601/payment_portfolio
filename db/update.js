import mariaDB from "./index.js";

const updateDBHandle = async (query, params) => {
  return new Promise((resolve, reject) => {
    mariaDB.query(query, params, (err, result) => {
      if (err) {
        console.log(err);
        return resolve(false);
      }
      resolve(true);
    });
  });
};

export default updateDBHandle;
