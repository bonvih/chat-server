const { Server } = require("socket.io")

function initServerWebSocket(serverHTTP) {
    const io = new Server(serverHTTP, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    })
    
    io.on("connection", (socket) => {            
        socket.on("set userID", (userID) => {
            updatePresence(userID, "online")

            if(!userID) {
                console.log("WebSocketServer")
                console.log("Event: set userID")
                console.log("Missing userID")
                console.log("\n")
                return
            }

            socket.userID = userID
        })

        socket.on("private message", async (message) => {
            try {
               await storeMessage(message)
               const sockets = await io.fetchSockets()

               const recipientID = message.recipientID+message.propositionID

               const recipientSocket = sockets.find(s => s.userID === recipientID)
                if (recipientSocket) {
                    socket.to(recipientSocket.id).emit("private message", message)
                } else {
                    console.log("WebSocketServer")
                    console.log("Event: private message")
                    console.log("Couldn't find " + recipientID + " socket")
                    console.log("\n")
                }

            } catch (error) {
                console.log("WebSocketServer")
                console.log("Event: private message")
                console.log("Error: ", error)
                console.log("\n")
            }
        })

        socket.on("typing", async (typing, toUserID) => {
            try {
                const sockets = await io.fetchSockets()
                const recipientSocket = sockets.find(s => s.userID === toUserID)
                if (recipientSocket) {
                    socket.to(recipientSocket.id).emit("typing", typing)
                } else {
                    console.log("WebSocketServer")
                    console.log("Event: typing")
                    console.log("Couldn't find " + toUserID + " socket")
                    console.log("\n")
                }
            } catch (error) {
                console.log("WebSocketServer")
                console.log("Event: typing")
                console.log("Error: ", error)
                console.log("\n")
            }
        })

        socket.on("disconnect", reason => {
            socket.to(socket.userID).emit("online status update", false)

            console.log("WebSocketServer")
            console.log("Event: Disconnect")
            console.log("UserID: ", socket.userID)
            console.log("Reason: ", reason)
            console.log("\n")

            updatePresence(socket.userID, "offline")
        })

        socket.on("join room", room => {
            socket.join(room)
        })

        socket.on("online status update", status => {
            socket.to(socket.userID).emit("online status update", status)
        })

        socket.on("online status enquiry", async (userID) => {
            try {
                const sockets = await io.fetchSockets()
                const recipientSocket = sockets.find(s => s.userID === userID)
                if (recipientSocket) {
                    io.to(socket.id).emit("online status update", true)
                } else {
                    io.to(socket.id).emit("online status update", false)
                }
            } catch (error) {
                console.log("WebSocketServer")
                console.log("Event: typing")
                console.log("Error: ", error)
                console.log("\n")
            }
        })
    })
}

async function storeMessage(message) {
    console.log("Storing message\n")
    return Promise.resolve("Message stored")
}

async function updatePresence(userID, status) {
    console.log("Updating user" + userID + " presence to " + status + "\n")
    return Promise.resolve("Presence updated")
}

module.exports = initServerWebSocket