const { createServer } = require("http");
const { Server } = require("socket.io");
const storeMessage = require("./storeMessage");
const notifyUser = require("./notifyUser");

let PORT = 80;

if (!process.env.NODE_ENV) {
  PORT = 5000;
  console.log("Environment: development");
} else {
  console.log(`Environment: ${process.env.NODE_ENV}`);
}

const httpServer = createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify("Hello from chat server!"));
});

const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("set_profile", (profile) => {
    socket.profile = profile;
  });

  socket.on("join_room", (room) => {
    socket.join(room);
  });

  socket.on("private_message", async (message, otherUserID, room) => {
    try {
      await storeMessage(message);

      // Other user is chatting with me ?
      if (io.sockets.adapter.rooms.get(room).size > 1) {
        socket.to(room).emit("private_message", message);
      } else {
        await notifyUser(otherUserID, message);
      }
    } catch (error) {
      handleError(socket, "private_message", error);
    }
  });

  socket.on("typing", async (typing, room) => {
    socket.to(room).emit("typing", typing);
  });

  socket.on("disconnecting", () => {
    if (socket.profile) {
      if (socket.rooms.has(socket.profile.ID.toString())) {
        socket.rooms.forEach((room) => {
          socket.to(room).emit("online_status", false);
        });
      }
    }
  });

  socket.on("online_status", (status) => {
    socket.rooms.forEach((room) => {
      socket.to(room).emit("online_status", status);
    });
  });

  socket.on("get_online_status", async (profileID) => {
    try {
      const sockets = await io.fetchSockets();

      const foundSocket = sockets.find((s) => {
        if (s.profile) {
          return s.profile.ID.toString() === profileID;
        }
        return false;
      });

      if (foundSocket) {
        io.to(socket.id).emit("online_status", true);
      } else {
        io.to(socket.id).emit("online_status", false);
      }
    } catch (error) {
      handleError(socket, "get_online_status", error);
    }
  });
});

function handleError(socket, eventName, error) {
  console.log("Event: ", eventName);
  console.log("Error: ", error);

  socket.emit("internal_server_error");
}

httpServer.listen(PORT);
