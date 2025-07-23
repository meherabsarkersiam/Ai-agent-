import express from "express";
import { getprofile } from "../controllers/profile.controller.js";

const router = express.Router();

router.get("/",getprofile)

export default router