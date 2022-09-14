const dns = require("dns");
const { promisify } = require("util");

const resolveSrv = promisify(dns.resolveSrv);

const API_SERVER_HOST = process.env.API_SERVER_HOST;
const API_SERVICE_DOMAIN = process.env.API_SERVICE_DOMAIN;

let SCHEME = "http";

if (process.env.API_SERVER_HOST_HTTPS) {
  SCHEME = "https";
}

async function getApiServerConnectionParams() {
  let HOSTNAME = API_SERVER_HOST;

  if (API_SERVICE_DOMAIN) {
    try {
      const dnsResolutionResults = await resolveSrv(API_SERVICE_DOMAIN);

      const randomIndex = Math.floor(
        Math.random() * dnsResolutionResults.length
      );

      const apiContainerHostname = dnsResolutionResults[randomIndex].name;
      const apiContainerPort = dnsResolutionResults[randomIndex].port;

      if (!apiContainerHostname || !apiContainerPort) {
        throw new Error(
          "Could not get api-container hostname and/or port: Maybe check dnsResolutionResults"
        );
      }

      HOSTNAME = `${apiContainerHostname}:${apiContainerPort}`;
    } catch (error) {
      console.log(
        JSON.stringify({
          hint: true,
          throwingFunction: "getApiServerConnectionParams",
        })
      );
      throw error;
    }
  }

  return {
    SCHEME,
    HOSTNAME,
  };
}

module.exports = getApiServerConnectionParams;
