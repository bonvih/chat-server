const axios = require("axios");

const API_SERVER_HOST = process.env.API_SERVER_HOST;

async function notifyUser(userID, message) {
  return axios.post("http://" + API_SERVER_HOST + "/api/notify/chat-message", {
    from: message.profile.ID.toString(),
    to: userID,
    message: message.text,
    proposition: message.proposition.ID.toString(),
  });
}

module.exports = notifyUser;
