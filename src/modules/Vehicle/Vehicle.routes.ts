import express from "express";
import { VehicleControllers } from "./Vehicle.controller";
import { UserRoles } from "../Auth/Auth.constant";
import auth from "../../middleware/auth";


const router = express.Router();

router.post("/", auth(UserRoles.admin), VehicleControllers.createVehicle);
router.get("/", VehicleControllers.getAllVehicles);
router.get("/:vehicleId", VehicleControllers.getSingleVehicle);
router.put("/:vehicleId", auth(UserRoles.admin), VehicleControllers.updateVehicle);
router.delete("/:vehicleId", auth(UserRoles.admin), VehicleControllers.deleteVehicle);



export const VehicleRoutes = router;
