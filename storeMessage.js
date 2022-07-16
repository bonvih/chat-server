const axios = require("axios");
const getApiServerConnectionParams = require("./getApiServerConnectionParams");

async function storeMessage(message) {
  const { SCHEME, HOSTNAME } = await getApiServerConnectionParams();

  return axios.post(`${SCHEME}://${HOSTNAME}/messages`, message);
}

module.exports = storeMessage;
