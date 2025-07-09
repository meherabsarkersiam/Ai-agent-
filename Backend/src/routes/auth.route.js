import { Router } from "express";   
import { register } from "../controllers/resisteruser.controller.js";  
import { login } from "../controllers/loginuser.controller.js";  
import { logout } from "../controllers/logout.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

export default router