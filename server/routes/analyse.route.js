import express from "express";
import { analyse } from "../controllers/analyse.controller.js";
import upload from "../middleware/upload.js";

const analyseRouter = express.Router();

analyseRouter.post("/", upload.single("plantImage"), analyse);

export default analyseRouter;
