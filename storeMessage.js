const axios = require("axios");

const API_SERVER_HOST = process.env.API_SERVER_HOST;

let SCHEME = "http";

if (process.env.API_SERVER_HOST_HTTPS) {
  SCHEME = "https";
}

async function storeMessage(message) {
  return axios.post(`${SCHEME}://${API_SERVER_HOST}/messages`, message);
}

module.exports = storeMessage;
