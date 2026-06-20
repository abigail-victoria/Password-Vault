const CryptoJS = require("crypto-js");

const SECRET_KEY =
  process.env.ENCRYPTION_KEY;

function encryptPassword(password) {

  return CryptoJS.AES.encrypt(
    password,
    SECRET_KEY
  ).toString();

}

function decryptPassword(password) {

  const bytes = CryptoJS.AES.decrypt(
    password,
    SECRET_KEY
  );

  return bytes.toString(
    CryptoJS.enc.Utf8
  );
}

module.exports = {
  encryptPassword,
  decryptPassword
};