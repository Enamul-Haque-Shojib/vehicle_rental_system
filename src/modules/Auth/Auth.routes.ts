import express from "express";
import { AuthControllers } from "./Auth.controller";


const router = express.Router();

router.post("/signup", AuthControllers.createUser);
router.post("/signin", AuthControllers.loginUser);



export const AuthRoutes = router;
