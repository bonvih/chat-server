const jwt = require("jsonwebtoken");

const jwtKey = process.env.JWT_SECRET_KEY;

function getApiServerAuthToken() {
  if (!jwtKey) {
    throw new Error("Missing JWT_SECRET_KEY environment variable");
  }

  const token = jwt.sign({ service: "chat" }, jwtKey, {
    algorithm: "HS256",
  });

  return token;
}

function isValidToken(token) {
  if (!jwtKey) {
    throw new Error("Missing JWT_SECRET_KEY environment variable");
  }

  if (!token) {
    return false;
  }

  try {
    jwt.verify(token, jwtKey);
    return true;
  } catch (error) {
    return false;
  }
}

module.exports = { getApiServerAuthToken, isValidToken };
