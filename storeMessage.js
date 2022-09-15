const axios = require("axios");
const getApiServerConnectionParams = require("./getApiServerConnectionParams");

async function storeMessage(message, authToken) {
  const { SCHEME, HOSTNAME } = await getApiServerConnectionParams();

  return axios.post(`${SCHEME}://${HOSTNAME}/messages`, message, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });
}

module.exports = storeMessage;
