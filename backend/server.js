import express from "express";
import { config } from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import messageRoutes from "./routes/message.routes.js";
import connectToMongoDB from "./db/connectToMongoDB.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import setupSocketServer from "./socket/socket.js";

const PORT = process.env.PORT || 5001;

// loads .env file contents
config();
// init express application
const app = express();
const server = http.createServer(app);

// set up socket.io
const io = setupSocketServer(server);

// middleware for parsing incoming requests
app.use(express.json()); // parse incoming requests with JSON payloads (from req.body)
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// middleware for signup, login, logout routes
app.use("/api/auth", authRoutes);

// middleware for user routes
app.use("/api/user", userRoutes);

// middleware for message routes
app.use("/api/message", messageRoutes);

// app.get("/", (req, res) => {
//   // route route (http://localhost:8000/)
//   res.send("Server ready");
// });

// listens for connections
app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server running on port ${PORT}`);
});
