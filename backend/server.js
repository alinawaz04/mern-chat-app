import express from "express";
import { config } from "dotenv";
import authRoutes from "./routes/auth.routes.js";

// loads .env file contents
config();

const PORT = process.env.PORT || 8000;

// init express application
const app = express();

app.get("/", (req, res) => {
  // route route (http://localhost:8000/)
  res.send("Server ready");
});

// middleware for signup, login, logout routes
app.use("/api/auth", authRoutes);

// listens for connections
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
