const axios = require("axios");

const API_SERVER_HOST = process.env.API_SERVER_HOST;

async function storeMessage(message) {
  return axios.post("http://" + API_SERVER_HOST + "/api/messages", message);
}

module.exports = storeMessage;
