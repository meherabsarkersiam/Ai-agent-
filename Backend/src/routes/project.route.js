import express from "express";
import { adduser, deleteproject, getprojects, projectcontroller, projectdetails, deleteuser } from "../controllers/project.controller.js";

const router = express.Router();

router.post("/create",projectcontroller)
router.get("/getprojects",getprojects)
router.put("/adduser/:id",adduser)
router.put("/deleteuser/:id", deleteuser)
router.delete("/delete/:id",deleteproject)
router.get("/getproject/:id",projectdetails)
export default router