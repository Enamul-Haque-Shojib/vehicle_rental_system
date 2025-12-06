import express, { Request, Response } from "express";
import config from "./config";
import initDB from "./config/db";
import { AuthRoutes } from "./modules/Auth/Auth.routes";
import { VehicleRoutes } from "./modules/Vehicle/Vehicle.routes";
import { BookingRoutes } from "./modules/Booking/Booking.routes";
import { UserRoutes } from "./modules/User/User.routes";



const app = express();

app.use(express.json());

initDB();


app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Server is Running!!",
    path: req.path
  });
});


app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/vehicles", VehicleRoutes);
app.use("/api/v1/bookings", BookingRoutes);


app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

export default app;
