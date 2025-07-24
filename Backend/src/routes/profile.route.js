import express from "express";
import { getid, getprofile } from "../controllers/profile.controller.js";

const router = express.Router();

router.get("/",getprofile)
router.get("/getcurrentuserid",getid)

export default router