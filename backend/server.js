import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import connectDB from "./config/connectDb.js";
import authRoutes from "./routes/auth.routes.js";
// import userRoutes from "./routes/user.routes.js";
// import astrologerRoutes from "./routes/astrologer.routes.js";
import errorMiddleware from "./middleware/error.middleware.js";
import userRouter from "./routes/user.routes.js";
import cookieParser from "cookie-parser";

dotenv.config();
connectDB();

const app = express();
 
app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:3000", // Your frontend origin
  credentials: true               // 🔑 Allow cookies to be sent
}));
   
app.use("/api/auth", authRoutes);
app.use("/api/user", userRouter);
// app.use("/api/astrologer", astrologerRoutes);

app.get("/", (req, res) => {
  res.send("\u272e Astrology Backend is Running...");
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found from server.js'});
});

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`\uD83D\uDE80 Server running on http://localhost:${PORT}`));
