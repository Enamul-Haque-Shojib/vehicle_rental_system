import express from "express";
import { UserRoles } from "../Auth/Auth.constant";
import auth from "../../middleware/auth";
import { UserControllers } from "./User.controller";


const router = express.Router();

router.get("/", auth(UserRoles.admin), UserControllers.getAllUsers);
router.put("/:userId", auth(UserRoles.admin, UserRoles.customer), UserControllers.updateUser);
router.delete("/:userId", auth(UserRoles.admin), UserControllers.deleteUser);




export const UserRoutes = router;
