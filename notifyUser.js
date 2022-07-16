const axios = require("axios");
const getApiServerConnectionParams = require("./getApiServerConnectionParams");

async function notifyUser(userID, message) {
  const { SCHEME, HOSTNAME } = await getApiServerConnectionParams();

  return axios.post(`${SCHEME}://${HOSTNAME}/notify/chat-message`, {
    from: message.profile.ID.toString(),
    to: userID,
    message: message.text,
    proposition: message.proposition.ID.toString(),
  });
}

module.exports = notifyUser;
