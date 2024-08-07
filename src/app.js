import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";

const app = express();
// middleware
const corseOptions = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
};
app.use(cors(corseOptions));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// route import
import userRouter from "./routes/user.routes.js";
// routes declearion
app.use("/api/v1/users", userRouter);

export { app };
