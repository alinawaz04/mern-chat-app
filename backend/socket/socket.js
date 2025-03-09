import { Server } from "socket.io";

const setupSocketServer = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const userSockets = new Map(); // { userId: socketId }

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // User connects and sends their userId for mapping
    socket.on("join", (userId) => {
      userSockets.set(userId, socket.id);
      console.log(`User ${userId} connected on socket ${socket.id}`);
    });

    // Handle new messages
    socket.on("sendMessage", ({ recipientId, message }) => {
      console.log("New message:", message);
      const recipientSocket = userSockets.get(recipientId);
      if (recipientSocket) {
        io.to(recipientSocket).emit("receiveMessage", message);
      }
    });

    // Handle typing event
    socket.on("typing", ({ from, to }) => {
      const recipientSocket = userSockets.get(to);
      if (recipientSocket) {
        io.to(recipientSocket).emit("userTyping", { from });
      }
    });
    socket.on("stopTyping", ({ from, to }) => {
      const recipientSocket = userSockets.get(to);
      if (recipientSocket) {
        io.to(recipientSocket).emit("userStoppedTyping", { from });
      }
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
      // Remove disconnected user from userSockets map
      for (const [userId, scoketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
          break;
        }
      }
    });
  });

  return io;
};

export default setupSocketServer;
