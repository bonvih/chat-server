const { Server } = require("socket.io")
const axios = require("axios")

function initServerWebSocket(serverHTTP) {
    const io = new Server(serverHTTP, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    })
    
    io.on("connection", (socket) => {
        socket.on("set_profile", profile => {
            socket.profile = profile
        })

        socket.on("join_room", room => {
            socket.join(room)
        })

        socket.on("private_message", async (message, room) => {
            try {
               const response = await storeMessage(message)

               socket.to(room).emit("private_message", message)
            } catch (error) {
                console.log("WebSocketServer")
                console.log("Event: private message")
                console.log("Error: ", error)
                console.log("\n")
            }
        })

        socket.on("typing", async (typing, room) => {
            socket.to(room).emit("typing", typing)
        })

        socket.on("disconnecting", () => {
            if (socket.profile) {
                if(socket.rooms.has(socket.profile.ID.toString())) {
                    socket.rooms.forEach(room => {
                        socket.to(room).emit("online_status", false)
                    })
                }
            }
        })

        socket.on("online_status", (status) => {
            socket.rooms.forEach(room => {
                socket.to(room).emit("online_status", status)
            })
        })

        socket.on("get_online_status", async (profileID) => {
            try {
                const sockets = await io.fetchSockets()

                const foundSocket = sockets.find(s => {
                    if (s.profile) {
                       return s.profile.ID.toString() === profileID
                    }
                    return false;
                })
                
                if (foundSocket) {
                    io.to(socket.id).emit("online_status", true)
                } else {
                    io.to(socket.id).emit("online_status", false)
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
    return axios.post("http://192.168.1.69:4000/api/messages", message)
}

module.exports = initServerWebSocket