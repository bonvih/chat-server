const initServerHTTP = require("./serverHTTP")
const initServerWebSocket = require("./serverWebSocket")

const serverHTTP = initServerHTTP()
initServerWebSocket(serverHTTP)

const port = 5000

serverHTTP.listen(port, () => {
    console.log("Ready to accept requests...")
})