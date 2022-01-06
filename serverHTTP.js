const express = require("express")
const {createServer} = require("http")

const app = express()

function initServerHTTP() {
    return createServer(app)
}

module.exports = initServerHTTP