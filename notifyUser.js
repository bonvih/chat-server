const axios = require("axios");

const API_SERVER_HOST = process.env.API_SERVER_HOST;

let SCHEME = "http";

if (process.env.NODE_ENV && process.env.NODE_ENV === "production") {
  SCHEME = "https";
}

async function notifyUser(userID, message) {
  return axios.post(`${SCHEME}://${API_SERVER_HOST}/notify/chat-message`, {
    from: message.profile.ID.toString(),
    to: userID,
    message: message.text,
    proposition: message.proposition.ID.toString(),
  });
}

module.exports = notifyUser;
