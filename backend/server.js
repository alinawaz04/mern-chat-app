import express from "express";
import { config } from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import connectToMongoDB from "./db/connectToMongoDB.js";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 5001;
// init express application
const app = express();

// loads .env file contents
config();

app.use(express.json()); // parse incoming requests with JSON payloads (from req.body)
app.use(cookieParser());

// middleware for signup, login, logout routes
app.use("/api/auth", authRoutes);

// app.get("/", (req, res) => {
//   // route route (http://localhost:8000/)
//   res.send("Server ready");
// });

// listens for connections
app.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server running on port ${PORT}`);
});
