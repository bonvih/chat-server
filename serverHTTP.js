const express = require("express")
const {createServer} = require("http")
const cors = require("cors")
const WebServiceClient = require("@maxmind/geoip2-node").WebServiceClient

const geoipAccountID = '677568'
const geoipLicenseKey = 'UllpLex53WTHVtbd'

const geoipClient = new WebServiceClient(geoipAccountID, geoipLicenseKey)

const app = express()
app.use(cors())

app.get("/geoip", (req, res) => {
    const ip = req.query.ip

    if (!ip) {
        res.status(400).send("Missing ip")
        return
    }

    geoipClient.city(ip).then(response => {
        console.log(response)
        res.status(200).json(response)
    }).catch(error => {
        console.log(error)
        res.status(500).send("Internal server error")
    })
})

function initServerHTTP() {
    return createServer(app)
}

module.exports = initServerHTTP