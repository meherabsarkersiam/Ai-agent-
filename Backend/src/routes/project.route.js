import express from "express";
import { adduser, deleteproject, getprojects, projectcontroller } from "../controllers/project.controller.js";

const router = express.Router();

router.post("/create",projectcontroller)
router.get("/getprojects",getprojects)
router.put("/adduser/",adduser)
router.delete("/delete/:id",deleteproject)
export default router