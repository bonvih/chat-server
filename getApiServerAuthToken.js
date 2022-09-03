const jwt = require("jsonwebtoken");

function getApiServerAuthToken() {
  const jwtKey = process.env.JWT_SECRET_KEY;

  if (!jwtKey) {
    throw new Error("Missing JWT_SECRET_KEY environment variable");
  }

  const token = jwt.sign({ service: "chat" }, jwtKey, {
    algorithm: "HS256",
  });

  return token;
}

module.exports = getApiServerAuthToken;
