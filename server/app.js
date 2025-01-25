import express from "express";
import dotenv from "dotenv"
import morgan from "morgan";
import cors from "cors";
import error from "./middleware/error.js";
import analyseRouter from "./routes/analyse.route.js";
dotenv.config();

export const app = express()

app.use(cors({ origin: "http://localhost:3000", credentials: true, }));

app.use(morgan("tiny"));
app.use(express.json());

app.use("/analyse", analyseRouter);
app.use(error)
