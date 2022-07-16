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
    const dnsResolutionResults = await resolveSrv(API_SERVICE_DOMAIN);
    const apiContainerHostname = dnsResolutionResults.name;
    const apiContainerPort = dnsResolutionResults.port;

    if (!apiContainerHostname || !apiContainerPort) {
      throw new Error("Could not get api-container hostname and/or port");
    }

    HOSTNAME = `${apiContainerHostname}:${apiContainerPort}`;
  }

  return {
    SCHEME,
    HOSTNAME,
  };
}

module.exports = getApiServerConnectionParams;
