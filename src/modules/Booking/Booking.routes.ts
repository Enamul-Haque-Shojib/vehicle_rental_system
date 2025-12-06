import express from "express";

import { BookingControllers } from "./Booking.controller";
import auth from "../../middleware/auth";
import { UserRoles } from "../Auth/Auth.constant";


const router = express.Router();

router.post("/", auth(UserRoles.admin, UserRoles.customer), BookingControllers.createBooking);
router.get("/", auth(UserRoles.admin, UserRoles.customer), BookingControllers.getAllBookings);
router.put("/:bookingId", auth(UserRoles.admin, UserRoles.customer), BookingControllers.updateBooking);




export const BookingRoutes = router;
